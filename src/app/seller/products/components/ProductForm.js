'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { uploadProductImage } from '../actions';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '@/constants/product';
import { useAIAssist } from '@/lib/hooks/useAIAssist';
import RichTextEditor, { RichTextEditorStyles } from '@/app/components/RichTextEditor';
import { convertToWebP } from '@/lib/img-to-webp';
import ProductImageUpload from './ProductImageUpload';

const MAX_IMAGES = 5;

export default function ProductForm({ 
  product, 
  onSubmit, 
  submitButtonText = 'Save Product',
  isSubmitting = false 
}) {
  const [uploadingImages, setUploadingImages] = useState(new Set());
  const [images, setImages] = useState(product?.images || []);
  const [fullDescription, setFullDescription] = useState(product?.description?.full || '');
  const [aiGuidance, setAiGuidance] = useState('');
  const [showAiGuidanceInput, setShowAiGuidanceInput] = useState(false);
  const router = useRouter();
  const { 
    generateProductContent, 
    getJobResult, 
    checkJobStatus,
    reset,
    jobResult 
  } = useAIAssist();

  useEffect(() => {
    console.log('ProductForm: Full Description Initial Value', product?.description?.full);
    console.log('ProductForm: Full Description State', fullDescription);
  }, [product?.description?.full, fullDescription]);

  useEffect(() => {
    if (jobResult) {
      // Dismiss any existing toasts
      toast.dismiss();

      // Update form fields with AI-generated content
      if (jobResult) {
        // Update product name if suggested
        if (jobResult.suggestedName) {
          document.getElementById('name').value = jobResult.suggestedName;
          toast.success('Generated product name based on image analysis');
        }

        // Update category if detected
        if (jobResult.detectedCategory) {
          const categorySelect = document.getElementById('category');
          categorySelect.value = jobResult.detectedCategory;
          toast.success(`Detected category: ${jobResult.detectedCategory} (${jobResult.categoryConfidence})`);
        }

        // Update descriptions
        document.getElementById('shortDescription').value = jobResult.shortDescription;
        
        // Set full description in state
        setFullDescription(jobResult.fullDescription || '');
        
        // Update materials if detected
        if (jobResult.suggestedMaterials?.length > 0) {
          document.getElementById('material').value = jobResult.suggestedMaterials[0];
        }

        // Update size if detected
        if (jobResult.suggestedSize) {
          document.getElementById('size').value = jobResult.suggestedSize;
        }
        
        // Update tags and keywords
        document.getElementById('tags').value = jobResult.seoKeywords.join(', ');
        document.getElementById('searchKeywords').value = jobResult.seoKeywords.join(', ');
        
        // Update colors if detected
        if (jobResult.colors?.length > 0) {
          document.getElementById('colors').value = jobResult.colors.join(', ');
        }

        // Update patterns if detected
        if (jobResult.patterns?.length > 0) {
          document.getElementById('patterns').value = jobResult.patterns.join(', ');
        }

        // Reset the hook state to prevent re-triggering
        reset();

        toast.success('AI suggestions applied successfully!');
      }
    }
  }, [jobResult, reset]);

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);

    // Convert files to WebP
    const webPFiles = await Promise.all(files.map(convertToWebP));
    
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    for (const file of webPFiles) {
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
  
  // Handle image reordering
  function handleImageReorder(newImages) {
    setImages(newImages);
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
      // Reset any previous job state
      reset();

      // Initiate AI content generation with user guidance if provided
      await generateProductContent(images.map(img => img.url), aiGuidance);
      
      // Hide the guidance input after submission
      setShowAiGuidanceInput(false);
      
      // Show loading toast
      toast.loading('Generating product details...', {
        description: 'This may take a few moments.'
      });
    } catch (error) {
      console.error('AI assistance failed:', error);
      toast.error('Failed to generate AI suggestions. Please try again.');
    }
  };
  
  const toggleAiGuidanceInput = () => {
    setShowAiGuidanceInput(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Product Images */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-row justify-between items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">Product Images</h2>
          {images.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={toggleAiGuidanceInput}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                AI Assist
              </button>
              
              {showAiGuidanceInput && (
                <div className="absolute right-0 mt-2 w-64 sm:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-3 sm:p-4 z-10">
                  <div className="mb-3">
                    <label htmlFor="aiGuidance" className="block text-sm font-medium text-gray-700 mb-1">
                      Guidance for AI (Optional)
                    </label>
                    <textarea
                      id="aiGuidance"
                      name="aiGuidance"
                      rows="3"
                      value={aiGuidance}
                      onChange={(e) => setAiGuidance(e.target.value)}
                      placeholder="Provide keywords to guide the AI. E.g: 'Baby blanket, soft wool, winter.'" 
                      className="p-2 shadow-sm focus:ring-rose-500 focus:outline-none block w-full text-sm border border-rose-300 hover:border-rose-300 focus:border-rose-400 rounded-md transition-colors duration-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Add specific details to help the AI generate more accurate descriptions.
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      type="button" 
                      onClick={toggleAiGuidanceInput}
                      className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAIAssist}
                      className="px-3 py-1.5 text-sm text-white bg-rose-600 border border-transparent rounded-md shadow-sm hover:bg-rose-700"
                    >
                      Generate Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <ProductImageUpload
          images={images}
          removeImage={removeImage}
          handleImageChange={handleImageChange}
          uploadingImages={uploadingImages}
          MAX_IMAGES={MAX_IMAGES}
          onReorder={setImages}
        />
        <p className="text-sm text-gray-500">
          Upload up to {MAX_IMAGES} images. First image will be the main product image.
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            id="shortDescription"
            rows={4}
            required
            defaultValue={product?.description?.short}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            placeholder="Brief summary of your product (shown in listings)"
          />
        </div>

        <div>
          <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Full Description
          </label>
          <div className="border rounded-md">
            <RichTextEditor
              key={`rich-text-editor-${fullDescription}`}
              value={fullDescription}
              onChange={(content) => {
                setFullDescription(content);
              }}
              className="mt-1"
            />
          </div>
          <input 
            type="hidden" 
            name="fullDescription" 
            value={fullDescription} 
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="searchKeywords" className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold">Pricing and Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price (Optional)
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
                defaultValue={product?.salePrice || ''}
                className="block w-full pl-7 pr-12 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Multi-pack pricing toggle */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                id="isMultiPack"
                name="isMultiPack"
                type="checkbox"
                defaultChecked={product?.isMultiPack || false}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label htmlFor="isMultiPack" className="ml-2 block text-sm text-gray-700">
                This product is sold in multi-packs (e.g., set of scrunchies, coasters)
              </label>
            </div>
          </div>
          
          {/* Multi-pack fields */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="packSize" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pieces in Pack
              </label>
              <input
                type="number"
                name="packSize"
                id="packSize"
                min="1"
                defaultValue={product?.packSize || '1'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
              <p className="mt-1 text-sm text-gray-500">How many pieces come in one pack?</p>
            </div>
            
            <div>
              <label htmlFor="pricePerPiece" className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Piece (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="pricePerPiece"
                  id="pricePerPiece"
                  min="0"
                  defaultValue={product?.pricePerPiece || ''}
                  className="block w-full pl-7 pr-12 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Will be calculated automatically if left empty</p>
            </div>
          </div>

          <div>
            <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity in Stock
            </label>
            <input
              type="number"
              name="stockCount"
              id="stockCount"
              required
              min="0"
              defaultValue={product?.inventory?.stockCount}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center w-full sm:w-auto">
                <input
                  type="checkbox"
                  name="allowBackorders"
                  id="allowBackorders"
                  defaultChecked={product?.inventory?.allowBackorder}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowBackorders" className="ml-2 block text-sm text-gray-700">
                  Allow Made-to-Order
                </label>
              </div>
              <div className="flex items-center w-full sm:w-auto">
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
            <div id="madeToOrderSection" className="mt-2">
              <label htmlFor="madeToOrderDays" className="block text-sm font-medium text-gray-700 mb-1">
                Made-to-Order Days
              </label>
              <input
                type="number"
                name="madeToOrderDays"
                id="madeToOrderDays"
                min="1"
                defaultValue={product?.inventory?.madeToOrderDays || 7}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500">Days needed to create made-to-order items when stock is depleted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="patterns" className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <div className="flex flex-col sm:flex-row gap-2">
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t">
        <div className="flex items-center w-full sm:w-auto">
          <select
            name="status"
            defaultValue={product?.status || 'draft'}
            className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option value="draft">Save as Draft</option>
            <option value="active">Publish Now</option>
          </select>
        </div>

        <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploadingImages.size > 0}
            className="w-full sm:w-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
      <RichTextEditorStyles />
    </form>
  );
}