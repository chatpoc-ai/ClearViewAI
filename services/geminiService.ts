import { GoogleGenAI } from "@google/genai";
import { ProcessingOptions } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Removes watermarks from an image using Gemini's image editing capabilities.
 * @param imageBase64 The base64 string of the original image (with or without prefix)
 * @param options Processing configuration
 * @returns The base64 string of the processed image
 */
export const removeWatermark = async (
  imageBase64: string,
  options: ProcessingOptions
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Ensure we have clean base64 data
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  // Construct a prompt based on aggressiveness
  let promptText = "Remove the watermark from this image. Fill in the removed areas to match the background seamlessly.";

  if (options.aggressiveness < 30) {
    promptText = "Gently remove the most obvious watermarks or text overlays from this image, preserving all other details.";
  } else if (options.aggressiveness > 70) {
    promptText = "Aggressively remove all watermarks, text, logos, and transparent patterns overlaying this image. Reconstruct the background where the watermarks were removed.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png', // Assuming PNG for output consistency, or we could detect. Gemini handles detection usually.
            },
          },
          {
            text: promptText,
          },
        ],
      },
      // Note: responseMimeType is not supported for nano banana series (flash-image)
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const processedBase64 = part.inlineData.data;
          // Return with appropriate prefix
          return `data:image/png;base64,${processedBase64}`;
        }
      }
    }
    
    // Fallback if no image found in response parts
    if (response.text) {
        throw new Error("The AI returned text instead of an image. Please try again with a different image or setting.");
    }

    throw new Error("Failed to generate processed image. No image data received.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred during processing.");
  }
};
