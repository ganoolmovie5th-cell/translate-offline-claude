export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class ModelError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ModelError';
  }
}

export class TranslationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'TranslationError';
  }
}

export class SttError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'SttError';
  }
}

export class TtsError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'TtsError';
  }
}
