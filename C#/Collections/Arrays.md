## Arrays Methods

In C#, arrays are a fundamental type for storing a fixed-size collection of elements of the same type. While arrays themselves don't have methods like classes, you can use **methods from the `Array` class** in the `System` namespace to manipulate arrays. Here's a detailed guide to the most common methods associated with arrays:

---

### **Common Array Methods**

1. **`Array.Sort(array)`**

   - **Purpose**: Sorts the elements in ascending order.
   - **Example**:
     ```csharp
     int[] numbers = { 5, 3, 8, 1 };
     Array.Sort(numbers); // numbers: { 1, 3, 5, 8 }
     ```

2. **`Array.Reverse(array)`**

   - **Purpose**: Reverses the order of elements in the array.
   - **Example**:
     ```csharp
     Array.Reverse(numbers); // numbers: { 8, 5, 3, 1 }
     ```

3. **`Array.IndexOf(array, value)`**

   - **Purpose**: Finds the index of the first occurrence of the specified value.
   - **Example**:
     ```csharp
     int index = Array.IndexOf(numbers, 5); // index: 1
     ```

4. **`Array.LastIndexOf(array, value)`**

   - **Purpose**: Finds the index of the last occurrence of the specified value.
   - **Example**:
     ```csharp
     int[] numbers = { 1, 2, 3, 2, 5 };
     int index = Array.LastIndexOf(numbers, 2); // index: 3
     ```

5. **`Array.Clear(array, startIndex, count)`**

   - **Purpose**: Sets a range of elements to their default values (e.g., `0` for numbers, `null` for objects).
   - **Example**:
     ```csharp
     int[] numbers = { 1, 2, 3, 4, 5 };
     Array.Clear(numbers, 1, 2); // numbers: { 1, 0, 0, 4, 5 }
     ```

6. **`Array.Copy(sourceArray, destinationArray, count)`**

   - **Purpose**: Copies elements from one array to another.
   - **Example**:
     ```csharp
     int[] source = { 1, 2, 3 };
     int[] destination = new int[3];
     Array.Copy(source, destination, 3); // destination: { 1, 2, 3 }
     ```

7. **`Array.Clone()`**

   - **Purpose**: Creates a shallow copy of the array.
   - **Example**:
     ```csharp
     int[] numbers = { 1, 2, 3 };
     int[] clone = (int[])numbers.Clone(); // clone: { 1, 2, 3 }
     ```

8. **`Array.Resize(ref array, newSize)`**

   - **Purpose**: Changes the size of an array (creates a new array internally).
   - **Example**:
     ```csharp
     int[] numbers = { 1, 2, 3 };
     Array.Resize(ref numbers, 5); // numbers: { 1, 2, 3, 0, 0 }
     ```

9. **`Array.Exists(array, predicate)`**

   - **Purpose**: Checks if any element in the array satisfies a condition.
   - **Example**:
     ```csharp
     bool exists = Array.Exists(numbers, n => n > 2); // exists: true
     ```

10. **`Array.Find(array, predicate)`**

    - **Purpose**: Finds the first element that matches a condition.
    - **Example**:
      ```csharp
      int result = Array.Find(numbers, n => n > 2); // result: 3
      ```

11. **`Array.FindAll(array, predicate)`**

    - **Purpose**: Finds all elements that match a condition.
    - **Example**:
      ```csharp
      int[] results = Array.FindAll(numbers, n => n > 2); // results: { 3, 4 }
      ```

12. **`Array.FindIndex(array, predicate)`**

    - **Purpose**: Finds the index of the first element that matches a condition.
    - **Example**:
      ```csharp
      int index = Array.FindIndex(numbers, n => n > 2); // index: 2
      ```

13. **`Array.FindLast(array, predicate)`**

    - **Purpose**: Finds the last element that matches a condition.
    - **Example**:
      ```csharp
      int result = Array.FindLast(numbers, n => n > 2); // result: 4
      ```

14. **`Array.BinarySearch(array, value)`**
    - **Purpose**: Searches for a value in a sorted array using a binary search algorithm. Returns the index of the value or a negative number if not found.
    - **Example**:
      ```csharp
      int[] numbers = { 1, 2, 3, 4, 5 };
      int index = Array.BinarySearch(numbers, 3); // index: 2
      ```

---

### **Other Useful Properties of Arrays**

1. **`Length`**

   - **Purpose**: Gets the total number of elements in the array.
   - **Example**:
     ```csharp
     int[] numbers = { 1, 2, 3 };
     Console.WriteLine(numbers.Length); // Output: 3
     ```

2. **`Rank`**
   - **Purpose**: Gets the number of dimensions of the array.
   - **Example**:
     ```csharp
     int[,] matrix = new int[3, 4];
     Console.WriteLine(matrix.Rank); // Output: 2
     ```

---

### **Key Notes**

- Arrays in C# are **fixed-size**. If you need a dynamic collection, consider using `List<T>`.
- The `Array` class methods are **static** and operate directly on the array.
