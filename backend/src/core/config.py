import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Chave secreta para validar o JWT do Supabase
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# Algoritmo de criptografia usado pelo Supabase
ALGORITHM = "HS256"

# Credenciais para a API Qwen (Alibaba DashScope)
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
QWEN_BASE_URL = os.getenv(
    "QWEN_BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
)
QWEN_DEFAULT_MODEL = os.getenv("QWEN_MODEL_NAME", "qwen-plus")
