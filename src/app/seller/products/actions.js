'use server';

import { createAdminClient } from '@/appwrite/config';
import auth from '@/auth';
import { ID, Query } from 'node-appwrite';

async function getSellerProfile(userId) {
  const { databases } = createAdminClient();
  
  try {
    const sellerProfiles = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_SELLER_PROFILES,
      [
        Query.equal('user_id', userId)
      ]
    );

    return sellerProfiles.documents[0];
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return null;
  }
}

export async function getProduct(productId) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    const { databases } = createAdminClient();
    
    const product = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId
    );

    // Verify that the product belongs to this seller
    if (product.seller_id !== sellerProfile.$id) {
      return { error: 'Not authorized to view this product' };
    }

    return { success: true, product };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: error.message };
  }
}

export async function updateProductStatus(productId, status) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { databases } = createAdminClient();
    
    // Update product status with a single database call
    // Using permission system to handle authorization instead of explicit checks
    const product = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId,
      {
        status,
        updated_at: new Date().toISOString()
      }
    );

    return { success: true, product };
  } catch (error) {
    console.error('Error updating product status:', error);
    return { error: error.message };
  }
}

export async function updateProduct(productId, formData) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    const { databases, storage } = createAdminClient();

    // If it's just a status update, use the optimized function
    const status = formData.get('status');
    if (status && Object.keys(formData).length === 1) {
      return updateProductStatus(productId, status);
    }

    // First verify that the product belongs to this seller
    const existingProduct = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId
    );

    if (existingProduct.seller_id !== sellerProfile.$id) {
      return { error: 'Not authorized to edit this product' };
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Handle image upload if new image is provided
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      try {
        // Delete old image if it exists
        if (existingProduct.image_urls?.[0]) {
          const oldFileId = existingProduct.image_urls[0].split('/').pop().split('?')[0];
          try {
            await storage.deleteFile(
              process.env.NEXT_PUBLIC_STORAGE_ID,
              oldFileId
            );
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        // Upload new image
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_STORAGE_ID,
          ID.unique(),
          imageFile
        );
        
        updateData.image_urls = [`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`];
      } catch (error) {
        console.error('Error uploading image:', error);
        return { error: 'Failed to upload image. Please try again.' };
      }
    }

    // Add other fields if they exist in formData
    const fields = ['name', 'description', 'price', 'sale_price', 'category', 'stock'];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        if (field === 'price' || field === 'stock') {
          updateData[field] = parseFloat(value);
        } else if (field === 'sale_price') {
          updateData[field] = value ? parseFloat(value) : null;
        } else {
          updateData[field] = value;
        }
      }
    });

    // Update product
    const product = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId,
      updateData
    );

    return { success: true, product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: error.message };
  }
}

export async function createProduct(formData) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    const { databases, storage } = createAdminClient();

    // Handle image upload
    const imageFile = formData.get('image');
    let imageUrl = '';
    
    if (imageFile && imageFile.size > 0) {
      try {
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_STORAGE_ID,
          ID.unique(),
          imageFile
        );
        
        // Get the file view URL
        imageUrl = `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;
      } catch (error) {
        console.error('Error uploading image:', error);
        return { error: 'Failed to upload image. Please try again.' };
      }
    }

    // Create product
    const product = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      ID.unique(),
      {
        seller_id: sellerProfile.$id,
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price')) : null,
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        image_urls: imageUrl ? [imageUrl] : [], // Changed from images to image_urls
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: error.message };
  }
}

export async function deleteProduct(productId) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { databases } = createAdminClient();
    
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: error.message };
  }
}

export async function getProductVariants(productId) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { databases } = createAdminClient();
      
    const variants = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      [
        Query.equal('product_id', productId)
      ]
    );

    return { success: true, variants: variants.documents };
  } catch (error) {
    console.error('Error fetching variants:', error);
    return { error: error.message };
  }
}

export async function createVariant(productId, variantData) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    // Verify product ownership
    const { databases } = createAdminClient();
    const product = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      productId
    );

    if (product.seller_id !== sellerProfile.$id) {
      return { error: 'Not authorized to add variants to this product' };
    }

    // Create variant
    const variant = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      ID.unique(),
      {
        product_id: productId,
        name: variantData.name,
        options: variantData.options,
        price_adjustment: parseFloat(variantData.price_adjustment || 0),
        stock: parseInt(variantData.stock || 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    return { success: true, variant };
  } catch (error) {
    console.error('Error creating variant:', error);
    return { error: error.message };
  }
}

export async function updateVariant(variantId, variantData) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    const { databases } = createAdminClient();

    // Get variant to verify ownership
    const variant = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      variantId
    );

    // Get product to verify ownership
    const product = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      variant.product_id
    );

    if (product.seller_id !== sellerProfile.$id) {
      return { error: 'Not authorized to edit this variant' };
    }

    // Update variant
    const updatedVariant = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      variantId,
      {
        name: variantData.name,
        options: variantData.options,
        price_adjustment: parseFloat(variantData.price_adjustment || 0),
        stock: parseInt(variantData.stock || 0),
        updated_at: new Date().toISOString()
      }
    );

    return { success: true, variant: updatedVariant };
  } catch (error) {
    console.error('Error updating variant:', error);
    return { error: error.message };
  }
}

export async function deleteVariant(variantId) {
  try {
    const user = await auth.getUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const sellerProfile = await getSellerProfile(user.$id);
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    const { databases } = createAdminClient();

    // Get variant to verify ownership
    const variant = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      variantId
    );

    // Get product to verify ownership
    const product = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      variant.product_id
    );

    if (product.seller_id !== sellerProfile.$id) {
      return { error: 'Not authorized to delete this variant' };
    }

    // Delete variant
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      'product_variants',
      variantId
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting variant:', error);
    return { error: error.message };
  }
}