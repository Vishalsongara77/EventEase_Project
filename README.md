# 🎉 EventEase - Event Management Platform

A modern, full-stack event management application built with React, Node.js, and Express. EventEase allows users to discover, book, and manage events with an intuitive interface and robust backend API.

## 🚀 Live Demo

**Frontend:** [https://vishalsongara77.github.io/EventEase_Project](https://vishalsongara77.github.io/EventEase_Project)  
**Backend API:** [https://eventease-api.herokuapp.com](https://eventease-api.herokuapp.com)

## ✨ Features

### 🎫 User Features
- **Event Discovery**: Browse events by category, search, and filter
- **Easy Booking**: Book up to 2 seats per event with simple interface
- **User Dashboard**: Manage bookings, view history, and cancel reservations
- **Real-time Updates**: Live seat availability and booking status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 👑 Admin Features
- **Event Management**: Create, edit, and delete events
- **User Management**: View all registered users and their details
- **Analytics Dashboard**: Track bookings, revenue, and user statistics
- **Booking Oversight**: Monitor and manage all bookings

### 🔧 Technical Features
- **JWT Authentication**: Secure login/logout with token-based auth
- **Role-based Access**: Separate user and admin interfaces
- **JSON Database**: Simple, file-based data storage
- **RESTful API**: Clean, well-documented API endpoints
- **Modern UI**: Built with React, Tailwind CSS, and Heroicons

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

### Database
- **JSON File Storage** - Simple, file-based database
- **Data Persistence** - Automatic data saving and loading

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Vishalsongara77/EventEase_Project.git
cd EventEase_Project
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 3. Start the Application

#### Option 1: Using the Batch File (Windows)
```bash
# From the root directory
start-app.bat
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Start Backend
cd backend
node simple-server.js

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 👤 Default Credentials

### Admin Account
- **Email**: admin@eventease.com
- **Password**: admin123

### Test User Account
- **Email**: test@example.com
- **Password**: password123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Event Endpoints
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users

## 🏗️ Project Structure

```
EventEase/
├── backend/                 # Backend API server
│   ├── simple-server.js    # Main server file
│   ├── simple-db.js        # Database utilities
│   ├── simple-db.json      # JSON database file
│   ├── package.json        # Backend dependencies
│   └── createAdmin.js      # Admin user creation
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── start-app.bat          # Windows startup script
├── README.md              # Project documentation
└── .gitignore            # Git ignore rules
```

## 🚀 Deployment

### Frontend Deployment (GitHub Pages)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to GitHub Pages using GitHub Actions or manual upload

### Backend Deployment (Heroku/Railway)
1. Create a new app on Heroku or Railway
2. Connect your GitHub repository
3. Set environment variables if needed
4. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vishal Songara**
- GitHub: [@Vishalsongara77](https://github.com/Vishalsongara77)
- Email: vishal26songara@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the beautiful styling system
- Express.js team for the robust backend framework
- All contributors and supporters

---

⭐ **Star this repository if you found it helpful!** 