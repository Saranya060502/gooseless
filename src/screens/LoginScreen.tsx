import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Image, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { useStore, DEMO_MATCHES } from '../store';
import { createUser, connectYouTube, setUserId, getMatches } from '../api';
import { C, R } from '../theme';

WebBrowser.maybeCompleteAuthSession();

// Your Google OAuth client ID
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export default function LoginScreen() {
  const router   = useRouter();
  const { setDemo, setUserId: storeSetUserId, setMatches, showToast } = useStore();
  const [loading, setLoading] = useState(false);

  // Expo AuthSession discovery
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'gooseless' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      redirectUri,
    },
    discovery,
  );

  // Handle OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response as any;
      if (authentication?.accessToken) {
        handleConnected(authentication.accessToken);
      }
    }
  }, [response]);

  async function handleConnected(accessToken: string) {
    setLoading(true);
    try {
      // Create user (name/age/city not collected yet — update later)
      const { userId } = await createUser('User', 25, 'Unknown');
      await setUserId(userId);
      storeSetUserId(userId);

      // Send access token to backend — it fetches subscriptions
      await connectYouTube(accessToken);

      // Load matches
      const { matches } = await getMatches();
      setMatches(matches);

      router.replace('/matches');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    setDemo(true);
    setMatches(DEMO_MATCHES);
    router.replace('/matches');
  }

  return (
    <SafeAreaView style={s.safe}>
      <LinearGradient
        colors={['#0c1f21', '#163433', '#1f2e1e']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={s.bg}
      >
        {/* Orbs */}
        <View style={s.orb1} />
        <View style={s.orb2} />

        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.iconFrame}>
            <Image
              source={require('../../assets/goose.png')}
              style={s.icon}
              resizeMode="cover"
            />
          </View>
          <Text style={s.wordmark}>
            Goose<Text style={s.wordmarkAccent}>less</Text>
          </Text>
          <Text style={s.tagline}>You watch. We match.</Text>
        </View>

        {/* CTA */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.ytBtn}
            onPress={() => promptAsync()}
            disabled={loading || !request}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={C.bg} />
            ) : (
              <>
                <View style={s.ytIcon}>
                  <View style={s.ytPlay} />
                </View>
                <Text style={s.ytBtnText}>Connect with YouTube</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={s.demoBtn} onPress={handleDemo} activeOpacity={0.7}>
            <Text style={s.demoBtnText}>See a demo first</Text>
          </TouchableOpacity>
        </View>

        {/* Footnote */}
        <Text style={s.footnote}>
          By continuing you agree to share your{'\n'}
          subscriptions to find your match
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1 },
  bg:            { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 36, position: 'relative', overflow: 'hidden' },
  orb1:          { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(233,129,16,0.14)', top: -60, right: -60 },
  orb2:          { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(229,193,158,0.08)', bottom: 100, left: -30 },

  logoWrap:      { alignItems: 'center', gap: 14 },
  iconFrame:     { width: 96, height: 96, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(229,193,158,0.45)' },
  icon:          { width: '100%', height: '100%' },
  wordmark:      { fontSize: 28, fontWeight: '900', color: C.text, letterSpacing: -0.5 },
  wordmarkAccent:{ color: C.accent2 },
  tagline:       { fontSize: 13, color: C.muted, fontWeight: '500', marginTop: -6 },

  actions:       { width: '100%', gap: 12 },
  ytBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.accent, borderRadius: R.md, paddingVertical: 15, width: '100%' },
  ytIcon:        { width: 18, height: 13, backgroundColor: '#cc0000', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  ytPlay:        { width: 0, height: 0, borderLeftWidth: 6, borderTopWidth: 4, borderBottomWidth: 4, borderLeftColor: C.accent, borderTopColor: 'transparent', borderBottomColor: 'transparent', marginLeft: 2 },
  ytBtnText:     { fontSize: 15, fontWeight: '700', color: C.bg },
  demoBtn:       { borderWidth: 0.5, borderColor: C.border2, borderRadius: R.md, paddingVertical: 13, alignItems: 'center', width: '100%' },
  demoBtnText:   { fontSize: 14, color: C.muted, fontWeight: '500' },

  footnote:      { fontSize: 11, color: 'rgba(247,243,236,0.28)', textAlign: 'center', lineHeight: 18 },
});
