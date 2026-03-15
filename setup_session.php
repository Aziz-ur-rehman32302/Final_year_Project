<?php
// Simple session setup for testing
// Call this file first to establish a tenant session

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

session_start();

// Set tenant session (you can modify this for different tenants)
$tenant_id = $_GET['tenant_id'] ?? 'T-001';
$_SESSION['tenant_id'] = $tenant_id;

echo json_encode([
    'status' => 'success',
    'message' => 'Session established',
    'tenant_id' => $tenant_id,
    'session_id' => session_id()
]);
?>