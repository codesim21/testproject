// Registration Form Handler with PDF Generation and Email
const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// EmailJS Configuration - REPLACE WITH YOUR CREDENTIALS
// Get these from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
const YOUR_EMAIL = 'your-email@example.com'; // Replace with your email address

// Stripe Payment Link - REPLACE WITH YOUR STRIPE PAYMENT LINK
// Create one at: https://dashboard.stripe.com/payment-links
// Format: https://buy.stripe.com/YOUR_LINK_ID
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_ID'; // Replace with your Stripe Payment Link

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Enable the submit button
submitButton.disabled = false;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
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
        submitButton.textContent = 'Submit Registration';
        return;
    }
    
    // Validate at least one workshop is selected
    const workshops = formData.getAll('workshops');
    if (workshops.length === 0) {
        errorText.textContent = 'Please select at least one workshop.';
        errorMessage.classList.add('active');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Registration';
        return;
    }
    
    try {
        // Generate PDF
        const pdfBlob = generatePDF(data);
        
        // Send email with PDF
        await sendEmailWithPDF(data, pdfBlob);
        
        // Show success message
        successMessage.classList.add('active');
        
        // Show and configure payment button
        const paymentLink = document.getElementById('payment-link');
        if (paymentLink && STRIPE_PAYMENT_LINK && STRIPE_PAYMENT_LINK !== 'https://buy.stripe.com/YOUR_PAYMENT_LINK_ID') {
            paymentLink.href = STRIPE_PAYMENT_LINK;
            paymentLink.style.display = 'inline-block';
        }
        
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Registration';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error submitting form:', error);
        errorText.textContent = 'There was an error submitting your registration. Please try again or contact us directly.';
        errorMessage.classList.add('active');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Registration';
    }
});

function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Dingolay 2026 Registration Form', margin, yPos);
    yPos += lineHeight * 2;
    
    // Personal Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Information', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.firstName} ${data.lastName}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Email: ${data.email}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Phone: ${data.phone}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Date of Birth: ${data.dateOfBirth}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Age Group: ${data.ageGroup}`, margin, yPos);
    yPos += lineHeight * 2;
    
    // Check if we need a new page
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    
    // Address Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Address Information', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Address: ${data.address}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`City: ${data.city}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Postcode: ${data.postcode}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Country: ${data.country}`, margin, yPos);
    yPos += lineHeight * 2;
    
    // Check if we need a new page
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    
    // Workshop Preferences
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Workshop Preferences', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const workshops = Array.isArray(data.workshops) ? data.workshops.join(', ') : data.workshops;
    doc.text(`Selected Workshops: ${workshops}`, margin, yPos);
    yPos += lineHeight;
    if (data.experience) {
        doc.text(`Experience Level: ${data.experience}`, margin, yPos);
        yPos += lineHeight;
    }
    if (data.additionalInfo) {
        const splitInfo = doc.splitTextToSize(`Additional Info: ${data.additionalInfo}`, maxWidth);
        doc.text(splitInfo, margin, yPos);
        yPos += lineHeight * splitInfo.length;
    }
    yPos += lineHeight;
    
    // Check if we need a new page
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    
    // Emergency Contact
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Emergency Contact', margin, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.emergencyName}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Phone: ${data.emergencyPhone}`, margin, yPos);
    yPos += lineHeight;
    doc.text(`Relationship: ${data.emergencyRelation}`, margin, yPos);
    yPos += lineHeight * 2;
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Submitted on: ${new Date().toLocaleString()}`, margin, doc.internal.pageSize.getHeight() - 10);
    
    // Generate PDF blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
}

async function sendEmailWithPDF(data, pdfBlob) {
    // Convert PDF blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
        };
        reader.onerror = reject;
    });
    reader.readAsDataURL(pdfBlob);
    const pdfBase64 = await base64Promise;
    
    // Prepare email template parameters
    const templateParams = {
        to_email: YOUR_EMAIL,
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        subject: `New Dingolay 2026 Registration - ${data.firstName} ${data.lastName}`,
        message: `
New Registration Received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Date of Birth: ${data.dateOfBirth}
Age Group: ${data.ageGroup}

Address: ${data.address}
City: ${data.city}
Postcode: ${data.postcode}
Country: ${data.country}

Workshops: ${Array.isArray(data.workshops) ? data.workshops.join(', ') : data.workshops}
Experience: ${data.experience || 'Not specified'}

Emergency Contact:
Name: ${data.emergencyName}
Phone: ${data.emergencyPhone}
Relationship: ${data.emergencyRelation}

Additional Info: ${data.additionalInfo || 'None'}

PDF attachment included.
        `,
        pdf_base64: pdfBase64,
        pdf_filename: `Dingolay2026_Registration_${data.firstName}_${data.lastName}_${Date.now()}.pdf`
    };
    
    // Send email via EmailJS
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS is not loaded. Please check your EmailJS configuration.');
    }
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}
