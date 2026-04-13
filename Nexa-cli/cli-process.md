# ✨ Nexa CLI — How It Really Runs on a Computer

This guide explains **how Nexa goes from your laptop to npm, then from npm to another machine, and finally how it behaves like a command/executable and writes files to disk**.

Think of this as the **luxury deep-dive** into the full lifecycle of Nexa.

---

# 🏛️ 1. The Big Idea

Nexa is **not** a compiled `.exe` in the classic sense.

Instead, Nexa is:

- 📦 an **npm package**
- 🧠 containing **JavaScript code**
- 🚀 executed by **Node.js**
- 🔗 exposed as a **terminal command** using npm’s `bin` system

So when a user types something like:

```bash
npx create-nexa-app my-app
```

what really happens is:

> npm downloads the package, finds the CLI entry file, and runs it with Node.

---

# 📦 2. What You Publish to npm

When you run:

```bash
npm publish --access public
```

npm takes your project folder and uploads a packaged version of it to the **npm registry**.

That published package usually contains things like:

- `package.json`
- `bin/nexa.js`
- `template/`
- `README.md`

So what npm stores is **not just one file**, but a whole package bundle.

---

# 🧾 3. Why `package.json` Is So Important

Your `package.json` is the control center for how npm understands your package.

Example:

```json
{
  "name": "create-nexa-app",
  "version": "1.0.12",
  "bin": {
    "create-nexa-app": "bin/nexa.js",
    "nexa": "bin/nexa.js"
  }
}
```

## 🧠 What each part means

### 🏷️ `"name"`

This is the **actual package name on npm**.

It controls commands like:

```bash
npx create-nexa-app
npm install -g create-nexa-app
```

---

### 🔢 `"version"`

This tells npm which release this is.

Examples:

- `1.0.9`
- `1.0.10`
- `1.0.12`

npm uses this to decide which version to download and whether a publish is allowed.

---

### ⚙️ `"bin"`

This is what makes your package behave like a CLI.

Example:

```json
"bin": {
  "create-nexa-app": "bin/nexa.js",
  "nexa": "bin/nexa.js"
}
```

This tells npm:

> “When this package is installed, create terminal commands named `create-nexa-app` and `nexa`, and both should run `bin/nexa.js`.”

This is the key to the whole CLI experience.

---

# 🌐 4. What npmjs.com / npm Registry Actually Does

There are two related things people casually call “npm”:

## 🌍 npmjs.com

The website where package pages are shown.

## 🗄️ npm registry

The actual backend package storage and metadata service.

When your package is published, the registry stores:

- package metadata
- version history
- tarball download location
- tags like `latest`

So when someone runs:

```bash
npx create-nexa-app my-app
```

npm checks the registry and asks:

- does `create-nexa-app` exist?
- what is the latest version?
- where do I download it from?

---

# 🚀 5. What `npx` Actually Does

`npx` is basically a shortcut for:

> “Download this package temporarily and run its CLI entrypoint.”

When a user runs:

```bash
npx create-nexa-app my-app
```

this is the rough sequence:

## Step-by-step

### 1️⃣ npm checks local cache

If the package was already downloaded before, it may reuse it.

### 2️⃣ If needed, npm downloads the package

It fetches the published tarball from the registry.

### 3️⃣ npm reads `package.json`

It looks for the `bin` field.

### 4️⃣ npm finds the executable mapping

It sees:

```json
"create-nexa-app": "bin/nexa.js"
```

### 5️⃣ npm creates a temporary command shim

This is what makes it feel like an executable.

### 6️⃣ npm launches Node

Node runs:

```text
bin/nexa.js
```

### 7️⃣ arguments are passed through

So `my-app` gets passed into your CLI.

---

# 🖥️ 6. Why It Feels Like an `.exe`

This is one of the most important concepts.

Nexa feels like a program because npm creates **command wrappers**.

---

## 🍎 On macOS / Linux

npm usually creates:

- a symlink
- or a small executable shell wrapper

That wrapper points to your CLI file.

Because your file begins with:

```js
#!/usr/bin/env node
```

the OS knows:

> run this file with Node.js

So when a user types:

```bash
create-nexa-app my-app
```

the shell finds the wrapper and executes Node on your JS file.

---

## 🪟 On Windows

npm usually creates command shim files such as:

- `create-nexa-app.cmd`
- sometimes PowerShell shims too

Those wrapper files effectively do something like:

```text
node path\to\bin\nexa.js my-app
```

So even though the user just typed:

```powershell
create-nexa-app my-app
```

under the hood Windows is really launching Node with your JavaScript file.

---

# 🧠 7. So Is It an `.exe`?

## ❌ Not usually

It is not a native compiled executable in the traditional C/C++ sense.

## ✅ Functionally, yes

It behaves like one because the system gives the user a real command name to run.

So the best mental model is:

> Nexa is a Node-powered command-line program wrapped by npm so it behaves like a real terminal executable.

---

# 🔧 8. What Happens with Global Install

When a user runs:

```bash
npm install -g create-nexa-app
```

npm does two things:

## 1️⃣ installs the package globally

It stores the package files in the global npm package area.

## 2️⃣ creates command shims in the global bin folder

Because your package has:

```json
"bin": {
  "create-nexa-app": "bin/nexa.js",
  "nexa": "bin/nexa.js"
}
```

npm creates commands for:

- `create-nexa-app`
- `nexa`

If that global bin folder is on the machine’s PATH, then the user can type those commands anywhere.

---

# 🧭 9. What PATH Has to Do with It

The shell only recognizes a command if its location is in the system’s `PATH`.

So when users type:

```bash
nexa
```

the shell searches folders in PATH for something named `nexa`.

If npm installed a shim like:

```text
C:\Users\Name\AppData\Roaming\npm\nexa.cmd
```

and that folder is in PATH, the command works.

If that folder is **not** in PATH, the shell says:

> command not found

That is why PATH problems often break global CLIs.

---

# 🪄 10. Why `npx` Is Different from Global Install

## Global install

Makes the command available permanently.

```bash
npm install -g create-nexa-app
create-nexa-app my-app
```

## `npx`

Runs it temporarily without requiring permanent install.

```bash
npx create-nexa-app my-app
```

So:

- `npm install -g` = keep it installed
- `npx` = fetch and run when needed

---

# 🧠 11. What Your CLI Actually Receives

Once Node starts `bin/nexa.js`, your script gets access to the command-line input through:

```js
const args = process.argv.slice(2);
```

If the user typed:

```bash
create-nexa-app my-app --base /portal/
```

then your code sees something like:

```js
["my-app", "--base", "/portal/"];
```

That is the raw input from the terminal.

---

# 🧾 12. How Nexa Understands the Command

Your CLI then parses those arguments.

This is the job of logic like:

- `parseArgs(argv)`
- `getFlagValue(argv, "--base")`
- `normalizeBase(...)`

So Nexa converts raw text into structured meaning.

For example, this:

```bash
create-nexa-app my-app --base /portal/
```

becomes something like:

```js
{
  shortcut: "app",
  name: "my-app",
  base: "/portal/"
}
```

This is what allows the rest of the generator to behave intelligently.

---

# 🏗️ 13. How Nexa Actually Creates Files

This part is beautifully simple.

Nexa writes files using normal Node filesystem APIs:

- `fs.mkdirSync(...)`
- `fs.writeFileSync(...)`
- `fs.readFileSync(...)`
- `fs.copyFileSync(...)`

So when Nexa “creates a project,” it is literally:

## 📁 Creating folders

```js
fs.mkdirSync(projectDir, { recursive: true });
```

## 📋 Copying template files

```js
copyRecursive(templateDir, projectDir);
```

## ✍️ Writing dynamic files

```js
writeFileSafe(mainJsxPath, mainJsxContent);
writeFileSafe(manifestPath, manifestContent);
writeFileSafe(nexaConfigPath, nexaConfigContent);
```

There is no hidden black box here.

It is just a well-organized JavaScript program writing files to disk.

---

# 🧱 14. How the Template Folder Works

Your `template/` folder is the **blueprint** for every new Nexa app.

It contains things like:

- `template/public/index.html`
- `template/public/manifest.json`
- `template/public/sw.js`
- `template/src/App.jsx`
- `template/src/main.jsx`
- `template/src/config/routeMeta.js`

When a user creates a new app, Nexa:

1. copies the whole template into the new project
2. overwrites files that must be dynamic

So the template is like the **starter house design**, and the generator customizes it for the specific app.

---

# 🎯 15. Why Some Files Are Dynamic

Some files must change depending on the command input.

Examples:

- app name
- title
- base path
- manifest values
- router basename
- Vite base

So files like these are generated dynamically:

- `index.html`
- `public/manifest.json`
- `src/main.jsx`
- `nexa.config.js`

These are not just copied blindly — they are rewritten using string templates.

---

# 🧠 16. How Dynamic File Content Is Built

Nexa often builds file content as strings.

Example idea:

```js
const manifestContent = `{
  "name": "Nexa App",
  "start_url": "./"
}`;
```

or:

```js
const mainJsxContent = `import React from "react";
...`;
```

Then it writes those strings into actual files.

So the generator is really a **smart text-producing engine**.

---

# 📦 17. What Happens After Files Are Written

Once the app structure is ready, Nexa often runs:

```js
execSync("npm install", { stdio: "inherit", cwd: projectDir });
```

This means:

> “Go into the newly created app folder and run `npm install` there.”

So the generated app becomes its own npm project.

Important distinction:

## The CLI package

This is the generator itself.

## The generated app

This is a completely separate npm project with its own:

- `package.json`
- dependencies
- scripts
- source code

So Nexa creates another project, then installs dependencies into that project.

---

# ▶️ 18. How the Generated App Runs

The generated app contains its own scripts, usually like:

```json
"scripts": {
  "dev": "node run.js",
  "start": "node run.js",
  "nexa": "node run.js"
}
```

When the user runs:

```bash
npm run dev
```

inside the generated app, npm looks at **that app’s** `package.json`, not the CLI’s package.

Then it runs the generated app’s own `run.js`, which launches Vite.

So there are two different Node programs involved:

---

## 🧠 Program A: the CLI

Runs `bin/nexa.js`

Purpose:

- create the app

---

## ⚛️ Program B: the generated app

Runs its own `run.js`

Purpose:

- start the app’s development server

---

# 🌐 19. How Base Paths Affect Generation

When the user runs:

```bash
create-nexa-app my-app --base /portal/
```

Nexa uses that base value to configure:

- Vite base
- React Router basename
- service worker path
- generated app behavior for subpath deployment

But for Apache compatibility, some files should use **relative references**, such as:

- `./manifest.json`
- `./icons/icon-192.png`

That way the app can live under subfolders without hardcoded root assumptions.

---

# 🧩 20. Why `bin` Can Expose More Than One Command

Your package can expose multiple commands from one package:

```json
"bin": {
  "create-nexa-app": "bin/nexa.js",
  "nexa": "bin/nexa.js"
}
```

This means both commands launch the same file.

So one package can support:

- onboarding command
- power-user command

This is great for UX.

---

# ❗ 21. Why `npx nexa` Is Not the Same as `nexa`

This is one of the most confusing parts for many developers.

## `nexa`

This is a **command name** exposed by an installed package.

It works if:

- the package is globally installed
- or linked locally with `npm link`

## `npx nexa`

This means:

> “Find an npm package literally named `nexa` and run it.”

So `npx` cares about the **package name**, not the bin alias.

That is why:

- a package can expose a `nexa` command
- but `npx nexa` still fails if the package name is not actually `nexa`

---

# 🧪 22. Why `npm link` Helps During Development

When you run:

```bash
npm link
```

npm creates a global symlink to your local package.

That lets you test your local unpublished CLI as if it were globally installed.

This is incredibly useful because it means:

- edit code locally
- relink
- run command like a real user

So `npm link` is the bridge between **development** and **real CLI behavior**.

---

# 🏛️ 23. Why You Want Multiple Packages

Your package strategy makes sense:

## 🧪 `nexa-cli`

Experimental package

Purpose:

- test unstable ideas
- try new generators
- prototype future features

## ✅ `create-nexa-app`

Stable starter package

Purpose:

- clean onboarding
- production-ready user-facing tool

## 🧠 `create-nexa-redux`

Redux starter package

Purpose:

- include Redux Toolkit
- prewire store/provider
- add commands like:
  - `nexa csl auth`

This is a strong ecosystem structure.

---

# 🧹 24. Why Refactoring `bin/nexa.js` Matters

Right now one file handles:

- version
- help
- args
- filesystem
- copy logic
- app generation
- component generation
- context generation
- service generation
- base logic
- npm install
- app startup

That is a lot.

As Nexa grows, this should be broken into modules.

A future structure could look like:

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
  createSlice.js
  base.js
  utils.js
```

This will make the system much more maintainable.

---

# 💎 25. The Most Luxurious Mental Model

Think of Nexa like a **high-end architectural studio**:

- 🧠 `bin/nexa.js` = chief architect
- 📐 `template/` = building blueprint
- 🛠️ Node filesystem APIs = construction tools
- 📦 npm registry = distribution warehouse
- 🚀 `npx` = temporary delivery + launch service
- 🏠 generated app = finished structure handed to the user

That is the full lifecycle.

---

# 🏁 26. Final Summary

## In one sentence:

**Nexa is published as an npm package, npm uses the `bin` field to expose it as a terminal command, Node executes the CLI entry file, the CLI parses user input, copies the project template, writes dynamic files with filesystem APIs, installs dependencies, and produces a brand-new runnable app on disk.**

---

# 🌟 27. The Full Flow in Arrow Form

```text
You write Nexa code
        ↓
npm publish
        ↓
npm registry stores package
        ↓
User runs npx create-nexa-app my-app
        ↓
npm downloads package
        ↓
npm reads package.json
        ↓
npm finds bin/nexa.js
        ↓
npm creates/runs command shim
        ↓
Node executes bin/nexa.js
        ↓
Nexa parses args
        ↓
Nexa copies template
        ↓
Nexa writes dynamic files
        ↓
Nexa runs npm install in generated app
        ↓
New app is created and optionally started
```

---
