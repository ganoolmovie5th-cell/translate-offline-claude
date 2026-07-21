import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-audio';
import { Language, LanguageConfig } from '../core/types';
import { t } from '../core/i18n';

interface VoiceButtonProps {
  text: string;
  language: Language;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ text, language }) => {
  const [isLoading, setIsLoading] = useState(false);
  const s = t(language);

  const handleVoicePress = async () => {
    if (!text.trim()) {
      Alert.alert(s.error, 'Enter text first');
      return;
    }

    setIsLoading(true);
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(s.error, 'Audio permission denied');
        return;
      }

      // Speak the text
      const locale = LanguageConfig[language as Language].locale;

      await Speech.speak(text, {
        language: locale,
        rate: 0.9,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          Alert.alert(s.error, `TTS failed: ${error}`);
          setIsLoading(false);
        },
        onStopped: () => setIsLoading(false),
      });
    } catch (error) {
      Alert.alert(s.error, 'Failed to play audio');
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonActive]}
      onPress={handleVoicePress}
      disabled={isLoading}
    >
      <Ionicons
        name={isLoading ? 'volume-high' : 'volume-mute'}
        size={18}
        color={isLoading ? '#0d9488' : '#6b7280'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#e0f2fe',
  },
});
