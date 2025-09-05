# RegLex AI - SEBI Compliance Verification System

![SEBI Compliance](https://img.shields.io/badge/SEBI-Compliance-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-Active-blue)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-success)
[![GitHub](https://img.shields.io/badge/GitHub-adi0900/RegLex--AI-blue)](https://github.com/adi0900/RegLex-AI)
[![Live Demo](https://img.shields.io/badge/Live_Demo-reg--lex--ai.vercel.app-green)](https://reg-lex-ai.vercel.app)

A comprehensive AI-powered legal document compliance verification system built for SEBI (Securities and Exchange Board of India) regulations with **real-time GCP integration**. The system analyzes legal clauses in documents stored in Google Cloud Storage and performs live compliance verification using multiple LLM providers and advanced document processing.

## 🚀 Features

- ✅ **Real-time GCP Integration** - Live document storage and retrieval from Google Cloud Storage
- ✅ **FastAPI Backend** - Python FastAPI with full CORS support and auto-reload
- ✅ **Multi-LLM Support** - Claude, Gemini, OpenAI, and Mistral integration with fallback
- ✅ **Real-time Document Analysis** - Live compliance analysis using Python processing pipeline
- ✅ **Advanced Document Processing** - PDF text extraction and clause segmentation
- ✅ **GCP Document Storage** - Secure document storage with metadata management
- ✅ **Live Dashboard Updates** - Real-time statistics from GCP-stored documents
- ✅ **Risk Assessment Engine** - Automated categorization and scoring of compliance risks
- ✅ **Modern UI** - Next.js 14 with TypeScript, Tailwind CSS, and Shadcn UI
- ✅ **Real-time Health Monitoring** - Backend connectivity and performance tracking
- ✅ **Export Functionality** - Export compliance reports in JSON, CSV, and PDF formats
- ✅ **Performance Monitoring** - Real-time system performance and memory usage tracking

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐    ┌──────────────────┐
│   Next.js 14    │◄──────────────────►│   FastAPI        │◄──►│ Google Cloud     │
│   Frontend       │      CORS Enabled   │   Backend        │    │ Storage          │
│                 │                     │                  │    │                  │
│  - TypeScript   │                     │  - Python 3.11+  │    │  - Documents      │
│  - Tailwind CSS │                     │  - Gemini API    │    │  - Metadata       │
│  - Shadcn UI    │                     │  - PDF Processing│    │  - Analysis       │
│  - React Query  │                     │  - ML Pipeline   │    │  - Results        │
└─────────────────┘                     └──────────────────┘    └──────────────────┘
         │                                       │                        │
         │                                       │                        │
         ▼                                       ▼                        ▼
┌─────────────────┐                     ┌──────────────────┐    ┌──────────────────┐
│  Browser/Client │                     │  Processing      │    │  Live Data       │
│  - File Upload  │                     │  Pipeline        │    │  Storage         │
│  - Real-time UI │                     │  - Clause Extract│    │  - Real Metrics  │
│  - Live Updates │                     │  - Risk Analysis │    │  - Compliance    │
└─────────────────┘                     │  - LLM Verify    │    │  - Statistics    │
                                        └──────────────────┘    └──────────────────┘
                                                │
                                                ▼
                                     ┌──────────────────┐
                                     │  External APIs   │
                                     │  - Gemini AI     │
                                     │  - Claude        │
                                     │  - OpenAI        │
                                     │  - Mistral       │
                                     └──────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (Radix UI primitives)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: GSAP
- **Forms**: React Hook Form with Zod validation

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI Integration**: Google Gemini API
- **Document Processing**: PDF text extraction
- **CORS**: Configured for frontend communication
- **API Documentation**: Automatic OpenAPI/Swagger docs

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Testing**: Jest + Playwright

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.11+ 
- **Gemini API Key** (for document processing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Sebi-Hack-Final
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with GCP and API keys
echo "GEMINI_API_KEY=your_gemini_api_key_here" > src/.env
echo "GEMINI_API_KEY_2=your_backup_gemini_key_here" >> src/.env
echo "GCS_BUCKET_NAME=your_gcp_bucket_name" >> src/.env
echo "GOOGLE_APPLICATION_CREDENTIALS=path/to/your/gcp-credentials.json" >> src/.env

# Start the FastAPI server with auto-reload
python -m uvicorn src.pipeline.run_pipeline:app --host 127.0.0.1 --port 8000 --reload
# Server runs on http://127.0.0.1:8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your settings
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" >> .env.local
echo "NEXT_PUBLIC_USE_MOCK_API=false" >> .env.local

# Start the development server
npm run dev
# Frontend runs on http://localhost:3001
```

### 4. Verify Setup

1. **Backend Health**: Visit `http://127.0.0.1:8000/health`
2. **API Documentation**: Visit `http://127.0.0.1:8000/docs`
3. **Frontend**: Visit `http://localhost:3001`

## 🎯 Usage

### Document Upload and Real-time Analysis

1. **Navigate to Dashboard**: Go to `http://localhost:3001/dashboard`
2. **Upload Document**: Drag and drop a PDF file or click to browse
3. **Real-time Processing**: Document is stored in GCP and processed immediately
4. **Live Analysis**: Real-time compliance analysis using Python pipeline
5. **View Results**: Interactive dashboard with live GCP data updates
6. **Document Analysis**: Click on any document for detailed clause-by-clause analysis
7. **Export Reports**: Download compliance reports in JSON, CSV, and PDF formats

### API Integration

The system provides REST APIs for integration:

```javascript
// Health check
GET /health

// Dashboard endpoints (real GCP data)
GET /api/dashboard/overview
GET /api/dashboard/documents
GET /api/dashboard/analytics
GET /api/dashboard/notifications
GET /api/dashboard/timeline
GET /api/dashboard/analysis/{document_id}

// Document upload
POST /upload-pdf/
Content-Type: multipart/form-data
- file: PDF file
- lang: Language code (default: "en")

// API information
GET /
```

### Frontend Components

Key components available for development:

```typescript
// Document upload with progress
import { FileUpload } from '@/features/document-upload/components/FileUpload'

// Compliance dashboard
import { ComplianceChart } from '@/features/compliance-dashboard/components/ComplianceChart'

// Backend status monitoring
import { BackendStatus } from '@/components/ui/backend-status'

// FastAPI service integration
import { FastAPIService } from '@/lib/fastapi-services'
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=300000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Development
NODE_ENV=development
```

#### Backend (.env)
```bash
# GCP Configuration (Required for real data)
GCS_BUCKET_NAME=your_gcp_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/gcp-credentials.json

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY_2=your_backup_gemini_key_here

# Optional: Other LLM API Keys
OPENAI_API_KEY=your_openai_key_here
CLAUDE_API_KEY=your_claude_key_here
MISTRAL_API_KEY=your_mistral_key_here
```

## 📁 Project Structure

```
Sebi-Hack-Final/
├── Backend/                    # FastAPI Backend with GCP
│   ├── src/
│   │   ├── pipeline/          # Main processing pipeline
│   │   ├── extraction/        # PDF text extraction
│   │   ├── summerizer/        # Document summarization
│   │   ├── compliance_checker/# Compliance verification
│   │   ├── llm_provider/      # LLM integrations
│   │   └── storage/           # GCP Storage integration
│   │       └── gcs_client.py  # Google Cloud Storage client
│   ├── app.py                 # Main FastAPI application
│   └── requirements.txt       # Python dependencies
│
├── Frontend/                  # Next.js Frontend
│   ├── app/                   # App Router pages
│   ├── components/            # UI components
│   ├── features/              # Feature modules
│   ├── lib/                   # Utilities and services
│   ├── hooks/                 # Custom React hooks
│   └── public/                # Static assets
│
├── API-Documentation.md       # API documentation
├── postman-guide.md          # Postman testing guide
└── README.md                 # This file
```

## 🧪 Testing

### Frontend Testing
```bash
cd Frontend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Testing
```bash
cd Backend

# Run with development mode for auto-reload
python app.py dev

# Check health endpoint
curl http://127.0.0.1:8000/health

# View API documentation
open http://127.0.0.1:8000/docs
```

### API Testing with Postman
See [postman-guide.md](./postman-guide.md) for comprehensive API testing procedures.

## ☁️ GCP Setup (Required for Real Data)

### Prerequisites
1. **Google Cloud Project** - Create a GCP project
2. **GCS Bucket** - Create a Cloud Storage bucket for document storage
3. **Service Account** - Create a service account with Storage Admin permissions
4. **Credentials** - Download the service account key JSON file

### GCP Configuration
```bash
# Set environment variables
export GCS_BUCKET_NAME=your-sebi-compliance-bucket
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Verify GCP access
python -c "from google.cloud import storage; client = storage.Client(); print('GCP Connected:', client.project)"
```

## 🚀 Deployment

### Quick Deploy to Vercel

#### Step 1: Deploy Backend First
1. **Create Backend Project:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Select `adi0900/RegLex-AI` repository
   - Set **root directory** to `Backend`

2. **Configure Backend:**
   - **Framework Preset:** Python
   - **Root Directory:** Backend
   - **Build Command:** `pip install -r requirements.txt`
   - **Install Command:** `pip install -r requirements.txt`

3. **Add Backend Environment Variables:**
   ```
   ENVIRONMENT=production
   FRONTEND_URL=https://reg-lex-ai.vercel.app
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_KEY_2=your_secondary_gemini_api_key_here
   GCS_BUCKET_NAME=your_gcp_bucket_name
   GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"..."}
   ```

4. **Deploy Backend:** Your backend will be available at `https://reglex-backend.vercel.app` (or similar)

#### Step 2: Deploy Frontend
1. **Create Frontend Project:**
   - Click "New Project" → Import from GitHub
   - Select `adi0900/RegLex-AI` repository
   - Set **root directory** to `Frontend`

2. **Configure Frontend:**
   - **Framework Preset:** Next.js
   - **Root Directory:** Frontend

3. **Add Frontend Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://reglex-backend.vercel.app
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
   NEXT_PUBLIC_API_TIMEOUT=300000
   ```

4. **Deploy Frontend:** Vercel automatically builds and deploys

#### Step 3: Verify Deployment
After deployment, verify that both services are working:

1. **Test Backend:** Visit `https://reglex-backend.vercel.app/health`
2. **Test Frontend:** Visit `https://reg-lex-ai.vercel.app`
3. **Test API Connection:** Check browser console for CORS errors

#### Troubleshooting Deployment Issues

If you encounter CORS or connection issues:

1. **Update Backend Environment Variables:**
   - Go to your backend Vercel project settings
   - Add: `FRONTEND_URL=https://reg-lex-ai.vercel.app`
   - Redeploy backend

2. **Check Frontend Environment Variables:**
   - Ensure `NEXT_PUBLIC_API_URL` points to your actual backend URL
   - Redeploy frontend if changed

3. **Verify API Endpoints:**
   ```bash
   # Test backend health
   curl https://reglex-backend.vercel.app/health

   # Test debug endpoint
   curl https://reglex-backend.vercel.app/debug

   # Test dashboard endpoint
   curl https://reglex-backend.vercel.app/api/dashboard/overview
   ```

#### Common Vercel Deployment Issues

**Issue: Backend shows as Offline**
- ✅ **Solution:** Check Vercel function logs for import errors
- ✅ **Debug:** Visit `/debug` endpoint to see Python environment
- ✅ **Fix:** Ensure all dependencies are in requirements.txt

**Issue: CORS Errors**
- ✅ **Solution:** Set `FRONTEND_URL` environment variable in Vercel
- ✅ **Format:** `https://your-frontend.vercel.app`
- ✅ **Redeploy:** Required after environment variable changes

**Issue: Import Errors**
- ✅ **Solution:** Check pyproject.toml and requirements.txt
- ✅ **Debug:** Look at Vercel build logs for missing dependencies
- ✅ **Fix:** Add missing packages to requirements.txt

**Issue: Function Timeout**
- ✅ **Solution:** Increase maxDuration in vercel.json
- ✅ **Current:** 30 seconds (may need increase for document processing)
- ✅ **Alternative:** Optimize processing to complete faster

#### Alternative Backend Hosting
- **Railway:** Connect GitHub, auto-detects FastAPI
- **Render:** Deploy from GitHub with Python runtime
- **Google Cloud Run:** `gcloud run deploy --source Backend`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

### Development
```bash
# Terminal 1 - Backend with GCP
cd Backend
source venv/bin/activate
python -m uvicorn src.pipeline.run_pipeline:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

### Production Build
```bash
# Frontend production build
cd Frontend
npm run build
npm run start

# Backend production (with gunicorn)
cd Backend
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker src.pipeline.run_pipeline:app --host 0.0.0.0 --port 8000
```

## 📊 Features Deep Dive

### Real-time GCP Document Processing Pipeline
1. **PDF Upload**: Multi-format file support with GCP storage validation
2. **GCP Storage**: Secure document storage with metadata management
3. **Real-time Text Extraction**: Advanced PDF parsing using Python pipeline
4. **Live AI Analysis**: Multi-LLM analysis for compliance verification
5. **Dynamic Risk Assessment**: Automated risk categorization and scoring
6. **Live Dashboard Updates**: Real-time statistics from GCP data
7. **Professional Report Generation**: Comprehensive compliance reports

### Real-time Monitoring
- Backend health status monitoring
- Real-time upload progress tracking
- Performance metrics and memory usage
- Error tracking and logging

### Export Capabilities
- **JSON Export**: Complete structured data with all analysis results
- **CSV Export**: Spreadsheet-friendly format for clause analysis
- **PDF Export**: Professional formatted reports for sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Add tests for new features
- Update documentation for API changes
- Ensure CORS compatibility for frontend integration

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Issues:**
```bash
# Check if backend is running
curl http://127.0.0.1:8000/health

# Check backend logs for errors
python app.py dev
```

**Frontend Build Issues:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**CORS Errors:**
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure backend CORS configuration includes frontend origin

**Upload Errors (422):**
- Check file format (PDF required)
- Verify file size limits
- Ensure proper form-data formatting

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SEBI** for compliance standards and regulations
- **Google Gemini** for AI-powered document analysis
- **Next.js** and **FastAPI** for excellent frameworks
- **Shadcn UI** for beautiful, accessible components

## 👥 Team

The RegLex AI project was developed by a talented team of professionals:

### Core Development Team

**Aditya** - *Frontend Developer & Team Leader*
- Leading frontend development and project management
- Specializes in React, Next.js, and TypeScript
- Contact: adi1423tya@gmail.com

**Nilam** - *Lead AI Engineer & Backend Developer*
- Expert in Machine Learning & NLP systems
- Specialized in legal-domain AI and language model fine-tuning
- Backend architecture and AI pipeline implementation

**Suriya** - *AI/ML Developer*
- Risk Assessment & Analysis specialist
- Former SEBI officer with deep regulatory knowledge
- Compliance analysis and risk modeling

**Ivan Nilesh** - *AI/ML Developer*
- Machine Learning algorithms and model development
- Data processing and AI optimization
- Backend ML pipeline implementation

**Vrithika** - *AI/ML Developer*
- Data Science and AI model optimization
- Data analysis and machine learning research
- Model performance analysis and improvement

### Project Contact
- **Email**: adi1423tya@gmail.com
- **Phone**: +91-9695882854
- **Location**: Jaipur, India

---

**Built with ❤️ by the RegLex AI Team - September 2025**

## 📞 Support

For support and questions:
- Check the [API Documentation](./API-Documentation.md)
- Review [Postman Testing Guide](./postman-guide.md)
- Check backend logs for detailed error information
- Verify environment configuration

---

**Built with ❤️ for SEBI Compliance - September 2025**