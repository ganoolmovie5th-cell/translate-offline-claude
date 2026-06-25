import { Language } from '../core/types';
import { SttError } from '../core/errors';

type SttCallbacks = {
  onResult: (text: string) => void;
  onPartial: (text: string) => void;
  onError: (error: string) => void;
};

/**
 * Speech-to-Text service.
 *
 * NOTE: Native STT requires a Development Build (not Expo Go).
 * In Expo Go, this will show a friendly error message.
 *
 * For full STT support:
 * 1. npx expo install expo-speech-recognition
 * 2. npx expo prebuild
 * 3. npx expo run:android (or run:ios)
 *
 * For now, this provides a stub that shows the user a helpful message.
 */
class SttService {
  private listening = false;
  private callbacks: SttCallbacks | null = null;

  async initialize(): Promise<boolean> {
    // STT not available in Expo Go
    return false;
  }

  async startListening(
    language: Language,
    callbacks: SttCallbacks
  ): Promise<void> {
    this.callbacks = callbacks;

    // In Expo Go, STT is not available
    // Show a helpful error to the user
    callbacks.onError(
      'Voice input requires a Development Build. ' +
        'Run "npx expo prebuild && npx expo run:android" to enable it.'
    );
  }

  async stopListening(): Promise<void> {
    this.listening = false;
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }

  get isListening(): boolean {
    return this.listening;
  }
}

export const sttService = new SttService();
