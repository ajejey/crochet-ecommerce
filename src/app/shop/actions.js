"use server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { unstable_cache } from 'next/cache';

export async function getProducts(query = {}) {
  // Cache the products with a revalidation period
  const getCachedProducts = unstable_cache(
    async () => {
      await dbConnect();
      const products = await Product.find(query);
      return JSON.parse(JSON.stringify(products));
    },
    ['products-cache'],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ['products']
    }
  );

  return getCachedProducts();
}

export async function searchProducts(searchQuery, category) {
  // This remains dynamic
  noStore();
  
  try {
    await dbConnect();
    const query = {};
    
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const products = await Product.find(query);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to search products:', error);
    throw new Error('Failed to search products');
  }
}

// export async function getProducts(query = {}) {
//     "use server";
//     await dbConnect();
//     try {
//       const products = await Product.find(query);
//       // Convert _id to string and handle dates for serialization
//       revalidatePath('/shop');
//       return JSON.parse(JSON.stringify(products));
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//       throw new Error('Failed to fetch products');
//     }
//   }

  
// export async function searchProducts(searchQuery, category) {
//     "use server";
//     await dbConnect();
//     try {
//       const query = {};
      
//       if (searchQuery) {
//         query.name = { $regex: searchQuery, $options: 'i' };
//       }
      
//       if (category && category !== 'All') {
//         query.category = category;
//       }
      
//       const products = await Product.find(query);
//       return JSON.parse(JSON.stringify(products));
//     } catch (error) {
//       console.error('Failed to search products:', error);
//       throw new Error('Failed to search products');
//     }
//   }