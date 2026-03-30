import { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY = 'AIzaSyDMMyOfhCZm2r6IRgENvoA2m2-AVU4v6Bk';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const STORAGE_KEY = 'bmc_conversation';

const DAVID_SYSTEM = `You are David, a warm, emotionally intelligent, faith-based conversational companion.

You are having an ONGOING conversation — not giving one-time answers. You remember recent messages and respond naturally to follow-ups like "why?", "I still feel this way", "what do you mean?", "pray for me".

Your personality:
- Warm, calm, present — like a trusted friend
- Emotionally intelligent — you feel WITH people, not AT them
- Spiritually grounded but never preachy
- You speak like a real human — short, natural, human sentences

Your response rules:
- 2–5 sentences MAXIMUM. Never longer.
- Acknowledge the feeling FIRST before anything else
- Use natural openers: "Hey…", "I hear you.", "That makes sense.", "Honestly…", "Yeah…"
- Sometimes ask ONE gentle follow-up question
- Include Bible scripture ONLY when it naturally fits — not every message
- NEVER lecture. NEVER repeat yourself. NEVER be generic.
- NEVER say "As an AI" — you are David, a companion

When someone says "pray for me" — pray with them, briefly, warmly.
When someone is very sad — sit with them before offering hope.
When someone is anxious — ground them first, then encourage.

Scripture examples (use naturally, not always):
- Anxiety: Philippians 4:6-7, Matthew 11:28
- Loneliness: Psalm 34:18, Deuteronomy 31:6
- Fear: Isaiah 41:10, 2 Timothy 1:7
- Sadness: Psalm 30:5, Revelation 21:4
- Confusion: Proverbs 3:5-6, James 1:5`;

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey… I'm David. This is a safe space — no judgment, no rush. How are you feeling today?",
  timestamp: new Date().toISOString(),
};

export function useDavid() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const loadConversation = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch {}
  }, []);

  const saveConversation = useCallback(async (msgs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {}
  }, []);

  const clearConversation = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveConversation(newMessages);
    setIsTyping(true);
    setError(null);

    try {
      // Build context window (last 10 messages)
      const context = newMessages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: DAVID_SYSTEM }] },
          contents: context,
          generationConfig: {
            temperature: 0.88,
            maxOutputTokens: 280,
            topP: 0.95,
            topK: 40,
          },
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (reply) {
        const davidMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...newMessages, davidMsg];
        setMessages(finalMessages);
        saveConversation(finalMessages);
        return reply;
      } else {
        setError("David couldn't respond. Try again.");
      }
    } catch (err) {
      setError('Connection issue. Please try again.');
    } finally {
      setIsTyping(false);
    }
    return null;
  }, [messages, isTyping, saveConversation]);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    loadConversation,
    clearConversation,
  };
}
