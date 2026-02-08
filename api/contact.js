const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

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
        cached.promise = mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(mongoose => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Email Service
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email function
async function sendContactEmail(name, email, message) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAILS || 'kaal55499@gmail.com,kaalcal28@gmail.com',
        subject: `KAALCAL26 - New Contact Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
                <div style="background: #4D0000; color: #FFDF00; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">KAALCAL26</h1>
                    <p style="margin: 5px 0 0; opacity: 0.9;">New Contact Message</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #4D0000; margin: 0 0 10px;">Sender Information</h3>
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString('tr-TR')}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #4D0000; margin: 0 0 10px;">Message</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #FFDF00; border-radius: 5px;">
                            <p style="margin: 0; line-height: 1.6;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="margin: 0; color: #666; font-size: 12px;">
                            This message was sent from the KAALCAL26 website contact form
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Contact email sent successfully');
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
}

// Validation middleware
const validateContact = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

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

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, message } = req.body;

        // Save to database
        const contactMessage = new ContactMessage({
            name,
            email,
            message
        });

        await contactMessage.save();

        // Send email
        try {
            await sendContactEmail(name, email, message);
        } catch (emailError) {
            console.error('Email failed but message saved:', emailError);
            // Don't fail the request if email fails, but log it
        }

        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
