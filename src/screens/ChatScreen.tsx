import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store';
import { Avatar, Toast } from '../components/ui';
import { C, R } from '../theme';
import type { Message } from '../store';

export default function ChatScreen() {
  const { id: convId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversations, sendMessage: storeSend, toast, isDemo } = useStore();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const conv = conversations.find(c => c.id === convId);

  useEffect(() => {
    if (conv?.messages.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [conv?.messages.length]);

  if (!conv) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.muted }}>Conversation not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: C.accent, marginTop: 12 }}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const match = conv.match;

  // Conversation starter prompts
  const prompts = [
    `How long have you been watching ${match.sharedChannels[0]?.channelName ?? 'that channel'}?`,
    `Hot take on ${match.sharedChannels[1]?.channelName ?? 'your favourite channel'}?`,
    'What video got you down the rabbit hole?',
  ];

  function handleSend() {
    const t = text.trim();
    if (!t) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setText('');
    storeSend(conv.id, t);
  }

  function renderMessage({ item, index }: { item: Message; index: number }) {
    const isMe = item.senderId === 'me';
    const msgs = conv.messages;
    const prev = msgs[index - 1];
    const showAvatar = !isMe && (!prev || prev.senderId === 'me');

    return (
      <View style={[m.row, isMe && m.rowMe]}>
        {!isMe && (
          <View style={m.avatarSlot}>
            {showAvatar
              ? <Avatar name={match.name} grad={match.avatarGrad} size={28} />
              : null}
          </View>
        )}
        <View style={[m.bubble, isMe ? m.bubbleMe : m.bubbleThem]}>
          <Text style={[m.text, isMe && m.textMe]}>{item.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.back}>←</Text>
          </TouchableOpacity>
          <Avatar name={match.name} grad={match.avatarGrad} size={34} />
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{match.name}</Text>
            <Text style={s.score}>{match.score}% match</Text>
          </View>
          <View style={s.onlineBadge}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>active now</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={conv.messages}
          keyExtractor={item => item.id}
          contentContainerStyle={s.msgList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            conv.messages.length === 0 ? (
              <View style={s.prompts}>
                <Text style={s.promptsLabel}>
                  You both watch {match.sharedChannels[0]?.channelName} — say something
                </Text>
                {prompts.map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={s.promptBtn}
                    onPress={() => setText(p)}
                    activeOpacity={0.75}
                  >
                    <Text style={s.promptText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          }
          renderItem={renderMessage}
        />

        {/* Input */}
        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            placeholder={`Message ${match.name.split(' ')[0]}...`}
            placeholderTextColor={C.muted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[s.sendBtn, !text.trim() && s.sendBtnOff]}
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.85}
          >
            <Text style={s.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Toast message={toast} />
    </SafeAreaView>
  );
}

// Bubble styles
const m = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingHorizontal: 14, marginBottom: 4 },
  rowMe:      { flexDirection: 'row-reverse' },
  avatarSlot: { width: 28 },
  bubble:     { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMe:   { backgroundColor: C.accent, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: C.bg3, borderWidth: 0.5, borderColor: C.border, borderBottomLeftRadius: 4 },
  text:       { fontSize: 15, color: C.text, lineHeight: 22 },
  textMe:     { color: C.bg },
});

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 0.5, borderBottomColor: C.border },
  backBtn:      { paddingRight: 4 },
  back:         { fontSize: 22, color: C.muted },
  name:         { fontSize: 15, color: C.text, fontWeight: '600' },
  score:        { fontSize: 12, color: C.accent, fontWeight: '500' },
  onlineBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },
  onlineText:   { fontSize: 11, color: C.green },

  msgList:      { padding: 12, paddingBottom: 8 },

  prompts:      { margin: 14, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.accentBorder, borderRadius: R.md, padding: 14, gap: 10 },
  promptsLabel: { fontSize: 12, color: C.muted, lineHeight: 18 },
  promptBtn:    { backgroundColor: C.bg2, borderWidth: 0.5, borderColor: C.border, borderRadius: R.sm, padding: 11 },
  promptText:   { fontSize: 13, color: C.muted },

  inputBar:     { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, paddingBottom: 14, borderTopWidth: 0.5, borderTopColor: C.border },
  input:        { flex: 1, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: C.text, fontSize: 15, maxHeight: 120, lineHeight: 20 },
  sendBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff:   { opacity: 0.35 },
  sendIcon:     { fontSize: 18, color: C.bg, fontWeight: '700' },
});
