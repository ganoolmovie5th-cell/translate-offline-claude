import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Language } from '../core/types';
import { t } from '../core/i18n';
import { ttsService } from '../services/ttsService';
import { phrasebook, Phrase, PhraseCategory } from '../data/phrasebook';

export const PhrasebookScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(phrasebook[0].key);
  const [searchQuery, setSearchQuery] = useState('');
  const [uiLang] = useState<Language>(Language.ID);

  const s = t(uiLang);

  const currentCategory = useMemo(
    () => phrasebook.find((c) => c.key === selectedCategory) ?? phrasebook[0],
    [selectedCategory]
  );

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return currentCategory.phrases;
    const q = searchQuery.toLowerCase();
    return currentCategory.phrases.filter(
      (p) => p.en.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [currentCategory, searchQuery]);

  const handleCopy = useCallback(async (phrase: Phrase) => {
    await Clipboard.setStringAsync(`${phrase.en}\n${phrase.id}`);
    Alert.alert(s.copied, s.copiedMessage, [{ text: s.ok }]);
  }, [s]);

  const handleListen = useCallback(async (phrase: Phrase) => {
    await ttsService.speak(phrase.id, Language.ID);
  }, []);

  const renderPhrase = useCallback(
    ({ item }: { item: Phrase }) => (
      <TouchableOpacity
        style={styles.phraseCard}
        onPress={() => handleCopy(item)}
        onLongPress={() => handleListen(item)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${item.en}. ${item.id}`}
      >
        <View style={styles.phraseContent}>
          <Text style={styles.phraseEn}>{item.en}</Text>
          <Text style={styles.phraseId}>{item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.speakBtn}
          onPress={() => handleListen(item)}
          accessibilityRole="button"
          accessibilityLabel={s.listen}
        >
          <Text style={styles.speakIcon}>🔊</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [handleCopy, handleListen, s]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={s.searchPhrases}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Category tabs */}
      <FlatList
        horizontal
        data={phrasebook}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }: { item: PhraseCategory }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              item.key === selectedCategory && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={uiLang === Language.EN ? item.labelEn : item.labelId}
          >
            <Text
              style={[
                styles.categoryText,
                item.key === selectedCategory && styles.categoryTextActive,
              ]}
            >
              {uiLang === Language.EN ? item.labelEn : item.labelId}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Phrases */}
      <FlatList
        data={filteredPhrases}
        keyExtractor={(item) => `${item.en}-${item.id}`}
        renderItem={renderPhrase}
        contentContainerStyle={styles.phraseList}
        showsVerticalScrollIndicator={false}
      />

      {/* Hint */}
      <View style={styles.hintRow}>
        <Text style={styles.hintText}>{s.tapToCopy} · {s.longPressToListen}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  categoryBtnActive: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0d9488',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  phraseList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  phraseContent: {
    flex: 1,
  },
  phraseEn: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  phraseId: {
    fontSize: 14,
    color: '#0d9488',
  },
  speakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  speakIcon: {
    fontSize: 16,
  },
  hintRow: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccfbf1',
  },
  hintText: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
