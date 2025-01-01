'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { uploadProductImage } from '../actions';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '@/constants/product';
import { useAIAssist } from '@/lib/hooks/useAIAssist';

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
  const { generateProductContent, isGenerating, error: aiError } = useAIAssist();

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

  const handleAIAssist = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one product image first');
      return;
    }

    try {
      const result = await generateProductContent(images.map(img => img.url));

      // Update form fields with AI-generated content
      if (result) {
        // Update product name if suggested
        if (result.suggestedName) {
          document.getElementById('name').value = result.suggestedName;
          toast.success('Generated product name based on image analysis');
        }

        // Update category if detected
        if (result.detectedCategory) {
          const categorySelect = document.getElementById('category');
          categorySelect.value = result.detectedCategory;
          toast.success(`Detected category: ${result.detectedCategory} (${result.categoryConfidence})`);
        }

        // Update descriptions
        document.getElementById('shortDescription').value = result.shortDescription;
        document.getElementById('fullDescription').value = result.fullDescription;
        
        // Update materials if detected
        if (result.suggestedMaterials?.length > 0) {
          document.getElementById('material').value = result.suggestedMaterials[0];
        }

        // Update size if detected
        if (result.suggestedSize) {
          document.getElementById('size').value = result.suggestedSize;
        }
        
        // Update tags and keywords
        document.getElementById('tags').value = result.seoKeywords.join(', ');
        document.getElementById('searchKeywords').value = result.seoKeywords.join(', ');
        
        // Update colors if detected
        if (result.colors?.length > 0) {
          document.getElementById('colors').value = result.colors.join(', ');
        }

        // Update patterns if detected
        if (result.patterns?.length > 0) {
          document.getElementById('patterns').value = result.patterns.join(', ');
        }

        toast.success('AI suggestions applied successfully!');
      }
    } catch (error) {
      console.error('AI assistance failed:', error);
      toast.error('Failed to generate AI suggestions. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Product Images */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Product Images</h2>
          {images.length > 0 && (
            <button
              type="button"
              onClick={handleAIAssist}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                'AI Assist'
              )}
            </button>
          )}
        </div>
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

      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={product?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="Cute Crochet Bear"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              id="category"
              required
              defaultValue={product?.category}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            id="shortDescription"
            rows={2}
            required
            defaultValue={product?.description?.short}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="Brief summary of your product (shown in listings)"
          />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700">
            Full Description
          </label>
          <textarea
            name="fullDescription"
            id="fullDescription"
            rows={4}
            required
            defaultValue={product?.description?.full}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="Detailed description of your product..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={product?.tags?.join(', ')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="amigurumi, baby, gift (comma-separated)"
          />
          <p className="mt-1 text-sm text-gray-500">Add tags to help buyers find your product</p>
        </div>

        <div>
          <label htmlFor="searchKeywords" className="block text-sm font-medium text-gray-700">
            Search Keywords
          </label>
          <input
            type="text"
            name="searchKeywords"
            id="searchKeywords"
            defaultValue={product?.metadata?.searchKeywords?.join(', ')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="handmade, crochet toy, stuffed animal (comma-separated)"
          />
          <p className="mt-1 text-sm text-gray-500">Additional keywords to improve search visibility</p>
        </div>
      </div>

      {/* Pricing and Inventory */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Pricing and Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Regular Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                defaultValue={product?.price}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Enter price in Indian Rupees (₹)</p>
          </div>

          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
              Sale Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="salePrice"
                id="salePrice"
                min="0"
                step="0.01"
                defaultValue={product?.salePrice}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Optional. Must be less than regular price.</p>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity in Stock
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              required
              min="0"
              defaultValue={product?.inventory?.stockCount}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              name="lowStockThreshold"
              id="lowStockThreshold"
              min="0"
              defaultValue={product?.inventory?.lowStockThreshold || 5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              defaultValue={product?.inventory?.sku}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowBackorders"
                id="allowBackorders"
                defaultChecked={product?.inventory?.allowBackorder}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowBackorders" className="ml-2 block text-sm text-gray-700">
                Allow Backorders
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                defaultChecked={product?.featured}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700">
              Material
            </label>
            <input
              type="text"
              name="material"
              id="material"
              required
              defaultValue={product?.material}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="Cotton yarn, Wool blend"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <input
              type="text"
              name="size"
              id="size"
              required
              defaultValue={product?.size}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="12 inches, Medium"
            />
          </div>

          <div>
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
              Available Colors
            </label>
            <input
              type="text"
              name="colors"
              id="colors"
              defaultValue={product?.specifications?.colors?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="Red, Blue, Green (comma-separated)"
            />
          </div>

          <div>
            <label htmlFor="patterns" className="block text-sm font-medium text-gray-700">
              Available Patterns
            </label>
            <input
              type="text"
              name="patterns"
              id="patterns"
              defaultValue={product?.specifications?.patterns?.join(', ')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="Striped, Floral, Plain (comma-separated)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="length" className="block text-xs text-gray-500">Length</label>
              <input
                type="number"
                name="length"
                id="length"
                min="0"
                step="0.1"
                defaultValue={product?.specifications?.dimensions?.length}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-xs text-gray-500">Width</label>
              <input
                type="number"
                name="width"
                id="width"
                min="0"
                step="0.1"
                defaultValue={product?.specifications?.dimensions?.width}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-xs text-gray-500">Height</label>
              <input
                type="number"
                name="height"
                id="height"
                min="0"
                step="0.1"
                defaultValue={product?.specifications?.dimensions?.height}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  min="0"
                  step="0.1"
                  defaultValue={product?.specifications?.weight?.value}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  placeholder="Enter weight"
                />
              </div>
              <div className="w-24">
                <select
                  name="weightUnit"
                  id="weightUnit"
                  defaultValue={product?.specifications?.weight?.unit || 'g'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="g">Grams</option>
                  <option value="oz">Ounces</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex items-center">
          <select
            name="status"
            defaultValue={product?.status || 'draft'}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option value="draft">Save as Draft</option>
            <option value="active">Publish Now</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploadingImages.size > 0}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Saving...
              </>
            ) : uploadingImages.size > 0 ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Uploading Images...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </div>
    </form>
  );
}