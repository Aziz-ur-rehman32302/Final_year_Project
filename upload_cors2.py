import ftplib

FTP_HOST = 'ftpupload.net'
FTP_USER = 'if0_41775259'
FTP_PASS = 'Aziz6426'

cors_content = """<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit(0);
}

header("Content-Type: application/json");
?>"""

with open('cors_headers_fix.php', 'w') as f:
    f.write(cors_content)

try:
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    print('Connected!')
    with open('cors_headers_fix.php', 'rb') as f:
        ftp.storbinary('STOR htdocs/plaza_management_system_backend/cors_headers.php', f)
    ftp.quit()
    print('CORS file uploaded successfully!')
except Exception as e:
    print(f'Error: {e}')

import os
if os.path.exists('cors_headers_fix.php'):
    os.remove('cors_headers_fix.php')
