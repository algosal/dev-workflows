### **1. Basic Public Read Access for All**

This policy grants public `GET` access to all objects in the S3 bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::point3orless/*"
    }
  ]
}
```

### **2. Allow Specific Domain for PUT and POST (for Uploading)**

This policy allows a specific domain (e.g., `example.com`) to upload files (`PUT` and `POST`) to your S3 bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPutAndPostAccessForSpecificDomain",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:PutObject", "s3:PostObject"],
      "Resource": "arn:aws:s3:::point3orless/*",
      "Condition": {
        "StringLike": {
          "aws:Referer": "https://example.com/*"
        }
      }
    }
  ]
}
```

### **3. CORS Configuration for Allowing PUT and POST from a Specific Domain**

This CORS configuration allows only the domain `example.com` to upload (`PUT` and `POST`) to your S3 bucket.

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["PUT", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": []
  }
]
```

### **4. Allow Public Read Access, but Restrict Write (PUT and POST) to Specific Domain**

This policy gives `GET` access to everyone but restricts `PUT` and `POST` actions to a specific domain (`example.com`).

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadAccessForAll",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::point3orless/*"
    },
    {
      "Sid": "AllowWriteAccessForSpecificDomain",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:PutObject", "s3:PostObject"],
      "Resource": "arn:aws:s3:::point3orless/*",
      "Condition": {
        "StringLike": {
          "aws:Referer": "https://example.com/*"
        }
      }
    }
  ]
}
```

### **5. Allow Public Read Access for All, and PUT/POST from Specific Domain**

This policy allows everyone to read the contents of the bucket (`GET`), but only a specific domain (`example.com`) to upload (`PUT`, `POST`).

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::point3orless/*"
    },
    {
      "Sid": "AllowPutAndPostAccessForSpecificDomain",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:PutObject", "s3:PostObject"],
      "Resource": "arn:aws:s3:::point3orless/*",
      "Condition": {
        "StringLike": {
          "aws:Referer": "https://example.com/*"
        }
      }
    }
  ]
}
```

### **6. CORS Configuration for All Methods (GET, POST, PUT, DELETE, etc.)**

This CORS configuration allows all HTTP methods from any domain to access the S3 bucket, making it more flexible for web applications with various needs.

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": []
  }
]
```

---

### Notes:

- Replace `point3orless` with your actual S3 bucket name.
- Replace `example.com` with the domain you wish to allow for `PUT` and `POST` (upload) access.
- The `aws:Referer` condition is used to restrict which domain can perform actions like uploading files. It can be changed to any other condition that suits your use case (e.g., restricting based on IP address or other headers).
