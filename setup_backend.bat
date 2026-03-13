@echo off
echo ========================================
echo   Plaza Management System - Backend Setup
echo ========================================
echo.

REM Check if XAMPP directory exists
if exist "C:\xampp\htdocs\" (
    echo ✅ XAMPP found at C:\xampp\htdocs\
    set "BACKEND_DIR=C:\xampp\htdocs\plaza_management_system_backend"
) else if exist "C:\wamp64\www\" (
    echo ✅ WAMP found at C:\wamp64\www\
    set "BACKEND_DIR=C:\wamp64\www\plaza_management_system_backend"
) else (
    echo ❌ Neither XAMPP nor WAMP found!
    echo Please install XAMPP or WAMP first.
    pause
    exit /b 1
)

echo.
echo Creating backend directory...
if not exist "%BACKEND_DIR%" (
    mkdir "%BACKEND_DIR%"
    echo ✅ Created directory: %BACKEND_DIR%
) else (
    echo ✅ Directory already exists: %BACKEND_DIR%
)

echo.
echo Copying backend files...

REM Copy files
copy "cors_headers.php" "%BACKEND_DIR%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copied cors_headers.php
) else (
    echo ❌ Failed to copy cors_headers.php
)

copy "fetch_all_issues.php" "%BACKEND_DIR%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copied fetch_all_issues.php
) else (
    echo ❌ Failed to copy fetch_all_issues.php
)

copy "unread_issues_count.php" "%BACKEND_DIR%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copied unread_issues_count.php
) else (
    echo ❌ Failed to copy unread_issues_count.php
)

copy "resolve_issue.php" "%BACKEND_DIR%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copied resolve_issue.php
) else (
    echo ❌ Failed to copy resolve_issue.php
)

copy "rent_collection_trends.php" "%BACKEND_DIR%\" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Copied rent_collection_trends.php
) else (
    echo ❌ Failed to copy rent_collection_trends.php
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend files copied to: %BACKEND_DIR%
echo.
echo Next steps:
echo 1. Make sure XAMPP/WAMP Apache is running
echo 2. Test: http://localhost/plaza_management_system_backend/fetch_all_issues.php
echo 3. Refresh your React application
echo.
echo The CORS errors should now be fixed!
echo.
pause