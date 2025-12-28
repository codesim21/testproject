// Stripe Payment Integration
// IMPORTANT: Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key
const stripe = Stripe('pk_test_51Sj51v9zveQG0qXccXtEQ9R2r32XswujVtcJBfAv2mTqujwDQkgYymMwLcDmXLGkkQUVUmQOXBynB7lL3xFgVVsp00iB7ZjxrR');
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
});

cardElement.mount('#card-element');

// Handle real-time validation errors from the card Element
cardElement.on('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');
const loadingDiv = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
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
        terms: formData.get('terms')
    };

    try {
        // Step 1: Create payment intent on your server
        // IMPORTANT: You need to create a backend endpoint for this
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 2500, // £25.00 in pence
                currency: 'gbp',
                registrationData: registrationData
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        // Step 2: Confirm payment with Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${registrationData.firstName} ${registrationData.lastName}`,
                    email: registrationData.email,
                    phone: registrationData.phone,
                    address: {
                        line1: registrationData.address,
                        city: registrationData.city,
                        postal_code: registrationData.postcode,
                        country: registrationData.country,
                    },
                },
            },
        });

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        // Step 3: Save registration to database
        if (paymentIntent.status === 'succeeded') {
            const saveResponse = await fetch('/api/save-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationData: registrationData,
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount,
                }),
            });

            if (!saveResponse.ok) {
                throw new Error('Payment succeeded but failed to save registration');
            }

            // Success!
            loadingDiv.classList.remove('active');
            successMessage.classList.add('active');
            form.reset();
            cardElement.clear();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

    } catch (error) {
        console.error('Error:', error);
        loadingDiv.classList.remove('active');
        errorText.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.classList.add('active');
        submitButton.disabled = false;
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});



