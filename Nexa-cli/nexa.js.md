# Nexa CLI Architecture Guide

This document explains what `bin/nexa.js` does and what the surrounding files and folders are responsible for, based on the current Nexa CLI structure and behavior. The current CLI entrypoint is a single executable file that parses commands, generates apps/components/services/contexts, handles flags like `--base`, and writes project files into a new app scaffold. :contentReference[oaicite:0]{index=0}

---

## 1. High-level purpose of `bin/nexa.js`

`bin/nexa.js` is the main command-line entrypoint for Nexa. It is responsible for:

- reading the command line arguments
- printing help and version info
- deciding which command the user asked for
- generating files and folders
- scaffolding a full React + Vite app
- supporting subpath deployment through `--base`
- installing dependencies
- optionally auto-starting the generated app

In short, it is currently both the **CLI router** and the **project generator engine**. :contentReference[oaicite:1]{index=1}

---

## 2. What the first lines do

### Shebang

````js
#!/usr/bin/env node

This makes the file executable as a CLI command in Node environments.

### Imports

The file imports:

* `fs` → reading/writing files
* `path` → building safe file paths
* `os` → platform checks like macOS vs Windows
* `readline` → asking yes/no questions in terminal
* `fileURLToPath` → resolving paths in ES modules
* `execSync`, `spawn` → running npm commands and dev servers

These imports are the core Node APIs the CLI depends on.

### Runtime path setup

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
````

This does three things:

- resolves the current file path in ESM mode
- gets the current directory
- captures CLI arguments after the command name

Example:

```bash
npx create-nexa-app my-app --base /portal/
```

becomes something like:

```js
args = ["my-app", "--base", "/portal/"];
```

---

## 3. Version handling

The CLI reads `package.json` and prints the current version when the user runs:

- `nexa --version`
- `nexa -v`
- `nexa version`

That is handled right near the top before normal command parsing continues.

Purpose:

- lets users verify which CLI version is installed
- helps debugging mismatches between local and published versions

---

## 4. Terminal colors object

The `C` object stores ANSI escape codes for colored terminal output. It supports:

- reset
- cyan
- yellow
- green
- blue
- gray
- bold

Purpose:

- makes help text and logs easier to read
- gives Nexa branded terminal output

---

## 5. Utility functions

These functions are small reusable helpers used throughout the CLI.

### `toPascalCase(str)`

Converts strings like:

- `my-app`
- `my_app`
- `my app`

into:

- `MyApp`

Purpose:

- component names
- display names
- class-friendly generated naming

### `toKebabCase(str)`

Converts strings like:

- `MyApp`
- `my app`

into:

- `my-app`

Purpose:

- folder names
- package names
- route paths

### `toCssClassName(str)`

Takes a string and converts it to a safe CSS class prefix.

Purpose:

- helps generated CSS class naming stay predictable

### `writeFileSafe(filePath, content)`

Ensures the parent directory exists, then writes the file.

Purpose:

- lets Nexa write files without crashing if folders do not exist yet

### `copyRecursive(src, dest)`

Copies the template folder into the new app while skipping junk such as:

- `node_modules`
- `.git`
- `.DS_Store`
- `.env*`

Purpose:

- creates a clean generated app from a prepared template
- avoids leaking local development clutter into generated projects

All of these utilities are foundational to generation behavior.

---

## 6. Project-root safety check

### `ensureProjectRootForGenerators()`

This function prevents commands like component/service/context generation from being run in the wrong place.

It verifies:

- the current directory is **not inside `src/`**
- `package.json` exists
- `src/` exists

Purpose:

- prevents users from running generators in nested folders
- keeps generated files in the correct project structure

This is especially important for commands like:

```bash
nexa new gc Header
nexa new svc AuthService
nexa new ctx UserSession
```

---

## 7. Help output

### `printUsage()`

This prints the CLI help information:

- branding lines
- core commands
- `create-nexa-app` usage
- `--base` flag
- `--version`
- examples

Purpose:

- explains how to use the CLI
- serves as the first-level documentation inside the terminal

This is the main user-facing CLI reference during normal usage.

---

## 8. Interactive terminal helpers

### `askYesNo(question)`

Prompts the user for `y/n` input.

Used for:

- auto-start app?
- open browser automatically?

### `openBrowser(url)`

Opens the generated app in the system browser depending on platform:

- macOS → `open`
- Windows → `cmd /c start`
- Linux → `xdg-open`

### `startGeneratedApp(projectDir, shouldOpenBrowser)`

Runs:

```bash
npm run dev
```

inside the generated project and optionally opens the app in the browser.

Purpose:

- gives a smooth “generate and launch” experience after project creation

---

## 9. Generator commands for files inside an existing app

These commands operate inside a Nexa-generated app.

### `createService(serviceName)`

Creates a file in:

```text
src/services/
```

It generates a service module with sample:

- `GET`
- `POST`

patterns.

Purpose:

- provide a clean starting point for API integration

### `createContext(contextName)`

Creates a file in:

```text
src/contexts/
```

with a React `createContext(...)` setup.

Purpose:

- quickly scaffold state/context structure

### `createComponent(componentName)`

Creates a full component folder under:

```text
src/components/<ComponentName>/
```

including:

- main JSX component
- child component
- CSS file

It also attempts to update:

```text
src/config/routeMeta.js
```

by inserting a new route metadata entry if that file exists.

Purpose:

- generate a styled Nexa-compatible component quickly
- keep navigation/header systems aligned through route metadata

---

## 10. The heart of app generation: `createApp(rawAppName, appBase = "/")`

This is the main app scaffolding function.

It performs the following major steps.

### a. Name conversion

It derives:

- `projectDirName` → kebab-case folder name
- `displayName` → PascalCase app display name
- `packageName` → kebab-case npm package name

Example:

```text
rawAppName = "my-app"
projectDirName = "my-app"
displayName = "MyApp"
packageName = "my-app"
```

### b. Base path normalization

It computes:

```js
const APP_BASE = normalizeBase(appBase);
```

This is used to support subpath deployments such as:

- `/portal/`
- `/dashboard/`

### c. Validation

It checks:

- app name exists
- template folder exists
- target folder does not already exist

### d. Creates the project folder

It makes the destination app directory.

### e. Copies the template

It copies `template/` into the new project.

This is the starting scaffold for all generated apps.

### f. Writes `.gitignore`

If not present, it generates a standard ignore file.

### g. Writes or patches `index.html`

This file becomes the root HTML document for the generated Vite app.

It ensures:

- title branding
- manifest link
- icon link
- `src/main.jsx` script path

For base-aware generation, this file must reflect the right manifest/icon references.

### h. Writes `public/manifest.json`

This creates the PWA manifest and defines:

- app name
- short name
- start URL
- scope
- theme colors
- icon references

### i. Writes generated `package.json`

The generated app gets its own package configuration with scripts like:

- `dev`
- `start`
- `nexa`
- `build`
- `preview`

### j. Writes `src/main.jsx`

This file is the React entrypoint for the generated app.

It handles:

- ReactDOM mounting
- CSS import
- `BrowserRouter`
- service worker registration
- `APP_BASE` routing support

### k. Writes `src/App.jsx`

Creates a starter app shell for the generated project.

### l. Writes `src/App.css`

Adds base styling and a starter visual structure.

### m. Writes `run.js`

This script starts the generated app through Vite and prints Nexa-branded startup output.

### n. Writes `nexa.config.js`

This is the Vite configuration for the generated app.

It controls:

- base path
- server port
- build output

### o. Installs dependencies

Runs:

```bash
npm install
```

inside the generated project.

### p. Offers auto-start

Asks if the user wants to launch the app immediately.

This function is the current center of Nexa’s app creation flow.

---

## 11. Base-path support

### `normalizeBase(input = "/")`

This helper ensures base values are normalized into forms like:

- `/`
- `/portal/`
- `/dashboard/`

Purpose:

- prevent malformed paths
- make subpath deployments consistent

### `getFlagValue(argv, flagName)`

Reads a flag value from the CLI input, such as:

```bash
--base /portal/
```

### `parseArgs(argv)` with `--base`

This reads the base flag, removes it from the raw argument list, and returns the command + name + base.

Purpose:

- supports subpath deployment generation cleanly
- lets the rest of the generator work with a single normalized `base`

---

## 12. Command parsing

### `parseArgs(argv)`

This function decides what the user is trying to do.

It supports patterns like:

- `nexa new app my-app`
- `nexa new my-app`
- `nexa new gc Header`
- `create-nexa-app my-app`
- `create-nexa-app my-app --base /portal/`

It returns an object such as:

```js
{
  shortcut: "app",
  name: "my-app",
  base: "/portal/"
}
```

Purpose:

- translate user input into generator actions
- support both Nexa-style and CRA-style command entry

---

## 13. Main command dispatcher

After parsing, the file does:

```js
const { shortcut, name, base } = parseArgs(args);
```

Then `main()` routes to the correct behavior:

- `svc` → `createService`
- `ctx` → `createContext`
- `gc` / `cc` → `createComponent`
- `app` → `createApp(name, base)`

Purpose:

- central switchboard for CLI execution

---

## 14. Supporting files and folders

### `bin/`

Contains executable entry files.

Current role:

- `bin/nexa.js` = main CLI entrypoint

Future refactor target:

- keep entry file small
- move logic into smaller modules

### `template/`

This is the scaffold copied into every newly generated app.

It contains the base project structure such as:

- `public/`
- `src/`
- config files
- starter components

It is the “starter project blueprint” for Nexa.

### `template/public/`

Contains public assets copied into new apps:

- `index.html` template source
- `manifest.json`
- `nexa.svg`
- `sw.js`
- app icons

Purpose:

- PWA and branding assets
- root HTML source template

### `template/src/`

Contains the starter React app code:

- `App.jsx`
- `App.css`
- `main.jsx`
- `components/`
- `config/`
- `assets/`

Purpose:

- defines the default UI shell and architecture users get immediately

### `template/src/components/`

Houses starter UI components such as:

- Home
- Navbar
- DynamicHeader
- Nexa

Purpose:

- gives users a structured prebuilt UI instead of a blank app

### `template/src/config/routeMeta.js`

Central metadata-driven route definition file.

Purpose:

- drives dynamic header behavior
- supports navigation structure
- is updated by component generators

### `template/public/sw.js`

Service worker file for PWA support.

Purpose:

- installability
- caching behavior
- offline/PWA capabilities

### `template/nexa.config.js`

Base Vite config copied into generated apps.

Purpose:

- gives Nexa apps consistent build and dev behavior

---

## 15. Generated app files

When a user creates a Nexa app, the generated project typically includes:

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

These become the new app’s runnable codebase.

---

## 16. Current architectural reality

Right now, `bin/nexa.js` is doing **too many jobs**:

- CLI parsing
- help/version handling
- file writing utilities
- app generation
- component generation
- service generation
- context generation
- PWA setup
- base-path setup
- interactive prompts
- app startup

That is why refactoring into smaller files is the right next step.

---

## 17. Recommended future refactor

A cleaner structure would be:

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
  utils.js
  flags.js
  base.js
```

Purpose:

- make code easier to maintain
- support future packages like:
  - `nexa-cli`
  - `create-nexa-app`
  - `create-nexa-redux`

---

## 18. Package strategy moving forward

Current direction:

- **`nexa-cli`** → experimental package for testing and evolving new features
- **`create-nexa-app`** → stable production starter
- **`create-nexa-redux`** → future Redux-enabled starter

The idea is:

1. experiment inside `nexa-cli`
2. stabilize the feature
3. move the finished logic into `create-nexa-app` or `create-nexa-redux`

That is a strong product architecture direction.

---

## 19. In one sentence

`bin/nexa.js` is currently the full Nexa engine: it reads commands, generates projects and files, manages base-path support, installs dependencies, and launches the result — while the `template/` folder supplies the starter project blueprint it builds from.
