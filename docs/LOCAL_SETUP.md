# Configuração Local do Projeto ImpulsyIA

Este documento descreve como configurar e executar o projeto ImpulsyIA localmente em seu ambiente de desenvolvimento.

## Requisitos Prévios

- Node.js (versão 14 ou superior)
- Python 3.9 ou superior
- npm (geralmente vem com o Node.js)
- git

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

1. **Frontend**: Aplicação React com Vite localizada em `/frontend`
2. **Backend**: API FastAPI localizada em `/backend`

## Configuração do Backend

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências do Python:
   ```bash
   python3 -m pip install -r requirements.txt
   ```

3. Inicie o servidor:
   ```bash
   PYTHONPATH=src python3 -m src.main
   ```

   O backend estará disponível em `http://localhost:8000`

## Configuração do Frontend

1. Em um novo terminal, navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   O frontend estará disponível em `http://localhost:3000` (ou outra porta se 3000 estiver ocupada)

## Integração Frontend-Backend

O projeto está configurado para funcionar com um proxy de desenvolvimento:

- O frontend roda em `http://localhost:3000` (por padrão)
- O backend roda em `http://localhost:8000`
- Chamadas para `/api/*` no frontend são automaticamente encaminhadas para o backend
- Isso é configurado no arquivo `frontend/vite.config.ts`

## Scripts Úteis

### Iniciar ambos os servidores

Para iniciar ambos os servidores simultaneamente, você pode usar os seguintes comandos em terminais separados:

```bash
# Terminal 1 - Backend
cd backend && PYTHONPATH=src python3 -m src.main

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Verificar portas em uso

```bash
# Verificar se o backend está rodando
lsof -i :8000

# Verificar se o frontend está rodando
lsof -i :3000
```

## Solução de Problemas

### Erros de CORS

Se você encontrar erros de CORS, verifique se o middleware CORS está configurado corretamente no backend (`backend/src/web/app.py`):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erros de dependências

Se encontrar erros de dependências, tente:

1. No diretório do backend:
   ```bash
   python3 -m pip install --upgrade -r requirements.txt
   ```

2. No diretório do frontend:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Erros de porta

Se as portas padrão estiverem em uso:

1. O frontend irá automaticamente tentar outra porta (3001, 3002, etc.)
2. Para mudar a porta do backend, edite o arquivo `backend/src/main.py`

## Estrutura de API

O frontend faz chamadas para os seguintes endpoints do backend:

- `/api/auth/token` - Autenticação
- `/api/chat/stream` - Chat
- `/api/payments/webhook` - Pagamentos

Esses endpoints são definidos nos arquivos de rota do backend em `backend/src/web/routers/`.