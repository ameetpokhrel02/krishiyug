import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleChat } from './ai.controller.js';

const router = express.Router();

// Rate limit for AI requests to prevent abuse and manage Groq API costs
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/chat', aiRateLimiter, handleChat);

export default router;
