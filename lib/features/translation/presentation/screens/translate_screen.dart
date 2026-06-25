import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants.dart';
import '../../../model_manager/presentation/providers/model_manager_provider.dart';
import '../../../model_manager/presentation/screens/model_settings_screen.dart';
import '../providers/translation_provider.dart';
import '../widgets/language_selector.dart';
import '../widgets/text_input_card.dart';
import '../widgets/translation_result_card.dart';

class TranslateScreen extends ConsumerStatefulWidget {
  const TranslateScreen({super.key});

  @override
  ConsumerState<TranslateScreen> createState() => _TranslateScreenState();
}

class _TranslateScreenState extends ConsumerState<TranslateScreen> {
  final _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(translationProvider.notifier).initialize();
      ref.read(modelManagerProvider.notifier).checkInstalledModels();
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(translationProvider);
    final modelState = ref.watch(modelManagerProvider);

    // Listen for errors and show snackbar
    ref.listen<TranslationState>(translationProvider, (prev, next) {
      if (next.error != null && next.error != prev?.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error!),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }

      // Sync text controller when input changes externally (swap, voice)
      if (next.inputText != _textController.text) {
        _textController.text = next.inputText;
        _textController.selection = TextSelection.collapsed(
          offset: next.inputText.length,
        );
      }
    });

    // Model gate: if no model installed, show welcome screen
    if (modelState.activeModel == null &&
        modelState.lightStatus != DownloadStatus.downloading &&
        modelState.fullStatus != DownloadStatus.downloading) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.translate, size: 64, color: Colors.teal),
                const SizedBox(height: 24),
                Text(
                  'Welcome to ${AppConstants.appName}',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Download a language pack to get started',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const ModelSettingsScreen(),
                      ),
                    );
                  },
                  icon: const Icon(Icons.download),
                  label: const Text('Download Language Pack'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appName),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Model Settings',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const ModelSettingsScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            children: [
              // Language selector with swap
              LanguageSelector(
                sourceLanguage: state.sourceLanguage,
                targetLanguage: state.targetLanguage,
                onSwap: () {
                  ref.read(translationProvider.notifier).swapLanguages();
                },
              ),

              const SizedBox(height: 16),

              // Input card
              TextInputCard(
                controller: _textController,
                isListening: state.isListening,
                partialSttResult: state.partialSttResult,
                onChanged: (text) {
                  ref.read(translationProvider.notifier).onInputChanged(text);
                },
                onMicTap: () {
                  if (state.isListening) {
                    ref.read(translationProvider.notifier).stopListening();
                  } else {
                    ref.read(translationProvider.notifier).startListening();
                  }
                },
              ),

              const SizedBox(height: 16),

              // Result card
              TranslationResultCard(
                translatedText: state.result?.translatedText,
                isLoading: state.isTranslating,
                isSpeaking: state.isSpeaking,
                onCopy: () {
                  if (state.result != null) {
                    Clipboard.setData(
                      ClipboardData(text: state.result!.translatedText),
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Copied to clipboard'),
                        duration: Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                onSpeak: () {
                  if (state.isSpeaking) {
                    ref.read(translationProvider.notifier).stopSpeaking();
                  } else {
                    ref.read(translationProvider.notifier).speakResult();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
