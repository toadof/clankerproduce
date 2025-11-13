import fs from 'fs/promises';
import { extractMetadata } from '../services/metadata.service.js';
import { scoreMetadata } from '../services/scoring.service.js';

export async function analyzeImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 1. Extract metadata
        const metadata = await extractMetadata(req.file.path);

        // 2. Score the metadata (AI vs REAL)
        const { score, label, reasons } = scoreMetadata(metadata);

        // 3. Return response in the correct format
        return res.json({
            score,
            label,
            topReasons: reasons        // frontend depends on this
        });

    } catch (error) {
        console.error("Analyze error:", error);
        return res.status(500).json({ error: "Analyze failed" });

    } finally {
        // ALWAYS delete the uploaded file
        try { await fs.unlink(req.file.path); } catch {}
    }
}
