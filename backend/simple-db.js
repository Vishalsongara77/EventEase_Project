const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple JSON database
const DB_FILE = path.join(__dirname, 'simple-db.json');

// Initialize database
function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = {
            users: [],
            events: [],
            bookings: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read database
function readDB() {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Create admin user
async function createAdminUser() {
    const db = readDB();
    
    // Check if admin already exists
    const existingAdmin = db.users.find(user => user.email === 'admin@eventease.com');
    if (existingAdmin) {
        console.log('✅ Admin user already exists!');
        console.log('Email:', existingAdmin.email);
        console.log('Role:', existingAdmin.role);
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = {
        id: Date.now().toString(),
        name: 'Admin User',
        email: 'admin@eventease.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        createdAt: new Date().toISOString()
    };

    db.users.push(adminUser);
    writeDB(db);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@eventease.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('\n🎉 You can now login with these credentials at http://localhost:5173');
}

// Create some sample events
function createSampleEvents() {
    const db = readDB();
    
    if (db.events.length > 0) {
        console.log('ℹ️  Sample events already exist!');
        return;
    }

            const sampleEvents = [
            {
                id: Date.now().toString(),
                title: 'Tech Conference 2024',
                description: 'Join us for the biggest tech conference of the year!',
                category: 'Technology',
                location: 'Convention Center',
                locationType: 'Indoor',
                date: '2024-12-15',
                time: '09:00',
                duration: 8,
                capacity: 200,
                price: 150,
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500',
                organizer: 'admin@eventease.com',
                eventId: 'EVT-DEC-2024-001',
                status: 'Upcoming',
                bookedSeats: 0,
                availableSeats: 200,
                createdAt: new Date().toISOString()
            },
            {
                id: (Date.now() + 1).toString(),
                title: 'Music Festival',
                description: 'A day filled with amazing music and performances!',
                category: 'Music',
                location: 'Central Park',
                locationType: 'Outdoor',
                date: '2024-11-20',
                time: '14:00',
                duration: 6,
                capacity: 500,
                price: 75,
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
                organizer: 'admin@eventease.com',
                eventId: 'EVT-NOV-2024-002',
                status: 'Upcoming',
                bookedSeats: 0,
                availableSeats: 500,
                createdAt: new Date().toISOString()
            }
        ];

    db.events.push(...sampleEvents);
    writeDB(db);

    console.log('✅ Sample events created successfully!');
}

// Main function
async function setupSimpleDB() {
    try {
        console.log('🚀 Setting up simple database...');
        
        await createAdminUser();
        createSampleEvents();
        
        console.log('\n✅ Database setup complete!');
        console.log('📁 Database file:', DB_FILE);
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
    }
}

// Export functions for use in other files
module.exports = {
    initDB,
    readDB,
    writeDB,
    setupSimpleDB
};

// Run if called directly
if (require.main === module) {
    setupSimpleDB();
} 