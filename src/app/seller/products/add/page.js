'use client';

import { createProduct } from '../actions';
import ProductForm from '../components/ProductForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddProductPage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    try {
      const result = await createProduct(formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Product created successfully!');
      router.push('/seller/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  }

  return (
    <div className="container mx-auto py-14 lg:py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        submitButtonText="Create Product"
      />
    </div>
  );
}