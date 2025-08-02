# EventEase Backend API

A comprehensive Node.js + Express + MongoDB backend for the EventEase event booking platform.

## Features

- **Authentication**: JWT-based user registration and login
- **Role-based Access**: User and Admin roles with proper authorization
- **Event Management**: CRUD operations for events with custom event ID generation
- **Booking System**: Book up to 2 seats per event with validation
- **Admin Dashboard**: Complete admin panel with statistics and attendee management
- **Custom Middleware**: Booking activity logging with user and timestamp info
- **Date Formatting**: Consistent DD-MMM-YYYY format across the application

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Date Handling**: Moment.js
- **Validation**: Built-in Mongoose validation

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eventease
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/update-profile` | Update user profile | Private |

### Events (Public)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/events` | Get all events with filtering | Public |
| GET | `/api/events/:id` | Get single event | Public |
| GET | `/api/events/category/:category` | Get events by category | Public |
| GET | `/api/events/upcoming` | Get upcoming events | Public |
| GET | `/api/events/categories` | Get all categories | Public |

### Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/bookings` | Create new booking | Private |
| GET | `/api/bookings` | Get user's bookings | Private |
| GET | `/api/bookings/:id` | Get single booking | Private |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Private |

### Admin Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/admin/events` | Create new event | Admin |
| PUT | `/api/admin/events/:id` | Update event | Admin |
| DELETE | `/api/admin/events/:id` | Delete event | Admin |
| GET | `/api/admin/events` | Get all events (admin view) | Admin |
| GET | `/api/admin/events/:id/attendees` | Get event attendees | Admin |
| GET | `/api/admin/dashboard` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |

## Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Create Event (Admin)
```json
POST /api/admin/events
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "category": "Tech",
  "location": "Convention Center",
  "locationType": "In-Person",
  "date": "2025-08-15",
  "time": "09:00",
  "duration": 480,
  "capacity": 200,
  "price": 50
}

Response:
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "eventId": "EVT-AUG2025-X4T",
    "title": "Tech Conference 2025",
    "status": "Upcoming",
    ...
  }
}
```

### Create Booking
```json
POST /api/bookings
{
  "eventId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "numberOfSeats": 2
}

Response:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "user": "60f7b3b3b3b3b3b3b3b3b3b3",
    "event": "60f7b3b3b3b3b3b3b3b3b3b3",
    "numberOfSeats": 2,
    "totalAmount": 100,
    "status": "Confirmed"
  }
}
```

## Custom Event ID Format

Events are automatically assigned custom IDs in the format:
`EVT-[MMM][YYYY]-[Random3]`

Example: `EVT-AUG2025-X4T`

## Booking Validation Rules

1. Users can book maximum 2 seats per event
2. Users cannot book for the same event twice
3. Users cannot book for past or ongoing events
4. Bookings can only be cancelled before the event starts
5. Event capacity cannot be reduced below already booked seats

## Middleware

### Authentication Middleware
- `protect`: Requires valid JWT token
- `authorize`: Role-based access control
- `optionalAuth`: Optional authentication for public routes

### Custom Booking Logger
Logs all new booking activities with:
- Timestamp
- User information
- Event details
- IP address
- User agent

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

- **Development server**: `npm run dev` (uses nodemon)
- **Production server**: `npm start`
- **Port**: 5000 (configurable via PORT environment variable)

## Database Schema

### User
- name, email, password, role, phone, createdAt

### Event
- eventId, title, description, category, location, locationType
- date, time, duration, capacity, bookedSeats, price
- image, organizer, status, createdAt, updatedAt

### Booking
- user, event, numberOfSeats, totalAmount, status
- bookingDate, cancelledAt, cancellationReason 