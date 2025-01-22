### **What is `IEnumerable` in C#?**

`IEnumerable` is an interface in the **System.Collections** namespace in C#. It represents a sequence of objects that can be enumerated (iterated) one at a time. It is a fundamental building block for iteration in C# and is commonly used in collection types like arrays, lists, and other data structures.

---

### **Key Points**

1. **Purpose**:

   - `IEnumerable` allows you to iterate over a collection using a `foreach` loop.
   - It provides a standardized way to access elements in a collection sequentially without exposing the underlying data structure.

2. **Namespace**:

   - It belongs to the `System.Collections` namespace.

3. **Definition**:

   - `IEnumerable` provides a single method:
     ```csharp
     public interface IEnumerable
     {
         IEnumerator GetEnumerator();
     }
     ```

4. **Generic Version**:
   - `IEnumerable<T>` (generic version) is in the `System.Collections.Generic` namespace. It is type-safe and works with specific types.
   - Example:
     ```csharp
     public interface IEnumerable<T> : IEnumerable
     {
         IEnumerator<T> GetEnumerator();
     }
     ```

---

### **How It Works**

When you use `foreach` on a collection, the compiler calls the `GetEnumerator` method of the `IEnumerable` interface to get an enumerator, which is used to traverse the collection.

---

### **Example: Using `IEnumerable`**

Here’s a simple example:

```csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // A list implements IEnumerable<T>
        List<string> fruits = new List<string> { "Apple", "Banana", "Cherry" };

        // Using foreach (uses IEnumerable behind the scenes)
        foreach (string fruit in fruits)
        {
            Console.WriteLine(fruit);
        }
    }
}
```

---

### **Custom Implementation of `IEnumerable`**

You can implement `IEnumerable` in your own classes to allow iteration:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

class MyCollection : IEnumerable<string>
{
    private List<string> items = new List<string>();

    public void Add(string item)
    {
        items.Add(item);
    }

    // Implement GetEnumerator()
    public IEnumerator<string> GetEnumerator()
    {
        return items.GetEnumerator(); // Delegate to the list's enumerator
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator(); // Explicit non-generic implementation
    }
}

class Program
{
    static void Main()
    {
        MyCollection collection = new MyCollection();
        collection.Add("Item 1");
        collection.Add("Item 2");
        collection.Add("Item 3");

        foreach (string item in collection)
        {
            Console.WriteLine(item);
        }
    }
}
```

---

### **When to Use `IEnumerable`**

- Use `IEnumerable` when you need to iterate over a collection.
- It is ideal for read-only access to data.
- If you need to manipulate the collection (like adding or removing items), consider using other interfaces like `IList` or `ICollection`.

---

### **Key Advantages**

1. **Flexibility**: Works with any type of collection that supports iteration.
2. **Linq Compatibility**: Many LINQ methods, like `Where`, `Select`, and `OrderBy`, operate on `IEnumerable<T>`.

---
