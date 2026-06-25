import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/services/model_download_service.dart';
import '../providers/model_manager_provider.dart';

class ModelSettingsScreen extends ConsumerWidget {
  const ModelSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(modelManagerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Language Models')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _ModelCard(
              title: 'Light Model',
              description:
                  'Fast, smaller file (${ModelType.light.sizeDescription})',
              status: state.lightStatus,
              isActive: state.activeModel == ModelType.light,
              progress: state.lightStatus == DownloadStatus.downloading
                  ? state.downloadProgress
                  : null,
              onDownload: () => ref
                  .read(modelManagerProvider.notifier)
                  .downloadModel(ModelType.light),
              onDelete: () => ref
                  .read(modelManagerProvider.notifier)
                  .deleteModel(ModelType.light),
            ),
            const SizedBox(height: 16),
            _ModelCard(
              title: 'Full Model',
              description:
                  'Higher accuracy (${ModelType.full.sizeDescription})',
              status: state.fullStatus,
              isActive: state.activeModel == ModelType.full,
              progress: state.fullStatus == DownloadStatus.downloading
                  ? state.downloadProgress
                  : null,
              onDownload: () => ref
                  .read(modelManagerProvider.notifier)
                  .downloadModel(ModelType.full),
              onDelete: () => ref
                  .read(modelManagerProvider.notifier)
                  .deleteModel(ModelType.full),
            ),
            if (state.errorMessage != null) ...[
              const SizedBox(height: 16),
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.error_outline,
                          color: Theme.of(context).colorScheme.error),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          state.errorMessage!,
                          style: TextStyle(
                            color:
                                Theme.of(context).colorScheme.onErrorContainer,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ModelCard extends StatelessWidget {
  final String title;
  final String description;
  final DownloadStatus status;
  final bool isActive;
  final double? progress;
  final VoidCallback onDownload;
  final VoidCallback onDelete;

  const _ModelCard({
    required this.title,
    required this.description,
    required this.status,
    required this.isActive,
    required this.progress,
    required this.onDownload,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  isActive ? Icons.check_circle : Icons.circle_outlined,
                  color: isActive ? Colors.teal : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title,
                          style: Theme.of(context).textTheme.titleMedium),
                      Text(description,
                          style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                ),
                _buildTrailing(),
              ],
            ),
            if (progress != null) ...[
              const SizedBox(height: 12),
              LinearProgressIndicator(value: progress),
              const SizedBox(height: 4),
              Text(
                '${(progress! * 100).toInt()}%',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTrailing() {
    switch (status) {
      case DownloadStatus.idle:
        return IconButton(
          icon: const Icon(Icons.download),
          onPressed: onDownload,
        );
      case DownloadStatus.downloading:
        return const SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(strokeWidth: 2),
        );
      case DownloadStatus.downloaded:
        return IconButton(
          icon: const Icon(Icons.delete_outline),
          onPressed: onDelete,
        );
      case DownloadStatus.error:
        return IconButton(
          icon: const Icon(Icons.refresh, color: Colors.red),
          onPressed: onDownload,
        );
    }
  }
}
