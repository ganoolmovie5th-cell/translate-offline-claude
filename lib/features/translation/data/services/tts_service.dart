import 'dart:async';
import 'package:flutter_tts/flutter_tts.dart';
import '../../../../core/constants.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/language.dart';

class TtsService {
  final FlutterTts _flutterTts = FlutterTts();
  bool _isSpeaking = false;
  Completer<void>? _speakCompleter;

  bool get isSpeaking => _isSpeaking;

  Future<void> initialize() async {
    try {
      await _flutterTts.setSpeechRate(AppConstants.defaultSpeechRate);
      await _flutterTts.setVolume(1.0);

      _flutterTts.setStartHandler(() {
        _isSpeaking = true;
      });

      _flutterTts.setCompletionHandler(() {
        _isSpeaking = false;
        _speakCompleter?.complete();
        _speakCompleter = null;
      });

      _flutterTts.setCancelHandler(() {
        _isSpeaking = false;
        _speakCompleter?.complete();
        _speakCompleter = null;
      });

      _flutterTts.setErrorHandler((msg) {
        _isSpeaking = false;
        _speakCompleter?.completeError(TtsFailure('TTS error: $msg'));
        _speakCompleter = null;
      });
    } catch (e) {
      throw TtsFailure('Failed to initialize TTS: $e');
    }
  }

  Future<void> speak(String text, Language language) async {
    try {
      await _flutterTts.setLanguage(language.locale);
      _isSpeaking = true;
      _speakCompleter = Completer<void>();
      await _flutterTts.speak(text);
      await _speakCompleter?.future;
    } catch (e) {
      _isSpeaking = false;
      if (e is Failure) rethrow;
      throw TtsFailure('Failed to speak: $e');
    }
  }

  Future<void> stop() async {
    _isSpeaking = false;
    await _flutterTts.stop();
    _speakCompleter?.complete();
    _speakCompleter = null;
  }

  Future<void> setSpeechRate(double rate) async {
    await _flutterTts.setSpeechRate(rate);
  }

  Future<bool> isLanguageAvailable(Language language) async {
    final result = await _flutterTts.isLanguageAvailable(language.locale);
    return result == 1 || result == true;
  }
}
