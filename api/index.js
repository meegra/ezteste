// Serverless function wrapper para Vercel
// Este arquivo cria o app Express diretamente para evitar problemas de importação

import express from "express";
import cors from "cors";
import path from "path";

// Definir variável de ambiente para indicar que está rodando no Vercel
process.env.VERCEL = '1';

// Usar process.cwd() que funciona tanto em ESM quanto CommonJS
// No Vercel, process.cwd() aponta para a raiz do projeto
const projectRoot = process.cwd();

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
const publicDir = path.join(projectRoot, "public");
app.use(express.static(publicDir));

// ⚠️ ESSENCIAL: rota raiz
app.get("/", (req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Erro ao servir index.html:', err);
      res.status(404).json({ error: 'Frontend não encontrado' });
    }
  });
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
