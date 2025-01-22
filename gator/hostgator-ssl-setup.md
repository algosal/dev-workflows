## Enabling SSL in HostGator WHM

1. **Log in to WHM**:

   - Access your WHM (Web Host Manager) control panel using your root credentials.

2. **Navigate to AutoSSL**:

   - In the left-hand search bar, type **SSL**.
   - From the options that appear, select **Manage AutoSSL** under **SSL/TLS**.

3. **Enable AutoSSL**:

   - On the **Manage AutoSSL** page, ensure that AutoSSL is enabled for your accounts.
   - Choose the **Provider** (typically, cPanel Default or Let’s Encrypt).
   - Save your changes if necessary.

4. **Run AutoSSL**:
   - If needed, click the **Run AutoSSL** button to issue SSL certificates for the domains on your server.

---

### **Important Note**

Always ensure that **AutoSSL is enabled** in WHM under **SSL/TLS → Manage AutoSSL**. This feature provides free SSL certificates and ensures a baseline level of security for all your hosted websites.

---
