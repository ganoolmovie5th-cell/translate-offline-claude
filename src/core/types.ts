export enum Language {
  EN = 'en',
  ID = 'id',
}

export const LanguageConfig = {
  [Language.EN]: {
    displayName: 'English',
    locale: 'en-US',
  },
  [Language.ID]: {
    displayName: 'Indonesia',
    locale: 'id-ID',
  },
} as const;

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
}
