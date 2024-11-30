import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for cart_id and product_id for faster lookups
cartItemSchema.index({ cartId: 1, product: 1, variant: 1 }, { unique: true });

export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
