import 'dotenv/config';
import express from 'express';
import path from 'path';
import analyzeRoutes from './routes/analyze.routes.js';
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const app = express();
app.use(express.json());
app.use(express.static('public')); // simple UI
app.use('/api', analyzeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ClankerProduce running on :${PORT}`));
