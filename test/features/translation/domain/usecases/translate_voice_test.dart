import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:translite/core/errors/failures.dart';
import 'package:translite/features/translation/domain/entities/language.dart';
import 'package:translite/features/translation/domain/entities/translation_result.dart';
import 'package:translite/features/translation/domain/repositories/translation_repository.dart';
import 'package:translite/features/translation/domain/usecases/translate_voice.dart';

import 'translate_text_test.mocks.dart';

@GenerateMocks([TranslationRepository])
void main() {
  late TranslateVoice useCase;
  late MockTranslationRepository mockRepository;

  setUp(() {
    mockRepository = MockTranslationRepository();
    useCase = TranslateVoice(mockRepository);
  });

  test('should return TranslationResult on valid transcribed text', () async {
    const expected = TranslationResult(
      sourceText: 'good morning',
      translatedText: 'selamat pagi',
      sourceLanguage: Language.en,
      targetLanguage: Language.id,
    );

    when(mockRepository.translate('good morning', Language.en, Language.id))
        .thenAnswer((_) async => expected);

    final result = await useCase('good morning', Language.en, Language.id);
    expect(result.translatedText, 'selamat pagi');
  });

  test('should throw TranslationFailure on empty transcription', () async {
    expect(
      () => useCase('', Language.en, Language.id),
      throwsA(isA<TranslationFailure>()),
    );
  });
}
