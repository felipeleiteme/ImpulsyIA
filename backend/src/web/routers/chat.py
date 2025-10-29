from fastapi import APIRouter

router = APIRouter()

@router.post("/stream")
async def chat_stream():
    # Lógica para o streaming de chat com LangChain
    return {"message": "Streaming response from AI agent"}
