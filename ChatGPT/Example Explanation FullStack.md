# 🚀 VaultDesk Full-Stack CRUD Blueprint (Reusable System)

This document explains the COMPLETE reusable architecture for building a brand-new VaultDesk component from scratch. 🏗️🔥

---

# 🎯 What This Covers

✅ DynamoDB
✅ Lambda CRUD APIs
✅ API Gateway
✅ CORS
✅ Authorizers
✅ IAM Permissions
✅ React Frontend Pages
✅ Deployment
✅ Reusable Prompt Engineering

---

# 🧠 Goal

> Give this document to ANY new ChatGPT conversation and instantly build a new VaultDesk module from frontend → backend ⚡

---

# 🏗️ OVERALL ARCHITECTURE

```txt
⚛️ React Frontend
        ↓
🌐 API Gateway (REST API)
        ↓
⚡ Lambda Functions
        ↓
🗄️ DynamoDB Table
```

---

# 🗂️ STANDARD VAULTDESK CRUD PATTERN

Every VaultDesk module follows the SAME reusable architecture 🔥

---

## 📦 Example Modules

| 🧩 Module      | 🗄️ Table               |
| -------------- | ---------------------- |
| Businesses     | VaultDeskBusinesses    |
| Business Ideas | VaultDeskBusinessIdeas |
| Milestones     | VaultDeskMilestones    |
| Tasks          | VaultDeskTasks         |
| Assets         | VaultDeskAssets        |

---

# 🔑 REQUIRED VALUES BEFORE STARTING

⚠️ The new chat MUST STOP and ask for these values FIRST.

---

# 1️⃣ AWS Profile Name

```txt
salman-personal
```

---

## 🧠 What is this?

Your AWS CLI profile on your Mac 💻

---

## ❓ Why do we need it?

AWS CLI uses this profile to know:

✅ which AWS account to use
✅ which credentials to use
✅ which permissions to use

---

## ⚠️ Without it

❌ AWS commands fail

---

# 2️⃣ AWS Region

```txt
us-west-1
```

---

## 🧠 What is this?

Your AWS datacenter region 🌎

---

## ❓ Why do we need it?

All resources live INSIDE a region:

✅ Lambda
✅ DynamoDB
✅ API Gateway
✅ CloudWatch Logs

---

## ⚠️ Important

Every command MUST use the SAME region 🚨

---

# 3️⃣ AWS Account ID

```txt
311653202579
```

---

## 🧠 What is this?

Your AWS account number 🔢

---

## ❓ Why do we need it?

Used in:

✅ IAM policies
✅ Lambda permissions
✅ API Gateway permissions
✅ ARNs

---

# 4️⃣ REST API ID

```txt
pwefadg62j
```

---

## 🧠 What is this?

Your API Gateway REST API 🌐

---

## ❓ Why do we need it?

Every endpoint belongs INSIDE this API.

---

## 📍 Example

```txt
https://pwefadg62j.execute-api.us-west-1.amazonaws.com/S1/Milestones
```

---

# 5️⃣ Root Resource ID

```txt
bqzb600phi
```

---

## 🧠 What is this?

The root `/` folder of API Gateway 📁

---

## ❓ Why do we need it?

Every endpoint gets created UNDER this root.

---

## 📍 Examples

```txt
/Milestones
/BusinessIdeas
/Tasks
```

---

# 6️⃣ API Gateway Authorizer ID

```txt
y1d5g1
```

---

## 🧠 What is this?

Your JWT authorizer 🔐

---

## ❓ Why do we need it?

Protects APIs from unauthorized access.

---

## 🚫 Without it

❌ Anyone can hit your APIs

---

## ✅ With it

✅ Only authenticated users can access data

---

# 7️⃣ API Stage Name

```txt
S1
```

---

## 🧠 What is this?

Deployment environment 🚀

---

## ❓ Why do we need it?

API Gateway ONLY works after deployment.

---

## 📍 Example

```txt
https://api-id.execute-api.region.amazonaws.com/S1/Resource
```

---

# 8️⃣ Lambda Role ARN

```txt
arn:aws:iam::311653202579:role/VaultDesk-Business-Ideas-role
```

---

## 🧠 What is this?

IAM role used by Lambda ⚡

---

## ❓ Why do we need it?

Gives Lambda permission to:

✅ Read DynamoDB
✅ Write DynamoDB
✅ Update items
✅ Query items

---

## 🚫 Without permissions

```txt
AccessDeniedException
```

❌

---

# 🗄️ DYNAMODB TABLE CREATION

---

# 🧱 Standard Schema

Every VaultDesk table uses:

| 🔑 Key  | 🧬 Type |
| ------- | ------- |
| ownerId | HASH    |
| epoch   | RANGE   |

---

# 🚀 Create Table Command

```bash
aws dynamodb create-table \
  --table-name <TABLE_NAME> \
  --attribute-definitions \
    AttributeName=ownerId,AttributeType=S \
    AttributeName=epoch,AttributeType=S \
  --key-schema \
    AttributeName=ownerId,KeyType=HASH \
    AttributeName=epoch,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

---

# 🧠 LINE-BY-LINE EXPLANATION

---

# ⚡ `aws dynamodb create-table`

## 🧠 Meaning

Tells AWS:

> Create a brand new DynamoDB table 🗄️

---

# 🏷️ `--table-name <TABLE_NAME>`

## 🧠 Meaning

Actual table name.

---

## 📍 Example

```txt
VaultDeskMilestones
```

---

## ❓ Why important?

Lambda uses THIS exact name.

---

# 🧬 `--attribute-definitions`

## 🧠 Meaning

Defines data types for keys.

---

# 👤 `ownerId`

```txt
ownerId = string
```

---

## ❓ Why?

Each user owns their own records 🔐

---

# 🕒 `epoch`

```txt
epoch = string timestamp
```

---

## ❓ Why?

✅ sorting
✅ uniqueness
✅ creation order

---

# 🔑 `--key-schema`

Defines primary keys 🔐

---

# 👤 `ownerId HASH`

## 🧠 Meaning

Partition key.

---

## ❓ Why?

Groups all records for one user.

---

# 🕒 `epoch RANGE`

## 🧠 Meaning

Sort key.

---

## ❓ Why?

Lets records be ordered by creation time.

---

# 💸 `PAY_PER_REQUEST`

## 🧠 Meaning

AWS auto-scales billing 📈

---

## ❓ Why?

✅ No capacity management
✅ Startup-friendly
✅ Simple scaling

---

# ⚡ LAMBDA ARCHITECTURE

---

# 🧩 STANDARD LAMBDA SETUP

We use:

| ⚡ Lambda | 🎯 Purpose |
| --------- | ---------- |
| Create    | POST       |
| List      | GET        |
| Update    | PUT        |

---

## 📍 Example

```txt
VaultDesk-Create-Milestone
VaultDesk-List-Milestones
VaultDesk-Update-Milestone
```

---

# 🧠 WHY 3 LAMBDAS?

✅ Cleaner debugging
✅ Easier CloudWatch logs
✅ Easier permissions
✅ Easier future scaling

---

# 🧠 WHY ONE SHARED CODE FILE?

Still use ONE shared:

```txt
lambda_function.py
```

because:

✅ Faster development
✅ Easier maintenance
✅ Shared helper functions

---

# 📦 REQUIRED ITEM FIELDS

Every record should contain:

```python
ownerId
epoch
resourceId
createdAt
updatedAt
isDeleted
```

---

# 🧠 FIELD EXPLANATIONS

---

# 👤 `ownerId`

Logged-in user ID 🔐

Used for user isolation.

---

# 🕒 `epoch`

Timestamp.

---

## 📍 Example

```txt
1778098744885
```

---

## ❓ Why?

✅ sorting
✅ uniqueness

---

# 🆔 `resourceId`

Human-friendly unique ID.

---

## 📍 Example

```txt
MILESTONE_abc123
```

---

# 📅 `createdAt`

ISO timestamp.

---

## 📍 Example

```txt
2026-05-06T20:15:25Z
```

---

# 🔄 `updatedAt`

Last update timestamp.

---

# 🗑️ `isDeleted`

Soft delete flag 🚨

---

## ❓ Why?

Avoid permanent deletion.

---

# 🧠 SOFT DELETE ARCHITECTURE

Instead of:

```txt
DELETE item from DynamoDB
```

We do:

```python
isDeleted = True
```

---

# ✅ BENEFITS

✅ Safer
✅ Recoverable
✅ Easier audits
✅ Easier debugging
✅ Prevents accidental data loss

---

# 🌐 API GATEWAY ARCHITECTURE

---

# 🧱 STANDARD ENDPOINTS

| 🌐 Method | 🎯 Purpose                      |
| --------- | ------------------------------- |
| GET       | List records                    |
| POST      | Create record                   |
| PUT       | Update / Complete / Soft Delete |
| OPTIONS   | CORS preflight                  |

---

# 🧠 WHY OPTIONS EXISTS

Browsers send:

```txt
OPTIONS request
```

BEFORE:

```txt
POST
PUT
DELETE
```

This is called:

# 🌍 CORS PREFLIGHT

---

## 🚫 Without OPTIONS

❌ Browser blocks API

---

# 🔥 CORS REQUIREMENTS

CORS must exist in TWO places ⚠️

---

# 1️⃣ LAMBDA CORS

Every Lambda response MUST include:

```python
"headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,x-vaultdesk-token,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
}
```

---

# 🧠 WHY?

Browser validates these headers.

Without them:

❌ Frontend cannot access backend

---

# 2️⃣ API GATEWAY CORS

API Gateway ALSO needs:

✅ OPTIONS method
✅ MOCK integration
✅ method response
✅ integration response

---

# 🧠 WHY BOTH?

Because flow is:

```txt
🌐 Browser
   ↓
🚪 API Gateway
   ↓
⚡ Lambda
```

Both layers MUST allow CORS.

---

# 🔐 AUTHORIZATION ARCHITECTURE

---

# 🧠 CUSTOM AUTHORIZER

GET/POST/PUT use:

```txt
CUSTOM authorization
```

with:

```txt
Authorizer ID
```

---

# 🧠 WHY?

JWT token gets validated 🔐

Then user info becomes available:

```python
owner_id = event["requestContext"]["authorizer"]["userId"]
```

---

# 🚫 Without this

❌ Anyone could access another user’s data

---

# 🔐 IAM PERMISSIONS

---

# 🧠 WHY IAM EXISTS

Lambda CANNOT touch DynamoDB unless allowed 🚨

AWS security model:

```txt
DENY BY DEFAULT
```

---

# ✅ REQUIRED DYNAMODB ACTIONS

```txt
dynamodb:PutItem
dynamodb:GetItem
dynamodb:UpdateItem
dynamodb:Query
```

---

# 🧠 WHAT EACH DOES

| ⚙️ Action  | 🎯 Purpose    |
| ---------- | ------------- |
| PutItem    | create        |
| GetItem    | single record |
| UpdateItem | modify        |
| Query      | list records  |

---

# ⚛️ FRONTEND ARCHITECTURE

---

# 📁 LOCATION

```txt
src/pages/<PageName>.jsx
```

---

## 📍 Example

```txt
src/pages/MilestonesPage.jsx
```

---

# 🔐 TOKEN USAGE

✅ Use:

```js
const token = useSelector((state) => state.auth.token);
```

---

# 🚫 DO NOT USE

```js
localStorage.getItem("vaultdesk_token");
```

---

# 🧠 WHY?

VaultDesk auth already lives in Redux.

Redux is:

✅ centralized
✅ reactive
✅ cleaner

---

# 🧱 REQUIRED FRONTEND FEATURES

Every page should support:

✅ Create
✅ Edit
✅ Complete
✅ Soft Delete
✅ Toggle completed/open
✅ Responsive UI
✅ Validation
✅ Category dropdown
✅ Custom category support

---

# 🧠 CATEGORY DROPDOWN PATTERN

Use:

```txt
<select>
```

---

## 📍 Example Categories

```txt
Development
Marketing
Finance
Operations
Other
```

---

# 🧠 WHY CUSTOM CATEGORY?

Business needs evolve 📈

Users should still be able to type:

```txt
AI Research
Expansion
Legal
```

---

# 🧠 COMPLETE TOGGLE PATTERN

Use:

```txt
Show All
Show Open Only
```

---

## ❓ Why?

Helps reduce clutter 🧹

Open work stays visible.

---

# 🧪 TESTING FLOW

---

# ✅ BACKEND TESTING

Test:

```txt
POST
GET
PUT
OPTIONS
```

---

# ✅ FRONTEND TESTING

Verify:

✅ CORS works
✅ JWT works
✅ Data saves
✅ Data updates
✅ Complete works
✅ Soft delete works
✅ Open-only toggle works

---

# 🚨 MOST COMMON ERRORS

---

# ❌ AccessDeniedException

## 📍 Cause

IAM policy missing.

---

## 🔧 Fix

Add DynamoDB permissions.

---

# ❌ CORS Error

## 📍 Cause

OPTIONS missing OR Lambda headers missing.

---

## 🔧 Fix

Configure BOTH.

---

# ❌ 405 Method Not Allowed

## 📍 Cause

Method exists but integration missing.

---

## 🔧 Fix

Add integration.

---

# ❌ Float Types Not Supported

## 📍 Cause

DynamoDB rejects Python float.

---

## 🔧 Fix

Convert to Decimal.

---

# 🤖 MASTER REUSABLE PROMPT

⚠️ MOST IMPORTANT SECTION ⚠️

Paste this into ANY new chat 🚀

```txt
🚀 I want you to build a full-stack VaultDesk component from scratch.

🛑 IMPORTANT:
Before writing code, STOP and ask me for these values:

1️⃣ AWS profile name
2️⃣ AWS region
3️⃣ AWS account ID
4️⃣ REST API ID
5️⃣ API root resource ID
6️⃣ API Gateway authorizer ID
7️⃣ API stage name
8️⃣ Lambda execution role ARN
9️⃣ New resource name plural
🔟 New resource name singular
1️⃣1️⃣ DynamoDB table name
1️⃣2️⃣ Frontend route
1️⃣3️⃣ Frontend page name
1️⃣4️⃣ Fields I want in the table/form

✅ After I give you those values, generate EVERYTHING in this exact order:

1. DynamoDB create-table command
2. IAM policy JSON + put-role-policy command
3. Full Python Lambda code
4. Zip command
5. Create/update 3 Lambda functions
6. API Gateway create-resource command
7. GET method + AWS_PROXY integration
8. POST method + AWS_PROXY integration
9. PUT method + AWS_PROXY integration
10. OPTIONS method with MOCK integration
11. OPTIONS method response + integration response
12. Lambda add-permission commands
13. API deployment command
14. Full React frontend page
15. Router import + route line
16. AppLayout sidebar nav item

🔥 Backend Rules:
- ownerId HASH key
- epoch RANGE key
- soft delete only
- filter out deleted records
- PUT handles update/complete/delete

⚡ Lambda Rules:
- python3.14
- Decimal conversion
- full CORS headers
- authorizer userId

🌐 API Gateway Rules:
- REST API v1
- CUSTOM authorizer
- MOCK OPTIONS
- AWS_PROXY integrations

⚛️ Frontend Rules:
- React + Vite
- Redux token
- Create/Edit/Delete/Complete
- Validation
- Toggle completed/open
- Category dropdown + custom category

✅ Give FULL copy-paste-ready files
❌ Do NOT over-explain
```

---

# 🏁 FINAL RESULT

Using this architecture you can rapidly create:

✅ Tasks
✅ Projects
✅ Leads
✅ Notes
✅ Goals
✅ Assets
✅ Employees
✅ Vendors
✅ Contracts
✅ Inventory
✅ CRM
✅ Tickets
✅ Roadmaps

---

# 🔥 WITH:

✅ Full backend
✅ Full frontend
✅ Authentication
✅ API Gateway
✅ DynamoDB
✅ Lambda
✅ CORS
✅ Deployment

---

# ⚡ In Minutes.
