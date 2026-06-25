import { Language } from './types';

/**
 * All UI strings indexed by language.
 * "TransLite" brand name never changes.
 */
const strings = {
  [Language.EN]: {
    // Input
    typeOrSpeak: 'Type or speak...',
    listening: 'Listening...',

    // Result
    translationPlaceholder: 'Translation will appear here',
    translating: 'Translating...',

    // Actions
    copy: 'Copy',
    listen: 'Listen',
    stop: 'Stop',
    copied: 'Copied',
    copiedMessage: 'Translation copied to clipboard',

    // Language selector
    swap: 'Swap languages',

    // Settings
    languageModels: 'Language Models',
    lightModel: 'Light Model',
    fullModel: 'Full Model',
    lightDescription: 'Fast, smaller file',
    fullDescription: 'Higher accuracy',
    downloadInfo:
      'Models are stored locally for offline translation. Download at least one model to start translating.',

    // Model status
    download: 'Download',
    delete: 'Delete',
    retry: 'Retry',

    // Errors
    error: 'Error',
    ok: 'OK',

    // Settings button
    modelSettings: 'Model Settings',
  },
  [Language.ID]: {
    // Input
    typeOrSpeak: 'Ketik atau bicara...',
    listening: 'Mendengarkan...',

    // Result
    translationPlaceholder: 'Terjemahan akan muncul di sini',
    translating: 'Menerjemahkan...',

    // Actions
    copy: 'Salin',
    listen: 'Dengar',
    stop: 'Berhenti',
    copied: 'Disalin',
    copiedMessage: 'Terjemahan disalin ke papan klip',

    // Language selector
    swap: 'Tukar bahasa',

    // Settings
    languageModels: 'Model Bahasa',
    lightModel: 'Model Ringan',
    fullModel: 'Model Lengkap',
    lightDescription: 'Cepat, ukuran kecil',
    fullDescription: 'Akurasi lebih tinggi',
    downloadInfo:
      'Model disimpan lokal untuk terjemahan offline. Unduh minimal satu model untuk mulai menerjemahkan.',

    // Model status
    download: 'Unduh',
    delete: 'Hapus',
    retry: 'Coba lagi',

    // Errors
    error: 'Kesalahan',
    ok: 'OK',

    // Settings button
    modelSettings: 'Pengaturan Model',
  },
} as const;

export type Strings = (typeof strings)[Language.EN];

export function t(lang: Language): Strings {
  return strings[lang] as Strings;
}
