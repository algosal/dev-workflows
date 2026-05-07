# 🚀 VaultDesk Full-Stack CRUD Blueprint (Reusable System)

This document explains the COMPLETE reusable architecture for building a new VaultDesk component from scratch.

It covers:

✅ DynamoDB
✅ Lambda CRUD APIs
✅ API Gateway
✅ CORS
✅ Authorizers
✅ IAM Permissions
✅ Frontend React Pages
✅ Deployment
✅ Reusable Prompt Engineering

The goal is:

> Give this document to ANY new ChatGPT conversation and instantly build a new VaultDesk module from frontend to backend.

---

# 🧠 OVERALL ARCHITECTURE

```txt
React Frontend
      ↓
API Gateway (REST API)
      ↓
Lambda Functions
      ↓
DynamoDB Table
```

---

# 🗂️ STANDARD VAULTDESK CRUD PATTERN

Every VaultDesk module follows the SAME architecture.

Examples:

| Module         | Table                  |
| -------------- | ---------------------- |
| Businesses     | VaultDeskBusinesses    |
| Business Ideas | VaultDeskBusinessIdeas |
| Milestones     | VaultDeskMilestones    |
| Tasks          | VaultDeskTasks         |
| Assets         | VaultDeskAssets        |

---

# 🔑 REQUIRED VALUES BEFORE STARTING

The new chat MUST stop and ask for these values FIRST.

---

## 1️⃣ AWS Profile Name

```txt
salman-personal
```

### 🧠 What is this?

This is the AWS CLI profile on your Mac.

### ❓ Why do we need it?

AWS CLI uses this profile to know:

- which AWS account to use
- which credentials to use
- which permissions to use

### ⚠️ Without it:

AWS commands fail.

---

## 2️⃣ AWS Region

```txt
us-west-1
```

### 🧠 What is this?

This is the AWS datacenter region.

### ❓ Why do we need it?

All resources live INSIDE a region:

- Lambda
- DynamoDB
- API Gateway
- Logs

### ⚠️ Important:

Every command MUST use the same region.

---

## 3️⃣ AWS Account ID

```txt
311653202579
```

### 🧠 What is this?

Your AWS account number.

### ❓ Why do we need it?

Used in:

- IAM policies
- Lambda permissions
- API Gateway invoke permissions
- ARNs

---

## 4️⃣ REST API ID

```txt
pwefadg62j
```

### 🧠 What is this?

This is your API Gateway REST API.

### ❓ Why do we need it?

Every endpoint belongs INSIDE this API.

Example:

```txt
https://pwefadg62j.execute-api.us-west-1.amazonaws.com/S1/Milestones
```

---

## 5️⃣ Root Resource ID

```txt
bqzb600phi
```

### 🧠 What is this?

The root folder `/` of API Gateway.

### ❓ Why do we need it?

Every new endpoint is created UNDER this root.

Example:

```txt
/Milestones
/BusinessIdeas
/Tasks
```

---

## 6️⃣ API Gateway Authorizer ID

```txt
y1d5g1
```

### 🧠 What is this?

The JWT authorizer.

### ❓ Why do we need it?

Protects endpoints.

Without it:

❌ Anyone can call your APIs.

With it:

✅ Only logged-in users can access data.

---

## 7️⃣ API Stage Name

```txt
S1
```

### 🧠 What is this?

Deployment environment.

### ❓ Why do we need it?

API Gateway only works AFTER deployment.

Example:

```txt
https://api-id.execute-api.region.amazonaws.com/S1/Resource
```

---

## 8️⃣ Lambda Role ARN

```txt
arn:aws:iam::311653202579:role/VaultDesk-Business-Ideas-role
```

### 🧠 What is this?

IAM role used by Lambda.

### ❓ Why do we need it?

This role gives Lambda permission to:

✅ Read DynamoDB
✅ Write DynamoDB
✅ Update items
✅ Query items

Without permissions:

❌ AccessDeniedException

---

# 🗄️ DYNAMODB TABLE CREATION

---

## 🧱 Standard Schema

Every VaultDesk table uses:

| Key     | Type  |
| ------- | ----- |
| ownerId | HASH  |
| epoch   | RANGE |

---

## 🚀 Create Table Command

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

## `aws dynamodb create-table`

### 🧠 What is this?

Tells AWS:

> Create a brand new DynamoDB table.

---

## `--table-name <TABLE_NAME>`

### 🧠 What is this?

The actual table name.

Example:

```txt
VaultDeskMilestones
```

### ❓ Why important?

Lambda uses this exact name.

---

## `--attribute-definitions`

### 🧠 What is this?

Defines data types for keys.

---

## `AttributeName=ownerId,AttributeType=S`

### 🧠 Meaning:

```txt
ownerId = string
```

### ❓ Why?

Each user owns their own records.

---

## `AttributeName=epoch,AttributeType=S`

### 🧠 Meaning:

```txt
epoch = string timestamp
```

### ❓ Why?

Used for sorting.

Also guarantees uniqueness.

---

## `--key-schema`

### 🧠 What is this?

Defines primary keys.

---

## `ownerId HASH`

### 🧠 Meaning:

Partition key.

### ❓ Why?

Groups all records for one user.

---

## `epoch RANGE`

### 🧠 Meaning:

Sort key.

### ❓ Why?

Lets us order records by creation time.

---

## `PAY_PER_REQUEST`

### 🧠 Meaning:

AWS auto-scales billing.

### ❓ Why?

No need to manage read/write capacity.

Best for startup apps.

---

# ⚡ LAMBDA ARCHITECTURE

---

# 🧩 STANDARD LAMBDA SETUP

We use:

| Lambda | Purpose |
| ------ | ------- |
| Create | POST    |
| List   | GET     |
| Update | PUT     |

Example:

```txt
VaultDesk-Create-Milestone
VaultDesk-List-Milestones
VaultDesk-Update-Milestone
```

---

# 🧠 WHY 3 LAMBDAS?

### ✅ Cleaner debugging

Each Lambda has one responsibility.

### ✅ Easier CloudWatch logs

### ✅ Easier permissions

### ✅ Easier scaling later

---

# 🧠 WHY ONE SHARED CODE FILE?

We still use ONE shared:

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

# 🧠 WHAT EACH FIELD MEANS

---

## `ownerId`

### 🧠 What is this?

The logged-in user.

### ❓ Why?

Used for user data isolation.

---

## `epoch`

### 🧠 What is this?

Timestamp.

Example:

```txt
1778098744885
```

### ❓ Why?

Used for sorting + uniqueness.

---

## `resourceId`

### 🧠 What is this?

Human-friendly unique ID.

Example:

```txt
MILESTONE_abc123
```

---

## `createdAt`

### 🧠 What is this?

ISO timestamp.

Example:

```txt
2026-05-06T20:15:25Z
```

---

## `updatedAt`

### 🧠 What is this?

Last update time.

---

## `isDeleted`

### 🧠 What is this?

Soft delete flag.

### ❓ Why?

Instead of deleting data permanently.

---

# 🧠 SOFT DELETE ARCHITECTURE

---

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

| Method  | Purpose                         |
| ------- | ------------------------------- |
| GET     | List records                    |
| POST    | Create record                   |
| PUT     | Update / Complete / Soft Delete |
| OPTIONS | CORS preflight                  |

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

Without OPTIONS:

❌ Browser blocks API.

---

# 🔥 CORS REQUIREMENTS

CORS must exist in TWO places.

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

Browser checks these headers.

Without them:

❌ Frontend cannot access backend.

---

# 2️⃣ API GATEWAY CORS

API Gateway ALSO needs:

✅ OPTIONS method
✅ MOCK integration
✅ method response
✅ integration response

---

# 🧠 WHY BOTH?

Because:

```txt
Browser → API Gateway → Lambda
```

Both layers must allow CORS.

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

JWT token gets validated.

Then user info becomes available:

```python
owner_id = event["requestContext"]["authorizer"]["userId"]
```

---

# 🧠 WHY IMPORTANT?

Without this:

❌ Anyone could access other users’ data.

---

# 🔐 IAM PERMISSIONS

---

# 🧠 WHY IAM EXISTS

Lambda CANNOT touch DynamoDB unless allowed.

AWS security is:

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

| Action     | Purpose       |
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

Example:

```txt
src/pages/MilestonesPage.jsx
```

---

# 🧠 TOKEN USAGE

Use:

```js
const token = useSelector((state) => state.auth.token);
```

---

# ❌ DO NOT USE

```js
localStorage.getItem("vaultdesk_token");
```

---

# 🧠 WHY?

VaultDesk auth state already lives in Redux.

Redux is:

✅ Cleaner
✅ Centralized
✅ Reactive

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

with options like:

```txt
Development
Marketing
Finance
Operations
Other
```

---

# 🧠 WHY CUSTOM CATEGORY?

Business needs evolve.

Users should still be able to type:

```txt
AI Research
Expansion
Legal
```

if not in dropdown.

---

# 🧠 COMPLETE TOGGLE PATTERN

Use:

```txt
Show All
Show Open Only
```

---

# 🧠 WHY?

Helps reduce clutter.

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

# 🧠 MOST COMMON ERRORS

---

# ❌ AccessDeniedException

### Cause:

IAM policy missing.

### Fix:

Add DynamoDB permissions.

---

# ❌ CORS error

### Cause:

OPTIONS missing OR Lambda headers missing.

### Fix:

Configure BOTH.

---

# ❌ 405 Method Not Allowed

### Cause:

Method exists but integration missing.

### Fix:

Add integration.

---

# ❌ Float types not supported

### Cause:

DynamoDB rejects Python float.

### Fix:

Convert to Decimal.

---

# 🤖 MASTER REUSABLE PROMPT

This is the MOST IMPORTANT section.

You can paste this into ANY new chat.

---

```txt
I want you to build a full-stack VaultDesk component from scratch.

IMPORTANT:
Before writing code, stop and ask me for these values:

1. AWS profile name
2. AWS region
3. AWS account ID
4. REST API ID
5. API root resource ID
6. API Gateway authorizer ID
7. API stage name
8. Lambda execution role ARN
9. New resource name plural, example: Milestones
10. New resource name singular, example: Milestone
11. DynamoDB table name
12. Frontend route, example: /milestones
13. Frontend page name, example: MilestonesPage.jsx
14. Fields I want in the table/form

After I give you those values, generate everything in this exact order:

1. DynamoDB create-table command.
2. IAM policy JSON and put-role-policy command.
3. Full Python Lambda code in one lambda_function.py.
4. Zip command.
5. Create or update 3 Lambda functions:
   - Create Lambda
   - List Lambda
   - Update Lambda
6. API Gateway create-resource command.
7. API Gateway GET method and AWS_PROXY integration.
8. API Gateway POST method and AWS_PROXY integration.
9. API Gateway PUT method and AWS_PROXY integration.
10. API Gateway OPTIONS method with MOCK integration for CORS.
11. Method response and integration response for OPTIONS CORS.
12. Lambda add-permission commands for GET, POST, and PUT.
13. API deployment command.
14. Full React frontend page.
15. Router import and route line.
16. AppLayout sidebar nav item.

Use this backend architecture:

- DynamoDB table has partition key ownerId string and sort key epoch string.
- Each item must include:
  - ownerId
  - epoch
  - resourceId
  - createdAt
  - updatedAt
  - isDeleted
- Use soft delete only.
- GET/List Lambda must filter out records where isDeleted === true.
- PUT must support update, complete, and soft delete.

Use this Lambda pattern:

- Runtime: python3.14
- Handler: lambda_function.lambda_handler
- Environment variable for table name
- event.requestContext.authorizer.userId is ownerId
- Convert floats to Decimal
- Return full CORS headers on every response

Use this API Gateway pattern:

- REST API v1
- CUSTOM authorizer
- OPTIONS with MOCK integration
- AWS_PROXY integrations
- Deploy to provided stage

Use this frontend pattern:

- React + Vite
- Inline styles
- Redux token
- Create/Edit/Delete/Complete
- Validation
- Toggle completed/open
- Category dropdown + custom category

Give full copy-paste-ready files.
Do not over-explain.
```

---

# 🏁 FINAL RESULT

Using this architecture you can now rapidly create:

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

with:

🔥 Full backend
🔥 Full frontend
🔥 Authentication
🔥 API Gateway
🔥 DynamoDB
🔥 Lambda
🔥 CORS
🔥 Deployment

in minutes.
