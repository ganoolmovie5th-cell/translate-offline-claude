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

export enum ModelType {
  LIGHT = 'light',
  FULL = 'full',
}

export interface ModelInfo {
  type: ModelType;
  fileName: string;
  sizeDescription: string;
  url: string;
}

export const ModelConfig: Record<ModelType, ModelInfo> = {
  [ModelType.LIGHT]: {
    type: ModelType.LIGHT,
    fileName: 'model_light.tflite',
    sizeDescription: '~40MB',
    url: 'https://example.com/models/marian-mt-en-id-light.tflite',
  },
  [ModelType.FULL]: {
    type: ModelType.FULL,
    fileName: 'model_full.tflite',
    sizeDescription: '~300MB',
    url: 'https://example.com/models/nllb-200-en-id-full.tflite',
  },
};

export enum DownloadStatus {
  IDLE = 'idle',
  DOWNLOADING = 'downloading',
  DOWNLOADED = 'downloaded',
  ERROR = 'error',
}
