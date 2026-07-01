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
  private isLoaded = false;

  // ponytail: no-op. Ceiling: tidak ada model on-device yang dimuat — service
  // hanya proxy ke Google API. Dipertahankan agar kontrak modelStore tetap utuh
  // untuk roadmap on-device. Upgrade path: muat model TFLite/ONNX dari _modelPath.
  async loadModel(_modelPath?: string): Promise<void> {
    this.isLoaded = true;
  }

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

    // Google Translate API has ~5000 char limit per request
    // Split long text into chunks and translate each
    const CHUNK_SIZE = 4500;

    if (text.length <= CHUNK_SIZE) {
      return this.translateChunk(text, sl, tl);
    }

    // Split by sentences/paragraphs for long text
    const chunks = this.splitIntoChunks(text, CHUNK_SIZE);
    const results: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      // Space out multi-chunk requests to avoid bursting the free endpoint's
      // rate limit (which triggers HTTP 429).
      if (i > 0) {
        await this.delay(300);
      }
      const translated = await this.translateChunk(chunks[i], sl, tl);
      results.push(translated);
    }

    return results.join('');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
            await this.delay(backoff);
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
        const message = String(error?.message ?? '');
        const isTransient =
          message.includes('429') ||
          message.includes('Network') ||
          message.includes('timeout') ||
          /status 5\d\d/.test(message);
        if (isTransient && attempt < MAX_ATTEMPTS - 1) {
          const backoff = 500 * Math.pow(2, attempt) + Math.random() * 250;
          await this.delay(backoff);
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
