@echo off
echo ========================================
echo EventEase MongoDB Setup Script
echo ========================================
echo.

echo Checking if MongoDB is installed...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo MongoDB found! Checking if it's running...
netstat -an | findstr :27017 >nul
if %errorlevel% equ 0 (
    echo MongoDB is already running on port 27017
    echo.
    echo You can now start the EventEase application:
    echo 1. cd MERN/EventEase/backend
    echo 2. npm run dev
    echo 3. In another terminal: cd MERN/EventEase/frontend && npm run dev
    echo.
    pause
    exit /b 0
)

echo MongoDB is not running. Attempting to start it...
echo.

echo Trying to start MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo Successfully started MongoDB service!
    echo.
    echo You can now start the EventEase application:
    echo 1. cd MERN/EventEase/backend
    echo 2. npm run dev
    echo 3. In another terminal: cd MERN/EventEase/frontend && npm run dev
    echo.
    pause
    exit /b 0
)

echo Could not start MongoDB service. Trying manual start...
echo.
echo Starting MongoDB manually...
echo This will keep running. Keep this window open while using the app.
echo.
mongod --dbpath "C:\data\db" 