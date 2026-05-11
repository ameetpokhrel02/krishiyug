import { AIService } from './ai.service.js';

export class AIController {
  /**
   * Handle chat messages from farmers
   */
  static async chat(req, res) {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const reply = await AIService.chatWithFarmer(history || [], message);
      
      // Optionally extract claim data in background or when requested
      const extractedData = await AIService.extractClaimData([...(history || []), { role: 'user', parts: [{ text: message }] }, { role: 'model', parts: [{ text: reply }] }]);

      res.json({
        reply,
        extractedData
      });
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Analyze uploaded evidence
   */
  static async analyzeImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      const analysis = await AIService.analyzeEvidence(req.file.buffer, req.file.mimetype);
      res.json({ analysis });
    } catch (error) {
      console.error('AI Image Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Generate summary for ward/insurance
   */
  static async summarize(req, res) {
    try {
      const { claimData, role } = req.body;
      
      if (!claimData || !role) {
        return res.status(400).json({ error: 'Claim data and role are required' });
      }

      const summary = await AIService.generateSummary(claimData, role);
      res.json({ summary });
    } catch (error) {
      console.error('AI Summary Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
