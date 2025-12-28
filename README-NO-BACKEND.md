# No-Backend Registration System for Dingolay 2026

This version works **without a backend server** by using:
1. **Stripe Payment Links** - For payment processing (no backend needed!)
2. **Formspree/EmailJS/Google Sheets** - For data storage (no backend needed!)

## Setup Instructions

### Option 1: Stripe Payment Links (Easiest - Recommended)

1. **Create a Stripe Account**
   - Go to https://stripe.com and create an account
   - Get your publishable key from https://dashboard.stripe.com/apikeys

2. **Create a Payment Link**
   - Go to Stripe Dashboard → Products → Payment Links
   - Create a new payment link for £25.00
   - Copy the payment link URL (looks like: `https://buy.stripe.com/xxxxx`)

3. **Update `register-simple.js`**
   - Replace `YOUR_STRIPE_PUBLISHABLE_KEY` with your publishable key
   - Replace the payment link URL in the `createCheckoutSession` function

4. **Set up Data Storage** (choose one):

#### A. Formspree (Easiest for data storage)
- Go to https://formspree.io and create a free account
- Create a new form
- Copy your form endpoint (looks like: `https://formspree.io/f/YOUR_FORM_ID`)
- Replace `YOUR_FORMSPREE_ENDPOINT` in `register-simple.js`
- All submissions will be sent to your Formspree inbox and can be exported to CSV

#### B. EmailJS (Sends data via email)
- Go to https://www.emailjs.com and create a free account
- Set up an email service (Gmail, Outlook, etc.)
- Create an email template
- Get your Service ID, Template ID, and Public Key
- Replace the EmailJS variables in `register-simple.js`
- Update the `to_email` in the `saveToEmailJS` function

#### C. Google Sheets (Stores in spreadsheet)
- Create a Google Sheet
- Go to Extensions → Apps Script
- Create a web app that accepts POST requests
- Deploy it and get the URL
- Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` in `register-simple.js`

### Option 2: Stripe Checkout (Requires small backend)

If you prefer Stripe Checkout over Payment Links, you'll need a small backend endpoint. You can use:
- **Netlify Functions** (free tier)
- **Vercel Functions** (free tier)
- **Cloudflare Workers** (free tier)

See the original `server.js` for the backend code needed.

## File Structure

```
├── register-simple.html    # Registration form (no backend version)
├── register-simple.js      # Frontend JavaScript
└── README-NO-BACKEND.md    # This file
```

## How It Works

1. User fills out the registration form
2. Form data is saved to Formspree/EmailJS/Google Sheets
3. User is redirected to Stripe Payment Link
4. User completes payment on Stripe's secure page
5. User is redirected back to your site with success message

## Advantages of This Approach

✅ **No server to maintain** - Everything runs client-side  
✅ **Free hosting** - Can host on GitHub Pages, Netlify, Vercel, etc.  
✅ **Secure payments** - Handled by Stripe  
✅ **Easy setup** - Just add your API keys  
✅ **Scalable** - Stripe and Formspree handle the load  

## Limitations

⚠️ **Payment verification**: Since there's no backend, you'll need to manually verify payments in Stripe Dashboard  
⚠️ **Data security**: Form data is sent to third-party services (Formspree/EmailJS)  
⚠️ **No automatic confirmation**: You'll need to manually send confirmation emails or set up email automation  

## Testing

### Stripe Test Mode
- Use test mode keys from Stripe Dashboard
- Test card: `4242 4242 4242 4242`
- Any future expiry date, any 3-digit CVC

### Formspree Testing
- Formspree free tier allows 50 submissions/month
- Test submissions count toward the limit

## Production Checklist

- [ ] Replace all placeholder API keys
- [ ] Set up Stripe Payment Link
- [ ] Configure data storage (Formspree/EmailJS/Google Sheets)
- [ ] Test the full registration flow
- [ ] Set up email notifications (optional)
- [ ] Add terms and conditions page
- [ ] Add privacy policy page
- [ ] Test on mobile devices
- [ ] Set up monitoring/alerts for failed payments

## Support

- Stripe Documentation: https://stripe.com/docs
- Formspree Documentation: https://help.formspree.io
- EmailJS Documentation: https://www.emailjs.com/docs



