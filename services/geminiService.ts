
import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from '../types';

let chatSession: Chat | null = null;

// Initialization
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Chat Service with Grounding ---

/**
 * Enhanced geolocation fetcher with robust error handling and timeout.
 */
export const getUserLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    if (!window.isSecureContext) {
      console.warn("Geolocation requires a secure context (HTTPS).");
      resolve(null);
      return;
    }

    const options = {
      enableHighAccuracy: false, // Set to false for faster response/less intrusive permission
      timeout: 8000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            console.warn("User denied the request for Geolocation.");
            break;
          case err.POSITION_UNAVAILABLE:
            console.warn("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            console.warn("The request to get user location timed out.");
            break;
          default:
            console.warn("An unknown error occurred getting location.");
            break;
        }
        resolve(null);
      },
      options
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
  
  Contextual Intelligence:
  - Current User Location: ${location ? `Latitude ${location.latitude}, Longitude ${location.longitude}` : 'Unknown/Denied. Ask the user for their city if they inquire about "nearby" stores or trends.'}
  
  Rules:
  1. Always be polite, professional, and concise.
  2. If a user asks for a recommendation, suggest products from the catalog above.
  3. If a user asks about a specific product, provide details based on the catalog.
  4. Use Google Search or Maps if the user asks for real-world info (trends, locations) not in your catalog.
  5. If user location is 'Unknown' and they ask for "nearby" things, politely ask for their location first.
  6. If you use Search or Maps, you must provide the sources.
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

  // Use gemini-2.5-flash for Maps grounding support
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
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        throw new Error("No image generated");
    } catch (e) {
        console.error("Image Gen Error", e);
        throw e;
    }
};

export const editProductImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getClient();
    try {
        const data = base64Image.split(',')[1] || base64Image;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: data,
                            mimeType: 'image/png'
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        throw new Error("No edited image returned");
    } catch (e) {
        console.error("Image Edit Error", e);
        throw e;
    }
};

export const generateProductVideo = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const data = base64Image.split(',')[1] || base64Image;

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
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

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("No video URI returned");

        const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);
    } catch (e) {
        console.error("Veo Error", e);
        throw e;
    }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a compelling, short marketing description (max 2 sentences) for a product named "${productName}" in the category "${category}". Make it sound premium and inspiring.`,
        });
        return response.text || "Experience premium quality with our latest collection.";
    } catch (e) {
        return "Experience premium quality with our latest collection.";
    }
}

export const analyzeErrorLog = async (logData: string): Promise<string> => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `You are a Senior DevOps Engineer. Analyze the following system diagnostic log and suggest a technical solution in 1 concise sentence: "${logData}"`,
        });
        return response.text || "Recommended action: Perform a system restart.";
    } catch (e) {
        return "Recommended action: Check server logs manually.";
    }
}

export const getGenAIInstance = () => getClient();
