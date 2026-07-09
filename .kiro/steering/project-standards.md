# TransLite Project Standards

## Overview

TransLite is a React Native (Expo SDK 54) translator app for English ↔ Indonesian.

## Architecture

- **Framework:** React Native + Expo SDK 54 (must stay compatible with Expo Go on App Store)
- **Language:** TypeScript (strict mode)
- **State Management:** Zustand with `persist` middleware + AsyncStorage
- **Translation API:** Google Translate (`translate.googleapis.com/translate_a/single`)
- **TTS:** `expo-speech`
- **STT:** Removed — non-functional in Expo Go, no Dev Build support planned

## Key Design Decisions

### Expo Go Compatibility
- App MUST run on Expo Go SDK 54 (current App Store version)
- Do NOT use native modules that require `npx expo prebuild`
- STT is stubbed with a helpful message directing users to Dev Build

### Translation Service
- Uses free Google Translate endpoint (no API key)
- Long text automatically split into chunks at sentence boundaries (~4500 chars each)
- Requires internet — shows clear error when offline
- No character limit on input

### i18n
- All UI text follows `sourceLanguage` selection
- Translations defined in `src/core/i18n.ts`
- Brand name "TransLite" NEVER changes regardless of language
- When adding new UI text, always add both EN and ID versions in i18n.ts

### State Persistence
- Translation store via Zustand
- No model store — on-device model feature removed

## Code Conventions

### File Organization
```
src/core/       — Types, constants, i18n (no React)
src/data/       — phrasebook.ts, pronunciation.ts (static data)
src/services/   — translationService (Google API), ttsService
src/store/      — translationStore (Zustand)
src/components/ — LanguageSelector, TextInputCard, TranslationResultCard
src/screens/    — TranslateScreen, ConversationScreen, PhrasebookScreen, CameraScreen, PronunciationScreen
```

### Naming
- Files: `camelCase.ts` for logic, `PascalCase.tsx` for components
- Stores: `use[Name]Store`
- Services: `[name]Service` (singleton instances)

### Styling
- Inline `StyleSheet.create()` per component
- Color palette: teal primary (#0d9488), light teal bg (#f0fdfa, #ccfbf1)
- Rounded corners: 16dp for cards, 12dp for buttons
- Material-style shadows on cards

### Error Handling
- Custom error classes in `src/core/errors.ts`
- Network errors → show user-friendly message + offline fallback
- Never show raw error messages to user

## Testing Workflow

```bash
npx tsc --noEmit          # TypeScript check (must pass with 0 errors)
npx expo start            # Run in Expo Go
```

## Git Conventions

- Commit messages: `feat:`, `fix:`, `refactor:`, `chore:`
- Push to `main` branch
- Keep commits focused (one concern per commit)

## Ponytail Audit — Juli 2026

Fake features dihapus:
- `ModelSettingsScreen`, `modelStore.ts` — simulasi download, tidak ada model nyata
- `sttService.ts`, `VoiceButton` — STT stub, tidak berfungsi di Expo Go
- Offline dictionary (80 kata) — bukan offline translation sungguhan
- `ModelType`, `ModelInfo`, `ModelConfig`, `DownloadStatus` dari `types.ts`

App sekarang: satu screen (`TranslateScreen`), satu store (`translationStore`), dua service (`translationService`, `ttsService`).

## Fitur Baru (Juli 2026)

### Navigation (App.tsx)
- `App.tsx` sekarang pakai custom bottom tab bar (`useState<Screen>` pattern)
- 5 tab: 🔤 Terjemah, 💬 Percakapan, 📖 Frasa, 📷 Kamera, 🗣️ Pelafalan
- Tanpa external navigation library (Expo Go compatible)

### Conversation Mode (`src/screens/ConversationScreen.tsx`)
- Chat-style interface dengan bubble alternating (kiri = EN, kanan = ID)
- User ketik → otomatis diterjemahkan → tampil sebagai bubble pair
- Tap bubble untuk TTS, toggle bahasa di atas, clear button
- State percakapan hanya di component (tidak di-persist)

### Phrasebook (`src/screens/PhrasebookScreen.tsx`)
- Data: `src/data/phrasebook.ts` — 6 kategori × 10 frasa (60 total)
- Kategori: Sapaan, Perjalanan, Makanan, Belanja, Darurat, Bisnis
- Search bar, category tabs horizontal, tap to copy, speaker button TTS

### Camera Translation (`src/screens/CameraScreen.tsx`)
- Expo Go compatible (tanpa OCR native module)
- Ambil foto via expo-image-picker sebagai referensi visual
- User ketik teks yang terlihat di foto → translate via translationService
- Practical "camera-assisted" approach

### Pronunciation Guide (`src/screens/PronunciationScreen.tsx`)
- Data: `src/data/pronunciation.ts` — 3 kategori, 40 entries
- Kategori: Vokal (10), Konsonan (10), Kata Umum (20)
- Setiap entry: word, IPA, phonetic guide (English speaker), meaning
- Search + speaker button per kata (TTS via ttsService)
