### ✅ React Native 0.82 Working Package Matrix (Lambda)

This is your **known-good baseline** for React Native **0.82.0**.

| Package                      | Version | Purpose                           |
| ---------------------------- | ------- | --------------------------------- |
| react-native                 | 0.82.0  | Core React Native framework       |
| react                        | 19.1.1  | React rendering engine used by RN |
| @react-native/new-app-screen | 0.82.0  | Default RN starter screen package |

---

## 🧭 Navigation

| Package                        | Version | Purpose                                      |
| ------------------------------ | ------- | -------------------------------------------- |
| @react-navigation/native       | 7.2.5   | Main navigation container and routing system |
| @react-navigation/native-stack | 7.16.0  | Native Android/iOS stack navigation          |

Example:

```jsx
<NavigationContainer>
  <Stack.Navigator>
```

---

## 📱 Native Screen Performance

| Package              | Version | Purpose                                                           |
| -------------------- | ------- | ----------------------------------------------------------------- |
| react-native-screens | 4.25.2  | Uses native Android/iOS screens for better memory and performance |

Benefits:

✅ Faster navigation

✅ Lower memory usage

✅ Required by React Navigation

---

## 🔲 Safe Areas

| Package                        | Version | Purpose                                                       |
| ------------------------------ | ------- | ------------------------------------------------------------- |
| react-native-safe-area-context | 5.8.0   | Handles notches, Dynamic Island, status bars, navigation bars |

Example:

```jsx
<SafeAreaView>
```

Benefits:

✅ iPhone Dynamic Island support

✅ Android status bar handling

✅ Modern device compatibility

---

## 👆 Gestures

| Package                      | Version | Purpose                                         |
| ---------------------------- | ------- | ----------------------------------------------- |
| react-native-gesture-handler | 3.0.0   | Native gesture system (swipe, drag, pinch, tap) |

Required by:

```text
React Navigation
Bottom Sheets
Drawers
Reanimated
```

Examples:

```text
Swipe Cards
Drag Views
Drawer Menus
TikTok-style interactions
```

---

## 🎬 Animations

| Package                 | Version | Purpose                                                 |
| ----------------------- | ------- | ------------------------------------------------------- |
| react-native-reanimated | 4.3.1   | High-performance native animations running on UI thread |

Examples:

```text
TikTok Feed Animations
Bottom Sheets
Parallax
Swipe Cards
Like Animations
```

Benefits:

✅ 60 FPS animations

✅ Runs off JS thread

✅ Production-grade animations

---

## ⚙️ Reanimated Runtime

| Package               | Version | Purpose                                            |
| --------------------- | ------- | -------------------------------------------------- |
| react-native-worklets | 0.8.1   | Native execution engine required by Reanimated 4.x |

You discovered this dependency during setup.

Without it:

```text
[Reanimated] react-native-worklets library not found
```

---

# 🛠 Development Tooling

| Package                                      | Version | Purpose               |
| -------------------------------------------- | ------- | --------------------- |
| @react-native-community/cli                  | 20.0.0  | RN command line tools |
| @react-native-community/cli-platform-android | 20.0.0  | Android build support |
| @react-native-community/cli-platform-ios     | 20.0.0  | iOS build support     |

Commands:

```bash
npx react-native run-android
npx react-native run-ios
```

---

# 📦 Babel

| Package                    | Version | Purpose                |
| -------------------------- | ------- | ---------------------- |
| @babel/core                | 7.25.2  | JavaScript compiler    |
| @babel/preset-env          | 7.25.3  | Modern JS support      |
| @babel/runtime             | 7.25.0  | Runtime helpers        |
| @react-native/babel-preset | 0.82.0  | RN Babel configuration |

Required for:

```text
JSX
Reanimated
Modern JavaScript
```

---

# 🚇 Metro Bundler

| Package                    | Version | Purpose                     |
| -------------------------- | ------- | --------------------------- |
| @react-native/metro-config | 0.82.0  | Metro bundler configuration |

Responsible for:

```text
Hot Reload
Fast Refresh
Bundle Generation
```

---

# 🔍 Linting

| Package                     | Version | Purpose               |
| --------------------------- | ------- | --------------------- |
| eslint                      | 8.19.0  | Code quality checking |
| @react-native/eslint-config | 0.82.0  | RN lint rules         |

Command:

```bash
npm run lint
```

---

# 🧪 Testing

| Package                    | Version | Purpose                 |
| -------------------------- | ------- | ----------------------- |
| jest                       | 29.6.3  | Test runner             |
| react-test-renderer        | 19.1.1  | React component testing |
| @types/jest                | 29.5.13 | Jest TypeScript typings |
| @types/react-test-renderer | 19.1.0  | Test renderer typings   |

Command:

```bash
npm test
```

---

# 🏆 AG Videos Readiness

Your current stack already supports:

| Feature          | Ready |
| ---------------- | ----- |
| Stack Navigation | ✅     |
| Native Screens   | ✅     |
| Safe Areas       | ✅     |
| Gesture Handling | ✅     |
| Reanimated 4     | ✅     |
| Worklets Runtime | ✅     |
| Android RN 0.82  | ✅     |
| React 19         | ✅     |
| Production Build | ✅     |

### Current Known-Good Versions

```json
{
  "react-native": "0.82.0",
  "react": "19.1.1",
  "@react-navigation/native": "7.2.5",
  "@react-navigation/native-stack": "7.16.0",
  "react-native-screens": "4.25.2",
  "react-native-safe-area-context": "5.8.0",
  "react-native-gesture-handler": "3.0.0",
  "react-native-reanimated": "4.3.1",
  "react-native-worklets": "0.8.1"
}
```