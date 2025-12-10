from google import genai
import os
from typing import List, Dict

# Usage of the new Google Gen AI SDK
# pip install google-genai

api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key:
    client = genai.Client(api_key=api_key)

def get_client():
    if not client:
        # Fallback if key wasn't present at import time but set later
        current_key = os.getenv("GEMINI_API_KEY")
        if current_key:
            return genai.Client(api_key=current_key)
        print("Warning: GEMINI_API_KEY not set.")
        return None
    return client

async def generate_project_summary(pages_content: str) -> str:
    """
    Generates a short summary of the project based on the first few pages content.
    """
    c = get_client()
    if not c:
        return "Documentation Project (No API Key)"
        
    prompt = f"""
    You are an expert technical writer. 
    Analyze the following documentation intro content and provide a concise, 1-paragraph summary of what this project/library is.
    
    Content:
    {pages_content[:10000]} 
    
    Summary:
    """
    try:
        # User specifically requested gemini-2.5-flash. 
        # We will try it first.
        target_model = 'gemini-2.5-flash'
        try:
            response = await c.aio.models.generate_content(
                model=target_model, 
                contents=prompt
            )
        except Exception as retry_e:
            print(f"Model {target_model} failed, falling back to gemini-2.0-flash-exp. Error: {retry_e}")
            target_model = 'gemini-2.0-flash-exp'
            response = await c.aio.models.generate_content(
                model=target_model, 
                contents=prompt
            )
            
        return response.text.strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Documentation Project"

async def generate_link_description(page_markdown: str) -> str:
    """
    Generates a 1-sentence description for a page.
    """
    c = get_client()
    if not c:
        return "Documentation page."

    prompt = f"""
    Read this markdown content and provide a single sentence description of what this page covers.
    Keep it very brief (max 20 words).
    
    Content:
    {page_markdown[:3000]}
    
    Description:
    """
    try:
        # Same model logic here
        target_model = 'gemini-2.5-flash'
        try:
            response = await c.aio.models.generate_content(
                model=target_model, 
                contents=prompt
            )
        except Exception:
             target_model = 'gemini-2.0-flash-exp'
             response = await c.aio.models.generate_content(
                model=target_model, 
                contents=prompt
            )
        return response.text.strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Documentation page."
