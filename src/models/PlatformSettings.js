import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema({
  // Basic Platform Settings
  platform: {
    name: { type: String, default: 'Your Platform Name' },
    maintenance: { type: Boolean, default: false },
    maintenanceMessage: String,
    supportEmail: String,
    supportPhone: String
  },

  // Registration Settings
  registration: {
    allowNewSellers: { type: Boolean, default: true },
    allowNewUsers: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: true },
    requirePhoneVerification: { type: Boolean, default: false }
  },

  // Seller Settings
  seller: {
    verification: {
      requireKYC: { type: Boolean, default: true },
      autoApprove: { type: Boolean, default: false },
      requiredDocuments: [{
        name: String,
        required: Boolean,
        description: String
      }]
    },
    commission: {
      percentage: { type: Number, default: 10 },
      minimumAmount: { type: Number, default: 0 },
      maximumAmount: { type: Number, default: 1000 },
      specialCategories: [{
        category: String,
        percentage: Number
      }]
    },
    payout: {
      minimumPayout: { type: Number, default: 100 },
      payoutSchedule: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
      autoPayouts: { type: Boolean, default: false }
    }
  },

  // Order Settings
  order: {
    minimumOrderValue: { type: Number, default: 0 },
    maximumOrderValue: { type: Number, default: 50000 },
    autoConfirmation: { type: Boolean, default: true },
    cancellation: {
      allowedTimeFrame: { type: Number, default: 24 }, // hours
      requiresApproval: { type: Boolean, default: true }
    },
    return: {
      allowedDays: { type: Number, default: 7 },
      requiresApproval: { type: Boolean, default: true },
      restockingFee: { type: Number, default: 0 }
    }
  },

  // Notification Settings
  notifications: {
    adminEmails: [String],
    alertThresholds: {
      lowStock: { type: Number, default: 5 },
      highValue: { type: Number, default: 10000 },
      suspiciousActivity: {
        orderCount: { type: Number, default: 10 },
        orderValue: { type: Number, default: 50000 }
      }
    },
    emailTemplates: {
      orderConfirmation: String,
      sellerApproval: String,
      payoutConfirmation: String
    }
  },

  // AI Settings
  ai: {
    geminiModel: { type: String, default: 'gemini-2.0-flash' }
  }
}, {
  timestamps: true,
  versionKey: '__v' // Enable versioning to track settings changes
});

// Add index for quick access to latest settings
platformSettingsSchema.index({ 'updatedAt': -1 });

export const PlatformSettings = mongoose.models.PlatformSettings || mongoose.model('PlatformSettings', platformSettingsSchema);
