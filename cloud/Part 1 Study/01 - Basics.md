# 🚀 AWS CLI Visual Master Guide

## DynamoDB + Lambda + IAM + API Gateway + Authorizer + curl

---

# 🧠 0. Main AWS CLI Shape

```bash
aws <service> <operation> [options]
```

| 🧩 Part       | Meaning         | Example                     |
| ------------- | --------------- | --------------------------- |
| `aws`         | AWS CLI program | `aws`                       |
| `<service>`   | AWS product     | `dynamodb`, `lambda`, `iam` |
| `<operation>` | action          | `create-table`, `get-role`  |
| `[options]`   | settings/inputs | `--table-name Videos`       |

Example:

```bash
aws dynamodb list-tables
```

| Piece         | Meaning              |
| ------------- | -------------------- |
| `aws`         | run AWS CLI          |
| `dynamodb`    | talk to DynamoDB     |
| `list-tables` | list DynamoDB tables |

---

# 🔐 1. Acronyms You Must Know

| Term     | Full Meaning                      | Easy Meaning                    |
| -------- | --------------------------------- | ------------------------------- |
| AWS      | Amazon Web Services               | cloud platform                  |
| CLI      | Command Line Interface            | terminal commands               |
| STS      | Security Token Service            | asks “who am I?”                |
| IAM      | Identity and Access Management    | users, roles, permissions       |
| ARN      | Amazon Resource Name              | full ID/address of AWS resource |
| API      | Application Programming Interface | endpoint your app calls         |
| HTTP API | API Gateway v2 API                | modern API Gateway              |
| Lambda   | serverless function               | code that runs on demand        |
| DynamoDB | NoSQL database                    | fast key-value/document DB      |
| PK       | Partition Key                     | main grouping key               |
| SK       | Sort Key                          | ordering/range key              |
| GSI      | Global Secondary Index            | alternate query pattern         |
| LSI      | Local Secondary Index             | same PK, different SK           |
| CRUD     | Create, Read, Update, Delete      | basic database actions          |
| JSON     | JavaScript Object Notation        | object format                   |
| curl     | command-line HTTP client          | test your API                   |

---

# 👤 2. Configure AWS Profile

```bash
aws configure --profile dev
```

| Piece       | Meaning           | Example     |
| ----------- | ----------------- | ----------- |
| `aws`       | AWS CLI           | `aws`       |
| `configure` | save keys locally | `configure` |
| `--profile` | named login       | `dev`       |

It asks:

| Prompt                | Meaning       | Example     |
| --------------------- | ------------- | ----------- |
| AWS Access Key ID     | public key    | `AKIA...`   |
| AWS Secret Access Key | private key   | `abc123...` |
| Default region        | AWS region    | `us-east-1` |
| Output format         | result format | `json`      |

Use profile:

```bash
aws sts get-caller-identity --profile dev
```

| Piece                 | Meaning                                        |
| --------------------- | ---------------------------------------------- |
| `sts`                 | Security Token Service                         |
| `get-caller-identity` | tells you which AWS account/user you are using |
| `--profile dev`       | use saved credentials named `dev`              |

---

# 🏗️ 3. Cloud Structure Before and After

## Empty account

```text
☁️ AWS Account
 ├── 🔐 IAM
 ├── 🗄️ DynamoDB
 ├── ⚡ Lambda
 └── 🌐 API Gateway
```

## Final working system

```text
👤 User / curl
   ↓
🌐 API Gateway HTTP API
   ↓
🔐 Lambda Authorizer
   ↓
⚡ Main Lambda Function
   ↓
🗄️ DynamoDB Table
      ├── PK: userId
      ├── SK: createdAt
      ├── GSI: category-createdAt-index
      └── LSI: status-createdAt-index
```

---

# 🗄️ 4. DynamoDB Data Types

DynamoDB supports scalar, document, and set types. Key attributes must be `String`, `Number`, or `Binary`. DynamoDB is schemaless except for primary/index keys. ([AWS Documentation][1])

| Type Code | Full Name  | Example            | Notes                             |
| --------- | ---------- | ------------------ | --------------------------------- |
| `S`       | String     | `"sports"`         | text                              |
| `N`       | Number     | `"42"` or `"3.14"` | sent as string, treated as number |
| `B`       | Binary     | base64             | files/binary                      |
| `BOOL`    | Boolean    | `true`             | true/false                        |
| `NULL`    | Null       | `true`             | empty/unknown                     |
| `M`       | Map        | object             | nested JSON object                |
| `L`       | List       | array              | ordered list                      |
| `SS`      | String Set | `["a","b"]`        | unique strings                    |
| `NS`      | Number Set | `["1","2"]`        | unique numbers                    |
| `BS`      | Binary Set | base64 list        | unique binary values              |

---

# ⚠️ 5. Important Number Rules

DynamoDB `N` means **Number**, not just integer.

Allowed:

```json
{"N":"10"}
{"N":"3.14"}
{"N":"-25"}
{"N":"0"}
```

Not allowed:

```json
{"N":"abc"}
{"N":"$10"}
{"N":"10 dollars"}
{"N":10}
```

Why?

DynamoDB sends numbers across the network as strings for compatibility, but treats them as numbers internally. Numbers can have up to 38 digits of precision. ([AWS Documentation][1])

Correct:

```bash
--expression-attribute-values '{":price":{"N":"19.99"}}'
```

Incorrect:

```bash
--expression-attribute-values '{":price":{"N":19.99}}'
```

Because low-level DynamoDB CLI expects:

```json
"N": "19.99"
```

not:

```json
"N": 19.99
```

---

# 🧩 6. What Is This Object?

Example:

```bash
--expression-attribute-values '{":c":{"S":"sports"}}'
```

Breakdown:

| Piece                           | Meaning                       |
| ------------------------------- | ----------------------------- |
| `--expression-attribute-values` | values used inside expression |
| `:c`                            | placeholder variable          |
| `S`                             | DynamoDB String type          |
| `sports`                        | actual value                  |

So this:

```json
{
  ":c": {
    "S": "sports"
  }
}
```

means:

```text
:c = string value "sports"
```

Then this query:

```bash
--key-condition-expression "category = :c"
```

means:

```text
category = "sports"
```

You can name `:c` anything:

```json
{ ":categoryValue": { "S": "sports" } }
```

Then use:

```bash
--key-condition-expression "category = :categoryValue"
```

---

# 🧠 7. Expression Symbols

| Symbol | Meaning                    | Example                |
| ------ | -------------------------- | ---------------------- |
| `:`    | value placeholder          | `:uid`, `:c`, `:price` |
| `#`    | attribute name placeholder | `#status`              |
| `S`    | String                     | `{"S":"hello"}`        |
| `N`    | Number                     | `{"N":"123"}`          |
| `BOOL` | Boolean                    | `{"BOOL":true}`        |
| `M`    | Map/object                 | `{"M":{...}}`          |
| `L`    | List/array                 | `{"L":[...]}`          |

Why use `#status`?

Some words are reserved, so you alias them.

```bash
--expression-attribute-names '{"#s":"status"}'
--key-condition-expression "#s = :status"
--expression-attribute-values '{":status":{"S":"ACTIVE"}}'
```

---

# 🗄️ 8. DynamoDB Table With PK + SK + GSI + LSI

## 🧠 Design

| Access Pattern            | Index Used | Query                  |
| ------------------------- | ---------- | ---------------------- |
| Get videos by user        | main table | `userId + createdAt`   |
| Get videos by category    | GSI        | `category + createdAt` |
| Get user videos by status | LSI        | `userId + status`      |

Important:
A **GSI** can use different partition and sort keys.
An **LSI** must use the same partition key as the base table but a different sort key. Also, LSIs must be created when the table is created; you cannot add them later. ([AWS Documentation][2])

---

## Create Table

```bash
aws dynamodb create-table \
  --table-name Videos \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=createdAt,AttributeType=N \
    AttributeName=category,AttributeType=S \
    AttributeName=status,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=createdAt,KeyType=RANGE \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"category-createdAt-index\",
        \"KeySchema\": [
          {\"AttributeName\":\"category\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"createdAt\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\": {\"ProjectionType\":\"ALL\"}
      }
    ]" \
  --local-secondary-indexes \
    "[
      {
        \"IndexName\": \"user-status-index\",
        \"KeySchema\": [
          {\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"status\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\": {\"ProjectionType\":\"ALL\"}
      }
    ]" \
  --billing-mode PAY_PER_REQUEST
```

---

# 🔑 9. Key Terms

| Term                  | Full Meaning             | Easy Meaning             |
| --------------------- | ------------------------ | ------------------------ |
| `HASH`                | partition key            | groups data              |
| `RANGE`               | sort key                 | sorts inside group       |
| `ProjectionType: ALL` | copy all fields to index | easiest for learning     |
| `PAY_PER_REQUEST`     | on-demand billing        | no manual capacity setup |

---

# 🔍 10. DynamoDB Commands

## List tables

```bash
aws dynamodb list-tables
```

## Describe table

```bash
aws dynamodb describe-table --table-name Videos
```

Use this to find:

```text
TableArn
GlobalSecondaryIndexes
LocalSecondaryIndexes
TableStatus
```

## Put item

```bash
aws dynamodb put-item \
  --table-name Videos \
  --item '{
    "userId": {"S": "user123"},
    "createdAt": {"N": "1714300000"},
    "videoId": {"S": "video001"},
    "category": {"S": "sports"},
    "status": {"S": "PUBLIC"},
    "likes": {"N": "12"},
    "rating": {"N": "4.75"},
    "isActive": {"BOOL": true}
  }'
```

## Get item

```bash
aws dynamodb get-item \
  --table-name Videos \
  --key '{
    "userId": {"S": "user123"},
    "createdAt": {"N": "1714300000"}
  }'
```

## Query main table

```bash
aws dynamodb query \
  --table-name Videos \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid":{"S":"user123"}}'
```

## Query main table newest first

```bash
aws dynamodb query \
  --table-name Videos \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid":{"S":"user123"}}' \
  --scan-index-forward false
```

| Option                       | Meaning         |
| ---------------------------- | --------------- |
| `--scan-index-forward true`  | oldest → newest |
| `--scan-index-forward false` | newest → oldest |

## Query GSI

```bash
aws dynamodb query \
  --table-name Videos \
  --index-name category-createdAt-index \
  --key-condition-expression "category = :c" \
  --expression-attribute-values '{":c":{"S":"sports"}}' \
  --scan-index-forward false
```

## Query LSI

```bash
aws dynamodb query \
  --table-name Videos \
  --index-name user-status-index \
  --key-condition-expression "userId = :uid AND #s = :status" \
  --expression-attribute-names '{"#s":"status"}' \
  --expression-attribute-values '{
    ":uid":{"S":"user123"},
    ":status":{"S":"PUBLIC"}
  }'
```

## Update item

```bash
aws dynamodb update-item \
  --table-name Videos \
  --key '{
    "userId": {"S": "user123"},
    "createdAt": {"N": "1714300000"}
  }' \
  --update-expression "SET likes = likes + :inc" \
  --expression-attribute-values '{":inc":{"N":"1"}}' \
  --return-values UPDATED_NEW
```

## Delete item

```bash
aws dynamodb delete-item \
  --table-name Videos \
  --key '{
    "userId": {"S": "user123"},
    "createdAt": {"N": "1714300000"}
  }'
```

## Delete table

```bash
aws dynamodb delete-table --table-name Videos
```

---

# 🔐 11. IAM Role for Lambda

Lambda needs a role so AWS knows what the function is allowed to do.

## trust.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Meaning:

| Field                  | Meaning                                 |
| ---------------------- | --------------------------------------- |
| `Effect: Allow`        | permission is allowed                   |
| `Principal`            | who can use this role                   |
| `lambda.amazonaws.com` | Lambda service                          |
| `sts:AssumeRole`       | Lambda may temporarily become this role |

## Create role

```bash
aws iam create-role \
  --role-name lambda-video-role \
  --assume-role-policy-document file://trust.json
```

## Attach CloudWatch logs policy

```bash
aws iam attach-role-policy \
  --role-name lambda-video-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

## Attach DynamoDB access

For learning:

```bash
aws iam attach-role-policy \
  --role-name lambda-video-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

For production, use a tighter custom policy later.

## Get Role ARN

```bash
aws iam get-role --role-name lambda-video-role
```

Save:

```text
ROLE_ARN=arn:aws:iam::<account-id>:role/lambda-video-role
```

---

# ⚡ 12. Lambda Create + Zip + Update

## index.js

```javascript
exports.handler = async (event) => {
  console.log("📥 Event:", JSON.stringify(event));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from Lambda 🚀",
      path: event.rawPath || event.path,
    }),
  };
};
```

## Zip function

```bash
zip function.zip index.js
```

| Piece          | Meaning       |
| -------------- | ------------- |
| `zip`          | package files |
| `function.zip` | output file   |
| `index.js`     | file included |

## Create Lambda

```bash
aws lambda create-function \
  --function-name videoFunction \
  --runtime nodejs20.x \
  --role <ROLE_ARN> \
  --handler index.handler \
  --zip-file fileb://function.zip
```

| Piece             | Meaning            |
| ----------------- | ------------------ |
| `lambda`          | Lambda service     |
| `create-function` | create function    |
| `--function-name` | Lambda name        |
| `--runtime`       | language runtime   |
| `--role`          | IAM role ARN       |
| `--handler`       | file.function      |
| `--zip-file`      | code package       |
| `fileb://`        | binary file upload |

## Update Lambda code

```bash
zip function.zip index.js

aws lambda update-function-code \
  --function-name videoFunction \
  --zip-file fileb://function.zip
```

## Update Lambda settings

```bash
aws lambda update-function-configuration \
  --function-name videoFunction \
  --timeout 10 \
  --memory-size 256
```

## Invoke Lambda directly

```bash
aws lambda invoke \
  --function-name videoFunction \
  response.json
```

Read output:

```bash
cat response.json
```

## Live logs

```bash
aws logs tail /aws/lambda/videoFunction --follow
```

---

# 🌐 13. API Gateway HTTP API

## Create API

```bash
aws apigatewayv2 create-api \
  --name videoAPI \
  --protocol-type HTTP
```

Save:

```text
API_ID=abc123
API_ENDPOINT=https://abc123.execute-api.us-east-1.amazonaws.com
```

## Get Lambda ARN

```bash
aws lambda get-function \
  --function-name videoFunction
```

Save:

```text
LAMBDA_ARN=arn:aws:lambda:us-east-1:<account-id>:function:videoFunction
```

## Create integration

```bash
aws apigatewayv2 create-integration \
  --api-id <API_ID> \
  --integration-type AWS_PROXY \
  --integration-uri <LAMBDA_ARN> \
  --payload-format-version 2.0
```

Save:

```text
INTEGRATION_ID=xyz789
```

## Create route

```bash
aws apigatewayv2 create-route \
  --api-id <API_ID> \
  --route-key "GET /videos" \
  --target integrations/<INTEGRATION_ID>
```

## Get routes

```bash
aws apigatewayv2 get-routes --api-id <API_ID>
```

Save:

```text
ROUTE_ID=route123
```

## Create stage

```bash
aws apigatewayv2 create-stage \
  --api-id <API_ID> \
  --stage-name prod \
  --auto-deploy
```

---

# 🔗 14. Allow API Gateway to Call Lambda

```bash
aws lambda add-permission \
  --function-name videoFunction \
  --statement-id apigateway-video-access \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:<region>:<account-id>:<API_ID>/*/*"
```

| Piece                                  | Meaning                                    |
| -------------------------------------- | ------------------------------------------ |
| `add-permission`                       | allow another AWS service to invoke Lambda |
| `--principal apigateway.amazonaws.com` | API Gateway gets access                    |
| `--source-arn`                         | restrict to this API Gateway               |

---

# 🧪 15. Test With curl

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos
```

Expected:

```json
{
  "message": "Hello from Lambda 🚀",
  "path": "/videos"
}
```

---

# 🔐 16. Lambda Authorizer

An authorizer checks the request before your main Lambda runs.

## Create authorizer Lambda

Example `auth.js`:

```javascript
exports.handler = async (event) => {
  console.log("🔐 Auth event:", JSON.stringify(event));

  const token = event.headers?.authorization || event.headers?.Authorization;

  if (token === "Bearer secret123") {
    return {
      isAuthorized: true,
      context: {
        userId: "user123",
      },
    };
  }

  return {
    isAuthorized: false,
  };
};
```

Zip:

```bash
zip auth.zip auth.js
```

Create:

```bash
aws lambda create-function \
  --function-name videoAuthorizer \
  --runtime nodejs20.x \
  --role <ROLE_ARN> \
  --handler auth.handler \
  --zip-file fileb://auth.zip
```

Get authorizer Lambda ARN:

```bash
aws lambda get-function --function-name videoAuthorizer
```

## Create API authorizer

```bash
aws apigatewayv2 create-authorizer \
  --api-id <API_ID> \
  --authorizer-type REQUEST \
  --authorizer-uri <AUTHORIZER_LAMBDA_ARN> \
  --identity-source '$request.header.Authorization' \
  --name videoAuthorizer \
  --authorizer-payload-format-version 2.0 \
  --enable-simple-responses
```

Save:

```text
AUTHORIZER_ID=auth123
```

## Allow API Gateway to call authorizer Lambda

```bash
aws lambda add-permission \
  --function-name videoAuthorizer \
  --statement-id apigateway-authorizer-access \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:<region>:<account-id>:<API_ID>/authorizers/<AUTHORIZER_ID>"
```

## Attach authorizer to route

```bash
aws apigatewayv2 update-route \
  --api-id <API_ID> \
  --route-id <ROUTE_ID> \
  --authorization-type CUSTOM \
  --authorizer-id <AUTHORIZER_ID>
```

## Test without token

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos
```

Expected:

```text
Unauthorized
```

## Test with token

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos \
  -H "Authorization: Bearer secret123"
```

---

# 🧭 17. ID / ARN Flow

| Resource       | How to Get It                 | Where You Use It            |
| -------------- | ----------------------------- | --------------------------- |
| Account ID     | `aws sts get-caller-identity` | ARNs                        |
| Table ARN      | `aws dynamodb describe-table` | IAM policy                  |
| Role ARN       | `aws iam get-role`            | Lambda create               |
| Lambda ARN     | `aws lambda get-function`     | API integration             |
| API ID         | `create-api` output           | routes, stages, authorizers |
| Integration ID | `create-integration` output   | route target                |
| Route ID       | `get-routes`                  | attach authorizer           |
| Authorizer ID  | `create-authorizer` output    | route + permission          |

---

# 🧠 18. Command Memory Chain

```text
👤 sts
 → 🔐 configure profile
 → 🗄️ dynamodb table
 → 🔐 iam role
 → 📦 zip lambda
 → ⚡ create lambda
 → 🌐 create api
 → 🔗 create integration
 → 🛣️ create route
 → 🚪 create stage
 → 🔗 add permission
 → 🔐 create authorizer
 → 🧪 curl test
 → 📡 logs
```

---

# ⚠️ 19. Common Mistakes

| Problem                 | Why It Happens                    | Fix                                  |
| ----------------------- | --------------------------------- | ------------------------------------ |
| `AccessDeniedException` | IAM role lacks permission         | attach correct policy                |
| Lambda has no logs      | missing logs policy               | attach `AWSLambdaBasicExecutionRole` |
| API returns 500         | Lambda crashed                    | check `aws logs tail`                |
| API returns forbidden   | missing `add-permission`          | allow API Gateway invoke             |
| Query fails             | wrong key condition               | use PK exactly                       |
| GSI query empty         | item missing GSI key              | item must have `category`            |
| LSI missing             | tried adding after table creation | recreate table with LSI              |
| Number error            | used raw JSON number              | use `"N":"3.14"`                     |
| Wrong region            | resource created elsewhere        | add `--region us-east-1`             |
| Zip update not working  | old zip                           | zip again before update              |

---

# ⏱️ 20. Two-Week Practice Plan

| Day | Practice                              | Review Time | Settle Time |
| --- | ------------------------------------- | ----------: | ----------: |
| 1   | `configure`, `sts`, regions, profiles |      30 min |      20 min |
| 2   | DynamoDB PK/SK                        |      45 min |      30 min |
| 3   | DynamoDB GSI                          |      45 min |      45 min |
| 4   | DynamoDB LSI + data types             |      60 min |      45 min |
| 5   | IAM role + policies                   |      60 min |      45 min |
| 6   | Lambda zip/create/update/logs         |      75 min |      60 min |
| 7   | Full rebuild with notes               |      90 min |      60 min |
| 8   | API Gateway integration               |      75 min |      60 min |
| 9   | API permissions + curl                |      75 min |      60 min |
| 10  | Authorizer                            |      90 min |      60 min |
| 11  | Break and fix errors                  |      90 min |      60 min |
| 12  | Full rebuild faster                   |      90 min |      60 min |
| 13  | No-notes attempt                      |     120 min |      90 min |
| 14  | Timed full system                     |     120 min |      90 min |

---

# 🎯 Final Answer

Yes — if you practice this every day for 2 weeks, you should become fluent in:

```text
AWS CLI basics
IAM roles
Lambda create/update/debug
DynamoDB PK/SK/GSI/LSI
API Gateway routes/integrations
Authorizers
curl testing
```
