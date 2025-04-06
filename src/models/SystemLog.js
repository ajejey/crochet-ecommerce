import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['payment', 'order', 'shipping', 'inventory', 'user', 'email', 'system'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userId: {
    type: String,
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  sellerId: {
    type: String,
    index: true
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: String
  },
  resolvedNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for common queries
systemLogSchema.index({ createdAt: -1 });
systemLogSchema.index({ level: 1, category: 1 });
systemLogSchema.index({ level: 1, resolved: 1 });

// Add compound indexes for common filtering patterns
systemLogSchema.index({ category: 1, createdAt: -1 });
systemLogSchema.index({ level: 1, category: 1, createdAt: -1 });

const SystemLog = mongoose.models.SystemLog || mongoose.model('SystemLog', systemLogSchema);

export default SystemLog;
