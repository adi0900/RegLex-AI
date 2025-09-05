#!/usr/bin/env node
/**
 * Test script to simulate the exact frontend upload request to FastAPI
 * This mimics the exact axios configuration used in frontend/lib/fastapi-services.ts
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Mimic the frontend configuration
const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';
const FASTAPI_TIMEOUT = 300000; // 5 minutes

// Create axios instance exactly like frontend
const fastapiClient = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: FASTAPI_TIMEOUT,
  // Don't set default headers here - let each request set its own headers
});

// Add request interceptor like frontend
fastapiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Frontend Test Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`📋 Headers:`, config.headers);
    console.log(`📤 Data type:`, typeof config.data);
    if (config.data instanceof FormData) {
      console.log(`📁 FormData detected`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor like frontend
fastapiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Frontend Test Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Frontend Test Error: ${error.message}`, {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

async function testFrontendUpload() {
  const filePath = path.join(__dirname, 'Frontend', 'LoanAgreement.pdf');
  
  console.log('🧪 Testing Frontend Upload Simulation...');
  console.log(`📍 API URL: ${FASTAPI_BASE_URL}`);
  console.log(`📄 File path: ${filePath}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found: ${filePath}`);
    }
    
    const fileStats = fs.statSync(filePath);
    console.log(`📏 File size: ${fileStats.size} bytes`);
    
    // Read file as buffer (like browser does)
    const fileBuffer = fs.readFileSync(filePath);
    const file = new File([fileBuffer], 'LoanAgreement.pdf', { type: 'application/pdf' });
    
    // Create FormData exactly like frontend
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: 'LoanAgreement.pdf',
      contentType: 'application/pdf'
    });
    formData.append('lang', 'en');
    
    console.log('\\n🚀 Sending request with FormData...');
    
    // Make request exactly like frontend
    const response = await fastapiClient.post('/upload-pdf/', formData, {
      headers: {
        // Let browser set Content-Type with proper multipart/form-data boundary
        'Accept': 'application/json',
        ...formData.getHeaders(), // This is critical for Node.js FormData
      },
      timeout: FASTAPI_TIMEOUT,
      validateStatus: (status) => status < 500, // Accept all status codes below 500
      
      // Make sure we don't override the Content-Type that axios sets automatically for FormData
      transformRequest: [(data) => data], // Pass FormData through unchanged
    });
    
    console.log(`\\n✅ SUCCESS! Status: ${response.status}`);
    console.log(`📤 Response data keys:`, Object.keys(response.data));
    console.log(`📏 Summary length:`, response.data.summary?.length || 0);
    console.log(`📊 Clauses count:`, response.data.clauses?.length || 0);
    
  } catch (error) {
    console.error(`\\n❌ UPLOAD FAILED:`, error.message);
    
    if (error.response) {
      console.error(`🔴 Status: ${error.response.status}`);
      console.error(`📋 Headers:`, error.response.headers);
      console.error(`📤 Error Data:`, error.response.data);
    } else if (error.request) {
      console.error(`📡 Network error - no response received`);
    }
  }
}

// Health check first
async function testHealthCheck() {
  console.log('🏥 Testing health check...');
  try {
    const response = await fastapiClient.get('/health', {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log(`✅ Health check: ${response.status} - ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🧪 FRONTEND UPLOAD SIMULATION TEST');
  console.log('='.repeat(60));
  
  const isHealthy = await testHealthCheck();
  if (!isHealthy) {
    console.log('❌ Backend not healthy, exiting...');
    return;
  }
  
  console.log('\\n' + '-'.repeat(40));
  await testFrontendUpload();
}

// Define File class for Node.js compatibility
global.File = global.File || class File {
  constructor(chunks, name, options = {}) {
    this.name = name;
    this.type = options.type || '';
    this.lastModified = Date.now();
    this.size = chunks.reduce((acc, chunk) => acc + (chunk.byteLength || chunk.length || 0), 0);
  }
};

if (require.main === module) {
  main().catch(console.error);
}