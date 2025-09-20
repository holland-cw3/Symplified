import os
from google import genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_KEY = "AIzaSyCQQx4YkUHo0RQtiqaJw3VSfJDmswq_3aI"

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

def query_gemini(user_input: list):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_input
    )
    return {"output": response.text}