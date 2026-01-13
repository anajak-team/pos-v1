import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Product } from '../types';

// FIX: Initialize GoogleGenAI with API key directly from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const generateSalesInsight = async (transactions: Transaction[]): Promise<string> => {
  // FIX: Removed API key check as per guidelines assuming it's always available.

  // Summarize data to reduce token usage
  const recentSales = transactions.slice(0, 20);
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  
  const prompt = `
    Analyze these recent POS transactions for a small business.
    Total Revenue All Time: ${totalRevenue.toFixed(2)}
    Recent Transactions JSON: ${JSON.stringify(recentSales)}
    
    Provide a concise, encouraging 3-sentence summary of sales performance and one actionable tip for the manager.
    Focus on which items are popular or time-of-day trends if visible.
    Do not use markdown formatting like bold or headers, just plain text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Sales Insight Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  // FIX: Removed API key check as per guidelines.

  const prompt = `Write a short, appealing marketing description (max 15 words) for a product named "${name}" in the category "${category}". Return only the text.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text?.trim() || "Premium quality product.";
  } catch (error) {
    console.error("Gemini Description Error:", error);
    return "Premium quality product.";
  }
};

export const suggestUpsell = async (cartItems: string[]): Promise<string> => {
    // FIX: Removed API key check as per guidelines.
    if (cartItems.length === 0) return "";

    const prompt = `
        A customer is buying: ${cartItems.join(', ')}.
        Suggest ONE complementary generic product name (e.g., "Cookie", "Water") to upsell.
        Return ONLY the product name, nothing else.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        return "";
    }
}