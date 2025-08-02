const express = require('express');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Create new event
// @route   POST /api/admin/events
// @access  Private (Admin only)
router.post('/events', async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            locationType,
            date,
            time,
            duration,
            capacity,
            price,
            image
        } = req.body;

        const event = await Event.create({
            title,
            description,
            category,
            location,
            locationType,
            date,
            time,
            duration,
            capacity,
            price,
            image,
            organizer: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (Admin only)
router.put('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event has bookings
        const bookings = await Booking.find({ event: req.params.id, status: 'Confirmed' });
        if (bookings.length > 0) {
            // If reducing capacity, check if it's less than booked seats
            if (req.body.capacity && req.body.capacity < event.bookedSeats) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot reduce capacity below ${event.bookedSeats} (already booked seats)`
                });
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin only)
router.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event has bookings
        const bookings = await Booking.find({ event: req.params.id });
        if (bookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete event with existing bookings'
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
});

// @desc    Get all events (admin view)
// @route   GET /api/admin/events
// @access  Private (Admin only)
router.get('/events', async (req, res) => {
    try {
        const {
            status,
            category,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const events = await Event.find(filter)
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Event.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: events.length,
            total,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                hasNext: skip + events.length < total,
                hasPrev: parseInt(page) > 1
            },
            data: events
        });
    } catch (error) {
        console.error('Get admin events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

// @desc    Get event attendees
// @route   GET /api/admin/events/:id/attendees
// @access  Private (Admin only)
router.get('/events/:id/attendees', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const bookings = await Booking.find({ 
            event: req.params.id,
            status: 'Confirmed'
        })
        .populate('user', 'name email phone')
        .sort({ bookingDate: 1 });

        const attendees = bookings.map(booking => ({
            bookingId: booking._id,
            user: booking.user,
            numberOfSeats: booking.numberOfSeats,
            totalAmount: booking.totalAmount,
            bookingDate: booking.bookingDate
        }));

        res.status(200).json({
            success: true,
            event: {
                id: event._id,
                title: event.title,
                eventId: event.eventId,
                date: event.date,
                capacity: event.capacity,
                bookedSeats: event.bookedSeats,
                availableSeats: event.availableSeats
            },
            count: attendees.length,
            data: attendees
        });
    } catch (error) {
        console.error('Get attendees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendees',
            error: error.message
        });
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
        const ongoingEvents = await Event.countDocuments({ status: 'Ongoing' });
        const completedEvents = await Event.countDocuments({ status: 'Completed' });

        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'Confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate('event', 'title eventId')
            .sort({ bookingDate: -1 })
            .limit(5);

        const upcomingEventsList = await Event.find({ status: 'Upcoming' })
            .sort({ date: 1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalEvents,
                totalUsers,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                upcomingEvents,
                ongoingEvents,
                completedEvents,
                recentBookings,
                upcomingEventsList
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
});

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find()
            .select('-password')
            .populate({
                path: 'bookings',
                select: 'event numberOfSeats bookingDate',
                populate: {
                    path: 'event',
                    select: 'title date'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                hasNext: skip + users.length < total,
                hasPrev: parseInt(page) > 1
            },
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// @desc    Get single user (admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate({
                path: 'bookings',
                select: 'event numberOfSeats bookingDate',
                populate: {
                    path: 'event',
                    select: 'title date'
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
router.get('/bookings', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('event', 'title eventId date')
            .sort({ bookingDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                hasNext: skip + bookings.length < total,
                hasPrev: parseInt(page) > 1
            },
            data: bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

module.exports = router; 