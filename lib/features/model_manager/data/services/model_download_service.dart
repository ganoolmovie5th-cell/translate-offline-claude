import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import '../../../../core/errors/failures.dart';

enum ModelType {
  light(
    fileName: 'model_light.tflite',
    sizeDescription: '~40MB',
    url: 'https://example.com/models/marian-mt-en-id-light.tflite',
  ),
  full(
    fileName: 'model_full.tflite',
    sizeDescription: '~300MB',
    url: 'https://example.com/models/nllb-200-en-id-full.tflite',
  );

  final String fileName;
  final String sizeDescription;
  final String url;

  const ModelType({
    required this.fileName,
    required this.sizeDescription,
    required this.url,
  });
}

class ModelDownloadService {
  final Dio _dio;

  ModelDownloadService({Dio? dio}) : _dio = dio ?? Dio();

  Future<String> getModelsDirectory() async {
    final appDir = await getApplicationSupportDirectory();
    final modelsDir = Directory('${appDir.path}/models');
    if (!await modelsDir.exists()) {
      await modelsDir.create(recursive: true);
    }
    return modelsDir.path;
  }

  Future<String> getModelPath(ModelType type) async {
    final dir = await getModelsDirectory();
    return '$dir/${type.fileName}';
  }

  Future<bool> isModelDownloaded(ModelType type) async {
    final path = await getModelPath(type);
    return File(path).existsSync();
  }

  Future<void> downloadModel(
    ModelType type, {
    Function(double progress)? onProgress,
  }) async {
    try {
      final path = await getModelPath(type);

      await _dio.download(
        type.url,
        path,
        onReceiveProgress: (received, total) {
          if (total > 0 && onProgress != null) {
            onProgress(received / total);
          }
        },
      );
    } catch (e) {
      throw ModelFailure('Failed to download model: $e');
    }
  }

  Future<void> deleteModel(ModelType type) async {
    final path = await getModelPath(type);
    final file = File(path);
    if (await file.exists()) {
      await file.delete();
    }
  }
}
