# 🧠 AWS Profiles Setup — What We Just Did

## 🎯 Goal

Connect your Mac to **multiple AWS accounts safely** using CLI.

---

# 🔑 1. Create IAM Admin User (per account)

In AWS Console:

```text
IAM → Users → Create user → cli-admin
```

Permissions:

```text
AdministratorAccess
```

Then:

```text
Security Credentials → Create Access Key (CLI)
```

👉 This gives:

```text
Access Key
Secret Key
```

---

# 🖥️ 2. Create CLI Profiles

On your Mac:

```bash
aws configure --profile <name>
```

Example:

```bash
aws configure --profile pauls-personal
aws configure --profile albagoldsystems
aws configure --profile alba-gold
```

Enter:

```text
Access Key
Secret Key
Region: us-east-2
Output: json
```

---

# 🔍 3. Test Profiles

```bash
aws sts get-caller-identity --profile <name>
```

👉 This confirms:

- which account you are connected to
- no mistakes in credentials

---

# 📋 4. List Profiles

```bash
aws configure list-profiles
```

---

# ✏️ 5. Rename / Fix Profiles

AWS has no rename command.

So we:

- copy credentials to new profile
- optionally delete old one

---

# 🧹 6. Clean Profiles Manually

Profiles are stored in files:

```bash
~/.aws/credentials
~/.aws/config
```

Edit with:

```bash
nano ~/.aws/credentials
nano ~/.aws/config
```

Delete unwanted profile blocks:

```ini
[personal]
...
```

---

# 🧠 Mental Model

```text
IAM User = identity inside AWS
Access Key = password for CLI
Profile = local name pointing to that account
```

---

# 🧭 Final Mapping

```text
pauls-personal   → Cloud A
albagoldsystems  → Cloud B
alba-gold        → Cloud C
```

---

# 💎 One-line summary

> Profiles let your machine talk to multiple AWS accounts without mixing credentials.
