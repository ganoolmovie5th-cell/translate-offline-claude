import { Language, TranslationResult } from '../core/types';

/**
 * Translation service using Google Translate (free endpoint, no API key).
 *
 * Uses the same endpoint that translate.google.com uses internally.
 * Provides accurate EN↔ID translations.
 *
 * In production, replace with on-device TFLite/ONNX model for true offline support.
 */
class TranslationService {
  async translate(
    text: string,
    source: Language,
    target: Language
  ): Promise<TranslationResult> {
    if (text.trim().length === 0) {
      throw new Error('Input text is empty');
    }

    const translatedText = await this.translateWithGoogle(text, source, target);

    return {
      translatedText,
      sourceLanguage: source,
      targetLanguage: target,
    };
  }

  private async translateWithGoogle(
    text: string,
    source: Language,
    target: Language
  ): Promise<string> {
    const sl = source === Language.EN ? 'en' : 'id';
    const tl = target === Language.EN ? 'en' : 'id';

    // Preserve formatting: split by paragraphs, translate each, rejoin.
    // This keeps bullet points, numbered lists, and paragraph structure intact.
    const paragraphs = text.split(/(\n\s*\n|\n(?=[-•●▪▸►]\s)|\n(?=\d+[.)]\s))/);
    
    if (paragraphs.length <= 1 || text.length <= 4500) {
      // Short text or single paragraph — translate as one chunk
      return this.translateStructured(text, sl, tl);
    }

    // Translate paragraph by paragraph to preserve structure
    const results: string[] = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      // Separators (newlines between paragraphs) — keep as-is
      if (/^\n/.test(para) && para.trim().length === 0) {
        results.push(para);
        continue;
      }
      if (para.trim().length === 0) {
        results.push(para);
        continue;
      }
      if (i > 0 && results.length > 0) {
        await new Promise(r => setTimeout(r, 200));
      }
      const translated = await this.translateStructured(para, sl, tl);
      results.push(translated);
    }
    return results.join('');
  }

  /**
   * Translate a single paragraph, preserving inline formatting like
   * bullet prefixes and numbering.
   */
  private async translateStructured(text: string, sl: string, tl: string): Promise<string> {
    // Detect and preserve line-level formatting (bullets, numbers)
    const lines = text.split('\n');
    const hasFormatting = lines.some(l => /^(\s*[-•●▪▸►]\s|\s*\d+[.)]\s)/.test(l));

    if (!hasFormatting || lines.length <= 1) {
      // No special formatting — use chunked translation
      return this.translateChunked(text, sl, tl);
    }

    // Translate formatted lines individually to preserve prefixes
    const results: string[] = [];
    for (const line of lines) {
      if (line.trim().length === 0) {
        results.push(line);
        continue;
      }
      // Extract prefix (bullet/number) and content
      const match = line.match(/^(\s*(?:[-•●▪▸►]|\d+[.)])\s+)(.*)/);
      if (match) {
        const [, prefix, content] = match;
        if (content.trim()) {
          const translated = await this.translateChunked(content, sl, tl);
          results.push(prefix + translated);
        } else {
          results.push(line);
        }
      } else {
        const translated = await this.translateChunked(line, sl, tl);
        results.push(translated);
      }
    }
    return results.join('\n');
  }

  private async translateChunked(text: string, sl: string, tl: string): Promise<string> {
    const CHUNK_SIZE = 4500;
    if (text.length <= CHUNK_SIZE) {
      return this.translateChunk(text, sl, tl);
    }
    const chunks = this.splitIntoChunks(text, CHUNK_SIZE);
    const results: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        await new Promise(r => setTimeout(r, 300));
      }
      const translated = await this.translateChunk(chunks[i], sl, tl);
      results.push(translated);
    }
    return results.join('');
  }

  private splitIntoChunks(text: string, maxSize: number): string[] {
    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxSize) {
        chunks.push(remaining);
        break;
      }

      // Try to split at sentence boundary
      let splitAt = remaining.lastIndexOf('. ', maxSize);
      if (splitAt === -1 || splitAt < maxSize * 0.5) {
        splitAt = remaining.lastIndexOf(' ', maxSize);
      }
      if (splitAt === -1 || splitAt < maxSize * 0.3) {
        splitAt = maxSize;
      }

      chunks.push(remaining.substring(0, splitAt + 1));
      remaining = remaining.substring(splitAt + 1);
    }

    return chunks;
  }

  // Alternate Google endpoints. The free service rate-limits per host/client,
  // so rotating gives a chunk a second chance before we surface an error.
  private buildEndpoints(text: string, sl: string, tl: string): string[] {
    const q = encodeURIComponent(text);
    return [
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${q}`,
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sl}&tl=${tl}&q=${q}`,
    ];
  }

  private async translateChunk(
    text: string,
    sl: string,
    tl: string
  ): Promise<string> {
    const endpoints = this.buildEndpoints(text, sl, tl);
    const MAX_ATTEMPTS = 3;
    let lastError: any = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // Cycle through the available endpoints across attempts.
      const url = endpoints[attempt % endpoints.length];

      try {
        const response = await fetch(url, {
          headers: {
            // A browser-like User-Agent makes the unauthenticated endpoint far
            // less likely to throttle us with HTTP 429.
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 ' +
              '(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            Accept: '*/*',
          },
        });

        // 429 (rate limited) and 5xx are transient: back off and retry.
        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`API returned status ${response.status}`);
          if (attempt < MAX_ATTEMPTS - 1) {
            // Exponential backoff with jitter: ~500ms, ~1000ms, ...
            const backoff = 500 * Math.pow(2, attempt) + Math.random() * 250;
            await new Promise(r => setTimeout(r, backoff));
            continue;
          }
          throw lastError;
        }

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const translated = this.parseResponse(await response.json());
        if (translated) {
          return translated;
        }
        throw new Error('Unexpected API response format');
      } catch (error: any) {
        lastError = error;
        // Retry transient failures; otherwise break to fallback handling.
        const message = error?.message ?? '';
        const isTransient =
          message.includes('429') ||
          message.includes('Network') ||
          message.includes('timeout') ||
          /status 5\d\d/.test(message);
        if (isTransient && attempt < MAX_ATTEMPTS - 1) {
          const backoff = 500 * Math.pow(2, attempt) + Math.random() * 250;
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
        break;
      }
    }

    // All attempts exhausted.
    const message = String(lastError?.message ?? '');
    if (message.includes('429')) {
      throw new Error(
        'Translation service is busy right now (rate limited). Please wait a moment and try again.'
      );
    }
    throw new Error(
      message.includes('Network')
        ? 'Translation failed. Check your internet connection.'
        : `Translation failed: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Parses the nested-array response shared by both Google endpoints.
   * Format: [[["translated text","source text",...],...],...]
   */
  private parseResponse(data: any): string | null {
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .filter((segment: any) => segment && segment[0])
        .map((segment: any) => segment[0])
        .join('');
      return translated || null;
    }
    // clients5 dict-chrome-ex sometimes returns ["text","lang"]
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return data[0] || null;
    }
    return null;
  }

}

export const translationService = new TranslationService();
