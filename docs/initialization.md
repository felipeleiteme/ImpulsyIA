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