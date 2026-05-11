import { Router } from 'express';
import { AIController } from './ai.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// AI Chat endpoint
router.post('/chat', AIController.chat);

// Evidence analysis endpoint
router.post('/analyze-evidence', upload.single('image'), AIController.analyzeImage);

// Summary generation endpoint
router.post('/summarize', AIController.summarize);

export default router;
