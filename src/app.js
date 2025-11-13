import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import analyzeRoutes from './routes/analyze.routes.js';

const app = express();
app.use(express.json());

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API
app.use('/api', analyzeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ClankerProduce running on :${PORT}`));
