# Development Workflow Guide

This document outlines the current development workflow and processes for the SEBI Compliance Verification System with GCP integration.

## 🏗️ Current System Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Development Env    │    │   Production Ready   │    │   Google Cloud      │
│                     │    │                     │    │                     │
│  Frontend (Next.js) │    │  Frontend (Next.js) │    │  Cloud Storage      │
│  localhost:3001     │◄──►│  Vercel/Netlify     │◄──►│  Documents          │
│                     │    │                     │    │  Metadata            │
│  Backend (FastAPI)  │    │  Backend (FastAPI)  │    │  Analysis Results    │
│  127.0.0.1:8000    │    │  Railway/Heroku     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ Real-time Analysis   │    │ Live Dashboard       │    │ GCP Data Storage    │
│ - Python Pipeline    │    │ - Live Updates       │    │ - Document Files    │
│ - LLM Integration    │    │ - Real Metrics       │    │ - Processing Results │
│ - Compliance Check   │    │ - Interactive UI     │    │ - Analytics Data    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## 🚀 Development Setup Workflow

### Initial Setup (One-time)

```bash
# 1. Clone Repository
git clone <repository-url>
cd Sebi-Hack-Final

# 2. Backend Setup
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Environment Configuration
# Backend GCP and API setup
echo "GEMINI_API_KEY=your_key_here" > src/.env
echo "GEMINI_API_KEY_2=your_backup_key" >> src/.env
echo "GCS_BUCKET_NAME=your_gcp_bucket" >> src/.env
echo "GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-credentials.json" >> src/.env

# 4. Frontend Setup
cd ../Frontend
npm install
cp .env.example .env.local

# 5. Configure .env.local
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" >> .env.local
echo "NEXT_PUBLIC_USE_MOCK_API=false" >> .env.local
```

### Daily Development Workflow

```bash
# Terminal 1 - Start Backend
cd Backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py dev
# ✅ Backend running on http://127.0.0.1:8000

# Terminal 2 - Start Frontend
cd Frontend
npm run dev
# ✅ Frontend running on http://localhost:3001

# Terminal 3 - Development Commands
npm run lint        # Code linting
npm run type-check  # TypeScript checking
npm run test        # Unit tests
```

## 🔄 Feature Development Process

### 1. Planning Phase
- **Create Feature Branch**: `git checkout -b feature/feature-name`
- **Update Documentation**: Plan changes in relevant .md files
- **Define API Contracts**: Update API-Documentation.md if needed

### 2. Development Phase

#### Backend Development
```bash
cd Backend
# 1. Implement feature in src/
# 2. Test endpoint manually
curl http://127.0.0.1:8000/health

# 3. Check auto-reload works
# FastAPI will automatically restart on file changes
```

#### Frontend Development
```bash
cd Frontend
# 1. Implement UI components in components/
# 2. Add business logic in lib/
# 3. Create hooks in hooks/
# 4. Test integration

# Hot reload automatically updates browser
```

### 3. Integration Testing

```bash
# 1. Test Backend API
curl -X POST "http://127.0.0.1:8000/upload-pdf/" \
  -F "file=@test.pdf" \
  -F "lang=en"

# 2. Test Frontend Integration
# Open http://localhost:3001/dashboard
# Upload document and verify processing

# 3. Check Error Handling
# Test with invalid files, network issues
```

### 4. Quality Assurance

```bash
# Frontend QA
cd Frontend
npm run lint          # ESLint checks
npm run lint:fix       # Auto-fix issues
npm run type-check     # TypeScript validation
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests

# Backend QA
cd Backend
python app.py check    # Dependency check
# Manual testing of endpoints
```

## 🐛 Bug Fix Workflow

### 1. Issue Identification
- **Frontend Errors**: Check browser console, Network tab
- **Backend Errors**: Check terminal logs, /docs endpoint
- **Integration Issues**: Verify CORS, API endpoints, environment variables

### 2. Debug Process

#### Frontend Debugging
```bash
# 1. Check browser console for errors
# 2. Verify network requests in DevTools
# 3. Check React Query cache in React DevTools
# 4. Validate environment variables

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
console.log("Mock API:", process.env.NEXT_PUBLIC_USE_MOCK_API)
```

#### Backend Debugging
```bash
# 1. Check FastAPI logs in terminal
# 2. Use interactive docs at /docs
# 3. Test endpoints with curl
# 4. Verify environment variables

python -c "import os; print(os.getenv('GEMINI_API_KEY'))"
```

### 3. Fix Implementation
- **Create Hotfix Branch**: `git checkout -b hotfix/issue-name`
- **Implement Fix**: Target specific issue without breaking changes
- **Test Thoroughly**: Ensure fix works and doesn't introduce new issues

## 📦 Deployment Workflow

### Development Deployment
```bash
# Automatic - Both services run in development mode
# Backend: Auto-reload on file changes
# Frontend: Hot reload on component changes
```

### Production Build
```bash
# Frontend Production Build
cd Frontend
npm run build        # Creates .next/ directory
npm run start        # Serves production build

# Backend Production
cd Backend
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker app:app \
  --host 0.0.0.0 --port 8000
```

## 🔧 Configuration Management

### Environment Variables

#### Frontend (.env.local)
```bash
# Core Settings
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000    # Backend URL
NEXT_PUBLIC_USE_MOCK_API=false               # Use real backend
NEXT_PUBLIC_API_TIMEOUT=300000               # 5 minutes for large files

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

#### Backend (.env)
```bash
# AI Integration
GEMINI_API_KEY=your_primary_key
GEMINI_API_KEY_2=your_backup_key

# Optional: Additional LLM Keys
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
```

### Configuration Updates
1. **Development**: Update .env files directly
2. **Production**: Use platform environment variable settings
3. **Documentation**: Update relevant .md files when changing configs

## 🧪 Testing Strategy

### Unit Testing
```bash
# Frontend
cd Frontend
npm run test           # Jest + React Testing Library
npm run test:watch     # Watch mode for development
npm run test:coverage  # Coverage reports

# Backend
cd Backend
python -m pytest      # When test suite is added
```

### Integration Testing
```bash
# API Testing
cd Frontend
npm run test:e2e       # Playwright E2E tests

# Manual API Testing
# Use Postman collection (see postman-guide.md)
```

### Performance Testing
- **Memory Usage**: Built-in performance monitoring
- **Load Testing**: Use Postman Collection Runner
- **Bundle Analysis**: `npm run analyze` (when configured)

## 🚀 CI/CD Pipeline (Future)

### Automated Workflow
```yaml
# Example GitHub Actions workflow
name: SEBI Compliance CI/CD
on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install and Test
        run: |
          cd Frontend
          npm install
          npm run lint
          npm run type-check
          npm run test
          npm run build

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install and Test
        run: |
          cd Backend
          pip install -r requirements.txt
          python app.py check
```

## 📋 Code Standards

### Frontend Standards
```typescript
// File naming: kebab-case
// Component naming: PascalCase
// Function naming: camelCase
// Constants: UPPER_SNAKE_CASE

// Example component structure
export function ComponentName({ prop }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState()
  const { data } = useQuery()
  
  // Event handlers
  const handleClick = () => {}
  
  // Render
  return <div>Content</div>
}
```

### Backend Standards
```python
# File naming: snake_case
# Class naming: PascalCase
# Function naming: snake_case
# Constants: UPPER_SNAKE_CASE

# FastAPI endpoint structure
@app.post("/endpoint-name/")
async def endpoint_function(param: ParamType = Depends()):
    try:
        # Implementation
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 📚 Documentation Standards

### Code Documentation
- **TypeScript**: Use JSDoc comments for complex functions
- **Python**: Use docstrings for all functions and classes
- **API**: Keep OpenAPI/Swagger docs updated automatically

### File Documentation
- **README.md**: Project overview and setup
- **API-Documentation.md**: Complete API reference
- **workflow.md**: Development processes (this file)

## 🔍 Monitoring and Maintenance

### Health Checks
```bash
# Automated health monitoring
curl http://127.0.0.1:8000/health    # Backend health
curl http://localhost:3001            # Frontend availability
```

### Performance Monitoring
- **Frontend**: Built-in Web Vitals tracking
- **Backend**: Response time logging
- **Memory**: Automatic memory usage alerts

### Log Management
- **Frontend**: Browser console, React Query logs
- **Backend**: FastAPI uvicorn logs, custom application logs
- **Integration**: CORS logs, API call tracking

## 🤝 Collaboration Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git add .
git commit -m "feat: add new feature"
git push origin feature/feature-name

# Create PR for review
# Merge to main after approval
```

### Code Review Process
1. **Self Review**: Check code standards, test locally
2. **Peer Review**: Review for logic, performance, security
3. **Integration Test**: Verify full system works
4. **Documentation**: Update relevant docs

### Communication
- **Issues**: Use GitHub Issues for bug reports
- **Features**: Use GitHub Discussions for feature requests
- **Updates**: Update project documentation regularly

This workflow ensures consistent, high-quality development while maintaining system reliability and documentation accuracy.

---

**Updated: October 2025**