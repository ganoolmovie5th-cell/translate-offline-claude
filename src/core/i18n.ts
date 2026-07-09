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

    // Tab labels
    tabTranslate: 'Translate',
    tabConversation: 'Chat',
    tabPhrasebook: 'Phrases',
    tabCamera: 'Camera',
    tabPronunciation: 'Pronounce',

    // Conversation screen
    conversationTitle: 'Conversation Mode',
    conversationPlaceholder: 'Type a message...',
    send: 'Send',
    clearConversation: 'Clear',
    speakingAs: 'Speaking as',

    // Phrasebook screen
    phrasebookTitle: 'Phrasebook',
    searchPhrases: 'Search phrases...',
    tapToCopy: 'Tap to copy',
    longPressToListen: 'Hold to listen',

    // Camera screen
    cameraTitle: 'Camera Translation',
    cameraDescription: 'Take a photo of text, then type what you see to translate it.',
    takePhoto: 'Take Photo',
    typeTextFromPhoto: 'Type the text you see in the photo...',
    translateButton: 'Translate',
    translationResult: 'Translation Result',
    noPhotoYet: 'Take a photo as reference, then type the text below',

    // Pronunciation screen
    pronunciationTitle: 'Pronunciation Guide',
    searchWords: 'Search words...',
    meaning: 'Meaning',
    phonetic: 'Phonetic',
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

    // Tab labels
    tabTranslate: 'Terjemah',
    tabConversation: 'Percakapan',
    tabPhrasebook: 'Frasa',
    tabCamera: 'Kamera',
    tabPronunciation: 'Pelafalan',

    // Conversation screen
    conversationTitle: 'Mode Percakapan',
    conversationPlaceholder: 'Ketik pesan...',
    send: 'Kirim',
    clearConversation: 'Hapus',
    speakingAs: 'Berbicara sebagai',

    // Phrasebook screen
    phrasebookTitle: 'Buku Frasa',
    searchPhrases: 'Cari frasa...',
    tapToCopy: 'Ketuk untuk salin',
    longPressToListen: 'Tahan untuk dengar',

    // Camera screen
    cameraTitle: 'Terjemahan Kamera',
    cameraDescription: 'Ambil foto teks, lalu ketik teks yang terlihat untuk diterjemahkan.',
    takePhoto: 'Ambil Foto',
    typeTextFromPhoto: 'Ketik teks yang terlihat di foto...',
    translateButton: 'Terjemahkan',
    translationResult: 'Hasil Terjemahan',
    noPhotoYet: 'Ambil foto sebagai referensi, lalu ketik teksnya di bawah',

    // Pronunciation screen
    pronunciationTitle: 'Panduan Pelafalan',
    searchWords: 'Cari kata...',
    meaning: 'Arti',
    phonetic: 'Fonetik',
  },
} as const;

export type Strings = (typeof strings)[Language.EN];

export function t(lang: Language): Strings {
  return strings[lang] as Strings;
}
