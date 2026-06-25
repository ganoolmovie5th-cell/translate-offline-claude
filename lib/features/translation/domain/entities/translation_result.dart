import 'language.dart';

class TranslationResult {
  final String sourceText;
  final String translatedText;
  final Language sourceLanguage;
  final Language targetLanguage;

  const TranslationResult({
    required this.sourceText,
    required this.translatedText,
    required this.sourceLanguage,
    required this.targetLanguage,
  });
}
