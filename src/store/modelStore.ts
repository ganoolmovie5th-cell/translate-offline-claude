import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      activeModel: null,
      lightStatus: DownloadStatus.IDLE,
      fullStatus: DownloadStatus.IDLE,
      downloadProgress: 0,
      errorMessage: null,

      checkInstalledModels: async () => {
        const { activeModel, lightStatus, fullStatus } = get();

        // If already has a persisted active model, just load service
        if (activeModel) {
          await translationService.loadModel();
          return;
        }

        // First time: mark light as ready (API-based, no real download needed)
        set({
          lightStatus: DownloadStatus.DOWNLOADED,
          fullStatus: DownloadStatus.IDLE,
          activeModel: ModelType.LIGHT,
        });
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
        const statusKey =
          type === ModelType.LIGHT ? 'lightStatus' : 'fullStatus';
        const { activeModel } = get();

        set({
          [statusKey]: DownloadStatus.IDLE,
          activeModel: activeModel === type ? null : activeModel,
        } as any);
      },
    }),
    {
      name: 'translite-model-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields (not transient state like progress/error)
      partialize: (state) => ({
        activeModel: state.activeModel,
        lightStatus: state.lightStatus,
        fullStatus: state.fullStatus,
      }),
    }
  )
);
