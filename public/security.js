// Security and Input Validation System
class SecurityManager {
    constructor() {
        this.sanitizers = {
            text: this.sanitizeText.bind(this),
            email: this.sanitizeEmail.bind(this),
            phone: this.sanitizePhone.bind(this),
            number: this.sanitizeNumber.bind(this),
            html: this.sanitizeHTML.bind(this)
        };
        
        this.validators = {
            required: this.validateRequired.bind(this),
            minLength: this.validateMinLength.bind(this),
            maxLength: this.validateMaxLength.bind(this),
            email: this.validateEmail.bind(this),
            phone: this.validatePhone.bind(this),
            number: this.validateNumber.bind(this),
            turkishChars: this.validateTurkishChars.bind(this),
            noSpecialChars: this.validateNoSpecialChars.bind(this)
        };

        this.rateLimiters = new Map();
        this.init();
    }

    init() {
        // Add CSRF protection
        this.setupCSRF();
        
        // Add XSS protection
        this.setupXSSProtection();
        
        // Add rate limiting
        this.setupRateLimiting();
        
        // Add form validation listeners
        this.setupFormValidation();
    }

    // Input sanitization
    sanitizeText(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .substring(0, 1000); // Limit length
    }

    sanitizeEmail(input) {
        if (typeof input !== 'string') return '';
        
        const email = input.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return emailRegex.test(email) ? email : '';
    }

    sanitizePhone(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .replace(/[^\d+]/g, '') // Keep only digits and +
            .replace(/^(00|0)/, '+90') // Convert Turkish numbers
            .substring(0, 15); // Limit length
    }

    sanitizeNumber(input) {
        const num = parseFloat(input);
        return isNaN(num) ? 0 : num;
    }

    sanitizeHTML(input) {
        if (typeof input !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Input validation
    validateRequired(value) {
        return {
            valid: value !== null && value !== undefined && value.toString().trim() !== '',
            message: 'Bu alan zorunludur'
        };
    }

    validateMinLength(value, min) {
        const valid = value.toString().length >= min;
        return {
            valid,
            message: valid ? null : `En az ${min} karakter olmalı`
        };
    }

    validateMaxLength(value, max) {
        const valid = value.toString().length <= max;
        return {
            valid,
            message: valid ? null : `En fazla ${max} karakter olmalı`
        };
    }

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(value);
        return {
            valid,
            message: valid ? null : 'Geçerli bir e-posta adresi girin'
        };
    }

    validatePhone(value) {
        const phoneRegex = /^\+?[1-9]\d{6,14}$/;
        const valid = phoneRegex.test(value);
        return {
            valid,
            message: valid ? null : 'Geçerli bir telefon numarası girin'
        };
    }

    validateNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        const isNumber = !isNaN(num);
        
        if (!isNumber) {
            return { valid: false, message: 'Geçerli bir sayı girin' };
        }
        
        if (min !== null && num < min) {
            return { valid: false, message: `En az ${min} olmalı` };
        }
        
        if (max !== null && num > max) {
            return { valid: false, message: `En fazla ${max} olmalı` };
        }
        
        return { valid: true, message: null };
    }

    validateTurkishChars(value) {
        const turkishRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;
        const valid = turkishRegex.test(value);
        return {
            valid,
            message: valid ? null : 'Sadece Türkçe karakterler kullanın'
        };
    }

    validateNoSpecialChars(value) {
        const specialRegex = /^[a-zA-Z0-9\s]+$/;
        const valid = specialRegex.test(value);
        return {
            valid,
            message: valid ? null : 'Özel karakterler kullanmayın'
        };
    }

    // Form validation
    validateForm(form, validationRules) {
        const errors = {};
        const formData = new FormData(form);
        let isValid = true;

        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const value = formData.get(fieldName);
            const fieldErrors = [];

            for (const rule of rules) {
                const [validatorName, ...params] = rule.split(':');
                const validator = this.validators[validatorName];
                
                if (validator) {
                    const result = validator(value, ...params);
                    if (!result.valid) {
                        fieldErrors.push(result.message);
                        isValid = false;
                    }
                }
            }

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
            }
        }

        return { isValid, errors };
    }

    // Sanitize form data
    sanitizeFormData(formData) {
        const sanitized = new FormData();
        
        for (const [key, value] of formData.entries()) {
            // Determine sanitizer based on field name
            let sanitizer = this.sanitizers.text;
            
            if (key.includes('email')) {
                sanitizer = this.sanitizers.email;
            } else if (key.includes('phone') || key.includes('telefon')) {
                sanitizer = this.sanitizers.phone;
            } else if (key.includes('number') || key.includes('sayı')) {
                sanitizer = this.sanitizers.number;
            } else if (key.includes('message') || key.includes('mesaj')) {
                sanitizer = this.sanitizers.html;
            }
            
            sanitized.append(key, sanitizer(value));
        }
        
        return sanitized;
    }

    // CSRF protection
    setupCSRF() {
        // Generate CSRF token if not exists
        if (!localStorage.getItem('csrf_token')) {
            const token = this.generateCSRFToken();
            localStorage.setItem('csrf_token', token);
        }

        // Add CSRF token to all forms
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'csrf_token';
                tokenInput.value = localStorage.getItem('csrf_token');
                form.appendChild(tokenInput);
            });
        });
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // XSS protection
    setupXSSProtection() {
        // Override innerHTML for XSS protection
        const originalSetInnerHTML = Element.prototype.innerHTML;
        Element.prototype.innerHTML = function(html) {
            // Sanitize HTML content
            const sanitized = window.securityManager.sanitizeHTML(html);
            return originalSetInnerHTML.call(this, sanitized);
        };
    }

    // Rate limiting
    setupRateLimiting() {
        // Monitor form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const formId = form.id || form.className || 'anonymous';
            
            if (!this.checkRateLimit(formId, 5, 60000)) { // 5 submissions per minute
                event.preventDefault();
                window.errorHandler.showUserNotification(
                    'Çok fazla deneme yaptınız. Lütfen bir dakika bekleyin.',
                    'warning'
                );
            }
        });

        // Monitor API calls
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const url = args[0];
            
            if (typeof url === 'string' && url.includes('/api/')) {
                const apiName = url.split('/').pop() || 'unknown';
                
                if (!this.checkRateLimit(apiName, 100, 60000)) { // 100 calls per minute
                    throw new Error('Rate limit exceeded');
                }
            }
            
            return originalFetch(...args);
        };
    }

    checkRateLimit(key, maxRequests, windowMs) {
        const now = Date.now();
        const limit = this.rateLimiters.get(key);
        
        if (!limit) {
            this.rateLimiters.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return true;
        }
        
        if (now > limit.resetTime) {
            limit.count = 1;
            limit.resetTime = now + windowMs;
            return true;
        }
        
        if (limit.count >= maxRequests) {
            return false;
        }
        
        limit.count++;
        return true;
    }

    // Form validation setup
    setupFormValidation() {
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form[data-validate]');
            
            forms.forEach(form => {
                form.addEventListener('submit', (event) => {
                    const validationRules = JSON.parse(form.dataset.validate || '{}');
                    const { isValid, errors } = this.validateForm(form, validationRules);
                    
                    if (!isValid) {
                        event.preventDefault();
                        window.errorHandler.handleFormError(form, errors);
                    } else {
                        // Sanitize form data before submission
                        const formData = new FormData(form);
                        const sanitized = this.sanitizeFormData(formData);
                        
                        // Update form data with sanitized values
                        for (const [key, value] of sanitized.entries()) {
                            const input = form.querySelector(`[name="${key}"]`);
                            if (input) {
                                input.value = value;
                            }
                        }
                    }
                });

                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input, form);
                    });
                });
            });
        });
    }

    validateField(field, form) {
        const validationRules = JSON.parse(form.dataset.validate || '{}');
        const fieldName = field.name;
        const rules = validationRules[fieldName];
        
        if (!rules) return true;
        
        const value = field.value;
        let isValid = true;
        let errorMessage = null;
        
        for (const rule of rules) {
            const [validatorName, ...params] = rule.split(':');
            const validator = this.validators[validatorName];
            
            if (validator) {
                const result = validator(value, ...params);
                if (!result.valid) {
                    isValid = false;
                    errorMessage = result.message;
                    break;
                }
            }
        }
        
        // Update field UI
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid);
        
        // Show/hide error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement && !isValid) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage || '';
            errorElement.style.display = errorMessage ? 'block' : 'none';
        }
        
        return isValid;
    }

    // Security utilities
    hashPassword(password) {
        // Simple hash for demonstration (use bcrypt in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Content Security Policy helper
    setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.mongodb.com",
            "frame-src 'none'",
            "object-src 'none'"
        ].join('; ');
        document.head.appendChild(meta);
    }
}

// Global security manager instance
window.securityManager = new SecurityManager();

// Convenience functions for global use
window.validateForm = (form, rules) => securityManager.validateForm(form, rules);
window.sanitizeInput = (input, type = 'text') => securityManager.sanitizers[type](input);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}
