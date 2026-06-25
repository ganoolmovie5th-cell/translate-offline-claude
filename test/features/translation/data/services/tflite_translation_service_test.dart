import 'package:flutter_test/flutter_test.dart';
import 'package:translite/core/errors/failures.dart';
import 'package:translite/features/translation/data/services/tflite_translation_service.dart';
import 'package:translite/features/translation/domain/entities/language.dart';

void main() {
  late TfliteTranslationService service;

  setUp(() {
    service = TfliteTranslationService();
  });

  tearDown(() {
    service.dispose();
  });

  test('isLoaded should be false initially', () {
    expect(service.isLoaded, false);
  });

  test('should throw ModelFailure when translating without loaded model', () {
    expect(
      () => service.translate('hello', Language.en, Language.id),
      throwsA(isA<ModelFailure>()),
    );
  });

  test('dispose should reset isLoaded to false', () {
    service.dispose();
    expect(service.isLoaded, false);
  });
}
