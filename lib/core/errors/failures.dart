sealed class Failure {
  final String message;
  const Failure(this.message);
}

class ModelFailure extends Failure {
  const ModelFailure(super.message);
}

class TranslationFailure extends Failure {
  const TranslationFailure(super.message);
}

class SttFailure extends Failure {
  const SttFailure(super.message);
}

class TtsFailure extends Failure {
  const TtsFailure(super.message);
}

class PermissionFailure extends Failure {
  const PermissionFailure(super.message);
}
