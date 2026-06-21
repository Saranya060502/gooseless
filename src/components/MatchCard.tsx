import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { Match } from '../store';
import { Avatar, ChannelPill } from './ui';
import { C, R } from '../theme';

const { width: W } = Dimensions.get('window');

interface Props {
  match: Match;
  onLike: () => void;
  onPass: () => void;
}

export function MatchCard({ match, onLike, onPass }: Props) {
  const router = useRouter();

  function handleLike() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike();
  }

  function handlePass() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPass();
  }

  return (
    <View style={s.card}>
      {/* Top row — avatar + name + score */}
      <View style={s.topRow}>
        <Avatar name={match.name} grad={match.avatarGrad} size={56} />
        <View style={s.nameBlock}>
          <Text style={s.name}>{match.name}, {match.age}</Text>
          <Text style={s.city}>{match.city}</Text>
        </View>
        <View style={s.scoreBadge}>
          <Text style={s.scoreNum}>{match.score}</Text>
          <Text style={s.scorePct}>%</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Shared channels */}
      <View style={s.channelsSection}>
        <Text style={s.channelsLabel}>
          {match.sharedChannels.length} channels in common
        </Text>
        <View style={s.pills}>
          {match.sharedChannels.slice(0, 4).map(ch => (
            <ChannelPill key={ch.channelId} name={ch.channelName} />
          ))}
          {match.sharedChannels.length > 4 && (
            <View style={s.morePill}>
              <Text style={s.moreText}>+{match.sharedChannels.length - 4}</Text>
            </View>
          )}
        </View>
      </View>

      {/* View full compatibility */}
      <TouchableOpacity
        style={s.viewBtn}
        onPress={() => router.push(`/compatibility/${match.userId}`)}
        activeOpacity={0.7}
      >
        <Text style={s.viewBtnText}>View full compatibility →</Text>
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={s.actions}>
        <TouchableOpacity style={s.passBtn} onPress={handlePass} activeOpacity={0.8}>
          <Text style={s.passIcon}>✕</Text>
          <Text style={s.passTxt}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.likeBtn} onPress={handleLike} activeOpacity={0.8}>
          <Text style={s.likeIcon}>♡</Text>
          <Text style={s.likeTxt}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card:           { backgroundColor: C.bg2, borderWidth: 0.5, borderColor: C.border2, borderRadius: R.lg, padding: 20, marginBottom: 14, gap: 16 },

  topRow:         { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nameBlock:      { flex: 1 },
  name:           { fontSize: 20, color: C.text, fontWeight: '700', letterSpacing: -0.3 },
  city:           { fontSize: 13, color: C.muted, marginTop: 2 },
  scoreBadge:     { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: C.accentBg, borderRadius: R.sm, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 0.5, borderColor: C.accentBorder },
  scoreNum:       { fontSize: 26, fontWeight: '900', color: C.accent, lineHeight: 30 },
  scorePct:       { fontSize: 14, fontWeight: '700', color: C.accent, marginBottom: 1 },

  divider:        { height: 0.5, backgroundColor: C.border },

  channelsSection:{ gap: 10 },
  channelsLabel:  { fontSize: 11, color: C.muted2, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  pills:          { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  morePill:       { backgroundColor: C.surface2, borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: C.border },
  moreText:       { fontSize: 12, color: C.muted, fontWeight: '500' },

  viewBtn:        { alignItems: 'center' },
  viewBtnText:    { fontSize: 13, color: C.muted },

  actions:        { flexDirection: 'row', gap: 12 },
  passBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: R.md, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border },
  likeBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: R.md, backgroundColor: C.accentBg, borderWidth: 0.5, borderColor: C.accentBorder },
  passIcon:       { fontSize: 18, color: C.muted },
  passTxt:        { fontSize: 14, color: C.muted, fontWeight: '600' },
  likeIcon:       { fontSize: 18, color: C.accent },
  likeTxt:        { fontSize: 14, color: C.accent, fontWeight: '600' },
});
