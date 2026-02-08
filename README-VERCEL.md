# KAALCAL26 - Vercel Deployment Guide

## Overview
This guide covers deploying the KAALCAL26 website with backend functionality on Vercel using serverless functions.

## Prerequisites
- Vercel account
- MongoDB Atlas cluster
- Gmail account with App Password
- GitHub repository (recommended)

## Files Structure for Vercel

```
kaalcal/
├── api/                    # Serverless functions
│   ├── contact.js         # Contact form endpoint
│   ├── messages.js        # Message management endpoint
│   └── health.js          # Health check endpoint
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
├── (frontend files)      # All HTML, CSS, JS files
└── README-VERCEL.md      # This file
```

## Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Database Configuration
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kaalcal
```

### Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CONTACT_EMAILS=kaal55499@gmail.com,kaalcal28@gmail.com
```

### Application Configuration
```
NODE_ENV=production
```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free account

2. **Create Cluster**
   - Choose "Shared Cluster" (free tier)
   - Select region closest to your users
   - Name your cluster (e.g., "kaalcal-cluster")

3. **Configure Network Access**
   - Go to Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Vercel to connect

4. **Create Database User**
   - Go to Database Access → Add New Database User
   - Username: `kaalcal_admin` (or your choice)
   - Password: Generate strong password
   - Save credentials for environment variables

5. **Get Connection String**
   - Go to Database → Connect → Connect your application
   - Select "Node.js" driver
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<cluster-name>` with your actual cluster name

## Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Go to Google Account settings
   - Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "KAALCAL Backend"
   - Copy the generated 16-character password

3. **Use App Password**
   - Use this password in `EMAIL_PASS` environment variable
   - NOT your regular Gmail password

## Deployment Steps

### 1. Push to GitHub (Recommended)
```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/yourusername/kaalcal.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Add environment variables
6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGO_URI
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add CONTACT_EMAILS

# Redeploy with environment variables
vercel --prod
```

## API Endpoints

After deployment, these endpoints will be available:

### Contact Form
```
POST https://your-domain.vercel.app/api/contact
```

### Message Management
```
GET https://your-domain.vercel.app/api/messages
PUT https://your-domain.vercel.app/api/messages?id=messageId
DELETE https://your-domain.vercel.app/api/messages?id=messageId
```

### Health Check
```
GET https://your-domain.vercel.app/api/health
```

## Testing the Deployment

### 1. Health Check
Visit `https://your-domain.vercel.app/api/health` in browser
Should return:
```json
{
  "success": true,
  "message": "KAALCAL Backend is running",
  "timestamp": "2026-02-08T...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Contact Form
1. Visit your deployed site
2. Go to contact section
3. Fill out and submit form
4. Check both email inboxes
5. Visit admin messages page to see stored message

### 3. Admin Panel
1. Visit `https://your-domain.vercel.app/admin-messages.html`
2. Should show all submitted messages
3. Test marking as read and deleting

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Error**: `MongoNetworkError`
**Solution**: 
- Check MONGO_URI environment variable
- Ensure IP access is configured (0.0.0.0/0)
- Verify database user credentials

#### 2. Email Sending Error
**Error**: `Authentication failed`
**Solution**:
- Use App Password, not regular password
- Check EMAIL_USER and EMAIL_PASS variables
- Ensure 2FA is enabled on Gmail account

#### 3. Function Timeout
**Error**: `Function invocation timed out`
**Solution**:
- Check MongoDB connection string
- Ensure database cluster is in same region
- Monitor Vercel function logs

#### 4. CORS Issues
**Error**: `No 'Access-Control-Allow-Origin' header`
**Solution**: Vercel handles CORS automatically for same-origin requests

### Debugging Tools

#### Vercel Logs
```bash
vercel logs
```

#### Function Logs
In Vercel Dashboard → Functions → View Logs

#### Environment Variables Check
```bash
vercel env ls
```

## Performance Optimization

### 1. Database Indexing
MongoDB Atlas automatically creates indexes for `_id` field
Consider adding indexes for frequently queried fields:
```javascript
// In MongoDB Atlas console
db.contactmessages.createIndex({ "createdAt": -1 })
db.contactmessages.createIndex({ "status": 1 })
```

### 2. Function Caching
Vercel automatically caches functions
Functions stay warm for ~5 minutes after first invocation

### 3. CDN Benefits
Vercel provides global CDN
Static assets served from edge locations
API functions run in nearest region

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to git
- Use Vercel environment variables
- Rotate passwords regularly

### 2. Database Security
- Use strong database passwords
- Enable MongoDB Atlas authentication
- Monitor database access logs

### 3. Rate Limiting
Built-in rate limiting in contact.js
5 messages per 15 minutes per IP

### 4. Input Validation
Server-side validation in all endpoints
Client-side validation for UX

## Monitoring and Maintenance

### 1. Vercel Analytics
Built-in performance monitoring
Page speed insights
Visitor analytics

### 2. MongoDB Atlas Monitoring
Database performance metrics
Query performance analyzer
Real-time monitoring

### 3. Error Tracking
Check Vercel function logs
Monitor error rates
Set up alerts if needed

## Scaling Considerations

### 1. Database Scaling
MongoDB Atlas free tier: 512MB storage
Upgrade when approaching limits
Consider read replicas for high traffic

### 2. Function Scaling
Vercel automatically scales functions
No cold start issues with frequent usage
Monitor function execution time

### 3. CDN Scaling
Vercel CDN automatically scales
No additional configuration needed
Global edge network included

## Backup Strategy

### 1. Database Backups
MongoDB Atlas provides automatic backups
Configure backup schedule in Atlas console
Test restore procedures regularly

### 2. Code Backups
Git repository provides version control
Vercel deployments are immutable
Rollback to previous deployments if needed

## Cost Analysis

### Free Tier Limits
- Vercel: 100GB bandwidth, 100 function invocations/day
- MongoDB Atlas: 512MB storage, basic cluster
- Email: Gmail SMTP (free for reasonable usage)

### When to Upgrade
- >100,000 visitors/month
- >500MB database storage
- High email volume

## Support

### Vercel Documentation
[https://vercel.com/docs](https://vercel.com/docs)

### MongoDB Atlas Documentation
[https://docs.mongodb.com/atlas](https://docs.mongodb.com/atlas)

### Common Issues
Check Vercel community forums
MongoDB Atlas support center
Stack Overflow for specific issues
