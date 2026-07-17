import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Language } from '../core/types';
import { t } from '../core/i18n';
import { VoiceButton } from './VoiceButton';

interface TextInputCardProps {
  value: string;
  onChangeText: (text: string) => void;
  sourceLanguage: Language;
}

export const TextInputCard: React.FC<TextInputCardProps> = ({
  value,
  onChangeText,
  sourceLanguage,
}) => {
  const s = t(sourceLanguage);

  return (
    <View style={styles.card}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={s.typeOrSpeak}
          placeholderTextColor="#9ca3af"
          multiline
        />
        <VoiceButton text={value} language={sourceLanguage} />
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
