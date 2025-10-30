# Arquitetura ImpulsyIA

Documento vivo que consolida stack, decisões, regras de negócio e estrutura de dados do projeto. Atualizar sempre que novos fluxos ou integrações forem adicionados.

---

## 1. Visão Geral

- Arquitetura cliente-servidor separando **frontend React/Vite** (`frontend/`) e **backend FastAPI** (`backend/`).
- Frontend consome a API via `fetch` centralizado (`frontend/src/services/api.ts`) e mantém estado no componente raiz `App.tsx`.
- Backend expõe REST endpoints (FastAPI + Uvicorn) e serve de orquestrador entre autenticação Supabase e o provedor LLM Qwen (DashScope).
- Execução local orquestrada por `./start.sh`, que inicia backend (porta 8000) e frontend (porta 3000 com proxy `/api`).

Fluxo alto nível:
```
Usuário ─► Frontend (React) ─► /api/* ─► Backend FastAPI ─► DashScope (Qwen)
                                                └─► Validação JWT com Supabase
```

---

## 2. Stack de Tecnologia

| Camada / Domínio        | Tecnologias principais                                                   | Referências chaves                                   |
|-------------------------|---------------------------------------------------------------------------|------------------------------------------------------|
| Frontend                | React 18, TypeScript, Vite, Tailwind, lucide-react                       | `frontend/src/App.tsx`, `frontend/src/components/`   |
| Estado & Serviços       | Hooks React (`useState`, `useEffect`, `useCallback`), `fetch` via API     | `frontend/src/services/api.ts`                       |
| Autenticação            | Supabase Auth (email/senha + OAuth)                                       | `frontend/src/services/supabase.ts`                  |
| Backend Web             | FastAPI, Uvicorn                                                          | `backend/src/web/app.py`, `backend/src/main.py`      |
| Segurança               | python-jose para validar JWT, OAuth2PasswordBearer                        | `backend/src/security/token.py`                      |
| IA / LLM                | Qwen (DashScope) via SDK OpenAI-compatible                                | `backend/src/llms/qwen_client.py`                    |
| Orquestração de agentes | Dataclasses + prompts estáticos                                           | `backend/src/agents/definitions.py` + `prompts/`     |
| Infra local             | Script `start.sh`, logs dedicados (`frontend.log`, `backend.log`)         | raiz do repositório                                  |

Variáveis sensíveis configuradas em `.env` (backend) e `.env` (frontend) carregadas via `dotenv` ou `import.meta.env`.

---

## 3. Decisões de Arquitetura

- **FastAPI particionado por routers** (`backend/src/web/routers/`): isolamento por domínio (auth, chat, payments, agents) facilita manutenção.
- **Imports absolutos no backend**: padronizados para execução com `PYTHONPATH=src` e evitar erros `attempted relative import`.
- **Qwen encapsulado em `QwenClient`**: valida API key ao instanciar e converte respostas do SDK para payload interno. Permite troca de provedor minimizando impacto.
- **Prompts versionados**: personas dos agentes ficam em textos (UTF-8) sob `backend/src/agents/prompts/`, carregados por `AgentDefinition`.
- **Estado de conversa client-side**: histórico por agente armazenado em `agentSessions` no frontend; backend permanece stateless.
- **Hero screen pós-login**: após autenticar, `journeyStarted` permanece `false` até o usuário enviar a primeira mensagem (UI hero em `frontend/src/App.tsx` linhas ~360-420). Decisão dá controle ao usuário sobre início da jornada.
- **Proxy Vite** (`frontend/vite.config.ts`): roteia `/api` para `http://localhost:8000`, eliminando CORS no desenvolvimento.
- **Supabase como fonte de verdade**: listener `supabase.auth.onAuthStateChange` mantém sincronismo de perfil e premium flag.

---

## 4. Regras de Negócio Centrais

- **Autenticação obrigatória**: qualquer interação com agentes requer sessão válida do Supabase; backend rejeita requisições sem JWT pelo middleware `get_current_user`.
- **Tela inicial obrigatória**: após login o usuário vê a hero page (texto “ImpulsyIA…”). A primeira ação deve ser digitar/enviar mensagem no CTA central.
- **Seleção de agentes**: lista de agentes vem de `/api/agents/`; cada agente possui `system_prompt` e `default_model` definidos em código.
- **Mensagens válidas**: backend aceita apenas roles `user`, `assistant` ou `system` com conteúdo não vazio (validação em `backend/src/agents/service.py`).
- **Reset de chat**: “Nova Conversa” limpa histórico local e mantém usuário na UI de chat, mas não altera prompts estáticos.
- **Pagamentos & Perfil**: páginas de perfil/assinatura/checkout são acessíveis via menu; estados controlados por `showProfile`, `showSubscription`, `showCheckout`.
- **Dependência das credenciais**: sem `SUPABASE_JWT_SECRET` ou `DASHSCOPE_API_KEY` configurados, backend aborta com erro explícito (segurança + feedback de configuração).

---

## 5. Esquema de Dados (Resumido)

### Backend

- `AgentDefinition` (dataclass):
  - `id`, `name`, `description`, `system_prompt`, `default_model`.
- `run_agent_chat` entrada:
  - `agent_id: str`
  - `messages: List[Dict[str, str]]` (`role`, `content`)
  - opções opcionais `model`, `temperature`, `max_tokens`.
- `run_agent_chat` saída:
  - `{ agent_id, agent_name, model, message, usage }`.
- `core/config.py`:
  - Lê `.env`: `SUPABASE_JWT_SECRET`, `DASHSCOPE_API_KEY`, `QWEN_BASE_URL`, `QWEN_MODEL_NAME`.
- Segurança:
  - `security/token.py` decodifica JWT Supabase (`payload['sub']` → `user_id`).
- Banco de dados próprio ainda não implementado; o módulo `database/connection.py` está reservado para usos futuros.

### Frontend

- `ConversationMessage`:
  - `id: string`, `type: 'assistant' | 'user'`, `content: string`.
- Estado:
  - `chats: AgentInfo[]` (id, name, description).
  - `agentSessions: Record<agentId, ConversationMessage[]>`.
  - `journeyStarted: boolean` define transição hero ↔ chat.
- API payloads (`frontend/src/services/api.ts`):
  - `agentsAPI.list()` → `[{ id, name, description }]`.
  - `agentsAPI.chat()` → `{ agent_id, agent_name, model, message, usage? }`.

---

## 6. Fluxos Principais

1. **Login**
   - `LoginPage` chama `supabase.auth.signInWithPassword`.
   - Listener sincroniza estado, popula `userProfile` e `isPremium`, mantém usuário na hero page.
2. **Listagem de agentes**
   - `loadAgents` é executado quando autenticado; popula `chats` e prepara mensagens introdutórias (apenas em memória).
3. **Primeira mensagem**
   - Usuário digita no CTA hero, `handleSendMessage` cria mensagem `user`, seta `journeyStarted=true` e consulta `/api/agents/{id}/chat`.
   - Backend injeta system prompt, chama Qwen, retorna resposta agregada ao chat.
4. **Segurança**
   - Endpoint `/api/agents/{agent_id}/chat` exige `Authorization: Bearer <jwt Supabase>`.
   - Token inválido → 401 via `get_current_user`.
5. **Pagamentos / Perfil**
   - Rotas de UI apenas, sem backend efetivo; hook de navegação altera `showProfile`, `showSubscription`, `showCheckout`.

---

## 7. Integração e Infraestrutura

- **Proxy Vite**: `/api` redirecionado para `http://localhost:8000` (config padrão no `server.proxy`).
- **CORS**: `CORSMiddleware` libera tudo em desenvolvimento; em produção restringir a domínios confiáveis.
- **Script de inicialização**: `./start.sh` mata processos nas portas 3000/8000, inicia backend (`PYTHONPATH=src python3 -m src.main`) e frontend (`npm run dev`), direcionando logs para arquivos na raiz.
- **Ambiente**:
  - Backend `.env` (não versionado com credenciais reais):
    ```
    SUPABASE_JWT_SECRET="..."
    DASHSCOPE_API_KEY="..."
    QWEN_MODEL_NAME="qwen-plus"
    QWEN_BASE_URL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    ```
  - Frontend `.env` (chaves públicas Supabase):
    ```
    VITE_SUPABASE_URL="..."
    VITE_SUPABASE_ANON_KEY="..."
    ```
- **Logs**:
  - `backend.log` e `frontend.log` úteis para diagnóstico pós-execução do script.

---

## 8. Observabilidade & Qualidade

- Backend: Uvicorn fornece access logs. Em caso de erro, stacktrace aparece no console e em `backend.log`.
- Frontend: erros capturados com `console.error` e exibidos ao usuário via `toast` (biblioteca `sonner`).
- Recomendações futuras:
  - Persistir uso do Qwen (`response.usage`) para métricas.
  - Adicionar testes automatizados para serviços e componentes críticos.
  - Instrumentar monitoramento/telemetria (ex.: Sentry, Supabase logs).

---

## 9. Próximas Evoluções Sugeridas

- Implementar armazenamento de conversas ou resumo no Supabase/Postgres.
- Completar fluxo real de pagamentos (atualmente stub em `backend/src/web/routers/payments.py`).
- Tratar limites de taxa (módulo `backend/src/limits/`) e governança de custos DashScope.
- Endurecer segurança para produção (HTTPS, CORS restrito, rotação de segredos).
- Criar testes fim-a-fim cobrindo login → envio de mensagem → recebimento de resposta.

---

> **Histórico recente**: correção dos imports backend para evitar erros de módulo, configuração definitiva do `.env` com credenciais DashScope e alteração de UX pós-login (usuário permanece na hero até enviar primeira mensagem).
