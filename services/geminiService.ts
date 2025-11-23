import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Professional } from "../types";

const API_KEY = process.env.API_KEY || '';

if (!API_KEY) {
  console.warn("API Key is missing. Check process.env.API_KEY");
}

class GeminiService {
  private client: GoogleGenAI;
  private currentChat: Chat | null = null;
  private currentProfessionalId: string | null = null;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: API_KEY });
  }

  /**
   * Initializes or resets a chat session for a specific professional.
   */
  public startChat(professional: Professional): void {
    // If we are already chatting with this professional, do nothing (preserve history)
    // Or, for this app's logic, maybe we want to reset if the user clicks the card again?
    // Let's assume selecting a card switches context. If it's the same card, we keep history.
    if (this.currentProfessionalId === professional.id && this.currentChat) {
        return; 
    }

    this.currentProfessionalId = professional.id;
    this.currentChat = this.client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: professional.systemInstruction,
        temperature: 0.7, // Balance between creativity and precision
      },
    });
  }

  /**
   * Sends a message and returns a stream.
   */
  public async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.currentChat) {
      throw new Error("Chat session not initialized.");
    }

    try {
      const resultStream = await this.currentChat.sendMessageStream({ message });
      
      for await (const chunk of resultStream) {
        const responseChunk = chunk as GenerateContentResponse;
        const text = responseChunk.text;
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
