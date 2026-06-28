# TransLite

Offline-ready English ↔ Indonesian translator mobile app with voice support.

Built with React Native (Expo SDK 54) — runs on Android & iOS via Expo Go.

## Features

- **Real translation** — Powered by Google Translate API (accurate EN↔ID)
- **Unlimited length** — Translates any text length, auto-splits long content
- **Text-to-Speech** — Listen to translations (expo-speech, works offline)
- **Voice input** — Speech-to-text (requires Development Build)
- **Bilingual UI** — All interface text follows source language selection
- **Model manager** — Persisted model choice (survives app restart)
- **Copy to clipboard** — One tap to copy translation results
- **Swap languages** — Animated language swap with auto-retranslate

## Screenshots

| English → Indonesia | Indonesia → English |
|---|---|
| Speech bubbles logo, teal theme | Same UI, labels in Bahasa |

## Quick Start

```bash
git clone https://github.com/ganoolmovie5th-cell/translate-offline-claude.git
cd translate-offline-claude
npm install
npx expo start
```

Scan QR code with **Expo Go** app on your phone.

## Requirements

- Node.js 18+
- Expo Go app (App Store / Play Store — SDK 54)
- Internet connection (for translation API)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript |
| State | Zustand + AsyncStorage persist |
| Translation | Google Translate API (free, no key) |
| TTS | expo-speech |
| STT | expo-speech-recognition (Dev Build only) |
| Icons | @expo/vector-icons (Ionicons) |
| Clipboard | expo-clipboard |

## Project Structure

```
src/
├── core/
│   ├── constants.ts      # App config
│   ├── errors.ts         # Error classes
│   ├── i18n.ts           # UI translations (EN/ID)
│   └── types.ts          # TypeScript types & enums
├── components/
│   ├── LanguageSelector.tsx
│   ├── TextInputCard.tsx
│   ├── TranslationResultCard.tsx
│   └── VoiceButton.tsx
├── screens/
│   ├── TranslateScreen.tsx
│   └── ModelSettingsScreen.tsx
├── services/
│   ├── translationService.ts  # Google Translate integration
│   ├── ttsService.ts          # Text-to-speech
│   └── sttService.ts          # Speech-to-text (stub for Expo Go)
└── store/
    ├── translationStore.ts    # Translation state
    └── modelStore.ts          # Model persistence
```

## How Translation Works

1. User types text in source language
2. After 800ms debounce, text is sent to Google Translate API
3. Long text (>4500 chars) is split at sentence boundaries
4. Each chunk translated separately, results joined
5. If offline, falls back to built-in dictionary (~60 common words)

## Offline Support

| Feature | Expo Go | Dev Build |
|---------|---------|-----------|
| Translation (API) | Needs internet | Needs internet |
| Translation (dictionary fallback) | Offline (limited) | Offline (limited) |
| TTS (text-to-speech) | Offline | Offline |
| STT (voice input) | Not available | Offline |

## i18n (Internationalization)

All UI text automatically follows the **source language** selection:
- Source = English → UI in English
- Source = Indonesia → UI in Bahasa Indonesia
- Brand name "TransLite" never changes

## Development

### Voice Input (STT)

STT requires a Development Build (not compatible with Expo Go):

```bash
npx expo prebuild
npx expo run:android   # or run:ios
```

### Full Offline Translation

To make translation fully offline, replace `translationService.ts` with an on-device ML model:
- Convert MarianMT or NLLB model to TFLite/ONNX
- Use a native module to run inference
- Requires Development Build

## License

MIT

## Pembersihan Kode / Ponytail Audit (Juni 2026)

Hapus dead code tanpa menyentuh fungsionalitas, i18n, atau pesan error ramah-pengguna. Verifikasi `tsc --noEmit` lolos:
- Hapus 5 barrel `index.ts` (`core`/`services`/`store`/`components`/`screens`) — 0 import (semua pakai path langsung).
- Hapus error class tak terpakai `ModelError` & `SttError` (+ import-nya di `sttService.ts`).
- Hapus konstanta tak terpakai di `core/constants.ts`: `maxInputChars`, `inferenceTimeoutMs`, `sttSilenceTimeoutMs`.
- Hapus import `AppConstants` yang tak dipakai di `translationService.ts`.

Catatan: subsistem "model offline" (UI download tersimulasi) sengaja DIBIARKAN karena masih tampil di UI; perlu keputusan produk sebelum dihapus.
