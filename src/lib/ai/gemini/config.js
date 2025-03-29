import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCT_CATEGORIES } from '@/constants/product';

export class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  

  async analyzeProductImages(images) {
    console.log("process.env.GEMINI_API_KEY -------------", process.env.GEMINI_API_KEY)
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      // Convert images to base64 format for Gemini
      const imageContents = await Promise.all(
        images.map(async (imageUrl) => ({
          inlineData: {
            data: await this.#convertImageToBase64(imageUrl),
            mimeType: "image/jpeg"
          }
        }))
      );

      // List of available categories for reference
      const availableCategories = PRODUCT_CATEGORIES.map(cat => cat.id);

      // Craft a detailed prompt for product analysis
      const prompt = `You are a professional e-commerce product description writer and crochet expert for buyers in India. 
      Analyze these product images of a crochet item and generate the following details:

      1. Category Detection:
         - Identify the most likely product category from this list: ${availableCategories.join(', ')}
         - Explain why you chose this category

      2. Product Analysis:
         - Identify the type of crochet item
         - Detect materials used (e.g., yarn type, texture)
         - Estimate approximate size/dimensions
         - Identify any unique features or patterns
         - Detect colors used

      3. Generate:
         a) A compelling short description for buyers in India (2-3 sentences) that:
            - Highlights key features
            - Emphasizes handmade quality
            - Appeals to emotion and usefulness
         
         b) A detailed full description for buyers in India that includes:
            - Detailed craftsmanship description
            - Materials and texture
            - Size and fit information
            - Use cases and styling suggestions
            - Care instructions
            - Unique selling points
         
         c) SEO-optimized keywords and tags (minimum 8) that:
            - Include crochet-specific terms
            - Cover style and design elements
            - Include material types
            - Target seasonal/occasion terms if applicable

      Format your response as JSON with the following structure:
      {
        "detectedCategory": "string",
        "categoryConfidence": "string",
        "shortDescription": "string",
        "fullDescription": "string",
        "suggestedMaterials": ["string"],
        "suggestedSize": "string",
        "seoKeywords": ["string"],
        "colors": ["string"],
        "patterns": ["string"]
      }

      Make all descriptions engaging and SEO-friendly. Focus on the unique handmade nature, quality, and artisanal value of crochet products.`;

      const result = await model.generateContent([...imageContents, prompt]);
      const response = result.response.text();
      
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw error;
    }
  }

  // Private method using # prefix (ES2022 private class fields)
  async #convertImageToBase64(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer).toString('base64');
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw error;
    }
  }
}
