# 1. Actual steps required

## A. Ask for required names first

New chat must stop and ask for:

```txt
1. AWS profile name
2. AWS region
3. REST API ID
4. API root resource ID
5. Authorizer ID
6. AWS account ID
7. Lambda execution role ARN
8. New resource name, example: Milestones
9. DynamoDB table name, example: VaultDeskMilestones
10. Frontend page name, example: MilestonesPage.jsx
11. API stage name, example: S1
```

---

## B. Create DynamoDB table

Pattern:

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

## C. Create one Lambda codebase

One `lambda_function.py` handles:

```txt
GET    list records
POST   create record
PUT    update record / complete / soft delete
OPTIONS CORS response
```

Use 3 Lambda functions with same code:

```txt
VaultDesk-Create-<ResourceSingular>
VaultDesk-List-<ResourcePlural>
VaultDesk-Update-<ResourceSingular>
```

Example:

```txt
VaultDesk-Create-Milestone
VaultDesk-List-Milestones
VaultDesk-Update-Milestone
```

---

## D. IAM permissions

Add DynamoDB permissions to Lambda role:

```bash
aws iam put-role-policy \
  --role-name <ROLE_NAME_ONLY_NOT_ARN> \
  --policy-name <RESOURCE_NAME>-DynamoDB-Policy \
  --policy-document file://policy.json \
  --profile <PROFILE_NAME>
```

Required actions:

```txt
dynamodb:PutItem
dynamodb:GetItem
dynamodb:UpdateItem
dynamodb:Query
```

Resource:

```txt
arn:aws:dynamodb:<REGION>:<ACCOUNT_ID>:table/<TABLE_NAME>
```

---

## E. API Gateway

Create resource:

```bash
aws apigateway create-resource \
  --rest-api-id <REST_API_ID> \
  --parent-id <ROOT_RESOURCE_ID> \
  --path-part <RESOURCE_PATH> \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

Save returned:

```txt
resourceId
```

Use it for all methods.

---

## F. API methods

Create:

```txt
GET
POST
PUT
OPTIONS
```

Optional:

```txt
DELETE
```

But preferred pattern:

```txt
soft delete through PUT with isDeleted=true
```

---

## G. API integrations

Use AWS_PROXY integrations:

```txt
GET  -> List Lambda
POST -> Create Lambda
PUT  -> Update Lambda
```

OPTIONS uses:

```txt
MOCK integration
```

---

## H. CORS requirements

### Lambda must return headers on every response:

```python
"headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,x-vaultdesk-token,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
}
```

### API Gateway must have OPTIONS:

```txt
OPTIONS method
authorization NONE
MOCK integration
method response with CORS headers
integration response with CORS values
```

---

## I. Lambda permissions

For each method:

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

## J. Deploy API

```bash
aws apigateway create-deployment \
  --rest-api-id <REST_API_ID> \
  --stage-name <STAGE_NAME> \
  --region <REGION> \
  --profile <PROFILE_NAME>
```

---

## K. Frontend

Create:

```txt
src/pages/<PageName>.jsx
```

Must include:

```txt
useSelector((state) => state.auth.token)
```

Not:

```txt
localStorage.getItem("vaultdesk_token")
```

because VaultDesk auth uses Redux.

Add route:

```jsx
<Route path="<route>" element={<PageName />} />
```

Add sidebar link:

```js
{ to: "/<route>", label: "<Label>" }
```

---

# 2. Exact prompt to give new ChatGPT

Copy this into a new chat:

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
3. Full Python Lambda code in one `lambda_function.py`.
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

- DynamoDB table has partition key `ownerId` string and sort key `epoch` string.
- Each item must include:
  - ownerId
  - epoch
  - resourceId
  - createdAt
  - updatedAt
  - isDeleted
- Use soft delete only:
  - no DELETE API method unless I explicitly request it
  - delete action should be PUT with `isDeleted: true`
- GET/List Lambda must filter out records where `isDeleted === true`.
- PUT must support normal update, complete/check action if relevant, and soft delete.

Use this Lambda pattern:

- Runtime: python3.14
- Handler: lambda_function.lambda_handler
- Environment variable for table name
- `event.requestContext.authorizer.userId` or `principalId` is ownerId
- Parse JSON body safely
- Convert Python floats to Decimal before DynamoDB write
- Convert DynamoDB Decimal to JSON-safe int/float on response
- Every Lambda response must include CORS headers:
  - Access-Control-Allow-Origin: *
  - Access-Control-Allow-Headers: Content-Type,x-vaultdesk-token,Authorization
  - Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
  - Content-Type: application/json

Use this API Gateway pattern:

- REST API v1, not HTTP API v2
- GET/POST/PUT use CUSTOM authorizer
- OPTIONS uses authorization NONE
- GET/POST/PUT integrations are AWS_PROXY
- OPTIONS integration is MOCK
- Deploy to the stage I provide

Use this frontend pattern:

- React + Vite
- Inline styles, matching VaultDesk dark UI
- Use Redux token:
  `const token = useSelector((state) => state.auth.token);`
- Do not use localStorage for token
- Include:
  - Create form
  - Edit form
  - List cards
  - Search if useful
  - Required validation
  - Soft delete button
  - Toggle for show all vs incomplete/open records if relevant
  - Category dropdown plus custom category input if category is one of the fields
- Give full copy-paste-ready files, not snippets.

Do not over-explain. Give commands and full files.
```

---

# 3. CORS checklist for the new chat

Tell the new chat:

```txt
CORS must be handled in BOTH places:

1. Lambda responses:
Every response, including errors, must return:
Access-Control-Allow-Origin
Access-Control-Allow-Headers
Access-Control-Allow-Methods
Content-Type

2. API Gateway:
The resource must have:
OPTIONS method
authorization NONE
MOCK integration
200 method response with:
- Access-Control-Allow-Origin
- Access-Control-Allow-Headers
- Access-Control-Allow-Methods

200 integration response with static values:
- '*'
- 'Content-Type,x-vaultdesk-token,Authorization'
- 'GET,POST,PUT,DELETE,OPTIONS'
```

---

# 4. Replacement placeholders

Use these placeholders in generated commands:

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

Example filled values from VaultDesk:

```txt
PROFILE_NAME = salman-personal
REGION = us-west-1
ACCOUNT_ID = 311653202579
REST_API_ID = pwefadg62j
ROOT_RESOURCE_ID = bqzb600phi
AUTHORIZER_ID = y1d5g1
STAGE_NAME = S1
```
