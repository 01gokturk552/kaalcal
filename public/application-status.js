// Application Status Checker
class ApplicationStatusChecker {
    constructor() {
        this.settings = null;
        this.loadSettings();
    }

    loadSettings() {
        const storedSettings = localStorage.getItem('kaalcal_settings');
        if (storedSettings) {
            this.settings = JSON.parse(storedSettings);
        } else {
            // Default settings if not found
            this.settings = {
                applications: {
                    delegate: { open: true },
                    delegation: { open: true },
                    team: { open: false }
                }
            };
        }
    }

    isApplicationOpen(type) {
        return this.settings?.applications?.[type]?.open || false;
    }

    getApplicationStatus(type) {
        return this.settings?.applications?.[type] || { open: false };
    }

    checkAndHandleApplicationStatus(type, formElement) {
        if (!this.isApplicationOpen(type)) {
            this.showClosedMessage(type);
            if (formElement) {
                formElement.style.display = 'none';
            }
            return false;
        }
        return true;
    }

    showClosedMessage(type) {
        const messages = {
            delegate: 'Delege başvuruları şu anda kapalıdır.',
            delegation: 'Delegasyon başvuruları şu anda kapalıdır.',
            team: 'Ekip başvuruları şu anda kapalıdır.'
        };

        const message = messages[type] || 'Başvurular şu anda kapalıdır.';
        
        // Create closed message overlay
        const closedOverlay = document.createElement('div');
        closedOverlay.className = 'application-closed-overlay';
        closedOverlay.innerHTML = `
            <div class="closed-message-content">
                <div class="closed-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2>Başvurular Şu Anda Kapalı</h2>
                <p>${message}</p>
                <p>Başvurular açıldığında duyurulacaktır.</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i>
                    Ana Sayfaya Dön
                </a>
            </div>
        `;

        // Add styles
        closedOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(77, 0, 0, 0.95) 0%, rgba(51, 0, 0, 0.95) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const content = closedOverlay.querySelector('.closed-message-content');
        content.style.cssText = `
            text-align: center;
            color: white;
            max-width: 500px;
            padding: 3rem;
        `;

        const icon = closedOverlay.querySelector('.closed-icon');
        icon.style.cssText = `
            font-size: 4rem;
            color: #FFDF00;
            margin-bottom: 2rem;
        `;

        const h2 = closedOverlay.querySelector('h2');
        h2.style.cssText = `
            color: #FFDF00;
            font-size: 2rem;
            margin-bottom: 1rem;
        `;

        const p = closedOverlay.querySelectorAll('p');
        p.forEach(paragraph => {
            paragraph.style.cssText = `
                margin-bottom: 1rem;
                line-height: 1.6;
                opacity: 0.9;
            `;
        });

        document.body.appendChild(closedOverlay);
    }

    // Update homepage buttons based on application status
    updateHomepageButtons() {
        const buttons = {
            delegate: document.querySelector('a[href="delegate-application.html"]'),
            delegation: document.querySelector('a[href="delegation-application.html"]'),
            team: document.querySelector('a[href="team-application.html"]')
        };

        Object.entries(buttons).forEach(([type, button]) => {
            if (button) {
                if (!this.isApplicationOpen(type)) {
                    button.classList.add('disabled');
                    button.setAttribute('title', 'Bu başvuru şu anda kapalı');
                    
                    // Update button text for team applications
                    if (type === 'team') {
                        const btnTitle = button.querySelector('.btn-title');
                        if (btnTitle) {
                            btnTitle.textContent = 'Ekip Başvurusu (Kapalı)';
                        }
                    }
                } else {
                    button.classList.remove('disabled');
                    button.removeAttribute('title');
                }
            }
        });
    }
}

// Initialize the checker
const appStatusChecker = new ApplicationStatusChecker();

// Export for use in other files
window.appStatusChecker = appStatusChecker;

// Auto-update homepage buttons when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        appStatusChecker.updateHomepageButtons();
    }
});
