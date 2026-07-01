import * as Speech from 'expo-speech';
import { Language, LanguageConfig } from '../core/types';
import { AppConstants } from '../core/constants';

/**
 * Text-to-Speech service using expo-speech.
 * Works in Expo Go and Development Builds.
 */
class TtsService {
  private speaking = false;

  async speak(text: string, language: Language): Promise<void> {
    if (!text.trim()) return;

    try {
      this.speaking = true;
      const locale = LanguageConfig[language].locale;

      await new Promise<void>((resolve, reject) => {
        Speech.speak(text, {
          language: locale,
          rate: AppConstants.defaultSpeechRate,
          onDone: () => {
            this.speaking = false;
            resolve();
          },
          onError: (error) => {
            this.speaking = false;
            reject(new Error(`TTS error: ${error}`));
          },
          onStopped: () => {
            this.speaking = false;
            resolve();
          },
        });
      });
    } catch (e) {
      this.speaking = false;
      if (e instanceof Error) throw e;
      throw new Error(`Failed to speak: ${e}`);
    }
  }

  async stop(): Promise<void> {
    this.speaking = false;
    await Speech.stop();
  }

}

export const ttsService = new TtsService();
