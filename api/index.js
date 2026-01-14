// Serverless function wrapper para Vercel
// Este arquivo importa o app Express e o exporta como serverless function

// Definir variável de ambiente para indicar que está rodando no Vercel
// Isso ajuda na detecção de ambiente no src/index.js
if (!process.env.VERCEL) {
  process.env.VERCEL = '1';
}

// Importar o app Express
// O caminho é relativo à raiz do projeto: api/index.js -> src/index.js
import app from '../src/index.js';

// Verificar se o app foi importado corretamente
if (!app) {
  console.error('[VERCEL] ❌ Erro: App não foi exportado de src/index.js');
  throw new Error('App Express não foi exportado corretamente');
}

console.log('[VERCEL] ✅ App Express carregado com sucesso');

// Exportar como handler para Vercel
export default app;
