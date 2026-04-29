<?php
// Centralized Database Connection File
// Project: Plaza Management System

$host = "localhost";
$dbname = "plaza_db"; // Apne database ka naam yahan likhen
$username = "root";   // Default XAMPP username root hota hai
$password = "";       // Default XAMPP password empty hota hai

try {
    // PDO Connection establish kar rahe hain
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Error mode set kar rahe hain taake issues debug ho saken
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Default fetch mode as Associative Array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Connection success message (sirf testing ke liye, prod mein band kar den)
    // echo "Connected successfully"; 

} catch(PDOException $e) {
    // Agar connection fail ho jaye toh JSON format mein error return kare
    header('Content-Type: application/json');
    die(json_encode([
        "status" => "error",
        "message" => "Database Connection Failed: " . $e->getMessage()
    ]));
}
?>
