@echo off
echo ========================================
echo EventEase Application Starter
echo ========================================
echo.

echo 🚀 Starting EventEase Application...
echo.

echo 📊 Starting Backend Server...
start "EventEase Backend" cmd /k "cd /d %~dp0backend && node simple-server.js"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🌐 Starting Frontend Server...
start "EventEase Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ EventEase is starting up!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo 👤 Admin Login:
echo    Email: admin@eventease.com
echo    Password: admin123
echo.
echo 🎉 Enjoy using EventEase!
echo.
pause 