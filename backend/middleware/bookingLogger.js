const moment = require('moment');

// Custom middleware to log booking activities
const bookingLogger = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
        // Only log successful booking creation
        if (req.method === 'POST' && req.path.includes('/bookings') && res.statusCode === 201) {
            try {
                const logData = {
                    timestamp: moment().format('DD-MMM-YYYY HH:mm:ss'),
                    user: req.user ? {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email
                    } : 'Anonymous',
                    action: 'NEW_BOOKING',
                    eventId: req.body.eventId || 'N/A',
                    numberOfSeats: req.body.numberOfSeats || 'N/A',
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent')
                };
                
                console.log('📝 BOOKING LOG:', JSON.stringify(logData, null, 2));
                
                // You could also save to a log file or database here
                // fs.appendFileSync('booking-logs.json', JSON.stringify(logData) + '\n');
            } catch (error) {
                console.error('Error in booking logger:', error);
            }
        }
        
        originalSend.call(this, data);
    };
    
    next();
};

module.exports = bookingLogger; 