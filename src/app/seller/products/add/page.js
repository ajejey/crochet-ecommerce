import AddProductForm from './AddProductForm';

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add New Product</h1>
        <p className="text-gray-600">Create a new product listing for your shop.</p>
      </div>
      <AddProductForm />
    </div>
  );
}