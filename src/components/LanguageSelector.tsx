import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language, LanguageConfig } from '../core/types';

interface LanguageSelectorProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSwap: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguage,
  onSwap,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleSwap = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
    onSwap();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.languageBox}>
        <Text style={styles.languageText}>
          {LanguageConfig[sourceLanguage].displayName}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Ionicons name="swap-horizontal" size={22} color="#0d9488" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.languageBox}>
        <Text style={styles.languageText}>
          {LanguageConfig[targetLanguage].displayName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageBox: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#134e4a',
  },
  swapButton: {
    backgroundColor: '#ccfbf1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});
