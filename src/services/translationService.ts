import { Language, TranslationResult } from '../core/types';
import { TranslationError } from '../core/errors';
import { AppConstants } from '../core/constants';

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

  async loadModel(_modelPath?: string): Promise<void> {
    this.isLoaded = true;
  }

  async translate(
    text: string,
    source: Language,
    target: Language
  ): Promise<TranslationResult> {
    if (text.trim().length === 0) {
      throw new TranslationError('Input text is empty');
    }

    const translatedText = await this.translateWithGoogle(text, source, target);

    return {
      sourceText: text,
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

    for (const chunk of chunks) {
      const translated = await this.translateChunk(chunk, sl, tl);
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

  private async translateChunk(
    text: string,
    sl: string,
    tl: string
  ): Promise<string> {

    try {
      const url =
        `https://translate.googleapis.com/translate_a/single` +
        `?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      // Google returns nested arrays: [[["translated text","source text",...],...],...]
      // We need to concatenate all translated segments
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .filter((segment: any) => segment && segment[0])
          .map((segment: any) => segment[0])
          .join('');

        if (translated) {
          return translated;
        }
      }

      throw new Error('Unexpected API response format');
    } catch (error: any) {
      // If network fails, use basic offline dictionary as fallback
      const sourceLang = sl === 'en' ? Language.EN : Language.ID;
      const targetLang = tl === 'en' ? Language.EN : Language.ID;
      const fallback = this.offlineFallback(text, sourceLang, targetLang);
      if (fallback) return fallback;

      throw new TranslationError(
        error.message?.includes('Network')
          ? 'No internet connection. Only basic words available offline.'
          : `Translation failed: ${error.message || 'Unknown error'}`
      );
    }
  }

  /**
   * Basic offline dictionary fallback when network is unavailable.
   * Returns null if word not found in dictionary.
   */
  private offlineFallback(
    text: string,
    source: Language,
    target: Language
  ): string | null {
    const lower = text.toLowerCase().trim();

    if (source === Language.EN && target === Language.ID) {
      return this.enToIdDict[lower] ?? null;
    } else {
      return this.idToEnDict[lower] ?? null;
    }
  }

  private enToIdDict: Record<string, string> = {
    hello: 'halo',
    hi: 'hai',
    'good morning': 'selamat pagi',
    'good afternoon': 'selamat siang',
    'good evening': 'selamat sore',
    'good night': 'selamat malam',
    'thank you': 'terima kasih',
    thanks: 'terima kasih',
    'how are you': 'apa kabar',
    "i'm fine": 'saya baik-baik saja',
    yes: 'ya',
    no: 'tidak',
    please: 'tolong',
    sorry: 'maaf',
    'excuse me': 'permisi',
    goodbye: 'selamat tinggal',
    bye: 'dadah',
    'see you': 'sampai jumpa',
    'i love you': 'aku cinta kamu',
    'what is your name': 'siapa namamu',
    'my name is': 'nama saya',
    water: 'air',
    food: 'makanan',
    eat: 'makan',
    drink: 'minum',
    go: 'pergi',
    come: 'datang',
    help: 'tolong',
    where: 'dimana',
    when: 'kapan',
    what: 'apa',
    who: 'siapa',
    why: 'mengapa',
    how: 'bagaimana',
    'how much': 'berapa',
    today: 'hari ini',
    tomorrow: 'besok',
    yesterday: 'kemarin',
  };

  private idToEnDict: Record<string, string> = {
    halo: 'hello',
    hai: 'hi',
    'selamat pagi': 'good morning',
    'selamat siang': 'good afternoon',
    'selamat sore': 'good evening',
    'selamat malam': 'good night',
    'terima kasih': 'thank you',
    'apa kabar': 'how are you',
    ya: 'yes',
    tidak: 'no',
    tolong: 'please',
    maaf: 'sorry',
    permisi: 'excuse me',
    'selamat tinggal': 'goodbye',
    dadah: 'bye',
    'sampai jumpa': 'see you',
    'aku cinta kamu': 'i love you',
    'siapa namamu': 'what is your name',
    air: 'water',
    makanan: 'food',
    makan: 'eat',
    minum: 'drink',
    pergi: 'go',
    datang: 'come',
    dimana: 'where',
    kapan: 'when',
    apa: 'what',
    siapa: 'who',
    mengapa: 'why',
    bagaimana: 'how',
    berapa: 'how much',
    'hari ini': 'today',
    besok: 'tomorrow',
    kemarin: 'yesterday',
  };

  get modelLoaded(): boolean {
    return this.isLoaded;
  }

  dispose(): void {
    this.isLoaded = false;
  }
}

export const translationService = new TranslationService();
