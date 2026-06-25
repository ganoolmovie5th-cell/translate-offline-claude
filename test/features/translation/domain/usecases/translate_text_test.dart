import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:translite/core/errors/failures.dart';
import 'package:translite/features/translation/domain/entities/language.dart';
import 'package:translite/features/translation/domain/entities/translation_result.dart';
import 'package:translite/features/translation/domain/repositories/translation_repository.dart';
import 'package:translite/features/translation/domain/usecases/translate_text.dart';

import 'translate_text_test.mocks.dart';

@GenerateMocks([TranslationRepository])
void main() {
  late TranslateText useCase;
  late MockTranslationRepository mockRepository;

  setUp(() {
    mockRepository = MockTranslationRepository();
    useCase = TranslateText(mockRepository);
  });

  test('should return TranslationResult on valid input', () async {
    const expected = TranslationResult(
      sourceText: 'hello',
      translatedText: 'halo',
      sourceLanguage: Language.en,
      targetLanguage: Language.id,
    );

    when(mockRepository.translate('hello', Language.en, Language.id))
        .thenAnswer((_) async => expected);

    final result = await useCase('hello', Language.en, Language.id);
    expect(result.translatedText, 'halo');
    verify(mockRepository.translate('hello', Language.en, Language.id));
  });

  test('should throw TranslationFailure on empty input', () async {
    expect(
      () => useCase('', Language.en, Language.id),
      throwsA(isA<TranslationFailure>()),
    );
  });

  test('should throw TranslationFailure on whitespace-only input', () async {
    expect(
      () => useCase('   ', Language.en, Language.id),
      throwsA(isA<TranslationFailure>()),
    );
  });

  test('should truncate input exceeding 500 chars', () async {
    final longInput = 'a' * 600;
    final truncated = 'a' * 500;

    const expected = TranslationResult(
      sourceText: 'truncated',
      translatedText: 'translated',
      sourceLanguage: Language.en,
      targetLanguage: Language.id,
    );

    when(mockRepository.translate(truncated, Language.en, Language.id))
        .thenAnswer((_) async => expected);

    await useCase(longInput, Language.en, Language.id);
    verify(mockRepository.translate(truncated, Language.en, Language.id));
  });
}
