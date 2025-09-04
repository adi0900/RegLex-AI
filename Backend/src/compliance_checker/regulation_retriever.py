"""
Regulation Retrieval Agent (FAISS-based)

This agent extracts the top k relevant rules 
from the FAISS vector database for the given clause.
"""

import pickle
from src.embedder.embeddings import EmbeddingModel

# Lazy import for faiss to avoid import errors
faiss = None

def _import_faiss():
    global faiss
    if faiss is None:
        try:
            import faiss as _faiss
            faiss = _faiss
        except ImportError:
            print("Warning: FAISS not available. Install with: pip install faiss-cpu")
            return False
    return True

class RegulationRetriever:
    def __init__(self, faiss_index_path: str, metadata_path: str, model_name: str = "nlpaueb/legal-bert-base-uncased"):
        """
        Initialize the RegulationRetriever with FAISS.
        
        Args:
            faiss_index_path: Path to FAISS index file
            metadata_path: Path to metadata pickle file
        """
        self.faiss_index_path = faiss_index_path
        self.metadata_path = metadata_path
        self.model_name = model_name
        self.index = None
        self.metadata = None
        self.embedding_model = None
    
    def _lazy_load(self):
        """Load FAISS index and metadata lazily"""
        if self.index is None:
            if not _import_faiss():
                return False
            try:
                self.index = faiss.read_index(self.faiss_index_path)
            except Exception as e:
                print(f"Warning: Could not load FAISS index: {e}")
                return False
        
        if self.metadata is None:
            try:
                with open(self.metadata_path, "rb") as f:
                    self.metadata = pickle.load(f)
            except Exception as e:
                print(f"Warning: Could not load metadata: {e}")
                return False
        
        if self.embedding_model is None:
            try:
                self.embedding_model = EmbeddingModel(self.model_name)
            except Exception as e:
                print(f"Warning: Could not load embedding model: {e}")
                return False
        
        return True

    def retrieve_similar_rules(self, clauses: list[dict], top_k: int = 5) -> list[dict]:
        """
        Retrieve the top k relevant rules from FAISS for the given clauses.
        
        Each clause dict must contain an "embedding" key (np.array or list).
        """
        if not self._lazy_load():
            # Return dummy results if loading fails
            return [{
                "original_clause": clause,
                "matches": [{"rule_text": "FAISS retrieval not available", "metadata": {}}]
            } for clause in clauses]
        
        try:
            query_texts = [clause["text_en"] for clause in clauses]
            query_embeddings = self.embedding_model.encode(query_texts)
            
            # Search FAISS
            distances, indices = self.index.search(query_embeddings, top_k)
            
            all_matches = []
            for i, clause in enumerate(clauses):
                clause_matches = []
                for j, idx in enumerate(indices[i]):
                    if idx == -1:
                        continue  # skip invalid index
                    match_meta = self.metadata[idx]
                    clause_matches.append({
                        "rule_text": match_meta["text"],
                        "metadata": {
                            "doc_id": match_meta["doc_id"],
                            "clause_id": match_meta["clause_id"],
                            "chunk_id": match_meta["chunk_id"]
                        }
                    })
                
                all_matches.append({
                    "original_clause": clause,
                    "matches": clause_matches
                })
            
            return all_matches
        except Exception as e:
            print(f"Warning: FAISS retrieval failed: {e}")
            return [{
                "original_clause": clause,
                "matches": [{"rule_text": f"Retrieval error: {str(e)}", "metadata": {}}]
            } for clause in clauses]
