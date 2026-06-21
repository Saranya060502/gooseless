import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '../theme';

// ── Avatar ────────────────────────────────────────────────────────────────────

export function Avatar({
  name, grad, size = 44,
}: { name: string; grad: [string, string]; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[av.wrap, { width: size, height: size, borderRadius: R.sm }]}
    >
      <Text style={[av.text, { fontSize: size * 0.3 }]}>{initials}</Text>
    </LinearGradient>
  );
}

const av = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontWeight: '700' },
});

// ── Score badge ───────────────────────────────────────────────────────────────

export function Score({ value }: { value: number }) {
  return (
    <Text style={sc.text}>{value}%</Text>
  );
}

const sc = StyleSheet.create({
  text: { fontSize: 14, fontWeight: '800', color: C.accent },
});

// ── Channel pill ──────────────────────────────────────────────────────────────

export function ChannelPill({ name }: { name: string }) {
  return (
    <View style={cp.wrap}>
      <Text style={cp.text}>{name}</Text>
    </View>
  );
}

const cp = StyleSheet.create({
  wrap: { backgroundColor: C.accentBg, borderWidth: 0.5, borderColor: C.accentBorder, borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, color: C.accent, fontWeight: '500' },
});

// ── Primary button ────────────────────────────────────────────────────────────

export function PrimaryBtn({
  label, onPress, loading, style,
}: { label: string; onPress: () => void; loading?: boolean; style?: ViewStyle }) {
  return (
    <TouchableOpacity style={[pb.btn, style]} onPress={onPress} activeOpacity={0.85}>
      {loading
        ? <ActivityIndicator color={C.bg} />
        : <Text style={pb.text}>{label}</Text>}
    </TouchableOpacity>
  );
}

const pb = StyleSheet.create({
  btn:  { backgroundColor: C.accent, borderRadius: R.md, paddingVertical: 15, alignItems: 'center' },
  text: { fontSize: 15, fontWeight: '700', color: C.bg },
});

// ── Ghost button ──────────────────────────────────────────────────────────────

export function GhostBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={gb.btn} onPress={onPress} activeOpacity={0.7}>
      <Text style={gb.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const gb = StyleSheet.create({
  btn:  { borderWidth: 0.5, borderColor: C.border2, borderRadius: R.md, paddingVertical: 13, alignItems: 'center' },
  text: { fontSize: 14, fontWeight: '500', color: C.muted },
});

// ── Toast ─────────────────────────────────────────────────────────────────────

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={t.wrap}>
      <Text style={t.text}>{message}</Text>
    </View>
  );
}

const t = StyleSheet.create({
  wrap: { position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: C.bg3, borderWidth: 0.5, borderColor: C.accentBorder, borderRadius: R.pill, paddingHorizontal: 20, paddingVertical: 10, zIndex: 999 },
  text: { fontSize: 13, color: C.accent, fontWeight: '500' },
});
