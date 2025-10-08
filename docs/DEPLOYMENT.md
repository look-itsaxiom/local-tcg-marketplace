# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Domain name (optional)
- SSL certificate (recommended for production)

## Backend Deployment

### Option 1: Traditional Hosting (VPS, AWS EC2, etc.)

1. **Build the backend:**
```bash
npm run build:backend
```

2. **Set up environment variables:**
Create a `.env` file with production values:
```env
PORT=3001
NODE_ENV=production
DB_PATH=/var/lib/tcg-marketplace/marketplace.db
JWT_SECRET=your-secure-random-secret
CORS_ORIGIN=https://yourdomain.com
```

3. **Install PM2 (Process Manager):**
```bash
npm install -g pm2
```

4. **Start the application:**
```bash
cd packages/backend
pm2 start dist/index.js --name tcg-backend
pm2 save
pm2 startup
```

5. **Set up reverse proxy (Nginx):**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
RUN npm install
RUN npm run build:backend
WORKDIR /app/packages/backend
EXPOSE 3001
CMD ["npm", "start"]
```

2. **Build and run:**
```bash
docker build -t tcg-backend .
docker run -p 3001:3001 -e NODE_ENV=production tcg-backend
```

### Option 3: Platform as a Service (Heroku, Railway, etc.)

1. **Add Procfile:**
```
web: cd packages/backend && npm start
```

2. **Set environment variables in platform dashboard**

3. **Deploy using platform CLI or Git**

## Admin Portal Deployment

### Option 1: Static Hosting (Vercel, Netlify)

1. **Build the admin portal:**
```bash
npm run build:admin
```

2. **Deploy the `packages/admin/dist` directory**

3. **Configure environment variables:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_DEFAULT_LAT=40.7128
VITE_DEFAULT_LNG=-74.0060
VITE_DEFAULT_ZOOM=12
VITE_DEFAULT_RADIUS_MILES=25
```

4. **For Vercel:**
```bash
npm install -g vercel
cd packages/admin
vercel --prod
```

5. **For Netlify:**
```bash
npm install -g netlify-cli
cd packages/admin
netlify deploy --prod --dir=dist
```

### Option 2: Traditional Web Server (Nginx)

1. **Build the admin portal:**
```bash
npm run build:admin
```

2. **Copy files to web server:**
```bash
scp -r packages/admin/dist/* user@server:/var/www/admin/
```

3. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001/api;
    }
}
```

## Client App Deployment

### Option 1: PWA (Progressive Web App)

1. **Build the client app:**
```bash
npm run build:client
```

2. **Deploy the `packages/client/dist` directory** to static hosting (Vercel, Netlify, etc.)

3. **Configure environment variables:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Option 2: Android App

1. **Add Android platform:**
```bash
cd packages/client
npx cap add android
```

2. **Build the web assets:**
```bash
npm run build
```

3. **Sync to Android:**
```bash
npx cap sync android
```

4. **Open in Android Studio:**
```bash
npx cap open android
```

5. **Build APK/AAB in Android Studio** or use command line:
```bash
cd android
./gradlew assembleRelease
```

### Option 3: iOS App

1. **Add iOS platform:**
```bash
cd packages/client
npx cap add ios
```

2. **Build the web assets:**
```bash
npm run build
```

3. **Sync to iOS:**
```bash
npx cap sync ios
```

4. **Open in Xcode:**
```bash
npx cap open ios
```

5. **Build and archive in Xcode** for App Store distribution

### Publishing to App Stores

**Google Play Store:**
- Create a developer account
- Generate signing keys
- Build release AAB
- Upload to Google Play Console

**Apple App Store:**
- Create Apple Developer account
- Configure provisioning profiles
- Build and archive in Xcode
- Submit via App Store Connect

## Database

### SQLite (Default)

For small to medium deployments, SQLite works great:

1. **Backup regularly:**
```bash
sqlite3 marketplace.db ".backup 'backup.db'"
```

2. **Schedule backups with cron:**
```bash
0 2 * * * sqlite3 /var/lib/tcg-marketplace/marketplace.db ".backup '/backups/marketplace-$(date +\%Y\%m\%d).db'"
```

### Migrate to PostgreSQL (Optional)

For larger deployments:

1. **Install PostgreSQL adapter:**
```bash
npm install pg --workspace=@local-tcg/backend
```

2. **Update database configuration**

3. **Migrate schema and data**

## Monitoring

### Application Monitoring

Use PM2 for logs and monitoring:
```bash
pm2 logs tcg-backend
pm2 monit
```

### Error Tracking

Consider adding:
- Sentry for error tracking
- DataDog or New Relic for APM
- CloudWatch for AWS deployments

## Security Checklist

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Set secure JWT_SECRET
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Regular security audits: `npm audit`
- [ ] Implement proper authentication
- [ ] Set up firewall rules
- [ ] Regular database backups

## Performance Optimization

1. **Enable compression** (already configured)
2. **Use CDN for static assets**
3. **Implement caching headers**
4. **Enable database indexes** (already configured)
5. **Use Redis for session storage** (optional)
6. **Implement API rate limiting**

## Scaling

### Horizontal Scaling

1. **Load balancer configuration:**
```nginx
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}
```

2. **Shared database**
3. **Session storage in Redis**
4. **Static assets on CDN**

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check Node.js version
- Verify environment variables
- Check database permissions
- Review logs: `pm2 logs tcg-backend`

**Frontend can't connect to API:**
- Verify CORS configuration
- Check API URL in environment variables
- Verify SSL certificates
- Check network/firewall rules

**Database errors:**
- Check file permissions
- Verify database path exists
- Check disk space
- Review database logs

## Rollback Plan

1. **Keep previous build:**
```bash
mv dist dist.backup
```

2. **Quick rollback:**
```bash
pm2 stop tcg-backend
rm -rf dist
mv dist.backup dist
pm2 start tcg-backend
```

3. **Database rollback:**
```bash
cp backup.db marketplace.db
```
