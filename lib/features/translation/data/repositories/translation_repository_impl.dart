import 'package:path_provider/path_provider.dart';
import '../../domain/entities/language.dart';
import '../../domain/entities/translation_result.dart';
import '../../domain/repositories/translation_repository.dart';
import '../models/translation_result_model.dart';
import '../services/tflite_translation_service.dart';

class TranslationRepositoryImpl implements TranslationRepository {
  final TfliteTranslationService _translationService;

  TranslationRepositoryImpl(this._translationService);

  @override
  Future<TranslationResult> translate(
    String text,
    Language source,
    Language target,
  ) async {
    final translatedText = await _translationService.translate(
      text,
      source,
      target,
    );

    return TranslationResultModel.fromInference(
      sourceText: text,
      translatedText: translatedText,
      sourceLanguage: source,
      targetLanguage: target,
    );
  }

  @override
  Future<bool> isModelLoaded() async {
    return _translationService.isLoaded;
  }

  @override
  Future<void> loadModel() async {
    final dir = await _getModelDirectory();
    await _translationService.loadModel(modelPath: '$dir/model.tflite');
  }

  @override
  Future<void> unloadModel() async {
    _translationService.dispose();
  }

  Future<String> _getModelDirectory() async {
    final appDir = await getApplicationSupportDirectory();
    return '${appDir.path}/models';
  }
}
