import '../entities/language.dart';
import '../entities/translation_result.dart';

abstract class TranslationRepository {
  Future<TranslationResult> translate(
    String text,
    Language source,
    Language target,
  );

  Future<bool> isModelLoaded();
  Future<void> loadModel();
  Future<void> unloadModel();
}
