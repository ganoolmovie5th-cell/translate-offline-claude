export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class TranslationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'TranslationError';
  }
}

export class TtsError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'TtsError';
  }
}
