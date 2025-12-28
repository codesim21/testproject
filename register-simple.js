// No-Backend Registration System
// Uses Stripe Checkout (hosted payment page) and Formspree/Email for data storage

// OPTION 1: Using Stripe Checkout (Recommended - No backend needed!)
// Replace with your Stripe publishable key
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// OPTION 2: Using Formspree for form submission (Free tier available)
// Get your form endpoint from https://formspree.io
const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT'; // e.g., 'https://formspree.io/f/YOUR_FORM_ID'

// OPTION 3: Using EmailJS for email submissions (Free tier available)
// Get your service ID from https://www.emailjs.com
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');
const loadingDiv = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    loadingDiv.classList.add('active');
    errorMessage.classList.remove('active');
    successMessage.classList.remove('active');

    // Collect form data
    const formData = new FormData(form);
    const registrationData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        ageGroup: formData.get('ageGroup'),
        address: formData.get('address'),
        city: formData.get('city'),
        postcode: formData.get('postcode'),
        country: formData.get('country'),
        workshops: Array.from(form.querySelectorAll('input[name="workshops"]:checked')).map(cb => cb.value),
        experience: formData.get('experience'),
        additionalInfo: formData.get('additionalInfo'),
        emergencyName: formData.get('emergencyName'),
        emergencyPhone: formData.get('emergencyPhone'),
        emergencyRelation: formData.get('emergencyRelation'),
        timestamp: new Date().toISOString()
    };

    try {
        // STEP 1: Save registration data first (before payment)
        // Choose one of these options:

        // OPTION A: Using Formspree (Recommended for no-backend)
        await saveToFormspree(registrationData);

        // OPTION B: Using EmailJS
        // await saveToEmailJS(registrationData);

        // OPTION C: Using Google Sheets (via Google Apps Script)
        // await saveToGoogleSheets(registrationData);

        // STEP 2: Redirect to Stripe Checkout
        const checkoutSession = await createCheckoutSession(registrationData);
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSession.id
        });

        if (error) {
            throw new Error(error.message);
        }

    } catch (error) {
        console.error('Error:', error);
        loadingDiv.classList.remove('active');
        errorText.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.classList.add('active');
        submitButton.disabled = false;
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Create Stripe Checkout Session
// NOTE: This still requires a small backend endpoint OR use Stripe Payment Links
async function createCheckoutSession(registrationData) {
    // OPTION 1: Use Stripe Payment Links (No backend needed!)
    // Create a payment link in Stripe Dashboard and redirect to it:
    const paymentLink = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_ID';
    window.location.href = paymentLink;
    return; // This will redirect, so we won't reach here

    // OPTION 2: Create checkout session via backend (requires small API)
    // Uncomment if you have a backend endpoint:
    /*
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 2500, // £25.00 in pence
            currency: 'gbp',
            customerEmail: registrationData.email,
            metadata: registrationData
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create checkout session');
    }

    return await response.json();
    */
}

// Save to Formspree
async function saveToFormspree(data) {
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === 'YOUR_FORMSPREE_ENDPOINT') {
        console.warn('Formspree endpoint not configured');
        return;
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _subject: `Dingolay 2026 Registration - ${data.firstName} ${data.lastName}`,
            _replyto: data.email,
            ...data
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to save registration data');
    }
}

// Save to EmailJS
async function saveToEmailJS(data) {
    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.warn('EmailJS not configured');
        return;
    }

    // Load EmailJS library if not already loaded
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);
        await new Promise((resolve) => {
            script.onload = resolve;
        });
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
            to_email: 'your-email@example.com', // Your email
            from_name: `${data.firstName} ${data.lastName}`,
            from_email: data.email,
            message: JSON.stringify(data, null, 2),
            subject: `Dingolay 2026 Registration - ${data.firstName} ${data.lastName}`
        }
    );
}

// Save to Google Sheets (requires Google Apps Script setup)
async function saveToGoogleSheets(data) {
    // This requires setting up a Google Apps Script web app
    // See README for instructions
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Note: no-cors mode means we can't check response
    console.log('Data sent to Google Sheets');
}

// Handle return from Stripe Checkout
// Check if we're returning from a successful payment
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('session_id')) {
    // Payment was successful
    successMessage.classList.add('active');
    form.style.display = 'none';
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}



