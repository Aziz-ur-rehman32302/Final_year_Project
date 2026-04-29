import os
import shutil
import ftplib

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_41775259"
FTP_PASS = "Aziz6426"

LOCAL_SRC = r"C:\xampp\htdocs\plaza_management_system_backend"
TEMP_DIR = r"D:\Plaza_Management_System\temp_backend_v2"
REMOTE_DIR = "htdocs/plaza_management_system_backend"

DB_HOST = "sql100.infinityfree.com"
DB_USER = "if0_41775259"
DB_PASS = "Aziz6426"
DB_NAME = "if0_41775259_plazadb"

CORS_HEADER_BLOCK = """<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
"""

print("Preparing updated backend files...")
if os.path.exists(TEMP_DIR):
    shutil.rmtree(TEMP_DIR)
shutil.copytree(LOCAL_SRC, TEMP_DIR)

for root, dirs, files in os.walk(TEMP_DIR):
    for file in files:
        if file.endswith(".php"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Remove existing CORS blocks if present to avoid duplication
            # This is a bit tricky, but let's try to find if it starts with <?php and inject after it
            if content.startswith("<?php"):
                # Remove common local CORS patterns we saw earlier
                content = content.replace('$allowed_origins = [', '//') # Disable old cors array
                
                # Check if we already injected our block
                if 'Access-Control-Allow-Origin' not in content:
                    content = content.replace("<?php", CORS_HEADER_BLOCK, 1)

            # Update DB credentials
            content = content.replace('new mysqli("localhost", "root", "", "plaza_db")', f'new mysqli("{DB_HOST}", "{DB_USER}", "{DB_PASS}", "{DB_NAME}")')
            content = content.replace("new mysqli('localhost', 'root', '', 'plaza_db')", f"new mysqli('{DB_HOST}', '{DB_USER}', '{DB_PASS}', '{DB_NAME}')")
            content = content.replace('$servername = "localhost";', f'$servername = "{DB_HOST}";')
            content = content.replace('$username = "root";', f'$username = "{DB_USER}";')
            content = content.replace('$password = "";', f'$password = "{DB_PASS}";')
            content = content.replace('$dbname = "plaza_db";', f'$dbname = "{DB_NAME}";')

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

def upload_dir(ftp, local_path, remote_path):
    try:
        ftp.mkd(remote_path)
    except: pass

    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        remote_item = f"{remote_path}/{item}"
        
        if os.path.isfile(local_item):
            print(f"Uploading {item}...")
            with open(local_item, 'rb') as f:
                try:
                    ftp.storbinary(f"STOR {remote_item}", f)
                except: pass
        elif os.path.isdir(local_item):
            upload_dir(ftp, local_item, remote_item)

try:
    print("Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    upload_dir(ftp, TEMP_DIR, REMOTE_DIR)
    ftp.quit()
    print("Upload complete!")
except Exception as e:
    print(f"FTP Error: {e}")
finally:
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
