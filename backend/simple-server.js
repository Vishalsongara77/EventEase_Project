const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB, initDB } = require('./simple-db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        req.user = user;
        next();
    });
};

const validateEventData = (eventData) => {
    const requiredFields = ['title', 'description', 'category', 'location', 'date', 'time', 'capacity', 'price'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
        return { isValid: false, message: `Missing required fields: ${missingFields.join(', ')}` };
    }
    
    if (eventData.capacity <= 0 || eventData.price < 0) {
        return { isValid: false, message: 'Capacity and price must be positive values' };
    }
    
    return { isValid: true };
};

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'EventEase API is running',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const db = readDB();

        const existingUser = db.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDB(db);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();

        const user = db.users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

app.get('/api/events', (req, res) => {
    try {
        const db = readDB();
        const { category, search } = req.query;
        
        let filteredEvents = db.events;

        if (category) {
            filteredEvents = filteredEvents.filter(event => 
                event.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            data: filteredEvents,
            total: filteredEvents.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

app.get('/api/events/:id', (req, res) => {
    try {
        const db = readDB();
        const event = db.events.find(e => e.id === req.params.id || e._id === req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
});

app.post('/api/events', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const validation = validateEventData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const db = readDB();
        const newEvent = {
            id: Date.now().toString(),
            ...req.body,
            organizer: req.user.email,
            eventId: `EVT-${Date.now()}`,
            status: 'Upcoming',
            bookedSeats: 0,
            availableSeats: req.body.capacity,
            createdAt: new Date().toISOString()
        };

        db.events.push(newEvent);
        writeDB(db);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
});

app.put('/api/events/:id', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const db = readDB();
        const eventIndex = db.events.findIndex(e => e.id === req.params.id || e._id === req.params.id);
        
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const validation = validateEventData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        db.events[eventIndex] = {
            ...db.events[eventIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        writeDB(db);

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: db.events[eventIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const db = readDB();
        const eventIndex = db.events.findIndex(e => e.id === req.params.id || e._id === req.params.id);
        
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        db.events.splice(eventIndex, 1);
        writeDB(db);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
});

app.post('/api/bookings', authenticateToken, (req, res) => {
    try {
        const { eventId, numberOfSeats } = req.body;
        const db = readDB();

        const event = db.events.find(e => e.id === eventId || e._id === eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (numberOfSeats > 2) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 2 seats can be booked per event'
            });
        }

        if (event.availableSeats < numberOfSeats) {
            return res.status(400).json({
                success: false,
                message: 'Not enough seats available'
            });
        }

        const newBooking = {
            id: Date.now().toString(),
            user: req.user.id,
            event: eventId,
            numberOfSeats,
            totalAmount: event.price * numberOfSeats,
            status: 'Confirmed',
            bookingDate: new Date().toISOString()
        };

        db.bookings.push(newBooking);
        
        event.bookedSeats += numberOfSeats;
        event.availableSeats -= numberOfSeats;
        
        writeDB(db);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: newBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

app.get('/api/bookings', authenticateToken, (req, res) => {
    try {
        const db = readDB();
        const userBookings = db.bookings.filter(booking => booking.user === req.user.id);
        
        const bookingsWithEventDetails = userBookings.map(booking => {
            const event = db.events.find(e => e.id === booking.event || e._id === booking.event);
            return {
                ...booking,
                event: event || null
            };
        });

        res.json({
            success: true,
            data: bookingsWithEventDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

app.put('/api/bookings/:id/cancel', authenticateToken, (req, res) => {
    try {
        const db = readDB();
        const booking = db.bookings.find(b => b.id === req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'Cancelled';
        
        const event = db.events.find(e => e.id === booking.event || e._id === booking.event);
        if (event) {
            event.bookedSeats -= booking.numberOfSeats;
            event.availableSeats += booking.numberOfSeats;
        }
        
        writeDB(db);

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});

app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const db = readDB();
        
        const totalUsers = db.users.length;
        const totalEvents = db.events.length;
        const totalBookings = db.bookings.length;
        const confirmedBookings = db.bookings.filter(b => b.status === 'Confirmed').length;
        const cancelledBookings = db.bookings.filter(b => b.status === 'Cancelled').length;
        
        const totalRevenue = db.bookings
            .filter(b => b.status === 'Confirmed')
            .reduce((sum, booking) => sum + booking.totalAmount, 0);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalEvents,
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const db = readDB();
        const usersWithoutPassword = db.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt
        }));

        res.json({
            success: true,
            data: usersWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Simple EventEase server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎉 Frontend: http://localhost:5174`);
}); 