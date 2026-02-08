// Countdown Timer
function initCountdown() {
    const targetDate = new Date('2026-03-28T09:00:00+03:00');
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.innerHTML = '<h2 style="color: #FFDF00; font-size: 2rem;">Etkinlik Başladı!</h2>';
            }
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Particle Effect
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 223, 0, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s infinite linear;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Mobile Navigation
function initMobileNavigation() {
    const mobileMenu = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 100;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenu = document.querySelector('.nav-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.committee-card, .team-card, .sponsor-card, .program-day, .timeline-item').forEach(card => {
        observer.observe(card);
    });
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Client-side validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Lütfen tüm zorunlu alanları doldurun.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        message: data.message
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    contactForm.reset();
                } else {
                    // Handle validation errors
                    if (result.errors && result.errors.length > 0) {
                        const errorMessage = result.errors.map(err => err.msg).join(', ');
                        showNotification(errorMessage, 'error');
                    } else {
                        showNotification(result.message || 'Mesaj gönderilirken bir hata oluştu.', 'error');
                    }
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
            } finally {
                // Restore button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        default:
            notification.style.background = '#8B0000';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initParticles();
    initMobileNavigation();
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    initContactForm();
    initActiveNavigation();
    initParticipantCounter();
    initApplicationStatus();
    
    document.body.classList.add('loaded');
});

// Participant Counter System
function initParticipantCounter() {
    updateParticipantDisplay();
    updateApplicationStatus();
}

function updateParticipantDisplay() {
    const participantCount = localStorage.getItem('kaalcal_participants') || '0';
    const participantElement = document.getElementById('participantCount');
    if (participantElement) {
        participantElement.textContent = participantCount;
    }
}

function incrementParticipantCount() {
    let currentCount = parseInt(localStorage.getItem('kaalcal_participants') || '0');
    currentCount++;
    localStorage.setItem('kaalcal_participants', currentCount.toString());
    updateParticipantDisplay();
    return currentCount;
}

// Application Status System
function initApplicationStatus() {
    updateApplicationStatus();
}

function updateApplicationStatus() {
    const delegateStatus = localStorage.getItem('kaalcal_delegate_open') !== 'false';
    const statusElement = document.getElementById('delegateStatus');
    const delegateButton = document.querySelector('a[href="delegate-application.html"]');
    const statusMessage = document.getElementById('applicationStatusMessage');
    
    if (statusElement) {
        statusElement.textContent = delegateStatus ? 'Açık' : 'Kapalı';
        statusElement.style.color = delegateStatus ? 'var(--gold)' : '#dc3545';
    }
    
    if (statusMessage) {
        if (!delegateStatus) {
            statusMessage.style.display = 'flex';
            if (delegateButton) {
                delegateButton.classList.add('disabled');
                delegateButton.style.opacity = '0.5';
                delegateButton.style.pointerEvents = 'none';
                
                // Update button content to show closed status
                const btnTitle = delegateButton.querySelector('.btn-title');
                const btnDescription = delegateButton.querySelector('.btn-description');
                if (btnTitle) btnTitle.textContent = 'Delege Başvurusu (Kapalı)';
                if (btnDescription) btnDescription.textContent = 'Kota dolmuştur';
            }
        } else {
            statusMessage.style.display = 'none';
            if (delegateButton) {
                delegateButton.classList.remove('disabled');
                delegateButton.style.opacity = '1';
                delegateButton.style.pointerEvents = 'auto';
                
                // Restore original button content
                const btnTitle = delegateButton.querySelector('.btn-title');
                const btnDescription = delegateButton.querySelector('.btn-description');
                if (btnTitle) btnTitle.textContent = 'Delege Başvurusu';
                if (btnDescription) btnDescription.textContent = 'Kurumunuzu temsil edin';
            }
        }
    }
}

function closeDelegateApplications() {
    localStorage.setItem('kaalcal_delegate_open', 'false');
    updateApplicationStatus();
    showNotification('Delege başvuruları 1000 kişi limitine ulaştığı için otomatik olarak kapatıldı.', 'info');
}

// Admin Functions (to be called from admin panel)
window.KAALCAL = {
    // Approve application and update counters
    approveApplication: function(applicationType) {
        const newCount = incrementParticipantCount();
        
        if (applicationType === 'delegate') {
            const approvedDelegates = parseInt(localStorage.getItem('kaalcal_approved_delegates') || '0') + 1;
            localStorage.setItem('kaalcal_approved_delegates', approvedDelegates.toString());
            
            // Check if delegate limit reached
            if (approvedDelegates >= 1000) {
                closeDelegateApplications();
            }
        }
        
        return newCount;
    },
    
    // Get current statistics
    getStats: function() {
        return {
            participants: parseInt(localStorage.getItem('kaalcal_participants') || '0'),
            delegateApplicationsOpen: localStorage.getItem('kaalcal_delegate_open') !== 'false',
            approvedDelegates: parseInt(localStorage.getItem('kaalcal_approved_delegates') || '0')
        };
    },
    
    // Reset counters (for admin use)
    resetCounters: function() {
        localStorage.removeItem('kaalcal_participants');
        localStorage.removeItem('kaalcal_delegate_open');
        localStorage.removeItem('kaalcal_approved_delegates');
        updateParticipantDisplay();
        updateApplicationStatus();
    }
};

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-link.active {
        color: #FFD700 !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(loadingStyles);
