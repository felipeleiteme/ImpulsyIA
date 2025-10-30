# API_CONTRACT

Fonte da verdade entre as interações do frontend (React) e a API do backend (FastAPI) do projeto ImpulsyIA.

## Convenções de `data-testid`

- `data-testid` propostos aqui devem ser adicionados aos elementos interativos correspondentes (inputs, botões, formulários) para garantir rastreabilidade entre UI ↔️ contrato.
- Quando indicado `-- (auto)`, a chamada ocorre por efeito de código após uma mudança de estado (ex.: usuário autenticado) e não há elemento interativo associado.

## 1. API ImpulsyIA (FastAPI)

### 1.1 Fluxos implementados (frontend consumindo backend)

| Intenção | Seletor de UI (data-testid) | Função/Endpoint do Back-end | Payload (Input) | Retorno (Output) |
| :--- | :--- | :--- | :--- | :--- |
| Carregar catálogo de agentes assim que o usuário autenticado entra na aplicação | `-- (auto pós-login)` | `agentsAPI.list()` → `GET /api/agents` | Cabeçalhos: `Content-Type: application/json`. Corpo vazio. | `200 OK` → lista de `AgentSummary` (`[{ id: string, name: string, description: string }]`). Em caso de falha, backend retorna `4xx/5xx` com `{"detail": "..."};` frontend exibe toast de erro. |
| Enviar mensagem a um agente (tela hero ou chat ativo) | `chat-input` (Input), `chat-send-button` (Button) | `agentsAPI.chat(agentId, messages)` → `POST /api/agents/{agent_id}/chat` | `Body` (JSON): `{ "messages": AgentMessage[], "model"?: string, "temperature"?: number (0.0–1.5), "max_tokens"?: number }`. `AgentMessage = { role: "user" \| "assistant" \| "system", content: string }`. Frontend monta `messages` usando histórico local; campos opcionais só são enviados se definidos. | `200 OK` → `AgentChatResponse` (`{ agent_id, agent_name, model, message, usage? }`). Erros esperados: `401` (quando header `Authorization` estiver ativo), `404` para agente inexistente, `500` para falha na Qwen. Frontend trata falhas com toast e mensagem de fallback. |

### 1.2 Endpoints expostos mas ainda sem integração de UI

| Intenção | Seletor de UI (data-testid) | Função/Endpoint do Back-end | Payload (Input) | Retorno (Output) |
| :--- | :--- | :--- | :--- | :--- |
| Autenticar via backend (stub) | `-- (não exposto)` | `authAPI.login(email, password)` → `POST /api/auth/token` | `{ "email": string, "password": string }` | `200 OK` → `{ "access_token": "fake-jwt-token", "token_type": "bearer" }`. Implementar geração real de token quando fluxo for adotado. |
| Cadastrar via backend (stub, reutiliza login) | `-- (não exposto)` | `authAPI.signup(name, email, password)` → `POST /api/auth/token` | `{ "email": string, "password": string }` (campo `name` ignorado) | Mesmo retorno/fake token do login. |
| Streaming de chat genérico (stub) | `-- (não exposto)` | `chatAPI.sendMessage(message)` → `POST /api/chat/stream` | Cabeçalhos: `Authorization: Bearer <JWT Supabase>` é obrigatório (`Depends(get_current_user)`). Corpo: `{ "message": string }`. | `200 OK` → `{ "message": "Streaming response for user <id>" }`. Retorna `401` se token inválido/ausente. |
| Receber webhook de pagamentos | `-- (não exposto)` | `paymentsAPI.webhook(data)` → `POST /api/payments/webhook` | Corpo livre (stub) | `200 OK` → `{ "status": "received" }`. Implementar validação de assinatura quando integração real for necessária. |

**Notas de segurança**
- `backend/src/security/token.py` define `get_current_user`, que valida tokens JWT Supabase (`Authorization: Bearer <token>`). `POST /api/chat/stream` é a única rota que já aplica `Depends(get_current_user)`; avalie incluir a dependência também nas rotas de agentes para reforçar o controle de acesso.
- Se `SUPABASE_JWT_SECRET` não estiver definido, o backend responde `500` para rotas protegidas; configure via `.env`.

## 2. Autenticação (Cliente Supabase direto no frontend)

| Intenção | Seletor de UI (data-testid) | Função/Endpoint do Back-end | Payload (Input) | Retorno (Output) |
| :--- | :--- | :--- | :--- | :--- |
| Login com e-mail/senha | `login-email-input`, `login-password-input`, `login-submit-button` | `supabase.auth.signInWithPassword({ email, password })` | Campos capturados do formulário. | `data.session` contém tokens Supabase; listener `onAuthStateChange` em `App.tsx` atualiza UI. `error?.message` exibido via toast. |
| Login com Google | `login-google-button` | `supabase.auth.signInWithOAuth({ provider: "google" })` | Nenhum campo adicional; Supabase redireciona para OAuth. | Redirecionamento gerenciado pelo Supabase; `error?.message` exibido via toast. |
| Cadastro de novo usuário | `signup-name-input`, `signup-email-input`, `signup-password-input`, `signup-confirm-password-input`, `signup-submit-button` | `supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })` | Campos do formulário, com validações locais (senha ≥ 8, confirmação). | `data.user` criado; Supabase envia e-mail de confirmação. Mensagens de erro exibidas via toast. |
| Logout do usuário | `user-menu-logout-button` | `supabase.auth.signOut()` | — | Limpa sessão local; `App.tsx` reseta estado (`chats`, `agentSessions`, `isAuthenticated`). |
| Alterar senha a partir do perfil | `profile-change-password-button`, `profile-current-password-input`, `profile-new-password-input`, `profile-confirm-password-input`, `profile-change-password-submit` | Passo 1: `supabase.auth.signInWithPassword({ email, password: currentPassword })` para reautenticar. Passo 2: `supabase.auth.updateUser({ password: newPassword })`. | Captura senhas do modal; validações locais (não vazio, ≥ 8 chars, confirmação). | Sucesso → toast “Senha alterada com sucesso!” e fechamento do modal. Falhas exibem mensagem amigável. |

**Observações adicionais**
- `App.tsx` usa `supabase.auth.getSession()` e `onAuthStateChange` para sincronia de sessão; chamadas são automáticas (sem UI associada).
- Os `data-testid` listados já estão aplicados tanto na versão hero quanto na área de chat (mesmos inputs/ações reutilizam o estado `message`).
- `frontend/src/services/api.ts` agora anexa automaticamente `Authorization: Bearer <access_token_supabase>` em chamadas autenticadas (`agentsAPI`, `chatAPI`, `paymentsAPI`), reutilizando o token ativo fornecido pelo Supabase.
- Inicie o backend sempre a partir da pasta `backend/` com `PYTHONPATH=src` (ex.: `PYTHONPATH=src python3 -m uvicorn src.web.app:app --host 0.0.0.0 --port 8000`), caso contrário Python não encontra o pacote `src`.
- `SUPABASE_JWT_SECRET` e `DASHSCOPE_API_KEY` precisam estar preenchidos em `backend/.env`; se algum estiver vazio, `/api/agents/*` retorna `500` devido ao `QwenClient` recusar executar sem segredos válidos.
