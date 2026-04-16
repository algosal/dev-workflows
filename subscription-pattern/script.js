/******************************************************
 🧠 SUBSCRIPTION PATTERN DEMO (PURE JAVASCRIPT)
 ******************************************************/

/**
 * Publisher = the "brain" that sends updates
 */
class Publisher {
  constructor() {
    // stores all subscriber functions
    this.subscribers = [];
  }

  /**
   * STEP 1: subscribe
   * A function is registered here and saved
   */
  subscribe(callback) {
    this.subscribers.push(callback);

    console.log("🔔 New subscriber added!");

    // optional unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  /**
   * STEP 2: notify
   * Sends data to ALL subscribers
   */
  notify(data) {
    console.log("📤 Publishing:", data);

    this.subscribers.forEach((callback) => {
      callback(data); // send data to subscriber
    });
  }
}

/******************************************************
 🔧 CREATE PUBLISHER INSTANCE
 ******************************************************/
const publisher = new Publisher();

/******************************************************
 👥 SUBSCRIBERS (listeners)
 ******************************************************/

// Subscriber 1 → updates UI
publisher.subscribe((data) => {
  document.getElementById("output").innerText = data;
});

// Subscriber 2 → logs in console
publisher.subscribe((data) => {
  console.log("👀 Subscriber B saw:", data);
});

// Subscriber 3 → logs in console
publisher.subscribe((data) => {
  console.log("👀 Subscriber C saw:", data);
});

/******************************************************
 📡 SIMULATED DATA STREAM
 ******************************************************/
let count = 0;

setInterval(() => {
  count++;

  // STEP 3: notify subscribers
  publisher.notify(
    `⚡ Live Update #${count} at ${new Date().toLocaleTimeString()}`,
  );
}, 2000);
