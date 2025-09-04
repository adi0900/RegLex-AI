# Postman Testing Guide for SEBI Compliance API

This guide provides step-by-step instructions for testing the SEBI Compliance FastAPI backend using Postman.

## Prerequisites

1. **Postman installed** - Download from [postman.com](https://www.postman.com/)
2. **Backend running** - Ensure FastAPI server is running on `http://127.0.0.1:8000`
3. **Sample PDF file** - Have a PDF document ready for testing

## Base Configuration

### Environment Variables

Create a new environment in Postman with these variables:

```
BASE_URL = http://127.0.0.1:8000
API_VERSION = v1
```

## API Endpoints Testing

### 1. Health Check Test

**Purpose**: Verify that the FastAPI backend is running and responsive.

**Setup**:
- **Method**: `GET`
- **URL**: `{{BASE_URL}}/health`
- **Headers**:
  ```
  Accept: application/json
  ```

**Expected Response** (200 OK):
```json
{
    "status": "healthy",
    "message": "Server is running"
}
```

**Test Script** (Add to Tests tab):
```javascript
pm.test("Health check returns healthy status", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.status).to.eql("healthy");
    pm.expect(responseJson.message).to.be.a("string");
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

---

### 2. API Information Test

**Purpose**: Get basic information about available endpoints.

**Setup**:
- **Method**: `GET`
- **URL**: `{{BASE_URL}}/`
- **Headers**:
  ```
  Accept: application/json
  ```

**Expected Response** (200 OK):
```json
{
    "message": "SEBI Hack Backend API",
    "status": "running",
    "endpoints": ["/upload-pdf/", "/health"]
}
```

**Test Script**:
```javascript
pm.test("API info returns correctly", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.message).to.include("SEBI");
    pm.expect(responseJson.status).to.eql("running");
    pm.expect(responseJson.endpoints).to.be.an("array");
    pm.expect(responseJson.endpoints).to.include("/upload-pdf/");
    pm.expect(responseJson.endpoints).to.include("/health");
});
```

---

### 3. Document Upload Test

**Purpose**: Test PDF document upload and processing functionality.

**Setup**:
- **Method**: `POST`
- **URL**: `{{BASE_URL}}/upload-pdf/`
- **Headers**: (Postman will automatically set Content-Type for form-data)
- **Body**: Select `form-data` and add:
  - **Key**: `file` (Type: File)
  - **Value**: Select your PDF file
  - **Key**: `lang` (Type: Text)
  - **Value**: `en`

**Expected Response** (200 OK):
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

**Test Script**:
```javascript
pm.test("Document upload successful", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("summary");
    pm.expect(responseJson).to.have.property("timelines");
    pm.expect(responseJson).to.have.property("clauses");
    pm.expect(responseJson).to.have.property("compliance_results");
});

pm.test("Summary is provided", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.summary).to.be.a("string");
    pm.expect(responseJson.summary.length).to.be.greaterThan(10);
});

pm.test("Clauses array is present", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.clauses).to.be.an("array");
});

pm.test("Processing time is reasonable", function () {
    pm.expect(pm.response.responseTime).to.be.below(30000); // 30 seconds
});
```

---

### 4. Error Testing - Missing File

**Purpose**: Test validation error handling when no file is provided.

**Setup**:
- **Method**: `POST`
- **URL**: `{{BASE_URL}}/upload-pdf/`
- **Body**: Select `form-data` and add:
  - **Key**: `lang` (Type: Text)
  - **Value**: `en`
  - (Do not include file parameter)

**Expected Response** (422 Unprocessable Entity):
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

**Test Script**:
```javascript
pm.test("Missing file returns validation error", function () {
    pm.response.to.have.status(422);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("detail");
    pm.expect(responseJson.detail).to.be.an("array");
    pm.expect(responseJson.detail[0]).to.have.property("type", "missing");
    pm.expect(responseJson.detail[0].loc).to.include("file");
});
```

---

### 5. Error Testing - Invalid File Type

**Purpose**: Test error handling when uploading a non-PDF file.

**Setup**:
- **Method**: `POST`
- **URL**: `{{BASE_URL}}/upload-pdf/`
- **Body**: Select `form-data` and add:
  - **Key**: `file` (Type: File)
  - **Value**: Select a non-PDF file (e.g., .txt, .jpg)
  - **Key**: `lang` (Type: Text)
  - **Value**: `en`

**Expected Response** (500 Internal Server Error):
```json
{
    "detail": "Processing error: Failed to open stream"
}
```

**Test Script**:
```javascript
pm.test("Invalid file type returns processing error", function () {
    pm.response.to.have.status(500);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("detail");
    pm.expect(responseJson.detail).to.include("Processing error");
});
```

---

## Collection Setup

### Import/Export Collection

You can create a Postman collection with all the above tests. Here's a JSON export template:

```json
{
    "info": {
        "name": "SEBI Compliance API Tests",
        "description": "Test suite for SEBI Compliance FastAPI backend",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {
            "key": "BASE_URL",
            "value": "http://127.0.0.1:8000",
            "type": "string"
        }
    ]
}
```

### Environment Setup

1. Click the gear icon (⚙️) in the top right
2. Click "Add" to create a new environment
3. Name it "SEBI Compliance Local"
4. Add these variables:
   - `BASE_URL`: `http://127.0.0.1:8000`
   - `API_TIMEOUT`: `30000`

## Advanced Testing Scenarios

### Load Testing

Use Postman's Collection Runner for basic load testing:

1. Create a collection with health check endpoint
2. Open Collection Runner
3. Select your collection and environment
4. Set iterations to 100
5. Set delay to 100ms
6. Run to test basic load handling

### CORS Testing

Test CORS functionality by adding these headers to requests:

```
Origin: http://localhost:3001
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

### Authentication Testing (Future)

When authentication is implemented, add these tests:

```javascript
pm.test("Unauthorized request returns 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Invalid token returns 403", function () {
    pm.response.to.have.status(403);
});
```

## Monitoring and Analytics

### Response Time Monitoring

Add this to all test scripts:

```javascript
pm.test("Response time tracking", function () {
    const responseTime = pm.response.responseTime;
    console.log(`Endpoint: ${pm.request.url}, Response Time: ${responseTime}ms`);
    
    // Log slow responses
    if (responseTime > 5000) {
        console.warn(`Slow response detected: ${responseTime}ms`);
    }
});
```

### Error Tracking

```javascript
pm.test("Error response structure", function () {
    if (pm.response.code >= 400) {
        const responseJson = pm.response.json();
        pm.expect(responseJson).to.have.property("detail");
        console.log(`Error ${pm.response.code}: ${responseJson.detail}`);
    }
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused (ECONNREFUSED)**:
   - Check if backend server is running
   - Verify the BASE_URL is correct
   - Ensure no firewall blocking

2. **CORS Errors**:
   - Verify Origin header if testing from browser
   - Check backend CORS configuration

3. **File Upload Issues**:
   - Ensure file is selected in form-data
   - Verify file size is reasonable (< 50MB)
   - Check file is not corrupted

4. **Timeout Errors**:
   - Increase timeout in Postman settings
   - Check if backend is processing large files
   - Monitor backend logs for processing issues

### Debug Mode

Enable Postman Console (View > Show Postman Console) to see:
- Request/response details
- Console.log outputs from test scripts
- Network timing information
- Error details

## Best Practices

1. **Use Environment Variables**: Always use `{{BASE_URL}}` instead of hardcoded URLs
2. **Add Meaningful Tests**: Include assertions for all critical response fields
3. **Test Edge Cases**: Include tests for error conditions
4. **Monitor Performance**: Track response times and flag slow endpoints
5. **Use Pre-request Scripts**: Set up authentication tokens or dynamic data
6. **Document Expected Responses**: Include example responses in description

## Integration with CI/CD

To run Postman tests in CI/CD:

```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run collection
newman run sebi-compliance-tests.json \
  --environment sebi-local-env.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

This guide covers comprehensive testing of the SEBI Compliance API using Postman, ensuring all endpoints work correctly and handle edge cases appropriately.