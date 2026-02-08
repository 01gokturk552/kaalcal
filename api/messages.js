import mongoose from 'mongoose';

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
        default: () => Date.now()
    }
});

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Main handler
export default async function handler(req, res) {
    try {
        // Connect to database
        await connectDB();

        // Handle different HTTP methods
        switch (req.method) {
            case 'GET':
                return handleGet(req, res);
            case 'PUT':
                return handlePut(req, res);
            case 'DELETE':
                return handleDelete(req, res);
            default:
                return res.status(405).json({
                    success: false,
                    message: 'Method not allowed'
                });
        }
    } catch (error) {
        console.error('Messages API error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// GET /api/messages - Get all messages
async function handleGet(req, res) {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages'
        });
    }
}

// PUT /api/messages - Mark message as read (using query parameter)
async function handlePut(req, res) {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Message ID is required'
            });
        }

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            { status: 'read' },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message
        });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message'
        });
    }
}

// DELETE /api/messages - Delete message (using query parameter)
async function handleDelete(req, res) {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Message ID is required'
            });
        }

        const message = await ContactMessage.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
}
