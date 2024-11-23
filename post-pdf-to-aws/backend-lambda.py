import json
import base64
import boto3
import os
import time
import urllib.request

# Initialize S3 client
s3 = boto3.client('s3')
BUCKET_NAME = os.environ['S3_BUCKET']  # Ensure the bucket name is set in environment variables

# API endpoint for inserting the business document into the database
API_URL = "https://point3orless.com/api-business-documents/insert_business_documents.php"

def lambda_handler(event, context):
    try:
        # Log the incoming event for debugging
        print("Received event: ", json.dumps(event))

        # Ensure the body is present
        if 'body' not in event:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No body in the request'})
            }

        body = json.loads(event['body']) if event.get('isBase64Encoded') else event

        # Check if required fields are present in the body
        if 'fileInformation' not in body or 'body' not in body or 'email' not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }

        # Extract file details
        file_params = body['fileInformation']
        if 'fileName' not in file_params or 'fileType' not in file_params:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing file parameters'})
            }

        file_name = file_params['fileName']
        file_type = file_params['fileType']
        file_content = body['body']  # This should be the base64-encoded content
        user_email = body['email']

        # Debug: Print the base64 string length to check if it's valid
        print(f"Base64 content length: {len(file_content)}")

        # Decode the base64 file content
        try:
            file_data = base64.b64decode(file_content)
            # Log the length of the decoded data to verify if it's non-empty
            print(f"Decoded file size: {len(file_data)} bytes")

        except Exception as e:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Failed to decode base64 content: {str(e)}'})
            }

        # Check if the decoded data is empty
        if len(file_data) == 0:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Decoded file data is empty'})
            }

        # Add epoch time to the file name to ensure uniqueness
        epoch_time = int(time.time())
        file_name_with_epoch = f"{file_name}_{epoch_time}"

        # Define the key (path) for the S3 object with the modified filename
        s3_key = f"{user_email}/{file_name_with_epoch}"

        # Upload the file to S3
        try:
            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=s3_key,
                Body=file_data,  # This must be bytes
                ContentType=file_type
            )
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f"Error uploading file to S3: {str(e)}"})
            }

        # Prepare the S3 URL
        s3_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"

        # Prepare data to be sent to the PHP API as JSON
        data = {
            'user_given_name': body['userGivenName'],
            'document_name': file_name,
            'document_link': s3_url,
            'business_id':  body['businessId'], # Replace with actual business ID if needed
            'business_email': user_email,
            # Include other required fields here based on the PHP API
        }

        # Convert the data to JSON
        json_data = json.dumps(data)

        # Create a request object with JSON headers
        headers = {
            'Content-Type': 'application/json'
        }
        
        request = urllib.request.Request(API_URL, data=json_data.encode(), headers=headers, method='POST')

        try:
            # Send the data to the PHP API
            with urllib.request.urlopen(request) as response:
                # Check if the response is successful (status code 200)
                if response.status == 200:
                    # Read and log the response from the PHP API
                    response_body = response.read().decode()
                    print("PHP API Response:", response_body)

                    # Return success response
                    return {
                        'statusCode': 200,
                        'body': json.dumps({
                            'message': 'Document added successfully',
                            's3Url': s3_url
                        })
                    }
                else:
                    return {
                        'statusCode': 500,
                        'body': json.dumps({'error': 'Error communicating with PHP API'})
                    }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f"Error sending data to PHP API: {str(e)}"})
            }

    except Exception as e:
        print("Error in processing: ", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f"An unexpected error occurred: {str(e)}"
            })
        }
