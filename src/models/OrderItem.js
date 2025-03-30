import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  isMadeToOrder: {
    type: Boolean,
    default: false
  },
  madeToOrderDays: {
    type: Number,
    default: 7
  },
  estimatedDeliveryDate: {
    type: Date
  },
  productionStatus: {
    type: String,
    enum: ['pending', 'in_production', 'completed', 'shipped'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
