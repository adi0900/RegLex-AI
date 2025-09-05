# RegLex AI - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Frontend Deployment (Next.js)

1. **Fork/Clone this repository** to your GitHub account
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import this GitHub repository
   - Set the **root directory** to `Frontend`

3. **Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY_2=your_secondary_gemini_api_key_here
   ```

4. **Deploy:** Vercel will automatically build and deploy your frontend

### Backend Deployment Options

#### Option 1: Vercel (Serverless Functions)
- Create a new Vercel project for the `Backend` folder
- Add the same environment variables as above
- Vercel will automatically detect and deploy FastAPI

#### Option 2: Railway/Render
- Connect your GitHub repository
- Set the build command: `pip install -r Backend/requirements.txt`
- Set the start command: `python Backend/app.py`

#### Option 3: Google Cloud Run
```bash
# Build and deploy to Cloud Run
cd Backend
gcloud run deploy reglex-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📋 Pre-deployment Checklist

### 1. Environment Setup
- [ ] Get Gemini API keys from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Set up Google Cloud Storage (optional, for document storage)
- [ ] Create `.env` files based on `.env.example`

### 2. Frontend Configuration
- [ ] Update `NEXT_PUBLIC_API_URL` to your backend URL
- [ ] Test build locally: `cd Frontend && npm run build`
- [ ] Verify all environment variables are set

### 3. Backend Configuration
- [ ] Install dependencies: `pip install -r Backend/requirements.txt`
- [ ] Test locally: `python Backend/app.py dev`
- [ ] Ensure all API endpoints are working

## 🏗️ Project Structure

```
RegLex-AI/
├── Frontend/           # Next.js 14 application
│   ├── app/           # App router pages
│   ├── components/    # UI components
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── Backend/           # FastAPI application
│   ├── src/          # Source code
│   ├── app.py        # Main application
│   └── requirements.txt
├── vercel.json       # Vercel configuration
└── DEPLOYMENT.md     # This file
```

## 🔧 Local Development

### Frontend (Next.js)
```bash
cd Frontend
npm install
npm run dev  # http://localhost:3001
```

### Backend (FastAPI)
```bash
cd Backend
pip install -r requirements.txt
python app.py dev  # http://127.0.0.1:8000
```

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_API_TIMEOUT=300000
```

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY_2=your_secondary_gemini_api_key_here
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend includes frontend URL in CORS origins
   - Check `run_pipeline.py:88-98` for CORS configuration

2. **API Connection Issues:**
   - Verify `NEXT_PUBLIC_API_URL` points to correct backend
   - Ensure backend is accessible from frontend domain

3. **Build Failures:**
   - Check all environment variables are set
   - Run `npm run build` locally to test

4. **Gemini API Errors:**
   - Verify API keys are valid and have quota
   - Check rate limits in Google Cloud Console

## 📊 Features

- ✅ Document upload and analysis
- ✅ SEBI compliance checking
- ✅ Real-time processing updates
- ✅ Interactive dashboard
- ✅ Export functionality (JSON, CSV, PDF)
- ✅ Multi-LLM support (Gemini, OpenAI, Claude)
- ✅ Google Cloud Storage integration

## 🔐 Security Notes

- Never commit API keys to repository
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints

---

For support, create an issue in the GitHub repository.