import mongoose from 'mongoose';

const SearchPhraseSchema = new mongoose.Schema({
  phrase: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  type: { 
    type: String,
    enum: ['product', 'category', 'pattern', 'ai_generated'],
    default: 'ai_generated'
  },
  frequency: {
    type: Number,
    default: 1
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for better query performance
SearchPhraseSchema.index({ 
  phrase: 1, 
  frequency: -1 
}, {
  collation: { locale: 'en', strength: 2 } // Case-insensitive
});

// TTL index for cleanup of unused phrases
SearchPhraseSchema.index({ 
  lastUsed: 1 
}, { 
  expireAfterSeconds: 30 * 24 * 60 * 60 // 30 days 
});

export const SearchPhrase = mongoose?.models?.SearchPhrase || mongoose.model('SearchPhrase', SearchPhraseSchema);
