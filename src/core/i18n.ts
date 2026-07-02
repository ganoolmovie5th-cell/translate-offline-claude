import { Language } from './types';

/**
 * All UI strings indexed by language.
 * "TransLite" brand name never changes.
 */
const strings = {
  [Language.EN]: {
    // Input
    typeOrSpeak: 'Type or speak...',

    // Result
    translationPlaceholder: 'Translation will appear here',
    translating: 'Translating...',

    // Actions
    copy: 'Copy',
    listen: 'Listen',
    stop: 'Stop',
    copied: 'Copied',
    copiedMessage: 'Translation copied to clipboard',

    // Errors
    error: 'Error',
    ok: 'OK',
  },
  [Language.ID]: {
    // Input
    typeOrSpeak: 'Ketik atau bicara...',

    // Result
    translationPlaceholder: 'Terjemahan akan muncul di sini',
    translating: 'Menerjemahkan...',

    // Actions
    copy: 'Salin',
    listen: 'Dengar',
    stop: 'Berhenti',
    copied: 'Disalin',
    copiedMessage: 'Terjemahan disalin ke papan klip',

    // Errors
    error: 'Kesalahan',
    ok: 'OK',
  },
} as const;

export type Strings = (typeof strings)[Language.EN];

export function t(lang: Language): Strings {
  return strings[lang] as Strings;
}
