'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Plus, X, Loader2, RotateCw, RotateCcw, Crop, Maximize2, Check, AlertCircle, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProductImage } from '../actions';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable image item component
const SortableImageItem = ({ image, index, onRemove, onImageClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id || image.fileId || `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
    touchAction: 'none', // Critical for mobile drag to work properly
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative w-24 h-24 group"
    >
      <Image
        src={image.url}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover rounded-lg cursor-pointer"
        onClick={() => onImageClick(image, index)}
      />
      <button
        type="button"
        onClick={(e) => onRemove(image, index, e)}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
      >
        <X className="w-4 h-4 text-white" />
      </button>
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity cursor-grab active:cursor-grabbing rounded-lg"
        style={{ touchAction: 'none' }} /* This is critical for mobile drag to work */
      >
        <GripVertical className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 sm:opacity-50 transition-opacity" />
      </div>
      {index === 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-rose-600 text-white text-[10px] text-center py-0.5">
          Main
        </div>
      )}
    </div>
  );
};

// Draggable image item for the overlay
const DraggableImageItem = ({ image, index }) => {
  return (
    <div className="relative w-24 h-24 shadow-xl rounded-lg" style={{ touchAction: 'none' }}>
      <Image
        src={image.url}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover rounded-lg"
      />
      {index === 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-rose-600 text-white text-[10px] text-center py-0.5">
          Main
        </div>
      )}
    </div>
  );
};

const ProductImageUpload = ({ images, removeImage, handleImageChange, uploadingImages, MAX_IMAGES, onReorder }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [cropCoordinates, setCropCoordinates] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cropStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [draggedImage, setDraggedImage] = useState(null);

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // For pointer devices (mouse, touch, pen)
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    }),
    // TouchSensor is still included as a fallback for devices that might not support pointer events well
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Short delay for touch devices
        tolerance: 8, // Increased tolerance for touch devices
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Create stable item IDs for sortable context
  const itemIds = useMemo(() => {
    return images.map((image, index) => 
      image.id || image.fileId || `image-${index}`
    );
  }, [images]);

  const openImageDialog = (image, index) => {
    setSelectedImage({ ...image, index });
    setRotation(0);
    setIsCropping(false);
  };
  
  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Find the dragged image
    const index = itemIds.indexOf(active.id);
    setDraggedImage({ ...images[index], index });
  };
  
  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      
      // Call the parent component's reorder function with the new array
      if (onReorder) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        onReorder(newImages);
        
        // Show toast notification for main image change if relevant
        if (oldIndex === 0 || newIndex === 0) {
          toast.success(newIndex === 0 
            ? 'New main product image set' 
            : 'Main product image changed');
        }
      }
    }
    
    // Reset state
    setActiveId(null);
    setDraggedImage(null);
  };

  const closeImageDialog = () => {
    setSelectedImage(null);
    setRotation(0);
    setIsCropping(false);
  };
  
  const confirmDeleteImage = (image, index, e) => {
    e.stopPropagation();
    setImageToDelete({ image, index });
    setShowDeleteConfirm(true);
  };
  
  const cancelDeleteImage = () => {
    setImageToDelete(null);
    setShowDeleteConfirm(false);
  };
  
  const handleDeleteImage = async () => {
    if (!imageToDelete) return;
    
    const { image, index } = imageToDelete;
    setIsDeleting(true);
    
    try {
      // Delete from cloud storage
      if (image.id || image.fileId) {
        const imageId = image.id || image.fileId;
        const result = await deleteProductImage(imageId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
      }
      
      // Remove from local state
      removeImage(index);
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    }
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const toggleCropMode = () => {
    setIsCropping(!isCropping);
    if (!isCropping) {
      setCropCoordinates({ x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleCropStart = (e) => {
    if (!isCropping) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cropStartRef.current = { x, y };
    setCropCoordinates({ x, y, width: 0, height: 0 });
  };

  const handleCropMove = (e) => {
    if (!isCropping || !cropStartRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropCoordinates({
      x: Math.min(cropStartRef.current.x, x),
      y: Math.min(cropStartRef.current.y, y),
      width: Math.abs(x - cropStartRef.current.x),
      height: Math.abs(y - cropStartRef.current.y)
    });
  };

  const handleCropEnd = () => {
    if (!isCropping) return;
    // In a real implementation, we would apply the crop here
    // For now, we'll just log the crop coordinates
    console.log('Crop coordinates:', cropCoordinates);
    
    // TODO: Implement actual image cropping functionality
    // This would involve creating a canvas, drawing the image with the crop,
    // and converting it back to a file
  };

  const applyEdits = () => {
    // TODO: Implement actual image editing functionality
    // This would involve creating a canvas, applying transformations,
    // and converting it back to a file
    
    closeImageDialog();
  };

  return (
    <div className="mt-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-2 text-sm text-gray-500 flex items-center">
          <span className="mr-1">💡</span> <span className="hidden sm:inline">Drag</span><span className="sm:hidden">Touch and hold</span> images to reorder.
        </div>
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <SortableImageItem
                key={image.id || image.fileId || `image-${index}`}
                image={image}
                index={index}
                onRemove={confirmDeleteImage}
                onImageClick={openImageDialog}
              />
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
        </SortableContext>
        
        {/* Drag overlay */}
        <DragOverlay adjustScale={true}>
          {draggedImage ? (
            <DraggableImageItem image={draggedImage} index={draggedImage.index} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Image</h3>
              <button
                type="button"
                onClick={closeImageDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative flex-grow overflow-hidden p-4 flex items-center justify-center">
              <div 
                className="relative"
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={handleCropEnd}
              >
                <div 
                  ref={imageRef} 
                  className="relative"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Image
                    src={selectedImage.url}
                    alt="Selected product image"
                    width={500}
                    height={500}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
                
                {isCropping && cropCoordinates.width > 0 && (
                  <div 
                    className="absolute border-2 border-rose-500 bg-rose-500 bg-opacity-20 pointer-events-none"
                    style={{
                      left: `${cropCoordinates.x}px`,
                      top: `${cropCoordinates.y}px`,
                      width: `${cropCoordinates.width}px`,
                      height: `${cropCoordinates.height}px`
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={rotateClockwise}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={rotateCounterClockwise}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Rotate Counter-Clockwise"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleCropMode}
                  className={`p-2 rounded-full ${isCropping ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'}`}
                  title="Crop Image"
                >
                  <Crop className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset to original image
                    setRotation(0);
                    setIsCropping(false);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Reset"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={closeImageDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyEdits}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4 text-rose-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-medium">Delete Image</h3>
            </div>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this image? This will permanently remove the image from our storage.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelDeleteImage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;