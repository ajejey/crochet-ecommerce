import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    unique: true,
    required: true,
    index: true
  },
  displayName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  accessLevel: {
    type: String,
    enum: ['super', 'manager', 'support'],
    default: 'manager',
    required: true
  },
  permissions: {
    // User Management
    manageUsers: { type: Boolean, default: false },
    manageAdmins: { type: Boolean, default: false }, // Only for super admin
    
    // Seller Management
    viewSellers: { type: Boolean, default: true },
    approveSellers: { type: Boolean, default: false },
    manageSellers: { type: Boolean, default: false },
    
    // Product Management
    viewProducts: { type: Boolean, default: true },
    moderateProducts: { type: Boolean, default: false },
    manageCategories: { type: Boolean, default: false },
    
    // Order & Payment
    viewOrders: { type: Boolean, default: true },
    manageOrders: { type: Boolean, default: false },
    managePayouts: { type: Boolean, default: false },
    manageRefunds: { type: Boolean, default: false },
    
    // Platform Settings
    viewSettings: { type: Boolean, default: false },
    manageSettings: { type: Boolean, default: false }
  },
  metadata: {
    lastLogin: Date,
    loginHistory: [{
      timestamp: Date,
      ipAddress: String,
      userAgent: String
    }],
    actionsLog: [{
      action: String,
      timestamp: Date,
      details: mongoose.Schema.Types.Mixed
    }]
  },
  contactInfo: {
    email: String,
    phoneNumber: String,
    emergencyContact: String
  }
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
adminProfileSchema.index({ 'status': 1, 'accessLevel': 1 });

export const AdminProfile = mongoose.models.AdminProfile || mongoose.model('AdminProfile', adminProfileSchema);
