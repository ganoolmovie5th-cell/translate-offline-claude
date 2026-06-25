import { create } from 'zustand';
import { ModelType, DownloadStatus } from '../core/types';
import { translationService } from '../services/translationService';

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
    // Since we use API-based translation, mark light model as "ready"
    // immediately so users can start translating without downloading anything.
    set({
      lightStatus: DownloadStatus.DOWNLOADED,
      fullStatus: DownloadStatus.IDLE,
      activeModel: ModelType.LIGHT,
    });

    // Initialize the translation service
    await translationService.loadModel();
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
      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        set({ downloadProgress: i / 10 });
      }

      // Load the translation service
      await translationService.loadModel();

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
    const statusKey = type === ModelType.LIGHT ? 'lightStatus' : 'fullStatus';
    const { activeModel } = get();

    set({
      [statusKey]: DownloadStatus.IDLE,
      activeModel: activeModel === type ? null : activeModel,
    } as any);
  },
}));
