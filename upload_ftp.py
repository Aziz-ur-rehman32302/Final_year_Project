import os
import shutil
import ftplib

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_41775259"
FTP_PASS = "Aziz6426"

LOCAL_SRC = r"C:\xampp\htdocs\plaza_management_system_backend"
TEMP_DIR = r"D:\Plaza_Management_System\temp_backend"
REMOTE_DIR = "htdocs/plaza_management_system_backend"

# Coordinates for InfinityFree database
DB_HOST = "sql100.infinityfree.com"
DB_USER = "if0_41775259"
DB_PASS = "Aziz6426"
DB_NAME = "if0_41775259_plazadb"

print("Copying backend to temp directory...")
if os.path.exists(TEMP_DIR):
    shutil.rmtree(TEMP_DIR)
shutil.copytree(LOCAL_SRC, TEMP_DIR)

print("Updating database credentials in PHP files...")
for root, dirs, files in os.walk(TEMP_DIR):
    for file in files:
        if file.endswith(".php"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Pattern 1: new mysqli("localhost", "root", "", "plaza_db")
            content = content.replace(
                'new mysqli("localhost", "root", "", "plaza_db")',
                f'new mysqli("{DB_HOST}", "{DB_USER}", "{DB_PASS}", "{DB_NAME}")'
            )
            content = content.replace(
                "new mysqli('localhost', 'root', '', 'plaza_db')",
                f"new mysqli('{DB_HOST}', '{DB_USER}', '{DB_PASS}', '{DB_NAME}')"
            )
            
            # Pattern 2: users.php style
            content = content.replace('$servername = "localhost";', f'$servername = "{DB_HOST}";')
            content = content.replace('$username = "root";', f'$username = "{DB_USER}";')
            content = content.replace('$password = "";', f'$password = "{DB_PASS}";')
            content = content.replace('$dbname = "plaza_db";', f'$dbname = "{DB_NAME}";')

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

def upload_dir(ftp, local_path, remote_path):
    print(f"Creating remote directory {remote_path}...")
    try:
        ftp.mkd(remote_path)
    except ftplib.error_perm as e:
        if not str(e).startswith('550'): 
            print(f"Error creating directory {remote_path}: {e}")

    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        remote_item = f"{remote_path}/{item}"
        
        if os.path.isfile(local_item):
            print(f"Uploading {item}...")
            with open(local_item, 'rb') as f:
                try:
                    ftp.storbinary(f"STOR {remote_item}", f)
                except Exception as e:
                    print(f"Failed to upload {item}: {e}")
        elif os.path.isdir(local_item):
            upload_dir(ftp, local_item, remote_item)

try:
    print("Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    print("Login successful.")
    
    upload_dir(ftp, TEMP_DIR, REMOTE_DIR)
    
    ftp.quit()
    print("Upload complete!")
except Exception as e:
    print(f"FTP Error: {e}")
finally:
    # Cleanup
    if os.path.exists(TEMP_DIR):
        print("Cleaning up temp directory...")
        shutil.rmtree(TEMP_DIR)
