import { getAIResponse } from './ai.service.js';

export const handleChat = async (req, res) => {
  try {
    const { history = [], message } = req.body;

    const normalizedHistory = Array.isArray(history) ? [...history] : [];

    if (message) {
      normalizedHistory.push({
        role: 'user',
        parts: [{ text: message }],
      });
    }

    if (normalizedHistory.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'History or message is required',
      });
    }

    const reply = await getAIResponse(normalizedHistory);

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process AI request',
    });
  }
};
