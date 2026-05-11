import Groq from "groq-sdk";
import { SYSTEM_GUIDE_PROMPT } from "./ai.prompts.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getAIResponse = async (history) => {
    try {
        const messages = [
            { role: "system", content: SYSTEM_GUIDE_PROMPT },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: Array.isArray(msg.parts) ? msg.parts[0].text : msg.parts
            }))
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: process.env.AI_MODEL || "llama-3.1-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new Error("Failed to get response from AI Assistant");
    }
};
