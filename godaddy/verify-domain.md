### How to Verify DNS Propagation

Once you have updated your custom nameservers, you can verify the DNS propagation using these tools:

---

#### **Method 1: Using Google’s Dig Tool**

1. Open your web browser and search for **Google Dig Tool** or visit [Google Admin Toolbox Dig](https://toolbox.googleapps.com/apps/dig/).
2. Enter your domain name (e.g., `yourdomain.com`) in the search bar.
3. From the **Query Type** dropdown, select **NS** (to check for nameservers).
4. Click **Dig** to perform the query.
5. The results will show the nameservers currently propagating. Ensure they match your custom nameservers (e.g., `ns1.yourdomain.com`, `ns2.yourdomain.com`).

---

#### **Method 2: Using DNS Checker Tool**

1. Visit [DNS Checker](https://dnschecker.org/#NS/yourdomain.com).
2. Replace `yourdomain.com` in the URL with your actual domain name (e.g., `yourdomain.com`).
3. The page will automatically run a nameserver query and display results from multiple global locations.
4. Look for the custom nameservers (e.g., `ns1.yourdomain.com`, `ns2.yourdomain.com`) in the results.
5. If the nameservers appear consistently across multiple locations, the propagation is complete.

---

### **Additional Notes**

- DNS propagation typically takes **24–48 hours** to fully update worldwide, though some changes may appear sooner.
- If you still see old nameservers after this period, try clearing your DNS cache (in cmd C:\Users\yourusername>ipconfig /flushdns) or check with your hosting provider for assistance.
