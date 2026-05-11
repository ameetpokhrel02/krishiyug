import Groq from "groq-sdk";
import { SYSTEM_GUIDE_PROMPT } from "./ai.prompts.js";

// Lazy initialization to ensure process.env.GROQ_API_KEY is loaded
let groq = null;
const getGroq = () => {
    if (!groq) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return groq;
};

export const getAIResponse = async (history) => {
    try {
        const groqInstance = getGroq();
        const messages = [
            { role: "system", content: SYSTEM_GUIDE_PROMPT },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: typeof msg.content === 'string' ? msg.content : (Array.isArray(msg.parts) ? msg.parts[0].text : String(msg.content || ''))
            }))
        ];

        // Filter out empty messages to prevent API errors
        const validMessages = messages.filter(m => m.content.trim().length > 0);

        const completion = await groqInstance.chat.completions.create({
            messages: validMessages,
            model: process.env.AI_MODEL || "llama-3.1-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new Error(error.message || "Failed to get response from AI Assistant");
    }
};
