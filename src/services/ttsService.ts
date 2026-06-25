import * as Speech from 'expo-speech';
import { Language, LanguageConfig } from '../core/types';
import { AppConstants } from '../core/constants';
import { TtsError } from '../core/errors';

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
            reject(new TtsError(`TTS error: ${error}`));
          },
          onStopped: () => {
            this.speaking = false;
            resolve();
          },
        });
      });
    } catch (e) {
      this.speaking = false;
      if (e instanceof TtsError) throw e;
      throw new TtsError(`Failed to speak: ${e}`);
    }
  }

  async stop(): Promise<void> {
    this.speaking = false;
    await Speech.stop();
  }

  get isSpeaking(): boolean {
    return this.speaking;
  }

  async isAvailable(): Promise<boolean> {
    // expo-speech is always available on native
    return true;
  }
}

export const ttsService = new TtsService();
