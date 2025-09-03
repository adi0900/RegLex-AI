"""
Regulation Retrieval Agent (FAISS-based)

This agent extracts the top k relevant rules 
from the FAISS vector database for the given clause.
"""

import faiss
import pickle
from src.embedder.embeddings import EmbeddingModel

class RegulationRetriever:
    def __init__(self, faiss_index_path: str, metadata_path: str, model_name: str = "nlpaueb/legal-bert-base-uncased"):
        """
        Initialize the RegulationRetriever with FAISS.
        
        Args:
            faiss_index_path: Path to FAISS index file
            metadata_path: Path to metadata pickle file
        """
        # Load FAISS index
        self.index = faiss.read_index(faiss_index_path)
        self.embedding_model = EmbeddingModel(model_name)  # Initialize embedding model here if needed
        # Load metadata
        with open(metadata_path, "rb") as f:
            self.metadata = pickle.load(f)
    
    def retrieve_similar_rules(self, clauses: list[dict], top_k: int = 5) -> list[dict]:
        """
        Retrieve the top k relevant rules from FAISS for the given clauses.
        
        Each clause dict must contain an "embedding" key (np.array or list).
        """
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
