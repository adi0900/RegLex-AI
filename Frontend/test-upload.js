#!/usr/bin/env node
/**
 * Test script to debug the exact frontend request to FastAPI
 */
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    const API_URL = 'http://127.0.0.1:8000';
    const filePath = path.join(__dirname, 'test_document.pdf');
    
    console.log('🔍 Testing FastAPI upload with Node.js...');
    console.log(`📍 API URL: ${API_URL}`);
    console.log(`📄 File path: ${filePath}`);
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`Test file not found: ${filePath}`);
        }
        
        const fileStats = fs.statSync(filePath);
        console.log(`📏 File size: ${fileStats.size} bytes`);
        
        // Create FormData (same as frontend)
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), 'test_document.pdf');
        formData.append('lang', 'en');
        
        console.log('\n🚀 Sending request...');
        console.log('📋 FormData fields:', formData.getHeaders());
        
        // Make request using axios (same as frontend)
        const axiosClient = axios.create({
            baseURL: API_URL,
            timeout: 30000,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const response = await axiosClient.post('/upload-pdf/', formData, {
            headers: {
                ...formData.getHeaders(), // Include multipart boundary
                'Accept': 'application/json',
            },
            timeout: 30000,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`⏳ Upload progress: ${percentage}%`);
                }
            }
        });
        
        console.log(`\n✅ SUCCESS! Status: ${response.status}`);
        console.log(`📤 Response headers:`, response.headers);
        console.log(`📥 Response data:`, JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error(`\n❌ ERROR:`, error.message);
        
        if (error.response) {
            console.error(`🔴 Status: ${error.response.status}`);
            console.error(`📋 Headers:`, error.response.headers);
            console.error(`📤 Data:`, error.response.data);
        } else if (error.request) {
            console.error(`📡 Network error:`, error.request);
        }
    }
}

// Health check first
async function healthCheck() {
    console.log('🏥 Checking backend health...');
    try {
        const response = await axios.get('http://127.0.0.1:8000/health');
        console.log(`✅ Health check: ${response.status} - ${JSON.stringify(response.data)}`);
        return true;
    } catch (error) {
        console.error(`❌ Health check failed: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('🧪 FastAPI Upload Test');
    console.log('='.repeat(60));
    
    const isHealthy = await healthCheck();
    if (!isHealthy) {
        console.log('❌ Backend not healthy, exiting...');
        return;
    }
    
    console.log('\n' + '-'.repeat(40));
    await testUpload();
}

if (require.main === module) {
    main().catch(console.error);
}