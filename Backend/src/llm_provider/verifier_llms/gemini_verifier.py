"""
Gemini Verifier

This module provides functionality to verify compliance using the Gemini LLM.
"""

from src.llm_provider.safe_json_helper import safe_json_response
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

def verify_with_gemini(system_prompt: str, user_prompt: str) -> dict:
    """
    Verify compliance using the Gemini LLM.
    Args:
        system_prompt (str): The system prompt to guide the LLM.
        user_prompt (str): The user prompt containing the query.
    Returns:
        dict: The verification result from the LLM.
    """
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY_2"))
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{"role": "user", "parts": [{"text": system_prompt + "\n" + user_prompt}]}]
    )
    raw = response.candidates[0].content.parts[0].text
    return safe_json_response(raw)
