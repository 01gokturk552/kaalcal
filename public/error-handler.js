// Comprehensive Error Handling and Logging System
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.logs = [];
        this.maxLogSize = 1000;
        this.logLevel = 'INFO'; // DEBUG, INFO, WARN, ERROR
        this.init();
    }

    init() {
        // Global error handlers
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault(); // Prevent default console error
        });

        // Performance monitoring
        this.monitorPerformance();
    }

    // Main error handler
    handleError(error, type = 'Error', context = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            type: type,
            message: error?.message || String(error),
            stack: error?.stack,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: this.getCurrentUserId()
        };

        // Store error
        this.errors.push(errorInfo);
        this.log('ERROR', `${type}: ${errorInfo.message}`, context);

        // Notify user for critical errors
        if (this.isCriticalError(errorInfo)) {
            this.showUserNotification('Bir hata oluştu. Sayfayı yenilemeyi deneyin.', 'error');
        }

        // Log to server (in production)
        this.logToServer(errorInfo);

        // Keep error list manageable
        if (this.errors.length > this.maxLogSize) {
            this.errors = this.errors.slice(-this.maxLogSize);
        }
    }

    // Warning handler
    handleWarning(message, context = {}) {
        const warningInfo = {
            timestamp: new Date().toISOString(),
            message: message,
            context: context,
            url: window.location.href
        };

        this.warnings.push(warningInfo);
        this.log('WARN', message, context);

        if (this.warnings.length > this.maxLogSize) {
            this.warnings = this.warnings.slice(-this.maxLogSize);
        }
    }

    // General logging
    log(level, message, context = {}) {
        if (!this.shouldLog(level)) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            context: context
        };

        this.logs.push(logEntry);

        // Console output
        const consoleMethod = level.toLowerCase();
        if (console[consoleMethod]) {
            console[consoleMethod](`[${level}] ${message}`, context);
        }

        if (this.logs.length > this.maxLogSize) {
            this.logs = this.logs.slice(-this.maxLogSize);
        }
    }

    // API error handler
    handleApiError(response, error, context = {}) {
        const errorInfo = {
            status: response?.status,
            statusText: response?.statusText,
            url: response?.url,
            context: context
        };

        this.handleError(error, 'API Error', errorInfo);

        // Show user-friendly message
        let userMessage = 'İşlem sırasında bir hata oluştu.';
        
        if (response?.status === 401) {
            userMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        } else if (response?.status === 403) {
            userMessage = 'Bu işlem için yetkiniz bulunmuyor.';
        } else if (response?.status === 404) {
            userMessage = 'İstenen kaynak bulunamadı.';
        } else if (response?.status >= 500) {
            userMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        }

        this.showUserNotification(userMessage, 'error');
    }

    // Form validation error handler
    handleFormError(form, errors) {
        this.handleWarning('Form validation failed', { form: form.id, errors: errors });
        
        // Show validation messages
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error');
                
                // Remove existing error message
                const existingError = field.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                // Add new error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errors[fieldName];
                field.parentNode.appendChild(errorDiv);
            }
        });
    }

    // Performance monitoring
    monitorPerformance() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.log('INFO', 'Page Load Performance', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        });

        // Monitor API calls
        this.monitorApiCalls();
    }

    monitorApiCalls() {
        // Override fetch for monitoring
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.log('DEBUG', 'API Call', {
                    url: url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: Math.round(endTime - startTime)
                });

                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.handleError(error, 'API Call Failed', {
                    url: url,
                    method: args[1]?.method || 'GET',
                    duration: Math.round(endTime - startTime)
                });

                throw error;
            }
        };
    }

    // Utility methods
    shouldLog(level) {
        const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
        return levels[level] >= levels[this.logLevel];
    }

    isCriticalError(errorInfo) {
        const criticalTypes = [
            'JavaScript Error',
            'Unhandled Promise Rejection',
            'Network Error'
        ];
        
        return criticalTypes.includes(errorInfo.type) || 
               errorInfo.message.includes('Script error') ||
               errorInfo.message.includes('Network');
    }

    getCurrentUserId() {
        // Try to get current user ID from various sources
        return sessionStorage.getItem('kaalcal_admin_user') || 
               localStorage.getItem('kaalcal_user_id') || 
               'anonymous';
    }

    showUserNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} system-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    async logToServer(errorInfo) {
        // Only log to server in production
        if (window.location.hostname === 'localhost') return;

        try {
            await fetch('/api/error-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorInfo)
            });
        } catch (error) {
            // Don't create infinite loop if logging fails
            console.warn('Failed to log error to server:', error);
        }
    }

    // Get error summary
    getErrorSummary() {
        return {
            totalErrors: this.errors.length,
            totalWarnings: this.warnings.length,
            recentErrors: this.errors.slice(-10),
            recentWarnings: this.warnings.slice(-10),
            performanceMetrics: this.getPerformanceMetrics()
        };
    }

    getPerformanceMetrics() {
        const perfEntries = this.logs.filter(log => 
            log.context && log.context.duration
        );

        if (perfEntries.length === 0) return null;

        const durations = perfEntries.map(log => log.context.duration);
        
        return {
            averageApiCallTime: durations.reduce((a, b) => a + b, 0) / durations.length,
            slowestApiCall: Math.max(...durations),
            fastestApiCall: Math.min(...durations),
            totalApiCalls: durations.length
        };
    }

    // Clear logs
    clearLogs() {
        this.errors = [];
        this.warnings = [];
        this.logs = [];
        this.log('INFO', 'Logs cleared by user');
    }

    // Export logs for debugging
    exportLogs() {
        const exportData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errors: this.errors,
            warnings: this.warnings,
            logs: this.logs,
            summary: this.getErrorSummary()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kaalcal-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global error handler instance
window.errorHandler = new ErrorHandler();

// Convenience functions for global use
window.handleError = (error, type, context) => errorHandler.handleError(error, type, context);
window.handleWarning = (message, context) => errorHandler.handleWarning(message, context);
window.log = (level, message, context) => errorHandler.log(level, message, context);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
