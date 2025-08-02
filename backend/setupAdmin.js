const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const adminData = {
    name: 'Admin User',
    email: 'admin@eventease.com',
    password: 'admin123',
    phone: '+1234567890',
    role: 'admin'
};

async function setupAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        
        // Connect to MongoDB with longer timeout
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });
        
        console.log('✅ Connected to MongoDB successfully!');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminData);
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password:', adminData.password);
        console.log('👤 Role:', admin.role);
        console.log('\n🎉 You can now login with these credentials at http://localhost:5173');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure MongoDB is running:');
        console.log('   - Windows: net start MongoDB');
        console.log('   - Or start MongoDB service manually');
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed');
        }
        process.exit(0);
    }
}

setupAdmin(); 