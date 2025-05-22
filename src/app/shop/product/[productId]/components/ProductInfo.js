'use client';

import { useState, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingCart, Heart, Package, Ruler, Palette, Award, Clock, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/app/components/CartProvider';
import Link from 'next/link';
import ShareButton from './ShareButton';
import { getProductVariants } from '@/app/shop/actions';
import useSWR from 'swr';

export default function ProductInfo({ product, initialReviews }) {
  const [productUrl, setProductUrl] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  // Initialize with the correct price - use sale price if available, otherwise regular price
  const [currentPrice, setCurrentPrice] = useState(product.salePrice || product.price);
  const [hasSelection, setHasSelection] = useState(true); // Default to true, will update after variants are fetched
  
  // Fetch variants using SWR
  const { data: variants = [], error: variantsError, isLoading: isLoadingVariants } = useSWR(
    `/api/products/${product._id}/variants`,
    () => getProductVariants(product._id),
    { suspense: false, revalidateOnFocus: false }
  );
  
  // Get the current URL for sharing and update hasSelection based on variants
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProductUrl(window.location.href);
    }
    
    // Update hasSelection based on variants availability
    // if (variants && variants.length > 0) {
    //   console.log("variants", variants)
    //   console.log("variants.length", variants.length)
    //   console.log("has no selections")
    //   setHasSelection(false); // If variants exist, require a selection
    // }
  }, [variants]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [stockQuantity, setStockQuantity] = useState(product.inventory?.stockCount || 0);
  const allowBackorder = product.inventory?.allowBackorder || false;
  const madeToOrderDays = product.inventory?.madeToOrderDays || 7;
  
  // Get current cart quantity for this product and variant
  const currentQuantityInCart = cart.items.find(item => {
    if (selectedVariant) {
      return item._id === product._id && item.variantId === selectedVariant._id;
    }
    return item._id === product._id && !item.variantId;
  })?.quantity || 0;
  
  // Calculate remaining stock based on selected variant or base product
  const variantStock = selectedVariant ? selectedVariant.stockCount : stockQuantity;
  const remainingStock = variantStock - currentQuantityInCart;
  
  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setHasSelection(true); // User has made a selection
    
    // Update price and stock based on variant
    // If product has a sale price, apply the adjustment to the sale price
    // Otherwise apply it to the regular price
    const basePrice = product.salePrice || product.price;
    setCurrentPrice(basePrice + (variant?.price_adjustment || 0));
    setStockQuantity(variant?.stockCount || product.inventory?.stockCount || 0);
    
    // If variant has an image, notify the gallery component to show it
    if (variant?.image) {
      // Use a custom event to communicate with the gallery component
      const event = new CustomEvent('variant-image-selected', { 
        detail: { 
          variantImage: variant.image,
          variantId: variant._id
        }
      });
      window.dispatchEvent(event);
    } else {
      // Reset to default product images
      const event = new CustomEvent('variant-image-selected', { 
        detail: { variantImage: null }
      });
      window.dispatchEvent(event);
    }
  };
  
  // Reset to base product
  const resetToBaseProduct = () => {
    setSelectedVariant(null);
    setHasSelection(true); // User has selected the base product
    setCurrentPrice(product.salePrice || product.price); // Use sale price if available
    setStockQuantity(product.inventory?.stockCount || 0);
    
    // Reset to default product images using a specific event for base product
    const event = new CustomEvent('base-product-selected');
    window.dispatchEvent(event);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= remainingStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    // If variants exist but no selection has been made, show an error
    if (variants.length > 0 && !hasSelection) {
      toast.error('Please select an option');
      return;
    }
    
    if (remainingStock < quantity && !allowBackorder) {
      toast.error(`Only ${remainingStock} items available`);
      return;
    }
    
    // If made-to-order is allowed but there's not enough stock, show a made-to-order message
    if (remainingStock < quantity && allowBackorder) {
      toast.info(`${quantity - remainingStock} item(s) will be made to order and delivered in ${madeToOrderDays} days`);
    }

    // Prepare the product data for the cart
    const productToAdd = {
      ...product,
      finalPrice: currentPrice, // Use the current price which includes variant adjustments
      baseOptionName: product.baseOptionName || 'Original', // Include the base option name
      // Explicitly ensure sellerId is included - critical for checkout
      sellerId: product.sellerId
    };
    
    // Add variant information if a variant is selected
    if (selectedVariant) {
      productToAdd.variant = selectedVariant;
      productToAdd.variantId = selectedVariant._id;
      
      // If the variant has an image, include it
      if (selectedVariant.image) {
        productToAdd.variantImage = selectedVariant.image;
      }
    }

    const result = await addToCart(productToAdd, quantity);
    
    if (result.success) {
      // Success is already handled by the CartProvider
    } else {
      toast.error('Failed to add to cart');
    }  
    setQuantity(1); // Reset quantity after successful add
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="space-y-8 p-4">
      {/* Title and Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
            Handmade
          </span>
          {stockQuantity <= 5 && stockQuantity > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Only {stockQuantity} left
            </span>
          )}
          {stockQuantity === 0 && allowBackorder && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Made to Order ({madeToOrderDays} days)
            </span>
          )}
          {remainingStock !== null && remainingStock < stockQuantity && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {remainingStock} available to add
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        
        {/* Seller and Rating */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {(product.averageRating || 0).toFixed(1)}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            By <Link href={`/creators/${product.sellerId}`} className="font-medium text-gray-900 hover:text-rose-600 transition-colors">{product.sellerName}</Link>
          </span>
        </div>
      </div>

      {/* Price and Stock */}
      <div className="mt-6 space-y-4">
        {/* Price display */}
        <div className="flex items-center gap-3">
          {/* Display the current price (which includes variant adjustments if any) */}
          <span className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentPrice)}
          </span>
          
          {/* If there's a sale, show the original price with strikethrough */}
          {product.salePrice && !selectedVariant && (
            <span className="text-xl text-gray-500 line-through">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
            </span>
          )}
          
          {/* If a variant is selected and there's a price adjustment, show the base product price */}
          {selectedVariant && selectedVariant.price_adjustment !== 0 && (
            <span className="text-xl text-gray-500 line-through">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.salePrice || product.price)}
            </span>
          )}
          
          {product.isMultiPack && product.packSize > 1 && (
            <span className="text-sm text-gray-500">
              ({product.packSize} items, {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.pricePerPiece)} each)
            </span>
          )}
          
          {/* No base price display - just show the current price */}
        </div>
        
        {/* Variants Selection */}
        {variants && variants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Options</h3>
            
            {isLoadingVariants ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-rose-600 mr-2" />
                <span className="text-sm text-gray-500">Loading options...</span>
              </div>
            ) : variantsError ? (
              <p className="text-sm text-red-500">Error loading options</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {/* Base product option */}
                <button
                  type="button"
                  onClick={resetToBaseProduct}
                  disabled={stockQuantity === 0 && !allowBackorder}
                  className={`px-4 py-2 rounded-md text-sm font-medium border ${!selectedVariant 
                    ? 'border-rose-600 bg-rose-50 text-rose-700' 
                    : stockQuantity === 0 && !allowBackorder
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <span className="mr-1 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {product.baseOptionName || 'Original'}
                  </div>
                  {stockQuantity <= 5 && stockQuantity > 0 && (
                    <span className="ml-1 text-xs text-amber-600">({stockQuantity} left)</span>
                  )}
                  {stockQuantity === 0 && (
                    <span className="ml-1 text-xs text-red-600">(Out of stock)</span>
                  )}
                </button>
                
                {/* Variant options */}
                {variants.map(variant => (
                  <button
                    key={variant._id}
                    type="button"
                    onClick={() => handleVariantSelect(variant)}
                    disabled={variant.stockCount === 0 && !allowBackorder}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${selectedVariant?._id === variant._id 
                      ? 'border-rose-600 bg-rose-50 text-rose-700' 
                      : variant.stockCount === 0 && !allowBackorder
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      {variant.image && (
                        <span className="mr-1 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {variant.name}
                    </div>
                    {variant.price_adjustment > 0 && (
                      <span className="ml-1 text-xs">+{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(variant.price_adjustment)}</span>
                    )}
                    {variant.price_adjustment < 0 && (
                      <span className="ml-1 text-xs">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(variant.price_adjustment)}</span>
                    )}
                    {variant.stockCount <= 5 && variant.stockCount > 0 && (
                      <span className="ml-1 text-xs text-amber-600">({variant.stockCount} left)</span>
                    )}
                    {variant.stockCount === 0 && (
                      <span className="ml-1 text-xs text-red-600">(Out of stock)</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Stock Status */}
        <div className="mt-2 flex items-center text-sm">
          {stockQuantity > 0 ? (
            <span className="text-green-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              In Stock
            </span>
          ) : allowBackorder ? (
            <span className="text-amber-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Made to Order ({madeToOrderDays} days delivery)
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Quick Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Ruler className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Size</p>
            <p className="text-sm text-gray-500">{product.size}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Palette className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Material</p>
            <p className="text-sm text-gray-500">{product.material}</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="space-y-4">
        {remainingStock > 0 && (
          <div className="flex items-center gap-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={`p-2 rounded-full ${
                  quantity <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-gray-900 text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= remainingStock && !allowBackorder}
                className={`p-2 rounded-full ${
                  quantity >= remainingStock && !allowBackorder
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stock status */}
        <div className="mt-4">
          {remainingStock > 0 ? (
            <p className="text-sm text-gray-500">
              {remainingStock < 5 ? `Only ${remainingStock} left in stock!` : 'In stock'}
            </p>
          ) : allowBackorder ? (
            <p className="text-sm text-amber-500">Made to order - will be delivered in {madeToOrderDays} days</p>
          ) : (
            <p className="text-sm text-red-500">Out of stock</p>
          )}
        </div>

        {/* Add to cart, wishlist, and share buttons */}
        <div className="mt-4 flex space-x-4">
          {console.log("remainingStock", remainingStock)}
          {console.log("allowBackorder", allowBackorder)}
          {console.log("variants", variants)}
          {console.log("hasSelection", hasSelection)}
          {console.log("(remainingStock < 1 && !allowBackorder)", remainingStock < 1 && !allowBackorder)}
          {console.log("(variants.length > 0 && !hasSelection)", variants.length > 0 && !hasSelection)}
          <button
            onClick={handleAddToCart}
            disabled={(remainingStock < 1 && !allowBackorder) || (variants.length > 0 && !hasSelection)}
            className={`flex-1 flex items-center justify-center px-8 py-3 rounded-md text-base font-medium ${(
              remainingStock < 1 && !allowBackorder) || (variants.length > 0 && !hasSelection)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {remainingStock < 1 && allowBackorder ? 'Order Now (Made to Order)' : 'Add to Cart'}
          </button>
          <button
            onClick={toggleWishlist}
            className={`p-3 rounded-md border ${
              isWishlisted
                ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
          
          {/* Share Button */}
          <ShareButton product={product} url={productUrl} />
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Handcrafted Quality</h3>
              <p className="mt-1 text-sm text-gray-500">Each piece is carefully made by skilled artisans</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Made to Order</h3>
              <p className="mt-1 text-sm text-gray-500">Custom-made with attention to detail</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-pink-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Satisfaction Guaranteed</h3>
              <p className="mt-1 text-sm text-gray-500">Love it or return it within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Short Description */}
      {product.description?.short && (
        <div className="border-t border-gray-200 pt-8">
          <p className="text-base text-gray-600">{product.description.short}</p>
        </div>
      )}
    </div>
  );
}
