'use client';

import { getProduct, updateProduct } from '../../actions';
import ProductForm from '../../components/ProductForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const result = await getProduct(params.id);
        if (result.error) {
          toast.error(result.error);
          router.push('/seller/products');
          return;
        }
        setProduct(result.product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product');
        router.push('/seller/products');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, router]);

  console.log("product ", product)

  async function handleSubmit(formData) {
    try {
      const result = await updateProduct(params.id, formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Product updated successfully!');
      router.push('/seller/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        submitButtonText="Update Product"
      />
    </div>
  );
}