// ===========================
// Navigation & Mobile Menu
// ===========================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInElements = document.querySelectorAll('.service-card, .product-card, .testimonial-card, .gallery-item, .feature-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
            }, index * 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeInElements.forEach(el => {
    observer.observe(el);
});

// ===========================
// Product Card Interactions
// ===========================
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    const button = card.querySelector('.btn-small');
    
    button.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        const productName = card.querySelector('h3').textContent;
        const productPriceText = card.querySelector('.product-price').textContent;
        const productPrice = parseInt(productPriceText.replace(/\D/g, ''));
        
        // Animation de confirmation
        const originalText = button.textContent;
        button.textContent = 'Traitement...';
        button.disabled = true;
        
        // Créer un modal de commande simple
        const orderModal = createOrderModal(productName, productPrice);
        document.body.appendChild(orderModal);
        
        // Restaurer le bouton
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
        
        // Effet de particules
        createParticles(button);
    });
});

// Fonction pour créer un modal de commande
function createOrderModal(productName, productPrice) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 24, 16, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h2 style="font-family: 'Playfair Display', serif; color: #6B4E3D; margin-bottom: 1rem;">
            Commander ${productName}
        </h2>
        <p style="color: #8B6F5C; margin-bottom: 1.5rem;">
            Prix: <strong style="color: #E8B4B4; font-size: 1.2rem;">${productPrice.toLocaleString()} Ar</strong>
        </p>
        <form id="orderForm">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #6B4E3D; font-weight: 600;">Nom complet</label>
                <input type="text" name="customerName" required style="width: 100%; padding: 0.8rem; border: 2px solid rgba(107, 78, 61, 0.2); border-radius: 8px; font-family: 'Lora', serif;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #6B4E3D; font-weight: 600;">Email</label>
                <input type="email" name="customerEmail" required style="width: 100%; padding: 0.8rem; border: 2px solid rgba(107, 78, 61, 0.2); border-radius: 8px; font-family: 'Lora', serif;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #6B4E3D; font-weight: 600;">Téléphone</label>
                <input type="tel" name="customerPhone" required style="width: 100%; padding: 0.8rem; border: 2px solid rgba(107, 78, 61, 0.2); border-radius: 8px; font-family: 'Lora', serif;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #6B4E3D; font-weight: 600;">Quantité</label>
                <input type="number" name="quantity" value="1" min="1" style="width: 100%; padding: 0.8rem; border: 2px solid rgba(107, 78, 61, 0.2); border-radius: 8px; font-family: 'Lora', serif;">
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #6B4E3D; font-weight: 600;">Message (optionnel)</label>
                <textarea name="message" rows="3" style="width: 100%; padding: 0.8rem; border: 2px solid rgba(107, 78, 61, 0.2); border-radius: 8px; font-family: 'Lora', serif; resize: vertical;"></textarea>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button type="submit" style="flex: 1; padding: 1rem; background: linear-gradient(135deg, #E8B4B4, #D4A088); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: 'Lora', serif;">
                    Confirmer la commande
                </button>
                <button type="button" class="close-modal" style="padding: 1rem 1.5rem; background: #8B6F5C; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-family: 'Lora', serif;">
                    Annuler
                </button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    
    // Animation d'apparition
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Gestion de la fermeture
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Gestion de la soumission du formulaire
    const orderForm = modal.querySelector('#orderForm');
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(orderForm);
        const orderData = {
            productName,
            productPrice,
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            quantity: parseInt(formData.get('quantity')) || 1,
            message: formData.get('message')
        };
        
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification(result.message || 'Commande enregistrée ! Nous vous contacterons bientôt.', 'success');
                closeModal();
            } else {
                throw new Error(result.message || 'Erreur lors de la commande');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de l\'envoi de la commande. Veuillez réessayer.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    return modal;
}

// Fonction pour créer des particules
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#E8B4B4', '#A5D6A7', '#F4D7D7', '#C9A88C'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}

// ===========================
// Gallery Lightbox Effect
// ===========================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Animation de zoom
        item.style.transition = 'transform 0.3s ease';
        item.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 300);
    });
});

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Animation du bouton
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    try {
        // Envoi des données au backend
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            submitBtn.textContent = 'Message envoyé ! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #A5D6A7, #8BC68A)';
            
            // Afficher un message de succès
            showNotification(result.message || 'Merci ! Votre message a été envoyé avec succès.', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        } else {
            throw new Error(result.message || 'Erreur lors de l\'envoi');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        submitBtn.textContent = 'Erreur, réessayez';
        submitBtn.style.background = 'linear-gradient(135deg, #E8B4B4, #D89898)';
        
        showNotification('Une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.', 'error');
    } finally {
        // Restaurer le bouton après 3 secondes
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
        }, 3000);
    }
});

// Fonction pour afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.padding = '1.5rem 2rem';
    
    if (type === 'success') {
        notification.style.background = '#A5D6A7';
    } else if (type === 'error') {
        notification.style.background = '#E8B4B4';
    } else {
        notification.style.background = '#F4D7D7';
    }
    
    notification.style.color = '#2C1810';
    notification.style.borderRadius = '15px';
    notification.style.boxShadow = '0 8px 32px rgba(107, 78, 61, 0.2)';
    notification.style.zIndex = '10000';
    notification.style.fontWeight = '600';
    notification.style.maxWidth = '400px';
    notification.textContent = message;
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    notification.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===========================
// Service Card Hover Effects
// ===========================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-icon');
        icon.style.animation = 'none';
        setTimeout(() => {
            icon.style.animation = 'bounce 0.6s ease';
        }, 10);
    });
});

// ===========================
// Parallax Effect for Hero Background
// ===========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// ===========================
// Testimonials Auto-rotate
// ===========================
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function highlightTestimonial() {
    testimonialCards.forEach((card, index) => {
        if (index === currentTestimonial) {
            card.style.transform = 'scale(1.05) translateY(-10px)';
            card.style.boxShadow = '0 16px 48px rgba(107, 78, 61, 0.25)';
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
    
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
}

// Démarrer la rotation automatique des témoignages
if (testimonialCards.length > 0) {
    setInterval(highlightTestimonial, 4000);
}

// ===========================
// Form Input Animations
// ===========================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = '';
    });
    
    // Animation on typing
    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            input.style.borderColor = '#A5D6A7';
        } else {
            input.style.borderColor = '';
        }
    });
});

// ===========================
// Page Load Animation
// ===========================
window.addEventListener('load', () => {
    // Ajouter une classe au body pour indiquer que la page est chargée
    document.body.classList.add('loaded');
    
    // Animation des éléments de la section hero
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, index * 150);
    });
});

// ===========================
// Dynamic Year in Footer
// ===========================
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
}

// ===========================
// Scroll Progress Indicator
// ===========================
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '0';
    indicator.style.left = '0';
    indicator.style.height = '3px';
    indicator.style.background = 'linear-gradient(90deg, #E8B4B4, #C9A88C)';
    indicator.style.zIndex = '9999';
    indicator.style.transition = 'width 0.1s ease';
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// ===========================
// Add Ripple Effect to Buttons
// ===========================
const buttons = document.querySelectorAll('.btn, .btn-small');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    });
});

// ===========================
// Lazy Loading for Images
// ===========================
const lazyImages = document.querySelectorAll('svg');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                entry.target.style.opacity = '1';
            }, 100);
            
            imageObserver.unobserve(entry.target);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===========================
// Console Message
// ===========================
console.log('%cSoa Bango 🌿', 'font-size: 24px; color: #E8B4B4; font-weight: bold; font-family: Dancing Script, cursive;');
console.log('%cBienvenue sur notre site ! Développé avec ❤️', 'font-size: 14px; color: #6B4E3D;');