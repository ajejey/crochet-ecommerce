import { useState } from 'react';
import { analyzeProductImages } from '@/app/api/ai/actions';

export function useAIAssist() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateProductContent = async (images) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await analyzeProductImages(images);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateProductContent,
    isGenerating,
    error
  };
}
