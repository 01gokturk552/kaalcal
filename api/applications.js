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

// Application Schema
const applicationSchema = new mongoose.Schema({
    id: String,
    type: String,
    fullName: String,
    email: String,
    phone: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
    assignedTo: String,
    assignedAt: Date,
    assignedBy: String,
    notes: String,
    notesUpdatedAt: Date,
    notesUpdatedBy: String
}, { collection: 'applications' });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

// Main handler
export default async function handler(req, res) {
    try {
        // Connect to database
        await connectDB();

        // Handle different HTTP methods
        switch (req.method) {
            case 'GET':
                return await getApplications(req, res);
            case 'POST':
                return await createApplication(req, res);
            case 'PUT':
                return await updateApplication(req, res);
            case 'DELETE':
                return await deleteApplication(req, res);
            default:
                return res.status(405).json({
                    success: false,
                    message: 'Method not allowed'
                });
        }
    } catch (error) {
        console.error('Applications API error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// GET applications
async function getApplications(req, res) {
    try {
        const { status, type, search } = req.query;
        
        // Build filter
        let filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (type && type !== 'all') {
            filter.type = type;
        }
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { id: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await Application.find(filter).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: applications,
            count: applications.length
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
}

// POST application
async function createApplication(req, res) {
    try {
        const applicationData = req.body;
        
        // Create new application
        const application = new Application(applicationData);
        await application.save();
        
        res.status(201).json({
            success: true,
            message: 'Application created successfully',
            data: application
        });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create application',
            error: error.message
        });
    }
}

// PUT application
async function updateApplication(req, res) {
    try {
        const { id } = req.query;
        const updateData = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
        }

        const application = await Application.findOneAndUpdate(
            { id: id },
            { 
                ...updateData, 
                updatedAt: new Date() 
            },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application updated successfully',
            data: application
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application',
            error: error.message
        });
    }
}

// DELETE application
async function deleteApplication(req, res) {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required'
            });
        }

        const application = await Application.findOneAndDelete({ id: id });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application deleted successfully',
            data: application
        });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete application',
            error: error.message
        });
    }
}
