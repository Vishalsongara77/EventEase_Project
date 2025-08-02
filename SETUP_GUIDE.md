# EventEase Setup Guide

## Prerequisites

### 1. Install MongoDB
You need MongoDB installed and running. Choose one of these options:

#### Option A: Install MongoDB Community Server
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

#### Option B: Use MongoDB Atlas (Cloud)
1. Go to: https://www.mongodb.com/atlas
2. Create free account and cluster
3. Get connection string
4. Update `.env` file with your connection string

#### Option C: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Install Node.js
- Download from: https://nodejs.org/
- Install with default settings

## Setup Instructions

### Step 1: Install Dependencies
```bash
# Backend
cd MERN/EventEase/backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env` in backend folder
2. Update MongoDB connection string if using Atlas

### Step 3: Start MongoDB
```bash
# If using local MongoDB
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### Step 4: Create Admin User
```bash
cd MERN/EventEase/backend
node setupAdmin.js
```

### Step 5: Start Application
```bash
# Terminal 1 - Backend
cd MERN/EventEase/backend
npm run dev

# Terminal 2 - Frontend
cd MERN/EventEase/frontend
npm run dev
```

## Admin Credentials
- **Email**: admin@eventease.com
- **Password**: admin123

## Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Troubleshooting

### Port 5000 Already in Use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
1. Check if MongoDB is running
2. Verify connection string in `.env`
3. Check firewall settings

### Frontend Issues
1. Clear node_modules and reinstall
2. Check if all dependencies are installed
3. Verify PostCSS configuration 