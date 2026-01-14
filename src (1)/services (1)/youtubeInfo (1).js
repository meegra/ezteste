import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gerencia cookies do YouTube para evitar erro 403
 */
let cookiesFilePath = null;

function getCookiesPath() {
  if (cookiesFilePath && fs.existsSync(cookiesFilePath)) {
    return cookiesFilePath;
  }

  const cookiesFileEnv = process.env.YOUTUBE_COOKIES_FILE;
  if (cookiesFileEnv && fs.existsSync(cookiesFileEnv)) {
    cookiesFilePath = cookiesFileEnv;
    return cookiesFilePath;
  }

  const cookiesEnv = process.env.YOUTUBE_COOKIES;
  if (cookiesEnv) {
    try {
      const tempDir = os.tmpdir();
      const tempCookiesFile = path.join(tempDir, `youtube_cookies_${Date.now()}.txt`);
      fs.writeFileSync(tempCookiesFile, cookiesEnv, 'utf8');
      cookiesFilePath = tempCookiesFile;
      return cookiesFilePath;
    } catch (error) {
      console.error(`[COOKIES] Erro ao criar arquivo de cookies: ${error.message}`);
      return null;
    }
  }

  const defaultCookiesPath = path.join(__dirname, '../../cookies.txt');
  if (fs.existsSync(defaultCookiesPath)) {
    cookiesFilePath = defaultCookiesPath;
    return cookiesFilePath;
  }

  return null;
}

/**
 * Obtém informações do vídeo via yt-dlp
 * @param {string} videoId
 */
export function getYouTubeInfo(videoId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const cookiesPath = getCookiesPath();
    let cmd = `yt-dlp --dump-json --no-warnings --no-playlist`;
    
    if (cookiesPath) {
      cmd += ` --cookies "${cookiesPath}"`;
    }
    
    cmd += ` "${url}"`;

    console.log('[YT-DLP] Info:', cmd);

    exec(cmd, { maxBuffer: 1024 * 1024 * 20 }, (error, stdout) => {
      if (error) {
        console.error('[YT-DLP] Erro info:', error);
        return reject(error);
      }

      try {
        const info = JSON.parse(stdout);
        resolve({
          title: info.title,
          duration: info.duration,
          thumbnail: info.thumbnail,
          uploader: info.uploader,
          viewCount: info.view_count
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}
