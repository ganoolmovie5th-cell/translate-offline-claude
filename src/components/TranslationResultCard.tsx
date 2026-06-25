import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

interface TranslationResultCardProps {
  translatedText: string | null;
  isLoading: boolean;
  isSpeaking: boolean;
  onCopy: () => void;
  onSpeak: () => void;
  targetLanguage: string;
}

export const TranslationResultCard: React.FC<TranslationResultCardProps> = ({
  translatedText,
  isLoading,
  isSpeaking,
  onCopy,
  onSpeak,
  targetLanguage,
}) => {
  const handleCopy = async () => {
    if (translatedText) {
      await Clipboard.setStringAsync(translatedText);
      onCopy();
    }
  };

  const loadingText =
    targetLanguage === 'id' ? 'Menerjemahkan...' : 'Translating...';
  const placeholderText =
    targetLanguage === 'id'
      ? 'Terjemahan akan muncul di sini'
      : 'Translation will appear here';

  return (
    <View style={styles.card}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0d9488" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      ) : translatedText ? (
        <>
          <Text style={styles.resultText} selectable>
            {translatedText}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={18} color="#6b7280" />
              <Text style={styles.actionLabel}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSpeak}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSpeaking ? 'stop' : 'volume-high-outline'}
                size={18}
                color={isSpeaking ? '#dc2626' : '#6b7280'}
              />
              <Text
                style={[
                  styles.actionLabel,
                  isSpeaking && { color: '#dc2626' },
                ]}
              >
                {isSpeaking ? 'Stop' : 'Listen'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.placeholder}>{placeholderText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0fdfa',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  resultText: {
    fontSize: 16,
    color: '#134e4a',
    lineHeight: 24,
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  actionLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
});
