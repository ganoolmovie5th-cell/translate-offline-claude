import 'package:flutter/material.dart';
import 'voice_button.dart';

class TextInputCard extends StatelessWidget {
  final TextEditingController controller;
  final bool isListening;
  final String partialSttResult;
  final ValueChanged<String> onChanged;
  final VoidCallback onMicTap;

  const TextInputCard({
    super.key,
    required this.controller,
    required this.isListening,
    required this.partialSttResult,
    required this.onChanged,
    required this.onMicTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: controller,
              onChanged: onChanged,
              maxLines: 4,
              minLines: 2,
              decoration: InputDecoration(
                hintText: isListening
                    ? (partialSttResult.isNotEmpty
                        ? partialSttResult
                        : 'Listening...')
                    : 'Type or speak...',
                border: InputBorder.none,
                counterText: '',
              ),
              maxLength: 500,
            ),
            Align(
              alignment: Alignment.centerRight,
              child: VoiceButton(
                isListening: isListening,
                onTap: onMicTap,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
