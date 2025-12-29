// Minimal Backend - Only handles Stripe payments and data storage
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// API Routes Only
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

// Export for Vercel serverless function
module.exports = app;
