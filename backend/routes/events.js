const express = require('express');
const Event = require('../models/Event');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all events (public)
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            category,
            locationType,
            startDate,
            endDate,
            status,
            page = 1,
            limit = 10,
            search
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (locationType) {
            filter.locationType = locationType;
        }

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get events with pagination
        const events = await Event.find(filter)
            .populate('organizer', 'name email')
            .sort({ date: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
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
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
});

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
router.get('/category/:category', optionalAuth, async (req, res) => {
    try {
        const events = await Event.find({ 
            category: req.params.category,
            status: { $ne: 'Completed' }
        })
        .populate('organizer', 'name email')
        .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Get events by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events by category',
            error: error.message
        });
    }
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
router.get('/upcoming', optionalAuth, async (req, res) => {
    try {
        const events = await Event.find({ 
            status: 'Upcoming' 
        })
        .populate('organizer', 'name email')
        .sort({ date: 1 })
        .limit(6);

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming events',
            error: error.message
        });
    }
});

// @desc    Get event categories
// @route   GET /api/events/categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Event.distinct('category');
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

module.exports = router; 