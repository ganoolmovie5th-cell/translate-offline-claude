# TransLite Project Standards

## Overview

TransLite is a React Native (Expo SDK 54) translator app for English ↔ Indonesian.

## Architecture

- **Framework:** React Native + Expo SDK 54 (must stay compatible with Expo Go on App Store)
- **Language:** TypeScript (strict mode)
- **State Management:** Zustand with `persist` middleware + AsyncStorage
- **Translation API:** Google Translate (`translate.googleapis.com/translate_a/single`)
- **TTS:** `expo-speech`
- **STT:** `expo-speech-recognition` (Dev Build only, stub in Expo Go)

## Key Design Decisions

### Expo Go Compatibility
- App MUST run on Expo Go SDK 54 (current App Store version)
- Do NOT use native modules that require `npx expo prebuild`
- STT is stubbed with a helpful message directing users to Dev Build

### Translation Service
- Uses free Google Translate endpoint (no API key)
- Long text automatically split into chunks at sentence boundaries (~4500 chars each)
- Offline fallback dictionary for common words when network unavailable
- No character limit on input

### i18n
- All UI text follows `sourceLanguage` selection
- Translations defined in `src/core/i18n.ts`
- Brand name "TransLite" NEVER changes regardless of language
- When adding new UI text, always add both EN and ID versions in i18n.ts

### State Persistence
- Model store persisted via `zustand/middleware/persist` + AsyncStorage
- Only persist: `activeModel`, `lightStatus`, `fullStatus`
- Transient state (progress, errors) NOT persisted

## Code Conventions

### File Organization
```
src/core/       — Types, constants, errors, i18n (no React)
src/services/   — Business logic, API calls (no React)
src/store/      — Zustand stores (no React components)
src/components/ — Reusable UI components
src/screens/    — Screen-level components
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

## Pembersihan Kode / Ponytail Audit (Juni 2026)

Dead code dihapus (verifikasi `tsc --noEmit` lolos):
- 5 barrel `index.ts` (`src/core`, `src/services`, `src/store`, `src/components`, `src/screens`) — 0 import, semua memakai path langsung. Jangan tambah barrel lagi kecuali benar-benar dipakai.
- Error class `ModelError` & `SttError` tak pernah dilempar → dihapus dari `core/errors.ts` (+ import mati di `sttService.ts`). Sisa: `AppError`, `TranslationError`, `TtsError`.
- Konstanta tak terpakai di `core/constants.ts`: `maxInputChars` (kontradiksi "no character limit"), `inferenceTimeoutMs`, `sttSilenceTimeoutMs` → dihapus. Sisa: `appName`, `debounceMs`, `defaultSpeechRate`.
- Import `AppConstants` mati di `translationService.ts` → dihapus.

**Belum disentuh (butuh keputusan produk):** subsistem "download model" di `modelStore.ts`/`ModelConfig`/screen terkait adalah simulasi (terjemahan selalu lewat Google API). Masih tampil di UI, jadi dipertahankan.
