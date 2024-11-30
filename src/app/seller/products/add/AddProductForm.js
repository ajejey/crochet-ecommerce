'use client';

import { useEffect, useState } from 'react';
import { createProduct, uploadProductImage } from '../actions';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCT_CATEGORIES } from '@/constants/product';

const MAX_IMAGES = 5;

export default function AddProductForm({ product }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(new Set());
  const [images, setImages] = useState([]);
  const router = useRouter();

  console.log("product ", product)

  console.log("product._doc.name ", product._doc.name)

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      // Add all image URLs and IDs
      formData.append('imageUrls', JSON.stringify(images.map(img => img.url)));
      formData.append('imageIds', JSON.stringify(images.map(img => img.id)));

      const result = await createProduct(formData);

      console.log("CREATED PRODUCT ", result)

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Product created successfully!');
        router.refresh(); // Refresh the products list data
        router.push('/seller/products');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    for (const file of files) {
      // Show preview immediately
      const reader = new FileReader();
      const imageId = Math.random().toString(36).substring(7);
      setUploadingImages(prev => new Set([...prev, imageId]));

      try {
        // Create preview
        const previewUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        // Add temporary preview
        setImages(prev => [...prev, {
          id: imageId,
          url: previewUrl,
          isUploading: true
        }]);

        // Upload to Appwrite
        const formData = new FormData();
        formData.append('image', file);
        const result = await uploadProductImage(formData);

        if (result.error) {
          toast.error(result.error);
          setImages(prev => prev.filter(img => img.id !== imageId));
        } else {
          setImages(prev => prev.map(img =>
            img.id === imageId
              ? { id: result.fileId, url: result.fileUrl, isUploading: false }
              : img
          ));
          toast.success('Image uploaded successfully!');
        }
      } catch (error) {
        toast.error('Failed to upload image');
        setImages(prev => prev.filter(img => img.id !== imageId));
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    }
  };

  const handleRemoveImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={product?._doc?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Cute Crochet Bear"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              id="category"
              required
              defaultValue={product?._doc?.category}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={product?._doc?.description}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe your product in detail..."
          />
        </div>
      </div>

      {/* Pricing and Inventory */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Pricing & Inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                defaultValue={product?._doc?.price}
                required
                min="0"
                step="0.01"
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              defaultValue={product?._doc?.inventory?.stockCount}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="10"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              id="sku"
              defaultValue={product?._doc?.inventory?.sku}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="BEAR-001"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="allowBackorders"
              id="allowBackorders"
              defaultChecked={product?._doc?.inventory?.allowBackorder}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allowBackorders" className="ml-2 block text-sm text-gray-700">
              Allow backorders when out of stock
            </label>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Product Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
            <input
              type="text"
              name="material"
              id="material"
              required
              defaultValue={product?._doc?.material}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Cotton yarn, Wool blend"
            />
            <p className="mt-1 text-sm text-gray-500">Specify the main material used</p>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
            <input
              type="text"
              name="size"
              id="size"
              required
              defaultValue={product?._doc?.size}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 12 inches, Medium, 30x40 cm"
            />
            <p className="mt-1 text-sm text-gray-500">Specify the size or dimensions</p>
          </div>
        </div>

        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700">Materials Used</label>
          <input
            type="text"
            name="materials"
            id="materials"
            defaultValue={product?._doc?.specifications?.materials?.join(', ')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Cotton yarn, Safety eyes, Polyester filling (comma-separated)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dimensions</label>
            <div className="mt-1 grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  name="length"
                  placeholder="Length"
                  min="0"
                  step="0.1"
                  defaultValue={product?._doc?.specifications?.dimensions?.length}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="width"
                  placeholder="Width"
                  min="0"
                  step="0.1"
                  defaultValue={product?._doc?.specifications?.dimensions?.width}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="height"
                  placeholder="Height"
                  min="0"
                  step="0.1"
                  defaultValue={product?._doc?.specifications?.dimensions?.height}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              name="dimensionUnit"
              defaultValue={product?._doc?.specifications?.dimensions?.unit}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <input
                type="number"
                name="weight"
                placeholder="Weight"
                min="0"
                step="0.1"
                defaultValue={product?._doc?.specifications?.weight?.value}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                name="weightUnit"
                defaultValue={product?._doc?.specifications?.weight?.unit}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="g">Grams (g)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Customization Options</h2>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="customizationAvailable"
              id="customizationAvailable"
              defaultChecked={product?._doc?.customizationOptions?.length > 0}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="customizationAvailable" className="ml-2 block text-sm text-gray-700">
              Allow customization options
            </label>
          </div>

          <div className="mt-3">
            <label htmlFor="customizationOptions" className="block text-sm font-medium text-gray-700">
              Customization Options (comma-separated)
            </label>
            <input
              type="text"
              name="customizationOptions"
              id="customizationOptions"
              defaultValue={product?._doc?.customizationOptions?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Color, Size, Custom text"
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Product Images</h2>
          <span className="text-sm text-gray-500">
            {images.length}/{MAX_IMAGES} images
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Existing Images */}
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              {image.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {images.length < MAX_IMAGES && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingImages.size > 0 || isSubmitting}
                />
              </label>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Upload up to {MAX_IMAGES} images. First image will be the main product image.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImages.size > 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating Product...
            </>
          ) : uploadingImages.size > 0 ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Uploading Images...
            </>
          ) : (
            'Create Product'
          )}
        </button>
      </div>
    </form>
  );
}