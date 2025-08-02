# EventEase Setup Guide

## Quick Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventease
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d" > .env

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Database Setup

Make sure MongoDB is running locally or update the MONGODB_URI in the .env file to point to your MongoDB instance.

### 4. Create Admin User

To create an admin user, you can either:

1. **Manually update in database:**
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or register normally and update the role field**

### 5. Test the Application

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Browse events (if any exist)
4. Test booking functionality

## Default Admin Credentials

You can create an admin user by registering normally and then updating the role in the database to "admin".

## API Testing

The backend API will be available at http://localhost:5000/api

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands

## Common Issues

### MongoDB Connection
- Make sure MongoDB is running
- Check the MONGODB_URI in your .env file
- For MongoDB Atlas, use the connection string format: `mongodb+srv://username:password@cluster.mongodb.net/eventease`

### Port Conflicts
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Change ports in .env file if needed

### CORS Issues
- The backend is configured to allow requests from http://localhost:5173
- Update CORS settings in server.js if using different ports

## Development Tips

1. **Backend Development:**
   - Use `npm run dev` for development with nodemon
   - Check console logs for booking activity
   - Monitor MongoDB for data changes

2. **Frontend Development:**
   - Use `npm run dev` for development server
   - Check browser console for errors
   - Use Redux DevTools for state debugging

3. **Database:**
   - Use MongoDB Compass for visual database management
   - Monitor collections: users, events, bookings

## Production Deployment

1. **Backend:**
   - Set NODE_ENV=production
   - Use a production MongoDB instance
   - Deploy to Heroku, Railway, or Render

2. **Frontend:**
   - Run `npm run build`
   - Deploy the dist folder to Vercel, Netlify, or similar

## Support

If you encounter any issues:
1. Check the console logs
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review the main README.md for detailed documentation 