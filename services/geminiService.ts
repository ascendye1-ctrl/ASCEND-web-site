
import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from '../types';

let chatSession: Chat | null = null;

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const initializeChat = async (products: Product[]) => {
  const ai = getClient();
  
  // Construct a system instruction that includes the product catalog
  const catalogContext = products.map(p => 
    `- ${p.name} ($${p.price}): ${p.description}. Category: ${p.category}. ID: ${p.id}`
  ).join('\n');

  const systemInstruction = `You are the ASCEND Assistant, an enthusiastic and helpful AI sales associate for a high-end online store named ASCEND. 
  Your goal is to help customers find the perfect products, answer questions about specifications, and gently encourage purchases.
  
  Here is our current product catalog:
  ${catalogContext}
  
  Rules:
  1. Always be polite, professional, and concise.
  2. If a user asks for a recommendation, suggest products from the catalog above.
  3. If a user asks about a specific product, provide details based on the catalog.
  4. You can use emoji to be friendly.
  5. If you don't know the answer, admit it gracefully and offer to connect them with human support (fictional).
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    }
  });
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to the inventory right now. Please try again in a moment!";
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a compelling, short marketing description (max 2 sentences) for a product named "${productName}" in the category "${category}". Make it sound premium and inspiring.`,
        });
        return response.text || "Experience premium quality with our latest collection.";
    } catch (e) {
        console.error(e);
        return "Experience premium quality with our latest collection.";
    }
}

export const analyzeErrorLog = async (logData: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a Senior DevOps Engineer. Analyze the following system diagnostic log and suggest a technical solution in 1 concise sentence: "${logData}"`,
        });
        return response.text || "Recommended action: Perform a system restart.";
    } catch (e) {
        console.error(e);
        return "Recommended action: Check server logs manually.";
    }
}
