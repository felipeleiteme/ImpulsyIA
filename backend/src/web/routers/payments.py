from fastapi import APIRouter

router = APIRouter()

@router.post("/webhook")
async def payment_webhook():
    # Lógica para receber webhooks de pagamento do MercadoPago
    return {"status": "received"}
