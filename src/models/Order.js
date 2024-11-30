import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerPhone: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  sellerAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  shippingAddress: {
    type: String,
    required: true
  },
  shippingCity: {
    type: String,
    required: true
  },
  shippingState: {
    type: String,
    required: true
  },
  shippingPincode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
