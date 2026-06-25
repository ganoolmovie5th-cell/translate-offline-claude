import { create } from 'zustand';
import { Language, TranslationResult } from '../core/types';
import { translationService } from '../services/translationService';
import { sttService } from '../services/sttService';
import { ttsService } from '../services/ttsService';

interface TranslationState {
  // Language
  sourceLanguage: Language;
  targetLanguage: Language;

  // Input/Output
  inputText: string;
  result: TranslationResult | null;

  // Loading states
  isTranslating: boolean;
  isListening: boolean;
  isSpeaking: boolean;

  // STT
  partialSttResult: string;

  // Error
  error: string | null;

  // Actions
  setInputText: (text: string) => void;
  translateText: (text: string) => Promise<void>;
  swapLanguages: () => void;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  speakResult: () => Promise<void>;
  stopSpeaking: () => Promise<void>;
  clearError: () => void;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  sourceLanguage: Language.EN,
  targetLanguage: Language.ID,
  inputText: '',
  result: null,
  isTranslating: false,
  isListening: false,
  isSpeaking: false,
  partialSttResult: '',
  error: null,

  setInputText: (text: string) => {
    set({ inputText: text, error: null });
  },

  translateText: async (text: string) => {
    if (!text.trim()) {
      set({ result: null });
      return;
    }

    set({ isTranslating: true, error: null });

    try {
      const { sourceLanguage, targetLanguage } = get();
      const result = await translationService.translate(
        text,
        sourceLanguage,
        targetLanguage
      );
      set({ result, isTranslating: false });
    } catch (e: any) {
      set({
        error: e.message || 'Translation failed',
        isTranslating: false,
      });
    }
  },

  swapLanguages: () => {
    const { sourceLanguage, targetLanguage, result, inputText } = get();
    const newInput = result?.translatedText ?? inputText;

    set({
      sourceLanguage: targetLanguage,
      targetLanguage: sourceLanguage,
      inputText: newInput,
      result: null,
      isTranslating: false,
    });

    // Auto-translate after swap if there's text (use setTimeout to let state settle)
    if (newInput.trim()) {
      setTimeout(() => {
        get().translateText(newInput);
      }, 50);
    }
  },

  startListening: async () => {
    set({ isListening: true, partialSttResult: '', error: null });

    try {
      const { sourceLanguage } = get();
      await sttService.startListening(sourceLanguage, {
        onResult: (text: string) => {
          set({
            inputText: text,
            isListening: false,
            partialSttResult: '',
          });
          // Auto-translate after speech recognized
          get().translateText(text);
        },
        onPartial: (text: string) => {
          set({ partialSttResult: text });
        },
        onError: (error: string) => {
          set({
            isListening: false,
            error: `Speech recognition failed: ${error}`,
          });
        },
      });
    } catch (e: any) {
      set({
        isListening: false,
        error: e.message || 'Failed to start listening',
      });
    }
  },

  stopListening: async () => {
    await sttService.stopListening();
    set({ isListening: false });
  },

  speakResult: async () => {
    const { result, targetLanguage } = get();
    if (!result) return;

    try {
      set({ isSpeaking: true });
      await ttsService.speak(result.translatedText, targetLanguage);
      set({ isSpeaking: false });
    } catch (e: any) {
      set({
        isSpeaking: false,
        error: 'Could not play audio',
      });
    }
  },

  stopSpeaking: async () => {
    await ttsService.stop();
    set({ isSpeaking: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
