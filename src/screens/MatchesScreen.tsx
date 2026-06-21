import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, Image,
} from 'react-native';
import { useStore, DEMO_MATCHES } from '../store';
import { MatchCard } from '../components/MatchCard';
import { BottomNav } from '../components/BottomNav';
import { Avatar, Score, Toast } from '../components/ui';
import { C, R } from '../theme';
import { useRouter } from 'expo-router';
import { likeMatch as apiLike, startConversation } from '../api';

export default function MatchesScreen() {
  const router = useRouter();
  const {
    matches, activeTab, likeMatch, passMatch,
    likedIds, conversations, setActiveConv,
    toast, isDemo, showToast,
  } = useStore();

  async function handleLike(match: any) {
    likeMatch(match);
    if (!isDemo) {
      try {
        const { conversationId } = await startConversation(match.userId);
        setActiveConv(`conv-${match.userId}`);
      } catch { /* silent */ }
    }
    setTimeout(() => {
      router.push(`/chat/conv-${match.userId}`);
    }, 800);
  }

  const likedProfiles = (isDemo ? DEMO_MATCHES : matches)
    .filter(m => likedIds.includes(m.userId));

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.logo}>⌇</Text>
          <View>
            <Text style={s.heading}>
              {activeTab === 'discover' ? 'For you' : activeTab === 'liked' ? 'Liked' : 'Messages'}
            </Text>
            {activeTab === 'discover' && (
              <Text style={s.sub}>{matches.length} people match your taste</Text>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      >
        {/* Discover */}
        {activeTab === 'discover' && (
          matches.length === 0
            ? <View style={s.empty}>
                <Text style={s.emptyIcon}>⌇</Text>
                <Text style={s.emptyTitle}>No more matches</Text>
                <Text style={s.emptyText}>Check back soon</Text>
              </View>
            : matches.map(m => (
                <MatchCard
                  key={m.userId}
                  match={m}
                  onLike={() => handleLike(m)}
                  onPass={() => passMatch(m.userId)}
                />
              ))
        )}

        {/* Liked */}
        {activeTab === 'liked' && (
          likedProfiles.length === 0
            ? <View style={s.empty}>
                <Text style={s.emptyText}>Profiles you like appear here</Text>
              </View>
            : likedProfiles.map(m => (
                <TouchableOpacity
                  key={m.userId}
                  style={s.likedRow}
                  onPress={() => router.push(`/compatibility/${m.userId}`)}
                  activeOpacity={0.75}
                >
                  <Avatar name={m.name} grad={m.avatarGrad} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.likedName}>{m.name}, {m.age}</Text>
                    <Text style={s.likedSub}>{m.city}</Text>
                  </View>
                  <Score value={m.score} />
                </TouchableOpacity>
              ))
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          conversations.length === 0
            ? <View style={s.empty}>
                <Text style={s.emptyIcon}>✉</Text>
                <Text style={s.emptyTitle}>No conversations yet</Text>
                <Text style={s.emptyText}>Like someone to start chatting</Text>
              </View>
            : conversations.map(conv => (
                <TouchableOpacity
                  key={conv.id}
                  style={s.convRow}
                  onPress={() => {
                    setActiveConv(conv.id);
                    router.push(`/chat/${conv.id}`);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={s.convAvatarWrap}>
                    <Avatar name={conv.match.name} grad={conv.match.avatarGrad} size={48} />
                    <View style={s.onlineDot} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.convName}>{conv.match.name}</Text>
                    <Text style={s.convPreview} numberOfLines={1}>
                      {conv.messages.length > 0
                        ? conv.messages[conv.messages.length - 1]!.text
                        : `${conv.match.score}% match · tap to say hello`}
                    </Text>
                  </View>
                  <Score value={conv.match.score} />
                </TouchableOpacity>
              ))
        )}
      </ScrollView>

      <BottomNav />
      <Toast message={toast} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: C.border },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo:          { fontSize: 28, color: C.accent },
  heading:       { fontSize: 22, color: C.text, fontWeight: '700' },
  sub:           { fontSize: 12, color: C.muted, marginTop: 1 },
  list:          { padding: 16, paddingBottom: 100 },
  empty:         { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon:     { fontSize: 40, opacity: 0.3 },
  emptyTitle:    { fontSize: 18, color: C.text, fontWeight: '500' },
  emptyText:     { fontSize: 14, color: C.muted },
  likedRow:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.bg2, borderRadius: R.md, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: C.border },
  likedName:     { fontSize: 16, color: C.text, fontWeight: '600' },
  likedSub:      { fontSize: 13, color: C.muted, marginTop: 2 },
  convRow:       { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.bg2, borderRadius: R.md, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: C.border },
  convAvatarWrap:{ position: 'relative' },
  onlineDot:     { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: C.green, borderWidth: 2, borderColor: C.bg },
  convName:      { fontSize: 15, color: C.text, fontWeight: '600' },
  convPreview:   { fontSize: 13, color: C.muted, marginTop: 2 },
});
