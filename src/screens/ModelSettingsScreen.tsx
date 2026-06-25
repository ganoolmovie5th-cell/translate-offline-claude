import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useModelStore } from '../store/modelStore';
import { useTranslationStore } from '../store/translationStore';
import { ModelType, ModelConfig, DownloadStatus } from '../core/types';
import { t } from '../core/i18n';

interface ModelSettingsScreenProps {
  onBack: () => void;
}

export const ModelSettingsScreen: React.FC<ModelSettingsScreenProps> = ({
  onBack,
}) => {
  const {
    activeModel,
    lightStatus,
    fullStatus,
    downloadProgress,
    errorMessage,
    downloadModel,
    deleteModel,
  } = useModelStore();

  const { sourceLanguage } = useTranslationStore();
  const s = t(sourceLanguage);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>{s.languageModels}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Light Model */}
        <ModelCard
          title={s.lightModel}
          description={`${s.lightDescription} (${ModelConfig[ModelType.LIGHT].sizeDescription})`}
          status={lightStatus}
          isActive={activeModel === ModelType.LIGHT}
          progress={
            lightStatus === DownloadStatus.DOWNLOADING
              ? downloadProgress
              : undefined
          }
          onDownload={() => downloadModel(ModelType.LIGHT)}
          onDelete={() => deleteModel(ModelType.LIGHT)}
          strings={s}
        />

        <View style={styles.spacer} />

        {/* Full Model */}
        <ModelCard
          title={s.fullModel}
          description={`${s.fullDescription} (${ModelConfig[ModelType.FULL].sizeDescription})`}
          status={fullStatus}
          isActive={activeModel === ModelType.FULL}
          progress={
            fullStatus === DownloadStatus.DOWNLOADING
              ? downloadProgress
              : undefined
          }
          onDownload={() => downloadModel(ModelType.FULL)}
          onDelete={() => deleteModel(ModelType.FULL)}
          strings={s}
        />

        {/* Error */}
        {errorMessage && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#6b7280"
          />
          <Text style={styles.infoText}>{s.downloadInfo}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Model Card Sub-component ---

interface ModelCardProps {
  title: string;
  description: string;
  status: DownloadStatus;
  isActive: boolean;
  progress?: number;
  onDownload: () => void;
  onDelete: () => void;
  strings: ReturnType<typeof t>;
}

const ModelCard: React.FC<ModelCardProps> = ({
  title,
  description,
  status,
  isActive,
  progress,
  onDownload,
  onDelete,
  strings: s,
}) => {
  const renderAction = () => {
    switch (status) {
      case DownloadStatus.IDLE:
        return (
          <TouchableOpacity onPress={onDownload} style={styles.iconButton}>
            <Ionicons name="download-outline" size={22} color="#0d9488" />
          </TouchableOpacity>
        );
      case DownloadStatus.DOWNLOADING:
        return <ActivityIndicator size="small" color="#0d9488" />;
      case DownloadStatus.DOWNLOADED:
        return (
          <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color="#6b7280" />
          </TouchableOpacity>
        );
      case DownloadStatus.ERROR:
        return (
          <TouchableOpacity onPress={onDownload} style={styles.iconButton}>
            <Ionicons name="refresh" size={22} color="#dc2626" />
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.modelCard}>
      <View style={styles.modelCardRow}>
        <Ionicons
          name={isActive ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isActive ? '#0d9488' : '#d1d5db'}
        />
        <View style={styles.modelInfo}>
          <Text style={styles.modelTitle}>{title}</Text>
          <Text style={styles.modelDescription}>{description}</Text>
        </View>
        {renderAction()}
      </View>

      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
  },
  spacer: {
    height: 16,
  },
  modelCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
  },
  modelCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelInfo: {
    flex: 1,
    marginLeft: 12,
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  modelDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0d9488',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 35,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#dc2626',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
