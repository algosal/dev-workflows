import Store from "./store.js";
import { counterReducer } from "./reducer.js";

/**
 🧠 Create Redux-like store
 */
const store = new Store(counterReducer, { count: 0 });

/**
 👥 Subscriber → UI updater
 */
store.subscribe((state) => {
  document.getElementById("count").innerText = state.count;
});

/**
 🔘 Button actions → dispatch actions
 */
document.getElementById("inc").addEventListener("click", () => {
  store.dispatch({ type: "INCREMENT" });
});

document.getElementById("dec").addEventListener("click", () => {
  store.dispatch({ type: "DECREMENT" });
});
