
import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with @google/genai coding guidelines by initializing the client
// directly with the API key from environment variables. This assumes `process.env.API_KEY`
// is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getMarketAnalysis = async (): Promise<string> => {
  try {
    const prompt = `
      Provide a concise, expert-level market analysis for cryptocurrency arbitrage opportunities today. 
      Focus on the following:
      1.  Current market volatility and its impact on price discrepancies.
      2.  Mention two specific token categories (e.g., L1s, DeFi tokens, Memecoins) that are showing potential for arbitrage.
      3.  Briefly touch on network congestion on major chains like Ethereum and its effect on arbitrage profitability (gas fees).
      4.  Conclude with a forward-looking statement on near-term opportunities.
      
      Format the response as a single block of text, suitable for a dashboard panel. Do not use markdown formatting like headers or bullet points.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching market analysis from Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to retrieve market analysis. Please check your API key and network connection. Details: ${error.message}`;
    }
    return "An unknown error occurred while fetching market analysis.";
  }
};
