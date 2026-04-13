# 🚀 Nexa CLI Deep Architecture Guide

Welcome to the **full line-by-line understanding guide** for Nexa CLI.

This document explains:

- what `bin/nexa.js` does
- what each function is responsible for
- how the supporting folders work
- how generation flows from command → files → app
- why the current architecture works
- where it should evolve next

---

# 🧭 Big Picture

Nexa CLI is a **project generator + code scaffolder**.

It currently does three big jobs:

1. 🛠 **Parses commands**
2. 📁 **Generates files and folders**
3. ⚙️ **Builds a full React + Vite starter app**

So when someone runs:

```bash
npx create-nexa-app my-app
```

Nexa:

- understands the command
- creates the app folder
- copies the template
- writes dynamic files
- installs dependencies
- optionally starts the app

---

# 📍 Main Entry File

## `bin/nexa.js`

This is the **main CLI brain**.

It is responsible for:

- reading CLI arguments
- printing help
- printing version
- routing commands
- generating apps
- generating components
- generating services
- generating contexts
- handling `--base`
- installing npm dependencies
- asking whether to auto-start the app

👉 Right now, it is doing a lot.
That is why refactoring it into smaller files is the next smart move.

---

# 🧱 File Header and Runtime Setup

## 1. Shebang

```js
#!/usr/bin/env node
```

### ✅ Purpose

This makes the file executable as a Node CLI script.

### 🧠 Meaning

It tells the system:

> “Run this file using Node.”

Without it, the file is just a JavaScript file.
With it, it becomes a CLI entrypoint.

---

## 2. Imports

```js
import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";
```

### ✅ Purpose of each import

- `fs` 📂 → read/write files
- `path` 🛣 → build safe file paths
- `os` 💻 → detect platform (Mac / Windows / Linux)
- `readline` ⌨️ → ask yes/no questions in terminal
- `fileURLToPath` 🔄 → get file path in ESM mode
- `execSync`, `spawn` ▶️ → run npm and dev server commands

### 🧠 Why this matters

These imports give Nexa the ability to:

- act like a real CLI
- create projects
- interact with the terminal
- launch other processes

---

## 3. File path and args setup

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
```

### ✅ Purpose

- `__filename` → full path of the current file
- `__dirname` → current folder
- `args` → command-line arguments after the command name

### 🧠 Example

If a user runs:

```bash
create-nexa-app my-app --base /portal/
```

Then:

```js
args = ["my-app", "--base", "/portal/"];
```

This is the raw input Nexa uses to decide what to do.

---

# 🔢 Version Handling

## 4. Reading package.json

```js
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"),
);
```

### ✅ Purpose

Loads the CLI’s own `package.json`.

### 🧠 Why

Needed for:

- `--version`
- checking current CLI version
- showing correct release number

---

## 5. Version command block

```js
if (
  args.includes("--version") ||
  args.includes("-v") ||
  args[0] === "version"
) {
  console.log(`Nexa CLI v${pkg.version}`);
  process.exit(0);
}
```

### ✅ Purpose

Lets users run:

```bash
nexa --version
nexa -v
nexa version
```

### 🧠 Why useful

This is extremely helpful for:

- debugging
- support
- confirming publish/install success

---

# 🎨 Terminal Colors

## 6. `C` object

```js
const C = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};
```

### ✅ Purpose

Stores color codes for the terminal.

### 🧠 What it powers

- branded help output
- success messages
- warnings
- structured logs

### 🎯 Effect

Makes Nexa feel like a polished CLI product rather than plain terminal text.

---

# 🔤 Name Conversion Utilities

These are foundational helpers used everywhere.

---

## 7. `toPascalCase(str)`

### ✅ Purpose

Converts user-friendly names into component/class/display names.

### Example

```js
toPascalCase("my-app"); // "MyApp"
toPascalCase("user_profile"); // "UserProfile"
```

### 🧠 Used for

- component names
- display names
- file names like `MyComponent.jsx`

---

## 8. `toKebabCase(str)`

### ✅ Purpose

Converts names into folder/package/route-safe names.

### Example

```js
toKebabCase("MyApp"); // "my-app"
toKebabCase("my app"); // "my-app"
```

### 🧠 Used for

- folder names
- package names
- URLs and route paths

---

## 9. `toCssClassName(str)`

### ✅ Purpose

Creates a safe CSS class prefix.

### Example

```js
toCssClassName("My App!"); // "my-app"
```

### 🧠 Used for

- generated CSS classes
- avoiding invalid characters in styles

---

# 📁 File and Copy Utilities

---

## 10. `writeFileSafe(filePath, content)`

### ✅ Purpose

Writes a file safely.

### What it does

- ensures the parent directory exists
- writes the file content

### 🧠 Why important

Without this, Nexa would fail when writing nested files into folders that do not exist yet.

---

## 11. `copyRecursive(src, dest)`

### ✅ Purpose

Copies the template into a new app.

### What it skips

- `node_modules`
- `.git`
- `.DS_Store`
- `.env*`

### 🧠 Why important

This prevents junk/dev files from leaking into generated apps.

### 🎯 Role in Nexa

This is what transforms the `template/` folder into a fresh new project.

---

# 🧯 Safety Check for Generators

---

## 12. `ensureProjectRootForGenerators()`

### ✅ Purpose

Prevents component/service/context generators from running in the wrong folder.

### It checks

- user is not inside `src/`
- `package.json` exists
- `src/` exists

### 🧠 Why important

Commands like:

```bash
nexa new gc Header
```

should run from the **app root**, not from random folders.

This function protects the user from messy generation.

---

# 📖 Help System

---

## 13. `printUsage()`

### ✅ Purpose

Prints CLI help.

### It explains

- branding
- commands
- examples
- `create-nexa-app`
- `nexa new`
- `--base`
- `--version`

### 🧠 Why important

This is the CLI’s built-in documentation.

It is the first thing users see when:

- they ask for help
- they type invalid commands
- they are learning the tool

---

# 💬 Interactive Input

---

## 14. `askYesNo(question)`

### ✅ Purpose

Asks the user a yes/no question in the terminal.

### Used for

- auto-start app?
- open browser?

### 🧠 Why important

Adds an interactive touch after generation.

Instead of forcing behavior, Nexa asks.

---

# 🌐 Browser Opening Logic

---

## 15. `openBrowser(url)`

### ✅ Purpose

Opens a URL in the system browser.

### Platform handling

- macOS → `open`
- Windows → `cmd /c start`
- Linux → `xdg-open`

### 🧠 Why important

Keeps the experience smooth after app generation.

---

## 16. `startGeneratedApp(projectDir, shouldOpenBrowser, appBase)`

### ✅ Purpose

Starts the generated app with:

```bash
npm run dev
```

inside the new app folder.

### Also

- optionally opens the browser
- prints stop message when dev server exits

### 🧠 Why important

This is what makes Nexa feel “instant” after generation.

---

# ⚙️ Generator Commands for Existing Apps

These are commands used **inside** a Nexa-generated app.

---

## 17. `createService(serviceName)`

### ✅ Purpose

Generates a service file in:

```text
src/services/
```

### Output includes

- sample GET method
- sample POST method
- placeholder base URL

### 🧠 Why useful

Gives API logic a clean, consistent starting point.

---

## 18. `createContext(contextName)`

### ✅ Purpose

Generates a React context file in:

```text
src/contexts/
```

### Output includes

- `createContext(null)`

### 🧠 Why useful

Quickly scaffolds shared state / provider structure.

---

## 19. `createComponent(componentName)`

### ✅ Purpose

Generates a new component folder with:

- JSX component
- child JSX component
- CSS file

### Also attempts to update

```text
src/config/routeMeta.js
```

### 🧠 Why important

This is one of Nexa’s key value points:
not just file creation, but structured component generation with styling and metadata.

---

# 🏗 Main App Generator

---

## 20. `createApp(rawAppName, appBase = "/")`

This is the **main application scaffolder**.

It is the biggest and most important function in the CLI.

---

## Step-by-step inside `createApp`

### 🧾 a. Name derivation

Creates:

- `projectDirName`
- `displayName`
- `packageName`

Example:

```text
rawAppName = "my-app"
projectDirName = "my-app"
displayName = "MyApp"
packageName = "my-app"
```

### 🧠 Why

Different naming styles are needed for:

- folders
- display strings
- npm package names

---

### 🛣 b. Base path normalization

```js
const APP_BASE = normalizeBase(appBase);
```

### ✅ Purpose

Ensures base is always in correct form:

- `/`
- `/portal/`
- `/dashboard/`

### 🧠 Why

Critical for subpath deployments.

---

### 🧱 c. Validations

Checks:

- app name exists
- template folder exists
- app folder does not already exist

### 🧠 Why

Prevents accidental overwrite or invalid generation.

---

### 📂 d. Create project directory

```js
fs.mkdirSync(projectDir, { recursive: true });
```

Creates the new app folder.

---

### 📋 e. Copy template

```js
copyRecursive(templateDir, projectDir);
```

### ✅ Purpose

Copies the prepared Nexa starter structure into the app.

### 🧠 Why

This is the foundation of the generated app.

---

### 📝 f. Gitignore generation

Adds a `.gitignore` if missing.

### Includes

- node_modules
- logs
- env files
- dist/build output
- editor files

---

### 🌐 g. `index.html` generation / patching

This is one of the key files.

It is responsible for:

- app title
- manifest link
- icon link
- root HTML shell

### Important design rule

For Apache-friendly subpath deployment:

- `index.html` uses **relative links**
- e.g. `./manifest.json`

### Why

Absolute links like `/manifest.json` break under subfolders.

---

### 📱 h. `manifest.json` generation

This creates the PWA manifest.

### Defines

- app name
- short name
- start URL
- scope
- display mode
- colors
- icon paths

### Important design rule

This now should also use **relative references**:

- `./`
- `./icons/icon-192.png`

### Why

So the manifest works correctly under subpaths.

---

### 📦 i. Generated app `package.json`

Creates a new `package.json` for the generated app.

### Includes

- scripts:
  - `dev`
  - `start`
  - `nexa`
  - `build`
  - `preview`

- React dependencies
- Vite dependencies

---

### ⚛️ j. `src/main.jsx`

This is the app’s React entrypoint.

### It handles

- ReactDOM mounting
- CSS import
- router setup
- service worker registration
- app base path logic

### Important behavior

For base support:

- uses `APP_BASE`
- sets `BrowserRouter basename`
- registers service worker at the correct path

### Important architectural rule

This file must be **always rewritten**, not conditionally skipped.

---

### 🧩 k. `src/App.jsx`

Creates the starter app UI shell.

### Includes

- welcome text
- branding
- structure

### Purpose

Gives every generated app a visible starting point.

---

### 🎨 l. `src/App.css`

Defines base styles for the starter shell.

### Purpose

Makes generated apps look clean immediately.

---

### ▶️ m. `run.js`

This file starts the generated app’s dev server via Vite.

### It does

- print Nexa-branded startup output
- launch Vite
- pipe Vite output into the terminal

### Why important

This is what powers:

```bash
npm run dev
npm run nexa
npm start
```

inside generated apps.

---

### ⚙️ n. `nexa.config.js`

This is the Vite config for generated apps.

### Controls

- root
- base
- plugins
- server port
- build output

### Important architectural rule

This file must also be **always rewritten**, because `--base` changes it.

---

### 📥 o. Dependency installation

Runs:

```bash
npm install
```

inside the generated app folder.

### Purpose

Makes the generated app immediately usable.

---

### ❓ p. Auto-start prompts

Asks:

- auto start?
- open browser?

### Purpose

Makes the first-run experience smooth and interactive.

---

# 🛣 Base Support Helpers

---

## 21. `normalizeBase(input = "/")`

### ✅ Purpose

Normalizes deployment base path.

### Examples

```js
normalizeBase("/"); // "/"
normalizeBase("portal"); // "/portal/"
normalizeBase("/portal"); // "/portal/"
normalizeBase("/portal/"); // "/portal/"
```

### 🧠 Why important

Prevents malformed base paths.

---

## 22. `getFlagValue(argv, flagName)`

### ✅ Purpose

Finds a CLI flag’s value.

Example:

```bash
--base /portal/
```

returns:

```js
"/portal/";
```

### 🧠 Why useful

Allows commands to accept options cleanly.

---

# 🧠 Command Parsing

---

## 23. `parseArgs(argv)`

This is the CLI routing parser.

### Responsibilities

- read `--base`
- strip it from main arguments
- detect help/version
- support:
  - `nexa new app my-app`
  - `nexa new my-app`
  - `create-nexa-app my-app`

### Returns

An object like:

```js
{
  shortcut: "app",
  name: "my-app",
  base: "/portal/"
}
```

### 🧠 Why important

This is the translator between user input and generator actions.

---

# 🚦 Main Dispatcher

---

## 24. `main()`

After parsing, this function decides which action to run.

### Routes to

- `createService`
- `createContext`
- `createComponent`
- `createApp`

### Purpose

Acts as the central CLI switchboard.

---

# 📁 Supporting Folders

---

## `bin/`

### Purpose

Contains executable CLI entry files.

### Current state

- `bin/nexa.js` = full CLI brain

### Future goal

Keep entrypoint small and move logic to modules.

---

## `template/`

### Purpose

Starter app blueprint copied into every generated app.

### It contains

- `public/`
- `src/`
- config files
- starter UI
- assets

### 🧠 Why important

This is the raw material Nexa transforms into a real app.

---

## `template/public/`

### Contains

- `index.html`
- `manifest.json`
- `sw.js`
- `nexa.svg`
- icons

### Purpose

PWA + branding + public web assets.

---

## `template/src/`

### Contains

- `App.jsx`
- `App.css`
- `main.jsx`
- `components/`
- `config/`
- `assets/`

### Purpose

Provides the structured app shell.

---

## `template/src/components/`

### Purpose

Starter UI components like:

- Navbar
- DynamicHeader
- Home
- Nexa

These make the generated app feel production-ready.

---

## `template/src/config/routeMeta.js`

### Purpose

Centralized route metadata.

### Powers

- navbar labels
- dynamic header titles/subtitles
- route-level UI metadata

This is one of Nexa’s strongest architectural differentiators.

---

# 🏁 Generated App Files

A generated Nexa app typically contains:

- `index.html`
- `public/manifest.json`
- `public/sw.js`
- `src/main.jsx`
- `src/App.jsx`
- `src/App.css`
- `src/config/routeMeta.js`
- `run.js`
- `nexa.config.js`
- `package.json`

These files form the generated application shell.

---

# 🧪 Current Architecture Strengths

## ✅ Strong points

- very fast app creation
- strong UI starter structure
- route-driven metadata system
- base-path support
- PWA support
- generator commands for multiple file types

---

# ⚠️ Current Architecture Weakness

`bin/nexa.js` is too large.

It currently combines:

- CLI parsing
- help/version
- utilities
- app generation
- service generation
- component generation
- context generation
- startup logic
- prompts
- base logic

That is manageable now, but it will become painful as new packages and commands are added.

---

# 🔮 Refactor Direction

Recommended split:

```text
bin/
  nexa.js

lib/
  parseArgs.js
  printUsage.js
  createApp.js
  createComponent.js
  createService.js
  createContext.js
  flags.js
  base.js
  utils.js
```

### Why

- easier maintenance
- easier testing
- reusable across:
  - `nexa-cli`
  - `create-nexa-app`
  - `create-nexa-redux`

---

# 📦 Package Strategy Going Forward

## `nexa-cli`

🧪 Experimental package

Purpose:

- prototype new ideas
- test unstable commands
- build features before stabilizing them

---

## `create-nexa-app`

✅ Stable production starter

Purpose:

- user-facing app generator
- clean CLI UX
- stable releases

---

## `create-nexa-redux`

🧠 Future Redux-enabled starter

Purpose:

- include Redux Toolkit
- include store setup
- include slice generation commands
- possibly support:
  - `nexa csl auth`

---

# 🎯 Final Summary

## In one sentence:

**`bin/nexa.js` is the full Nexa engine right now: it reads commands, processes flags, generates projects and files, configures routing/PWA/build behavior, installs dependencies, and launches the result — while the `template/` folder provides the starter app blueprint it builds from.**

---

# 💡 Best Mental Model

Think of Nexa like this:

- 🧠 `bin/nexa.js` = brain
- 🧰 helpers = tools
- 🏗 `template/` = raw building materials
- 🚀 generated app = finished starter product

---

# 🔥 Recommended next step

The smartest next move is:

1. refactor `bin/nexa.js` into smaller modules
2. keep `nexa-cli` experimental
3. move stable features into:
   - `create-nexa-app`
   - `create-nexa-redux`

That gives you a clean product ecosystem and keeps innovation fast without destabilizing the main packages.

```

```
