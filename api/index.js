// Serverless function wrapper para Vercel
// Este arquivo cria o app Express diretamente para evitar problemas de importação

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Definir variável de ambiente para indicar que está rodando no Vercel
process.env.VERCEL = '1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rotas
import youtubeRoutes from "../src/routes/youtube.js";
import authRoutes from "../src/routes/auth.js";
import downloadRoutes from "../src/routes/download.js";
import trimRoutes from "../src/routes/trim.js";
import generateRoutes from "../src/routes/generate.js";
import nichesRoutes from "../src/routes/niches.js";
import retentionRoutes from "../src/routes/retention.js";

const app = express();

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// =====================
// API
// =====================
app.use("/api/youtube", youtubeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/trim", trimRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/niches", nichesRoutes);
app.use("/api/retention", retentionRoutes);

// =====================
// FRONTEND ESTÁTICO
// =====================
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

// ⚠️ ESSENCIAL: rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// =====================
// HEALTH
// =====================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// =====================
// ERROR HANDLING
// =====================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

console.log('[VERCEL] ✅ App Express configurado com sucesso');

// Exportar como handler para Vercel
export default app;
