# Inicialização do Projeto ImpulsyIA

Este documento descreve os passos para inicializar e executar o projeto ImpulsyIA (backend e frontend) em seu ambiente de desenvolvimento.

## Pré-requisitos

- Node.js (v14 ou superior)
- Python 3.9 ou superior
- npm (geralmente instalado com o Node.js)

## 1. Iniciar o Backend (API FastAPI)

1. **Navegue até o diretório do backend:**
   ```bash
   cd /Users/Felipe/Documents/Projetos/Agentes/ImpulsyIA/backend
   ```

2. **Instale as dependências do backend (se necessário):**
   ```bash
   python3 -m pip install -r requirements.txt
   ```
   *Nota: Se você encontrar problemas de permissão, pode usar `python3 -m pip install -r requirements.txt --user`*

3. **Crie o arquivo .env (se não existir):**
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor Uvicorn:**
   ```bash
   PYTHONPATH=src python3 -m uvicorn src.web.app:app --host 0.0.0.0 --port 8000
   ```

   O backend estará disponível em `http://localhost:8000`. Mantenha este terminal aberto.


   cd /Users/Felipe/Documents/Projetos/Agentes/ImpulsyIA/backend
  PYTHONPATH=src python3 -m uvicorn src.web.app:app --host 0.0.0.0 --port 8000
  

## 2. Iniciar o Frontend (Aplicação React com Vite)

1. **Abra um novo terminal.**

2. **Navegue até o diretório do frontend:**
   ```bash
   cd /Users/Felipe/Documents/Projetos/Agentes/ImpulsyIA/frontend
   ```

3. **Instale as dependências do frontend:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento do Vite:**
   ```bash
   npm run dev
   ```

   O frontend estará disponível em `http://localhost:3007` (ou a próxima porta disponível se 3000 estiver ocupada). Mantenha este terminal aberto.

## 3. Verificar a Integração (Teste "Olá do Backend")

Após iniciar ambos, backend e frontend:

1. Abra seu navegador e acesse o endereço do frontend (geralmente `http://localhost:3007`).
2. Você deverá ver a interface do ImpulsyIA.
3. As chamadas de API (como login, envio de mensagens de chat) devem funcionar corretamente, graças à configuração de proxy que encaminha as requisições `/api/*` do frontend para o backend.

## 4. Configuração de Proxy (Detalhes Técnicos)

- O arquivo `vite.config.ts` no frontend contém uma configuração de proxy que redireciona todas as requisições para `/api/*` para `http://localhost:8000` (onde o backend está rodando).
- O backend tem CORS configurado para permitir requisições do frontend.
- O frontend faz chamadas de API através do módulo centralizado em `src/services/api.ts`.

## 5. Solução de Problemas Comuns

### Porta 3000 indisponível:
- O Vite usará automaticamente a próxima porta disponível (ex: 3001, 3007, etc.)
- Verifique no terminal onde você iniciou o frontend qual porta está sendo usada

### Erros de dependências do Python:
- Certifique-se de ter o Python 3.9 ou superior
- Tente reinstalar as dependências com: `python3 -m pip install -r requirements.txt`

### Erros de dependências do Node.js:
- Certifique-se de ter o Node.js v14 ou superior
- Tente limpar o cache e reinstalar: 
  ```bash
  rm -rf node_modules
  npm install
  ```

Se tudo estiver configurado corretamente, a comunicação entre seu frontend e backend está funcionando!

## Merge Inteligente (Template de Prompt)

Use este template ao acionar o Codex CLI para aplicar atualizações vindas do Figma:

```text
Estou na raiz do meu projeto impulsyia.

Acabei de baixar as atualizações do Figma na pasta _figma_update/.

O Figma me informou que alterou os seguintes arquivos: [Cole o changelog do Figma aqui].

Sua Tarefa: Faça o merge cirúrgico, copiando e sobrescrevendo APENAS os arquivos de UI mencionados no changelog da pasta _figma_update/frontend/ para a minha pasta frontend/.

REGRAS DE PROTEÇÃO (CRÍTICO):

NÃO sobrescreva, em hipótese alguma, arquivos como vite.config.ts, package.json ou tailwind.config.js.

NÃO toque na minha pasta de serviços frontend/src/services/.

Apenas copie os componentes de UI (como frontend/src/components/ui/card.tsx ou frontend/src/components/LoginPage.tsx) que o Figma alterou.
```

## Configurar Ambiente de Testes do Frontend (Setup de 5 Minutos)

Execute estes passos uma única vez para habilitar o Vitest no projeto:

1. **Instale as dependências de teste** (na pasta `frontend/`):
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
   - `vitest`: framework de testes.
   - `@testing-library/react`: renderiza componentes e simula interações.
   - `@testing-library/jest-dom`: adiciona matchers como `.toBeInTheDocument()`.
   - `jsdom`: simula um ambiente de navegador no terminal.

2. **Atualize o Vite** (`frontend/vite.config.ts`) adicionando a referência do Vitest e o bloco de configuração:
   ```ts
   /// <reference types="vitest" />

   import { defineConfig } from 'vite';
   // ...

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/setupTests.ts',
     },
     // restante da configuração...
   });
   ```

3. **Crie o arquivo de setup** (`frontend/src/setupTests.ts`):
   ```ts
   import '@testing-library/jest-dom';
   ```

4. **Adicione o script de testes** (`frontend/package.json`):
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "test": "vitest"
   }
   ```

5. **Rodar os testes**:
   - Execute `npm run test -- --run` para rodar os testes em modo CLI.
   - Somente testes com sufixo `.test.tsx` ou `.spec.tsx` (ou `.ts`) serão detectados.
