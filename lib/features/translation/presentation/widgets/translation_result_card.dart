import 'package:flutter/material.dart';

class TranslationResultCard extends StatelessWidget {
  final String? translatedText;
  final bool isLoading;
  final bool isSpeaking;
  final VoidCallback onCopy;
  final VoidCallback onSpeak;

  const TranslationResultCard({
    super.key,
    required this.translatedText,
    required this.isLoading,
    required this.isSpeaking,
    required this.onCopy,
    required this.onSpeak,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (isLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(child: LinearProgressIndicator()),
              )
            else if (translatedText != null && translatedText!.isNotEmpty)
              SelectableText(
                translatedText!,
                style: Theme.of(context).textTheme.bodyLarge,
              )
            else
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Text(
                  'Translation will appear here',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                  textAlign: TextAlign.center,
                ),
              ),
            if (translatedText != null && translatedText!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  IconButton(
                    onPressed: onCopy,
                    icon: const Icon(Icons.copy, size: 20),
                    tooltip: 'Copy',
                  ),
                  IconButton(
                    onPressed: onSpeak,
                    icon: Icon(
                      isSpeaking ? Icons.stop : Icons.volume_up,
                      size: 20,
                    ),
                    tooltip: isSpeaking ? 'Stop' : 'Listen',
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
