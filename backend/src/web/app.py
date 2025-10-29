from fastapi import FastAPI
from .routers import auth, chat, payments

app = FastAPI(
    title="ImpulsyIA Headless Backend",
    description="API para a plataforma ImpulsyIA, servindo o frontend desacoplado.",
    version="0.1.0",
)

@app.get("/", tags=["Health Check"])
async def root():
    return {"status": "ok", "message": "ImpulsyIA API is running"}

# Incluir as rotas da API
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
