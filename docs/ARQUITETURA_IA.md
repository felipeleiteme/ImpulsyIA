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
| Testes Frontend          | Vitest, @testing-library/react, @testing-library/jest-dom, jsdom | `frontend/vite.config.ts`, `frontend/src/setupTests.ts`, `frontend/package.json` |
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

### Testes do Frontend

- Ambiente habilitado com Vitest e Testing Library (`npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`).
- Configuração central em `frontend/vite.config.ts` (`test.globals`, `environment: 'jsdom'`, `setupFiles`).
- Arquivo de setup `frontend/src/setupTests.ts` importa `@testing-library/jest-dom`.
- Execute `npm run test -- --run` para rodar a suíte no terminal (é necessário ter arquivos `*.test.ts(x)` ou `*.spec.ts(x)`).

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

## 9. API_CONTRACT.md (Fonte da Verdade)

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
- **Abr/2025** – Ambiente de testes do frontend padronizado com Vitest + Testing Library; script `npm run test` disponível e setup global documentado.

> Para detalhes finos, consulte o histórico do Git (`git log`) ou PRs correspondentes.
