# Deployment Guide for SEBI Compliance System

This guide provides comprehensive deployment instructions for hosting the SEBI Compliance Verification System on various platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Google Gemini API keys
- GCP credentials (optional, for full functionality)

### Backend Deployment

#### Step 1: Prepare Backend for Vercel
```bash
# The backend is already configured with:
# - vercel.json for Vercel configuration
# - api/index.py for Vercel serverless functions
# - requirements.txt with all dependencies
```

#### Step 2: Deploy Backend
1. **Create New Project:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set **Root Directory:** `Backend`

2. **Configure Build Settings:**
   - **Framework Preset:** Python
   - **Root Directory:** Backend
   - **Build Command:** `pip install -r requirements.txt`
   - **Output Directory:** (leave empty)

3. **Environment Variables:**
   ```
   ENVIRONMENT=production
   GEMINI_API_KEY=your_actual_gemini_key
   GEMINI_API_KEY_2=your_backup_gemini_key
   GCS_BUCKET_NAME=your_gcp_bucket (optional)
   GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...} (optional)
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy:** Click "Deploy"
5. **Get Backend URL:** `https://your-project-name.vercel.app`

### Frontend Deployment

#### Step 1: Deploy Frontend
1. **Create New Project:**
   - Click "New Project" in Vercel
   - Import from GitHub (same repository)
   - Set **Root Directory:** `Frontend`

2. **Configure Build Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Frontend

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
   NEXT_PUBLIC_API_TIMEOUT=300000
   ```

4. **Deploy:** Click "Deploy"

## 🔧 Troubleshooting Vercel Deployment

### Common Issues and Solutions

#### 1. CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
- Ensure `FRONTEND_URL` is set in backend environment variables
- Check that CORS origins include your Vercel domains
- Redeploy both frontend and backend after configuration changes

#### 2. API Connection Issues
**Problem:** Frontend shows "Failed to fetch" errors
**Solution:**
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Check backend is deployed and accessible
- Ensure backend environment variables are properly configured

#### 3. Build Failures
**Problem:** Vercel build fails
**Solutions:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in requirements.txt
- Verify Python version compatibility (3.11 recommended)

#### 4. Environment Variables Not Working
**Problem:** API keys or configuration not applied
**Solution:**
- Redeploy after adding environment variables
- Check variable names match exactly
- Ensure sensitive data is properly formatted (JSON for GCP credentials)

#### 5. Cold Start Issues
**Problem:** First request takes too long
**Solution:**
- This is normal for serverless functions
- Consider upgrading to Vercel Pro for better performance
- Implement caching strategies in your application

### Testing Deployment

#### Health Check
```bash
# Test backend health
curl https://your-backend-url.vercel.app/health

# Expected response:
{"status":"healthy","message":"SEBI Compliance Backend is operational"}
```

#### API Connectivity Test
```bash
# Test frontend to backend connection
curl https://your-frontend-url.vercel.app/api/test

# Should return API data without CORS errors
```

#### Full System Test
1. Visit your frontend URL
2. Open browser developer tools (F12)
3. Check Network tab for API calls
4. Verify no CORS errors in Console

## 🌐 Alternative Deployment Options

### Railway (Easy Alternative)

#### Backend Deployment:
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set root directory to `Backend`
4. Railway auto-detects FastAPI
5. Add environment variables
6. Deploy

#### Frontend Deployment:
1. Use Vercel (recommended) or Railway
2. Set `NEXT_PUBLIC_API_URL` to Railway backend URL

### Render (Free Tier Available)

#### Backend Deployment:
1. Go to [render.com](https://render.com)
2. Create "Web Service" from GitHub
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn src.pipeline.run_pipeline:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Google Cloud Run (For GCP Integration)

#### Backend Deployment:
```bash
# Build and deploy
gcloud run deploy sebi-backend \
  --source Backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to GitHub
- Use Vercel's/Railway's environment variable system
- Rotate API keys regularly
- Use different keys for development/production

### CORS Configuration
- Only allow necessary origins
- Use specific domains instead of wildcards in production
- Regularly review and update allowed origins

### API Security
- Implement rate limiting if needed
- Monitor API usage and errors
- Use HTTPS in production (automatic on Vercel)
- Consider API authentication for sensitive endpoints

## 📊 Performance Optimization

### Vercel-Specific Optimizations
- Use Vercel's analytics to monitor performance
- Implement proper caching strategies
- Optimize bundle size with code splitting
- Use Vercel's edge functions for better performance

### Database Considerations
- For production use, consider a proper database
- Implement connection pooling
- Use caching layers (Redis) for frequently accessed data

## 🔄 Updates and Maintenance

### Updating Deployments
1. Push changes to GitHub main branch
2. Vercel automatically redeploys (if auto-deploy enabled)
3. Monitor deployment logs for any issues
4. Test functionality after deployment

### Monitoring
- Use Vercel's deployment logs
- Monitor API response times
- Set up alerts for failed deployments
- Regularly check CORS and connectivity

## 📞 Support and Resources

### Vercel Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Python on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### FastAPI Resources
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)

### Troubleshooting
- Check Vercel function logs
- Use browser developer tools
- Test API endpoints directly
- Verify environment variable configuration

## 🎯 Quick Deployment Checklist

- [ ] Fork/clone repository to GitHub
- [ ] Set up Vercel account
- [ ] Deploy backend first with environment variables
- [ ] Get backend URL
- [ ] Deploy frontend with backend URL
- [ ] Update CORS configuration
- [ ] Test full system functionality
- [ ] Monitor performance and errors

---

**Need help?** Check the logs in your Vercel dashboard or refer to the troubleshooting section above.