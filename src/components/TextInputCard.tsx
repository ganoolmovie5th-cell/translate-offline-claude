import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Language } from '../core/types';
import { t } from '../core/i18n';

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
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={s.typeOrSpeak}
        placeholderTextColor="#9ca3af"
        multiline
      />
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
});
