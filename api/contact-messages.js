const mongoose = require('mongoose');

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

// Contact Message Schema
const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'contactmessages' });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

// Main handler
export default async function handler(req, res) {
    try {
        // Connect to database
        await connectDB();

        // Handle different HTTP methods
        switch (req.method) {
            case 'GET':
                return await getMessages(req, res);
            case 'DELETE':
                return await deleteMessage(req, res);
            default:
                return res.status(405).json({
                    success: false,
                    message: 'Method not allowed'
                });
        }
    } catch (error) {
        console.error('Contact Messages API error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// GET messages
async function getMessages(req, res) {
    try {
        const { page = 1, limit = 50, search } = req.query;
        const skip = (page - 1) * limit;
        
        // Build filter
        let filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const messages = await ContactMessage.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await ContactMessage.countDocuments(filter);
        
        res.json({
            success: true,
            data: messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
}

// DELETE message
async function deleteMessage(req, res) {
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
            message: 'Message deleted successfully',
            data: message
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message
        });
    }
}
