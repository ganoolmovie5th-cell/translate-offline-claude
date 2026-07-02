import * as Speech from 'expo-speech';
import { Language, LanguageConfig } from '../core/types';
import { AppConstants } from '../core/constants';

/**
 * Text-to-Speech service using expo-speech.
 * Works in Expo Go and Development Builds.
 */
class TtsService {
  async speak(text: string, language: Language): Promise<void> {
    if (!text.trim()) return;

    try {
      const locale = LanguageConfig[language].locale;

      await new Promise<void>((resolve, reject) => {
        Speech.speak(text, {
          language: locale,
          rate: AppConstants.defaultSpeechRate,
          onDone: () => resolve(),
          onError: (error) => reject(new Error(`TTS error: ${error}`)),
          onStopped: () => resolve(),
        });
      });
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error(`Failed to speak: ${e}`);
    }
  }

  async stop(): Promise<void> {
    await Speech.stop();
  }

}

export const ttsService = new TtsService();
