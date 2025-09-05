#!/usr/bin/env python3
"""
Create a simple test PDF for upload testing
"""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

def create_test_pdf():
    """Create a simple PDF with test content"""
    # Create a bytes buffer
    buffer = io.BytesIO()
    
    # Create PDF
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Add content
    p.drawString(100, height - 100, "SEBI Compliance Test Document")
    p.drawString(100, height - 130, "")
    p.drawString(100, height - 160, "This is a test document for SEBI compliance verification.")
    p.drawString(100, height - 190, "")
    p.drawString(100, height - 220, "Key Clauses:")
    p.drawString(120, height - 250, "1. Board governance requirements")
    p.drawString(120, height - 280, "2. Financial disclosure standards")
    p.drawString(120, height - 310, "3. Risk management protocols")
    p.drawString(120, height - 340, "4. Audit committee responsibilities")
    
    # Save PDF
    p.save()
    
    # Write to file
    with open("test_document.pdf", "wb") as f:
        f.write(buffer.getvalue())
    
    print("Created test_document.pdf successfully")
    print(f"File size: {len(buffer.getvalue())} bytes")

if __name__ == "__main__":
    try:
        create_test_pdf()
    except ImportError:
        print("reportlab not installed. Installing...")
        import subprocess
        subprocess.run(["pip", "install", "reportlab"])
        create_test_pdf()
    except Exception as e:
        print(f"Error creating PDF: {e}")
        
        # Alternative: Create a minimal PDF manually
        print("Creating minimal PDF manually...")
        pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(SEBI Test Document) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000208 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
302
%%EOF"""
        
        with open("test_document.pdf", "wb") as f:
            f.write(pdf_content)
        print("Created minimal PDF successfully")