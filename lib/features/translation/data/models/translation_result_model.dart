import '../../domain/entities/language.dart';
import '../../domain/entities/translation_result.dart';

class TranslationResultModel extends TranslationResult {
  const TranslationResultModel({
    required super.sourceText,
    required super.translatedText,
    required super.sourceLanguage,
    required super.targetLanguage,
  });

  factory TranslationResultModel.fromInference({
    required String sourceText,
    required String translatedText,
    required Language sourceLanguage,
    required Language targetLanguage,
  }) {
    return TranslationResultModel(
      sourceText: sourceText,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
    );
  }
}
