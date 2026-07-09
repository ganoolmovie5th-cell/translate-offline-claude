import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { Language } from '../core/types';
import { t } from '../core/i18n';
import { ttsService } from '../services/ttsService';
import { pronunciationData, PronunciationEntry } from '../data/pronunciation';

export const PronunciationScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uiLang] = useState<Language>(Language.ID);

  const s = t(uiLang);

  const sections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return pronunciationData
      .map((cat) => ({
        title: uiLang === Language.EN ? cat.labelEn : cat.labelId,
        data: q
          ? cat.entries.filter(
              (e) =>
                e.word.toLowerCase().includes(q) ||
                e.example.toLowerCase().includes(q) ||
                e.guide.toLowerCase().includes(q)
            )
          : cat.entries,
      }))
      .filter((section) => section.data.length > 0);
  }, [searchQuery, uiLang]);

  const handleSpeak = useCallback(async (entry: PronunciationEntry) => {
    await ttsService.speak(entry.word, Language.ID);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PronunciationEntry }) => (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.word}>{item.word}</Text>
          <TouchableOpacity
            style={styles.speakBtn}
            onPress={() => handleSpeak(item)}
            accessibilityRole="button"
            accessibilityLabel={`${s.listen} ${item.word}`}
          >
            <Text style={styles.speakIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.ipa}>{item.ipa}</Text>
        <View style={styles.guideRow}>
          <Text style={styles.guideLabel}>{s.phonetic}:</Text>
          <Text style={styles.guideValue}>{item.guide}</Text>
        </View>
        <View style={styles.meaningRow}>
          <Text style={styles.meaningLabel}>{s.meaning}:</Text>
          <Text style={styles.meaningValue}>{item.example}</Text>
        </View>
      </View>
    ),
    [handleSpeak, s]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={s.searchWords}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.word}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d9488',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  speakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakIcon: {
    fontSize: 16,
  },
  ipa: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  guideLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  guideValue: {
    fontSize: 14,
    color: '#0d9488',
    fontWeight: '600',
  },
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  meaningLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  meaningValue: {
    fontSize: 14,
    color: '#4b5563',
  },
});
