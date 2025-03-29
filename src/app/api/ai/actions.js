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

// Job store to track async jobs
const jobs = new Map();

export async function initiateProductImageAnalysis(imageUrls, jobId) {
  'use server';
  
  try {
    // Immediately register the job as pending
    jobs.set(jobId, { 
      status: 'pending', 
      startTime: Date.now() 
    });

    // Start the analysis process asynchronously
    processProductImageAnalysis(imageUrls, jobId)
      .catch(error => {
        // Update job status if processing fails
        jobs.set(jobId, { 
          status: 'error', 
          error: error.message 
        });
      });

    return { 
      success: true, 
      jobId 
    };
  } catch (error) {
    console.error('Failed to initiate product image analysis:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

async function processProductImageAnalysis(imageUrls, jobId) {
  'use server';
  
  try {
    // Simulate AI processing with a timeout to prevent blocking
    const result = await analyzeProductImages(imageUrls);

    // Update job with result
    jobs.set(jobId, { 
      status: 'completed', 
      data: result.data,
      completedTime: Date.now()
    });

    return result;
  } catch (error) {
    // Update job with error
    jobs.set(jobId, { 
      status: 'error', 
      error: error.message 
    });
    throw error;
  }
}

export async function checkProductImageAnalysisJob(jobId) {
  'use server';
  
  const job = jobs.get(jobId);

  if (!job) {
    return { 
      status: 'not_found' 
    };
  }

  // Clean up old jobs after 15 minutes
  const MAX_JOB_AGE = 15 * 60 * 1000; // 15 minutes
  if (job.startTime && (Date.now() - job.startTime > MAX_JOB_AGE)) {
    jobs.delete(jobId);
    return { 
      status: 'expired' 
    };
  }

  return {
    status: job.status,
    data: job.status === 'completed' ? job.data : null,
    error: job.status === 'error' ? job.error : null
  };
}

async function analyzeProductImages(images) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({
      // model: "gemini-2.0-flash-exp",
      model: "gemini-2.5-pro-exp-03-25",
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

    const prompt = `Analyze these handcrafted crochet items and create irresistible product content that converts browsers into buyers for buyers in India. You write in simple but effective words that buyers in India can understand and relate to.

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

For the short description:
- Open with a compelling hook that addresses a specific need or desire
- Highlight the most impressive feature or unique selling point
- End with a clear call-to-action
- Keep the text simple for audience in India to understand.
- Example: "Keep your little one warm and cozy with this beautifully handwoven baby blanket. Made from soft, premium wool, it’s crafted with love and care by skilled artisans. A perfect gift for your baby or a loved one. Order now and make it a cherished memory!"

For the full description, write in HTML, well formatted and styled format (give inline styling where needed) and structure it as follows (but don't include the headings):

EMOTIONAL HOOK:
- Start with an engaging scenario or question
- Address a specific pain point or desire
- Example: "Imagine wrapping your little one in a blanket as soft as a mother’s hug, keeping them warm and cozy all night..."

KEY FEATURES (3-4 bullet points):
- Transform features into benefits
- Use sensory language
- Example: "Soft, breathable cotton that stays gentle on your skin, even in hot weather."

CRAFTSMANSHIP HIGHLIGHT:
- Emphasize the artisanal nature
- Mention the time and skill invested
- Example: "Lovingly crafted over 30+ hours by expert hands..."

VERSATILITY & USAGE:
- Describe multiple ways to use the item
- Paint pictures of different scenarios
- Example: "Perfect for cozy naps, playtime, or carrying on family outings..."

CARE INSTRUCTIONS:
- Frame as preserving their investment
- Keep it simple but specific
- Example: "Keep it soft and beautiful for years with simple care..."

GUARANTEE/QUALITY PROMISE:
- Build trust and reduce purchase anxiety
- Example: Handcrafted with love and checked for the finest quality..."

URGENCY & SCARCITY:
- Mention limited availability or seasonal relevance
- Example: "Each piece is uniquely handcrafted - when it's gone, it's gone..."

CALL TO ACTION:
- Clear, compelling closing statement
- Example: "Order now and bring home comfort and warmth!"

Generate at least 15 SEO-optimized keywords that target (in the Indian context):
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
- Keep the words simple yet effective
- You don't need to use the word "Indian" or "India" in the response. Just know that you are writing for buyers in India
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
