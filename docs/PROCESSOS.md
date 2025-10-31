# 📖 Manual de Operações: Processos de Orquestração ImpulsyIA

Este documento é o "Manual de Operações" vivo do projeto. Ele descreve *COMO* o projeto evolui, enquanto o `ARQUITETURA_IA.md` descreve *O QUE* o projeto é.

## 1. O Manifesto: Orquestração de IAs

Nossa filosofia de desenvolvimento é a de um "Maestro de IA". O desenvolvedor humano atua como Product Owner (PO) e Arquiteto, orquestrando um time de IAs especializadas:

* **Figma Maker:** Gera o "rascunho" da UI e dos componentes visuais.
* **Gemini (Nuvem):** Atua como "Engenheiro de QA Sênior" e "Planejador". Ele analisa o Loom (a visão do PO) e o Git (o estado do código) para criar planos de ação.
* **Codex CLI (Local):** Atua como "Desenvolvedor Júnior" (Dev). Ele executa os planos (prompts) gerados pelo Gemini para escrever e modificar o código localmente.
* **Vitest (Vigia):** Atua como a "Rede de Segurança" automatizada que garante que os Devs (IA ou humano) não quebrem regras de negócio antigas.

## 2. Setup Inicial do Workflow (Executar 1 Vez)

Para habilitar este fluxo, duas configurações são necessárias:

### 2.1. Configurar o Ambiente de Teste (Vigia)

1.  **Instalar dependências (na pasta `frontend/`):**
    ```bash
    npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
    ```
2.  **Configurar o `vite.config.ts`:**
    Adicionar `/// <reference types="vitest" />` no topo e o bloco `test: { ... }`.
3.  **Criar Setup de Testes:**
    Criar o arquivo `frontend/src/setupTests.ts` com o conteúdo: `import '@testing-library/jest-dom';`
4.  **Adicionar Script ao `package.json`:**
    Adicionar `"test": "vitest"` à seção `scripts`.

### 2.2. Configurar a "Quarentena" do Figma (AÇÃO PENDENTE)

1.  Abrir o arquivo `.gitignore` na raiz do projeto.
2.  Adicionar a seguinte linha ao final:
    ```
    # Pasta temporária para atualizações do Figma
    _figma_update/
    ```

## 3. Fluxo de Trabalho 1: Atualização de UI (Merge Inteligente)

Este fluxo é usado quando o design de um componente *existente* é alterado no Figma.

1.  **PO (Humano):** Pede ao Figma Maker o "changelog" (lista de arquivos alterados).
2.  **PO (Humano):** Baixa o ZIP e descompacta seu conteúdo na pasta `_figma_update/` (a "quarentena").
3.  **PO (Humano):** Executa o **Prompt do Codex CLI (Local)** (template abaixo) para fazer o merge cirúrgico.
4.  **Vigia (Auto):** PO roda `npm test` na pasta `frontend/` para garantir que a UI atualizada não quebrou nenhuma regra de negócio (Ver Fluxo 4).
5.  **PO (Humano):** Commita as mudanças no Git.

---
#### 📋 Template de Prompt: Merge Inteligente (Codex CLI Local)
Estou na raiz do meu projeto impulsyia.

Acabei de baixar as atualizações do Figma na pasta _figma_update/.

O Figma me informou que alterou os seguintes arquivos: [Cole o changelog do Figma aqui].

Sua Tarefa: Faça o merge cirúrgico, copiando e sobrescrevendo APENAS os arquivos de UI mencionados no changelog da pasta _figma_update/frontend/ para a minha pasta frontend/.

REGRAS DE PROTEÇÃO (CRÍTICO):

NÃO sobrescreva, em hipótese alguma, arquivos como vite.config.ts, package.json ou tailwind.config.js.

NÃO toque na minha pasta de serviços frontend/src/services/.

Apenas copie os componentes de UI (como frontend/src/components/ui/card.tsx ou frontend/src/components/LoginPage.tsx) que o Figma alterou.

---

## 4. Fluxo de Trabalho 2: Criação de Features (Hack do Loom)

Este fluxo é usado para criar *novas* funcionalidades ou corrigir bugs.

1.  **PO (Humano):** Grava um vídeo curto no Loom. A narração é em **linguagem de negócio** (alto nível), demonstrando o comportamento esperado. (Ex: "Olha, o botão de login está apagado. Agora eu digito... e ele acende. É isso que eu quero.").
2.  **PO (Humano):** Envia o link do Loom e a URL do Git para a **IA da Nuvem (Gemini)** usando o "Prompt de Tradução".
3.  **Gemini (Nuvem):** Atua como QA Sênior. Ele assiste ao vídeo, lê o código-fonte (ex: `LoginPage.tsx`) e o `API_CONTRACT.md` para conectar os `data-testid`s à regra de negócio.
4.  **Gemini (Nuvem):** Gera duas saídas: "Prompt para Codex" (a feature) e "Código de Teste (Vitest)" (o vigia).
5.  **PO (Humano):** Cria o arquivo de teste (ex: `feature.test.tsx`) e cola o "Código de Teste".
6.  **PO (Humano):** Roda `npm test`. O teste falha (RED).
7.  **PO (Humano):** Entrega o "Prompt para Codex" ao **Codex CLI (Local)** para implementar a feature.
8.  **PO (Humano):** Roda `npm test` novamente. O teste passa (GREEN).
9.  **PO (Humano):** Commita a nova feature + seu teste de vigia.

---
#### 📋 Template de Prompt: Tradução PO -> QA (Gemini Nuvem)
Olá Gemini.

Assista a este vídeo: [link_do_seu_video_loom]

Analise meu repositório: [URL_do_seu_repo_github_impulsyia]

Sua Tarefa (A "Tradução"): No vídeo, eu demonstro o comportamento que eu espero de uma feature (os "critérios de aceite"). Você deve atuar como um Engenheiro de QA Sênior.

Seu Processo de Análise:

Assista ao vídeo para entender a REGRA DE NEGÓCIO (ex: "O botão 'Entrar' só habilita quando os campos de e-mail e senha estão preenchidos").

Leia o código-fonte correspondente no repositório (ex: frontend/src/components/LoginPage.tsx) para encontrar os data-testids dos elementos que eu interagi.

Conecte a regra de negócio (do vídeo) com os data-testids (do código) e as regras do docs/API_CONTRACT.md.

Gere 2 Saídas:

SAÍDA 1 (Prompt do Codex): O prompt perfeito para meu Codex CLI local implementar a lógica da feature.

SAÍDA 2 (Código de Teste): O código de teste completo (Vitest + React Testing Library) que automatiza a regra de negócio que eu demonstrei. O teste deve usar os data-testids que você encontrou no código.

---

## 5. Fluxo de Trabalho 3: DevOps de Prompt (Infraestrutura)

Este fluxo transforma o código em um app "deployável", gerando a infraestrutura como código (IaC) e o pipeline de deploy.

1.  **Geração dos Artefatos (IA):** O PO usa um prompt de "DevOps Sênior" para instruir a IA a gerar os seguintes arquivos (com base na infraestrutura alvo, ex: Oracle Cloud):
    * `backend/Dockerfile`: Containeriza a API FastAPI.
    * `frontend/Dockerfile`: Containeriza o app Vite/React e o serve com Nginx.
    * `frontend/nginx.conf`: Configuração do Nginx para servir os arquivos estáticos e fazer o proxy reverso de `/api` para `http://backend:8000`.
    * `docker-compose.yml`: Orquestra os serviços `frontend` e `backend` para testes locais e deploy.
    * `.github/workflows/deploy-oci.yml`: Pipeline de CI/CD para o GitHub Actions que faz o deploy automático na Oracle Cloud Infrastructure (OCI).

2.  **Teste de Fumaça (Local):**
    * Antes de configurar a nuvem, o PO deve rodar `docker-compose up --build` na raiz do projeto.
    * Isso constrói as imagens e sobe os contêineres localmente.
    * O PO deve acessar `http://localhost:3000` e validar que o app funciona (incluindo as chamadas de API para o backend).

3.  **Configuração de Deploy (Manual - 1 Vez):**
    * **Na Oracle Cloud (OCI):**
        * Criar dois repositórios no Container Registry (OCIR) (ex: `impulsyia/backend`, `impulsyia/frontend`).
        * Gerar um `Auth Token` (será o `OCI_TOKEN`).
        * Na Instância Compute: Instalar Docker, Docker Compose e clonar o repositório Git (ex: em `/home/ubuntu/impulsyia`).
    * **No GitHub Secrets:**
        * Preencher `OCI_USER`, `OCI_TOKEN`, `OCI_REGISTRY_URL`.
        * Preencher `OCI_SSH_HOST`, `OCI_SSH_USER`, `OCI_SSH_KEY` (chave privada).
        * Preencher `REMOTE_APP_DIR` (caminho do app na instância, ex: `/home/ubuntu/impulsyia`).

4.  **Deploy Contínuo (Automático):**
    * Qualquer `git push` para a branch `main` agora dispara o workflow `.github/workflows/deploy-oci.yml`.
    * O workflow constrói as imagens, envia ao OCIR, conecta-se via SSH à instância Oracle e executa `docker compose pull && docker compose up -d` para atualizar a aplicação no ar.

### 5.1. Executor Local (Docker Compose)

Use este checklist sempre que precisar recriar o ambiente local com contêineres.

1. **Build e subida:**  
   ```bash
   docker-compose up --build -d
   ```
   Constrói as imagens (`impulsyia/backend`, `impulsyia/frontend`) e sobe os containers `impulsyia-backend-1` e `impulsyia-frontend-1`.

2. **Checar status:**  
   ```bash
   docker-compose ps
   ```
   Confirme ambos como `Up` e as portas mapeadas (`8000->8000`, `3000->80`).

3. **Smoke tests:**  
   ```bash
   curl http://localhost:8000/
   curl http://localhost:3000/api/agents/
   ```
   O primeiro deve retornar `{"status":"ok","message":"ImpulsyIA API is running"}`. O segundo garante que o Nginx em `frontend/nginx.conf` está roteando `/api` para o backend.

4. **Testar interface:** Abra `http://localhost:3000` no navegador. Um 404 em `http://localhost:3000/api/` é esperado (não há rota na raiz).

5. **Encerrar ambiente:**  
   ```bash
   docker-compose down
   ```
   Remove containers e a rede criada.

## 6. Estratégia de Testes (A Rede de Segurança)

Não vamos parar o projeto para criar testes para todo o código legado. Usaremos uma abordagem híbrida:

1.  **Daqui para frente (Obrigatório):**
    Toda nova feature ou correção de bug *deve* usar o **Fluxo 2 (Hack do Loom)** e nascer com seu próprio teste de vigia.

2.  **Blindar o "Caminho Crítico" (Retroativo Imediato):**
    Devemos criar testes retroativos *imediatamente* para as 3 funções mais vitais do app:
    * **Teste de Login:** (Valida `LoginPage.tsx`)
    * **Teste de Carregamento de Agentes:** (Valida `agentsAPI.list` em `App.tsx`)
    * **Teste de Envio de Mensagem:** (Valida `data-testid="chat-input"` e `agentsAPI.chat`)

3.  **Regra do Bom Escoteiro (Oportunista):**
    Se você precisar modificar um arquivo antigo que *não* tem teste (ex: `ProfilePage.tsx`), você deve:
    * **Antes** de modificar, usar o **Fluxo 2** para criar um teste que valida o comportamento *atual*.
    * Rodar `npm test` para ver o teste passar (GREEN).
    * Implementar sua nova feature ou correção de bug (o teste vai quebrar - RED).
    * Ajustar o teste para refletir o novo comportamento (GREEN).
    * Committar o código e o teste. (Você deixou o local mais limpo do que encontrou).
