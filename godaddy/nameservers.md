## Updating Nameservers in GoDaddy for a VPS Hosting in Hostgator

### DNS Records Section

#### Step 1: Update the A Records

1. Log in to your GoDaddy account and navigate to **Domain Manager** or **DNS Settings** for your domain.
2. Locate the **A Records** section.
3. Add or update an A Record with the following details:
   - **Name**: `@`
   - **Value**: Enter the IPv4 address of your VPS. The IP address should follow the format `xxx.xxx.xxx.xxx` (e.g., `192.168.1.1`).

---

#### Step 2: Add Custom NS Records

1. In the **DNS Settings**, locate the **NS (Nameservers)** section.
2. Add custom NS records with the following details:
   - **Name**: Leave this field blank or use `@`.
   - **Value**: Use nameservers that follow this format:
     - `ns1.server-612685.yourdomain.com`
     - `ns2.server-612685.yourdomain.com`  
       Replace `yourdomain.com` with your actual domain name.
3. Save your changes.

---

### Hostname Section

#### Step 3: Update Hostnames and IP Addresses

1. If your setup requires hostnames, ensure you add them to the **DNS Settings**:
   - **Name**: Use a hostname like `server-612685`.
   - **Value**: Provide the associated IPv4 address (e.g., `xxx.xxx.xxx.xxx`).

---

### Nameservers Section

#### Step 4: Set Nameservers

1. If you prefer GoDaddy’s default nameservers:
   - Ensure the nameservers are set to "Default GoDaddy Nameservers" in the **Nameservers** section.
2. To use custom nameservers:
   - Select **Custom Nameservers** and input the ones following the specified format:
     - `ns1.server-612685.yourdomain.com`
     - `ns2.server-612685.yourdomain.com`
   - Save your changes.

---

### Verification

#### Step 5: Verify and Wait

1. After completing the updates, use a DNS lookup tool to verify that your settings are correctly applied.
2. Remember, DNS propagation can take up to 24–48 hours to take effect globally.

---

### **Important Warning**

You must follow these steps in the exact order provided. If you change the custom nameservers **before** adding the A Records or Hostname entries, GoDaddy will not allow you to update the A Records, and you may encounter configuration issues. Ensure each step is completed sequentially to avoid any problems.

---
