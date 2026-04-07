from groq import AsyncGroq, APIError

from backend.config import settings

_client = AsyncGroq(api_key=settings.groq_api_key)

_SYSTEM_PROMPT = (
    "You are a helpful assistant for a small Indian retail shop owner "
    "using Smart Udhaar & Store Manager. Answer questions about inventory, "
    "udhaar, customers, and billing in simple, practical language."
)


async def ask_groq(question: str) -> str:
    try:
        response = await _client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": question},
            ],
        )
        return response.choices[0].message.content or "No response received."
    except APIError as exc:
        return f"AI service is temporarily unavailable. (Error: {exc.status_code})"
    except Exception:
        return "Sorry, I could not process your question right now. Please try again later."
