from fastapi import APIRouter, Depends
from security.token import get_current_user

router = APIRouter()

@router.post("/stream")
async def chat_stream(current_user: dict = Depends(get_current_user)):
    # Graças a Depends(get_current_user), este código só será executado
    # se um token válido for fornecido na requisição.
    
    # O ID do usuário autenticado está disponível em current_user["user_id"]
    user_id = current_user["user_id"]
    print(f"Requisição de chat recebida do usuário: {user_id}")
    
    # Lógica para o streaming de chat com LangChain
    return {"message": f"Streaming response for user {user_id}"}
