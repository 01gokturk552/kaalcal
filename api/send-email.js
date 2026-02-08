const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// MongoDB Connection (cached)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/kaalcal';
        cached.promise = mongoose.connect(connString);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Email transporter
let transporter = null;

async function getEmailTransporter() {
    if (transporter) {
        return transporter;
    }

    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    return transporter;
}

// Application Schema
const applicationSchema = new mongoose.Schema({
    id: String,
    type: String,
    fullName: String,
    email: String,
    status: String,
    createdAt: Date,
    updatedAt: Date
}, { collection: 'applications' });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

// Main handler
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        // Connect to database
        await connectDB();

        const { email, name, applicationType, applicationId, status = 'approved' } = req.body;

        // Validate required fields
        if (!email || !name || !applicationType || !applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, name, applicationType, applicationId'
            });
        }

        // Find the application
        const application = await Application.findOne({ id: applicationId });
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Update application status
        application.status = status;
        application.updatedAt = new Date();
        await application.save();

        // Send email notification
        const transporter = await getEmailTransporter();
        
        // Get recipient emails
        const contactEmails = process.env.CONTACT_EMAILS ? 
            process.env.CONTACT_EMAILS.split(',').map(email => email.trim()) : 
            ['kaal55499@gmail.com', 'kaalcal28@gmail.com'];

        // Prepare email content
        const statusText = status === 'approved' ? 'Onaylandı' : 'Reddedildi';
        const subject = `KAALCAL26 Başvuru Durumu: ${statusText}`;
        
        const emailContent = `
Sayın ${name},

KAALCAL26 ${applicationType} başvurunuz ${statusText}.

Başvuru ID: ${applicationId}
Durum: ${statusText}
Tarih: ${new Date().toLocaleDateString('tr-TR')}

${status === 'approved' ? 
    'Tebrikler! Başvurunuz onaylanmıştır. Etkinlik hakkında detaylı bilgi için e-posta adresinizi takip etmeye devam edin.' :
    'Başvurunuz değerlendirilmiştir ancak uygun bulunmamıştır. Başka fırsatlarda görüşmek üzere.'
}

Saygılarımızla,
KAALCAL26 Ekibi
        `;

        // Send email to applicant
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: emailContent.replace(/\n/g, '<br>')
        });

        // Send notification to admin team
        const adminNotification = `
Yeni bir başvuru güncellendi:

Başvuran: ${name}
E-posta: ${email}
Tür: ${applicationType}
Durum: ${statusText}
ID: ${applicationId}
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contactEmails,
            subject: `Başvuru Güncellendi: ${statusText} - ${name}`,
            text: adminNotification
        });

        res.json({
            success: true,
            message: `Application ${status} and email sent successfully`,
            applicationId: applicationId,
            status: status
        });

    } catch (error) {
        console.error('Send email error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
