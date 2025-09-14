# AyurDiscovery AI - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- MongoDB Atlas account (for cloud database)
- Domain name (optional)

### Quick Deploy with Docker

1. **Set Environment Variables**
```bash
export MONGO_PASSWORD=your-secure-mongodb-password
```

2. **Build and Deploy**
```bash
npm run build
npm run docker:up
```

3. **Access the Application**
- Frontend: http://localhost
- Backend API: http://localhost:3002
- API Documentation: http://localhost:3002/api/v1/docs

### Cloud Deployment Options

#### Option 1: Vercel + Railway
1. **Frontend (Vercel)**
   - Connect GitHub repository
   - Build Command: `npm run build:frontend`
   - Output Directory: `dist`

2. **Backend (Railway)**
   - Connect GitHub repository
   - Build Command: `npm run build:backend`
   - Start Command: `npm run start:prod`

#### Option 2: Netlify + Render
1. **Frontend (Netlify)**
   - Build Command: `npm run build:frontend`
   - Publish Directory: `dist`

2. **Backend (Render)**
   - Build Command: `npm run build:backend`
   - Start Command: `npm run start:prod`

#### Option 3: AWS/GCP/Azure
- Use Docker containers with Kubernetes or container services
- Configure MongoDB Atlas for database
- Set up load balancer and SSL certificates

### Environment Configuration

#### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurdiscovery-ai
PORT=3002
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your-jwt-secret
```

#### Database Setup (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Add IP whitelist (0.0.0.0/0 for cloud deployment)
3. Create database user
4. Update MONGODB_URI in environment variables

### Monitoring and Health Checks

#### Health Check Endpoints
- Backend: `GET /api/v1/health`
- Database connectivity included in health response

#### Docker Health Checks
- Automatic health monitoring for all services
- Restart policies configured for high availability

### Security Configuration

#### CORS Settings
- Configured for production domains
- Restrictive policy for API access

#### Security Headers
- XSS Protection
- Content Security Policy
- Frame Options
- HTTPS enforcement

### Scaling Considerations

#### Horizontal Scaling
- Stateless backend design
- Database connection pooling
- Load balancer ready

#### Performance Optimization
- Nginx caching for static assets
- Gzip compression enabled
- Database indexing optimized

### Troubleshooting

#### Common Issues
1. **Database Connection**
   - Check MongoDB URI and credentials
   - Verify network connectivity

2. **CORS Errors**
   - Update CORS_ORIGIN environment variable
   - Check frontend URL configuration

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check TypeScript compilation errors

#### Logs
```bash
# View all service logs
npm run docker:logs

# View specific service
docker logs ayurdiscovery-backend
docker logs ayurdiscovery-frontend
```

### Backup and Recovery

#### Database Backup
- MongoDB Atlas automated backups
- Point-in-time recovery available

#### Application Backup
- Source code in GitHub repository
- Docker images for easy restoration

---

## 📞 Support

For deployment assistance or issues, refer to the project documentation or contact the development team.