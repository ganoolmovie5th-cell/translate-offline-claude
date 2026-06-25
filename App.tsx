import React, { useState } from 'react';
import { TranslateScreen } from './src/screens/TranslateScreen';
import { ModelSettingsScreen } from './src/screens/ModelSettingsScreen';

type Screen = 'translate' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('translate');

  if (currentScreen === 'settings') {
    return (
      <ModelSettingsScreen onBack={() => setCurrentScreen('translate')} />
    );
  }

  return (
    <TranslateScreen onOpenSettings={() => setCurrentScreen('settings')} />
  );
}
