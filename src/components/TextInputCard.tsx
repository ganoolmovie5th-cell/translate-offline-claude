import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { VoiceButton } from './VoiceButton';
import { AppConstants } from '../core/constants';

interface TextInputCardProps {
  value: string;
  onChangeText: (text: string) => void;
  isListening: boolean;
  partialSttResult: string;
  onMicPress: () => void;
}

export const TextInputCard: React.FC<TextInputCardProps> = ({
  value,
  onChangeText,
  isListening,
  partialSttResult,
  onMicPress,
}) => {
  const placeholder = isListening
    ? partialSttResult || 'Listening...'
    : 'Type or speak...';

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline
        maxLength={AppConstants.maxInputChars}
        editable={!isListening}
      />
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {value.length}/{AppConstants.maxInputChars}
        </Text>
        <VoiceButton isListening={isListening} onPress={onMicPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  input: {
    fontSize: 16,
    color: '#1f2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
