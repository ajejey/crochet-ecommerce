'use server';

import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Variant } from '@/models/Variant';
import { SellerProfile } from '@/models/SellerProfile';
import { getAuthUser } from '@/lib/auth-context';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { revalidateSitemaps, pingSearchEngines } from '@/lib/sitemap-utils';
import { createAdminClient } from '@/appwrite/config';
import { ID } from 'node-appwrite';

export async function getProduct(productId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();
    const product = await Product.findOne({ _id: productId, sellerId: user.$id });

    if (!product) {
      return { error: 'Product not found' };
    }

    // Convert to plain object and include all fields
    const plainProduct = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      category: product.category,
      featured: product.featured,
      material: product.material,
      isMultiPack: product.isMultiPack,
      packSize: product.packSize,
      pricePerPiece: product.pricePerPiece,
      size: product.size,
      status: product.status,
      images: product.images?.map(img => ({
        url: img.url,
        id: img.id,
        isMain: img.isMain
      })) || [],
      tags: product.tags || [],
      specifications: {
        weight: product.specifications?.weight || { value: 0, unit: 'g' },
        dimensions: product.specifications?.dimensions || { length: 0, width: 0, height: 0 },
        colors: product.specifications?.colors || [],
        patterns: product.specifications?.patterns || []
      },
      inventory: {
        stockCount: product.inventory?.stockCount || 0,
        lowStockThreshold: product.inventory?.lowStockThreshold || 5,
        sku: product.inventory?.sku || '',
        allowBackorder: product.inventory?.allowBackorder || false
      },
      metadata: {
        views: product.metadata?.views || 0,
        favorites: product.metadata?.favorites || 0,
        salesCount: product.metadata?.salesCount || 0,
        searchKeywords: product.metadata?.searchKeywords || []
      },
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString()
    };

    return { success: true, product: plainProduct };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: 'Failed to fetch product' };
  }
}

export async function createProduct(formData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    console.log("user in create product", user)

    await dbConnect();

    // Get seller profile to ensure user is a seller
    const sellerProfile = await SellerProfile.findOne({ userId: user.$id });
    if (!sellerProfile) {
      return { error: 'Seller profile not found' };
    }

    console.log("seller profile in create product", sellerProfile)

    // Parse image URLs and IDs
    const imageUrls = JSON.parse(formData.get('imageUrls') || '[]');
    const imageIds = JSON.parse(formData.get('imageIds') || '[]');

    console.log("imageUrls in create product", imageUrls)
    console.log("imageIds in create product", imageIds)

    if (imageUrls.length === 0) {
      return { error: 'At least one product image is required' };
    }

    // Generate slug from name
    const name = formData.get('name');
    const slug = slugify(name, { lower: true, strict: true });

    console.log("name in create product", name)
    console.log("slug in create product", slug)

    // Create the product
    const productData = {
      sellerId: user.$id,
      name,
      slug,
      description: {
        short: formData.get('shortDescription'),
        full: formData.get('fullDescription')
      },
      baseOptionName: formData.get('baseOptionName') || 'Original',
      price: parseFloat(formData.get('price')),
      salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice')) : undefined,
      isMultiPack: formData.get('isMultiPack') === 'on',
      packSize: formData.get('packSize') ? parseInt(formData.get('packSize'), 10) : 1,
      pricePerPiece: formData.get('pricePerPiece') ? parseFloat(formData.get('pricePerPiece')) : undefined,
      category: formData.get('category'),
      featured: formData.get('featured') === 'on',
      material: formData.get('material'),
      size: formData.get('size'),
      status: formData.get('status') || 'draft',
      images: imageUrls.map((url, index) => ({
        url,
        id: imageIds[index],
        isMain: index === 0 // First image is main by default
      })),
      tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      specifications: {
        // weight: {
        //   value: parseFloat(formData.get('weight')) || 0,
        //   unit: formData.get('weightUnit') || 'g'
        // },
        dimensions: {
          length: parseFloat(formData.get('length')) || 0,
          width: parseFloat(formData.get('width')) || 0,
          height: parseFloat(formData.get('height')) || 0
        },
        colors: formData.get('colors')?.split(',').map(color => color.trim()).filter(Boolean) || [],
        patterns: formData.get('patterns')?.split(',').map(pattern => pattern.trim()).filter(Boolean) || []
      },
      inventory: {
        stockCount: parseInt(formData.get('stockCount')) || 0,
        lowStockThreshold: parseInt(formData.get('lowStockThreshold')) || 5,
        sku: formData.get('sku'),
        allowBackorder: formData.get('allowBackorders') === 'on',
        madeToOrderDays: parseInt(formData.get('madeToOrderDays')) || 7
      },
      metadata: {
        views: 0,
        favorites: 0,
        salesCount: 0,
        searchKeywords: formData.get('searchKeywords')?.split(',').map(kw => kw.trim()).filter(Boolean) || []
      }
    };

    console.log('Product data:', productData);

    // Validate sale price is less than regular price
    if (productData.salePrice && productData.salePrice >= productData.price) {
      return { error: 'Sale price must be less than regular price' };
    }

    const product = await Product.create(productData);

    console.log('Created product:', product);

    // Update seller's product count
    await SellerProfile.updateOne(
      { userId: user.$id },
      { 
        $inc: { 'metadata.productsCount': 1 },
        $set: { 
          updatedAt: new Date(),
          ...(product.status === 'active' ? { 'metadata.activeProductsCount': { $inc: 1 } } : {})
        }
      }
    );

    console.log('Updated seller profile:', sellerProfile);

    // Comprehensive revalidation to ensure updates are reflected across the site
    revalidatePath('/seller/products');
    revalidatePath('/shop');
    revalidatePath('/shop/product/[productId]', 'page');
    revalidatePath('/shop/category/[category]', 'page');
    revalidatePath('/', 'layout'); // Revalidate homepage which may show featured products
    
    // Revalidate sitemaps and ping search engines for new product
    if (product.status === 'active') {
      await revalidateSitemaps();
      await pingSearchEngines();
    }
    
    return { success: true, productId: product._id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(productId, formData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();
    
    const product = await Product.findOne({ _id: productId, sellerId: user.$id });
    if (!product) {
      return { error: 'Product not found or unauthorized' };
    }

    console.log("formData in update product ", formData)

    // Parse image URLs and IDs
    const imageUrls = JSON.parse(formData.get('imageUrls') || '[]');
    const imageIds = JSON.parse(formData.get('imageIds') || '[]');

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: formData.get('name'),
        description: {
          short: formData.get('shortDescription'),
          full: formData.get('fullDescription')
        },
        baseOptionName: formData.get('baseOptionName') || 'Original',
        price: parseFloat(formData.get('price')),
        salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice')) : undefined,
        isMultiPack: formData.get('isMultiPack') === 'on',
        packSize: formData.get('packSize') ? parseInt(formData.get('packSize'), 10) : 1,
        pricePerPiece: formData.get('pricePerPiece') ? parseFloat(formData.get('pricePerPiece')) : undefined,
        category: formData.get('category'),
        material: formData.get('material'),
        size: formData.get('size'),
        featured: formData.get('featured') === 'on',
        images: imageUrls.map((url, index) => ({
          url,
          id: imageIds[index],
          isMain: index === 0
        })),
        tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
        inventory: {
          stockCount: parseInt(formData.get('stockCount'), 10) || 0,
          sku: formData.get('sku'),
          allowBackorder: formData.get('allowBackorders') === 'on',
          madeToOrderDays: parseInt(formData.get('madeToOrderDays')) || 7,
          lowStockThreshold: parseInt(formData.get('lowStockThreshold'), 10) || 5
        },
        specifications: {
          colors: formData.get('colors')?.split(',').map(color => color.trim()).filter(Boolean) || [],
          patterns: formData.get('patterns')?.split(',').map(pattern => pattern.trim()).filter(Boolean) || [],
          dimensions: {
            length: parseFloat(formData.get('length')) || 0,
            width: parseFloat(formData.get('width')) || 0,
            height: parseFloat(formData.get('height')) || 0,
            weight: {
              value: parseFloat(formData.get('weight')) || 0,
              unit: formData.get('weightUnit') || 'g'
            }
          }
        },
        metadata: {
          searchKeywords: formData.get('searchKeywords')?.split(',').map(kw => kw.trim()).filter(Boolean) || []
        }
      },
      { new: true }
    );

    // Convert to plain object with only necessary fields
    const plainProduct = {
      _id: updatedProduct._id.toString(),
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      salePrice: updatedProduct.salePrice,
      category: updatedProduct.category,
      material: updatedProduct.material,
      size: updatedProduct.size,
      status: updatedProduct.status,
      images: updatedProduct.images?.map(img => ({
        url: img.url,
        id: img.id,
        isMain: img.isMain
      })) || [],
      inventory: {
        stockCount: updatedProduct.inventory?.stockCount || 0,
        sku: updatedProduct.inventory?.sku
      },
      rating: {
        average: updatedProduct.rating?.average || 0,
        count: updatedProduct.rating?.count || 0
      },
      createdAt: updatedProduct.createdAt?.toISOString(),
      updatedAt: updatedProduct.updatedAt?.toISOString()
    };

    revalidatePath('/seller/products');
    revalidatePath(`/shop/product/${productId}`);
    revalidatePath(`/shop`);
    
    // Revalidate sitemaps and ping search engines for updated product
    await revalidateSitemaps();
    if (updatedProduct.status === 'active') {
      await pingSearchEngines();
    }
    
    return { success: true, product: plainProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: 'Failed to update product' };
  }
}

export async function deleteProduct(productId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Find the product first to ensure it exists and belongs to the seller
    const product = await Product.findOne({ _id: productId, sellerId: user.$id });
    if (!product) {
      return { error: 'Product not found' };
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Update seller's product count
    await SellerProfile.findOneAndUpdate(
      { userId: user.$id },
      { $inc: { 'metadata.productsCount': -1 } }
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'Failed to delete product' };
  }
}

export async function updateProductStatus(productId, newStatus) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Find and update the product
    const product = await Product.findOneAndUpdate(
      { _id: productId, sellerId: user.$id },
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!product) {
      return { error: 'Product not found' };
    }

    // If product was activated, revalidate sitemaps and ping search engines
    if (newStatus === 'active') {
      await revalidateSitemaps();
      await pingSearchEngines();
    }
    
    return { 
      success: true,
      product: {
        _id: product._id.toString(),
        status: product.status
      }
    };
  } catch (error) {
    console.error('Error updating product status:', error);
    return { error: 'Failed to update product status' };
  }
}

export async function getProductVariants(productId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Get product to verify ownership
    const product = await Product.findOne({ _id: productId, sellerId: user.$id });
    if (!product) {
      return { error: 'Product not found or not authorized' };
    }

    // Get variants
    const variants = await Variant.find({ product: productId });

    return { success: true, variants: JSON.parse(JSON.stringify(variants)) };
  } catch (error) {
    console.error('Error fetching variants:', error);
    return { error: error.message };
  }
}

export async function createVariant(productId, variantData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Verify product ownership
    const product = await Product.findOne({ _id: productId, sellerId: user.$id });
    if (!product) {
      return { error: 'Not authorized to add variants to this product' };
    }

    // Create variant
    const variant = await Variant.create({
      product: productId,
      name: variantData.variantName,
      price_adjustment: parseFloat(variantData.variant_price_adjustment || 0),
      stockCount: parseInt(variantData.variantStockCount || 0),
      sku: variantData.variantSku || '',
      status: variantData.variantStatus || 'active',
      image: variantData.variantImage || null
    });

    return { success: true, variant: JSON.parse(JSON.stringify(variant)) };
  } catch (error) {
    console.error('Error creating variant:', error);
    return { error: error.message };
  }
}

export async function updateVariant(variantId, variantData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Get variant to verify ownership
    const variant = await Variant.findOne({ _id: variantId });
    if (!variant) {
      return { error: 'Variant not found' };
    }

    // Get product to verify ownership
    const product = await Product.findOne({ _id: variant.product, sellerId: user.$id });
    if (!product) {
      return { error: 'Not authorized to edit this variant' };
    }

    // Prepare update data
    const updateData = {
      name: variantData.variantName,
      price_adjustment: parseFloat(variantData.variant_price_adjustment || 0),
      stockCount: parseInt(variantData.variantStockCount || 0),
      sku: variantData.variantSku,
      status: variantData.variantStatus,
      updatedAt: new Date()
    };
    
    // Add image if provided
    if (variantData.variantImage) {
      updateData.image = variantData.variantImage;
    } else if (variantData.variantImage === null) {
      // If explicitly set to null, remove the image
      updateData.image = null;
    }
    
    // Update variant
    const updatedVariant = await Variant.findByIdAndUpdate(
      variantId,
      updateData,
      { new: true }
    );

    return { success: true, variant: JSON.parse(JSON.stringify(updatedVariant)) };
  } catch (error) {
    console.error('Error updating variant:', error);
    return { error: error.message };
  }
}

// export async function updateVariant(variantId, variantData) {
//   try {
//     const user = await getAuthUser();
//     if (!user) {
//       return { error: 'Not authenticated' };
//     }

//     await dbConnect();

//     // Get variant to verify ownership
//     const variant = await Variant.findOne({ _id: variantId });
//     if (!variant) {
//       return { error: 'Variant not found' };
//     }

//     // Get product to verify ownership
//     const product = await Product.findOne({ _id: variant.product, sellerId: user.$id });
//     if (!product) {
//       return { error: 'Not authorized to edit this variant' };
//     }

//     // Update variant
//     const updatedVariant = await Variant.findByIdAndUpdate(
//       variantId,
//       {
//         name: variantData.name,
//         price_adjustment: parseFloat(variantData.price_adjustment || 0),
//         stockCount: parseInt(variantData.stockCount || 0),
//         sku: variantData.sku,
//         status: variantData.status,
//         updatedAt: new Date()
//       },
//       { new: true }
//     );

//     return { success: true, variant: JSON.parse(JSON.stringify(updatedVariant)) };
//   } catch (error) {
//     console.error('Error updating variant:', error);
//     return { error: error.message };
//   }
// }

export async function deleteVariant(variantId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    await dbConnect();

    // Get variant to verify ownership
    const variant = await Variant.findOne({ _id: variantId });
    if (!variant) {
      return { error: 'Variant not found' };
    }

    // Get product to verify ownership
    const product = await Product.findOne({ _id: variant.product, sellerId: user.$id });
    if (!product) {
      return { error: 'Not authorized to delete this variant' };
    }

    // Delete variant
    await Variant.findByIdAndDelete(variantId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting variant:', error);
    return { error: error.message };
  }
}

export async function uploadProductImage(formData) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    const file = formData.get('image');
    if (!file || !file.size) {
      return { error: 'No image provided' };
    }

    const { storage } = createAdminClient();

    // Upload image to Appwrite storage
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_STORAGE_ID,
      ID.unique(),
      file
    );

    // Generate the file URL
    const fileUrl = `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_STORAGE_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;

    return { success: true, fileUrl, fileId: uploadedFile.$id };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error: 'Failed to upload image' };
  }
}

export async function deleteProductImage(fileId) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Not authenticated' };
    }

    if (!fileId) {
      return { error: 'No file ID provided' };
    }

    const { storage } = createAdminClient();

    // Delete image from Appwrite storage
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_STORAGE_ID,
      fileId
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error: 'Failed to delete image' };
  }
}