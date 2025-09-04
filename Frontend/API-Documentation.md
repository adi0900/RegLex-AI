# SEBI Compliance API Documentation

This document provides comprehensive documentation for the SEBI Compliance FastAPI backend endpoints and integration details.

## Base URL

```
Production: http://127.0.0.1:8000
Development: http://127.0.0.1:8000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Description**: Check if the FastAPI backend is running and healthy.

**Request:**
```http
GET /health
Accept: application/json
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Server is running"
}
```

**Status Codes:**
- `200 OK`: Server is healthy
- `500 Internal Server Error`: Server issues

---

### 2. API Information

**Endpoint**: `GET /`

**Description**: Get basic information about the API and available endpoints.

**Request:**
```http
GET /
Accept: application/json
```

**Response:**
```json
{
  "message": "SEBI Hack Backend API",
  "status": "running",
  "endpoints": ["/upload-pdf/", "/health"]
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved API information

---

### 3. Document Upload and Processing

**Endpoint**: `POST /upload-pdf/`

**Description**: Upload a PDF document for SEBI compliance analysis and processing.

**Request:**
```http
POST /upload-pdf/
Content-Type: multipart/form-data

Parameters:
- file: (File, required) - PDF file to process
- lang: (string, optional) - Language code (default: "en")
```

**Example with curl:**
```bash
curl -X POST "http://127.0.0.1:8000/upload-pdf/" \
  -F "file=@document.pdf" \
  -F "lang=en"
```

**Success Response (200):**
```json
{
  "summary": "Document analysis summary...",
  "timelines": {
    "effective_date": {
      "start": "2024-01-01",
      "end": "2024-12-31",
      "description": "Document effective period"
    }
  },
  "clauses": [
    {
      "id": "clause_1",
      "text": "Clause content...",
      "compliance_score": 0.95,
      "risk_level": "low"
    }
  ],
  "compliance_results": {
    "overall_score": 0.89,
    "total_clauses": 15,
    "compliant_clauses": 13,
    "risk_distribution": {
      "high": 1,
      "medium": 1,
      "low": 13
    }
  }
}
```

**Error Responses:**

**422 Unprocessable Entity:**
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "file"],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Processing error: Failed to extract text from PDF"
}
```

**Status Codes:**
- `200 OK`: Document processed successfully
- `422 Unprocessable Entity`: Invalid request parameters or missing file
- `500 Internal Server Error`: Server processing error

---

## Frontend Integration

### FastAPIService Class

The frontend uses the `FastAPIService` class located in `lib/fastapi-services.ts` to communicate with the backend.

**Key Methods:**

```typescript
// Health check
const health = await FastAPIService.healthCheck()

// Document upload with progress tracking
const result = await FastAPIService.uploadDocument(
  file,           // File object
  'en',          // Language
  (progress) => console.log(`Upload progress: ${progress}%`)
)

// Get API information
const info = await FastAPIService.getAPIInfo()
```

### Error Handling

The FastAPIService includes comprehensive error handling:

```typescript
try {
  const result = await FastAPIService.uploadDocument(file, 'en')
  // Handle success
} catch (error) {
  // Error types:
  // - "NetworkError": Connection failed
  // - "ValidationError": 400/422 responses
  // - "ServerError": 500 responses
  console.error('Upload failed:', error.message)
}
```

### CORS Configuration

The backend is configured with CORS to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001` 
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

## API Client Examples

### JavaScript/Fetch
```javascript
// Health check
const healthResponse = await fetch('http://127.0.0.1:8000/health')
const health = await healthResponse.json()

// Document upload
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('lang', 'en')

const uploadResponse = await fetch('http://127.0.0.1:8000/upload-pdf/', {
  method: 'POST',
  body: formData
})
const result = await uploadResponse.json()
```

### Python/Requests
```python
import requests

# Health check
health_response = requests.get('http://127.0.0.1:8000/health')
health = health_response.json()

# Document upload
with open('document.pdf', 'rb') as f:
    files = {'file': f}
    data = {'lang': 'en'}
    upload_response = requests.post(
        'http://127.0.0.1:8000/upload-pdf/',
        files=files,
        data=data
    )
result = upload_response.json()
```

## Environment Variables

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY_2=your_backup_gemini_key_here
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_TIMEOUT=300000
```

## Rate Limits

Currently, no rate limits are implemented. The API processes requests as they arrive.

## Interactive Documentation

The FastAPI backend provides interactive documentation:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`
- **OpenAPI Schema**: `http://127.0.0.1:8000/openapi.json`

## Status and Monitoring

The system includes:
- Health check endpoint for monitoring
- Real-time backend connectivity status in frontend
- Error logging and tracking
- Performance monitoring

## Recent Updates (September 2025)

- ✅ **CORS Fixed**: Frontend can now communicate with backend
- ✅ **Error Handling**: Improved 422 and 500 error handling
- ✅ **Document Upload**: Fixed parameter passing issues
- ✅ **Health Monitoring**: Real-time backend status checks
- ✅ **Performance**: Optimized memory usage monitoring

## Support

For API issues or questions:
1. Check the interactive documentation at `/docs`
2. Review the health check endpoint
3. Check backend logs for detailed error information
4. Verify CORS configuration for frontend integration