const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: [true, 'Please specify number of seats'],
        min: [1, 'Minimum 1 seat required'],
        max: [2, 'Maximum 2 seats allowed per booking']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    cancelledAt: {
        type: Date
    },
    cancellationReason: {
        type: String,
        maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
    }
});

// Virtual for formatted booking date
bookingSchema.virtual('formattedBookingDate').get(function() {
    return moment(this.bookingDate).format('DD-MMM-YYYY');
});

// Virtual for formatted cancellation date
bookingSchema.virtual('formattedCancellationDate').get(function() {
    return this.cancelledAt ? moment(this.cancelledAt).format('DD-MMM-YYYY') : null;
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Compound index to ensure unique user-event combinations
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema); 