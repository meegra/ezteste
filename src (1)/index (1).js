import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import youtubeRoutes from "./routes/youtube.js";
import authRoutes from "./routes/auth.js";
import downloadRoutes from "./routes/download.js";
import trimRoutes from "./routes/trim.js";
import generateRoutes from "./routes/generate.js";
import nichesRoutes from "./routes/niches.js";
import retentionRoutes from "./routes/retention.js";

// Detectar se está rodando no Vercel
// Vercel define várias variáveis de ambiente
const isVercel = !!(
  process.env.VERCEL || 
  process.env.VERCEL_ENV || 
  process.env.VERCEL_URL ||
  process.env.NOW_REGION
);

// Função para inicializar workers (apenas fora do Vercel)
async function initializeWorkers() {
  if (isVercel) {
    console.log('[INIT] ℹ️ Rodando no Vercel - workers desabilitados');
    return;
  }
  
  try {
    // Importar videoStore e configurar no videoProcessor
    const { videoStore } = await import("./controllers/downloadProgressController.js");
    const { setVideoStore } = await import("./services/videoProcessor.js");
    
    // Configurar videoStore no videoProcessor ANTES de importar o worker
    setVideoStore(videoStore);
    console.log('[INIT] ✅ VideoStore configurado no videoProcessor');
    
    // Importar e configurar worker para processar jobs (funciona mesmo sem Redis)
    await import("./workers/videoProcessWorker.js");
    const { configureWorker } = await import("./workers/videoProcessWorker.js");
    
    // Configurar worker com videoStore
    configureWorker(videoStore);
    console.log('[INIT] ✅ Worker configurado com videoStore');
  } catch (error) {
    console.warn('[INIT] ⚠️ Aviso: Não foi possível configurar workers:', error.message);
    // Continua mesmo se workers falharem
  }
}

// Inicializar workers de forma assíncrona (não bloqueia a exportação do app)
initializeWorkers().catch(err => {
  console.warn('[INIT] ⚠️ Erro ao inicializar workers:', err.message);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

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
// INICIALIZAÇÃO
// =====================
async function initializeServer() {
  if (!isVercel) {
    try {
      // Configurar ffmpeg antes de iniciar o servidor
      console.log('[INIT] Verificando ffmpeg...');
      const { configureFfmpeg } = await import("./utils/ffmpegDetector.js");
      await configureFfmpeg();
      console.log('[INIT] ✅ ffmpeg configurado com sucesso');
    } catch (error) {
      console.error('[INIT] ⚠️ Aviso: ffmpeg não está configurado corretamente:', error.message);
      console.error('[INIT] Algumas funcionalidades podem não funcionar. Por favor, instale o ffmpeg.');
    }
  }
  
  // Iniciar servidor apenas se não estiver no Vercel
  // (Vercel gerencia o servidor automaticamente)
  if (!isVercel) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 EZ Clips rodando na porta ${PORT}`);
    });
  }
}

// Exportar app para uso como serverless function (Vercel)
export default app;

// Inicializar servidor apenas se não estiver rodando como serverless function
// Vercel não define VERCEL, mas podemos verificar se estamos em ambiente serverless
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  initializeServer();
}
