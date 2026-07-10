import os
import django
import sys
import logging

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_project.settings')
django.setup()

from apps.resumes.utils import extract_text_from_file, score_resume_with_ai

# Setup basic logging to see errors
logging.basicConfig(level=logging.INFO)

def run_diagnostics():
    print("=== STARTING RESUME AI DIAGNOSTICS ===")
    
    # Check for API key
    if not os.getenv("GEMINI_API_KEY"):
        print("\n[!] ERROR: GEMINI_API_KEY is not set in the environment.")
        print("[!] The rigorous AI tests cannot be performed without a real AI API key.")
        print("[!] Please add GEMINI_API_KEY to your .env file and re-run this script.")
        return

    # Create dummy PDF files for testing
    import fitz
    
    good_resume_path = "good_resume.pdf"
    bad_resume_path = "bad_resume.pdf"
    
    # Create Good Resume
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Senior Software Engineer\n\nExperience:\n- Architected a microservices backend that improved API response time by 40%.\n- Led a team of 5 engineers to deliver the product 2 weeks ahead of schedule.\n- Used Python, Django, React, and AWS to scale the platform to 100k daily active users.\n\nEducation: B.S. Computer Science")
    doc.save(good_resume_path)
    
    # Create Bad Resume
    doc = doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Worker guy\n\nExperience:\n- Did some stuff with computers.\n- Helped people.\n- Worked hard on projects.\n\nEducation: High School")
    doc.save(bad_resume_path)
    
    print("\n--- STEP 1: Verify Text Extraction ---")
    good_text = extract_text_from_file(good_resume_path)
    print(f"Extracted Good Resume Text:\n{good_text}")
    if "100k daily active users" in good_text:
        print("-> Extraction SUCCESSFUL")
    else:
        print("-> Extraction FAILED")

    print("\n--- STEP 2: Verify Scoring Prompt & Structure ---")
    print("-> The prompt is hardcoded in apps/resumes/utils.py to return JSON structure.")
    
    print("\n--- STEP 3: Test for Consistency (Same Resume, Same Role x3) ---")
    score1 = score_resume_with_ai(good_text, "software engineer")
    print(f"Run 1: Score {score1['score']}")
    score2 = score_resume_with_ai(good_text, "software engineer")
    print(f"Run 2: Score {score2['score']}")
    score3 = score_resume_with_ai(good_text, "software engineer")
    print(f"Run 3: Score {score3['score']}")
    
    print("\n--- STEP 4: Test for Differentiation (Good vs Bad) ---")
    bad_text = extract_text_from_file(bad_resume_path)
    good_score = score1['score']
    bad_score_dict = score_resume_with_ai(bad_text, "software engineer")
    bad_score = bad_score_dict['score']
    print(f"Good Resume Score: {good_score}")
    print(f"Bad Resume Score: {bad_score}")
    
    print("\n--- STEP 5: Test Target-Role Sensitivity ---")
    marketing_score_dict = score_resume_with_ai(good_text, "marketing manager")
    marketing_score = marketing_score_dict['score']
    print(f"Good Resume for Software Engineer: {good_score}")
    print(f"Good Resume for Marketing Manager: {marketing_score}")
    
    # Cleanup
    os.remove(good_resume_path)
    os.remove(bad_resume_path)
    
    print("\n=== DIAGNOSTICS COMPLETE ===")

if __name__ == "__main__":
    run_diagnostics()
