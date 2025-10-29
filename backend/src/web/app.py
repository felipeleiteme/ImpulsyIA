from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, chat, payments

app = FastAPI(
    title="ImpulsyIA Headless Backend",
    description="API para a plataforma ImpulsyIA, servindo o frontend desacoplado.",
    version="0.1.0",
)

# Configuração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, substitua por ["http://localhost:3000", "https://seu-dominio.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health Check"])
async def root():
    return {"status": "ok", "message": "ImpulsyIA API is running"}

# Incluir as rotas da API
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
