'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { uploadProductImage } from '../actions';
import { PRODUCT_CATEGORIES } from '@/constants/product';

const MAX_IMAGES = 5;

export default function ProductForm({ 
  product, 
  onSubmit, 
  submitButtonText = 'Save Product',
  isSubmitting = false 
}) {
  const [uploadingImages, setUploadingImages] = useState(new Set());
  const [images, setImages] = useState(product?.images || []);
  const router = useRouter();

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      // Add to uploading set
      setUploadingImages(prev => new Set([...prev, file.name]));

      try {
        const result = await uploadProductImage(formData);
        console.log('Upload result:', result); // Debug log
        
        if (result.error) {
          toast.error(result.error);
          continue;
        }

        if (!result.fileUrl || !result.fileId) {
          toast.error('Invalid response from image upload');
          continue;
        }

        setImages(prev => [...prev, { 
          url: result.fileUrl, 
          id: result.fileId,
          name: file.name 
        }]);

      } catch (error) {
        console.error('Image upload error:', error); // Debug log
        toast.error('Failed to upload image');
      } finally {
        // Remove from uploading set
        setUploadingImages(prev => {
          const next = new Set(prev);
          next.delete(file.name);
          return next;
        });
      }
    }
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    try {
      const formData = new FormData(e.target);
      // Add all image URLs and IDs
      formData.append('imageUrls', JSON.stringify(images.map(img => img.url)));
      formData.append('imageIds', JSON.stringify(images.map(img => img.id)));
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save product');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Images */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Images</label>
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
              {uploadingImages.size > 0 ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : (
                <Plus className="w-6 h-6 text-gray-400" />
              )}
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Upload up to {MAX_IMAGES} images. First image will be the main product image.
        </p>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            defaultValue={product?.name}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            defaultValue={product?.price}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="salePrice" className="block text-sm font-medium">
            Sale Price (Optional)
          </label>
          <input
            type="number"
            name="salePrice"
            id="salePrice"
            min="0"
            step="0.01"
            defaultValue={product?.salePrice}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            defaultValue={product?.category}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select a category</option>
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="material" className="block text-sm font-medium">
            Material
          </label>
          <input
            type="text"
            name="material"
            id="material"
            required
            defaultValue={product?.material}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium">
            Size
          </label>
          <input
            type="text"
            name="size"
            id="size"
            required
            defaultValue={product?.size}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="stockCount" className="block text-sm font-medium">
            Quantity in Stock
          </label>
          <input
            type="number"
            name="stockCount"
            id="stockCount"
            min="0"
            required
            defaultValue={product?.inventory?.stockCount || 0}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            defaultValue={product?.description}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImages.size > 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Saving...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}