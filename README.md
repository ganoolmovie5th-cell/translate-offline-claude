# TransLite

Aplikasi translator English-Indonesian untuk mobile. Terjemahan akurat via Google Translate API, dengan fitur text-to-speech offline, conversation mode, phrasebook, dan pronunciation guide.

**Tech Stack:** React Native · Expo SDK 54 · TypeScript · Zustand · expo-speech

## Features

- Real translation (Google Translate API, akurat EN-ID)
- Unlimited length (auto-split teks panjang)
- Voice Button (dengar teks yang diketik, offline via expo-speech)
- Text-to-Speech (dengar terjemahan, offline)
- Bilingual UI (ikut bahasa sumber)
- Copy to clipboard
- Swap languages (animasi + auto-retranslate)
- Preservasi format (bullet, numbered list, paragraph)
- Conversation Mode (chat-style bubbles EN/ID, tap to hear)
- Phrasebook (60 frasa umum, 6 kategori)
- Camera Translation (foto teks sebagai referensi)
- Pronunciation Guide (40 kata, IPA + fonetik + TTS)

## Getting Started

```bash
npm install
npx expo start
```

Scan QR code dengan Expo Go.

## Project Structure

```
src/
  core/
    constants.ts          → App config
    i18n.ts               → UI translations (EN/ID)
    types.ts              → TypeScript types
  data/
    phrasebook.ts         → 60 phrases (6 categories)
    pronunciation.ts      → 40 entries with IPA
  components/             → LanguageSelector, TextInputCard, TranslationResultCard
  screens/
    TranslateScreen.tsx       Main translator
    ConversationScreen.tsx    Chat-style translation
    PhrasebookScreen.tsx      Common phrases
    CameraScreen.tsx          Photo-assisted translation
    PronunciationScreen.tsx   IPA + phonetic guide
  services/
    translationService.ts     Google Translate integration
    ttsService.ts             Text-to-speech
  store/
    translationStore.ts       Translation state (Zustand)
```

## License

MIT
