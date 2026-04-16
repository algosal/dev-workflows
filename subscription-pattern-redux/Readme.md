# 🧠 Mini Redux System (Pure JavaScript)

This project demonstrates how a **Redux-like state management system** works — built entirely with **pure JavaScript (no libraries, no frameworks)**.

It is designed to help you deeply understand:

- The **subscription pattern**
- How **state flows through a system**
- How **UI updates automatically**
- And how Redux is just a structured version of this pattern

---

# 🚫 No Libraries Used

This project uses:

- ✅ Plain JavaScript
- ✅ HTML
- ✅ CSS

❌ No React
❌ No Redux library
❌ No external dependencies

Everything is built from scratch so you can clearly see **how it works under the hood**.

---

# 🧠 What This Project Teaches

At its core, this system demonstrates:

> **“Register once, react automatically when data changes.”**

Instead of manually updating UI everywhere, you:

1. Store state in one place
2. Update it through rules
3. Notify all listeners automatically

---

# 🔁 Core Flow (IMPORTANT)

This is the entire system:

```text
User clicks button
      ↓
dispatch(action)
      ↓
reducer(state, action)
      ↓
new state is created
      ↓
store updates state
      ↓
store notifies all subscribers
      ↓
UI updates automatically
```

---

# 🧩 Project Structure

```
/project
  ├── index.html
  ├── style.css
  ├── app.js
  ├── store.js
  └── reducer.js
```

---

# 📦 Components Explained

---

## 🧠 1. Store (`store.js`)

The **store** is the brain of the system.

It is responsible for:

- Holding the current state
- Storing subscriber functions
- Notifying subscribers when state changes

### Key methods:

```js
subscribe(callback);
dispatch(action);
getState();
```

### Mental Model:

> The store does NOT update UI directly
> It only calls functions that were given to it

---

## ⚙️ 2. Reducer (`reducer.js`)

The **reducer** defines how state changes.

It is a pure function:

```js
(state, action) => newState;
```

Example:

```js
case "INCREMENT":
  return { count: state.count + 1 };
```

### Mental Model:

> Reducer = rules of change
> It decides what the new state should be

---

## 🔘 3. App Logic (`app.js`)

This connects everything together:

- Creates the store
- Subscribes UI to state changes
- Dispatches actions on button clicks

Example:

```js
store.dispatch({ type: "INCREMENT" });
```

---

## 🌐 4. UI (`index.html`)

Simple interface with:

- Counter display
- Increment / Decrement buttons
- Explanation of system flow

---

## 🎨 5. Styling (`style.css`)

Provides:

- Modern UI design
- Clean layout
- Visual clarity of system behavior

---

# 🔔 Subscription Pattern (Core Concept)

This entire system is built on the **subscription pattern**.

### Step 1: Subscribe

```js
store.subscribe((state) => {
  // update UI here
});
```

👉 You are saying:

> “When something changes, run this function.”

---

### Step 2: Dispatch

```js
store.dispatch({ type: "INCREMENT" });
```

👉 You are saying:

> “Something happened.”

---

### Step 3: Notify

Internally, the store does:

```js
subscribers.forEach((fn) => fn(state));
```

👉 Every subscriber receives the updated state.

---

# 🔥 What Actually Happens Internally

### When you click a button:

```text
dispatch({ type: "INCREMENT" })
```

### Then:

1. Reducer calculates new state
2. Store saves new state
3. Store loops through subscribers
4. Each subscriber function runs
5. UI updates

---

# 🧠 Important Clarifications

---

## ❌ It is NOT a stack

Subscribers are stored in:

```js
this.subscribers = [];
```

👉 This is an **array (list)**, not a stack.

---

## ❌ Data is NOT “pushed into components”

Instead:

> Components give functions to the store
> The store calls those functions later

---

## ✅ Functions are passed by reference

```js
subscribe(callback);
```

You are passing:

> “Here is my function, call it later.”

NOT:

> “Run this now.”

---

## ✅ UI updates happen because of state changes

When subscriber runs:

```js
document.getElementById("count").innerText = state.count;
```

👉 UI updates automatically

In React, this would be:

```js
setState(state);
```

---

# 🔑 Final Mental Model (MEMORIZE THIS)

```text
subscribe(fn)
     ↓
store saves fn
     ↓
dispatch(action)
     ↓
reducer returns new state
     ↓
store updates state
     ↓
store runs all saved functions
     ↓
functions update UI
```

---

# 🧠 One-Line Truth

> The store does NOT send data to UI —
> it only runs functions that already know how to update the UI.

---

# 🚀 Why This Matters

Understanding this means you now understand the foundation of:

- Redux
- React state management
- Event-driven systems
- Real-time applications
- WebSocket architectures

---

# 🧪 How to Run

1. Open `index.html` in your browser
2. Click buttons
3. Watch the UI update
4. Open console to observe logs

---

# 🔥 Final Insight

This project is NOT just a counter.

It is a **mental model of how modern applications work**.

Once you understand this:

> You stop manually controlling UI
> And start building systems that react automatically

---

# 📡 Core Principle

> **Register once. React forever.**
