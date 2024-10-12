// Importing the function from module2.js
import { greet } from "./module2.js";

// Using the imported function
const name = "Armando";
const message = greet(name);

// Displaying the message on the page
document.getElementById("output").innerText = message;
