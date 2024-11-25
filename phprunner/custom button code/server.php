<?php
// Put your code here.

// $result["txt"] = $params["txt"]." world!";

$record = $button->getCurrentRecord();
// $result["email"]=$record["email"];

$email = $record["email"]; // Assuming "email" is a column in your table

// Prepare the cURL request
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://xu4z97vz6l.execute-api.us-east-2.amazonaws.com/v1/api/businesses-profiles/approval");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["email" => $email]));

// Execute the POST request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    // Optional: Handle success, e.g., show a message
    $result['response'] = "Approval request sent for email: " . $email;
}

// Close the cURL handle
curl_close($ch);

