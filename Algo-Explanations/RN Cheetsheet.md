### 🟢 **MindApp Stable RN 0.77 Cheat Sheet**

| Package / Feature                                                 | Version                               | Purpose / One-liner                                                 |
| ----------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| **react-native**                                                  | 0.77.0                                | Core framework for building cross-platform mobile apps.             |
| **react**                                                         | 18.2.0                                | React library for declarative UI components.                        |
| **react-dom**                                                     | 18.2.0                                | React DOM bridge, mainly for tooling (not runtime in RN).           |
| **@react-native/new-app-screen**                                  | 0.77.0                                | Starter screens and template UI for new RN apps.                    |
| **@react-navigation/native**                                      | ^7.2.5                                | Container for navigation state and linking.                         |
| **@react-navigation/native-stack**                                | ^7.16.0                               | Stack navigation optimized for native performance.                  |
| **react-native-gesture-handler**                                  | ^2.31.2                               | Handles gestures like swipe, pan, tap efficiently on RN views.      |
| **react-native-reanimated**                                       | ^2.14.0                               | High-performance animations with native threads.                    |
| **react-native-safe-area-context**                                | ^5.8.0                                | Safely handles device notches and status bars.                      |
| **react-native-screens**                                          | ^4.14.1                               | Optimizes navigation by using native screens instead of views.      |
| **Fabric**                                                        | Built-in RN 0.77                      | New rendering engine for faster UI updates and smoother animations. |
| **Kotlin**                                                        | Required for Android modules          | Language for native Android module compilation in RN.               |
| **Gradle**                                                        | 9.0.0                                 | Android build system compiling RN native modules and APKs.          |
| **@types/react**                                                  | 18.2.7                                | TypeScript definitions for React.                                   |
| **@types/react-test-renderer**                                    | 18.0.0                                | TypeScript definitions for test renderer.                           |
| **react-test-renderer**                                           | 18.2.0                                | Allows testing React components outside a device/emulator.          |
| **Babel (@babel/core + preset-env + @react-native/babel-preset)** | ^7.25                                 | Transpiles modern JS/TS to compatible JS for RN runtime.            |
| **ESLint / Prettier**                                             | 8.x / 2.8.8                           | Linting and formatting code for consistency.                        |
| **Jest**                                                          | 29.6.3                                | Unit & snapshot testing for components and logic.                   |
| **usesCleartextTraffic**                                          | `<application>` Android manifest flag | Allows HTTP traffic during development (placeholder).               |
| **--legacy-peer-deps**                                            | npm flag                              | Installs packages ignoring peer conflicts, prevents ERESOLVE.       |

---

### ⚡ **Stable Dev Setup Commands**

```bash
# Clean environment
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies ignoring peer conflicts
npm install --legacy-peer-deps

# Start Metro bundler
npx react-native start --reset-cache

# Run Android
npx react-native run-android
```
