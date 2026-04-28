# Chapter 0 — AWS CLI Full Backend Flow 🚀

## From Keys → DynamoDB → IAM → Lambda → API Gateway → Authorizer → curl

This chapter is your **clean, simple, end-to-end AWS CLI flow**.

Use it as your daily checklist.

The goal is to memorize the order first, then understand the details.

---

# 🧠 Big Picture

You are building this:

```text
👤 User / curl
   ↓
🌐 API Gateway
   ↓
🔐 Optional Authorizer
   ↓
⚡ Lambda Function
   ↓
🗄️ DynamoDB Table
```

---

# 🧾 Command Shape

Most AWS CLI commands look like this:

```bash
aws <service> <operation> [options]
```

Example:

```bash
aws dynamodb list-tables
```

| Part          | Meaning          |
| ------------- | ---------------- |
| `aws`         | AWS CLI program  |
| `dynamodb`    | AWS service      |
| `list-tables` | operation/action |

---

# 🔐 1. Get AWS Credentials / Keys

From AWS Console or your admin, you receive:

```text
Access Key ID
Secret Access Key
```

These keys allow your terminal or VS Code to talk to AWS.

⚠️ Never commit these keys to GitHub.

---

# 👤 2. Configure AWS CLI Profile

```bash
aws configure --profile dev
```

AWS will ask:

```text
AWS Access Key ID
AWS Secret Access Key
Default region name
Default output format
```

Recommended values:

```text
Region: us-east-1
Output: json
```

Verify your identity:

```bash
aws sts get-caller-identity --profile dev
```

✔ Confirms:

- account ID
- user/role
- credentials are working

## What is STS?

| Term                  | Meaning                |
| --------------------- | ---------------------- |
| `STS`                 | Security Token Service |
| `get-caller-identity` | asks AWS: “who am I?”  |

---

# 🗄️ 3. Create DynamoDB Table

DynamoDB is your database.

Basic idea:

```bash
aws dynamodb create-table ...
```

This defines:

- PK = Partition Key
- SK = Sort Key
- GSI = Global Secondary Index
- LSI = Local Secondary Index

Example table design:

```text
Table: Videos

PK: userId
SK: createdAt

GSI:
category-createdAt-index

LSI:
user-status-index
```

---

# 🔍 4. Verify DynamoDB Table

```bash
aws dynamodb describe-table --table-name Videos
```

Wait until:

```text
TableStatus = ACTIVE
```

Important values to save:

```text
TableName
TableArn
TableStatus
GlobalSecondaryIndexes
LocalSecondaryIndexes
```

---

# 🔐 5. Create IAM Role for Lambda

Lambda needs permissions.

The IAM role says:

> “Lambda is allowed to run and access certain AWS services.”

Create trust policy file:

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

Save as:

```text
trust.json
```

Create role:

```bash
aws iam create-role \
  --role-name lambda-role \
  --assume-role-policy-document file://trust.json
```

---

# 🔗 6. Attach Policies to Role

Attach CloudWatch logs permission:

```bash
aws iam attach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Attach DynamoDB permission for learning:

```bash
aws iam attach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

✔ Needed for:

- Lambda logs
- reading/writing DynamoDB

---

# 📍 7. Get Role ARN

```bash
aws iam get-role --role-name lambda-role
```

Save:

```text
ROLE_ARN
```

Example:

```text
arn:aws:iam::123456789012:role/lambda-role
```

You need this when creating Lambda.

---

# 📦 8. Write Lambda Code

Create:

```text
index.js
```

Example:

```js
exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from Lambda 🚀",
    }),
  };
};
```

---

# 📦 9. Zip Lambda

```bash
zip function.zip index.js
```

| Part           | Meaning          |
| -------------- | ---------------- |
| `zip`          | package code     |
| `function.zip` | output zip file  |
| `index.js`     | file being added |

---

# ⚡ 10. Create Lambda Function

```bash
aws lambda create-function \
  --function-name videoFunction \
  --runtime nodejs20.x \
  --role <ROLE_ARN> \
  --handler index.handler \
  --zip-file fileb://function.zip
```

✔ Now backend logic exists.

## Important Lambda Pieces

| Piece             | Meaning            |
| ----------------- | ------------------ |
| `--function-name` | Lambda name        |
| `--runtime`       | language runtime   |
| `--role`          | IAM role ARN       |
| `--handler`       | file.function      |
| `--zip-file`      | code package       |
| `fileb://`        | binary file upload |

---

# 🔍 11. Test Lambda Directly

```bash
aws lambda invoke \
  --function-name videoFunction \
  response.json
```

Read response:

```bash
cat response.json
```

Check logs:

```bash
aws logs tail /aws/lambda/videoFunction --follow
```

---

# 🔄 12. Update Lambda During Development

This is your normal dev loop:

```bash
zip function.zip index.js

aws lambda update-function-code \
  --function-name videoFunction \
  --zip-file fileb://function.zip
```

Update configuration if needed:

```bash
aws lambda update-function-configuration \
  --function-name videoFunction \
  --timeout 10 \
  --memory-size 256
```

---

# 🌐 13. Create API Gateway

API Gateway gives your Lambda a public URL.

```bash
aws apigatewayv2 create-api \
  --name videoAPI \
  --protocol-type HTTP
```

Save:

```text
API_ID
API_ENDPOINT
```

Example:

```text
API_ID=abc123
API_ENDPOINT=https://abc123.execute-api.us-east-1.amazonaws.com
```

---

# 📍 14. Get Lambda ARN

```bash
aws lambda get-function \
  --function-name videoFunction
```

Save:

```text
LAMBDA_ARN
```

Example:

```text
arn:aws:lambda:us-east-1:123456789012:function:videoFunction
```

You need this for API Gateway integration.

---

# 🔗 15. Connect API Gateway → Lambda

Create integration:

```bash
aws apigatewayv2 create-integration \
  --api-id <API_ID> \
  --integration-type AWS_PROXY \
  --integration-uri <LAMBDA_ARN> \
  --payload-format-version 2.0
```

Save:

```text
INTEGRATION_ID
```

---

# 🛣️ 16. Create Route / Endpoint

```bash
aws apigatewayv2 create-route \
  --api-id <API_ID> \
  --route-key "GET /videos" \
  --target integrations/<INTEGRATION_ID>
```

Save:

```text
ROUTE_ID
```

Meaning:

| Part                | Meaning                |
| ------------------- | ---------------------- |
| `GET`               | HTTP method            |
| `/videos`           | endpoint path          |
| `integrations/<ID>` | send request to Lambda |

---

# 🚀 17. Deploy API Stage

```bash
aws apigatewayv2 create-stage \
  --api-id <API_ID> \
  --stage-name prod \
  --auto-deploy
```

Your URL becomes:

```text
https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos
```

---

# 🔗 18. Allow API Gateway to Call Lambda

This is critical.

Without this, API Gateway cannot invoke Lambda.

```bash
aws lambda add-permission \
  --function-name videoFunction \
  --statement-id apigateway-video-access \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:<region>:<account-id>:<API_ID>/*/*"
```

✔ Without this → API may fail.

---

# 🧪 19. Test API With curl

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos
```

You should see Lambda response.

Example:

```json
{
  "message": "Hello from Lambda 🚀"
}
```

---

# 🔐 20. Optional: Add Lambda Authorizer

An authorizer checks if a request is allowed before the main Lambda runs.

## 20.1 Create Authorizer Lambda

Create:

```text
auth.js
```

Example:

```js
exports.handler = async (event) => {
  console.log("Auth event:", JSON.stringify(event));

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

---

## 20.2 Create API Authorizer

Get authorizer Lambda ARN:

```bash
aws lambda get-function --function-name videoAuthorizer
```

Create authorizer:

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
AUTHORIZER_ID
```

---

## 20.3 Allow API Gateway to Call Authorizer Lambda

```bash
aws lambda add-permission \
  --function-name videoAuthorizer \
  --statement-id apigateway-authorizer-access \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:<region>:<account-id>:<API_ID>/authorizers/<AUTHORIZER_ID>"
```

---

## 20.4 Attach Authorizer to Route

```bash
aws apigatewayv2 update-route \
  --api-id <API_ID> \
  --route-id <ROUTE_ID> \
  --authorization-type CUSTOM \
  --authorizer-id <AUTHORIZER_ID>
```

---

# 🧪 21. Test With Auth

Without token:

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos
```

With token:

```bash
curl https://<API_ID>.execute-api.us-east-1.amazonaws.com/prod/videos \
  -H "Authorization: Bearer secret123"
```

---

# 🧠 Super Simple Memory Version 🔥

```text
1. 🔐 get keys
2. 👤 configure
3. 🗄️ dynamodb
4. 🔐 iam role
5. 🔗 attach policies
6. 📍 get role arn
7. 📦 write lambda
8. 📦 zip
9. ⚡ lambda create
10. 🔍 lambda test
11. 🔄 lambda update
12. 🌐 api create
13. 🔗 integration
14. 🛣️ route
15. 🚀 stage
16. 🔗 permission
17. 🧪 curl
18. 🔐 authorizer optional
```

---

# 🔁 Even Shorter

```text
keys → configure → sts → db → role → policies → zip → lambda → api → integration → route → stage → permission → curl → auth
```

---

# 🧭 ID / ARN Map

| Resource       | How You Get It                | Where You Use It            |
| -------------- | ----------------------------- | --------------------------- |
| Account ID     | `aws sts get-caller-identity` | ARNs                        |
| Table ARN      | `aws dynamodb describe-table` | IAM policies                |
| Role ARN       | `aws iam get-role`            | Lambda create               |
| Lambda ARN     | `aws lambda get-function`     | API integration             |
| API ID         | `create-api` output           | routes, stages, permissions |
| Integration ID | `create-integration` output   | route target                |
| Route ID       | `get-routes` output           | authorizer attach           |
| Authorizer ID  | `create-authorizer` output    | route + permission          |

---

# 🧯 Safe Cleanup Order

Use this when practicing so you do not leave resources running.

```text
1. Delete API Gateway
2. Delete Lambda authorizer
3. Delete main Lambda
4. Delete DynamoDB table
5. Detach IAM policies
6. Delete IAM role
```

Example commands:

```bash
aws apigatewayv2 delete-api --api-id <API_ID>

aws lambda delete-function --function-name videoAuthorizer

aws lambda delete-function --function-name videoFunction

aws dynamodb delete-table --table-name Videos

aws iam detach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam detach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam delete-role --role-name lambda-role
```

---

# 🧪 Daily Practice Checklist

Use this every day for two weeks.

```text
[ ] Configure profile
[ ] Confirm identity with STS
[ ] Create DynamoDB table
[ ] Verify table is ACTIVE
[ ] Create IAM role
[ ] Attach policies
[ ] Get role ARN
[ ] Write Lambda
[ ] Zip Lambda
[ ] Create Lambda
[ ] Invoke Lambda
[ ] Tail logs
[ ] Create API
[ ] Create integration
[ ] Create route
[ ] Create stage
[ ] Add Lambda permission
[ ] Test with curl
[ ] Optional: add authorizer
[ ] Clean up resources
```

---

# ⏱ How Long to Memorize

| Level                 | Time          |
| --------------------- | ------------- |
| Understand flow       | 20–30 min     |
| Memorize steps        | 1–2 hours     |
| Fluent execution      | about 1 week  |
| Fast without thinking | about 2 weeks |

---

# 🎯 Chapter 0 Final Advice

If you repeat this flow daily:

```text
Day 5  → you understand the shape
Day 10 → you debug confidently
Day 14 → you think in AWS flows
```

Do not try to memorize every flag at first.

First memorize the order:

```text
keys → configure → sts → db → role → zip → lambda → api → permission → curl
```

Then memorize the details.

---

# ➕ What I Added to Make This Better as Chapter 0

I added these sections because they make this useful as your foundation chapter:

1. **Command shape**  
   So you understand every AWS CLI command.

2. **STS explanation**  
   So `sts get-caller-identity` is not just a random command.

3. **Resource flow diagram**  
   So you visually understand how the backend works.

4. **ID / ARN map**  
   So you know which ID is needed in which command.

5. **Safe cleanup order**  
   So you can practice daily without leaving resources behind.

6. **Daily checklist**  
   So you can repeat this for two weeks.

7. **Memory chains**  
   So it sticks visually and mentally.

---

# ✅ End of Chapter 0
