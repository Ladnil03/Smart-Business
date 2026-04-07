from urllib.parse import quote


def generate_udhaar_reminder(
    name: str, phone: str, amount: float, shop_name: str
) -> str:
    # Normalise phone: strip spaces/dashes then prepend 91 if no country code
    cleaned = phone.replace(" ", "").replace("-", "")
    if not cleaned.startswith("91") or len(cleaned) <= 10:
        cleaned = "91" + cleaned.lstrip("+")

    message = (
        f"Dear {name}, your outstanding balance is ₹{amount:.2f}. "
        f"Please clear at your earliest. - {shop_name}"
    )
    encoded_message = quote(message, safe="")
    return f"https://wa.me/{cleaned}?text={encoded_message}"
