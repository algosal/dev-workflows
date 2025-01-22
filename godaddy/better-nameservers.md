Here are the detailed steps to add custom nameservers in GoDaddy:

---

### Steps to Add Custom Nameservers in GoDaddy

#### **Step 1: Log in to Your GoDaddy Account**

1. Visit [GoDaddy's website](https://www.godaddy.com) and log in with your credentials.
2. Navigate to the **Domain Manager** or **My Products** section.

---

#### **Step 2: Select Your Domain**

1. From the list of domains, click on the domain for which you want to add custom nameservers.
2. Go to the **DNS Management** or **Domain Settings** page.

---

#### **Step 3: Register Custom Nameservers**

1. Scroll down to the section called **Host Names** or **Advanced Options** (this is sometimes under DNS Settings).
2. Click on the option to **Add Host Names** or **Register Nameservers**.
3. Add the custom nameservers:
   - For **Host**: Enter the subdomain (e.g., `ns1` or `ns2`).
   - For **IP Address**: Enter the corresponding IPv4 address for the custom nameserver (e.g., `123.45.67.89`).
4. Save the settings after registering each nameserver.

---

#### **Step 4: Set Custom Nameservers**

1. Go back to the **Nameservers** section in the DNS Management page.
2. Select **Custom Nameservers**.
3. Enter the registered custom nameservers in this format:
   - `ns1.yourdomain.com`
   - `ns2.yourdomain.com`
4. Save the changes.

---

#### **Step 5: Verify DNS Propagation**

1. Once the nameservers are updated, use a DNS lookup tool to verify that the changes have propagated globally.
2. DNS propagation can take up to 24–48 hours to complete.

---

### **Important Notes**

- **Custom nameservers must be registered with the correct IP address** before adding them to the Nameservers section. If they are not registered, GoDaddy will display an error saying, “This nameserver isn’t registered.”
- If you face issues, clear your browser cache or try a different browser.
- Contact GoDaddy support for further assistance if the nameservers are not saving or if the IP address needs to be validated.
