import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from '../types';

let chatSession: Chat | null = null;

// Initialization
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Chat Service with Grounding ---

const getUserLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    // Attempt to get location with a timeout so we don't block chat initialization too long
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => {
        console.warn("Location access denied or failed:", err);
        resolve(null);
      },
      { timeout: 5000 } 
    );
  });
};

export const initializeChat = async (products: Product[]) => {
  const ai = getClient();
  
  // Attempt to get location for Maps Grounding context
  const location = await getUserLocation();

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
  4. Use Google Search or Maps if the user asks for real-world info (trends, locations) not in your catalog.
  5. If you use Search or Maps, you must provide the sources.
  `;

  const config: any = {
      systemInstruction: systemInstruction,
      tools: [
        { googleSearch: {} },
        { googleMaps: {} }
      ]
  };

  // Add location context for Maps Grounding if available
  if (location) {
      config.toolConfig = {
          retrievalConfig: {
              latLng: {
                  latitude: location.latitude,
                  longitude: location.longitude
              }
          }
      };
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: config
  });
};

export const sendMessageToAI = async (message: string) => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return {
        text: response.text || "",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having a little trouble connecting to the inventory right now. Please try again in a moment!" };
  }
};

// --- Creative Intelligence Services ---

// 1. Image Generation (Nano Banana Pro)
export const generateMarketingImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    imageSize: size,
                    aspectRatio: "1:1"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated");
    } catch (e) {
        console.error("Image Gen Error", e);
        throw e;
    }
};

// 2. Image Editing (Nano Banana)
export const editProductImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getClient();
    try {
        // Strip prefix if present for API
        const data = base64Image.split(',')[1] || base64Image;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: data,
                            mimeType: 'image/png' // Assuming PNG for canvas exports
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No edited image returned");
    } catch (e) {
        console.error("Image Edit Error", e);
        throw e;
    }
};

// 3. Video Generation (Veo)
// Note: Caller must ensure window.aistudio.hasSelectedApiKey() is true before calling this
export const generateProductVideo = async (base64Image: string, prompt: string): Promise<string> => {
    // Create new instance to pick up the key selected via window.aistudio
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const data = base64Image.split(',')[1] || base64Image;

    try {
        console.log("Starting Veo generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt, // prompt is optional for image-to-video but good to have
            image: {
                imageBytes: data,
                mimeType: 'image/png'
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        console.log("Veo operation started", operation);

        // Polling
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            console.log("Veo polling...", operation.done);
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("No video URI returned");

        // Fetch the actual bytes using the key
        const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

    } catch (e) {
        console.error("Veo Error", e);
        throw e;
    }
};


// --- Utilities ---

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

// Live API Helper (Client needs to be created in component to manage state)
export const getGenAIInstance = () => getClient();