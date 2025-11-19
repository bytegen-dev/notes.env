# notes.env

A secure notes application built with React Native and Expo. Features passcode protection, biometric authentication, and a minimalist black & white interface.

## Features

- **Secure Notes** - Passcode protection with optional biometric authentication (Face ID/Fingerprint)
- **Note Management** - Create, edit, delete, and pin notes
- **Search** - Real-time search functionality
- **Smart Organization** - Notes automatically organized by time periods (Pinned, Today, Yesterday, etc.)
- **Multi-language Support** - English and Japanese
- **Import/Export** - Backup and restore notes as JSON
- **Minimalist UI** - Black & white design with iOS blur effects
- **Cross-platform** - iOS, Android, and Web support

## Tech Stack

- Expo SDK 54
- Expo Router (file-based routing)
- NativeWind (Tailwind CSS for React Native)
- TypeScript
- React 19 with React Compiler
- Expo Local Authentication
- AsyncStorage
- Lucide React Native

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (optional)
- iOS Simulator or Android Emulator for development

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/bytegen-dev/notes.env.git
   cd notes.env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Development

### Running the App

- **iOS Simulator**: Press `i` or run `npm run ios`
- **Android Emulator**: Press `a` or run `npm run android`
- **Web**: Press `w` or run `npm run web`
- **Expo Go**: Scan the QR code with the Expo Go app

### Project Structure

```
app/
  ├── index.tsx          # Main notes list screen
  ├── note/
  │   └── [id].tsx       # Note preview screen
  └── _layout.tsx        # Root layout

components/
  ├── Header.tsx         # App header with search
  ├── NoteCard.tsx       # Individual note card
  ├── NoteEditor.tsx     # Note creation/editing modal
  ├── LockScreen.tsx     # Lock screen with passcode
  ├── SplashScreen.tsx   # Initial splash screen
  └── ...

utils/
  ├── storage.ts         # AsyncStorage utilities
  ├── useTheme.ts        # Theme hook
  └── i18n/              # Internationalization
```

## Building for Production

### iOS (TestFlight/App Store)

1. Install EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Login to EAS:

   ```bash
   eas login
   ```

3. Build for iOS:

   ```bash
   eas build --platform ios --profile preview
   ```

4. Submit to TestFlight:
   ```bash
   eas submit --platform ios
   ```

### Android

```bash
eas build --platform android --profile production
```

## Security Features

- **Passcode Protection**: 4-digit passcode required on first launch
- **Biometric Authentication**: Optional Face ID/Fingerprint unlock
- **Auto-lock**: App automatically locks when closed
- **Local Storage**: Notes stored securely using AsyncStorage

## Note Management

- Create and edit notes with title and content
- Pin important notes
- Delete notes with confirmation
- Real-time search across all notes
- Time-based organization (Pinned, Today, Yesterday, etc.)

## Data Management

- Export all notes as JSON
- Import notes from JSON file
- Reset app to clear all data

## Configuration

- **Bundle Identifier**: `com.bytgen.notesenv`
- **App Name**: notes.env
- **Version**: 1.0.0

## Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
