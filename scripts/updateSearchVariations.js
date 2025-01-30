import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';

async function updateSearchVariations() {
  try {
    await dbConnect();
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    // Update each product to trigger the pre-save hook
    for (const product of products) {
      product.markModified('name'); // Force the pre-save hook to run
      await product.save();
      console.log(`Updated search variations for: ${product.name}`);
    }

    console.log('Finished updating all products');
    process.exit(0);
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
}

updateSearchVariations();
