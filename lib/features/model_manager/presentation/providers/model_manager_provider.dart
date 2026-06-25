import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/services/model_download_service.dart';

enum DownloadStatus { idle, downloading, downloaded, error }

class ModelManagerState {
  final ModelType? activeModel;
  final DownloadStatus lightStatus;
  final DownloadStatus fullStatus;
  final double downloadProgress;
  final String? errorMessage;

  const ModelManagerState({
    this.activeModel,
    this.lightStatus = DownloadStatus.idle,
    this.fullStatus = DownloadStatus.idle,
    this.downloadProgress = 0.0,
    this.errorMessage,
  });

  ModelManagerState copyWith({
    ModelType? activeModel,
    DownloadStatus? lightStatus,
    DownloadStatus? fullStatus,
    double? downloadProgress,
    String? errorMessage,
    bool clearActiveModel = false,
  }) {
    return ModelManagerState(
      activeModel: clearActiveModel ? null : (activeModel ?? this.activeModel),
      lightStatus: lightStatus ?? this.lightStatus,
      fullStatus: fullStatus ?? this.fullStatus,
      downloadProgress: downloadProgress ?? this.downloadProgress,
      errorMessage: errorMessage,
    );
  }
}

class ModelManagerNotifier extends StateNotifier<ModelManagerState> {
  final ModelDownloadService _downloadService;

  ModelManagerNotifier(this._downloadService)
      : super(const ModelManagerState());

  Future<void> checkInstalledModels() async {
    final lightInstalled =
        await _downloadService.isModelDownloaded(ModelType.light);
    final fullInstalled =
        await _downloadService.isModelDownloaded(ModelType.full);

    state = state.copyWith(
      lightStatus:
          lightInstalled ? DownloadStatus.downloaded : DownloadStatus.idle,
      fullStatus:
          fullInstalled ? DownloadStatus.downloaded : DownloadStatus.idle,
      activeModel: fullInstalled
          ? ModelType.full
          : lightInstalled
              ? ModelType.light
              : null,
    );
  }

  Future<void> downloadModel(ModelType type) async {
    try {
      state = state.copyWith(
        downloadProgress: 0.0,
        lightStatus: type == ModelType.light
            ? DownloadStatus.downloading
            : state.lightStatus,
        fullStatus: type == ModelType.full
            ? DownloadStatus.downloading
            : state.fullStatus,
        errorMessage: null,
      );

      await _downloadService.downloadModel(
        type,
        onProgress: (progress) {
          state = state.copyWith(downloadProgress: progress);
        },
      );

      state = state.copyWith(
        lightStatus: type == ModelType.light
            ? DownloadStatus.downloaded
            : state.lightStatus,
        fullStatus: type == ModelType.full
            ? DownloadStatus.downloaded
            : state.fullStatus,
        activeModel: type,
        downloadProgress: 1.0,
      );
    } catch (e) {
      state = state.copyWith(
        lightStatus: type == ModelType.light
            ? DownloadStatus.error
            : state.lightStatus,
        fullStatus:
            type == ModelType.full ? DownloadStatus.error : state.fullStatus,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> deleteModel(ModelType type) async {
    await _downloadService.deleteModel(type);
    state = state.copyWith(
      lightStatus:
          type == ModelType.light ? DownloadStatus.idle : state.lightStatus,
      fullStatus:
          type == ModelType.full ? DownloadStatus.idle : state.fullStatus,
      activeModel: state.activeModel == type ? null : state.activeModel,
      clearActiveModel: state.activeModel == type,
    );
  }
}

final modelDownloadServiceProvider = Provider<ModelDownloadService>((ref) {
  return ModelDownloadService();
});

final modelManagerProvider =
    StateNotifierProvider<ModelManagerNotifier, ModelManagerState>((ref) {
  final service = ref.watch(modelDownloadServiceProvider);
  return ModelManagerNotifier(service);
});
