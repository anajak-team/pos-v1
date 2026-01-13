import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

// Initialize exclusively from environment variable as per coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

export const generateSalesInsight = async (transactions: Transaction[]): Promise<string> => {
  if (!process.env.API_KEY) return "AI features disabled (Missing API Key).";

  const recentSales = transactions.slice(0, 30);
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  
  const prompt = `
    You are a professional business consultant. Analyze these recent POS transactions for a small business.
    Total Revenue All Time: ${totalRevenue.toFixed(2)}
    Recent Transactions JSON: ${JSON.stringify(recentSales)}
    
    Provide a concise, encouraging 3-sentence summary of sales performance and one actionable tip for the manager.
    Focus on popular items, busy periods, or upsell opportunities.
    Do not use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Insights currently being generated. Check back in a moment.";
  } catch (error) {
    console.error("Gemini Sales Insight Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) return "Premium quality item.";

  const prompt = `Write a short, appealing marketing description (max 15 words) for a product named "${name}" in the category "${category}". Return only the text.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "Premium quality item.";
  } catch (error) {
    return "Premium quality item.";
  }
};

export const suggestUpsell = async (cartItems: string[]): Promise<string> => {
    if (!process.env.API_KEY || cartItems.length === 0) return "";

    const prompt = `
        A customer is buying: ${cartItems.join(', ')}.
        Suggest ONE complementary generic product name (e.g., "Cookie", "Cold Soda", "Warranty Plan") to upsell.
        Return ONLY the product name, nothing else.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        return "";
    }
}