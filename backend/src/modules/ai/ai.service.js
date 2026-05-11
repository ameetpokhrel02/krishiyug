import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS, EXTRACTION_PROMPT } from './ai.prompts.js';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
  static model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  static visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * General chat completion for farmers
   */
  static async chatWithFarmer(history, message) {
    const chat = this.model.startChat({
      history: history,
      systemInstruction: SYSTEM_PROMPTS.FARMER_CHATBOT,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  }

  /**
   * Extract structured claim data from chat history
   */
  static async extractClaimData(history) {
    const prompt = `${EXTRACTION_PROMPT}\n\nConversation history:\n${JSON.stringify(history)}`;
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean up potential markdown formatting in response
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse claim data:', text);
      return null;
    }
  }

  /**
   * Analyze claim evidence (images)
   */
  static async analyzeEvidence(imageBuffer, mimeType) {
    const prompt = SYSTEM_PROMPTS.INSURANCE_OFFICER_ASSISTANT + 
      "\n\nPlease analyze this evidence photo and provide a risk assessment.";

    const result = await this.visionModel.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  }

  /**
   * Generate claim summary for Ward/Insurance officers
   */
  static async generateSummary(claimData, role) {
    const systemPrompt = role === 'ward' ? 
      SYSTEM_PROMPTS.WARD_OFFICER_ASSISTANT : 
      SYSTEM_PROMPTS.INSURANCE_OFFICER_ASSISTANT;

    const prompt = `Claim Data:\n${JSON.stringify(claimData)}\n\nPlease provide a professional summary.`;
    
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemPrompt
    });

    const response = await result.response;
    return response.text();
  }
}
