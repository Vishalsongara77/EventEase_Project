# EventEase API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "token": "jwt_token"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Description**: Login with email and password
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "token": "jwt_token"
    }
  }
  ```

#### Get Current User
- **GET** `/auth/me`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "1234567890"
    }
  }
  ```

### Events (Public)

#### Get All Events
- **GET** `/events`
- **Description**: Get all events with filtering and pagination
- **Query Parameters**:
  - `category`: Filter by category (Music, Tech, Business, etc.)
  - `locationType`: Filter by location type (Online, In-Person, Hybrid)
  - `startDate`: Filter events from this date (YYYY-MM-DD)
  - `endDate`: Filter events until this date (YYYY-MM-DD)
  - `status`: Filter by status (Upcoming, Ongoing, Completed)
  - `search`: Search in title, description, or location
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "count": 5,
    "total": 25,
    "pagination": {
      "current": 1,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "data": [
      {
        "_id": "event_id",
        "eventId": "EVT-AUG2025-X4T",
        "title": "Tech Conference 2025",
        "description": "Annual technology conference",
        "category": "Tech",
        "location": "San Francisco",
        "locationType": "In-Person",
        "date": "2025-08-15T00:00:00.000Z",
        "time": "09:00",
        "duration": 480,
        "capacity": 100,
        "bookedSeats": 45,
        "price": 150,
        "status": "Upcoming",
        "availableSeats": 55
      }
    ]
  }
  ```

#### Get Single Event
- **GET** `/events/:id`
- **Description**: Get detailed information about a specific event
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "event_id",
      "eventId": "EVT-AUG2025-X4T",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "category": "Tech",
      "location": "San Francisco",
      "locationType": "In-Person",
      "date": "2025-08-15T00:00:00.000Z",
      "time": "09:00",
      "duration": 480,
      "capacity": 100,
      "bookedSeats": 45,
      "price": 150,
      "status": "Upcoming",
      "availableSeats": 55,
      "organizer": {
        "_id": "user_id",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
  ```

#### Get Upcoming Events
- **GET** `/events/upcoming`
- **Description**: Get upcoming events (limited to 6)
- **Response**:
  ```json
  {
    "success": true,
    "count": 6,
    "data": [...]
  }
  ```

#### Get Events by Category
- **GET** `/events/category/:category`
- **Description**: Get events filtered by category
- **Response**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [...]
  }
  ```

#### Get Categories
- **GET** `/events/categories`
- **Description**: Get all available event categories
- **Response**:
  ```json
  {
    "success": true,
    "data": ["Music", "Tech", "Business", "Education", "Sports", "Arts", "Food", "Other"]
  }
  ```

### Bookings (Protected)

#### Create Booking
- **POST** `/bookings`
- **Description**: Create a new booking for an event
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "eventId": "event_id",
    "numberOfSeats": 2
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "_id": "booking_id",
      "user": "user_id",
      "event": "event_id",
      "numberOfSeats": 2,
      "totalAmount": 300,
      "status": "Confirmed",
      "bookingDate": "2025-01-15T10:30:00.000Z"
    }
  }
  ```

#### Get User Bookings
- **GET** `/bookings`
- **Description**: Get current user's bookings
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status`: Filter by status (Confirmed, Cancelled)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "count": 3,
    "total": 5,
    "pagination": {
      "current": 1,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "data": [
      {
        "_id": "booking_id",
        "user": "user_id",
        "event": {
          "_id": "event_id",
          "title": "Tech Conference 2025",
          "eventId": "EVT-AUG2025-X4T",
          "date": "2025-08-15T00:00:00.000Z",
          "time": "09:00",
          "location": "San Francisco",
          "price": 150,
          "status": "Upcoming"
        },
        "numberOfSeats": 2,
        "totalAmount": 300,
        "status": "Confirmed",
        "bookingDate": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

#### Get Single Booking
- **GET** `/bookings/:id`
- **Description**: Get details of a specific booking
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "booking_id",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "event": {
        "_id": "event_id",
        "title": "Tech Conference 2025",
        "eventId": "EVT-AUG2025-X4T"
      },
      "numberOfSeats": 2,
      "totalAmount": 300,
      "status": "Confirmed",
      "bookingDate": "2025-01-15T10:30:00.000Z"
    }
  }
  ```

#### Cancel Booking
- **PUT** `/bookings/:id/cancel`
- **Description**: Cancel a booking
- **Headers**: `Authorization: Bearer <token>`
- **Body** (optional):
  ```json
  {
    "cancellationReason": "Changed my mind"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
      "_id": "booking_id",
      "status": "Cancelled",
      "cancelledAt": "2025-01-15T11:00:00.000Z",
      "cancellationReason": "Changed my mind"
    }
  }
  ```

### Admin Routes (Admin Only)

#### Create Event
- **POST** `/admin/events`
- **Description**: Create a new event
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**:
  ```json
  {
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "category": "Tech",
    "location": "San Francisco",
    "locationType": "In-Person",
    "date": "2025-08-15",
    "time": "09:00",
    "duration": 480,
    "capacity": 100,
    "price": 150,
    "image": "https://example.com/image.jpg"
  }
  ```

#### Update Event
- **PUT** `/admin/events/:id`
- **Description**: Update an existing event
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**: Same as create event (all fields optional)

#### Delete Event
- **DELETE** `/admin/events/:id`
- **Description**: Delete an event (only if no bookings exist)
- **Headers**: `Authorization: Bearer <admin_token>`

#### Get All Events (Admin View)
- **GET** `/admin/events`
- **Description**: Get all events with admin details
- **Headers**: `Authorization: Bearer <admin_token>`
- **Query Parameters**:
  - `status`: Filter by status
  - `category`: Filter by category
  - `page`: Page number
  - `limit`: Items per page

#### Get Event Attendees
- **GET** `/admin/events/:id/attendees`
- **Description**: Get list of attendees for an event
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**:
  ```json
  {
    "success": true,
    "event": {
      "id": "event_id",
      "title": "Tech Conference 2025",
      "eventId": "EVT-AUG2025-X4T",
      "date": "2025-08-15T00:00:00.000Z",
      "capacity": 100,
      "bookedSeats": 45,
      "availableSeats": 55
    },
    "count": 25,
    "data": [
      {
        "bookingId": "booking_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "1234567890"
        },
        "numberOfSeats": 2,
        "totalAmount": 300,
        "bookingDate": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

#### Get Dashboard Statistics
- **GET** `/admin/dashboard`
- **Description**: Get admin dashboard statistics
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalEvents": 25,
      "totalUsers": 150,
      "totalBookings": 300,
      "totalRevenue": 45000,
      "upcomingEvents": 10,
      "ongoingEvents": 2,
      "completedEvents": 13,
      "recentBookings": [...],
      "upcomingEventsList": [...]
    }
  }
  ```

#### Get All Users
- **GET** `/admin/users`
- **Description**: Get all users with their booking information
- **Headers**: `Authorization: Bearer <admin_token>`
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page

#### Get Single User
- **GET** `/admin/users/:id`
- **Description**: Get detailed information about a specific user
- **Headers**: `Authorization: Bearer <admin_token>`

#### Get All Bookings (Admin)
- **GET** `/admin/bookings`
- **Description**: Get all bookings across all users
- **Headers**: `Authorization: Bearer <admin_token>`
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Booking Rules

1. **Maximum Seats**: Users can book up to 2 seats per event
2. **Duplicate Prevention**: Users cannot book the same event twice
3. **Capacity Check**: Bookings are prevented if event is at full capacity
4. **Date Validation**: Cannot book for past or ongoing events
5. **Cancellation**: Can only cancel bookings for future events

## Event Status Logic

Events are automatically categorized based on their date:
- **Upcoming**: Event date is in the future
- **Ongoing**: Event date is today
- **Completed**: Event date has passed

## Custom Event ID Format

Events are automatically assigned custom IDs in the format:
`EVT-[MMM][YYYY]-[Random3]`

Example: `EVT-AUG2025-X4T`

## Date Format

All dates are returned in ISO 8601 format and should be formatted as `DD-MMM-YYYY` for display purposes.

## Testing with Postman

1. Import the following collection into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: JWT token received from login/register

### Sample Postman Collection

```json
{
  "info": {
    "name": "EventEase API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Get All Events",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/events",
              "host": ["{{baseUrl}}"],
              "path": ["events"]
            }
          }
        },
        {
          "name": "Get Single Event",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/events/:id",
              "host": ["{{baseUrl}}"],
              "path": ["events", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "event_id_here"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Bookings",
      "item": [
        {
          "name": "Create Booking",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"eventId\": \"event_id_here\",\n  \"numberOfSeats\": 2\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/bookings",
              "host": ["{{baseUrl}}"],
              "path": ["bookings"]
            }
          }
        },
        {
          "name": "Get User Bookings",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/bookings",
              "host": ["{{baseUrl}}"],
              "path": ["bookings"]
            }
          }
        }
      ]
    }
  ]
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Considerations

1. **JWT Tokens**: Store tokens securely and implement token refresh
2. **Password Hashing**: Passwords are hashed using bcrypt
3. **Input Validation**: All inputs are validated on the server side
4. **CORS**: Configure CORS properly for production
5. **Environment Variables**: Use environment variables for sensitive data

## Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set a strong JWT secret
4. Configure CORS for your domain
5. Use HTTPS
6. Implement rate limiting
7. Set up monitoring and logging 