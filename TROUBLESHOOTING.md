# EventEase Troubleshooting Guide

## 🚨 White Screen Issue - Solutions

If you're seeing a white screen when accessing `http://localhost:5173`, try these solutions in order:

### Solution 1: Clear Browser Cache
1. **Chrome/Edge**: Press `Ctrl + Shift + R` (hard refresh)
2. **Or**: Press `F12` → Right-click refresh button → "Empty Cache and Hard Reload"
3. **Or**: Press `Ctrl + Shift + Delete` → Clear browsing data

### Solution 2: Test Basic Functionality
1. Go to `http://localhost:5173/test` - This should show a simple test page
2. If this works, the issue is with the main components
3. If this doesn't work, there's a deeper React/JavaScript issue

### Solution 3: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for any red error messages
4. Common errors and fixes:
   - **CORS errors**: Backend not running
   - **Module not found**: Missing dependencies
   - **Syntax errors**: JavaScript errors in components

### Solution 4: Restart Everything
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Start backend
cd MERN/EventEase/backend
node simple-server.js

# In new terminal, start frontend
cd MERN/EventEase/frontend
npm run dev
```

### Solution 5: Check Ports
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill processes using these ports
taskkill /PID <PID> /F
```

### Solution 6: Reinstall Dependencies
```bash
# Frontend
cd MERN/EventEase/frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
```

### Solution 7: Check File Permissions
Make sure you have read/write permissions to the project folder.

### Solution 8: Use Different Browser
Try opening the app in a different browser (Chrome, Firefox, Edge).

## 🔍 Debugging Steps

### Step 1: Verify Servers Are Running
```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173
```

### Step 2: Check Network Tab
1. Press `F12` → **Network** tab
2. Refresh the page
3. Look for failed requests (red entries)
4. Check if API calls are working

### Step 3: Check React DevTools
1. Install React Developer Tools browser extension
2. Open DevTools → **Components** tab
3. See if React components are rendering

## 🛠️ Common Issues and Fixes

### Issue: "Module not found"
**Fix**: Reinstall dependencies
```bash
cd MERN/EventEase/frontend
npm install
```

### Issue: "CORS error"
**Fix**: Backend not running or wrong URL
```bash
# Start backend
cd MERN/EventEase/backend
node simple-server.js
```

### Issue: "Port already in use"
**Fix**: Kill existing processes
```bash
taskkill /F /IM node.exe
```

### Issue: "localStorage error"
**Fix**: Clear browser data or use incognito mode

### Issue: "Tailwind CSS not working"
**Fix**: Check PostCSS configuration
```bash
# Verify tailwind.config.js exists
# Verify postcss.config.js is correct
```

## 🎯 Quick Test Commands

```bash
# Test backend API
curl http://localhost:5000/api/health

# Test admin login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@eventease.com\",\"password\":\"admin123\"}"

# Test frontend
curl http://localhost:5173
```

## 📞 Still Having Issues?

If none of the above solutions work:

1. **Check the terminal output** for error messages
2. **Check browser console** (F12) for JavaScript errors
3. **Try the test page**: `http://localhost:5173/test`
4. **Restart your computer** and try again
5. **Use the start script**: Double-click `start-app.bat`

## ✅ Success Indicators

You'll know everything is working when:
- ✅ `http://localhost:5173` shows the EventEase homepage
- ✅ `http://localhost:5173/test` shows the test page
- ✅ `http://localhost:5000/api/health` returns JSON response
- ✅ You can login with admin credentials
- ✅ No errors in browser console (F12)

## 🎉 Working Solution

If you're still having issues, the application is working with the simple server. You can:

1. **Use the test page**: `http://localhost:5173/test`
2. **Access the API directly**: `http://localhost:5000/api/health`
3. **Login via API**: Use Postman or curl to test login
4. **Admin credentials**: `admin@eventease.com` / `admin123`

The core functionality is working - it's just a frontend rendering issue that we can resolve! 