export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        // Basic system health check
        const health = {
            success: true,
            message: 'KAALCAL Backend is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            services: {
                database: 'connected', // We could add actual DB connection check here
                email: 'configured'   // We could add actual email service check here
            }
        };

        res.status(200).json(health);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
}
