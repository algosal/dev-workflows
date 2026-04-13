# 🧾 1. Is `#!/usr/bin/env node` a `.bat` file?

## ❌ No — it is NOT a `.bat` file

```js
#!/usr/bin/env node
```

This is called a **shebang line**.

---

## 🧠 What it actually is

It tells Unix-like systems (Mac/Linux):

> “Run this file using Node.”

So when you execute your CLI:

```bash
create-nexa-app my-app
```

the OS sees:

```js
#!/usr/bin/env node
```

and internally runs:

```bash
node bin/nexa.js
```

---

## 🪟 On Windows

Windows **does NOT use shebangs**.

Instead, npm creates **wrapper files** like:

- `create-nexa-app.cmd`
- `create-nexa-app.ps1`

Those wrappers call Node manually.

So:

| Platform    | What runs your CLI              |
| ----------- | ------------------------------- |
| macOS/Linux | shebang (`#!/usr/bin/env node`) |
| Windows     | `.cmd` / `.ps1` wrapper         |

---

# 🧠 2. What is PATH (very important)

## 🔑 PATH = list of folders where commands are searched

When you type:

```bash
nexa
```

your system does:

> “Search all folders in PATH for something named `nexa`”

---

## 🧭 Example (Windows)

```text
C:\Windows\System32
C:\Users\You\AppData\Roaming\npm
```

If npm installs:

```text
C:\Users\You\AppData\Roaming\npm\nexa.cmd
```

and that folder is in PATH → command works.

If not → you get:

```text
nexa is not recognized
```

---

## 🍎 macOS/Linux example

```bash
echo $PATH
```

You might see:

```text
/usr/local/bin:/usr/bin:/bin:/usr/sbin
```

npm usually installs global commands into:

```text
/usr/local/bin
```

So:

```bash
nexa
```

works because the shell finds it there.

---

# 🪄 3. How npm uses PATH

When you run:

```bash
npm install -g create-nexa-app
```

npm:

1. installs the package globally
2. creates command wrappers in the global bin folder
3. that folder is already in PATH

So now:

```bash
create-nexa-app
nexa
```

work anywhere.

---

# ⚙️ 4. Difference: `.cmd` vs `.bat` vs `.exe`

This is where things get interesting.

---

## 🟦 `.exe` (Executable)

### What it is

- compiled binary program (C/C++, Go, Rust, etc.)
- machine code

### Examples

- `node.exe`
- `chrome.exe`

### Characteristics

- fastest
- native OS program
- no interpreter needed

---

## 🟨 `.bat` (Batch file)

### What it is

- plain text script for Windows Command Prompt
- executed by `cmd.exe`

### Example

```bat
@echo off
echo Hello World
```

### Characteristics

- simple scripting
- limited features
- older format

---

## 🟩 `.cmd` (Command script)

### What it is

- newer version of `.bat`
- also run by `cmd.exe`
- slightly more consistent behavior

### Example (npm-generated)

```cmd
@ECHO off
node "%~dp0\node_modules\create-nexa-app\bin\nexa.js" %*
```

### Characteristics

- better for modern scripting
- used by npm for CLI tools

---

# 🧠 Key Differences

| Type   | Runs via    | Purpose          |
| ------ | ----------- | ---------------- |
| `.exe` | OS directly | compiled program |
| `.bat` | `cmd.exe`   | old script       |
| `.cmd` | `cmd.exe`   | modern script    |
| `.js`  | `node`      | your CLI logic   |

---

# 🧩 5. How your CLI runs on Windows

When user types:

```powershell
create-nexa-app my-app
```

Here’s what happens:

---

## Step-by-step

### 1️⃣ Shell looks in PATH

Finds:

```text
C:\Users\You\AppData\Roaming\npm\create-nexa-app.cmd
```

---

### 2️⃣ Runs `.cmd` file

That file contains something like:

```cmd
node "C:\...\node_modules\create-nexa-app\bin\nexa.js" %*
```

---

### 3️⃣ Node launches your script

Equivalent to:

```bash
node bin/nexa.js my-app
```

---

### 4️⃣ Your CLI runs

Now your code executes:

- parses args
- copies template
- writes files
- runs npm install

---

# 🧠 6. How your CLI runs on macOS/Linux

When user types:

```bash
create-nexa-app my-app
```

---

## Step-by-step

### 1️⃣ Shell finds executable file

```text
/usr/local/bin/create-nexa-app
```

---

### 2️⃣ OS reads shebang

```js
#!/usr/bin/env node
```

---

### 3️⃣ OS runs:

```bash
node bin/nexa.js my-app
```

---

### 4️⃣ Your CLI runs

Same logic as Windows after this point.

---

# 🔥 7. Why this system is powerful

Because you get:

- 💻 cross-platform CLI (Windows + Mac + Linux)
- ⚡ no compilation needed
- 📦 easy distribution via npm
- 🧠 full programming power (JavaScript)

---

# 🧠 8. Mental Model (Important)

Think of Nexa like this:

```text
User types command
        ↓
Shell searches PATH
        ↓
Finds wrapper (.cmd / symlink)
        ↓
Wrapper runs Node
        ↓
Node runs bin/nexa.js
        ↓
Your code executes
        ↓
Files get created
```

---

# 💎 9. Final Summary

## ❓ Is `#!/usr/bin/env node` a `.bat` file?

❌ No
✅ It is a Unix instruction telling the OS to use Node

---

## 🧭 PATH

- list of directories where commands are searched
- npm installs CLI wrappers into a PATH directory
- that’s why commands work globally

---

## ⚙️ File types

- `.exe` → compiled program
- `.bat` → old Windows script
- `.cmd` → modern Windows script (used by npm)
- `.js` → your CLI logic (run by Node)

---
