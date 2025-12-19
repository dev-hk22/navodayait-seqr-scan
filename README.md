# GHRIETP SeQR Scan

A React Native app for secure QR code scanning and document management, built with Expo Router.

## Features
- Secure QR code scanning
- User authentication and management
- Document viewing and printing
- Custom popover menus and modals
- Android and iOS support

## Getting Started

### Prerequisites
- Node.js
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)

### Installation
```sh
yarn install
```

### Running the App
```sh
# Start Metro bundler
npx expo start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

### Building APK/AAB
```sh
eas build --platform android
```

## Project Structure
- `src/app/` - App screens and layouts
- `src/components/` - Reusable UI components
- `src/context/` - Context providers
- `src/hooks/` - Custom hooks
- `src/libs/` - Utility libraries
- `src/assets/` - Images and fonts

## Keystore Management
- For Expo builds, use `eas credentials` to manage Android keystore.
- For bare workflow, configure signing in `android/app/build.gradle`.

## Troubleshooting
- If you encounter build errors, check image resources and native dependencies.
- For navigation issues, ensure Expo Router is used correctly and avoid mixing navigation libraries.

## License
MIT
