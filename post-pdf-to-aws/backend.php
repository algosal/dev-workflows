<?php
// Assuming you're using PDO for database connection

include 'db/db.php';
// Create connection
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit();
}

// Assume the event data is received as JSON
$eventData = json_decode(file_get_contents('php://input'), true);

// echo $eventData;

// Check if all the required fields are present in the event
if(isset($eventData['document_name']) && isset($eventData['document_link']) && isset($eventData['business_id']) && isset($eventData['business_email'])) {
    $userGivenName = $eventData['user_given_name'];
    $documentName = $eventData['document_name'];
    $documentLink = $eventData['document_link'];
    $businessId = $eventData['business_id'];
    $businessEmail = $eventData['business_email'];

    // Insert the data into the 'business_documents' table
    $sql = "INSERT INTO business_documents (user_given_name,document_name, document_link, business_id, business_email) 
            VALUES (:user_given_name, :document_name, :document_link, :business_id, :business_email)";
    
    $stmt = $conn->prepare($sql);
    
    // Bind parameters
    $stmt->bindParam(':user_given_name', $userGivenName);
    $stmt->bindParam(':document_name', $documentName);
    $stmt->bindParam(':document_link', $documentLink);
    $stmt->bindParam(':business_id', $businessId);
    $stmt->bindParam(':business_email', $businessEmail);
    
    // Execute the statement
    if ($stmt->execute()) {
        echo "Data inserted successfully!";
    } else {
        echo "Error inserting data.";
    }
} else {
    echo "Required fields are missing!";
}

?>
