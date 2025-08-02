const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Admin user data
const adminData = {
    name: 'Admin User',
    email: 'admin@eventease.com',
    password: 'admin123',
    phone: '+1234567890',
    role: 'admin'
};

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminData);
        
        console.log('✅ Admin user created successfully!');
        console.log('Email:', admin.email);
        console.log('Password:', adminData.password);
        console.log('Role:', admin.role);
        console.log('\nYou can now login with these credentials.');
        
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin(); 