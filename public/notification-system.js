// Professional Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.positions = {
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' },
            'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
            'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
        };
        this.defaultPosition = 'top-right';
        
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupStyles();
        this.setupKeyboardShortcuts();
    }

    createNotificationContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }
            
            .notification {
                background: var(--burgundy-deep);
                color: var(--text-white);
                border: 2px solid var(--gold);
                border-radius: 12px;
                padding: 16px 20px;
                margin-bottom: 12px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                pointer-events: all;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }
            
            .notification.success {
                background: linear-gradient(135deg, #28a745, #20c997);
                border-color: #28a745;
            }
            
            .notification.error {
                background: linear-gradient(135deg, #dc3545, #c82333);
                border-color: #dc3545;
            }
            
            .notification.warning {
                background: linear-gradient(135deg, #ffc107, #e0a800);
                border-color: #ffc107;
                color: #212529;
            }
            
            .notification.info {
                background: linear-gradient(135deg, #17a2b8, #138496);
                border-color: #17a2b8;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .notification-icon {
                flex-shrink: 0;
                font-size: 20px;
                margin-top: 2px;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                line-height: 1.3;
            }
            
            .notification-message {
                font-size: 14px;
                line-height: 1.4;
                opacity: 0.9;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                padding: 4px;
                line-height: 1;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                transition: width linear;
            }
            
            .notification.success .notification-progress {
                background: rgba(255, 255, 255, 0.5);
            }
            
            .notification.error .notification-progress {
                background: rgba(255, 255, 255, 0.5);
            }
            
            .notification.warning .notification-progress {
                background: rgba(0, 0, 0, 0.2);
            }
            
            .notification.info .notification-progress {
                background: rgba(255, 255, 255, 0.5);
            }
            
            @media (max-width: 768px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .notification {
                    min-width: auto;
                    max-width: none;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            .notification.pulse {
                animation: pulse 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Shift + N to clear all notifications
            if (e.shiftKey && e.key === 'N') {
                this.clearAll();
            }
            
            // Escape to close latest notification
            if (e.key === 'Escape') {
                this.closeLatest();
            }
        });
    }

    show(options) {
        // Support both string and object options
        if (typeof options === 'string') {
            options = { message: options };
        }

        const notification = this.createNotification(options);
        this.addNotification(notification);
        return notification;
    }

    success(message, title = 'Başarılı', options = {}) {
        return this.show({
            type: 'success',
            title,
            message,
            icon: 'fas fa-check-circle',
            ...options
        });
    }

    error(message, title = 'Hata', options = {}) {
        return this.show({
            type: 'error',
            title,
            message,
            icon: 'fas fa-exclamation-circle',
            duration: 8000, // Errors stay longer
            ...options
        });
    }

    warning(message, title = 'Uyarı', options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            icon: 'fas fa-exclamation-triangle',
            ...options
        });
    }

    info(message, title = 'Bilgi', options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            icon: 'fas fa-info-circle',
            ...options
        });
    }

    createNotification(options) {
        const notification = document.createElement('div');
        notification.className = `notification ${options.type || 'info'}`;
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        icon.innerHTML = options.icon ? `<i class="${options.icon}"></i>` : '';
        
        const text = document.createElement('div');
        text.className = 'notification-text';
        
        if (options.title) {
            const title = document.createElement('div');
            title.className = 'notification-title';
            title.textContent = options.title;
            text.appendChild(title);
        }
        
        const message = document.createElement('div');
        message.className = 'notification-message';
        message.textContent = options.message;
        text.appendChild(message);
        
        content.appendChild(icon);
        content.appendChild(text);
        notification.appendChild(content);
        
        // Add close button
        if (options.closable !== false) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', 'Bildirimi kapat');
            closeBtn.addEventListener('click', () => this.close(notification));
            notification.appendChild(closeBtn);
        }
        
        // Add progress bar
        if (options.duration && options.duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'notification-progress';
            notification.appendChild(progress);
            
            // Animate progress bar
            setTimeout(() => {
                progress.style.transition = `width ${options.duration}ms linear`;
                progress.style.width = '0%';
            }, 100);
        }
        
        // Store notification data
        notification.data = {
            id: Date.now() + Math.random(),
            type: options.type || 'info',
            title: options.title,
            message: options.message,
            duration: options.duration || this.defaultDuration,
            timestamp: Date.now()
        };
        
        // Add click handler
        if (options.onClick) {
            notification.style.cursor = 'pointer';
            notification.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    options.onClick(notification.data);
                }
            });
        }
        
        return notification;
    }

    addNotification(notification) {
        // Remove oldest notifications if limit reached
        while (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.close(oldest.element);
        }
        
        // Add to container
        this.container.appendChild(notification);
        this.notifications.push({ element: notification, data: notification.data });
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after duration
        if (notification.data.duration > 0) {
            setTimeout(() => {
                this.close(notification);
            }, notification.data.duration);
        }
        
        // Announce to screen readers
        this.announceToScreenReader(notification.data);
        
        return notification;
    }

    close(notification) {
        if (!notification || notification.classList.contains('hide')) return;
        
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from notifications array
            this.notifications = this.notifications.filter(n => n.element !== notification);
        }, 300);
    }

    closeLatest() {
        if (this.notifications.length > 0) {
            const latest = this.notifications[this.notifications.length - 1];
            this.close(latest.element);
        }
    }

    closeAll() {
        this.notifications.forEach(({ element }) => {
            this.close(element);
        });
    }

    clear() {
        this.closeAll();
    }

    // Update notification content
    update(notificationId, updates) {
        const notification = this.notifications.find(n => n.data.id === notificationId);
        if (notification) {
            Object.assign(notification.data, updates);
            
            // Update DOM
            if (updates.title) {
                const titleElement = notification.element.querySelector('.notification-title');
                if (titleElement) {
                    titleElement.textContent = updates.title;
                }
            }
            
            if (updates.message) {
                const messageElement = notification.element.querySelector('.notification-message');
                if (messageElement) {
                    messageElement.textContent = updates.message;
                }
            }
            
            if (updates.type) {
                notification.element.className = `notification ${updates.type} show`;
            }
            
            // Add pulse animation
            notification.element.classList.add('pulse');
            setTimeout(() => {
                notification.element.classList.remove('pulse');
            }, 300);
        }
    }

    // Get notification statistics
    getStats() {
        const stats = {
            total: this.notifications.length,
            byType: {
                success: 0,
                error: 0,
                warning: 0,
                info: 0
            },
            averageDuration: 0
        };
        
        this.notifications.forEach(({ data }) => {
            stats.byType[data.type]++;
            stats.averageDuration += data.duration;
        });
        
        if (this.notifications.length > 0) {
            stats.averageDuration = stats.averageDuration / this.notifications.length;
        }
        
        return stats;
    }

    // Set position
    setPosition(position) {
        if (this.positions[position]) {
            Object.assign(this.container.style, this.positions[position]);
            this.defaultPosition = position;
        }
    }

    // Set max notifications
    setMaxNotifications(max) {
        this.maxNotifications = Math.max(1, max);
        
        // Remove excess notifications
        while (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.close(oldest.element);
        }
    }

    // Set default duration
    setDefaultDuration(duration) {
        this.defaultDuration = Math.max(0, duration);
    }

    // Show loading notification
    loading(message = 'Yükleniyor...', options = {}) {
        return this.show({
            type: 'info',
            title: null,
            message,
            icon: 'fas fa-spinner fa-spin',
            closable: false,
            duration: 0, // No auto-hide
            ...options
        });
    }

    // Show progress notification
    progress(message = 'İşleniyor...', current = 0, total = 100, options = {}) {
        const notification = this.show({
            type: 'info',
            title: null,
            message: `${message} ${current}/${total}`,
            icon: 'fas fa-spinner fa-spin',
            closable: false,
            duration: 0,
            ...options
        });
        
        notification.data.progress = { current, total };
        return notification;
    }

    // Update progress notification
    updateProgress(notification, current, total) {
        if (notification && notification.data.progress) {
            notification.data.progress.current = current;
            notification.data.progress.total = total;
            
            const messageElement = notification.element.querySelector('.notification-message');
            if (messageElement) {
                const message = messageElement.textContent.split(' ')[0];
                messageElement.textContent = `${message} ${current}/${total}`;
            }
            
            // Complete when done
            if (current >= total) {
                setTimeout(() => {
                    this.close(notification);
                    this.success('İşlem tamamlandı!');
                }, 500);
            }
        }
    }

    // Show confirmation dialog
    confirm(message, title = 'Emin misiniz?', options = {}) {
        return new Promise((resolve) => {
            const notification = this.show({
                type: 'warning',
                title,
                message,
                icon: 'fas fa-question-circle',
                duration: 0,
                closable: false,
                ...options
            });
            
            const content = notification.querySelector('.notification-content');
            const actions = document.createElement('div');
            actions.className = 'notification-actions';
            actions.style.cssText = `
                display: flex;
                gap: 8px;
                margin-top: 12px;
            `;
            
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Evet';
            confirmBtn.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: var(--gold);
                color: var(--burgundy-deep);
                cursor: pointer;
                font-weight: 600;
            `;
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'İptal';
            cancelBtn.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: transparent;
                color: inherit;
                cursor: pointer;
                border: 1px solid currentColor;
            `;
            
            confirmBtn.addEventListener('click', () => {
                this.close(notification);
                resolve(true);
            });
            
            cancelBtn.addEventListener('click', () => {
                this.close(notification);
                resolve(false);
            });
            
            actions.appendChild(confirmBtn);
            actions.appendChild(cancelBtn);
            content.appendChild(actions);
        });
    }

    // Show toast notification (smaller, less intrusive)
    toast(message, type = 'info', options = {}) {
        return this.show({
            type,
            title: null,
            message,
            icon: null,
            duration: 3000,
            ...options
        });
    }

    // Show sticky notification (doesn't auto-hide)
    sticky(message, type = 'info', options = {}) {
        return this.show({
            type,
            title: null,
            message,
            duration: 0,
            ...options
        });
    }

    // Batch notifications
    batch(notifications, options = {}) {
        const results = [];
        
        notifications.forEach((notif, index) => {
            setTimeout(() => {
                const notification = this.show(notif);
                results.push(notification);
                
                if (index === notifications.length - 1 && options.onComplete) {
                    options.onComplete(results);
                }
            }, index * (options.delay || 100));
        });
        
        return results;
    }

    // Announce to screen readers
    announceToScreenReader(data) {
        const announcements = document.getElementById('announcements');
        if (announcements) {
            const text = data.title ? `${data.title}: ${data.message}` : data.message;
            announcements.textContent = text;
            
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    // Export notification history
    exportHistory() {
        const history = this.notifications.map(({ data }) => ({
            id: data.id,
            type: data.type,
            title: data.title,
            message: data.message,
            timestamp: new Date(data.timestamp).toISOString(),
            duration: data.duration
        }));
        
        const blob = new Blob([JSON.stringify(history, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notifications-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global notification system instance
window.notifications = new NotificationSystem();

// Convenience functions for global use
window.showNotification = (options) => notifications.show(options);
window.showSuccess = (message, title, options) => notifications.success(message, title, options);
window.showError = (message, title, options) => notifications.error(message, title, options);
window.showWarning = (message, title, options) => notifications.warning(message, title, options);
window.showInfo = (message, title, options) => notifications.info(message, title, options);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
