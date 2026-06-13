import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { ChatMessage } from '../types';
import { chatWithAI } from '../services/groq';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm SkillBridge AI, your career advisor. Ask me about DSA prep, career paths, coding questions, or study strategies!",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingDots = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let loop: any;
    if (isTyping) {
      loop = Animated.loop(
        Animated.sequence(
          typingDots.map((anim, i) =>
            Animated.sequence([
              Animated.delay(i * 200),
              Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ])
          )
        )
      );
      loop.start();
    }
    return () => { if (loop) loop.stop(); };
  }, [isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageRow, item.isUser ? styles.messageRowUser : styles.messageRowAI]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={16} color={Colors.accent} />
        </View>
      )}
      <View style={[styles.bubble, item.isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, item.isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return (
      <View style={styles.messageRowAI}>
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={16} color={Colors.accent} />
        </View>
        <View style={[styles.bubble, styles.bubbleAI]}>
          <View style={styles.typingDots}>
            {typingDots.map((anim, i) => (
              <Animated.View
                key={i}
                style={[styles.typingDot, {
                  opacity: anim,
                  transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
                }]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={renderTypingIndicator}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!input.trim()}>
          <Ionicons name="send" size={20} color={!input.trim() ? Colors.textMuted : '#fff'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  chatList: { flex: 1 },
  chatContent: { padding: Spacing.md, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: Spacing.md, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAI: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  bubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18 },
  bubbleUser: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  bubbleAI: { backgroundColor: Colors.card, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: FontSizes.body, lineHeight: 22 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAI: { color: Colors.text },
  typingDots: { flexDirection: 'row', gap: 6 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: FontSizes.body,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
