import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TranslateScreen } from './src/screens/TranslateScreen';
import { ConversationScreen } from './src/screens/ConversationScreen';
import { PhrasebookScreen } from './src/screens/PhrasebookScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { PronunciationScreen } from './src/screens/PronunciationScreen';

type Screen = 'translate' | 'conversation' | 'phrasebook' | 'camera' | 'pronunciation';

interface Tab {
  key: Screen;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  { key: 'translate', icon: '🔤', label: 'Terjemah' },
  { key: 'conversation', icon: '💬', label: 'Percakapan' },
  { key: 'phrasebook', icon: '📖', label: 'Frasa' },
  { key: 'camera', icon: '📷', label: 'Kamera' },
  { key: 'pronunciation', icon: '🗣️', label: 'Pelafalan' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('translate');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'translate':
        return <TranslateScreen />;
      case 'conversation':
        return <ConversationScreen />;
      case 'phrasebook':
        return <PhrasebookScreen />;
      case 'camera':
        return <CameraScreen />;
      case 'pronunciation':
        return <PronunciationScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveScreen(tab.key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: activeScreen === tab.key }}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                activeScreen === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0d9488',
    fontWeight: '600',
  },
});
