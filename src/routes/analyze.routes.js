import { Router } from 'express';
import { upload } from '../services/upload.service.js';
import { analyzeImage } from '../controllers/analyze.controller.js';

const router = Router();

router.post('/analyze', upload.single('file'), analyzeImage);

// Future features (not used now)
// router.get('/history', history);
// router.get('/report', report);

export default router;
