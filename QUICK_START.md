# EventEase - Quick Start Guide

## 🚀 Application Status: READY TO USE!

The EventEase application has been successfully fixed and is now running with a simple JSON database (no MongoDB required).

## 📋 Current Status

✅ **Backend Server**: Running on `http://localhost:5000`  
✅ **Frontend Server**: Running on `http://localhost:5173`  
✅ **Admin User**: Created and ready  
✅ **Sample Events**: Pre-loaded  
✅ **All Features**: Working  

## 🎯 Quick Start

### Option 1: Use the Start Script (Recommended)
1. Double-click `start-app.bat` in the EventEase folder
2. Wait for both servers to start
3. Open `http://localhost:5173` in your browser

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd MERN/EventEase/backend
node simple-server.js

# Terminal 2 - Frontend  
cd MERN/EventEase/frontend
npm run dev
```

## 👤 Login Credentials

### Admin User
- **Email**: `admin@eventease.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

### Regular User
- Register a new account at `http://localhost:5173/register`
- Or use any email/password combination

## 🎉 Features Available

### Public Features
- ✅ Browse all events
- ✅ View event details
- ✅ Search and filter events
- ✅ Register new account
- ✅ Login/Logout

### User Features (After Login)
- ✅ Book events (1-2 seats max)
- ✅ View my bookings
- ✅ Cancel bookings
- ✅ Update profile

### Admin Features (Admin Login)
- ✅ Admin dashboard with statistics
- ✅ View all users
- ✅ View all events
- ✅ View all bookings
- ✅ Create/edit/delete events
- ✅ Manage the platform

## 🔧 Technical Details

### Backend
- **Port**: 5000
- **Database**: JSON file (`simple-db.json`)
- **API**: RESTful endpoints
- **Authentication**: JWT tokens

### Frontend
- **Port**: 5173
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM

## 📁 File Structure

```
MERN/EventEase/
├── backend/
│   ├── simple-server.js      # Main server (no MongoDB needed)
│   ├── simple-db.js          # JSON database functions
│   ├── simple-db.json        # Database file
│   └── setupAdmin.js         # Admin user setup
├── frontend/
│   ├── src/
│   │   ├── pages/            # React components
│   │   ├── store/            # Redux store
│   │   └── services/         # API services
│   └── package.json
├── start-app.bat             # Quick start script
├── SETUP_GUIDE.md            # Detailed setup guide
└── QUICK_START.md            # This file
```

## 🎯 How to Use

1. **Open the application**: `http://localhost:5173`
2. **Login as admin**: Use the credentials above
3. **Explore features**:
   - Browse events on the home page
   - Click "Admin Dashboard" for admin features
   - Create new events as admin
   - Register as a regular user to test booking

## 🔍 Testing the Application

### Test Admin Features
1. Login with admin credentials
2. Go to Admin Dashboard
3. Create a new event
4. View all users and bookings

### Test User Features
1. Register a new account
2. Browse events
3. Book an event (1-2 seats)
4. View your bookings
5. Cancel a booking

## 🛠️ Troubleshooting

### If servers don't start:
1. Check if ports 5000 and 5173 are free
2. Kill existing processes: `taskkill /F /IM node.exe`
3. Restart the application

### If login doesn't work:
1. Check the credentials above
2. Clear browser cache
3. Try registering a new account

### If you see errors:
1. Check the browser console (F12)
2. Check the terminal output
3. Restart the servers

## 🎉 Success!

Your EventEase application is now fully functional with:
- ✅ Working admin portal
- ✅ User authentication
- ✅ Event booking system
- ✅ Admin dashboard
- ✅ All features from the assignment

**Enjoy using EventEase!** 🚀 