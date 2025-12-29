// Registration Form Handler - Disabled
const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');

// Disable form submission - button is unresponsive
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Do nothing - button is disabled
});

// Disable the submit button
submitButton.disabled = true;
