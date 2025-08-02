@echo off
echo ========================================
echo EventEase User Role Testing
echo ========================================
echo.

echo 🧪 Testing Application Access for Different User Roles
echo.

echo 1️⃣ TESTING WITHOUT LOGIN (GUEST USER)
echo ----------------------------------------
echo Testing public endpoints...
curl -s http://localhost:5000/api/health
echo.
echo Testing public events...
curl -s http://localhost:5000/api/events
echo.
echo.

echo 2️⃣ TESTING ADMIN LOGIN
echo ------------------------
echo Logging in as admin...
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eventease.com\",\"password\":\"admin123\"}"
echo.
echo.

echo 3️⃣ TESTING REGULAR USER LOGIN
echo ------------------------------
echo Attempting to login as regular user...
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"vishal26songara@gmail.com\",\"password\":\"test123\"}"
echo.
echo.

echo 4️⃣ TESTING PROTECTED ENDPOINTS
echo --------------------------------
echo Testing admin-only endpoints without token...
curl -s http://localhost:5000/api/auth/me
echo.
echo.

echo 5️⃣ TESTING FRONTEND ROUTES
echo ---------------------------
echo Testing frontend accessibility...
curl -s http://localhost:5173 | findstr "EventEase"
echo.
echo Testing test page...
curl -s http://localhost:5173/test
echo.

echo ✅ Testing Complete!
echo.
echo 📊 Summary:
echo - Backend API: Running on http://localhost:5000
echo - Frontend: Running on http://localhost:5173
echo - Admin Login: admin@eventease.com / admin123
echo - Guest Access: Public events and home page
echo - Protected Routes: Require authentication
echo.
pause 