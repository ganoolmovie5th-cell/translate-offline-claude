# TransLite

English ↔ Indonesian translator mobile app.

Built with React Native (Expo SDK 54) — runs on Android & iOS via Expo Go.

## Features

- **Real translation** — Powered by Google Translate API (accurate EN↔ID)
- **Unlimited length** — Translates any text length, auto-splits long content
- **Voice Button** — Tap mic to hear typed text spoken aloud (expo-speech, works offline)
- **Text-to-Speech** — Listen to translations (expo-speech, works offline)
- **Bilingual UI** — All interface text follows source language selection
- **Copy to clipboard** — One tap to copy translation results
- **Swap languages** — Animated language swap with auto-retranslate
- **Text formatting** — Preserves bullet points, numbered lists, and paragraph structure during translation
- **💬 Conversation Mode** — Chat-style interface, alternating bubbles EN/ID, tap to hear TTS
- **📖 Phrasebook** — 60 frasa umum di 6 kategori (Sapaan, Perjalanan, Makanan, Belanja, Darurat, Bisnis)
- **📷 Camera Translation** — Ambil foto teks sebagai referensi, ketik untuk diterjemahkan
- **🗣️ Pronunciation Guide** — 40 kata Indonesia dengan IPA, fonetik, dan TTS (3 kategori)

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
| Icons | @expo/vector-icons (Ionicons) |
| Clipboard | expo-clipboard |

## Project Structure

```
src/
├── core/
│   ├── constants.ts      # App config
│   ├── i18n.ts           # UI translations (EN/ID) — all 5 screens
│   └── types.ts          # TypeScript types & enums
├── data/
│   ├── phrasebook.ts     # 6 categories × 10 phrases (60 total)
│   └── pronunciation.ts  # 3 categories, 40 entries with IPA
├── components/
│   ├── LanguageSelector.tsx
│   ├── TextInputCard.tsx
│   └── TranslationResultCard.tsx
├── screens/
│   ├── TranslateScreen.tsx       # Main translator
│   ├── ConversationScreen.tsx    # Chat-style translation
│   ├── PhrasebookScreen.tsx      # Categorized common phrases
│   ├── CameraScreen.tsx          # Photo-assisted translation
│   └── PronunciationScreen.tsx   # IPA + phonetic guide
├── services/
│   ├── translationService.ts  # Google Translate integration
│   └── ttsService.ts          # Text-to-speech
└── store/
    └── translationStore.ts    # Translation state
```

## How Translation Works

1. User types text in source language
2. After 800ms debounce, text is sent to Google Translate API
3. Long text (>4500 chars) is split at sentence boundaries
4. Each chunk translated separately, results joined
5. If API fails, shows clear error message (requires internet)

## Offline Support

| Feature | Status |
|---------|--------|
| Translation | Requires internet (Google Translate API) |
| TTS (text-to-speech) | Works offline (expo-speech) |

## i18n (Internationalization)

All UI text automatically follows the **source language** selection:
- Source = English → UI in English
- Source = Indonesia → UI in Bahasa Indonesia
- Brand name "TransLite" never changes

## Development

## License

MIT

## Ponytail Audit — Juli 2026

Fake offline features dihapus:
- `ModelSettingsScreen` + `modelStore.ts` — progress download di-simulasi, tidak ada model nyata
- `sttService.ts` + `VoiceButton` — STT langsung throw error di Expo Go, tidak berfungsi
- Offline dictionary 80 kata — bukan offline translation sungguhan, menyesatkan
- `ModelType`, `ModelInfo`, `ModelConfig`, `DownloadStatus` dari `types.ts`

App sekarang: 1 screen, 1 store, 2 service, translation selalu via Google API.

## Pembersihan Kode / Ponytail Audit (Juni 2026)

Hapus dead code tanpa menyentuh fungsionalitas, i18n, atau pesan error ramah-pengguna. Verifikasi `tsc --noEmit` lolos:
- Hapus 5 barrel `index.ts` (`core`/`services`/`store`/`components`/`screens`) — 0 import (semua pakai path langsung).
- Hapus error class tak terpakai `ModelError` & `SttError` (+ import-nya di `sttService.ts`).
- Hapus konstanta tak terpakai di `core/constants.ts`: `maxInputChars`, `inferenceTimeoutMs`, `sttSilenceTimeoutMs`.
- Hapus import `AppConstants` yang tak dipakai di `translationService.ts`.

Catatan: subsistem "model offline" (UI download tersimulasi) sengaja DIBIARKAN karena masih tampil di UI; perlu keputusan produk sebelum dihapus.

### Update: subsistem model dipertahankan (Juni 2026)

Layar pengaturan model & store-nya **dipertahankan** sebagai scaffolding untuk roadmap on-device (bukan dihapus). Diberi komentar `ponytail:` di `modelStore.ts` (`downloadModel`) dan `translationService.ts` (`loadModel`) yang menjelaskan bahwa progress/loadModel masih simulasi (terjemahan tetap via Google API) beserta jalur upgrade ke model TFLite nyata.

### Audit Lanjutan (Juli 2026)

Hapus wrapper error & dead members. Verifikasi: `tsc --noEmit` lolos.
- Hapus `src/core/errors.ts` seluruhnya — `TranslationError` & `TtsError` hanya wrap `Error` biasa tanpa menambah perilaku; diganti `new Error()` di semua call site
- Hapus 11 kunci i18n mati di `src/core/i18n.ts` (UI download model: `listening`, `languageModels`, `lightModel`, `fullModel`, `lightDescription`, `fullDescription`, `downloadInfo`, `download`, `delete`, `retry`, `modelSettings`)
- Hapus field `sttLocale` dari `LanguageConfig` di `src/core/types.ts` (STT dinonaktifkan); hapus field `sourceText` dari `TranslationResult` (tidak pernah dipakai consumer)
- Hapus member tak terpakai di service: `modelLoaded` getter, `dispose()` (`translationService`); `isSpeaking` getter, `isAvailable()` (`ttsService`)

### Audit Lanjutan 2 (Juli 2026)

- `src/services/translationService.ts`: hapus field `isLoaded` (di-set tapi tidak pernah dibaca); inline `delay()` helper → `new Promise(r => setTimeout(r, ms))` langsung di 3 call site; hapus private method `delay()`
- `src/components/TextInputCard.tsx`: hapus entry `footer` dari StyleSheet (defined tapi tidak pernah dirujuk di JSX)

### Audit Lanjutan 3 (Juli 2026)

- `package.json`: hapus `@react-native-async-storage/async-storage` (zero src imports)
- `src/core/i18n.ts`: hapus key `swap` dari locale EN dan ID (zero i18n reads)
- `src/services/ttsService.ts`: hapus field `private speaking` (write-only, state ada di Zustand)
- `src/services/translationService.ts`: `String(error?.message ?? '')` → `error?.message ?? ''` di 2 call site
