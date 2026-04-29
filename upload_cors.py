import ftplib

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_41775259"
FTP_PASS = "Aziz6426"
LOCAL_FILE = r"D:\Plaza_Management_System\new_cors.php"
REMOTE_FILE = "htdocs/plaza_management_system_backend/cors_headers.php"

try:
    print("Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
    print("Login successful. Uploading cors_headers.php...")
    with open(LOCAL_FILE, 'rb') as f:
        ftp.storbinary(f"STOR {REMOTE_FILE}", f)
    ftp.quit()
    print("Upload complete!")
except Exception as e:
    print(f"FTP Error: {e}")
