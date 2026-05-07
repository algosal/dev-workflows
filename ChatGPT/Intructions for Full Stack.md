# 🚀 1. Actual Steps Required

---

# 🧾 A. Ask for Required Values FIRST

⚠️ New chat MUST STOP and ask for:

```txt
1️⃣ AWS profile name
2️⃣ AWS region
3️⃣ REST API ID
4️⃣ API root resource ID
5️⃣ Authorizer ID
6️⃣ AWS account ID
7️⃣ Lambda execution role ARN
8️⃣ New resource name
   Example: Milestones
9️⃣ DynamoDB table name
   Example: VaultDeskMilestones
🔟 Frontend page name
   Example: MilestonesPage.jsx
1️⃣1️⃣ API stage name
   Example: S1
```

---

# 🗄️ B. Create DynamoDB Table

### ✅ Standard Pattern

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

# ⚙️ C. Create ONE Shared Lambda Codebase

### 📦 One `lambda_function.py` handles:

```txt
✅ GET      → list records
✅ POST     → create record
✅ PUT      → update / complete / soft delete
✅ OPTIONS  → CORS response
```

---

## 🧠 Use 3 Lambda Functions with SAME code

```txt
VaultDesk-Create-<ResourceSingular>
VaultDesk-List-<ResourcePlural>
VaultDesk-Update-<ResourceSingular>
```

### ✅ Example

```txt
VaultDesk-Create-Milestone
VaultDesk-List-Milestones
VaultDesk-Update-Milestone
```

---

# 🔐 D. IAM Permissions

### ➕ Add DynamoDB permissions to Lambda role

```bash
aws iam put-role-policy \
  --role-name <ROLE_NAME_ONLY_NOT_ARN> \
  --policy-name <RESOURCE_NAME>-DynamoDB-Policy \
  --policy-document file://policy.json \
  --profile <PROFILE_NAME>
```

---

## ✅ Required Actions

```txt
dynamodb:PutItem
dynamodb:GetItem
dynamodb:UpdateItem
dynamodb:Query
```

---

## 🎯 Resource ARN Format

```txt
arn:aws:dynamodb:<REGION>:<ACCOUNT_ID>:table/<TABLE_NAME>
```

---

# 🌐 E. API Gateway Resource Creation

```bash
aws apigateway create-resource \
  --rest-api-id <REST_API_ID> \
  --parent-id <ROOT_RESOURCE_ID> \
  --path-part <RESOURCE_PATH> \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

---

## 💾 Save Returned Value

```txt
resourceId
```

⚠️ You will use this for ALL methods.

---

# 🛠️ F. API Methods

## ✅ Required Methods

```txt
GET
POST
PUT
OPTIONS
```

---

## ❌ DELETE Preferred? NO

Preferred architecture:

```txt
✅ Soft delete through PUT
✅ isDeleted=true
```

---

# 🔌 G. API Integrations

## ✅ AWS_PROXY Integrations

```txt
GET   → List Lambda
POST  → Create Lambda
PUT   → Update Lambda
```

---

## 🌍 OPTIONS Uses

```txt
MOCK integration
```

---

# 🧱 H. CORS Requirements

---

# ✅ Lambda MUST Return Headers on EVERY Response

```python
"headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,x-vaultdesk-token,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
}
```

---

# ✅ API Gateway MUST Have OPTIONS

```txt
✅ OPTIONS method
✅ authorization NONE
✅ MOCK integration
✅ method response with CORS headers
✅ integration response with static CORS values
```

---

# 🔑 I. Lambda Permissions

## ✅ Add Permission for EACH Method

```bash
aws lambda add-permission \
  --function-name <LAMBDA_NAME> \
  --statement-id apigateway-<method>-<resource> \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:<REGION>:<ACCOUNT_ID>:<REST_API_ID>/*/<METHOD>/<RESOURCE_PATH>" \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

---

# 🚀 J. Deploy API

```bash
aws apigateway create-deployment \
  --rest-api-id <REST_API_ID> \
  --stage-name <STAGE_NAME> \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

---

# 🖥️ K. Frontend Requirements

## 📄 Create Page

```txt
src/pages/<PageName>.jsx
```

---

# 🔐 MUST Use Redux Token

✅ Correct:

```js
useSelector((state) => state.auth.token);
```

❌ WRONG:

```js
localStorage.getItem("vaultdesk_token");
```

Because VaultDesk auth uses Redux. 🧠

---

# ➕ Add Route

```jsx
<Route path="<route>" element={<PageName />} />
```

---

# 📚 Add Sidebar Link

```js
{ to: "/<route>", label: "<Label>" }
```

---

# 🚀 2. Exact Prompt for New ChatGPT

```txt
🚨 I want you to build a full-stack VaultDesk component from scratch.

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
   Example: Milestones
🔟 New resource name singular
   Example: Milestone
1️⃣1️⃣ DynamoDB table name
1️⃣2️⃣ Frontend route
   Example: /milestones
1️⃣3️⃣ Frontend page name
   Example: MilestonesPage.jsx
1️⃣4️⃣ Fields I want in the table/form

✅ After I give you those values, generate EVERYTHING in this exact order:

1. DynamoDB create-table command
2. IAM policy JSON + put-role-policy command
3. Full Python Lambda code in one lambda_function.py
4. Zip command
5. Create/update 3 Lambda functions
6. API Gateway create-resource command
7. GET method + AWS_PROXY integration
8. POST method + AWS_PROXY integration
9. PUT method + AWS_PROXY integration
10. OPTIONS method with MOCK integration
11. OPTIONS method response + integration response
12. lambda add-permission commands
13. API deployment command
14. Full React frontend page
15. Router import + route line
16. AppLayout sidebar nav item

🧱 Backend Architecture Rules:

✅ DynamoDB keys:
- ownerId (partition key)
- epoch (sort key)

✅ Every item MUST include:
- ownerId
- epoch
- resourceId
- createdAt
- updatedAt
- isDeleted

✅ Soft delete ONLY:
- NO DELETE endpoint unless explicitly requested
- PUT with isDeleted=true

✅ GET/List Lambda:
- MUST filter out isDeleted === true

✅ PUT:
- normal update
- complete/check action if relevant
- soft delete

🐍 Lambda Rules:

✅ Runtime:
python3.14

✅ Handler:
lambda_function.lambda_handler

✅ Use environment variable for table name

✅ ownerId comes from:
event.requestContext.authorizer.userId
OR principalId

✅ Parse JSON body safely

✅ Convert floats → Decimal before DynamoDB write

✅ Convert DynamoDB Decimal → JSON-safe int/float on response

✅ EVERY response MUST include CORS headers:
- Access-Control-Allow-Origin
- Access-Control-Allow-Headers
- Access-Control-Allow-Methods
- Content-Type

🌐 API Gateway Rules:

✅ REST API v1
❌ NOT HTTP API v2

✅ GET/POST/PUT:
CUSTOM authorizer

✅ OPTIONS:
authorization NONE

✅ GET/POST/PUT:
AWS_PROXY integrations

✅ OPTIONS:
MOCK integration

🎨 Frontend Rules:

✅ React + Vite
✅ Inline styles
✅ Match VaultDesk dark UI

✅ Use Redux token:
const token = useSelector((state) => state.auth.token);

❌ DO NOT use localStorage

✅ Include:
- Create form
- Edit form
- List cards
- Search if useful
- Validation
- Soft delete button
- Toggle show all vs incomplete/open
- Category dropdown + custom category input if relevant

✅ Give FULL copy-paste-ready files
❌ NOT snippets

🚫 Do not over-explain.
Just give commands and full files.
```

---

# 🌍 3. CORS Checklist

```txt
🚨 CORS MUST be handled in BOTH places:

1️⃣ Lambda Responses

EVERY response, including errors, MUST return:

✅ Access-Control-Allow-Origin
✅ Access-Control-Allow-Headers
✅ Access-Control-Allow-Methods
✅ Content-Type

2️⃣ API Gateway

The resource MUST have:

✅ OPTIONS method
✅ authorization NONE
✅ MOCK integration

✅ 200 method response headers:
- Access-Control-Allow-Origin
- Access-Control-Allow-Headers
- Access-Control-Allow-Methods

✅ 200 integration response static values:
- '*'
- 'Content-Type,x-vaultdesk-token,Authorization'
- 'GET,POST,PUT,DELETE,OPTIONS'
```

---

# 🧩 4. Placeholder Variables

```txt
<PROFILE_NAME>
<REGION>
<ACCOUNT_ID>
<REST_API_ID>
<ROOT_RESOURCE_ID>
<AUTHORIZER_ID>
<STAGE_NAME>
<LAMBDA_ROLE_ARN>
<LAMBDA_ROLE_NAME>
<TABLE_NAME>
<RESOURCE_PATH>
<RESOURCE_ID>
<SINGULAR_NAME>
<PLURAL_NAME>
<PAGE_NAME>
<FRONTEND_ROUTE>
```

---

# ✅ Example Real Values

```txt
PROFILE_NAME = salman-personal
REGION = us-west-1
ACCOUNT_ID = 311653202579
REST_API_ID = pwefadg62j
ROOT_RESOURCE_ID = bqzb600phi
AUTHORIZER_ID = y1d5g1
STAGE_NAME = S1
```
