# Arquitetura de Integração Frontend-Backend

Este documento descreve a arquitetura de integração entre o frontend React e o backend FastAPI do projeto ImpulsyIA.

## Visão Geral

O projeto utiliza uma arquitetura cliente-servidor onde:
- O **frontend** é uma aplicação React com Vite
- O **backend** é uma API REST construída com FastAPI
- A comunicação entre eles é feita através de chamadas HTTP

## Estrutura de Pastas

```
ImpulsyIA/
├── backend/
│   ├── src/
│   │   └── web/
│   │       ├── app.py          # Configuração principal da aplicação FastAPI
│   │       ├── routers/        # Rotas da API
│   │       │   ├── auth.py     # Rotas de autenticação
│   │       │   ├── chat.py     # Rotas de chat
│   │       │   └── payments.py # Rotas de pagamentos
│   │       └── ...
│   └── requirements.txt        # Dependências do backend
├── frontend/
│   ├── src/
│   │   ├── services/           # Serviços de API
│   │   │   └── api.ts          # Cliente HTTP centralizado
│   │   ├── components/         # Componentes React
│   │   └── App.tsx             # Componente principal
│   ├── vite.config.ts          # Configuração do Vite
│   └── package.json            # Dependências do frontend
├── docs/
│   ├── frontend_changes.md     # Documentação de mudanças no frontend
│   ├── INTEGRATION_NOTES.md    # Notas sobre a integração
│   └── LOCAL_SETUP.md          # Instruções de configuração local
├── start.sh                    # Script de inicialização
└── README.md                   # Documentação principal
```

## Integração de Desenvolvimento

Durante o desenvolvimento, utilizamos um proxy configurado no Vite para evitar problemas de CORS:

### Configuração do Proxy (frontend/vite.config.ts)

```typescript
server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

Isso permite que chamadas para `/api/*` sejam automaticamente encaminhadas para `http://localhost:8000`.

### Middleware CORS (backend/src/web/app.py)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Estrutura da API

O backend expõe os seguintes endpoints:

### Autenticação
- `POST /api/auth/token` - Gera tokens de acesso

### Chat
- `POST /api/chat/stream` - Processa mensagens do chat

### Pagamentos
- `POST /api/payments/webhook` - Recebe webhooks de pagamento

## Cliente HTTP Centralizado

Todas as chamadas de API no frontend são feitas através de um cliente HTTP centralizado localizado em `frontend/src/services/api.ts`:

```typescript
// Exemplo de uso
const result = await authAPI.login(email, password);
const result = await chatAPI.sendMessage(message);
```

## Deploy em Produção

Em produção, a mesma arquitetura pode ser implementada usando um proxy reverso como Nginx:

```
                    +------------------+
                    |  Internet        |
                    +--------+---------+
                             |
                    +--------v---------+
                    |  Proxy Reverso   |
                    |  (Nginx)         |
                    +--------+---------+
                             |
        +--------------------+--------------------+
        |                                         |
+-------v--------+                     +----------v-------+
|  Frontend      |                     |  Backend         |
|  (Arquivos     |                     |  (API FastAPI)   |
|  Estáticos)    |                     |                  |
+----------------+                     +------------------+
```

O proxy reverso encaminha:
- Requisições para `/api/*` → Backend
- Todas as outras requisições → Frontend (arquivos estáticos)

## Segurança

### Em Desenvolvimento
- CORS configurado para permitir todas as origens (`"*"`)

### Em Produção
- CORS deve ser configurado para permitir apenas origens confiáveis
- Tokens JWT devem ser armazenados de forma segura
- HTTPS deve ser utilizado para todas as comunicações

## Monitoramento e Logging

### Frontend
- Logs são enviados para o console do navegador
- Erros de rede são tratados e exibidos ao usuário

### Backend
- Logs são enviados para stdout/stderr
- Erros são registrados com detalhes para depuração

## Extensibilidade

A arquitetura foi projetada para ser facilmente extensível:

1. Novos endpoints podem ser adicionados criando novos arquivos em `backend/src/web/routers/`
2. Novos serviços frontend podem ser adicionados em `frontend/src/services/`
3. A configuração do proxy pode ser estendida para novos prefixos de URL