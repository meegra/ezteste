// Serverless function wrapper para Vercel
// Este arquivo importa o app Express e o exporta como serverless function

import app from '../src/index.js';

// Exportar como handler para Vercel
export default app;
