import mongoose from 'mongoose';

const SearchFilterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'category',
      'material',
      'size',
      'color',
      'skillLevel',
      'occasion',
      'season',
      'ageGroup',
      'priceRange'
    ],
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  searchPhrase: {
    type: String,
    required: true,
    index: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  usage: {
    applied: { type: Number, default: 0 },     // Times filter was auto-applied
    accepted: { type: Number, default: 0 },    // Times user kept the filter
    rejected: { type: Number, default: 0 },    // Times user removed the filter
    clicked: { type: Number, default: 0 }      // Times user clicked suggested filter
  },
  metadata: {
    lastUsed: { type: Date, default: Date.now },
    averageResultCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 } // Percentage of times filter led to purchase
  }
}, {
  timestamps: true
});

// Compound indexes for performance
SearchFilterSchema.index({ 
  searchPhrase: 1, 
  type: 1, 
  value: 1 
}, { 
  unique: true 
});

SearchFilterSchema.index({ 
  'usage.applied': -1,
  'usage.accepted': -1,
  confidence: -1
});

// TTL index for cleanup
SearchFilterSchema.index({ 
  'metadata.lastUsed': 1 
}, { 
  expireAfterSeconds: 90 * 24 * 60 * 60 // 90 days
});

export const SearchFilter = mongoose?.models?.SearchFilter || mongoose.model('SearchFilter', SearchFilterSchema);
