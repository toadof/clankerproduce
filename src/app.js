import 'dotenv/config';
import express from 'express';
import path from 'path';
import analyzeRoutes from './routes/analyze.routes.js';

const app = express();
app.use(express.json());
app.use(express.static('public')); // simple UI
app.use('/api', analyzeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ClankerProduce running on :${PORT}`));
