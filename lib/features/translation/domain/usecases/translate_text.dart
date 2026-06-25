import '../../../../core/constants.dart';
import '../../../../core/errors/failures.dart';
import '../entities/language.dart';
import '../entities/translation_result.dart';
import '../repositories/translation_repository.dart';

class TranslateText {
  final TranslationRepository _repository;

  TranslateText(this._repository);

  Future<TranslationResult> call(
    String text,
    Language source,
    Language target,
  ) async {
    if (text.trim().isEmpty) {
      throw const TranslationFailure('Input text is empty');
    }

    final trimmedText = text.length > AppConstants.maxInputChars
        ? text.substring(0, AppConstants.maxInputChars)
        : text;

    return _repository.translate(trimmedText, source, target);
  }
}
