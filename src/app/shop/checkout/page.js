'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import { createOrder, checkInventoryAvailability, getUserDetails, addNewAddress, deleteAddress } from './actions';
import { getLocationByPincode } from '@/lib/postal-service';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryIssues, setInventoryIssues] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (formData) => {
    if (!cart.items.length) {
      toast.error('Your cart is empty');
      router.push('/shop/cart');
      return;
    }

    setIsLoading(true);
    try {
      // Need to write an action in ./actions.js to update user details first
      // First check inventory availability
      const inventoryCheck = await checkInventoryAvailability(cart.items);
      
      if (!inventoryCheck.success) {
        toast.error(inventoryCheck.message);
        return;
      }

      if (!inventoryCheck.isAvailable) {
        setInventoryIssues(inventoryCheck.unavailableItems);
        toast.error('Some items in your cart are no longer available');
        return;
      }

      // Calculate totals
      const subtotal = cart.totalAmount;
      const shipping = subtotal >= 1000 ? 0 : 100;
      const total = subtotal + shipping;

      // Create order
      const result = await createOrder({
        ...formData,
        items: cart.items,
        subtotal,
        shipping,
        total
      });

      if (result.success) {
        // Redirect to payment page
        router.push(`/shop/payment?orderIds=${result.orderIds.join(',')}`);
      } else {
        toast.error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals for display
  const subtotal = cart.totalAmount;
  const shipping = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shipping;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const result = await getUserDetails();
      console.log('User details in fetchUserDetails:', result);
      if (result.success) {
        // Set user details
        setValue('buyerName', result.userDetails.name);
        setValue('buyerEmail', result.userDetails.email);
        if (result.userDetails.phone) setValue('buyerPhone', result.userDetails.phone);
        
        // Set saved addresses
        if (result.userDetails.addresses && result.userDetails.addresses.length > 0) {
          setSavedAddresses(result.userDetails.addresses);
          // Select the first address by default
          setSelectedAddressId(result.userDetails.addresses[0]._id);
        } else {
          setShowNewAddressForm(true);
        }
      }
    };
    fetchUserDetails();
  }, [setValue]);

  // Watch for selected address changes
  useEffect(() => {
    if (selectedAddressId && !showNewAddressForm) {
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        setValue('shippingAddress', selectedAddress.address);
        setValue('shippingCity', selectedAddress.city);
        setValue('shippingState', selectedAddress.state);
        setValue('shippingPincode', selectedAddress.pincode);
      }
    }
  }, [selectedAddressId, savedAddresses, setValue, showNewAddressForm]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleAddNewAddressClick = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    // Clear address fields
    setValue('shippingAddress', '');
    setValue('shippingCity', '');
    setValue('shippingState', '');
    setValue('shippingPincode', '');
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setSavedAddresses(prev => prev.filter(addr => addr._id !== addressId));
        toast.success('Address deleted successfully');
        if (selectedAddressId === addressId) {
          if (savedAddresses.length > 1) {
            setSelectedAddressId(savedAddresses[0]._id);
          } else {
            setShowNewAddressForm(true);
            setSelectedAddressId(null);
          }
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  // Watch pincode field for changes
  const pincode = watch('shippingPincode');

  // Fetch location details when pincode changes
  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (pincode?.length === 6) {
        const result = await getLocationByPincode(pincode);
        if (result.success) {
          setValue('shippingCity', result.data.city);
          setValue('shippingState', result.data.state);
        } else {
          toast.error(result.message);
          // Clear city and state if pincode is invalid
          setValue('shippingCity', '');
          setValue('shippingState', '');
        }
      }
    };
    fetchLocationDetails();
  }, [pincode, setValue]);

  return (
    <div className="min-h-screen py-4 mb-48">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Show inventory issues if any */}
          {inventoryIssues && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                Inventory Issues Found
              </h2>
              <ul className="space-y-2">
                {inventoryIssues.map((item) => (
                  <li key={item.productId} className="flex justify-between items-center text-red-600">
                    <span>{item.name}</span>
                    <span className="text-sm">
                      {item.availableQuantity === 0 
                        ? 'Out of stock' 
                        : `Only ${item.availableQuantity} available`}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/shop/cart')}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Return to cart to update quantities
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...register('buyerName', { required: 'Name is required' })}
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                  />
                  {errors.buyerName && <p className="mt-1 text-sm text-red-600">{errors.buyerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    {...register('buyerPhone', { 
                      required: 'Phone is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                  />
                  {errors.buyerPhone && <p className="mt-1 text-sm text-red-600">{errors.buyerPhone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register('buyerEmail', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                  />
                  {errors.buyerEmail && <p className="mt-1 text-sm text-red-600">{errors.buyerEmail.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((address) => (
                      <div 
                        key={address._id}
                        className={`p-4 border rounded-lg cursor-pointer relative ${
                          selectedAddressId === address._id ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleAddressSelect(address._id)}
                      >
                        <div className="pr-8">
                          <p className="font-medium">{address.address}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                          <p className="text-sm text-gray-600">{address.pincode}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Button */}
              <button
                type="button"
                onClick={handleAddNewAddressClick}
                className="inline-flex items-center px-4 py-2 border border-rose-300 text-sm font-medium rounded-md text-rose-700 bg-white hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Address
              </button>

              {/* Address Form */}
              {showNewAddressForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      {...register('shippingAddress', { required: 'Address is required' })}
                      rows={3}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                    />
                    {errors.shippingAddress && <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      {...register('shippingPincode', { 
                        required: 'PIN Code is required',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: 'Please enter a valid 6-digit PIN code'
                        }
                      })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                      placeholder="Enter 6-digit PIN code"
                    />
                    {errors.shippingPincode && <p className="mt-1 text-sm text-red-600">{errors.shippingPincode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      {...register('shippingCity', { required: 'City is required' })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                      readOnly
                    />
                    {errors.shippingCity && <p className="mt-1 text-sm text-red-600">{errors.shippingCity.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      {...register('shippingState', { required: 'State is required' })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-rose-500 transition-colors duration-200 focus:outline-none"
                      readOnly
                    />
                    {errors.shippingState && <p className="mt-1 text-sm text-red-600">{errors.shippingState.message}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item._id} className="py-4 flex items-center">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="ml-4 text-base font-medium text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
                
                <div className="py-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{subtotal}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>Shipping</p>
                    <p>{shipping === 0 ? 'Free' : `₹${shipping}`}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                    <p>Total</p>
                    <p>₹{total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || inventoryIssues}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  isLoading || inventoryIssues
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Checking availability...
                  </div>
                ) : inventoryIssues ? (
                  'Update cart to proceed'
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
