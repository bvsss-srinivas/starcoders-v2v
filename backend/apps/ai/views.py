from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from groq import Groq

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_messages = request.data.get('messages', [])
        
        if not user_messages:
            return Response({"error": "No messages provided."}, status=400)

        # Initialize Groq client
        client = Groq(api_key=settings.GROQ_API_KEY)

        # System prompt for the persona
        system_prompt = {
            "role": "system",
            "content": (
                "You are the ElevateHer AI Career Coach, an empathetic, encouraging, "
                "and highly knowledgeable expert designed to help women advance their careers in STEM. "
                "You provide comprehensive, deeply detailed, and highly practical advice on resume building, "
                "interview preparation, salary negotiation, financial literacy, and professional networking. "
                "Always structure your answers beautifully using Markdown. Use bold headings, bullet points, "
                "and step-by-step actionable guides to make your comprehensive answers easy to read. "
                "Do not be brief; take your time to thoroughly explain concepts, give real-world examples, "
                "and provide the best possible guidance to empower the user."
            )
        }

        # Build message history
        messages = [system_prompt]
        for msg in user_messages:
            role = "user" if msg.get("role") == "user" else "assistant"
            messages.append({"role": role, "content": msg.get("text")})

        try:
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
                top_p=1,
                stream=False,
                stop=None,
            )
            
            ai_text = completion.choices[0].message.content
            
            return Response({"response": ai_text})
        except Exception as e:
            print(f"Groq API Error: {e}")
            return Response({"error": f"Failed to generate response. {str(e)}"}, status=500)
