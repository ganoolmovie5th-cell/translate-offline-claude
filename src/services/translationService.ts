import { Language, LanguageConfig, TranslationResult } from '../core/types';
import { TranslationError } from '../core/errors';
import { AppConstants } from '../core/constants';

/**
 * Translation service.
 *
 * Uses MyMemory Translation API (free, no API key needed, 5000 chars/day).
 * This provides real translations while the on-device model is not yet integrated.
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

    const input =
      text.length > AppConstants.maxInputChars
        ? text.substring(0, AppConstants.maxInputChars)
        : text;

    const translatedText = await this.translateWithAPI(input, source, target);

    return {
      sourceText: input,
      translatedText,
      sourceLanguage: source,
      targetLanguage: target,
    };
  }

  private async translateWithAPI(
    text: string,
    source: Language,
    target: Language
  ): Promise<string> {
    const sourceLang = source === Language.EN ? 'en' : 'id';
    const targetLang = target === Language.EN ? 'en' : 'id';
    const langPair = `${sourceLang}|${targetLang}`;

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        let result = data.responseData.translatedText as string;

        // MyMemory sometimes returns HTML entities, decode them
        result = this.decodeHtmlEntities(result);

        return result;
      }

      // Fallback if API response is unexpected
      throw new Error(data.responseDetails || 'Translation failed');
    } catch (error: any) {
      // If network fails, use basic offline dictionary as fallback
      const fallback = this.offlineFallback(text, source, target);
      if (fallback) return fallback;

      throw new TranslationError(
        `Translation failed: ${error.message || 'Network error'}. Check your internet connection.`
      );
    }
  }

  private decodeHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
  }

  /**
   * Basic offline dictionary fallback when network is unavailable.
   * Returns null if word not found.
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
    beautiful: 'cantik',
    big: 'besar',
    small: 'kecil',
    good: 'bagus',
    bad: 'buruk',
    happy: 'senang',
    sad: 'sedih',
    house: 'rumah',
    car: 'mobil',
    book: 'buku',
    friend: 'teman',
    family: 'keluarga',
    mother: 'ibu',
    father: 'ayah',
    child: 'anak',
    love: 'cinta',
    work: 'kerja',
    school: 'sekolah',
    hospital: 'rumah sakit',
    money: 'uang',
    time: 'waktu',
    day: 'hari',
    night: 'malam',
    morning: 'pagi',
    hot: 'panas',
    cold: 'dingin',
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
    'baik-baik saja': "i'm fine",
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
    'nama saya': 'my name is',
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
    cantik: 'beautiful',
    besar: 'big',
    kecil: 'small',
    bagus: 'good',
    buruk: 'bad',
    senang: 'happy',
    sedih: 'sad',
    rumah: 'house',
    mobil: 'car',
    buku: 'book',
    teman: 'friend',
    keluarga: 'family',
    ibu: 'mother',
    ayah: 'father',
    anak: 'child',
    cinta: 'love',
    kerja: 'work',
    sekolah: 'school',
    'rumah sakit': 'hospital',
    uang: 'money',
    waktu: 'time',
    hari: 'day',
    malam: 'night',
    pagi: 'morning',
    panas: 'hot',
    dingin: 'cold',
  };

  get modelLoaded(): boolean {
    return this.isLoaded;
  }

  dispose(): void {
    this.isLoaded = false;
  }
}

export const translationService = new TranslationService();
