'use server';

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { PRODUCT_CATEGORIES } from '@/constants/product';

const productAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    suggestedName: {
      type: SchemaType.STRING,
      description: "A catchy and SEO-friendly product name that describes the item well",
    },
    detectedCategory: {
      type: SchemaType.STRING,
      description: "The detected product category",
      enum: PRODUCT_CATEGORIES.map(cat => cat.id),
    },
    categoryConfidence: {
      type: SchemaType.STRING,
      description: "Confidence level in the category detection",
    },
    shortDescription: {
      type: SchemaType.STRING,
      description: "A compelling 2-3 sentence product summary",
    },
    fullDescription: {
      type: SchemaType.STRING,
      description: "Detailed product description with features and benefits",
    },
    suggestedMaterials: {
      type: SchemaType.ARRAY,
      description: "List of detected or suggested materials",
      items: {
        type: SchemaType.STRING,
      },
    },
    suggestedSize: {
      type: SchemaType.STRING,
      description: "Estimated or suggested product size",
    },
    seoKeywords: {
      type: SchemaType.ARRAY,
      description: "SEO-optimized keywords and tags",
      items: {
        type: SchemaType.STRING,
      },
      minItems: 8,
    },
    colors: {
      type: SchemaType.ARRAY,
      description: "Colors detected in the product",
      items: {
        type: SchemaType.STRING,
      },
    },
    patterns: {
      type: SchemaType.ARRAY,
      description: "Patterns detected in the product",
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: [
    "suggestedName",
    "detectedCategory",
    "categoryConfidence",
    "shortDescription",
    "fullDescription",
    "seoKeywords",
    "colors",
  ],
};

async function convertImageToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch (error) {
    console.error('Image conversion failed:', error);
    throw error;
  }
}

export async function analyzeProductImages(images) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: productAnalysisSchema,
      },
    });
    
    const imageContents = await Promise.all(
      images.map(async (imageUrl) => ({
        inlineData: {
          data: await convertImageToBase64(imageUrl),
          mimeType: "image/jpeg"
        }
      }))
    );

    const prompt = `Analyze these handcrafted crochet items and create irresistible product content that converts browsers into buyers.

WRITING STYLE:
- Write in a warm, personal tone that connects emotionally with shoppers
- Use sensory-rich language to help buyers imagine touching and using the item
- Break up content into easy-to-scan sections with clear value propositions
- Emphasize exclusivity of handmade items and limited availability
- Include social proof elements (e.g., "Joins hundreds of happy customers...")
- Create urgency without being pushy

For the product name:
- Create an SEO-optimized name that includes key features
- Use power words that trigger emotional response
- Keep it clear and memorable
- Keep it under 4 words
- Example: "Heirloom-quality Baby Blanket"

For the short description:
- Open with a compelling hook that addresses a specific need or desire
- Highlight the most impressive feature or unique selling point
- End with a clear call-to-action
- Example: "Wrap your little one in pure comfort with this heirloom-quality baby blanket. Expertly crocheted from premium merino wool, each stitch carries the warmth of handmade love. Order now to give a gift that will be treasured for generations."

For the full description, write in HTML, well formatted and styled format (give inline styling where needed) and structure it as follows (but don't include the headings):

EMOTIONAL HOOK:
- Start with an engaging scenario or question
- Address a specific pain point or desire
- Example: "Imagine wrapping your precious little one in a blanket so soft, it feels like a warm hug..."

KEY FEATURES (3-4 bullet points):
- Transform features into benefits
- Use sensory language
- Example: "Buttery-soft merino wool that gets softer with each wash"

CRAFTSMANSHIP HIGHLIGHT:
- Emphasize the artisanal nature
- Mention the time and skill invested
- Example: "Lovingly crafted over 30+ hours by expert hands..."

VERSATILITY & USAGE:
- Describe multiple ways to use the item
- Paint pictures of different scenarios
- Example: "Perfect for nursery decor, tummy time, or outdoor picnics..."

CARE INSTRUCTIONS:
- Frame as preserving their investment
- Keep it simple but specific
- Example: "Simple care keeps this heirloom piece beautiful for generations..."

GUARANTEE/QUALITY PROMISE:
- Build trust and reduce purchase anxiety
- Example: "Each stitch is carefully inspected to ensure heirloom quality..."

URGENCY & SCARCITY:
- Mention limited availability or seasonal relevance
- Example: "Each piece is uniquely handcrafted - when it's gone, it's gone..."

CALL TO ACTION:
- Clear, compelling closing statement
- Example: "Secure this one-of-a-kind piece today to add warmth and charm to your nursery."

Generate at least 15 SEO-optimized keywords that target:
- Product type and variations
- Materials and techniques
- Occasions and uses
- Style and design elements
- Seasonal relevance
- Gift-giving contexts

Remember to:
- Highlight the unique handmade nature of each piece
- Emphasize the quality of materials and craftsmanship
- Create emotional connections through storytelling
- Address potential buyer concerns preemptively
- Use power words that trigger buying behavior`;

    const result = await model.generateContent([...imageContents, prompt]);
    const response = result.response.text();
    
    try {
      return { success: true, data: JSON.parse(response) };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return { success: false, error: 'Failed to parse AI response' };
    }
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return { success: false, error: error.message || 'AI Analysis failed' };
  }
}
