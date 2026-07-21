import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Language } from '../core/types';
import { t } from '../core/i18n';
import { translationService } from '../services/translationService';

export const CameraScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang] = useState<Language>(Language.ID);
  const [targetLang] = useState<Language>(Language.EN);

  const s = t(Language.ID);

  const handleTakePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }, []);

  const handleTranslate = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isTranslating) return;

    setIsTranslating(true);
    try {
      const result = await translationService.translate(text, sourceLang, targetLang);
      setTranslatedText(result.translatedText);
    } catch {
      setTranslatedText(null);
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, isTranslating, sourceLang, targetLang]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Description */}
          <View style={styles.descCard}>
            <Text style={styles.descIcon}>📷</Text>
            <Text style={styles.descText}>{s.cameraDescription}</Text>
          </View>

          {/* Photo area */}
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={handleTakePhoto}
                accessibilityRole="button"
                accessibilityLabel={s.takePhoto}
              >
                <Text style={styles.retakeText}>📷 {s.takePhoto}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoPlaceholder}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={s.takePhoto}
            >
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>{s.takePhoto}</Text>
              <Text style={styles.placeholderHint}>{s.noPhotoYet}</Text>
            </TouchableOpacity>
          )}

          {/* Text input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={s.typeTextFromPhoto}
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.translateBtn, (!inputText.trim() || isTranslating) && styles.translateBtnDisabled]}
              onPress={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              accessibilityRole="button"
              accessibilityLabel={s.translateButton}
            >
              <Text style={styles.translateBtnText}>
                {isTranslating ? s.translating : s.translateButton}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Result */}
          {translatedText && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>{s.translationResult}</Text>
              <Text style={styles.resultText}>{translatedText}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  descCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  descIcon: {
    fontSize: 24,
  },
  descText: {
    flex: 1,
    fontSize: 13,
    color: '#0d9488',
    lineHeight: 18,
  },
  photoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  retakeBtn: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  retakeText: {
    fontSize: 14,
    color: '#0d9488',
    fontWeight: '500',
  },
  photoPlaceholder: {
    height: 180,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccfbf1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 40,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d9488',
  },
  placeholderHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    minHeight: 80,
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  translateBtn: {
    backgroundColor: '#0d9488',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  translateBtnDisabled: {
    opacity: 0.4,
  },
  translateBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#0d9488',
  },
  resultLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  resultText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
});
