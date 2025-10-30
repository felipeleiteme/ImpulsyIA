from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from core.config import SUPABASE_JWT_SECRET, ALGORITHM

# Esta dependência informa ao FastAPI para procurar por um cabeçalho "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # tokenUrl não é usado diretamente, mas é necessário

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependência do FastAPI para validar o token JWT do Supabase e retornar os dados do usuário.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET is not configured"
        )

    try:
        # Decodifica e valida o token
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM])
        
        # O ID do usuário do Supabase fica no campo 'sub'
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Você pode adicionar mais validações aqui se necessário
        
        return {"user_id": user_id, "payload": payload}
    
    except JWTError:
        # Se o token for inválido (assinatura errada, expirado, etc.)
        raise credentials_exception
