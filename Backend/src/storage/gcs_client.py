"""
Google Cloud Storage client for handling document storage and metadata
"""
import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from google.cloud import storage
from google.cloud.exceptions import NotFound, GoogleCloudError

logger = logging.getLogger(__name__)

class GCSClient:
    """Google Cloud Storage client for SEBI compliance system"""
    
    def __init__(self):
        """Initialize GCS client with credentials from environment"""
        try:
            self.bucket_name = os.getenv('GCS_BUCKET_NAME', 'sebi-hack')
            
            # Initialize the storage client
            # Credentials are loaded from GOOGLE_APPLICATION_CREDENTIALS env var
            self.client = storage.Client()
            self.bucket = self.client.bucket(self.bucket_name)
            
            logger.info(f"[GCS] Initialized client for bucket: {self.bucket_name}")
            
        except Exception as e:
            logger.error(f"[GCS] Failed to initialize client: {e}")
            raise
    
    def upload_document_metadata(self, document_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Upload document processing metadata to GCS
        
        Args:
            document_id: Unique identifier for the document
            metadata: Dictionary containing document processing details
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Create blob path for metadata
            blob_name = f"documents/{document_id}/metadata.json"
            blob = self.bucket.blob(blob_name)
            
            # Add timestamp and processing info
            enriched_metadata = {
                **metadata,
                "stored_at": datetime.now(timezone.utc).isoformat(),
                "gcs_bucket": self.bucket_name,
                "gcs_path": blob_name,
                "document_id": document_id
            }
            
            # Upload as JSON
            blob.upload_from_string(
                json.dumps(enriched_metadata, indent=2),
                content_type='application/json'
            )
            
            logger.info(f"[GCS] Uploaded metadata for document {document_id} to {blob_name}")
            return True
            
        except GoogleCloudError as e:
            logger.error(f"[GCS] Failed to upload metadata for {document_id}: {e}")
            return False
        except Exception as e:
            logger.error(f"[GCS] Unexpected error uploading metadata for {document_id}: {e}")
            return False
    
    def upload_processing_results(self, document_id: str, results: Dict[str, Any]) -> bool:
        """
        Upload document processing results to GCS
        
        Args:
            document_id: Unique identifier for the document
            results: Dictionary containing processing results (summary, clauses, compliance, etc.)
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Create blob path for results
            blob_name = f"documents/{document_id}/results.json"
            blob = self.bucket.blob(blob_name)
            
            # Add processing timestamp
            enriched_results = {
                **results,
                "processed_at": datetime.now(timezone.utc).isoformat(),
                "gcs_bucket": self.bucket_name,
                "gcs_path": blob_name,
                "document_id": document_id
            }
            
            # Upload as JSON
            blob.upload_from_string(
                json.dumps(enriched_results, indent=2, default=str),
                content_type='application/json'
            )
            
            logger.info(f"[GCS] Uploaded results for document {document_id} to {blob_name}")
            return True
            
        except GoogleCloudError as e:
            logger.error(f"[GCS] Failed to upload results for {document_id}: {e}")
            return False
        except Exception as e:
            logger.error(f"[GCS] Unexpected error uploading results for {document_id}: {e}")
            return False
    
    def upload_document_file(self, document_id: str, file_content: bytes, filename: str) -> bool:
        """
        Upload the actual document file to GCS
        
        Args:
            document_id: Unique identifier for the document
            file_content: Raw file bytes
            filename: Original filename
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Create blob path for the file
            file_extension = filename.split('.')[-1] if '.' in filename else 'pdf'
            blob_name = f"documents/{document_id}/original.{file_extension}"
            blob = self.bucket.blob(blob_name)
            
            # Set content type based on extension
            content_type = 'application/pdf' if file_extension.lower() == 'pdf' else 'application/octet-stream'
            
            # Upload file
            blob.upload_from_string(file_content, content_type=content_type)
            
            # Set metadata
            blob.metadata = {
                'document_id': document_id,
                'original_filename': filename,
                'uploaded_at': datetime.now(timezone.utc).isoformat()
            }
            blob.patch()
            
            logger.info(f"[GCS] Uploaded file for document {document_id} to {blob_name}")
            return True
            
        except GoogleCloudError as e:
            logger.error(f"[GCS] Failed to upload file for {document_id}: {e}")
            return False
        except Exception as e:
            logger.error(f"[GCS] Unexpected error uploading file for {document_id}: {e}")
            return False
    
    def get_document_metadata(self, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve document metadata from GCS
        
        Args:
            document_id: Unique identifier for the document
            
        Returns:
            Dictionary containing metadata or None if not found
        """
        try:
            blob_name = f"documents/{document_id}/metadata.json"
            blob = self.bucket.blob(blob_name)
            
            if not blob.exists():
                logger.warning(f"[GCS] Metadata not found for document {document_id}")
                return None
                
            content = blob.download_as_text()
            metadata = json.loads(content)
            
            logger.info(f"[GCS] Retrieved metadata for document {document_id}")
            return metadata
            
        except NotFound:
            logger.warning(f"[GCS] Document {document_id} not found")
            return None
        except Exception as e:
            logger.error(f"[GCS] Failed to retrieve metadata for {document_id}: {e}")
            return None
    
    def get_processing_results(self, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve processing results from GCS
        
        Args:
            document_id: Unique identifier for the document
            
        Returns:
            Dictionary containing processing results or None if not found
        """
        try:
            blob_name = f"documents/{document_id}/results.json"
            blob = self.bucket.blob(blob_name)
            
            if not blob.exists():
                logger.warning(f"[GCS] Results not found for document {document_id}")
                return None
                
            content = blob.download_as_text()
            results = json.loads(content)
            
            logger.info(f"[GCS] Retrieved results for document {document_id}")
            return results
            
        except NotFound:
            logger.warning(f"[GCS] Results for document {document_id} not found")
            return None
        except Exception as e:
            logger.error(f"[GCS] Failed to retrieve results for {document_id}: {e}")
            return None
    
    def list_documents(self, limit: int = 100) -> list:
        """
        List all documents in the bucket
        
        Args:
            limit: Maximum number of documents to return
            
        Returns:
            List of document IDs
        """
        try:
            document_ids = set()
            blobs = self.client.list_blobs(self.bucket, prefix="documents/", max_results=limit * 3)
            
            for blob in blobs:
                # Extract document ID from path like "documents/doc_123/metadata.json"
                path_parts = blob.name.split('/')
                if len(path_parts) >= 3 and path_parts[0] == "documents":
                    document_ids.add(path_parts[1])
                    
                if len(document_ids) >= limit:
                    break
            
            logger.info(f"[GCS] Listed {len(document_ids)} documents")
            return list(document_ids)
            
        except Exception as e:
            logger.error(f"[GCS] Failed to list documents: {e}")
            return []
    
    def delete_document(self, document_id: str) -> bool:
        """
        Delete all files associated with a document
        
        Args:
            document_id: Unique identifier for the document
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Delete all blobs with the document prefix
            blobs = self.client.list_blobs(self.bucket, prefix=f"documents/{document_id}/")
            deleted_count = 0
            
            for blob in blobs:
                blob.delete()
                deleted_count += 1
            
            logger.info(f"[GCS] Deleted {deleted_count} files for document {document_id}")
            return True
            
        except Exception as e:
            logger.error(f"[GCS] Failed to delete document {document_id}: {e}")
            return False

# Global GCS client instance
_gcs_client = None

def get_gcs_client() -> GCSClient:
    """Get or create global GCS client instance"""
    global _gcs_client
    if _gcs_client is None:
        _gcs_client = GCSClient()
    return _gcs_client