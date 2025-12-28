// Backend Server for Registration and Payment Processing with MongoDB
// This version uses MongoDB instead of JSON file storage

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Check if .env is loaded
console.log('Checking environment variables...');
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ ERROR: STRIPE_SECRET_KEY not found in environment variables');
    console.error('Please set STRIPE_SECRET_KEY in Vercel environment variables');
    // Don't exit in serverless environment - let it fail gracefully on API calls
    if (require.main === module) {
        process.exit(1);
    }
}

if (!process.env.MONGODB_URI) {
    console.warn('⚠️  WARNING: MONGODB_URI not found. Using JSON file storage as fallback.');
    console.warn('For production, set up MongoDB and add MONGODB_URI to .env file');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
let db;
let client;

// Connect to MongoDB
async function connectToMongoDB() {
    if (!process.env.MONGODB_URI) {
        console.log('MongoDB URI not provided, using JSON file fallback');
        return null;
    }

    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db(); // Uses database name from connection string
        console.log('✅ Connected to MongoDB successfully');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Falling back to JSON file storage');
        return null;
    }
}

// Initialize MongoDB connection (don't block on serverless)
connectToMongoDB().catch(err => {
    console.error('MongoDB connection failed:', err);
    // Continue without MongoDB
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files with correct MIME types
app.use(express.static('.', {
    setHeaders: (res, filePath) => {
        // Set correct MIME types for common file types
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Fallback: JSON file storage (if MongoDB not available)
const fs = require('fs');
const path = require('path');
const registrationsFile = path.join(__dirname, 'registrations.json');

if (!fs.existsSync(registrationsFile)) {
    fs.writeFileSync(registrationsFile, JSON.stringify([], null, 2));
}

function readRegistrations() {
    try {
        const data = fs.readFileSync(registrationsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save registration to MongoDB or JSON file
async function saveRegistration(registration) {
    const registrationData = {
        ...registration,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };

    // Try MongoDB first
    if (db) {
        try {
            const collection = db.collection('registrations');
            const result = await collection.insertOne(registrationData);
            console.log('✅ Registration saved to MongoDB:', result.insertedId);
            return { ...registrationData, _id: result.insertedId };
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
            // Fall through to JSON file
        }
    }

    // Fallback to JSON file
    const registrations = readRegistrations();
    registrations.push(registrationData);
    fs.writeFileSync(registrationsFile, JSON.stringify(registrations, null, 2));
    console.log('✅ Registration saved to JSON file');
    return registrationData;
}

// Get all registrations from MongoDB or JSON file
async function readAllRegistrations() {
    // Try MongoDB first
    if (db) {
        try {
            const collection = db.collection('registrations');
            const registrations = await collection.find({}).toArray();
            return registrations;
        } catch (error) {
            console.error('Error reading from MongoDB:', error);
            // Fall through to JSON file
        }
    }

    // Fallback to JSON file
    return readRegistrations();
}

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('ERROR: STRIPE_SECRET_KEY is not defined in .env file');
            return res.status(500).json({ 
                error: 'Server configuration error: Stripe secret key not found. Please check your .env file.' 
            });
        }

        const { amount, currency, registrationData } = req.body;

        console.log('Creating payment intent for amount:', amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in pence (£25.00 = 2500)
            currency: currency || 'gbp',
            metadata: {
                firstName: registrationData.firstName,
                lastName: registrationData.lastName,
                email: registrationData.email,
            },
        });

        console.log('Payment intent created successfully:', paymentIntent.id);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            code: error.code
        });
        res.status(500).json({ 
            error: error.message || 'Failed to create payment intent',
            details: error.type || 'Unknown error'
        });
    }
});

// Save Registration
app.post('/api/save-registration', async (req, res) => {
    try {
        const { registrationData, paymentIntentId, amount } = req.body;

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Save to database (MongoDB or JSON file)
        const savedRegistration = await saveRegistration({
            ...registrationData,
            paymentIntentId,
            amount,
            paymentStatus: 'completed',
        });

        // Send confirmation email (you'll need to set up email service like SendGrid, Mailgun, etc.)
        // await sendConfirmationEmail(registrationData.email, savedRegistration);

        res.json({ 
            success: true, 
            registrationId: savedRegistration.id || savedRegistration._id,
            message: 'Registration saved successfully' 
        });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all registrations (for admin use - add authentication in production!)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await readAllRegistrations();
        res.json(registrations);
    } catch (error) {
        console.error('Error reading registrations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: db ? 'MongoDB' : 'JSON file'
    });
});

// Serve HTML pages (after static middleware)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dingolay.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dingolay.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit(0);
});

// Start server (only if not in Vercel serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Make sure to set up your Stripe keys in .env file');
        if (db) {
            console.log('✅ Using MongoDB for data storage');
        } else {
            console.log('⚠️  Using JSON file for data storage (MongoDB not configured)');
        }
    });
}

// Export for Vercel serverless
module.exports = app;


