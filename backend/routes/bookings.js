const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const bookingLogger = require('../middleware/bookingLogger');
const moment = require('moment');

const router = express.Router();

// Apply booking logger middleware
router.use(bookingLogger);

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, numberOfSeats } = req.body;

        // Validate input
        if (!eventId || !numberOfSeats) {
            return res.status(400).json({
                success: false,
                message: 'Please provide event ID and number of seats'
            });
        }

        if (numberOfSeats < 1 || numberOfSeats > 2) {
            return res.status(400).json({
                success: false,
                message: 'You can only book 1 or 2 seats per event'
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is in the future
        if (new Date(event.date) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book for past or ongoing events'
            });
        }

        // Check if user already has a booking for this event
        const existingBooking = await Booking.findOne({
            user: req.user.id,
            event: eventId
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'You already have a booking for this event'
            });
        }

        // Check if enough seats are available
        if (event.bookedSeats + numberOfSeats > event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough seats available for this event'
            });
        }

        // Calculate total amount
        const totalAmount = event.price * numberOfSeats;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            numberOfSeats,
            totalAmount
        });

        // Update event booked seats
        await Event.findByIdAndUpdate(eventId, {
            $inc: { bookedSeats: numberOfSeats }
        });

        // Populate event details
        await booking.populate('event');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { user: req.user.id };
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookings = await Booking.find(filter)
            .populate('event')
            .sort({ bookingDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(filter);

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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking or is admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const booking = await Booking.findById(req.params.id)
            .populate('event');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check if event has started
        if (new Date(booking.event.date) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel booking for ongoing or completed events'
            });
        }

        // Update booking status
        booking.status = 'Cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = cancellationReason || 'Cancelled by user';

        await booking.save();

        // Update event booked seats
        await Event.findByIdAndUpdate(booking.event._id, {
            $inc: { bookedSeats: -booking.numberOfSeats }
        });

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});

module.exports = router; 