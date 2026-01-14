# Configuração de Cookies do YouTube

Para evitar erros 403 ao fazer download de vídeos do YouTube, você precisa configurar cookies válidos.

## Como obter os cookies do YouTube

1. **Usando extensão do navegador:**
   - Instale uma extensão como "Get cookies.txt LOCALLY" ou "cookies.txt" no Chrome/Edge
   - Acesse youtube.com e faça login
   - Use a extensão para exportar os cookies no formato Netscape
   - Salve o conteúdo em um arquivo ou copie para variável de ambiente

2. **Usando yt-dlp diretamente:**
   ```bash
   yt-dlp --cookies-from-browser chrome
   ```
   Isso criará um arquivo `cookies.txt` automaticamente.

## Configuração no Vercel

### Opção 1: Variável de Ambiente (Recomendado)

1. Acesse o painel do Vercel
2. Vá em Settings > Environment Variables
3. Adicione uma nova variável:
   - **Nome:** `YOUTUBE_COOKIES`
   - **Valor:** Cole o conteúdo completo do arquivo cookies.txt (formato Netscape)
   - **Ambiente:** Production, Preview, Development (conforme necessário)

### Opção 2: Arquivo de Cookies

1. Crie um arquivo `cookies.txt` na raiz do projeto (formato Netscape)
2. Adicione a variável de ambiente:
   - **Nome:** `YOUTUBE_COOKIES_FILE`
   - **Valor:** `/path/to/cookies.txt` (caminho absoluto no servidor)
   - **Ambiente:** Production, Preview, Development

## Formato do arquivo de cookies (Netscape)

O arquivo deve seguir o formato Netscape cookies:

```
# Netscape HTTP Cookie File
# This is a generated file! Do not edit.

.youtube.com	TRUE	/	FALSE	1735689600	VISITOR_INFO1_LIVE	abc123...
.youtube.com	TRUE	/	FALSE	1735689600	YSC	xyz789...
```

## Notas Importantes

- Os cookies expiram periodicamente. Você precisará atualizá-los quando começar a receber erros 403 novamente.
- **NÃO** commite o arquivo `cookies.txt` no repositório Git (adicione ao `.gitignore`)
- Os cookies são específicos da sua conta do YouTube. Use-os apenas para fins legítimos.
- O sistema tentará usar cookies na seguinte ordem:
  1. Variável `YOUTUBE_COOKIES_FILE` (caminho para arquivo)
  2. Variável `YOUTUBE_COOKIES` (conteúdo do arquivo)
  3. Arquivo `cookies.txt` na raiz do projeto

## Verificação

Após configurar os cookies, teste fazendo um download de vídeo. Se ainda receber erro 403:
- Verifique se os cookies não expiraram
- Certifique-se de que o formato está correto (Netscape)
- Verifique os logs do servidor para mensagens sobre cookies
