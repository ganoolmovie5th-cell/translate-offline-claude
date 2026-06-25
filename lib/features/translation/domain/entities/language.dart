enum Language {
  en(locale: 'en-US', displayName: 'English'),
  id(locale: 'id-ID', displayName: 'Indonesia');

  final String locale;
  final String displayName;

  const Language({required this.locale, required this.displayName});
}
