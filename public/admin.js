// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.applications = [];
        this.users = [];
        this.init();
    }

    init() {
        this.loadStoredData();
        this.setupEventListeners();
        this.checkAuth();
    }

    // Load stored data from localStorage
    loadStoredData() {
        const storedApplications = localStorage.getItem('kaalcal_applications');
        const storedUsers = localStorage.getItem('kaalcal_users');
        const storedSettings = localStorage.getItem('kaalcal_settings');
        
        if (storedApplications) {
            this.applications = JSON.parse(storedApplications);
        } else {
            // Initialize with sample data
            this.applications = [];
            this.saveApplications();
        }

        // FORCE RESET: Always use default admin credentials for now
        // This ensures login works regardless of what's in localStorage
        this.users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'Genel Koordinatör',
                name: 'Genel Koordinatör',
                permissions: ['view', 'approve', 'reject', 'assign', 'edit']
            },
            {
                id: 2,
                username: 'ik_head',
                password: 'ikh2829',
                role: 'IK Head',
                name: 'IK Yöneticisi',
                permissions: ['view', 'approve', 'reject', 'assign']
            },
            {
                id: 3,
                username: 'ik_user',
                password: 'ik2829',
                role: 'IK',
                name: 'IK Personeli',
                permissions: ['view', 'approve', 'reject']
            }
        ];
        this.saveUsers();

        if (storedSettings) {
            this.settings = JSON.parse(storedSettings);
        } else {
            // Initialize default application settings
            this.settings = {
                applications: {
                    delegate: {
                        open: true,
                        name: 'Delege Başvurusu',
                        lastUpdated: new Date().toISOString(),
                        updatedBy: 'System'
                    },
                    delegation: {
                        open: true,
                        name: 'Delegasyon Başvurusu',
                        lastUpdated: new Date().toISOString(),
                        updatedBy: 'System'
                    },
                    team: {
                        open: false,
                        name: 'Ekip Başvurusu',
                        lastUpdated: new Date().toISOString(),
                        updatedBy: 'System'
                    }
                }
            };
            this.saveSettings();
        }
    }

    // Save data to localStorage
    saveApplications() {
        localStorage.setItem('kaalcal_applications', JSON.stringify(this.applications));
    }

    saveUsers() {
        localStorage.setItem('kaalcal_users', JSON.stringify(this.users));
    }

    saveSettings() {
        localStorage.setItem('kaalcal_settings', JSON.stringify(this.settings));
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Filters
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterApplications();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.filterApplications();
        });

        document.getElementById('searchInput').addEventListener('input', () => {
            this.filterApplications();
        });

        // Modal close buttons
        document.querySelectorAll('.close, .close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Modal action buttons
        document.getElementById('approveBtn').addEventListener('click', () => {
            this.updateApplicationStatus('approved');
        });

        document.getElementById('rejectBtn').addEventListener('click', () => {
            this.updateApplicationStatus('rejected');
        });

        document.getElementById('assignBtn').addEventListener('click', () => {
            this.assignApplication();
        });

        document.getElementById('saveNotesBtn').addEventListener('click', () => {
            this.saveNotes();
        });

        // Notification filters
        document.getElementById('notificationTypeFilter').addEventListener('change', () => {
            this.filterNotifications();
        });

        document.getElementById('notificationStatusFilter').addEventListener('change', () => {
            this.filterNotifications();
        });

        document.getElementById('clearNotificationsBtn').addEventListener('click', () => {
            this.clearNotifications();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    // Authentication
    checkAuth() {
        const storedUser = sessionStorage.getItem('kaalcal_admin_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Debug: Log the attempt
        console.log('Login attempt:', { username, password });
        console.log('Available users:', this.users);

        const user = this.users.find(u => u.username === username && u.password === password);

        // Debug: Log the result
        console.log('Found user:', user);

        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('kaalcal_admin_user', JSON.stringify(user));
            this.showDashboard();
        } else {
            // Show more helpful error message with debugging info
            const availableUsers = this.users.map(u => `• ${u.username} / ${u.password} (${u.role})`).join('\n');
            alert(`Kullanıcı adı veya şifre hatalı!\n\nMevcut giriş bilgileri:\n${availableUsers}\n\nDebug: Girdiğiniz bilgiler - Username: "${username}", Password: "${password}"`);
        }
    }

    // Function to reset admin credentials (call from browser console)
    resetAdminCredentials() {
        localStorage.removeItem('kaalcal_users');
        this.users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'Genel Koordinatör',
                name: 'Genel Koordinatör',
                permissions: ['view', 'approve', 'reject', 'assign', 'edit']
            },
            {
                id: 2,
                username: 'it_head',
                password: 'ith2829',
                role: 'IT Head',
                name: 'IT Yöneticisi',
                permissions: ['view', 'approve', 'reject', 'assign']
            },
            {
                id: 3,
                username: 'it_user',
                password: 'it2829',
                role: 'IT',
                name: 'IT Personeli',
                permissions: ['view', 'approve', 'reject']
            }
        ];
        this.saveUsers();
        console.log('Admin credentials reset to defaults');
    }

    handleLogout() {
        sessionStorage.removeItem('kaalcal_admin_user');
        this.currentUser = null;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        
        // Update user info
        document.getElementById('currentUser').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = `(${this.currentUser.role})`;

        // Load dashboard data
        this.updateStatistics();
        this.loadApplications();
        this.loadApplicationControls();
        this.loadNotifications();
    }

    // Dashboard functions
    updateStatistics() {
        const total = this.applications.length;
        const pending = this.applications.filter(app => app.status === 'pending').length;
        const approved = this.applications.filter(app => app.status === 'approved').length;
        const rejected = this.applications.filter(app => app.status === 'rejected').length;

        document.getElementById('totalApplications').textContent = total;
        document.getElementById('pendingApplications').textContent = pending;
        document.getElementById('approvedApplications').textContent = approved;
        document.getElementById('rejectedApplications').textContent = rejected;

        // Update control panel displays
        this.updateControlPanelDisplays();
    }

    updateControlPanelDisplays() {
        // Update delegate controls
        const delegateStatus = this.getApplicationStatus('delegate');
        const delegateApproved = this.applications.filter(app => app.type === 'delegate' && app.status === 'approved').length;
        
        document.getElementById('delegateControlStatus').textContent = delegateStatus ? 'Açık' : 'Kapalı';
        document.getElementById('delegateControlStatus').className = `status-badge ${delegateStatus ? 'status-open' : 'status-closed'}`;
        document.getElementById('delegateControlInfo').textContent = delegateStatus ? 'Açık' : 'Kapalı';
        document.getElementById('delegateControlApproved').textContent = delegateApproved;

        // Update delegation controls
        const delegationStatus = this.getApplicationStatus('delegation');
        const delegationApproved = this.applications.filter(app => app.type === 'delegation' && app.status === 'approved').length;
        
        document.getElementById('delegationControlStatus').textContent = delegationStatus ? 'Açık' : 'Kapalı';
        document.getElementById('delegationControlStatus').className = `status-badge ${delegationStatus ? 'status-open' : 'status-closed'}`;
        document.getElementById('delegationControlInfo').textContent = delegationStatus ? 'Açık' : 'Kapalı';
        document.getElementById('delegationControlApproved').textContent = delegationApproved;

        // Update team controls
        const teamStatus = this.getApplicationStatus('team');
        const teamApproved = this.applications.filter(app => app.type === 'team' && app.status === 'approved').length;
        
        document.getElementById('teamControlStatus').textContent = teamStatus ? 'Açık' : 'Kapalı';
        document.getElementById('teamControlStatus').className = `status-badge ${teamStatus ? 'status-open' : 'status-closed'}`;
        document.getElementById('teamControlInfo').textContent = teamStatus ? 'Açık' : 'Kapalı';
        document.getElementById('teamControlApproved').textContent = teamApproved;
    }

    loadApplications() {
        const tbody = document.getElementById('applicationsTableBody');
        tbody.innerHTML = '';

        let filteredApps = this.getFilteredApplications();

        filteredApps.forEach(app => {
            const row = this.createApplicationRow(app);
            tbody.appendChild(row);
        });
    }

    getFilteredApplications() {
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        return this.applications.filter(app => {
            const statusMatch = statusFilter === 'all' || app.status === statusFilter;
            const typeMatch = typeFilter === 'all' || app.type === typeFilter;
            const searchMatch = !searchTerm || 
                app.fullName.toLowerCase().includes(searchTerm) ||
                app.email.toLowerCase().includes(searchTerm) ||
                app.id.toString().includes(searchTerm);

            return statusMatch && typeMatch && searchMatch;
        });
    }

    createApplicationRow(application) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${application.id}</td>
            <td>${this.getTypeLabel(application.type)}</td>
            <td>${application.fullName}</td>
            <td>${application.email}</td>
            <td>${new Date(application.submittedAt).toLocaleDateString('tr-TR')}</td>
            <td><span class="status-badge status-${application.status}">${this.getStatusLabel(application.status)}</span></td>
            <td>${application.assignedTo || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" onclick="adminPanel.viewApplication(${application.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${this.canEdit() ? `
                        <button class="btn-edit" onclick="adminPanel.editApplication(${application.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${this.canDelete() ? `
                        <button class="btn-delete" onclick="adminPanel.deleteApplication(${application.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        return row;
    }

    // Application Control Functions
    loadApplicationControls() {
        const controlsContainer = document.getElementById('applicationControls');
        if (!controlsContainer) return;

        controlsContainer.innerHTML = '';

        Object.entries(this.settings.applications).forEach(([key, app]) => {
            const controlCard = this.createApplicationControlCard(key, app);
            controlsContainer.appendChild(controlCard);
        });
    }

    createApplicationControlCard(type, app) {
        const card = document.createElement('div');
        card.className = 'application-control-card';
        
        const canToggle = this.canToggleApplications();
        const statusClass = app.open ? 'status-open' : 'status-closed';
        const statusText = app.open ? 'Açık' : 'Kapalı';
        const toggleText = app.open ? 'Kapat' : 'Aç';

        card.innerHTML = `
            <div class="control-header">
                <h3>${app.name}</h3>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="control-body">
                <div class="control-info">
                    <p><strong>Durum:</strong> ${statusText}</p>
                    <p><strong>Son Güncelleme:</strong> ${new Date(app.lastUpdated).toLocaleString('tr-TR')}</p>
                    <p><strong>Güncelleyen:</strong> ${app.updatedBy}</p>
                </div>
                <div class="control-actions">
                    ${canToggle ? `
                        <button class="btn btn-${app.open ? 'danger' : 'success'}" 
                                onclick="adminPanel.toggleApplication('${type}')">
                            <i class="fas fa-${app.open ? 'times' : 'check'}"></i>
                            ${toggleText}
                        </button>
                    ` : `
                        <button class="btn btn-secondary" disabled>
                            <i class="fas fa-lock"></i>
                            İzin Yok
                        </button>
                    `}
                </div>
            </div>
        `;

        return card;
    }

    canToggleApplications() {
        return this.currentUser.permissions.includes('edit');
    }

    toggleApplication(type) {
        if (!this.canToggleApplications()) {
            alert('Başvuru durumunu değiştirme yetkiniz yok!');
            return;
        }

        const app = this.settings.applications[type];
        if (!app) return;

        // Toggle status
        app.open = !app.open;
        app.lastUpdated = new Date().toISOString();
        app.updatedBy = this.currentUser.name;

        // Save settings
        this.saveSettings();

        // Reload controls
        this.loadApplicationControls();

        // Show confirmation
        const action = app.open ? 'açtı' : 'kapattı';
        this.showNotification(`${app.name} başvurularını ${action}`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    showAdminNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span><strong>Admin Sistemi:</strong> ${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles with different positioning for admin notifications
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10001;
            max-width: 450px;
            background: ${type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#17a2b4'};
            color: white;
            border-left: 4px solid ${type === 'warning' ? '#fd7e14' : type === 'success' ? '#20c997' : '#138496'};
        `;

        document.body.appendChild(notification);

        // Auto remove after 8 seconds (longer for admin notifications)
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    // Application Control Functions
    toggleApplicationStatus(applicationType) {
        const isOpen = localStorage.getItem(`kaalcal_${applicationType}_open`) !== 'false';
        const newStatus = !isOpen;
        
        localStorage.setItem(`kaalcal_${applicationType}_open`, newStatus.toString());
        
        // Update homepage display
        if (typeof updateApplicationStatus === 'function') {
            updateApplicationStatus();
        }
        
        // Show admin notification
        const statusText = newStatus ? 'açtı' : 'kapattı';
        const applicationNames = {
            'delegate': 'Delege',
            'delegation': 'Delegasyon',
            'team': 'Ekip'
        };
        
        this.showAdminNotification(
            `${applicationNames[applicationType]} başvurularını ${statusText}`, 
            newStatus ? 'success' : 'warning'
        );
        
        // Update statistics display
        this.updateStatistics();
    }

    // Check application status
    getApplicationStatus(applicationType) {
        return localStorage.getItem(`kaalcal_${applicationType}_open`) !== 'false';
    }
    loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('kaalcal_notifications') || '[]');
        this.notifications = notifications;
        this.displayNotifications();
    }

    displayNotifications() {
        const grid = document.getElementById('notificationsGrid');
        if (!grid) return;

        const filteredNotifications = this.getFilteredNotifications();
        
        if (filteredNotifications.length === 0) {
            grid.innerHTML = '<div class="no-notifications">Bildirim bulunamadı.</div>';
            return;
        }

        grid.innerHTML = '';
        filteredNotifications.forEach(notification => {
            const card = this.createNotificationCard(notification);
            grid.appendChild(card);
        });
    }

    getFilteredNotifications() {
        const typeFilter = document.getElementById('notificationTypeFilter').value;
        const statusFilter = document.getElementById('notificationStatusFilter').value;

        return this.notifications.filter(notification => {
            const typeMatch = typeFilter === 'all' || notification.type === typeFilter;
            const statusMatch = statusFilter === 'all' || notification.status === statusFilter;
            return typeMatch && statusMatch;
        });
    }

    createNotificationCard(notification) {
        const card = document.createElement('div');
        card.className = 'notification-card';
        
        const typeIcon = notification.type === 'email' ? 'fa-envelope' : 'fa-sms';
        const statusClass = `status-${notification.status}`;
        const statusText = this.getStatusText(notification.status);
        const createdDate = new Date(notification.createdAt).toLocaleString('tr-TR');

        card.innerHTML = `
            <div class="notification-header">
                <span class="notification-type ${notification.type}">
                    <i class="fas ${typeIcon}"></i>
                    ${notification.type === 'email' ? 'E-posta' : 'SMS'}
                </span>
                <span class="notification-status ${statusClass}">${statusText}</span>
            </div>
            <div class="notification-content">
                <div class="notification-recipient">
                    ${notification.recipient}
                </div>
                <div class="notification-message">
                    ${notification.message}
                </div>
            </div>
            <div class="notification-footer">
                <span>${createdDate}</span>
                <div class="notification-actions">
                    ${notification.status === 'failed' ? `
                        <button class="btn-resend" onclick="adminPanel.resendNotification(${notification.id})">
                            <i class="fas fa-redo"></i> Yeniden Gönder
                        </button>
                    ` : ''}
                    <button class="btn-delete" onclick="adminPanel.deleteNotification(${notification.id})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Bekleyen',
            'sent': 'Gönderildi',
            'failed': 'Başarısız'
        };
        return statusMap[status] || status;
    }

    filterNotifications() {
        this.displayNotifications();
    }

    async resendNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        try {
            // Find the application
            const application = this.applications.find(app => app.id === notification.applicationId);
            if (!application) {
                throw new Error('Başvuru bulunamadı');
            }

            // Resend based on type
            if (notification.type === 'email') {
                await this.sendEmailNotification(application);
            } else if (notification.type === 'sms') {
                await this.sendSMSNotification(application);
            }

            // Update notification status
            notification.status = 'sent';
            notification.updatedAt = new Date().toISOString();
            this.saveNotifications();

            this.displayNotifications();
            this.showNotification('Bildirim başarıyla yeniden gönderildi', 'success');
        } catch (error) {
            console.error('Resend failed:', error);
            this.showNotification('Bildirim yeniden gönderilemedi: ' + error.message, 'error');
        }
    }

    deleteNotification(notificationId) {
        if (!confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) return;

        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.displayNotifications();
    }

    clearNotifications() {
        if (!confirm('Tüm bildirimleri silmek istediğinizden emin misiniz?')) return;

        this.notifications = [];
        this.saveNotifications();
        this.displayNotifications();
    }

    saveNotifications() {
        localStorage.setItem('kaalcal_notifications', JSON.stringify(this.notifications));
    }

    getTypeLabel(type) {
        const labels = {
            'delegate': 'Delege',
            'delegation': 'Delegasyon',
            'team': 'Ekip'
        };
        return labels[type] || type;
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'Bekleyen',
            'approved': 'Onaylandı',
            'rejected': 'Reddedildi'
        };
        return labels[status] || status;
    }

    // Permission checks
    canEdit() {
        return this.currentUser.permissions.includes('edit');
    }

    canDelete() {
        return this.currentUser.permissions.includes('edit');
    }

    canApprove() {
        return this.currentUser.permissions.includes('approve');
    }

    canReject() {
        return this.currentUser.permissions.includes('reject');
    }

    canAssign() {
        return this.currentUser.permissions.includes('assign');
    }

    // Application actions
    viewApplication(id) {
        const application = this.applications.find(app => app.id === id);
        if (!application) return;

        const detailsHtml = this.generateApplicationDetails(application);
        document.getElementById('applicationDetails').innerHTML = detailsHtml;
        
        // Set current application ID for actions
        this.currentApplicationId = id;

        // Show/hide action buttons based on permissions
        document.getElementById('approveBtn').style.display = this.canApprove() ? 'inline-block' : 'none';
        document.getElementById('rejectBtn').style.display = this.canReject() ? 'inline-block' : 'none';
        document.getElementById('assignBtn').style.display = this.canAssign() ? 'inline-block' : 'none';

        this.openModal('applicationModal');
    }

    generateApplicationDetails(application) {
        let html = `
            <div class="application-detail">
                <h4>Genel Bilgiler</h4>
                <p><strong>ID:</strong> ${application.id}</p>
                <p><strong>Başvuru Türü:</strong> ${this.getTypeLabel(application.type)}</p>
                <p><strong>Durum:</strong> ${this.getStatusLabel(application.status)}</p>
                <p><strong>Gönderim Tarihi:</strong> ${new Date(application.submittedAt).toLocaleString('tr-TR')}</p>
                <p><strong>Atanan:</strong> ${application.assignedTo || '-'}</p>
        `;

        // Add form fields based on application type
        if (application.formData) {
            html += '<h4>Başvuru Bilgileri</h4>';
            for (const [key, value] of Object.entries(application.formData)) {
                if (key !== 'agreement' && key !== 'newsletter') {
                    html += `<p><strong>${this.getFieldLabel(key)}:</strong> ${value}</p>`;
                }
            }
        }

        // Add notes if available
        if (application.notes) {
            html += `
                <h4>İç Notlar</h4>
                <p>${application.notes}</p>
            `;
        }

        html += '</div>';
        return html;
    }

    getFieldLabel(field) {
        const labels = {
            'fullName': 'Ad Soyad',
            'school': 'Okul',
            'classLevel': 'Sınıf Düzeyi',
            'phone': 'Telefon',
            'email': 'E-posta',
            'motivation': 'Katılım Nedeni',
            'experience': 'Deneyim',
            'delegateCount': 'Delege Sayısı',
            'paymentMethod': 'Ödeme Yöntemi'
        };
        return labels[field] || field;
    }

    editApplication(id) {
        // Implementation for editing application
        console.log('Edit application:', id);
    }

    deleteApplication(id) {
        if (confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
            this.applications = this.applications.filter(app => app.id !== id);
            this.saveApplications();
            this.updateStatistics();
            this.loadApplications();
        }
    }

    updateApplicationStatus(status) {
        if (!this.currentApplicationId) return;

        const application = this.applications.find(app => app.id === this.currentApplicationId);
        if (application) {
            application.status = status;
            application.updatedAt = new Date().toISOString();
            application.updatedBy = this.currentUser.name;
            
            this.saveApplications();
            this.updateStatistics();
            this.loadApplications();
            this.closeModal();

            // Send notifications if approved
            if (status === 'approved') {
                this.sendNotifications(application);
                
                // Update participant count and check delegate limit
                if (window.KAALCAL) {
                    const newCount = window.KAALCAL.approveApplication(application.type);
                    console.log(`Participant count updated to: ${newCount}`);
                    
                    // Show admin notification about capacity
                    if (application.type === 'delegate') {
                        const stats = window.KAALCAL.getStats();
                        if (stats.approvedDelegates >= 1000) {
                            this.showAdminNotification('Delege başvuruları 1000 kişi limitine ulaştı ve otomatik olarak kapatıldı.', 'warning');
                        } else {
                            this.showAdminNotification(`Delege başvurusu onaylandı. Toplam onaylı delege: ${stats.approvedDelegates}/1000`, 'success');
                        }
                    } else {
                        this.showAdminNotification(`Başvuru onaylandı. Toplam katılımcı: ${window.KAALCAL.getStats().participants}`, 'success');
                    }
                }
            }

            // Send notification (in real implementation)
            this.sendNotification(application, status);
        }
    }

    // Notification System
    async sendNotifications(application) {
        try {
            // Send email notification
            await this.sendEmailNotification(application);
            
            // Send SMS notification
            await this.sendSMSNotification(application);
            
            // Show success message to admin
            this.showNotification(`Başvuru onaylandı ve bildirimler gönderildi: ${application.fullName}`, 'success');
        } catch (error) {
            console.error('Notification error:', error);
            this.showNotification(`Bildirim gönderilemedi: ${error.message}`, 'error');
        }
    }

    async sendEmailNotification(application) {
        // EmailJS Implementation (Frontend-only solution)
        const emailData = {
            service_id: 'YOUR_EMAILJS_SERVICE_ID',
            template_id: 'YOUR_EMAILJS_TEMPLATE_ID',
            user_id: 'YOUR_EMAILJS_PUBLIC_KEY',
            template_params: {
                to_email: application.email,
                to_name: application.fullName,
                application_type: this.getTypeLabel(application.type),
                application_id: application.id,
                event_name: 'KAALCAL26',
                approval_date: new Date().toLocaleDateString('tr-TR'),
                from_name: 'KAALCAL26 Ekibi'
            }
        };

        // Using EmailJS (you'll need to set up EmailJS account)
        if (window.emailjs) {
            await window.emailjs.send(
                emailData.service_id,
                emailData.template_id,
                emailData.template_params,
                emailData.user_id
            );
            console.log('Email sent successfully to:', application.email);
        } else {
            // Fallback: Log email for manual sending
            this.logNotification('email', application);
        }
    }

    async sendSMSNotification(application) {
        // SMS Implementation (using a mock service for now)
        const smsData = {
            phone: application.phone,
            message: `KAALCAL26 başvurunuz onaylandı! ${application.fullName} bey, ${this.getTypeLabel(application.type)} başvurunuz incelenmiş ve onaylanmıştır. Detaylı bilgi için e-postanızı kontrol ediniz.`
        };

        // Mock SMS service (replace with real SMS API)
        try {
            // For production, integrate with:
            // - Twilio
            // - Vonage
            // - Turkish SMS services (Iletisim Merkezi, Netgsm, etc.)
            
            // Mock implementation
            console.log('SMS sent to:', application.phone, 'Message:', smsData.message);
            this.logNotification('sms', application, smsData.message);
        } catch (error) {
            console.error('SMS sending failed:', error);
            throw error;
        }
    }

    logNotification(type, application, message = null) {
        // Store notifications for manual sending if automated services fail
        const notifications = JSON.parse(localStorage.getItem('kaalcal_notifications') || '[]');
        notifications.push({
            id: Date.now(),
            type: type,
            applicationId: application.id,
            applicantName: application.fullName,
            recipient: type === 'email' ? application.email : application.phone,
            message: message || this.generateNotificationMessage(type, application),
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('kaalcal_notifications', JSON.stringify(notifications));
    }

    generateNotificationMessage(type, application) {
        if (type === 'email') {
            return `Sayın ${application.fullName},\n\nKAALCAL26 ${this.getTypeLabel(application.type)} başvurunuz incelenmiş ve onaylanmıştır.\n\nBaşvuru ID: ${application.id}\nOnay Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\nDetaylı bilgiler yakında e-posta adresinize gönderilecektir.\n\nSaygılarımızla,\nKAALCAL26 Ekibi`;
        } else if (type === 'sms') {
            return `KAALCAL26 başvurunuz onaylandı! ${application.fullName} bey, ${this.getTypeLabel(application.type)} başvurunuz onaylandı. Detaylar için e-postanızı kontrol edin.`;
        }
        return '';
    }

    // Backend API Integration (for future use)
    async sendEmailViaBackend(application) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: application.email,
                    name: application.fullName,
                    applicationType: this.getTypeLabel(application.type),
                    applicationId: application.id
                })
            });

            if (!response.ok) {
                throw new Error('Email sending failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Backend email error:', error);
            throw error;
        }
    }

    async sendSMSViaBackend(application) {
        try {
            const response = await fetch('/api/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: application.phone,
                    message: this.generateNotificationMessage('sms', application)
                })
            });

            if (!response.ok) {
                throw new Error('SMS sending failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Backend SMS error:', error);
            throw error;
        }
    }

    assignApplication() {
        if (!this.currentApplicationId) return;

        const assignTo = prompt('Atanacak kişinin adını girin:');
        if (assignTo) {
            const application = this.applications.find(app => app.id === this.currentApplicationId);
            if (application) {
                application.assignedTo = assignTo;
                application.assignedAt = new Date().toISOString();
                application.assignedBy = this.currentUser.name;
                
                this.saveApplications();
                this.loadApplications();
                this.closeModal();
            }
        }
    }

    saveNotes() {
        if (!this.currentApplicationId) return;

        const notes = document.getElementById('notesTextarea').value;
        const application = this.applications.find(app => app.id === this.currentApplicationId);
        
        if (application) {
            application.notes = notes;
            application.notesUpdatedAt = new Date().toISOString();
            application.notesUpdatedBy = this.currentUser.name;
            
            this.saveApplications();
            this.closeModal();
        }
    }

    sendNotification(application, status) {
        // In real implementation, this would send email notifications
        console.log(`Notification sent to ${application.email}: Application ${status}`);
    }

    filterApplications() {
        this.loadApplications();
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Export for use in other files
window.adminPanel = adminPanel;