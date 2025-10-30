# Arquitetura ImpulsyIA

Documento vivo do projeto. Atualize sempre após alterações estruturais, integrações ou decisões relevantes para que agentes humanos ou de código tenham contexto completo.

---

## 1. Visão Geral

- Arquitetura cliente-servidor: **frontend React/Vite** (`frontend/`) consome **API FastAPI** (`backend/`).
- Experiência centrada em 7 agentes de IA, com prompts definidos no backend e estado de conversa mantido no frontend.
- Autenticação e perfil: **Supabase Auth**; tokens Supabase são obrigatórios nas rotas protegidas.
- IA/LLM: modelo **Qwen Plus** (DashScope) acessado por endpoint compatível com OpenAI.
- Execução local: script `./start.sh` levanta backend (porta 8000) e frontend (porta 3000 com proxy `/api`).

Fluxo macro:
```
Usuário ─► Frontend (React) ─► /api/* ─► Backend FastAPI ─► DashScope (Qwen)
                                              └─► Validação JWT (Supabase)
```

---

## 2. Estrutura de Pastas

```
ImpulsyIA/
├── backend/
│   ├── requirements.txt         # Dependências Python
│   └── src/
│       ├── agents/              # Definições, prompts e serviço de agentes
│       ├── core/                # Configuração (.env, constantes)
│       ├── llms/                # Clientes LLM (Qwen)
│       ├── security/            # OAuth/JWT helpers
│       ├── web/                 # Aplicação FastAPI (app + routers)
│       └── main.py              # Entry point uvicorn
├── frontend/
│   ├── package.json             # Dependências Node
│   └── src/
│       ├── App.tsx              # Componente raiz/composição de páginas
│       ├── components/          # UI reutilizável e páginas (Login, Perfil...)
│       └── services/            # Clientes HTTP e Supabase
├── docs/                        # Documentação (este arquivo, initialization...)
├── start.sh                     # Script que sobe backend+frontend
├── backend.log / frontend.log   # Logs produzidos por start.sh
└── README.md                    # Guia rápido
```

---

## 3. Tecnologia Utilizada

| Domínio                  | Tecnologias / Bibliotecas                                    | Referências principais                               |
|--------------------------|---------------------------------------------------------------|------------------------------------------------------|
| Frontend                 | React 18, TypeScript, Vite, Tailwind CSS                     | `frontend/src/App.tsx`, `frontend/src/components/`   |
| UI/UX                    | Componentes custom, `lucide-react`, `sonner`, Radix UI       | `frontend/src/components/`                           |
| Estado & Serviços        | Hooks React (`useState`, `useEffect`, `useCallback`), `fetch` | `frontend/src/services/api.ts`                       |
| Autenticação             | Supabase JS (`@supabase/supabase-js` v2.77)                   | `frontend/src/services/supabase.ts`                  |
| Backend HTTP             | FastAPI, Uvicorn                                              | `backend/src/web/app.py`, `backend/src/main.py`      |
| Segurança                | `python-jose`, `OAuth2PasswordBearer`, `passlib[bcrypt]`     | `backend/src/security/token.py`                      |
| Integração LLM           | SDK OpenAI apontado para DashScope                            | `backend/src/llms/qwen_client.py`                    |
| Orquestração de agentes  | Dataclasses + prompts UTF-8                                   | `backend/src/agents/`                                |
| Automação local          | Script bash (`start.sh`), logs dedicados                     | raiz                                                 |

Requisitos de ambiente:
- **Node.js ≥ 18** (verificar com `node -v`).
- **npm ≥ 9**.
- **Python ≥ 3.9** com `pip` disponível.

---

## 4. Decisões de Arquitetura

- **Routers FastAPI** (`backend/src/web/routers/`): separa domínios (`auth`, `chat`, `agents`, `payments`).
- **Imports absolutos** com `PYTHONPATH=src`: evita erros de módulo relativos e permite rodar scripts diretos.
- **Wrapper QwenClient** valida `DASHSCOPE_API_KEY` antes de qualquer uso e encapsula respostas do SDK OpenAI.
- **Prompts versionados** (arquivos `.txt` em `backend/src/agents/prompts/`) permitem ajustes de personas sem mexer em código.
- **Front controla jornada** via estado `journeyStarted`: usuário permanece na tela hero pós-login até enviar mensagem.
- **Proxy dev** (`frontend/vite.config.ts`): roteia `/api` para `http://localhost:8000`, evitando CORS durante desenvolvimento.
- **Supabase como verdade de sessão**: listener `supabase.auth.onAuthStateChange` mantém UI em sincronia.

---

## 5. Configuração de Ambiente

### Backend (`backend/.env`)
```
SUPABASE_JWT_SECRET="<jwt_secret_do_supabase>"
DASHSCOPE_API_KEY="<api_key_dashscope>"
QWEN_MODEL_NAME="qwen-plus"
QWEN_BASE_URL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
```

- **Onde obter**: o `SUPABASE_JWT_SECRET` fica em *Supabase → Settings → API → JWT Secret*; a `DASHSCOPE_API_KEY` é criada no console DashScope (Alibaba Cloud) em *API Keys/Applications*. Guarde fora do repositório.
- Após preencher manualmente o `.env`, **não execute novamente** `cp .env.example .env`, pois isso sobrescreve os segredos.

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL="https://<instancia>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon_key>"
```

- `backend/src/core/config.py` carrega variáveis com `python-dotenv`.
- O hostname `dashscope-intl.aliyuncs.com` deve estar acessível; caso contrário o chat retorna 500.
- No frontend, as variáveis `import.meta.env` configuram o cliente Supabase.

---

## 6. Passo a Passo de Inicialização

### Opção A: Script único
```bash
./start.sh
# Backend → http://localhost:8000
# Frontend → http://localhost:3000 (ou próxima porta livre)
```

### Opção B: Manual (dois terminais)
```bash
# Terminal 1 – backend
cd backend
python3 -m pip install -r requirements.txt
cp .env.example .env  # e preencha as variáveis
PYTHONPATH=src python3 -m uvicorn src.web.app:app --host 0.0.0.0 --port 8000  # sempre executar a partir de backend/

# Terminal 2 – frontend
cd frontend
npm install
npm run dev
```

### Testes / Builds
- Frontend: `npm run build` gera artefatos em `frontend/build/`.
- Backend: não há suíte de testes configurada; recomenda-se adicionar futuramente.

---

## 7. Regras de Negócio Centrais

1. **Autenticação obrigatória**: rotas de agentes (`/api/agents/*`) exigem JWT Supabase válido. Sem `SUPABASE_JWT_SECRET`, backend retorna 500.
2. **Hero antes do chat**: usuário autenticado permanece na tela inicial até enviar primeira mensagem (`journeyStarted` muda para `true`).
3. **Agentes pré-definidos**: sete agentes com prompts estáticos e modelo padrão `qwen-plus`.
4. **Validação de mensagens**: backend aceita apenas roles `user|assistant|system` com conteúdo não vazio (ver `agents/service.py`).
5. **Reset de conversa**: botão “Nova Conversa” limpa histórico local e reinsere mensagem introdutória do agente.
6. **Stubs em auth/chat streaming/payments**: rotas existem, mas precisam de implementação real.
7. **Dependências críticas**: ausência de `DASHSCOPE_API_KEY` gera `ValueError`; ausência de internet para DashScope → `RuntimeError` (500).
8. **Execução correta do backend**: iniciar fora de `backend/` (ex.: a partir do diretório home) causa `ModuleNotFoundError: No module named 'src'`; configure `PYTHONPATH=src` no comando ou via variável de ambiente.

---

## 8. Esquema de Dados (Resumido)

### Backend
- `AgentDefinition` (`backend/src/agents/definitions.py`): `{ id, name, description, system_prompt, default_model }`.
- `run_agent_chat` (`backend/src/agents/service.py`):
  - Entrada: `agent_id`, lista de mensagens (`role`, `content`), opções (`model`, `temperature`, `max_tokens`).
  - Saída: `{ agent_id, agent_name, model, message, usage }`.
- `get_current_user` (`backend/src/security/token.py`): retorna `{ user_id, payload }` extraídos do JWT Supabase.
- Persistência própria ainda não existe; módulo `database/` vazio para futura expansão.

### Frontend
- `ConversationMessage`: `{ id: string, type: 'user' | 'assistant', content: string }`.
- Estado principal (`App.tsx`):
  - `chats`, `agentSessions`, `isAuthenticated`, `journeyStarted`, `currentChatId`, `isPremium`, etc.
- Serviços (`frontend/src/services/api.ts`):
  - `authAPI`, `chatAPI`, `agentsAPI`, `paymentsAPI` centralizam chamadas `fetch`.

---

## 9. Contratos de API (Resumido)

### Autenticação (stub)
```
POST /api/auth/token
Body: { "email": "user@example.com", "password": "..." }
Resposta atual: { "access_token": "fake-jwt-token", "token_type": "bearer" }
(Substituir por fluxo real de Supabase/token próprio)
```

### Chat Streaming (stub)
```
POST /api/chat/stream
Headers: Authorization: Bearer <jwt_supabase>
Body: { "message": "..." }
Resposta: { "message": "Streaming response for user <id>" }
```

### Listar agentes
``+
GET /api/agents/
Headers: Authorization: Bearer <jwt_supabase>
Resposta: [ { "id": "mestre_mapeamento", "name": "Mestre do Mapeamento", "description": "..." }, ... ]
```

### Chat com agente
```
POST /api/agents/{agent_id}/chat
Headers: Authorization: Bearer <jwt_supabase>
Body: {
  "messages": [
    { "role": "user", "content": "Olá" },
    { "role": "assistant", "content": "Resposta anterior" }
  ],
  "model": "qwen-plus",     // opcional
  "temperature": 0.5,        // opcional
  "max_tokens": 512          // opcional
}

Resposta (200): {
  "agent_id": "mestre_mapeamento",
  "agent_name": "Mestre do Mapeamento",
  "model": "qwen-plus",
  "message": "... resposta do agente ...",
  "usage": { ... }            // pode ser null se o provedor não retornar
}

Erros possíveis:
- 401 se token inválido/ausente.
- 404 se `agent_id` não existir.
- 500 se o provedor Qwen retornar erro (mensagem inclui "Qwen API error: ...").
```

### Webhook de pagamentos (stub)
```
POST /api/payments/webhook
Body: { ... }
Resposta: { "status": "received" }
```

> **Observação:** por enquanto o frontend ainda não envia o header `Authorization` nas requisições; ajuste futuro necessário para produção.

---

## 10. Operação e Integrações

- **Logs**: `start.sh` grava stdout/stderr em `backend.log` e `frontend.log`.
- **Diagnóstico**: erros DashScope aparecem como `RuntimeError` no backend. Verifique conectividade com `curl -I https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.
- **CORS**: desenvolvimento liberado para `*`; restringir em produção.
- **Dependências externas**: Supabase (auth/email), DashScope (LLM), potencial Mercadopago (webhook placeholder).

---

## 11. Riscos, Pendências e Próximos Passos

- Implementar autenticação real no backend ou migrar totalmente para Supabase (Edge Functions / RLS).
- Adicionar envio de header `Authorization` no frontend para alinhar com `get_current_user`.
- Converter `/api/chat/stream` em streaming real (LangChain, SSE) ou remover.
- Persistir histórico de conversas e métricas (Supabase/Postgres), registrar uso de tokens do Qwen.
- Reforçar segurança (HTTPS, rotação de segredos, CORS restritivo, rate limiting em `backend/src/limits/`).
- Adicionar cobertura de testes (unitários e integração).

---

## 12. Histórico de Atualizações Recentes

- **Mar/2025** – UX pós-login ajustada: usuário permanece na tela hero até enviar primeira mensagem (controle `journeyStarted`).
- **Mar/2025** – Imports absolutos no backend e criação de `QwenClient`, evitando erros de import e centralizando integração com DashScope.
- **Mar/2025** – Prompts dos agentes migrados para arquivos dedicados; documentação revisada com setup detalhado, contratos de API e passos de operação.
- **Abr/2025** – Frontend sincronizado com layout refinado da pasta “Tela Inicial do App de IA”: novo componente `Sidebar` reutilizável, busca com padding ajustado, seções colapsáveis fechadas por padrão ao abrir o menu e eliminação do botão redundante “Nova Conversa”.

> Para detalhes finos, consulte o histórico do Git (`git log`) ou PRs correspondentes.
