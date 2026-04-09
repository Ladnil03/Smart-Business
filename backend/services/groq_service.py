from groq import AsyncGroq, APIError
import logging

from backend.config import settings

logger = logging.getLogger(__name__)

_client = AsyncGroq(api_key=settings.groq_api_key)

_SYSTEM_PROMPT = (
    "You are a helpful assistant for a small Indian retail shop owner "
    "using Smart Udhaar & Store Manager. Answer questions about inventory, "
    "udhaar, customers, and billing in simple, practical language."
)


async def ask_groq(question: str) -> str:
    try:
        response = await _client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": question},
            ],
        )
        return response.choices[0].message.content or "No response received."
    except APIError as exc:
        logging.error(f"Groq API error: {exc.status_code} — {exc.message}")
        return "AI service is temporarily unavailable. Please try again later."
    except Exception:
        return "Sorry, I could not process your question right now. Please try again later."
