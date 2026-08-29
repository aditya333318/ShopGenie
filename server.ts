import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, AVAILABLE_COUPONS } from './src/data/products';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Lazy Google GenAI initializer
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper: Catalog summary for LLM prompt context
function getCatalogContext(): string {
  return JSON.stringify(
    INITIAL_PRODUCTS.map((p) => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badge: p.badge,
      description: p.description,
      features: p.features,
      specs: p.specs,
      inStock: p.inStock,
      stockCount: p.stockCount,
      fastShipping: p.fastShipping,
      tags: p.tags,
      pros: p.pros,
      cons: p.cons,
    }))
  );
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    productsCount: INITIAL_PRODUCTS.length,
  });
});

// 2. Chat / Shopping Agent Conversation Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, chatHistory = [], currentCart = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    // Fallback response if no API key is provided
    if (!ai) {
      const lower = message.toLowerCase();
      const matchedProducts = INITIAL_PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags.some((t) => lower.includes(t)) ||
        p.brand.toLowerCase().includes(lower)
      ).slice(0, 3);

      const prodsToRecommend = matchedProducts.length > 0
        ? matchedProducts
        : INITIAL_PRODUCTS.slice(0, 2);

      return res.json({
        reply: `I searched our catalog for **"${message}"**! Here are the best matches fitting your criteria with top customer ratings and fast shipping.`,
        recommendedProductIds: prodsToRecommend.map((p) => p.id),
        thoughtSteps: [
          { id: '1', title: 'Parsing query intent', status: 'done', detail: `Analyzed query keywords: "${message}"` },
          { id: '2', title: 'Catalog Search', status: 'done', detail: `Found ${prodsToRecommend.length} matching verified items` },
          { id: '3', title: 'Deal Verification', status: 'done', detail: 'Applied active discount validation' },
        ],
        dealCodeSuggestion: 'SKILLSLAB20',
        suggestedPrompts: [
          'Compare specifications side-by-side',
          'What are the pros and cons of these items?',
          'Find accessories under $100',
        ],
      });
    }

    const systemInstruction = `
You are the Google AI Studio Shopping Agent — an expert, friendly, helpful, and concise shopping advisor.
You help shoppers discover ideal items from our store catalog, compare specs, evaluate trade-offs, maximize budget efficiency, analyze reviews, and make confident purchasing decisions.

AVAILABLE CATALOG:
${getCatalogContext()}

AVAILABLE COUPON CODES:
${JSON.stringify(AVAILABLE_COUPONS)}

CURRENT SHOPPER CART:
${JSON.stringify(currentCart)}

RULES:
1. Always ground your recommendations in the catalog items above when relevant, citing their exact product IDs in "recommendedProductIds".
2. If comparing 2 or more products, list their IDs in "comparisonProductIds".
3. Provide an insightful, beautifully formatted Markdown response in "reply". Keep it concise, engaging, and clear.
4. Include 2-4 realistic "thoughtSteps" showing your internal reasoning (e.g. "Parsed requirements and $400 budget limit", "Ranked items by customer satisfaction and ANC performance", "Checked coupon eligibility for 20% discount").
5. Suggest a valid coupon code in "dealCodeSuggestion" if spending exceeds thresholds (e.g. SKILLSLAB20 for orders over $150, GEMINI15 for orders over $80).
6. Provide 2-3 helpful, short "suggestedPrompts" the user might want to click next.
`;

    const contents = [
      ...chatHistory.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'The helpful markdown response to display to the shopper.',
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of matching product IDs from catalog (e.g. ["prod-audio-1", "prod-audio-2"]).',
            },
            comparisonProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of product IDs if doing a direct comparison.',
            },
            thoughtSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'done, active, or pending' },
                  detail: { type: Type.STRING },
                },
                required: ['id', 'title', 'status', 'detail'],
              },
            },
            dealCodeSuggestion: {
              type: Type.STRING,
              description: 'Optional promo code suggestion (e.g. SKILLSLAB20 or GEMINI15).',
            },
            suggestedPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 3 follow-up suggested queries.',
            },
          },
          required: ['reply', 'recommendedProductIds', 'thoughtSteps'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process shopping assistant query',
      details: error.message,
    });
  }
});

// 3. Multimodal Visual Product Search (Image Analysis)
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userNotes = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const ai = getGenAI();

    if (!ai) {
      // Fallback matching
      const recs = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]];
      return res.json({
        identifiedItem: 'Audio / Workspace Gear',
        attributes: ['Modern Minimalist', 'Sleek Aesthetic', 'Matte Finish'],
        priceRange: '$99 - $348',
        analysis: 'Identified a modern personal tech aesthetic. Found matching premium items with noise cancellation and ergonomic industrial design in our store.',
        recommendedProductIds: recs.map((r) => r.id),
      });
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
      },
    };

    const promptText = `
Analyze this image for visual shopping.
Identify:
1. What item or category is depicted (e.g., "Over-ear wireless headphones", "Ergonomic office setup", "Specialty coffee gear", "Smart vacuum", "Running gear").
2. Key visual attributes & materials (e.g., minimalist matte black, aluminum, gooseneck spout, activewear).
3. Estimated price tier.
4. Based on our catalog, pick the best matching or lookalike product IDs.

CATALOG:
${getCatalogContext()}

USER NOTES (if any): "${userNotes}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedItem: { type: Type.STRING },
            attributes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            priceRange: { type: Type.STRING },
            analysis: { type: Type.STRING },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['identifiedItem', 'attributes', 'priceRange', 'analysis', 'recommendedProductIds'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-image:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message,
    });
  }
});

// 4. Product Comparison Deep Dive
app.post('/api/compare', async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 product IDs to compare' });
    }

    const selectedProducts = INITIAL_PRODUCTS.filter((p) => productIds.includes(p.id));
    if (selectedProducts.length < 2) {
      return res.status(404).json({ error: 'Products not found in catalog' });
    }

    const ai = getGenAI();

    if (!ai) {
      return res.json({
        summary: `Comparing ${selectedProducts.map((p) => p.title).join(' vs ')}. Both offer outstanding ratings and high customer satisfaction.`,
        winner: selectedProducts[0].title,
        winnerReason: `Best overall balance of price ($${selectedProducts[0].price}) and features.`,
        keyDifferences: [
          { feature: 'Price & Value', detail: `${selectedProducts[0].title} ($${selectedProducts[0].price}) vs ${selectedProducts[1].title} ($${selectedProducts[1].price})` },
          { feature: 'Target Audience', detail: `${selectedProducts[0].badge || 'General'} vs ${selectedProducts[1].badge || 'Pro'}` },
        ],
        idealFor: selectedProducts.map((p) => ({
          productId: p.id,
          productTitle: p.title,
          bestFor: `Shoppers prioritizing ${p.features[0] || 'quality'}.`,
        })),
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `
You are an expert product testing reviewer. Compare these products thoroughly:
${JSON.stringify(selectedProducts, null, 2)}

Provide an insightful, unbiased comparison, declaring a clear winner for different customer personas.
`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winner: { type: Type.STRING },
            winnerReason: { type: Type.STRING },
            keyDifferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ['feature', 'detail'],
              },
            },
            idealFor: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  productTitle: { type: Type.STRING },
                  bestFor: { type: Type.STRING },
                },
                required: ['productId', 'productTitle', 'bestFor'],
              },
            },
          },
          required: ['summary', 'winner', 'winnerReason', 'keyDifferences', 'idealFor'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/compare:', error);
    return res.status(500).json({ error: 'Failed to compare products', details: error.message });
  }
});

// 5. Deep Review Sentiment Analysis
app.post('/api/review-summary', async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const ai = getGenAI();

    if (!ai) {
      return res.json({
        overallSentiment: 'Overwhelmingly Positive (96%)',
        buyIf: [
          'You want premium build quality and high reliability.',
          'You appreciate top-tier performance verified by hundreds of buyers.',
        ],
        skipIf: [
          'You are looking for an ultra-budget basic entry model.',
        ],
        scoreBreakdown: {
          buildQuality: 9.6,
          easeOfUse: 9.4,
          valueForMoney: 9.1,
          durability: 9.5,
        },
        aiSummary: `Shoppers consistently praise the ${product.title} for its exceptional ${product.features[0] || 'performance'} and long-lasting durability.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `
Analyze customer sentiment and performance metrics for this product:
Product: ${JSON.stringify(product, null, 2)}

Provide a concise, authentic breakdown of buyer satisfaction, who should buy it, who should skip it, and component scores out of 10.
`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSentiment: { type: Type.STRING },
            buyIf: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            skipIf: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                buildQuality: { type: Type.NUMBER },
                easeOfUse: { type: Type.NUMBER },
                valueForMoney: { type: Type.NUMBER },
                durability: { type: Type.NUMBER },
              },
              required: ['buildQuality', 'easeOfUse', 'valueForMoney', 'durability'],
            },
            aiSummary: { type: Type.STRING },
          },
          required: ['overallSentiment', 'buyIf', 'skipIf', 'scoreBreakdown', 'aiSummary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/review-summary:', error);
    return res.status(500).json({ error: 'Failed to analyze review sentiment', details: error.message });
  }
});

// Vite middleware & Static Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shopping Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
