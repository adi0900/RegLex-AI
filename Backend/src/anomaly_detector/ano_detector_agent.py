from transformers import AutoTokenizer, AutoModel
import torch
import joblib
import numpy as np

clf = joblib.load("isolation_forest.joblib")

MODEL_NAME = "nlpaueb/legal-bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

# Assume clf is loaded globally (e.g., OneClassSVM, IsolationForest, etc.)
# clf = joblib.load("anomaly_detector.pkl")

def explain_clause(score, pred):
    score_val = float(score)
    pred_val = int(pred)

    if pred_val == -1:  # anomaly
        return f"Anomalous. Score={score_val:.3f}"
    else:
        return f"Normal. Score={score_val:.3f}"

def anomaly(text: str):
    """Run anomaly detection on a single clause string."""
    inputs = tokenizer(
        text, return_tensors="pt",
        truncation=True, padding=True, max_length=512
    )

    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).numpy()

    pred = clf.predict(embeddings)[0]
    score = clf.decision_function(embeddings)[0]
    explanation = explain_clause(score, pred)

    return explanation, pred, score


def anomaly_detection_pipeline(clauses):
    """
    Process a list of clauses for anomaly detection.
    
    Args:
        clauses: List of dicts with clause_id and text_en
    
    Returns:
        List of dicts with anomaly analysis
    """
    results = []

    for clause in clauses:
        clause_id = clause.get("clause_id", "unknown")
        text = clause.get("text_en", "")

        if not text.strip():
            results.append({
                "clause_id": clause_id,
                "text": text,
                "anomaly_explanation": "Empty text - cannot analyze",
                "is_anomaly": False,
                "anomaly_score": 0.0
            })
            continue

        try:
            explanation, pred, score = anomaly(text)
            results.append({
                "clause_id": clause_id,
                "text": text,
                "anomaly_explanation": explanation,
                "is_anomaly": (pred == -1),
                "anomaly_score": float(score)
            })

        except Exception as e:
            results.append({
                "clause_id": clause_id,
                "text": text,
                "anomaly_explanation": f"Error during analysis: {str(e)}",
                "is_anomaly": False,
                "anomaly_score": 0.0
            })

    return results