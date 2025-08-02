const mongoose = require('mongoose');
const moment = require('moment');

const eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide event category'],
        enum: ['Music', 'Tech', 'Business', 'Education', 'Sports', 'Arts', 'Food', 'Other']
    },
    location: {
        type: String,
        required: [true, 'Please provide event location']
    },
    locationType: {
        type: String,
        required: [true, 'Please specify location type'],
        enum: ['Online', 'In-Person', 'Hybrid']
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide event time']
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please provide event duration']
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide event capacity'],
        min: [1, 'Capacity must be at least 1']
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please provide event price'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        default: 'default-event.jpg'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate custom event ID before saving
eventSchema.pre('save', async function(next) {
    if (this.isNew) {
        const month = moment(this.date).format('MMM').toUpperCase();
        const year = moment(this.date).format('YYYY');
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        this.eventId = `EVT-${month}${year}-${random}`;
    }
    
    // Update status based on date
    const now = new Date();
    const eventDate = new Date(this.date);
    
    if (eventDate < now) {
        this.status = 'Completed';
    } else if (moment(eventDate).isSame(now, 'day')) {
        this.status = 'Ongoing';
    } else {
        this.status = 'Upcoming';
    }
    
    this.updatedAt = Date.now();
    next();
});

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
    return this.capacity - this.bookedSeats;
});

// Virtual for formatted date
eventSchema.virtual('formattedDate').get(function() {
    return moment(this.date).format('DD-MMM-YYYY');
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema); 