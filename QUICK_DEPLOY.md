# 🚀 Quick Online Deployment Guide

## Deploy AyurDiscovery AI to the Web in 10 Minutes

### Option 1: Railway + Vercel (Recommended)

#### Backend Deployment (Railway)
1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js and deploy
   - Set environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurdiscovery-ai
     PORT=3002
     ```

3. **Get Backend URL**
   - Copy the Railway app URL (e.g., `https://your-app.railway.app`)

#### Frontend Deployment (Vercel)
1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Build settings:
     - Build Command: `npm run build:frontend`
     - Output Directory: `dist`
   - Set environment variables:
     ```
     VITE_API_URL=https://your-railway-app.railway.app
     ```

3. **Update API Proxy**
   - Update `vercel.json` with your Railway backend URL
   - Redeploy

### Option 2: Render (Full Stack)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Create "Web Service"
   - Connect GitHub repository
   - Settings:
     - Build Command: `npm run build`
     - Start Command: `npm run start:prod`
   - Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your-mongodb-atlas-connection
     ```

3. **Deploy Frontend**
   - Create "Static Site"
   - Connect same repository
   - Settings:
     - Build Command: `npm run build:frontend`
     - Publish Directory: `dist`

### Option 3: Netlify + Railway

1. **Backend on Railway** (same as Option 1)

2. **Frontend on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder, or connect GitHub
   - Set build settings:
     - Build Command: `npm run build:frontend`
     - Publish Directory: `dist`

### MongoDB Atlas Setup (Required for all options)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create free cluster

2. **Configure Database**
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for all)
   - Get connection string

3. **Seed Database** (Optional)
   ```bash
   MONGODB_URI=your-atlas-connection npm run seed
   ```

### ⚡ One-Click Deploy Buttons

[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/varunchandra7/developerA)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/varunchandra7/developerA)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/varunchandra7/developerA)

### Environment Variables Reference

#### Required Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurdiscovery-ai
PORT=3002
```

#### Optional Variables
```env
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your-secure-jwt-secret
RATE_LIMIT_MAX_REQUESTS=100
```

### Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend-url/api/v1/health`
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] Database connection established
- [ ] CORS configured properly

### Troubleshooting

#### Common Issues:
1. **CORS Errors**: Update CORS_ORIGIN environment variable
2. **Database Connection**: Check MongoDB Atlas IP whitelist
3. **Build Failures**: Ensure all dependencies in package.json
4. **API 404 Errors**: Verify backend URL in frontend configuration

#### Support Resources:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)

---

**Total Deployment Time: ~10-15 minutes**
**Cost: FREE (all platforms offer free tiers)**

Your AyurDiscovery AI platform will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`