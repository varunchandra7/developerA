# MongoDB Atlas Setup Guide

## 🗄️ Setting up MongoDB Atlas for AyurDiscovery AI

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project named "AyurDiscovery AI"

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "Free" tier (M0 Sandbox)
3. Select a cloud provider and region (preferably closest to your deployment)
4. Cluster name: `ayurdiscovery-cluster`

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `ayurdiscovery-admin`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Atlas admin"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses of your deployment servers

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://ayurdiscovery-admin:<password>@ayurdiscovery-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Environment Variables
Replace the connection string in your environment files:

**For Production (.env.production):**
```env
MONGODB_URI=mongodb+srv://ayurdiscovery-admin:YOUR_PASSWORD@ayurdiscovery-cluster.xxxxx.mongodb.net/ayurdiscovery-ai?retryWrites=true&w=majority
```

**For Cloud Deployment:**
Set the MONGODB_URI environment variable in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Railway**: Variables tab in your service
- **Render**: Environment tab in your service
- **Netlify**: Site Settings → Environment Variables

### Step 7: Database Initialization
The application will automatically create the necessary collections and indexes on first run.

### Step 8: Seed Data (Optional)
To populate with sample data:
```bash
# Update .env with Atlas connection string
MONGODB_URI=your_atlas_connection_string npm run seed
```

### Backup and Monitoring
- Atlas provides automatic backups for free tier
- Monitor usage in the Atlas dashboard
- Set up alerts for performance metrics

### Security Best Practices
1. Use strong passwords for database users
2. Restrict IP access to specific addresses in production
3. Enable audit logging (paid tiers)
4. Regularly rotate passwords
5. Use separate databases for different environments

### Connection String Examples

**Development (local):**
```env
MONGODB_URI=mongodb://localhost:27017/ayurdiscovery-ai
```

**Production (Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurdiscovery-ai?retryWrites=true&w=majority
```

**With additional options:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurdiscovery-ai?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000
```

---

## 🔧 Troubleshooting

### Common Issues:
1. **Authentication failed**: Check username/password
2. **IP not whitelisted**: Add your IP to Network Access
3. **Connection timeout**: Check firewall settings
4. **SSL certificate error**: Ensure retryWrites=true in connection string

### Testing Connection:
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_CONNECTION_STRING')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Connection failed:', err));
"
```