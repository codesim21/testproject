// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Gallery image lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const allLightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox]'));
let currentLightboxIndex = -1;
let currentLightboxGroup = [];

const updateLightboxNavVisibility = () => {
    if (!lightboxPrev || !lightboxNext) return;
    const shouldShowNav = currentLightboxGroup.length > 1;
    lightboxPrev.style.display = shouldShowNav ? '' : 'none';
    lightboxNext.style.display = shouldShowNav ? '' : 'none';
};

const showLightboxImage = (index) => {
    if (!lightbox || !lightboxImage || currentLightboxGroup.length === 0) return;
    if (index < 0) {
        index = currentLightboxGroup.length - 1;
    } else if (index >= currentLightboxGroup.length) {
        index = 0;
    }
    currentLightboxIndex = index;
    const trigger = currentLightboxGroup[currentLightboxIndex];
    const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
    const src = trigger.dataset.lightbox || trigger.dataset.full || (img ? img.src : '');
    if (!src) return;
    lightboxImage.src = src;
    lightboxImage.alt = img ? img.alt : 'Gallery image';
    updateLightboxNavVisibility();
};

const openLightbox = (trigger) => {
    if (!lightbox || !lightboxImage) return;
    const groupName = trigger.dataset.lightboxGroup || 'default';
    currentLightboxGroup = allLightboxTriggers.filter(el => (el.dataset.lightboxGroup || 'default') === groupName);
    const index = currentLightboxGroup.indexOf(trigger);
    showLightboxImage(index >= 0 ? index : 0);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    document.body.style.overflow = '';
    currentLightboxIndex = -1;
    currentLightboxGroup = [];
    updateLightboxNavVisibility();
};

allLightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        if (typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        openLightbox(trigger);
    });
    if (trigger.tabIndex >= 0) {
        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(trigger);
            }
        });
    }
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') {
        closeLightbox();
    }
    if (event.key === 'ArrowLeft') {
        showLightboxImage(currentLightboxIndex - 1);
    }
    if (event.key === 'ArrowRight') {
        showLightboxImage(currentLightboxIndex + 1);
    }
});

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (event) => {
        event.stopPropagation();
        showLightboxImage(currentLightboxIndex - 1);
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (event) => {
        event.stopPropagation();
        showLightboxImage(currentLightboxIndex + 1);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature, .performance-card, .workshop-card, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
