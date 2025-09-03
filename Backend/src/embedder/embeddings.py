from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np

class EmbeddingModel:
    def __init__(self, model_name="nlpaueb/legal-bert-base-uncased"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def encode(self, texts: list[str]) -> np.ndarray:
        """Generate embeddings for a list of texts using LegalBERT."""
        inputs = self.tokenizer(
            texts,
            padding=True,
            truncation=True,
            return_tensors="pt",
            max_length=512
        )

        with torch.no_grad():
            outputs = self.model(**inputs)
            # Mean pooling
            embeddings = outputs.last_hidden_state.mean(dim=1)

        return embeddings.cpu().numpy().astype("float32")
