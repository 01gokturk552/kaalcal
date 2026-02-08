// Backend API Example for KAALCAL26 Notification System
// This is a sample Node.js + Express implementation for future use

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email Configuration
const emailTransporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SMS Configuration (Example with Twilio)
const twilio = require('twilio');
const smsClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Email Template
const getEmailTemplate = (data) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>KAALCAL26 Başvuru Onayı</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                .header { background: #4D0000; color: #FFDF00; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
                .btn { display: inline-block; padding: 12px 24px; background: #FFDF00; color: #4D0000; text-decoration: none; border-radius: 5px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>KAALCAL26</h1>
                    <p>Büyük Buluşmaya Geri Sayım</p>
                </div>
                <div class="content">
                    <h2>🎉 Başvurunuz Onaylandı!</h2>
                    <p>Sayın <strong>${data.name}</strong>,</p>
                    <p>KAALCAL26 <strong>${data.applicationType}</strong> başvurunuz incelenmiş ve onaylanmıştır.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Başvuru Detayları:</h3>
                        <ul>
                            <li><strong>Başvuru ID:</strong> ${data.applicationId}</li>
                            <li><strong>Başvuru Türü:</strong> ${data.applicationType}</li>
                            <li><strong>Onay Tarihi:</strong> ${data.approvalDate}</li>
                        </ul>
                    </div>
                    
                    <p>Detaylı bilgiler ve sonraki adımlar için bizimle iletişime geçebilirsiniz.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://kaalcal26.com" class="btn">Web Sitesini Ziyaret Et</a>
                    </div>
                    
                    <p>Saygılarımızla,<br>KAALCAL26 Ekibi</p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 KAALCAL26. Tüm hakları saklıdır.</p>
                    <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// API Routes

// Send Email
app.post('/api/send-email', async (req, res) => {
    try {
        const { email, name, applicationType, applicationId } = req.body;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@kaalcal26.com',
            to: email,
            subject: 'KAALCAL26 Başvurunuz Onaylandı',
            html: getEmailTemplate({
                name,
                applicationType,
                applicationId,
                approvalDate: new Date().toLocaleDateString('tr-TR')
            })
        };

        await emailTransporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Email sent successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// Send SMS
app.post('/api/send-sms', async (req, res) => {
    try {
        const { phone, message } = req.body;
        
        // Turkish phone number format fix
        const formattedPhone = phone.startsWith('90') ? phone : `90${phone}`;
        
        const smsOptions = {
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+${formattedPhone}`
        };

        await smsClient.messages.create(smsOptions);
        
        res.json({ 
            success: true, 
            message: 'SMS sent successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('SMS sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send SMS',
            error: error.message 
        });
    }
});

// Get notification status
app.get('/api/notifications/:applicationId', (req, res) => {
    // This would typically query a database
    // For now, return a mock response
    res.json({
        applicationId: req.params.applicationId,
        notifications: [
            {
                type: 'email',
                status: 'sent',
                timestamp: new Date().toISOString()
            },
            {
                type: 'sms',
                status: 'sent',
                timestamp: new Date().toISOString()
            }
        ]
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        services: {
            email: 'configured',
            sms: 'configured'
        }
    });
});

// Serve static files (for production)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`KAALCAL26 Notification Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Environment variables needed:
/*
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@kaalcal26.com

TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
*/

// Installation instructions:
/*
npm init -y
npm install express nodemailer cors twilio
*/

// To run:
/*
node backend-example.js
*/
