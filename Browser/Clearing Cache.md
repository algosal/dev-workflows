## Clearing Browser Cache

To manually clear the cache, you can follow these steps based on where the cache is stored:

### 1. **Browser Cache**

- **Chrome**:

  - Open DevTools (press `F12` or right-click and select "Inspect").
  - Go to the **Network** tab.
  - Check **"Disable cache"** to temporarily prevent caching while DevTools is open.
  - Alternatively, press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) to do a **hard refresh** and clear cache for that page.

- **Clear All Browser Cache**:
  - Open **Settings** > **Privacy and security** > **Clear browsing data**.
  - Select **Cached images and files** and choose the desired time range, then click **Clear data**.

### 2. **Express Server Cache**

- If using `express.static` to serve static files, add `Cache-Control` headers to prevent caching:
  ```javascript
  app.use(express.static("public", { cacheControl: false }));
  ```
- You can also manually set headers to disable caching on specific routes:
  ```javascript
  app.get("/route", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.send("Content with no cache");
  });
  ```

### 3. **Clear Cache in Service Workers**

- If your app uses a service worker, you’ll need to update the service worker and reload it to ensure new content is fetched.
- Open **DevTools** > **Application** > **Service Workers** and check **"Update on reload"** or unregister the service worker to clear its cache.

### 4. **Command Line (for Server Cache)**

- In development environments, you might use a command like `pm2 restart` (for apps managed by PM2) to reset server-side caches if the server has built-in caching. This is for Nodejs.
