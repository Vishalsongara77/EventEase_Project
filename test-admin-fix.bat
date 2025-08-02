@echo off
echo ========================================
echo Testing Admin Dashboard Fix
echo ========================================
echo.

echo 🧪 Testing Admin Dashboard API Endpoints
echo.

echo 1️⃣ Testing Admin Login...
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eventease.com\",\"password\":\"admin123\"}"
echo.
echo.

echo 2️⃣ Testing Admin Dashboard Endpoint...
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NTQwMzc2Nzc3MDkiLCJlbWFpbCI6ImFkbWluQGV2ZW50ZWFzZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNDA2MzUsImV4cCI6MTc1NDY0NTQzNX0.GhnVUTc5lLDD_oE35aGg3UN4wCEAacO54sok09LENiE" http://localhost:5000/api/admin/dashboard
echo.
echo.

echo 3️⃣ Testing Admin Events Endpoint...
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NTQwMzc2Nzc3MDkiLCJlbWFpbCI6ImFkbWluQGV2ZW50ZWFzZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNDA2MzUsImV4cCI6MTc1NDY0NTQzNX0.GhnVUTc5lLDD_oE35aGg3UN4wCEAacO54sok09LENiE" http://localhost:5000/api/admin/events
echo.
echo.

echo 4️⃣ Testing Admin Users Endpoint...
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NTQwMzc2Nzc3MDkiLCJlbWFpbCI6ImFkbWluQGV2ZW50ZWFzZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTQwNDA2MzUsImV4cCI6MTc1NDY0NTQzNX0.GhnVUTc5lLDD_oE35aGg3UN4wCEAacO54sok09LENiE" http://localhost:5000/api/admin/users
echo.
echo.

echo 5️⃣ Testing Frontend Access...
echo Frontend URL: http://localhost:5173
echo Admin Dashboard: http://localhost:5173/admin
echo Admin Events: http://localhost:5173/admin/events
echo Admin Users: http://localhost:5173/admin/users
echo.

echo ✅ Admin Dashboard Fix Test Complete!
echo.
echo 📊 Expected Results:
echo - All API endpoints should return JSON data
echo - No "Unexpected token '<'" errors
echo - Admin dashboard should load properly
echo.
pause 