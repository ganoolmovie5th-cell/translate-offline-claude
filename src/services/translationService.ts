import { Language, TranslationResult } from '../core/types';
import { TranslationError } from '../core/errors';
import { AppConstants } from '../core/constants';

/**
 * Translation service using on-device model.
 * Currently uses a placeholder implementation.
 * Replace with actual TFLite/ONNX inference when model is ready.
 */
class TranslationService {
  private isLoaded = false;

  async loadModel(modelPath: string): Promise<void> {
    // Placeholder: in production, load TFLite model from file
    // const model = await TFLite.loadModel(modelPath);
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

    // Truncate if exceeds max
    const input =
      text.length > AppConstants.maxInputChars
        ? text.substring(0, AppConstants.maxInputChars)
        : text;

    // Placeholder translation - replace with actual model inference
    const translatedText = await this.runInference(input, source, target);

    return {
      sourceText: input,
      translatedText,
      sourceLanguage: source,
      targetLanguage: target,
    };
  }

  private async runInference(
    text: string,
    source: Language,
    target: Language
  ): Promise<string> {
    // Simulate inference delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Placeholder: In production, this would:
    // 1. Tokenize text with SentencePiece
    // 2. Run TFLite interpreter
    // 3. Detokenize output
    //
    // For demo purposes, return a mock translation
    if (source === Language.EN && target === Language.ID) {
      return this.mockEnToId(text);
    } else {
      return this.mockIdToEn(text);
    }
  }

  private mockEnToId(text: string): string {
    // Simple word-level mock translations for demo
    const dict: Record<string, string> = {
      hello: 'halo',
      'good morning': 'selamat pagi',
      'good night': 'selamat malam',
      'thank you': 'terima kasih',
      'how are you': 'apa kabar',
      yes: 'ya',
      no: 'tidak',
      please: 'tolong',
      sorry: 'maaf',
      goodbye: 'selamat tinggal',
    };

    const lower = text.toLowerCase().trim();
    if (dict[lower]) return dict[lower];

    // Fallback: return with prefix
    return `[ID] ${text}`;
  }

  private mockIdToEn(text: string): string {
    const dict: Record<string, string> = {
      halo: 'hello',
      'selamat pagi': 'good morning',
      'selamat malam': 'good night',
      'terima kasih': 'thank you',
      'apa kabar': 'how are you',
      ya: 'yes',
      tidak: 'no',
      tolong: 'please',
      maaf: 'sorry',
      'selamat tinggal': 'goodbye',
    };

    const lower = text.toLowerCase().trim();
    if (dict[lower]) return dict[lower];

    return `[EN] ${text}`;
  }

  get modelLoaded(): boolean {
    return this.isLoaded;
  }

  dispose(): void {
    this.isLoaded = false;
  }
}

export const translationService = new TranslationService();
