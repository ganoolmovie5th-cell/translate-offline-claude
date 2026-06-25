import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslationStore } from '../store/translationStore';
import { useModelStore } from '../store/modelStore';
import { AppConstants } from '../core/constants';
import { t } from '../core/i18n';
import { LanguageSelector } from '../components/LanguageSelector';
import { TextInputCard } from '../components/TextInputCard';
import { TranslationResultCard } from '../components/TranslationResultCard';

interface TranslateScreenProps {
  onOpenSettings: () => void;
}

export const TranslateScreen: React.FC<TranslateScreenProps> = ({
  onOpenSettings,
}) => {
  const {
    sourceLanguage,
    targetLanguage,
    inputText,
    result,
    isTranslating,
    isListening,
    isSpeaking,
    partialSttResult,
    error,
    setInputText,
    translateText,
    swapLanguages,
    startListening,
    stopListening,
    speakResult,
    stopSpeaking,
    clearError,
  } = useTranslationStore();

  const s = t(sourceLanguage);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize model on mount
  useEffect(() => {
    useModelStore.getState().checkInstalledModels();
  }, []);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert(s.error, error, [{ text: s.ok, onPress: clearError }]);
    }
  }, [error]);

  // Debounced translation
  const handleTextChange = useCallback(
    (text: string) => {
      setInputText(text);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (text.trim()) {
        debounceRef.current = setTimeout(() => {
          translateText(text);
        }, AppConstants.debounceMs);
      } else {
        useTranslationStore.setState({ result: null });
      }
    },
    [setInputText, translateText]
  );

  const handleMicPress = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakResult();
    }
  }, [isSpeaking, speakResult, stopSpeaking]);

  const handleCopy = useCallback(() => {
    Alert.alert(s.copied, s.copiedMessage, [{ text: s.ok }]);
  }, [s]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TransLite</Text>
        <TouchableOpacity
          onPress={onOpenSettings}
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language Selector */}
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSwap={swapLanguages}
          />

          <View style={styles.spacer} />

          {/* Input Card */}
          <TextInputCard
            value={inputText}
            onChangeText={handleTextChange}
            isListening={isListening}
            partialSttResult={partialSttResult}
            onMicPress={handleMicPress}
            sourceLanguage={sourceLanguage}
          />

          <View style={styles.spacer} />

          {/* Result Card */}
          <TranslationResultCard
            translatedText={result?.translatedText ?? null}
            isLoading={isTranslating}
            isSpeaking={isSpeaking}
            onCopy={handleCopy}
            onSpeak={handleSpeak}
            sourceLanguage={sourceLanguage}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d9488',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  spacer: {
    height: 16,
  },
});
