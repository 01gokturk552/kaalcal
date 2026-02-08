# EmailJS Setup Guide for KAALCAL26

## 📧 EmailJS Integration (Frontend-Only Solution)

EmailJS allows sending emails directly from the frontend without requiring a backend server.

### 🚀 Quick Setup Steps

#### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

#### 2. Create Email Service
1. Go to Dashboard → Email Services
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account
5. Note your **Service ID**

#### 3. Create Email Template
1. Go to Dashboard → Email Templates
2. Click "Create New Template"
3. Use this template structure:

```
Subject: KAALCAL26 Başvurunuz Onaylandı

{{to_name}} bey,

KAALCAL26 {{application_type}} başvurunuz incelenmiş ve onaylanmıştır.

Başvuru ID: {{application_id}}
Etkinlik: {{event_name}}
Onay Tarihi: {{approval_date}}

Detaylı bilgiler için web sitemizi ziyaret edebilirsiniz.

Saygılarımızla,
{{from_name}}
```

#### 4. Get Your Credentials
From your EmailJS dashboard, note:
- **Service ID**
- **Template ID** 
- **Public Key**

#### 5. Update Admin Panel
In `admin.js`, update these values:

```javascript
const emailData = {
    service_id: 'YOUR_SERVICE_ID',        // Replace with your Service ID
    template_id: 'YOUR_TEMPLATE_ID',      // Replace with your Template ID
    user_id: 'YOUR_PUBLIC_KEY',           // Replace with your Public Key
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
```

#### 6. Initialize EmailJS
In `admin.html`, EmailJS is already included. Add this script at the bottom:

```javascript
<script>
    (function() {
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your Public Key
    })();
</script>
```

## 📱 SMS Integration Options

### Option 1: Turkish SMS Services
- **İletişim Merkezi**: [https://www.iletisimmerkezi.com/](https://www.iletisimmerkezi.com/)
- **Netgsm**: [https://www.netgsm.com.tr/](https://www.netgsm.com.tr/)
- **Vatansms**: [https://www.vatansms.com/](https://www.vatansms.com/)

### Option 2: International Services
- **Twilio**: [https://www.twilio.com/](https://www.twilio.com/)
- **Vonage**: [https://www.vonage.com/](https://www.vonage.com/)

## 🔧 Backend Implementation (Recommended for Production)

For production use, consider the backend implementation in `backend-example.js`:

### Benefits:
- ✅ More secure (API keys hidden)
- ✅ Better error handling
- ✅ Higher reliability
- ✅ More SMS provider options
- ✅ Email tracking and analytics

### Setup:
1. Install Node.js
2. Run: `npm install express nodemailer cors twilio`
3. Set environment variables
4. Run: `node backend-example.js`

## 🎯 Testing the System

### Test EmailJS:
1. Approve any application in admin panel
2. Check browser console for success/error messages
3. Check your email inbox
4. Check notifications section in admin panel

### Test SMS:
1. Currently mocked (logs to console)
2. For real SMS, integrate with chosen provider
3. Update `sendSMSNotification()` function

## 📊 Notification Management

The admin panel includes:
- **Notification History**: View all sent notifications
- **Status Tracking**: See sent, pending, failed notifications
- **Resend Failed**: Retry failed notifications
- **Clear History**: Clean up old notifications

## 🛠️ Troubleshooting

### EmailJS Issues:
- Check Service ID, Template ID, and Public Key
- Verify email template variables match
- Check browser console for errors
- Ensure EmailJS is properly initialized

### SMS Issues:
- Verify phone number format (should start with +90)
- Check SMS provider credentials
- Review API documentation
- Test with simple message first

### General Issues:
- Check browser console for errors
- Verify network connectivity
- Ensure all required fields are filled
- Check notification history for error details

## 📈 Scaling Up

When ready to scale:
1. Implement backend API (`backend-example.js`)
2. Add database for notification tracking
3. Add email templates for different events
4. Integrate with professional SMS service
5. Add analytics and reporting
6. Implement queue system for bulk notifications

## 🔐 Security Notes

- **EmailJS**: Public key is exposed (acceptable for EmailJS)
- **Backend API**: Never expose API keys in frontend
- **Rate Limiting**: Implement to prevent abuse
- **Validation**: Validate all input data
- **HTTPS**: Always use HTTPS in production
