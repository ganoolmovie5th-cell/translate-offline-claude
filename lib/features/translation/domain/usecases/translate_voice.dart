import '../../../../core/errors/failures.dart';
import '../entities/language.dart';
import '../entities/translation_result.dart';
import '../repositories/translation_repository.dart';

class TranslateVoice {
  final TranslationRepository _repository;

  TranslateVoice(this._repository);

  /// Translates already-transcribed voice text.
  /// STT and TTS are handled at the presentation/service layer.
  Future<TranslationResult> call(
    String transcribedText,
    Language source,
    Language target,
  ) async {
    if (transcribedText.trim().isEmpty) {
      throw const TranslationFailure('No speech detected');
    }

    return _repository.translate(transcribedText, source, target);
  }
}
