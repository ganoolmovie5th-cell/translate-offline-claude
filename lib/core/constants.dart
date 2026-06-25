class AppConstants {
  AppConstants._();

  static const int maxInputChars = 500;
  static const Duration debounceDuration = Duration(milliseconds: 500);
  static const Duration inferenceTimeout = Duration(seconds: 10);
  static const double defaultSpeechRate = 0.5;
  static const Duration sttSilenceTimeout = Duration(seconds: 5);
  static const String appName = 'TransLite';
}
