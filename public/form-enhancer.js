// Professional Form Enhancement System
class FormEnhancer {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
        this.autoSaveEnabled = true;
        this.realTimeValidation = true;
        this.progressIndicators = true;
        
        this.init();
    }

    init() {
        this.enhanceAllForms();
        this.setupGlobalValidation();
        this.setupAutoSave();
        this.setupProgressTracking();
        this.setupAccessibility();
        this.setupMobileOptimizations();
    }

    enhanceAllForms() {
        document.querySelectorAll('form').forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        const formId = form.id || `form-${Date.now()}`;
        
        // Add form enhancements
        this.addFloatingLabels(form);
        this.addValidationFeedback(form);
        this.addProgressIndicator(form);
        this.addSmartDefaults(form);
        this.addKeyboardNavigation(form);
        this.addMobileOptimizations(form);
        
        // Store form instance
        this.forms.set(formId, {
            element: form,
            fields: this.getFormFields(form),
            validation: this.setupFormValidation(form),
            progress: this.setupProgressTracking(form),
            autoSave: this.setupAutoSave(form)
        });
        
        // Add form event listeners
        form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        form.addEventListener('input', (e) => this.handleFormInput(e, form));
        form.addEventListener('change', (e) => this.handleFormChange(e, form));
    }

    addFloatingLabels(form) {
        form.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label && !group.classList.contains('enhanced')) {
                group.classList.add('floating-label-group', 'enhanced');
                
                // Add floating behavior
                const checkFloat = () => {
                    if (input.value || input === document.activeElement) {
                        group.classList.add('focused');
                    } else {
                        group.classList.remove('focused');
                    }
                };
                
                input.addEventListener('focus', checkFloat);
                input.addEventListener('blur', checkFloat);
                input.addEventListener('input', checkFloat);
                
                // Initial check
                checkFloat();
            }
        });
    }

    addValidationFeedback(form) {
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!field.dataset.enhanced) {
                field.dataset.enhanced = 'true';
                
                // Add validation states
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
                
                // Add visual feedback
                this.addFieldValidationUI(field);
            }
        });
    }

    addFieldValidationUI(field) {
        const formGroup = field.closest('.form-group, .floating-label-group');
        if (!formGroup) return;
        
        // Create validation feedback element
        const feedback = document.createElement('div');
        feedback.className = 'field-feedback';
        
        // Create validation icon
        const icon = document.createElement('span');
        icon.className = 'validation-icon';
        
        // Create helper text
        const helper = document.createElement('div');
        helper.className = 'field-helper';
        
        formGroup.appendChild(feedback);
        formGroup.appendChild(icon);
        formGroup.appendChild(helper);
        
        // Add styles
        this.addValidationStyles();
    }

    addValidationStyles() {
        if (document.querySelector('#validation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'validation-styles';
        style.textContent = `
            .floating-label-group {
                position: relative;
                margin-bottom: 24px;
            }
            
            .floating-label-group label {
                position: absolute;
                top: 16px;
                left: 16px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: rgba(255, 255, 255, 0.7);
                pointer-events: none;
                font-size: 16px;
            }
            
            .floating-label-group.focused label,
            .floating-label-group.has-value label {
                top: -8px;
                left: 8px;
                font-size: 12px;
                background: var(--burgundy-main);
                padding: 0 8px;
                color: var(--gold);
            }
            
            .floating-label-group input,
            .floating-label-group textarea,
            .floating-label-group select {
                padding: 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 223, 0, 0.2);
                border-radius: 8px;
                color: var(--text-white);
                transition: all 0.3s ease;
                font-size: 16px;
            }
            
            .floating-label-group input:focus,
            .floating-label-group textarea:focus,
            .floating-label-group select:focus {
                border-color: var(--gold);
                box-shadow: 0 0 0 3px rgba(255, 223, 0, 0.2);
                outline: none;
            }
            
            .validation-icon {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .field-valid .validation-icon {
                color: #28a745;
                opacity: 1;
            }
            
            .field-invalid .validation-icon {
                color: #dc3545;
                opacity: 1;
            }
            
            .field-feedback {
                font-size: 12px;
                margin-top: 4px;
                min-height: 16px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .field-invalid .field-feedback {
                color: #dc3545;
                opacity: 1;
            }
            
            .field-valid .field-feedback {
                color: #28a745;
                opacity: 1;
            }
            
            .field-helper {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 4px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .floating-label-group.focused .field-helper {
                opacity: 1;
            }
            
            .field-invalid input,
            .field-invalid textarea,
            .field-invalid select {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
            }
            
            .field-valid input,
            .field-valid textarea,
            .field-valid select {
                border-color: #28a745;
                box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
            }
            
            @media (max-width: 768px) {
                .floating-label-group input,
                .floating-label-group textarea,
                .floating-label-group select {
                    font-size: 16px; /* Prevent zoom on iOS */
                }
            }
        `;
        document.head.appendChild(style);
    }

    validateField(field) {
        const formGroup = field.closest('.form-group, .floating-label-group');
        if (!formGroup) return { valid: true, message: '' };
        
        let isValid = true;
        let message = '';
        
        // HTML5 validation
        if (!field.checkValidity()) {
            isValid = false;
            message = field.validationMessage;
        }
        
        // Custom validation
        const customValidation = this.getCustomValidation(field);
        if (customValidation) {
            const result = customValidation(field.value);
            if (!result.valid) {
                isValid = false;
                message = result.message;
            }
        }
        
        // Update UI
        this.updateFieldValidation(formGroup, isValid, message);
        
        return { valid: isValid, message };
    }

    updateFieldValidation(formGroup, isValid, message) {
        const icon = formGroup.querySelector('.validation-icon');
        const feedback = formGroup.querySelector('.field-feedback');
        
        formGroup.classList.remove('field-valid', 'field-invalid');
        
        if (isValid && formGroup.querySelector('input').value) {
            formGroup.classList.add('field-valid');
            if (icon) icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            if (feedback) feedback.textContent = message || 'Geçerli';
        } else if (!isValid) {
            formGroup.classList.add('field-invalid');
            if (icon) icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            if (feedback) feedback.textContent = message;
        } else {
            if (icon) icon.innerHTML = '';
            if (feedback) feedback.textContent = '';
        }
    }

    getCustomValidation(field) {
        const validations = {
            email: (value) => {
                if (!value) return { valid: true };
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    valid: emailRegex.test(value),
                    message: 'Geçerli bir e-posta adresi girin'
                };
            },
            phone: (value) => {
                if (!value) return { valid: true };
                const phoneRegex = /^\+?[1-9]\d{6,14}$/;
                return {
                    valid: phoneRegex.test(value.replace(/\s/g, '')),
                    message: 'Geçerli bir telefon numarası girin'
                };
            },
            password: (value) => {
                if (!value) return { valid: true };
                const strength = this.calculatePasswordStrength(value);
                return {
                    valid: strength >= 2,
                    message: strength < 2 ? 'Şifre en az 8 karakter olmalı' : ''
                };
            }
        };
        
        const type = field.type || field.name;
        return validations[type] || null;
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

    addProgressIndicator(form) {
        if (!this.progressIndicators) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0% tamamlandı</div>
        `;
        
        form.insertBefore(progressContainer, form.firstChild);
        
        // Add progress styles
        this.addProgressStyles();
    }

    addProgressStyles() {
        if (document.querySelector('#progress-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'progress-styles';
        style.textContent = `
            .form-progress {
                margin-bottom: 20px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 223, 0, 0.2);
            }
            
            .progress-bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--gold), var(--white));
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 4px;
            }
            
            .progress-text {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    updateProgress(form) {
        const progressContainer = form.querySelector('.form-progress');
        if (!progressContainer) return;
        
        const fields = this.getFormFields(form);
        const filledFields = fields.filter(field => field.value.trim()).length;
        const progress = Math.round((filledFields / fields.length) * 100);
        
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressText = progressContainer.querySelector('.progress-text');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `%${progress} tamamlandı`;
        
        // Add completion animation
        if (progress === 100) {
            progressContainer.classList.add('complete');
            setTimeout(() => {
                progressContainer.classList.remove('complete');
            }, 2000);
        }
    }

    addSmartDefaults(form) {
        // Auto-format phone numbers
        form.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach(field => {
            field.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0 && !value.startsWith('+')) {
                    value = '+90' + value;
                }
                e.target.value = value;
            });
        });
        
        // Auto-capitalize names
        form.querySelectorAll('input[name*="name"], input[name*="ad"]').forEach(field => {
            field.addEventListener('blur', (e) => {
                const words = e.target.value.split(' ');
                const capitalized = words.map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                e.target.value = capitalized;
            });
        });
        
        // Auto-format email (lowercase)
        form.querySelectorAll('input[type="email"]').forEach(field => {
            field.addEventListener('blur', (e) => {
                e.target.value = e.target.value.toLowerCase();
            });
        });
    }

    addKeyboardNavigation(form) {
        const fields = this.getFormFields(form);
        
        fields.forEach((field, index) => {
            field.addEventListener('keydown', (e) => {
                // Enter to go to next field
                if (e.key === 'Enter' && index < fields.length - 1) {
                    e.preventDefault();
                    fields[index + 1].focus();
                }
                
                // Shift + Enter to go to previous field
                if (e.key === 'Enter' && e.shiftKey && index > 0) {
                    e.preventDefault();
                    fields[index - 1].focus();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowDown' && index < fields.length - 1) {
                    e.preventDefault();
                    fields[index + 1].focus();
                }
                
                if (e.key === 'ArrowUp' && index > 0) {
                    e.preventDefault();
                    fields[index - 1].focus();
                }
            });
        });
    }

    addMobileOptimizations(form) {
        // Add input types for mobile keyboards
        form.querySelectorAll('input[name*="phone"], input[name*="telefon"]').forEach(field => {
            field.setAttribute('inputmode', 'tel');
            field.setAttribute('pattern', '[+]?[0-9]*');
        });
        
        form.querySelectorAll('input[name*="email"]').forEach(field => {
            field.setAttribute('inputmode', 'email');
            field.setAttribute('autocapitalize', 'off');
            field.setAttribute('autocorrect', 'off');
            field.setAttribute('spellcheck', 'false');
        });
        
        form.querySelectorAll('input[name*="name"], input[name*="ad"]').forEach(field => {
            field.setAttribute('autocapitalize', 'words');
            field.setAttribute('autocorrect', 'on');
        });
        
        // Add touch-friendly submit buttons
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            submitBtn.style.minHeight = '44px'; // iOS touch target
            submitBtn.style.minWidth = '44px';
        }
    }

    setupGlobalValidation() {
        // Add custom validation methods
        window.addEventListener('DOMContentLoaded', () => {
            // Add HTML5 validation messages in Turkish
            const validationMessages = {
                valueMissing: 'Bu alan zorunludur',
                typeMismatch: 'Lütfen geçerli bir değer girin',
                patternMismatch: 'Lütfen istenen formatta girin',
                tooShort: 'En az {minLength} karakter girin',
                tooLong: 'En fazla {maxLength} karakter girin',
                rangeUnderflow: 'Değer {min} veya daha büyük olmalı',
                rangeOverflow: 'Değer {max} veya daha küçük olmalı',
                stepMismatch: 'Geçersiz adım'
            };
            
            // Override validation messages
            document.addEventListener('invalid', (e) => {
                e.preventDefault();
                const field = e.target;
                const validity = field.validity;
                
                for (const [key, value] of Object.entries(validity)) {
                    if (value && validationMessages[key]) {
                        field.setCustomValidity(validationMessages[key]);
                        break;
                    }
                }
            }, true);
        });
    }

    setupAutoSave() {
        if (!this.autoSaveEnabled) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('form[data-autosave="true"]').forEach(form => {
                this.setupFormAutoSave(form);
            });
        });
    }

    setupFormAutoSave(form) {
        const formId = form.id || `form-${Date.now()}`;
        const saveKey = `autosave_${formId}`;
        
        // Load saved data
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                        field.dispatchEvent(new Event('input'));
                    }
                });
                
                // Show restore notification
                window.notifications?.info('Form verileri geri yüklendi', 'Otomatik Kayıt');
            } catch (error) {
                console.warn('Failed to load autosave data:', error);
            }
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
            }, 2000);
        });
        
        // Clear on submit
        form.addEventListener('submit', () => {
            localStorage.removeItem(saveKey);
        });
    }

    setupProgressTracking() {
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('form').forEach(form => {
                this.updateProgress(form);
                
                // Update progress on input
                form.addEventListener('input', () => {
                    this.updateProgress(form);
                });
            });
        });
    }

    setupAccessibility() {
        // Add ARIA labels
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', 'Form');
            }
        });
        
        // Add field descriptions
        document.querySelectorAll('input, textarea, select').forEach(field => {
            const label = field.closest('.form-group')?.querySelector('label');
            if (label && !field.getAttribute('aria-describedby')) {
                const helperId = `helper-${field.id || field.name}`;
                const helper = document.createElement('div');
                helper.id = helperId;
                helper.className = 'field-helper sr-only';
                helper.textContent = label.textContent;
                field.setAttribute('aria-describedby', helperId);
                field.parentNode.appendChild(helper);
            }
        });
    }

    setupMobileOptimizations() {
        // Add mobile-specific enhancements
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Add touch feedback
            document.querySelectorAll('button, input, select, textarea').forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.style.transform = 'scale(0.98)';
                });
                
                element.addEventListener('touchend', () => {
                    element.style.transform = 'scale(1)';
                });
            });
        }
    }

    getFormFields(form) {
        return Array.from(form.querySelectorAll('input:not([type="hidden"]), textarea, select'));
    }

    handleFormSubmit(e, form) {
        // Validate all fields
        const fields = this.getFormFields(form);
        let isValid = true;
        let firstInvalidField = null;
        
        fields.forEach(field => {
            const validation = this.validateField(field);
            if (!validation.valid) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            
            // Focus first invalid field
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Show error notification
            window.notifications?.error('Lütfen zorunlu alanları doldurun', 'Form Hatası');
        }
    }

    handleFormInput(e, form) {
        // Real-time validation
        if (this.realTimeValidation) {
            this.validateField(e.target);
        }
        
        // Update progress
        this.updateProgress(form);
    }

    handleFormChange(e, form) {
        // Handle select changes, checkbox changes, etc.
        this.updateProgress(form);
    }

    // Public API
    enhanceFormById(formId) {
        const form = document.getElementById(formId);
        if (form) {
            this.enhanceForm(form);
        }
    }

    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return { valid: false, errors: [] };
        
        const fields = this.getFormFields(form);
        const errors = [];
        let isValid = true;
        
        fields.forEach(field => {
            const validation = this.validateField(field);
            if (!validation.valid) {
                isValid = false;
                errors.push({
                    field: field.name || field.id,
                    message: validation.message
                });
            }
        });
        
        return { valid: isValid, errors };
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.reset();
        
        // Clear validation states
        form.querySelectorAll('.field-valid, .field-invalid').forEach(group => {
            group.classList.remove('field-valid', 'field-invalid');
        });
        
        // Clear feedback
        form.querySelectorAll('.field-feedback, .validation-icon').forEach(element => {
            element.textContent = '';
        });
        
        // Update progress
        this.updateProgress(form);
    }

    enableAutoSave(formId, enabled = true) {
        const form = document.getElementById(formId);
        if (form) {
            if (enabled) {
                form.setAttribute('data-autosave', 'true');
                this.setupFormAutoSave(form);
            } else {
                form.removeAttribute('data-autosave');
            }
        }
    }
}

// Global form enhancer instance
window.formEnhancer = new FormEnhancer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormEnhancer;
}
