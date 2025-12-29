// Simple Registration Form Handler
const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable submit button
    submitButton.disabled = true;
    errorMessage.classList.remove('active');
    successMessage.classList.remove('active');
    
    // Get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        if (key === 'workshops') {
            if (!data[key]) data[key] = [];
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        submitButton.disabled = false;
        return;
    }
    
    // Validate at least one workshop is selected
    const workshops = formData.getAll('workshops');
    if (workshops.length === 0) {
        errorText.textContent = 'Please select at least one workshop.';
        errorMessage.classList.add('active');
        submitButton.disabled = false;
        return;
    }
    
    // Simulate form submission (in a real scenario, this would send to a server)
    setTimeout(() => {
        // Show success message
        successMessage.classList.add('active');
        form.reset();
        submitButton.disabled = false;
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Log form data (for debugging - remove in production)
        console.log('Registration submitted:', data);
    }, 500);
});
