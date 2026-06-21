import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../store';
import { C } from '../theme';

const TABS = [
  { id: 'discover',  label: 'Discover',  icon: '⊞' },
  { id: 'liked',     label: 'Liked',     icon: '♡' },
  { id: 'messages',  label: 'Messages',  icon: '✉' },
] as const;

export function BottomNav() {
  const { activeTab, setTab, conversations } = useStore();
  const unread = conversations.filter(c => c.messages.length === 0).length;

  return (
    <View style={s.bar}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={s.tab}
            onPress={() => setTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={s.iconWrap}>
              <Text style={[s.icon, active && s.iconActive]}>{tab.icon}</Text>
              {tab.id === 'messages' && unread > 0 && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{unread}</Text>
                </View>
              )}
            </View>
            <Text style={[s.label, active && s.labelActive]}>{tab.label}</Text>
            {active && <View style={s.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar:        { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: C.border, backgroundColor: C.bg },
  tab:        { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 28, gap: 3 },
  iconWrap:   { position: 'relative' },
  icon:       { fontSize: 20, color: C.muted },
  iconActive: { color: C.accent },
  label:      { fontSize: 10, color: C.muted, fontWeight: '500' },
  labelActive:{ color: C.accent },
  dot:        { width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginTop: 2 },
  badge:      { position: 'absolute', top: -4, right: -8, backgroundColor: C.accent2, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:  { fontSize: 9, color: '#fff', fontWeight: '700' },
});
