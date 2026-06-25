import { create } from 'zustand';
import { ModelType, DownloadStatus, ModelConfig } from '../core/types';

interface ModelState {
  activeModel: ModelType | null;
  lightStatus: DownloadStatus;
  fullStatus: DownloadStatus;
  downloadProgress: number;
  errorMessage: string | null;

  // Actions
  checkInstalledModels: () => Promise<void>;
  downloadModel: (type: ModelType) => Promise<void>;
  deleteModel: (type: ModelType) => Promise<void>;
}

export const useModelStore = create<ModelState>((set, get) => ({
  activeModel: null,
  lightStatus: DownloadStatus.IDLE,
  fullStatus: DownloadStatus.IDLE,
  downloadProgress: 0,
  errorMessage: null,

  checkInstalledModels: async () => {
    // In production: check if model files exist in app storage
    // For now, simulate that no models are downloaded
    // This would use expo-file-system to check file existence
    set({
      lightStatus: DownloadStatus.IDLE,
      fullStatus: DownloadStatus.IDLE,
      activeModel: null,
    });
  },

  downloadModel: async (type: ModelType) => {
    try {
      const statusKey =
        type === ModelType.LIGHT ? 'lightStatus' : 'fullStatus';

      set({
        [statusKey]: DownloadStatus.DOWNLOADING,
        downloadProgress: 0,
        errorMessage: null,
      } as any);

      // Simulate download progress
      // In production: use expo-file-system downloadAsync with progress callback
      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        set({ downloadProgress: i / 10 });
      }

      set({
        [statusKey]: DownloadStatus.DOWNLOADED,
        activeModel: type,
        downloadProgress: 1,
      } as any);
    } catch (e: any) {
      const statusKey =
        type === ModelType.LIGHT ? 'lightStatus' : 'fullStatus';
      set({
        [statusKey]: DownloadStatus.ERROR,
        errorMessage: e.message || 'Download failed',
      } as any);
    }
  },

  deleteModel: async (type: ModelType) => {
    // In production: delete file from expo-file-system
    const statusKey = type === ModelType.LIGHT ? 'lightStatus' : 'fullStatus';
    const { activeModel } = get();

    set({
      [statusKey]: DownloadStatus.IDLE,
      activeModel: activeModel === type ? null : activeModel,
    } as any);
  },
}));
