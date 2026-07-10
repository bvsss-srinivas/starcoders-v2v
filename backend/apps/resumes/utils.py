import os
import json
import logging
import google.generativeai as genai
import fitz  # PyMuPDF
from django.conf import settings

logger = logging.getLogger(__name__)

def extract_text_from_file(file_path):
    """
    Extracts text from a given file path. Currently supports PDF.
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    try:
        if ext == '.pdf':
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
            doc.close()
        else:
            # Fallback or other formats could be added here
            logger.warning(f"Unsupported file extension for extraction: {ext}")
            return None
    except Exception as e:
        logger.error(f"Error extracting text from {file_path}: {str(e)}")
        return None
        
    return text.strip()

def score_resume_with_ai(resume_text, target_role):
    """
    Calls Google Gemini to score the resume text against the target role.
    Returns a parsed JSON dictionary.
    """
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        logger.error("GEMINI_API_KEY is not set in environment.")
        raise ValueError("GEMINI_API_KEY is missing.")
        
    genai.configure(api_key=api_key)
    
    role_str = target_role if target_role else "a general professional role"
    
    prompt = f"""
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Score the provided resume against the target role: "{role_str}".

You MUST return the result EXACTLY as a valid JSON object with the following schema:
{{
    "score": <integer from 0-100>,
    "status": <string, exactly "Targeted" if score >= 75 else "Needs Update">,
    "sub_scores": {{
        "ATS Compatibility": <integer from 0-100>,
        "Keyword Match": <integer from 0-100>,
        "Impact & Metrics": <integer from 0-100>,
        "Formatting": <integer from 0-100>
    }},
    "suggestions": [
        <string containing a specific, actionable suggestion to improve the resume for this role>,
        <string containing another specific suggestion>,
        <string containing a third specific suggestion>
    ]
}}

CRITICAL SCORING RUBRIC:
- Harshly penalize missing quantified metrics (e.g. %, $, time saved). If there are no numbers, 'Impact & Metrics' should be below 40.
- Check for exact keyword matches for "{role_str}".
- The 'suggestions' array must contain exactly 3 to 5 actionable bullet points.

Resume Text:
---
{resume_text[:15000]}
---
"""

    try:
        # Use a model that supports JSON response if available, or just prompt strongly
        model = genai.GenerativeModel('gemini-1.5-flash', 
                                      generation_config={"response_mime_type": "application/json", "temperature": 0.1})
        
        response = model.generate_content(prompt)
        result_text = response.text
        
        # Parse JSON
        parsed_result = json.loads(result_text)
        
        # Ensure default structure just in case
        return {
            'score': parsed_result.get('score', 50),
            'status': parsed_result.get('status', 'Needs Update'),
            'sub_scores': parsed_result.get('sub_scores', {
                'ATS Compatibility': 50,
                'Keyword Match': 50,
                'Impact & Metrics': 50,
                'Formatting': 50
            }),
            'suggestions': parsed_result.get('suggestions', ["Please upload a clearer resume."])
        }
        
    except Exception as e:
        logger.error(f"Error calling Gemini AI: {str(e)}")
        raise e
