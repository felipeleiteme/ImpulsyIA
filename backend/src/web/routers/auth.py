from fastapi import APIRouter

router = APIRouter()

@router.post("/token")
async def login_for_access_token():
    # Lógica de login para gerar um token JWT
    return {"access_token": "fake-jwt-token", "token_type": "bearer"}
