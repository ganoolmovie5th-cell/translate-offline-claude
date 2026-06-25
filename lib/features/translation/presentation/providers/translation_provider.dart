import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants.dart';
import '../../../../core/errors/failures.dart';
import '../../data/repositories/translation_repository_impl.dart';
import '../../data/services/stt_service.dart';
import '../../data/services/tflite_translation_service.dart';
import '../../data/services/tts_service.dart';
import '../../domain/entities/language.dart';
import '../../domain/entities/translation_result.dart';
import '../../domain/usecases/translate_text.dart';

class TranslationState {
  final Language sourceLanguage;
  final Language targetLanguage;
  final String inputText;
  final TranslationResult? result;
  final bool isTranslating;
  final bool isListening;
  final bool isSpeaking;
  final String? error;
  final String partialSttResult;

  const TranslationState({
    this.sourceLanguage = Language.en,
    this.targetLanguage = Language.id,
    this.inputText = '',
    this.result,
    this.isTranslating = false,
    this.isListening = false,
    this.isSpeaking = false,
    this.error,
    this.partialSttResult = '',
  });

  TranslationState copyWith({
    Language? sourceLanguage,
    Language? targetLanguage,
    String? inputText,
    TranslationResult? result,
    bool? isTranslating,
    bool? isListening,
    bool? isSpeaking,
    String? error,
    String? partialSttResult,
    bool clearResult = false,
    bool clearError = false,
  }) {
    return TranslationState(
      sourceLanguage: sourceLanguage ?? this.sourceLanguage,
      targetLanguage: targetLanguage ?? this.targetLanguage,
      inputText: inputText ?? this.inputText,
      result: clearResult ? null : (result ?? this.result),
      isTranslating: isTranslating ?? this.isTranslating,
      isListening: isListening ?? this.isListening,
      isSpeaking: isSpeaking ?? this.isSpeaking,
      error: clearError ? null : (error ?? this.error),
      partialSttResult: partialSttResult ?? this.partialSttResult,
    );
  }
}

class TranslationNotifier extends StateNotifier<TranslationState> {
  final TranslateText _translateText;
  final SttService _sttService;
  final TtsService _ttsService;
  Timer? _debounceTimer;

  TranslationNotifier({
    required TranslateText translateText,
    required SttService sttService,
    required TtsService ttsService,
  })  : _translateText = translateText,
        _sttService = sttService,
        _ttsService = ttsService,
        super(const TranslationState());

  Future<void> initialize() async {
    await _sttService.initialize();
    await _ttsService.initialize();
  }

  void onInputChanged(String text) {
    state = state.copyWith(inputText: text, clearError: true);
    _debounceTimer?.cancel();

    if (text.trim().isEmpty) {
      state = state.copyWith(clearResult: true);
      return;
    }

    _debounceTimer = Timer(AppConstants.debounceDuration, () {
      translateText(text);
    });
  }

  Future<void> translateText(String text) async {
    if (text.trim().isEmpty) return;

    state = state.copyWith(isTranslating: true, clearError: true);

    try {
      final result = await _translateText(
        text,
        state.sourceLanguage,
        state.targetLanguage,
      );
      state = state.copyWith(result: result, isTranslating: false);
    } on Failure catch (e) {
      state = state.copyWith(
        error: e.message,
        isTranslating: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: 'Translation failed: $e',
        isTranslating: false,
      );
    }
  }

  void swapLanguages() {
    final newSource = state.targetLanguage;
    final newTarget = state.sourceLanguage;

    // If there's a result, swap texts too
    final newInput = state.result?.translatedText ?? state.inputText;

    state = state.copyWith(
      sourceLanguage: newSource,
      targetLanguage: newTarget,
      inputText: newInput,
      clearResult: true,
    );

    if (newInput.isNotEmpty) {
      translateText(newInput);
    }
  }

  Future<void> startListening() async {
    state = state.copyWith(
      isListening: true,
      partialSttResult: '',
      clearError: true,
    );

    try {
      await _sttService.startListening(
        language: state.sourceLanguage,
        onResult: (finalText) {
          state = state.copyWith(
            inputText: finalText,
            isListening: false,
            partialSttResult: '',
          );
          translateText(finalText);
        },
        onPartial: (partialText) {
          state = state.copyWith(partialSttResult: partialText);
        },
      );
    } catch (e) {
      state = state.copyWith(
        isListening: false,
        error: 'Speech recognition failed',
      );
    }
  }

  Future<void> stopListening() async {
    await _sttService.stopListening();
    state = state.copyWith(isListening: false);
  }

  Future<void> speakResult() async {
    if (state.result == null) return;

    try {
      state = state.copyWith(isSpeaking: true);
      await _ttsService.speak(
        state.result!.translatedText,
        state.targetLanguage,
      );
      state = state.copyWith(isSpeaking: false);
    } catch (e) {
      state = state.copyWith(
        isSpeaking: false,
        error: 'Could not play audio',
      );
    }
  }

  Future<void> stopSpeaking() async {
    await _ttsService.stop();
    state = state.copyWith(isSpeaking: false);
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    super.dispose();
  }
}

// --- Providers ---

final tfliteServiceProvider = Provider<TfliteTranslationService>((ref) {
  return TfliteTranslationService();
});

final translationRepositoryProvider =
    Provider<TranslationRepositoryImpl>((ref) {
  final tfliteService = ref.watch(tfliteServiceProvider);
  return TranslationRepositoryImpl(tfliteService);
});

final translateTextUseCaseProvider = Provider<TranslateText>((ref) {
  final repository = ref.watch(translationRepositoryProvider);
  return TranslateText(repository);
});

final sttServiceProvider = Provider<SttService>((ref) {
  return SttService();
});

final ttsServiceProvider = Provider<TtsService>((ref) {
  return TtsService();
});

final translationProvider =
    StateNotifierProvider<TranslationNotifier, TranslationState>((ref) {
  final translateText = ref.watch(translateTextUseCaseProvider);
  final sttService = ref.watch(sttServiceProvider);
  final ttsService = ref.watch(ttsServiceProvider);

  return TranslationNotifier(
    translateText: translateText,
    sttService: sttService,
    ttsService: ttsService,
  );
});
