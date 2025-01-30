import mongoose from 'mongoose';

const SearchLogSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  resultCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  clicked: {
    type: Boolean,
    default: false
  },
  sessionId: String,
  
  // New fields for AI-powered filtering
  filters: {
    autoApplied: [{
      type: { type: String },
      value: mongoose.Schema.Types.Mixed,
      kept: { type: Boolean, default: true }
    }],
    userApplied: [{
      type: { type: String },
      value: mongoose.Schema.Types.Mixed,
      source: {
        type: String,
        enum: ['suggestion', 'manual'],
        default: 'manual'
      }
    }]
  },
  
  aiAnalysis: {
    category: String,
    attributes: {
      itemType: String,
      ageGroup: String,
      skillLevel: String,
      occasion: String,
      season: String
    },
    confidence: Number
  },
  
  metrics: {
    timeToFirstClick: Number,     // Time in ms until first product click
    timeToRefine: Number,         // Time in ms until filter modification
    refinementCount: {            // Number of filter changes
      type: Number,
      default: 0
    },
    convertedToSale: {            // Whether this search led to a purchase
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for trending calculations
SearchLogSchema.index({ timestamp: -1, phrase: 1 });

// Index for filter analysis
SearchLogSchema.index({ 
  'filters.autoApplied.type': 1,
  'filters.autoApplied.kept': 1
});

SearchLogSchema.index({ 
  'filters.userApplied.type': 1,
  'filters.userApplied.source': 1
});

// Index for conversion tracking
SearchLogSchema.index({ 
  'metrics.convertedToSale': 1,
  timestamp: -1
});

export const SearchLog = mongoose.models.SearchLog || mongoose.model('SearchLog', SearchLogSchema);
