# 🔧 Troubleshooting - Deploy Vercel

## Problemas Comuns e Soluções

### 1. Erro: "Deployment failed" ou "no site"

#### Possíveis Causas:

**A) Caminho de importação incorreto**
- Verifique se `api/index.js` está importando corretamente de `../src/index.js`
- Certifique-se de que a estrutura de pastas está correta

**B) Erro ao carregar dependências**
- Verifique se todas as dependências estão em `dependencies` (não `devDependencies`)
- O Vercel não instala `devDependencies` em produção

**C) Erro de sintaxe ou módulo não encontrado**
- Verifique os logs do Vercel no dashboard
- Procure por erros de importação

**D) Workers/Background jobs causando problemas**
- Workers foram desabilitados no Vercel (correto)
- Se ainda houver erro, verifique se algum import está falhando

### 2. Como Verificar os Logs do Vercel

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá em **Deployments**
4. Clique no deployment que falhou
5. Veja a aba **Logs** ou **Build Logs**
6. Procure por erros em vermelho

### 3. Erros Comuns nos Logs

#### "Cannot find module"
```
Error: Cannot find module './routes/youtube.js'
```
**Solução:** Verifique se o caminho está correto e se o arquivo existe

#### "Unexpected token" ou erro de sintaxe
```
SyntaxError: Unexpected token
```
**Solução:** Verifique se há erros de sintaxe no código

#### "Module not found" para dependências
```
Error: Cannot find module 'express'
```
**Solução:** Verifique se `express` está em `dependencies` no `package.json`

#### "Top-level await is not enabled"
```
SyntaxError: Top-level await is not enabled
```
**Solução:** Certifique-se de que `package.json` tem `"type": "module"`

### 4. Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] `vercel.json` existe na raiz do projeto
- [ ] `api/index.js` existe e importa corretamente de `../src/index.js`
- [ ] `src/index.js` exporta o app: `export default app;`
- [ ] `package.json` tem `"type": "module"`
- [ ] Todas as dependências estão em `dependencies` (não `devDependencies`)
- [ ] Não há erros de sintaxe no código
- [ ] Os caminhos de import estão corretos (relativos à estrutura de pastas)

### 5. Teste Local com Vercel CLI

Instale o Vercel CLI e teste localmente:

```bash
npm i -g vercel
vercel dev
```

Isso simula o ambiente do Vercel localmente e mostra erros antes do deploy.

### 6. Estrutura de Arquivos Esperada

```
projeto/
├── vercel.json          ← Configuração do Vercel
├── package.json         ← Dependências
├── api/
│   └── index.js        ← Serverless function wrapper
└── src/
    └── index.js        ← App Express (exporta app)
```

### 7. Se o Deploy Ainda Falhar

1. **Copie o erro completo dos logs do Vercel**
2. **Verifique a linha específica do erro**
3. **Teste localmente com `vercel dev`**
4. **Simplifique temporariamente**: Remova imports problemáticos para isolar o erro

### 8. Limitações do Vercel

⚠️ **Importante:** O Vercel tem limitações:

- ❌ Não suporta processos em background (workers)
- ❌ Não suporta FFmpeg por padrão (precisa de build customizado)
- ❌ Sistema de arquivos é read-only (exceto `/tmp`)
- ⏱️ Timeout máximo de 30s (pode aumentar para 300s no plano Pro)
- 💾 Memória limitada (até 3GB no plano Pro)

### 9. Alternativa: Usar Railway para Este Projeto

Se o Vercel continuar dando problemas devido às limitações (FFmpeg, workers, etc.), considere:

- ✅ **Railway**: Suporta servidores tradicionais, FFmpeg, workers
- ✅ **Render**: Similar ao Railway
- ✅ **Fly.io**: Suporta Docker e processos longos

O projeto já está configurado para Railway e funciona bem lá.

---

## Próximos Passos

1. Verifique os logs do Vercel para ver o erro específico
2. Compartilhe o erro completo para diagnóstico mais preciso
3. Considere se o Vercel é a melhor plataforma para este projeto (dado FFmpeg/workers)
