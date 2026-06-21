import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore, DEMO_MATCHES } from '../store';
import { Avatar, ChannelPill, Toast } from '../components/ui';
import { C, R } from '../theme';

function Bar({ val, color }: { val: number; color: string }) {
  return (
    <View style={b.track}>
      <View style={[b.fill, { width: `${val}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const b = StyleSheet.create({
  track: { height: 5, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden', flex: 1 },
  fill:  { height: '100%', borderRadius: 3 },
});

export default function CompatibilityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { matches, likeMatch, addConversation, setActiveConv, toast, isDemo, showToast } = useStore();

  // Find match in either real or demo profiles
  const allMatches = isDemo ? DEMO_MATCHES : matches;
  const match = allMatches.find(m => m.userId === id);

  if (!match) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.notFound}>
          <Text style={{ color: C.muted }}>Profile not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: C.accent, marginTop: 12 }}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Fake breakdown bars based on shared count
  const baseScore = match.score;
  const breakdown = [
    { label: 'Subscription overlap', val: baseScore, color: C.accent },
    { label: 'Niche channels', val: Math.round(baseScore * 0.85), color: C.accent2 },
    { label: 'Content breadth', val: Math.round(baseScore * 0.9), color: C.accent },
  ];

  function handleSayHello() {
    likeMatch(match);
    addConversation(match);
    showToast(`Starting chat with ${match.name}!`);
    setTimeout(() => {
      router.replace(`/chat/conv-${match.userId}`);
    }, 600);
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.back}>←</Text>
          </TouchableOpacity>
          <Text style={s.heading}>Compatibility</Text>
        </View>

        {/* Hero score card */}
        <View style={s.hero}>
          <View style={s.heroOrb} />
          <Text style={s.heroScore}>{match.score}%</Text>
          <Text style={s.heroLabel}>subscription overlap</Text>
          <Text style={s.heroNames}>you & {match.name.split(' ')[0]}</Text>
        </View>

        {/* Profile row */}
        <View style={s.profileRow}>
          <Avatar name={match.name} grad={match.avatarGrad} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{match.name}, {match.age}</Text>
            <Text style={s.city}>{match.city}</Text>
          </View>
        </View>

        {/* Shared channels */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Channels you both watch</Text>
          <View style={s.pills}>
            {match.sharedChannels.map(ch => (
              <ChannelPill key={ch.channelId} name={ch.channelName} />
            ))}
          </View>
        </View>

        {/* Breakdown bars */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Breakdown</Text>
          <View style={s.bars}>
            {breakdown.map(d => (
              <View key={d.label} style={s.barRow}>
                <Text style={s.barLabel}>{d.label}</Text>
                <Bar val={d.val} color={d.color} />
                <Text style={[s.barVal, { color: d.color }]}>{d.val}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={s.cta}>
        <TouchableOpacity style={s.ctaBtn} onPress={handleSayHello} activeOpacity={0.85}>
          <Text style={s.ctaBtnText}>Say hello to {match.name.split(' ')[0]}</Text>
          <Text style={s.ctaBtnSub}>You clearly have a lot to talk about</Text>
        </TouchableOpacity>
      </View>

      <Toast message={toast} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  notFound:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, borderBottomWidth: 0.5, borderBottomColor: C.border },
  backBtn:     {},
  back:        { fontSize: 22, color: C.muted },
  heading:     { fontSize: 18, color: C.text, fontWeight: '600' },
  hero:        { margin: 16, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.accentBorder, padding: 28, alignItems: 'center', gap: 6, overflow: 'hidden', position: 'relative' },
  heroOrb:     { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(233,129,16,0.12)', top: -30, right: -20 },
  heroScore:   { fontSize: 56, fontWeight: '900', color: C.accent, lineHeight: 60 },
  heroLabel:   { fontSize: 12, color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  heroNames:   { fontSize: 13, color: 'rgba(247,243,236,0.4)', fontWeight: '500', marginTop: 2 },
  profileRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: C.border },
  name:        { fontSize: 18, color: C.text, fontWeight: '600' },
  city:        { fontSize: 13, color: C.muted, marginTop: 2 },
  section:     { padding: 16, borderBottomWidth: 0.5, borderBottomColor: C.border, gap: 12 },
  sectionLabel:{ fontSize: 11, color: C.muted2, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
  pills:       { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  bars:        { gap: 14 },
  barRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel:    { fontSize: 12, color: C.muted, width: 130 },
  barVal:      { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },
  cta:         { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 36, backgroundColor: C.bg, borderTopWidth: 0.5, borderTopColor: C.border },
  ctaBtn:      { backgroundColor: C.accent, borderRadius: R.md, paddingVertical: 16, alignItems: 'center', gap: 3 },
  ctaBtnText:  { fontSize: 16, fontWeight: '700', color: C.bg },
  ctaBtnSub:   { fontSize: 12, color: 'rgba(16,35,37,0.6)' },
});
