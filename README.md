# Bible Mood Companion 📖✝

A native mobile AI app — emotional support companion powered by David, built with React Native (Expo).

**Created by AA Designs**

---

## Tech Stack

- **React Native** (Expo ~52)
- **React Navigation** (native stack)
- **Gemini 1.5 Flash** (AI engine)
- **expo-speech** (voice output)
- **AsyncStorage** (persistent conversation)
- **expo-linear-gradient** (UI gradients)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npx expo start
```

Then scan the QR code with **Expo Go** (iOS/Android) to preview instantly.

---

## Build for App Store & Play Store

### Prerequisites
- Install EAS CLI: `npm install -g eas-cli`
- Login: `eas login`
- Configure: `eas build:configure`

### iOS Build (App Store)
```bash
eas build --platform ios --profile production
```

### Android Build (Play Store)
```bash
eas build --platform android --profile production
```

### Submit to stores
```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

---

## Project Structure

```
bible-mood-companion/
├── App.js                        # Root navigator
├── app.json                      # Expo config
├── eas.json                      # EAS build config
├── src/
│   ├── screens/
│   │   ├── LandingScreen.js      # Welcome / intro screen
│   │   └── ChatScreen.js         # Main chat interface
│   ├── components/
│   │   ├── MessageBubble.js      # Chat bubble component
│   │   └── TypingIndicator.js    # "David is typing..." animation
│   ├── hooks/
│   │   └── useDavid.js           # AI logic + conversation state
│   └── theme/
│       ├── colors.js             # Color palette
│       └── typography.js         # Font settings
└── assets/                       # Icons, splash screen
```

---

## Conversation Memory

- Last 10 messages sent as context to Gemini on every request
- Full conversation persisted locally via AsyncStorage
- Handles follow-ups: "why?", "pray for me", "I still feel this"

---

## App Store Requirements Checklist

- [ ] Replace `YOUR_EAS_PROJECT_ID` in `app.json` (run `eas init`)
- [ ] Add app icon to `assets/icon.png` (1024x1024)
- [ ] Add splash screen to `assets/splash.png`
- [ ] Fill in Apple credentials in `eas.json`
- [ ] Add Google service account for Play Store
- [ ] Review Gemini API key security before production release

---

## Branding

Created by **AA Designs** — visible on Landing Screen and Chat footer.
