export interface SearchAnalysis {
  searchIntent: {
    primaryCategory: string;
    attributes: {
      itemType?: string;
      ageGroup?: string;
      skillLevel?: 'beginner' | 'intermediate' | 'advanced';
      occasion?: string;
      season?: 'summer' | 'winter' | 'monsoon' | 'all-season';
    };
    priceRange?: {
      min: number;
      max: number;
    };
  };
  searchTerms: string[];
  relatedCategories?: string[];
  suggestedFilters: Array<{
    type: string;
    value: string;
    label: string;
    confidence: number;
  }>;
}
