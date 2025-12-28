# Dingolay 2026 Registration System

This registration system includes a payment form with Stripe integration and database storage for registrations.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Stripe Account

1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Copy `.env.example` to `.env`
4. Add your Stripe keys to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

### 3. Update Frontend Stripe Key

Open `register.js` and replace `YOUR_STRIPE_PUBLISHABLE_KEY` with your actual Stripe publishable key from the `.env` file.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 5. Access the Registration Form

Navigate to `http://localhost:3000/register.html`

## Features

- ✅ Registration form with all required fields
- ✅ Stripe payment integration (£25 registration fee)
- ✅ Database storage (currently using JSON file, can be upgraded to MongoDB/PostgreSQL)
- ✅ Payment verification
- ✅ Form validation
- ✅ Responsive design

## Database Options

### Current Setup (JSON File)
The current setup uses a simple JSON file (`registrations.json`) to store registrations. This is fine for testing but not recommended for production.

### Production Database Options

1. **MongoDB** - Recommended for easy setup
2. **PostgreSQL** - More robust, better for complex queries
3. **Firebase** - Good for serverless setup
4. **Supabase** - PostgreSQL with built-in features

## Email Notifications

To send confirmation emails, you'll need to:
1. Set up an email service (SendGrid, Mailgun, AWS SES, etc.)
2. Add email configuration to `.env`
3. Uncomment and configure the email sending code in `server.js`

## Security Notes

⚠️ **Important for Production:**

1. Add authentication to the `/api/registrations` endpoint
2. Use environment variables for all sensitive data
3. Enable HTTPS in production
4. Add rate limiting
5. Add input validation and sanitization
6. Use a proper database instead of JSON file
7. Set up proper error logging
8. Add CSRF protection

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

## File Structure

```
├── register.html          # Registration form page
├── register.js           # Frontend payment handling
├── server.js             # Backend server (Node.js/Express)
├── package.json          # Node.js dependencies
├── .env                  # Environment variables (create from .env.example)
├── registrations.json    # Database file (created automatically)
└── README-REGISTRATION.md # This file
```

## Support

For issues or questions, check:
- Stripe Documentation: https://stripe.com/docs
- Express Documentation: https://expressjs.com/

