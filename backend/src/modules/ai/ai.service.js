import Groq from "groq-sdk";
import { SYSTEM_GUIDE_PROMPT } from "./ai.prompts.js";

let groq;

const MODEL_CANDIDATES = [
    process.env.AI_MODEL,
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
].filter(Boolean);

const getGroqClient = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured. Set it in your .env file or remove AI route usage.");
    }

    if (!groq) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    return groq;
};

export const getAIResponse = async (history) => {
    try {
        const groqClient = getGroqClient();
        const messages = [
            { role: "system", content: SYSTEM_GUIDE_PROMPT },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: typeof msg.content === 'string' ? msg.content : (Array.isArray(msg.parts) ? msg.parts[0].text : String(msg.content || ''))
            }))
        ];

        let lastError = null;

        for (const model of MODEL_CANDIDATES) {
            try {
                const completion = await groqClient.chat.completions.create({
                    messages,
                    model,
                    temperature: 0.6,
                    max_tokens: 1024,
                    top_p: 1,
                    stream: false,
                });

                return completion.choices[0]?.message?.content || "माफ गर्नुहोस्, म अहिले उत्तर दिन सकिनँ।";
            } catch (error) {
                lastError = error;

                const errorMessage = error?.message || "";
                const errorCode = error?.code || error?.error?.code || "";
                const isModelIssue =
                    errorCode === "model_decommissioned" ||
                    errorMessage.toLowerCase().includes("decommissioned") ||
                    errorMessage.toLowerCase().includes("no longer supported");

                if (!isModelIssue) {
                    throw error;
                }
            }
        }

        throw lastError || new Error("Failed to get response from AI Assistant");
    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new Error(error.message || "Failed to get response from AI Assistant");
    }
};
