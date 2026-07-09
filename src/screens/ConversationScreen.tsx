import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Language, LanguageConfig } from '../core/types';
import { t } from '../core/i18n';
import { translationService } from '../services/translationService';
import { ttsService } from '../services/ttsService';

interface Message {
  id: string;
  original: string;
  translated: string;
  sourceLang: Language;
}

export const ConversationScreen: React.FC = () => {
  const [speakingLang, setSpeakingLang] = useState<Language>(Language.EN);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const s = t(speakingLang);
  const targetLang = speakingLang === Language.EN ? Language.ID : Language.EN;

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isTranslating) return;

    setInputText('');
    setIsTranslating(true);

    try {
      const result = await translationService.translate(text, speakingLang, targetLang);
      const msg: Message = {
        id: Date.now().toString(),
        original: text,
        translated: result.translatedText,
        sourceLang: speakingLang,
      };
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      // silently fail
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, isTranslating, speakingLang, targetLang]);

  const handleTapBubble = useCallback(async (msg: Message) => {
    const lang = msg.sourceLang === Language.EN ? Language.ID : Language.EN;
    await ttsService.speak(msg.translated, lang);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleLang = useCallback(() => {
    setSpeakingLang((prev) => (prev === Language.EN ? Language.ID : Language.EN));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Language toggle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.langToggle}
          onPress={toggleLang}
          accessibilityRole="button"
          accessibilityLabel={`${s.speakingAs} ${LanguageConfig[speakingLang].displayName}`}
        >
          <Text style={styles.langText}>
            {LanguageConfig[Language.EN].displayName}
          </Text>
          <Text style={styles.arrow}> ↔ </Text>
          <Text style={styles.langText}>
            {LanguageConfig[Language.ID].displayName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClear}
          accessibilityRole="button"
          accessibilityLabel={s.clearConversation}
        >
          <Text style={styles.clearText}>{s.clearConversation}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.speakingLabel}>
        {s.speakingAs}: {LanguageConfig[speakingLang].displayName}
      </Text>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => {
          const isLeft = msg.sourceLang === Language.EN;
          return (
            <TouchableOpacity
              key={msg.id}
              style={[styles.bubble, isLeft ? styles.bubbleLeft : styles.bubbleRight]}
              onPress={() => handleTapBubble(msg)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${msg.translated}. ${s.tapToCopy}`}
            >
              <Text style={[styles.originalText, isLeft ? styles.textLeft : styles.textRight]}>
                {msg.original}
              </Text>
              <Text style={[styles.translatedText, isLeft ? styles.textLeft : styles.textRight]}>
                {msg.translated}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={s.conversationPlaceholder}
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isTranslating}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || isTranslating) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTranslating}
            accessibilityRole="button"
            accessibilityLabel={s.send}
          >
            <Text style={styles.sendText}>
              {isTranslating ? '...' : '➤'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccfbf1',
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d9488',
  },
  arrow: {
    fontSize: 14,
    color: '#0d9488',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  clearText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
  },
  speakingLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    paddingVertical: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#0d9488',
    borderBottomRightRadius: 4,
  },
  originalText: {
    fontSize: 12,
    marginBottom: 4,
  },
  translatedText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textLeft: {
    color: '#6b7280',
  },
  textRight: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccfbf1',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
