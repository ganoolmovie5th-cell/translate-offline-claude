export enum Language {
  EN = 'en',
  ID = 'id',
}

export const LanguageConfig = {
  [Language.EN]: {
    displayName: 'English',
    locale: 'en-US',
    sttLocale: 'en-US',
  },
  [Language.ID]: {
    displayName: 'Indonesia',
    locale: 'id-ID',
    sttLocale: 'id-ID',
  },
} as const;

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}

