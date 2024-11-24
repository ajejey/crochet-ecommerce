import { createAdminClient } from '@/appwrite/config';
import auth from '@/auth';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';
import ProductList from './ProductList';

async function getSellerProducts(userId) {
  if (!userId) return null;
  
  const { databases } = createAdminClient();
  
  try {
    // Get seller profile first
    const sellerProfiles = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_SELLER_PROFILES,
      [
        Query.equal('user_id', userId)
      ]
    );

    if (!sellerProfiles.documents.length) {
      return null;
    }

    const sellerProfile = sellerProfiles.documents[0];

    // Get products
    const products = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_PRODUCTS,
      [
        Query.equal('seller_id', sellerProfile.$id)
      ]
    );

    return {
      products: products.documents,
      sellerId: sellerProfile.$id
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export default async function ProductsPage() {
  const user = await auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const data = await getSellerProducts(user.$id);

  if (!data) {
    return (
      <div className="text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your seller profile is not set up yet. Please complete your registration.
              </p>
              <p className="mt-2">
                <a href="/become-seller" className="text-yellow-700 font-medium hover:text-yellow-600 underline">
                  Complete Seller Registration
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProductList initialProducts={data.products} />;
}