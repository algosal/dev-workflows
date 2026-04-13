# 1. What the npm-generated `.cmd` wrapper looks like

When you install a Node CLI package globally on Windows, npm usually creates a small wrapper file in a global bin directory such as:

```text
C:\Users\<YourUser>\AppData\Roaming\npm\create-nexa-app.cmd
```

or

```text
C:\Users\<YourUser>\AppData\Roaming\npm\nexa.cmd
```

It will look roughly like this:

```cmd
@ECHO off
SETLOCAL

SET "NODE_EXE=node"
IF EXIST "%~dp0\node.exe" (
  SET "NODE_EXE=%~dp0\node.exe"
)

"%NODE_EXE%" "%~dp0\node_modules\create-nexa-app\bin\nexa.js" %*
```

Sometimes npm generates a slightly different variant, but conceptually it always does the same thing.

## What each line means

### `@ECHO off`

Hides command echoing so the wrapper runs quietly.

### `SETLOCAL`

Starts a local environment scope so any variable changes stay inside this script.

### `SET "NODE_EXE=node"`

Assumes `node` is available on PATH.

### `IF EXIST "%~dp0\node.exe" ...`

Checks whether there is a local `node.exe` next to the wrapper.

- `%~dp0` means: the folder where the current `.cmd` file lives

### `"%NODE_EXE%" "...bin\nexa.js" %*`

This is the important line.

It runs:

- `node`
- on your CLI file `bin/nexa.js`
- and passes through all command-line arguments using `%*`

So if the user types:

```powershell
create-nexa-app my-app --base /portal/
```

the wrapper effectively runs:

```powershell
node C:\...\bin\nexa.js my-app --base /portal/
```

That is the whole trick.

## Why this matters

This is why your package behaves like a Windows command even though your real code is just JavaScript.

The `.cmd` file is the bridge between:

- terminal command name
- Node runtime
- your JS file

# 2. What the PowerShell wrapper may look like

npm often also creates a `.ps1` file for PowerShell, something like:

```powershell
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  $exe=".exe"
}

if (Test-Path "$basedir/node$exe") {
  & "$basedir/node$exe" "$basedir/node_modules/create-nexa-app/bin/nexa.js" $args
} else {
  & "node$exe" "$basedir/node_modules/create-nexa-app/bin/nexa.js" $args
}

exit $LASTEXITCODE
```

Same idea:

- find Node
- run your CLI file
- pass through all arguments

# 3. How to inspect the actual wrapper on your machine

On Windows, you can inspect what npm really generated.

For example:

```powershell
where create-nexa-app
where nexa
```

Then open the file:

```powershell
notepad C:\Users\<YourUser>\AppData\Roaming\npm\create-nexa-app.cmd
```

or

```powershell
type C:\Users\<YourUser>\AppData\Roaming\npm\create-nexa-app.cmd
```

That will show the exact shim npm created.

# 4. How a real compiled `.exe` version would differ

Right now Nexa is:

- JavaScript
- run by Node
- wrapped by npm-generated shims

A real `.exe` version would mean:

- bundling your CLI into a standalone binary
- no separate Node install needed for the user
- the OS runs the binary directly

So instead of:

```text
command -> .cmd -> node -> nexa.js
```

you get:

```text
command -> nexa.exe
```

That is a true executable flow.

# 5. How to build a real `.exe` from a Node CLI

There are tools that package Node apps into binaries. Historically common ones include:

- `pkg`
- `nexe`

The general idea is:

1. bundle your JS code
2. package Node runtime with it
3. emit a platform-specific executable

A typical workflow with a tool like `pkg` looks like:

## Install the packager

```bash
npm install --save-dev pkg
```

## Add a bin entry in `package.json`

```json
{
  "bin": "bin/nexa.js"
}
```

## Build executable

```bash
npx pkg . --targets node20-win-x64 --output nexa.exe
```

That can produce something like:

```text
nexa.exe
```

which the user can run directly on Windows.

## What changes for the user

### Current npm CLI model

User needs Node installed.

Runs:

```powershell
npm install -g create-nexa-app
create-nexa-app my-app
```

### Compiled `.exe` model

User could just download:

```text
nexa.exe
```

and run:

```powershell
nexa.exe my-app
```

without needing npm/global install in the same way.

# 6. Tradeoffs of `.exe` packaging

## Advantages

- easier for non-Node users
- feels more native
- no separate Node dependency for the end user
- simpler for Windows-first distribution

## Disadvantages

- more build complexity
- separate binaries per platform:
  - Windows
  - macOS
  - Linux

- larger file sizes
- trickier updates
- sometimes packaging tools have limitations with dynamic imports/filesystem assumptions

# 7. Why npm CLI is still the better default for Nexa right now

For your current stage, npm distribution is still the best primary model because:

- your audience is developers
- developers usually already have Node installed
- npm + npx gives instant distribution
- versioning and updates are easy
- cross-platform support is simpler

A compiled `.exe` is more of a future enhancement, not a replacement for the npm model.

# 8. The two execution chains side by side

## Current Nexa npm flow

```text
User types: create-nexa-app my-app
        ↓
Shell finds create-nexa-app.cmd
        ↓
.cmd runs node bin/nexa.js my-app
        ↓
Node executes your CLI code
        ↓
CLI writes files and creates project
```

## Future compiled `.exe` flow

```text
User types: nexa.exe my-app
        ↓
Windows runs compiled executable directly
        ↓
Embedded Node runtime + bundled JS execute
        ↓
CLI writes files and creates project
```

# 9. Best mental model

The npm model is like this:

- your real app is `bin/nexa.js`
- npm creates a launcher around it
- launcher makes it feel native

The compiled model is like this:

- your app and runtime are fused into one binary
- the OS runs that binary directly

# 10. What I recommend for Nexa

Keep this order:

1. stabilize npm packages
   - `create-nexa-app`
   - `nexa-cli`
   - `create-nexa-redux`

2. refactor `bin/nexa.js` into modules

3. only then experiment with:
   - Windows `.exe`
   - maybe macOS/Linux binaries later

That way you do not add packaging complexity before the core architecture is stable.

# 11. One simple summary

## npm wrapper model

Nexa works like a command because npm creates `.cmd` or shell wrapper files that run your JS with Node.

## compiled `.exe` model

Nexa would work like a true native executable because the JS and Node runtime are bundled into one binary.
