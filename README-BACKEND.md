# KAALCAL26 Backend Setup Guide

## Overview
This backend system provides a complete contact form management solution with database storage and email notifications.

## Features
- ✅ Contact form submissions saved to MongoDB
- ✅ Automatic email notifications to multiple recipients
- ✅ Admin panel for managing messages
- ✅ Rate limiting for spam protection
- ✅ Input validation and error handling
- ✅ Responsive admin interface

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account with App Password

## Installation

### 1. Install Dependencies
```bash
cd kaalcal
npm install
```

### 2. Environment Configuration
Create a `.env` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kaalcal

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kaal55499@gmail.com
EMAIL_PASS=your_gmail_app_password

# Application Configuration
PORT=3000
NODE_ENV=development

# Email Recipients
CONTACT_EMAILS=kaal55499@gmail.com,kaalcal28@gmail.com
```

### 3. Gmail App Password Setup
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings → Security
3. Select "App passwords"
4. Generate a new app password
5. Use this password in the `EMAIL_PASS` field

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# For Windows users
net start MongoDB

# For macOS/Linux users
sudo systemctl start mongod
# or
mongod
```

### 5. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com", 
    "message": "Your message here"
  }
  ```

### Message Management (Admin)
- `GET /api/messages` - Get all messages
- `PUT /api/messages/:id` - Mark message as read
- `DELETE /api/messages/:id` - Delete message

### Health Check
- `GET /api/health` - Server health status

## Security Features

### Rate Limiting
- 5 messages per 15 minutes per IP address
- Prevents spam and abuse

### Input Validation
- Name: 2-100 characters required
- Email: Valid email format required
- Message: 10-1000 characters required

### Error Handling
- Graceful error responses
- Client-side validation
- Server-side validation
- Detailed error logging

## Admin Panel Features

### Messages Page (`/admin-messages.html`)
- View all contact messages
- Mark messages as read/unread
- Delete messages
- Real-time statistics
- Auto-refresh every 30 seconds
- Responsive design

### Message Actions
- **Mark as Read**: Changes message status from "unread" to "read"
- **Delete**: Permanently removes message from database
- **Statistics**: Shows total and unread message counts

## Email Notifications

### Automatic Email Features
- Professional HTML email template
- KAALCAL branding
- Sender information
- Message content
- Timestamp
- Sent to both recipients simultaneously

### Email Template
- Modern design with KAALCAL colors
- Responsive layout
- Clear information hierarchy
- Professional formatting

## File Structure
```
kaalcal/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── admin-messages.html     # Admin messages interface
├── README-BACKEND.md     # This file
└── (existing frontend files)
```

## Testing

### Test Contact Form
1. Open `http://localhost:3000` in browser
2. Navigate to contact section
3. Fill out and submit form
4. Check email inbox for notifications
5. Visit `http://localhost:3000/admin-messages.html` to view messages

### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test contact submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

## Deployment Notes

### Production Environment
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for cloud database
3. Configure proper domain and SSL
4. Set up reverse proxy (nginx/Apache)
5. Configure environment variables securely

### Security Considerations
- Use HTTPS in production
- Secure your MongoDB connection
- Monitor rate limiting logs
- Regular backup of database
- Keep dependencies updated

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**Email Sending Fails**
- Verify Gmail app password
- Check SMTP settings
- Ensure 2FA is enabled
- Review email quota limits

**Rate Limiting Issues**
- Check IP restrictions
- Review rate limit configuration
- Monitor abuse attempts

### Logging
Server logs show:
- Database connection status
- Email sending results
- API request details
- Error information

## Support

For technical issues:
1. Check server console logs
2. Verify environment configuration
3. Test API endpoints individually
4. Review MongoDB connection

## Updates

This backend system is designed to be:
- Scalable for high traffic
- Maintainable with clear code structure
- Secure with modern best practices
- Compatible with existing frontend
