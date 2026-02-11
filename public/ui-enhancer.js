// Professional UI/UX Enhancement System
class UIEnhancer {
    constructor() {
        this.themes = {
            light: {
                primary: '#4D0000',
                secondary: '#FFDF00',
                accent: '#8B0000',
                background: '#FFFFFF',
                surface: '#F8F9FA',
                text: '#212529',
                textSecondary: '#6C757D'
            },
            dark: {
                primary: '#FFDF00',
                secondary: '#4D0000',
                accent: '#FF6B6B',
                background: '#1A1A1A',
                surface: '#2D2D2D',
                text: '#FFFFFF',
                textSecondary: '#B8B8B8'
            }
        };
        
        this.currentTheme = 'light';
        this.animations = {
            enabled: true,
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        };
        
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupProgressiveEnhancement();
        this.setupLoadingStates();
        this.setupMicroInteractions();
        this.setupAccessibility();
        this.setupUserGuidance();
        this.setupFormEnhancements();
        this.setupThemeSystem();
        this.setupResponsiveHelpers();
    }

    // Smooth scrolling for navigation
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Progressive enhancement
    setupProgressiveEnhancement() {
        // Add loading states for images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.add('error');
                img.src = '/placeholder-image.jpg';
            });
        });

        // Enhance form elements
        this.enhanceFormElements();
        
        // Add focus indicators
        this.addFocusIndicators();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    // Professional loading states
    setupLoadingStates() {
        // Create loading spinner component
        this.createLoadingSpinner();
        
        // Add loading states to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.dataset.loading !== 'false') {
                    this.setButtonLoading(button, true);
                }
            });
        });
        
        // Add skeleton loaders
        this.addSkeletonLoaders();
    }

    // Micro-interactions and animations
    setupMicroInteractions() {
        // Hover effects for cards
        document.querySelectorAll('.card, .application-control-card, .stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateElement(card, 'scale', 1.02);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateElement(card, 'scale', 1);
            });
        });

        // Button ripple effects
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(button, e);
            });
        });

        // Scroll animations
        this.setupScrollAnimations();
        
        // Form field animations
        this.setupFormAnimations();
    }

    // Accessibility improvements
    setupAccessibility() {
        // Add ARIA labels dynamically
        this.addARIALabels();
        
        // Setup skip links
        this.addSkipLinks();
        
        // Enhance keyboard navigation
        this.enhanceKeyboardNavigation();
        
        // Add focus management
        this.setupFocusManagement();
        
        // Setup screen reader announcements
        this.setupScreenReaderAnnouncements();
    }

    // User guidance and help features
    setupUserGuidance() {
        // Add tooltips
        this.addTooltips();
        
        // Add tour system
        this.setupTourSystem();
        
        // Add help tooltips
        this.addHelpTooltips();
        
        // Setup contextual help
        this.setupContextualHelp();
    }

    // Form enhancements
    setupFormEnhancements() {
        // Add floating labels
        this.addFloatingLabels();
        
        // Add input validation feedback
        this.addValidationFeedback();
        
        // Add password strength indicators
        this.addPasswordStrengthIndicator();
        
        // Add character counters
        this.addCharacterCounters();
        
        // Add auto-save functionality
        this.addAutoSave();
    }

    // Theme system
    setupThemeSystem() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('kaalcal_theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add theme toggle button
        this.addThemeToggle();
    }

    // Responsive helpers
    setupResponsiveHelpers() {
        // Add responsive navigation
        this.enhanceResponsiveNavigation();
        
        // Add touch gestures
        this.addTouchGestures();
        
        // Add viewport indicators
        this.addViewportIndicators();
    }

    // Utility methods
    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
        `;
        
        // Add CSS if not already present
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .loading-spinner {
                    display: inline-flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .spinner-circle {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--gold);
                    animation: spinner-bounce 1.4s infinite ease-in-out both;
                }
                
                .spinner-circle:nth-child(1) { animation-delay: -0.32s; }
                .spinner-circle:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes spinner-bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        return spinner;
    }

    setButtonLoading(button, loading) {
        if (loading) {
            const originalContent = button.innerHTML;
            button.dataset.originalContent = originalContent;
            button.innerHTML = this.createLoadingSpinner().outerHTML;
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.innerHTML = button.dataset.originalContent || button.innerHTML;
            button.disabled = false;
            button.classList.remove('loading');
            delete button.dataset.originalContent;
        }
    }

    animateElement(element, property, value) {
        if (!this.animations.enabled) return;
        
        element.style.transition = `all ${this.animations.duration}ms ${this.animations.easing}`;
        element.style.transform = `${property}(${value})`;
    }

    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupScrollAnimations() {
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
        
        document.querySelectorAll('.fade-in, .slide-up, .slide-in').forEach(el => {
            observer.observe(el);
        });
    }

    enhanceFormElements() {
        // Style file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'file-input-wrapper';
            
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.className = 'file-input-label';
            label.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Dosya Seç</span>
            `;
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            
            input.addEventListener('change', (e) => {
                const fileName = e.target.files[0]?.name || 'Dosya Seç';
                label.querySelector('span').textContent = fileName;
            });
        });
    }

    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--gold);
                outline-offset: 2px;
            }
            
            button:focus,
            input:focus,
            textarea:focus,
            select:focus {
                outline: 2px solid var(--gold);
                outline-offset: 2px;
                box-shadow: 0 0 0 3px rgba(255, 223, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + H for help
            if (e.altKey && e.key === 'h') {
                this.showHelp();
            }
            
            // Alt + T for theme toggle
            if (e.altKey && e.key === 't') {
                this.toggleTheme();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    addARIALabels() {
        // Add ARIA labels to navigation
        document.querySelectorAll('nav').forEach(nav => {
            nav.setAttribute('aria-label', 'Ana navigasyon');
        });
        
        // Add ARIA labels to buttons
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Buton');
            }
        });
        
        // Add ARIA labels to forms
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', 'Form');
            }
        });
    }

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Ana içeriğe geç</a>
            <a href="#navigation" class="skip-link">Navigasyona geç</a>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: fixed;
                top: -40px;
                left: 0;
                z-index: 10000;
                background: var(--burgundy-main);
                padding: 0;
            }
            
            .skip-link {
                display: block;
                padding: 8px 16px;
                color: var(--gold);
                text-decoration: none;
                font-weight: 600;
            }
            
            .skip-link:focus {
                top: 0;
            }
        `;
        
        document.head.appendChild(style);
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Add tab trapping for modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        });
    }

    setupFocusManagement() {
        // Manage focus for dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Auto-focus first focusable element in new content
                            const focusable = node.querySelector('button, [href], input, select, textarea');
                            if (focusable && node.classList.contains('modal')) {
                                setTimeout(() => focusable.focus(), 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'announcements';
        document.body.appendChild(liveRegion);
        
        // Add screen reader only styles
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    announceToScreenReader(message) {
        const announcements = document.getElementById('announcements');
        if (announcements) {
            announcements.textContent = message;
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    addTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            element.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                setTimeout(() => tooltip.classList.add('visible'), 10);
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 300);
            });
        });
        
        // Add tooltip styles
        const style = document.createElement('style');
        style.textContent = `
            .tooltip {
                position: absolute;
                background: var(--burgundy-deep);
                color: var(--gold);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .tooltip.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 5px solid transparent;
                border-top-color: var(--burgundy-deep);
            }
        `;
        document.head.appendChild(style);
    }

    setupTourSystem() {
        // Create tour overlay
        const tourOverlay = document.createElement('div');
        tourOverlay.id = 'tour-overlay';
        tourOverlay.className = 'tour-overlay';
        tourOverlay.innerHTML = `
            <div class="tour-highlight"></div>
            <div class="tour-tooltip">
                <div class="tour-content">
                    <h3 class="tour-title"></h3>
                    <p class="tour-description"></p>
                    <div class="tour-actions">
                        <button class="tour-prev">Önceki</button>
                        <button class="tour-next">Sonraki</button>
                        <button class="tour-close">Kapat</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(tourOverlay);
        
        // Add tour styles
        const style = document.createElement('style');
        style.textContent = `
            .tour-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: none;
            }
            
            .tour-highlight {
                position: absolute;
                border: 3px solid var(--gold);
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
                transition: all 0.3s ease;
            }
            
            .tour-tooltip {
                position: absolute;
                background: var(--burgundy-deep);
                color: var(--gold);
                padding: 20px;
                border-radius: 12px;
                max-width: 300px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .tour-title {
                margin: 0 0 10px 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .tour-description {
                margin: 0 0 20px 0;
                line-height: 1.5;
            }
            
            .tour-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .tour-actions button {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                background: var(--gold);
                color: var(--burgundy-deep);
                cursor: pointer;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }

    addHelpTooltips() {
        // Add help buttons to forms
        document.querySelectorAll('form').forEach(form => {
            const helpButton = document.createElement('button');
            helpButton.type = 'button';
            helpButton.className = 'help-button';
            helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
            helpButton.setAttribute('data-tooltip', 'Yardım için tıklayın');
            
            form.appendChild(helpButton);
            
            helpButton.addEventListener('click', () => {
                this.showContextualHelp(form);
            });
        });
    }

    setupContextualHelp() {
        // Create help modal
        const helpModal = document.createElement('div');
        helpModal.id = 'help-modal';
        helpModal.className = 'modal';
        helpModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Yardım</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="help-content">
                        <h4>Form Kullanımı</h4>
                        <ul>
                            <li>Tüm zorunlu alanları (*) doldurun</li>
                            <li>E-posta adresinizi kontrol edin</li>
                            <li>Formu göndermeden önce bilgilerinizi gözden geçirin</li>
                        </ul>
                        
                        <h4>Kısayollar</h4>
                        <ul>
                            <li><kbd>Alt</kbd> + <kbd>H</kbd> - Yardım</li>
                            <li><kbd>Alt</kbd> + <kbd>T</kbd> - Tema değiştir</li>
                            <li><kbd>Esc</kbd> - Modalı kapat</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }

    showContextualHelp(context) {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.style.display = 'block';
            helpModal.querySelector('.close').onclick = () => {
                helpModal.style.display = 'none';
            };
        }
    }

    addFloatingLabels() {
        document.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                group.classList.add('floating-label-group');
                
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check initial value
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
        
        // Add floating label styles
        const style = document.createElement('style');
        style.textContent = `
            .floating-label-group {
                position: relative;
                margin-bottom: 20px;
            }
            
            .floating-label-group label {
                position: absolute;
                top: 16px;
                left: 16px;
                transition: all 0.3s ease;
                color: rgba(255, 255, 255, 0.7);
                pointer-events: none;
            }
            
            .floating-label-group.focused label,
            .floating-label-group input:not(:placeholder-shown) ~ label,
            .floating-label-group textarea:not(:placeholder-shown) ~ label {
                top: -8px;
                left: 8px;
                font-size: 12px;
                background: var(--burgundy-main);
                padding: 0 8px;
                color: var(--gold);
            }
            
            .floating-label-group input,
            .floating-label-group textarea {
                padding: 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 223, 0, 0.2);
                border-radius: 8px;
                color: var(--text-white);
                transition: all 0.3s ease;
            }
            
            .floating-label-group input:focus,
            .floating-label-group textarea:focus {
                border-color: var(--gold);
                box-shadow: 0 0 0 3px rgba(255, 223, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    addValidationFeedback() {
        document.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                this.validateField(field);
            });
            
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const formGroup = field.closest('.form-group, .floating-label-group');
        
        if (formGroup) {
            formGroup.classList.toggle('valid', isValid);
            formGroup.classList.toggle('invalid', !isValid && field.value);
        }
        
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid && field.value);
    }

    addPasswordStrengthIndicator() {
        document.querySelectorAll('input[type="password"]').forEach(passwordInput => {
            const strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength';
            strengthIndicator.innerHTML = `
                <div class="strength-bar">
                    <div class="strength-fill"></div>
                </div>
                <div class="strength-text">Şifre gücü</div>
            `;
            
            passwordInput.parentNode.appendChild(strengthIndicator);
            
            passwordInput.addEventListener('input', () => {
                const strength = this.calculatePasswordStrength(passwordInput.value);
                this.updatePasswordStrength(strengthIndicator, strength);
            });
        });
        
        // Add password strength styles
        const style = document.createElement('style');
        style.textContent = `
            .password-strength {
                margin-top: 8px;
            }
            
            .strength-bar {
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .strength-fill {
                height: 100%;
                width: 0%;
                transition: all 0.3s ease;
                border-radius: 2px;
            }
            
            .strength-fill.weak { width: 25%; background: #dc3545; }
            .strength-fill.fair { width: 50%; background: #ffc107; }
            .strength-fill.good { width: 75%; background: #28a745; }
            .strength-fill.strong { width: 100%; background: #20c997; }
            
            .strength-text {
                font-size: 12px;
                margin-top: 4px;
                color: rgba(255, 255, 255, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        return strength;
    }

    updatePasswordStrength(indicator, strength) {
        const fill = indicator.querySelector('.strength-fill');
        const text = indicator.querySelector('.strength-text');
        
        const levels = ['weak', 'fair', 'good', 'strong'];
        const labels = ['Zayıf', 'Orta', 'İyi', 'Güçlü'];
        
        const level = Math.min(Math.floor(strength / 1.5), 3);
        
        fill.className = `strength-fill ${levels[level]}`;
        text.textContent = `Şifre gücü: ${labels[level]}`;
    }

    addCharacterCounters() {
        document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.textContent = `0 / ${textarea.maxLength}`;
            
            textarea.parentNode.appendChild(counter);
            
            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = `${length} / ${textarea.maxLength}`;
                counter.classList.toggle('warning', length > textarea.maxLength * 0.9);
            });
        });
        
        // Add character counter styles
        const style = document.createElement('style');
        style.textContent = `
            .character-counter {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                text-align: right;
                margin-top: 4px;
            }
            
            .character-counter.warning {
                color: var(--gold);
            }
        `;
        document.head.appendChild(style);
    }

    addAutoSave() {
        document.querySelectorAll('form[data-autosave]').forEach(form => {
            const formId = form.id || 'form-' + Date.now();
            const saveKey = `autosave_${formId}`;
            
            // Load saved data
            const savedData = localStorage.getItem(saveKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                    }
                });
            }
            
            // Auto-save on input
            let saveTimeout;
            form.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const formData = new FormData(form);
                    const data = {};
                    for (const [key, value] of formData.entries()) {
                        data[key] = value;
                    }
                    localStorage.setItem(saveKey, JSON.stringify(data));
                }, 1000);
            });
            
            // Clear on submit
            form.addEventListener('submit', () => {
                localStorage.removeItem(saveKey);
            });
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('kaalcal_theme', theme);
        
        const root = document.documentElement;
        const themeColors = this.themes[theme];
        
        Object.keys(themeColors).forEach(key => {
            root.style.setProperty(`--theme-${key}`, themeColors[key]);
        });
        
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    addThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('data-tooltip', 'Temayı değiştir (Alt+T)');
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
            themeToggle.innerHTML = this.currentTheme === 'light' ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
        });
        
        document.body.appendChild(themeToggle);
        
        // Add theme toggle styles
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--burgundy-deep);
                color: var(--gold);
                border: 2px solid var(--gold);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }
            
            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            }
            
            .dark-theme {
                background: var(--theme-background);
                color: var(--theme-text);
            }
            
            .dark-theme .application-page,
            .dark-theme .admin-dashboard-section {
                background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);
            }
        `;
        document.head.appendChild(style);
    }

    enhanceResponsiveNavigation() {
        // Add mobile menu enhancements
        const mobileMenu = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenu && navMenu) {
            // Add animation classes
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    addTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture(touchStartX, touchEndX);
        });
    }

    handleSwipeGesture(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - could be used for carousel navigation
                console.log('Swipe left detected');
            } else {
                // Swipe right - could be used for carousel navigation
                console.log('Swipe right detected');
            }
        }
    }

    addViewportIndicators() {
        const indicator = document.createElement('div');
        indicator.className = 'viewport-indicator';
        indicator.innerHTML = `
            <div class="viewport-size"></div>
            <div class="viewport-type"></div>
        `;
        
        document.body.appendChild(indicator);
        
        const updateViewport = () => {
            const width = window.innerWidth;
            const size = indicator.querySelector('.viewport-size');
            const type = indicator.querySelector('.viewport-type');
            
            size.textContent = `${width}px`;
            
            if (width < 768) {
                type.textContent = 'Mobile';
            } else if (width < 1024) {
                type.textContent = 'Tablet';
            } else {
                type.textContent = 'Desktop';
            }
        };
        
        updateViewport();
        window.addEventListener('resize', updateViewport);
        
        // Add viewport indicator styles
        const style = document.createElement('style');
        style.textContent = `
            .viewport-indicator {
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10000;
                opacity: 0.1;
                transition: opacity 0.3s ease;
            }
            
            .viewport-indicator:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showHelp() {
        this.showContextualHelp(document.body);
    }
}

// Global UI enhancer instance
window.uiEnhancer = new UIEnhancer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIEnhancer;
}
