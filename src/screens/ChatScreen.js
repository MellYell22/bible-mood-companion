import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  StatusBar, Animated, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useDavid } from '../hooks/useDavid';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { messages, isTyping, error, sendMessage, loadConversation, clearConversation } = useDavid();
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadConversation();
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setInputText('');
    const reply = await sendMessage(text);
    if (reply && voiceEnabled) {
      Speech.speak(reply, {
        language: 'en-US',
        rate: 0.88,
        pitch: 1.0,
      });
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) Speech.stop();
    setVoiceEnabled(v => !v);
  };

  const renderItem = ({ item }) => <MessageBubble message={item} />;

  const renderFooter = () => {
    if (!isTyping) return null;
    return <TypingIndicator />;
  };

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.bgMid, Colors.bgLight]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 10, opacity: headerFade }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <LinearGradient colors={[Colors.gold, Colors.goldLight]} style={styles.headerAvatar}>
            <Text style={styles.headerAvatarIcon}>✝</Text>
          </LinearGradient>
          <View>
            <Text style={styles.headerName}>David</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Here for you</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={toggleVoice} style={[styles.voiceBtn, voiceEnabled && styles.voiceBtnActive]}>
          <Text style={[styles.voiceBtnText, voiceEnabled && styles.voiceBtnTextActive]}>
            {voiceEnabled ? '🔊' : '🔇'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Error */}
        {error && (
          <View style={styles.errorBar}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputWrapper, { paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Share what's on your heart…"
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              maxLength={500}
              style={styles.input}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
              activeOpacity={0.8}
              style={styles.sendWrapper}
            >
              <LinearGradient
                colors={inputText.trim() && !isTyping
                  ? [Colors.purple, Colors.purpleLight]
                  : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)']}
                style={styles.sendBtn}
              >
                {isTyping
                  ? <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
                  : <Text style={styles.sendIcon}>➤</Text>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Created by AA Designs · Bible Mood Companion
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(15,12,41,0.7)',
  },
  backBtn: { padding: 6, marginRight: 4 },
  backIcon: { color: 'rgba(255,255,255,0.4)', fontSize: 28, lineHeight: 28 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  headerAvatarIcon: { fontSize: 16 },
  headerName: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.serif,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.online,
    shadowColor: Colors.online,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.sans,
  },
  voiceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  voiceBtnActive: {
    borderColor: 'rgba(201,169,110,0.45)',
    backgroundColor: 'rgba(201,169,110,0.15)',
  },
  voiceBtnText: { fontSize: 14 },
  voiceBtnTextActive: { color: Colors.gold },
  messagesList: { paddingTop: 18, paddingBottom: 10 },
  errorBar: {
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 10,
    backgroundColor: Colors.error,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 12,
  },
  errorText: {
    color: Colors.errorText,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.sans,
  },
  inputWrapper: {
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: 'rgba(15,12,41,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.inputBg,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingLeft: 16,
    paddingRight: 7,
    paddingVertical: 7,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.serif,
    lineHeight: 22,
    maxHeight: 110,
    paddingVertical: 3,
  },
  sendWrapper: { marginLeft: 6 },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  sendIcon: { color: Colors.white, fontSize: 15 },
  footerText: {
    textAlign: 'center',
    marginTop: 7,
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.sans,
    letterSpacing: 0.5,
  },
});
