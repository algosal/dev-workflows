## List and LinkedList in C#

A **detailed and beginner-friendly explanation** of the key methods for **`List<T>`** and **`LinkedList<T>`** in C#. I've kept it simple for easy understanding. 🌟

---

## **`List<T>` Methods**

The `List<T>` class is part of the `System.Collections.Generic` namespace. It’s like a dynamic array that can grow or shrink as needed.

### Common Methods

1. **`Add(item)`**

   - Adds an item to the end of the list.
   - Example:
     ```csharp
     List<string> fruits = new List<string>();
     fruits.Add("Apple"); // List: ["Apple"]
     ```

2. **`AddRange(IEnumerable<T> items)`**

   - Adds multiple items to the end of the list.
   - Example:
     ```csharp
     fruits.AddRange(new List<string> { "Banana", "Cherry" }); // List: ["Apple", "Banana", "Cherry"]
     ```

3. **`Insert(index, item)`**

   - Inserts an item at a specific position.
   - Example:
     ```csharp
     fruits.Insert(1, "Blueberry"); // List: ["Apple", "Blueberry", "Banana", "Cherry"]
     ```

4. **`Remove(item)`**

   - Removes the first occurrence of the specified item.
   - Example:
     ```csharp
     fruits.Remove("Banana"); // List: ["Apple", "Blueberry", "Cherry"]
     ```

5. **`RemoveAt(index)`**

   - Removes an item at a specific index.
   - Example:
     ```csharp
     fruits.RemoveAt(0); // List: ["Blueberry", "Cherry"]
     ```

6. **`RemoveRange(startIndex, count)`**

   - Removes a range of items starting from `startIndex`.
   - Example:
     ```csharp
     fruits.RemoveRange(0, 2); // Removes 2 items starting at index 0.
     ```

7. **`Contains(item)`**

   - Checks if the item exists in the list.
   - Example:
     ```csharp
     if (fruits.Contains("Cherry")) { Console.WriteLine("Found!"); }
     ```

8. **`IndexOf(item)`**

   - Returns the index of the first occurrence of an item.
   - Example:
     ```csharp
     int index = fruits.IndexOf("Cherry"); // Returns 1
     ```

9. **`Sort()`**

   - Sorts the list in ascending order.
   - Example:
     ```csharp
     fruits.Sort(); // List: ["Apple", "Banana", "Cherry"]
     ```

10. **`Count` (Property)**
    - Returns the total number of items in the list.
    - Example:
      ```csharp
      Console.WriteLine(fruits.Count); // Prints: 3
      ```

---

## **`LinkedList<T>` Methods**

The `LinkedList<T>` class is part of the `System.Collections.Generic` namespace. It’s a doubly linked list where each node knows about the next and previous nodes.

### Common Methods

1. **`AddFirst(item)`**

   - Adds an item at the beginning of the list.
   - Example:
     ```csharp
     LinkedList<string> fruits = new LinkedList<string>();
     fruits.AddFirst("Apple"); // List: ["Apple"]
     ```

2. **`AddLast(item)`**

   - Adds an item at the end of the list.
   - Example:
     ```csharp
     fruits.AddLast("Banana"); // List: ["Apple", "Banana"]
     ```

3. **`AddBefore(node, item)`**

   - Adds an item before a specified node.
   - Example:
     ```csharp
     var node = fruits.Find("Banana");
     fruits.AddBefore(node, "Cherry"); // List: ["Apple", "Cherry", "Banana"]
     ```

4. **`AddAfter(node, item)`**

   - Adds an item after a specified node.
   - Example:
     ```csharp
     var node = fruits.Find("Cherry");
     fruits.AddAfter(node, "Date"); // List: ["Apple", "Cherry", "Date", "Banana"]
     ```

5. **`Remove(item)`**

   - Removes the first occurrence of the specified item.
   - Example:
     ```csharp
     fruits.Remove("Cherry"); // List: ["Apple", "Date", "Banana"]
     ```

6. **`RemoveFirst()`**

   - Removes the first node in the list.
   - Example:
     ```csharp
     fruits.RemoveFirst(); // List: ["Date", "Banana"]
     ```

7. **`RemoveLast()`**

   - Removes the last node in the list.
   - Example:
     ```csharp
     fruits.RemoveLast(); // List: ["Date"]
     ```

8. **`Find(item)`**

   - Returns the first node containing the specified item.
   - Example:
     ```csharp
     var node = fruits.Find("Date");
     Console.WriteLine(node.Value); // Prints: "Date"
     ```

9. **`Contains(item)`**

   - Checks if the item exists in the list.
   - Example:
     ```csharp
     if (fruits.Contains("Banana")) { Console.WriteLine("Found!"); }
     ```

10. **`Count` (Property)**
    - Returns the total number of nodes in the list.
    - Example:
      ```csharp
      Console.WriteLine(fruits.Count); // Prints: 2
      ```

---

## Key Differences Between `List<T>` and `LinkedList<T>`:

| Feature               | `List<T>`                    | `LinkedList<T>`             |
| --------------------- | ---------------------------- | --------------------------- |
| **Access Time**       | Fast random access via index | Sequential access only      |
| **Insertion/Removal** | Slower (shifts items)        | Faster (adjusts pointers)   |
| **Memory Usage**      | Less overhead                | More memory (node pointers) |
