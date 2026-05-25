// Carnival 2026 registration — sends details via WhatsApp
const WHATSAPP_NUMBER = '447507263547';

const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-button');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

const costumeLabels = {
    'helen-west': 'Helen of the West (Dingolay / Saint Lucia Masquerade) — £150',
    'jab-molasses': 'Jab Molasses (Lucy Mas 2026)',
    'black-jab': 'Team Black Jab — £135',
    'red-jab': 'Team Red Jab — £160',
    'king-jab': 'King Jab',
    'jab-jamet': 'Jab Jamet',
    'pi-banan': 'Pi-Banan — £150',
    'juicy-lucy': 'Juicy Lucy — £140',
    'virgie-alexander': 'Virgie Alexander — £140',
    'sensei-esteban': 'Sensei Esteban — £140',
    'undecided': 'Not sure yet — please advise'
};

function buildWhatsAppMessage(data) {
    const costume = costumeLabels[data.costumeSection] || data.costumeSection;
    const genderLabel = data.gender === 'male' ? 'Male' : data.gender === 'female' ? 'Female' : data.gender;
    const personal = [
        `Name: ${data.fullName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Gender: ${genderLabel}`
    ];
    if (data.socialMedia && data.socialMedia.trim()) {
        personal.push(`Social media: ${data.socialMedia.trim()}`);
    }

    const lines = [
        '🎭 *New Carnival 2026 Registration*',
        '',
        '*Personal details*',
        ...personal,
        '',
        '*Costume section*',
        costume,
        '',
        '*Emergency contact*',
        `${data.emergencyName} (${data.emergencyRelation})`,
        `Phone: ${data.emergencyPhone}`
    ];

    if (data.size) {
        lines.push('', `*Size:* ${data.size}`);
    }
    if (data.additionalInfo && data.additionalInfo.trim()) {
        lines.push('', '*Additional information*', data.additionalInfo.trim());
    }

    lines.push('', `_Submitted ${new Date().toLocaleString('en-GB')}_`);
    return lines.join('\n');
}

if (form && submitButton) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.classList.remove('active');
        successMessage.classList.remove('active');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        submitButton.disabled = true;
        submitButton.textContent = 'Opening WhatsApp...';

        const message = buildWhatsAppMessage(data);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        successMessage.classList.add('active');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = 'Send Registration via WhatsApp';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
