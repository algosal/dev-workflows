# 🔍 Recursive Search in JavaScript

## 📌 What is Recursive Search?

Recursive search is a method where a function **searches through all levels of a data structure**, including nested objects and arrays.

Instead of manually checking specific fields, it:

- starts at the top level
- explores every value
- goes deeper into nested structures automatically

🧠 **Key idea:**
A recursive function **calls itself** to handle smaller pieces of the same problem.

---

## 🧩 Why Use Recursive Search?

### ✅ Benefits

- 🔄 **Automatic** — no need to list every field
- 🧠 **Smart** — works with deeply nested data
- 🚀 **Future-proof** — new backend fields are automatically searchable
- 🧼 **Clean code** — avoids long manual field lists

---

### ⚠️ Tradeoffs

- 🎯 Less control over _what_ gets searched
- 📦 May include unwanted fields (e.g., IDs, timestamps)
- 🐢 Slightly heavier than manual search (but fine for most apps)

---

## 🏗️ Example Data Structure

```json
{
  "name": "Bronx Pizza LLC",
  "status": "ACTIVE",
  "details": {
    "businessEmail": "bronxpizza@gmail.com",
    "registrationState": "New York"
  },
  "ownership": {
    "myShare": 50,
    "members": [
      { "name": "Salman", "role": "Owner" },
      { "name": "John", "role": "Manager" }
    ]
  }
}
```

---

## ⚙️ Recursive Search Algorithm

```jsx
function objectMatchesQuery(value, query) {
  if (value == null) return false;

  // 🟢 Base case: primitive values
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value).toLowerCase().includes(query);
  }

  // 🟡 Array case
  if (Array.isArray(value)) {
    return value.some((item) => objectMatchesQuery(item, query));
  }

  // 🔵 Object case
  if (typeof value === "object") {
    return Object.values(value).some((nestedValue) =>
      objectMatchesQuery(nestedValue, query),
    );
  }

  return false;
}
```

---

## 🔍 How It Works (Step-by-Step)

### 1️⃣ Handle missing values

```js
if (value == null) return false;
```

🚫 Skip `null` or `undefined`

---

### 2️⃣ Handle simple values (strings, numbers, booleans)

```js
String(value).toLowerCase().includes(query);
```

💡 Examples:

- `"Pizza"` → `"pizza"`
- `25` → `"25"`
- `true` → `"true"`

---

### 3️⃣ Handle arrays

```js
value.some((item) => objectMatchesQuery(item, query));
```

🔁 Loop through each item
✔️ Return true if **any item matches**

---

### 4️⃣ Handle objects

```js
Object.values(value).some(...)
```

📦 Extract all values from object
🔁 Recursively search each value

---

## 🔁 Why It’s Called “Recursive”

Because the function calls itself:

```js
objectMatchesQuery(item, query);
```

This allows it to:

- go deeper into arrays
- go deeper into objects
- repeat until reaching simple values

🧠 Think of it like:

> “Keep opening boxes until you find what you're looking for.”

---

## 🧪 Example Search Flow

Search query:

```
"salman"
```

The function checks:

- ❌ "Bronx Pizza LLC"
- ❌ "ACTIVE"
- 🔽 enters `ownership`
- 🔽 enters `members`
- ✅ finds `"Salman"`

✔️ Match found → business included

---

## 🧰 How to Use in Your App

```jsx
const filteredBusinesses = useMemo(() => {
  const query = searchTerm.trim().toLowerCase();

  if (!query) return businesses;

  return businesses.filter((business) => objectMatchesQuery(business, query));
}, [businesses, searchTerm]);
```

---

## 🛡️ Production Version (with Exclusions)

Sometimes you want to ignore certain fields.

```jsx
function objectMatchesQuery(value, query, excludedKeys = []) {
  if (value == null) return false;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value).toLowerCase().includes(query);
  }

  if (Array.isArray(value)) {
    return value.some((item) => objectMatchesQuery(item, query, excludedKeys));
  }

  if (typeof value === "object") {
    return Object.entries(value).some(([key, nestedValue]) => {
      if (excludedKeys.includes(key)) return false;
      return objectMatchesQuery(nestedValue, query, excludedKeys);
    });
  }

  return false;
}
```

### Usage:

```jsx
objectMatchesQuery(business, query, ["createdAt", "updatedAt", "epoch"]);
```

🚫 Skips:

- timestamps
- internal metadata

---

## 🧠 Mental Model

🧩 Recursive search =

> “Turn the entire object into something searchable without manually listing fields.”

---

## ⚖️ Manual vs Recursive Search

| Approach      | Pros ✅             | Cons ⚠️                      |
| ------------- | ------------------- | ---------------------------- |
| Manual Search | Precise, controlled | Needs updates for new fields |
| Recursive     | Automatic, scalable | Less control, broader search |

---

## 🚀 When to Use Recursive Search

Use it when:

- 🧱 Your data is deeply nested
- 🔄 Your schema changes often
- ⚡ You want fast implementation

Avoid or customize it when:

- 🎯 You need strict control
- 🔐 Sensitive fields should not be searchable

---

## 🏁 Final Takeaway

Recursive search is a **powerful abstraction** that:

- removes manual field mapping
- adapts to changing data
- simplifies search logic dramatically

💡 Use it when you want flexibility.
🎯 Use manual filtering when you want precision.

---
