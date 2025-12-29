// Backend Server for Registration and Payment Processing
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (works on both Vercel and local)
// On Vercel, files are in the same directory as server.js
const staticPath = __dirname;

// Log for debugging (remove in production)
if (process.env.VERCEL) {
    console.log('Static path on Vercel:', staticPath);
    console.log('Files in directory:', fs.readdirSync(staticPath).slice(0, 10));
}

app.use(express.static(staticPath, {
    setHeaders: (res, filePath) => {
        // Set correct MIME types
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (filePath.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
        } else if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
        }
    }
}));

// Serve HTML pages
const basePath = __dirname;

app.get('/', (req, res) => {
    res.sendFile(path.join(basePath, 'index.html'));
});

app.get('/dingolay.html', (req, res) => {
    res.sendFile(path.join(basePath, 'dingolay.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(basePath, 'register.html'));
});

// JSON file storage
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

function saveRegistration(registration) {
    const registrations = readRegistrations();
    registrations.push({
        ...registration,
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync(registrationsFile, JSON.stringify(registrations, null, 2));
}

// API Routes
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'gbp', registrationData } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            metadata: {
                email: registrationData.email || '',
                name: registrationData.firstName + ' ' + registrationData.lastName || ''
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/save-registration', (req, res) => {
    try {
        const registration = req.body;
        saveRegistration(registration);
        res.json({ success: true, message: 'Registration saved successfully' });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/registrations', (req, res) => {
    try {
        const registrations = readRegistrations();
        res.json(registrations);
    } catch (error) {
        console.error('Error reading registrations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server (only if not in Vercel serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
