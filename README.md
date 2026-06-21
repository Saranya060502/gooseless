# Gooseless — Mobile App

React Native + Expo. iOS + Android from one codebase.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your Google Client ID
```

## Run in demo mode (no backend needed)

```bash
npm start
# Scan QR with Expo Go — tap "See a demo first"
```

## Build for iPhone (free, no Apple Developer account)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build for iOS (runs in Expo's cloud, not your laptop)
eas build --platform ios --profile preview

# 4. When done, Expo emails you a link
# Share the link with testers — they tap it to install
```

## Google OAuth setup

1. Go to console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: iOS
4. Bundle ID: com.gooseless.app
5. Copy the Client ID → paste in .env as EXPO_PUBLIC_GOOGLE_CLIENT_ID

## Screens

1. **Login** — Connect YouTube button + demo mode
2. **Matches** — Swipe cards with score + shared channels
3. **Compatibility** — Full breakdown + "Say hello" CTA
4. **Chat** — Messages + conversation starters

## Backend

Points to: https://you-me-xr77.onrender.com

Change EXPO_PUBLIC_API_URL in .env to use your own backend.
