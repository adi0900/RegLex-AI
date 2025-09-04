# SEBI Compliance Verification System

![SEBI Compliance](https://img.shields.io/badge/SEBI-Compliance-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2.18-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

A comprehensive AI-powered legal document compliance verification system built for SEBI (Securities and Exchange Board of India) regulations. The system analyzes legal clauses in documents and verifies their compliance using multiple LLM providers and advanced document processing.

## 🚀 Features

- ✅ **FastAPI Backend Integration** - Python FastAPI with full CORS support
- ✅ **Multi-LLM Support** - Claude, Gemini, OpenAI, and Mistral integration
- ✅ **Document Processing** - PDF text extraction and analysis pipeline
- ✅ **Real-time Upload** - Document upload with progress tracking
- ✅ **Health Monitoring** - Backend connectivity and performance monitoring
- ✅ **Risk Assessment** - Automated categorization and scoring of compliance risks
- ✅ **Modern UI** - Next.js 14 with TypeScript, Tailwind CSS, and Shadcn UI
- ✅ **Error Handling** - Comprehensive error handling and fallback mechanisms
- ✅ **Export Functionality** - Export compliance reports in JSON, CSV, and PDF formats
- ✅ **Performance Monitoring** - Real-time system performance and memory usage tracking

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   Next.js 14    │◄──────────────────►│   FastAPI        │
│   Frontend       │      CORS Enabled   │   Backend        │
│                 │                     │                  │
│  - TypeScript   │                     │  - Python 3.11+  │
│  - Tailwind CSS │                     │  - Gemini API    │
│  - Shadcn UI    │                     │  - PDF Processing │
│  - React Query  │                     │  - ML Pipeline   │
└─────────────────┘                     └──────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌──────────────────┐
│  Browser/Client │                     │  External APIs   │
│  - File Upload  │                     │  - Gemini AI     │
│  - Real-time UI │                     │  - Claude        │
│  - Progress     │                     │  - OpenAI        │
└─────────────────┘                     │  - Mistral       │
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

# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > src/.env
echo "GEMINI_API_KEY_2=your_backup_gemini_key_here" >> src/.env

# Start the FastAPI server
python app.py dev
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

### Document Upload and Analysis

1. **Navigate to Dashboard**: Go to `http://localhost:3001/dashboard`
2. **Upload Document**: Drag and drop a PDF file or click to browse
3. **Select Language**: Choose analysis language (default: English)
4. **View Results**: Real-time processing with progress tracking
5. **Export Reports**: Download compliance reports in multiple formats

### API Integration

The system provides REST APIs for integration:

```javascript
// Health check
GET /health

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
├── Backend/                    # FastAPI Backend
│   ├── src/                   
│   │   ├── pipeline/          # Main processing pipeline
│   │   ├── extraction/        # PDF text extraction
│   │   ├── summerizer/        # Document summarization
│   │   ├── compliance_checker/# Compliance verification
│   │   └── llm_provider/      # LLM integrations
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

## 🚀 Deployment

### Development
```bash
# Start both services
# Terminal 1 - Backend
cd Backend && python app.py dev

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
gunicorn -k uvicorn.workers.UvicornWorker app:app --host 0.0.0.0 --port 8000
```

## 📊 Features Deep Dive

### Document Processing Pipeline
1. **PDF Upload**: Multi-format file support with validation
2. **Text Extraction**: Advanced PDF parsing and text extraction
3. **AI Analysis**: Multi-LLM analysis for compliance verification
4. **Risk Assessment**: Automated risk categorization and scoring
5. **Report Generation**: Comprehensive compliance reports

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

## 📞 Support

For support and questions:
- Check the [API Documentation](./API-Documentation.md)
- Review [Postman Testing Guide](./postman-guide.md)
- Check backend logs for detailed error information
- Verify environment configuration

---

**Built with ❤️ for SEBI Compliance - September 2025**