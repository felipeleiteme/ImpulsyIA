# Manual de Processos ImpulsyIA

Documento operacional do monorepo. Ele explica como o Product Owner (PO) conduz o “Maestro de IAs” — combinando agentes de design, QA e código — para evoluir o projeto com segurança. Consulte em paralelo:

- `docs/ARQUITETURA_IA.md`: visão técnica, camadas e integrações.
- `docs/API_CONTRACT.md`: contratos que os fluxos de trabalho precisam respeitar.

---

## 1. O Manifesto — Orquestração de IAs

- **Papel do Maestro (humano/PO):** liderar o ciclo de produto e decidir o que precisa ser construído. Ele não escreve código diretamente; orquestra IAs especializadas.
- **IAs especializadas:**
  - **Figma Maker:** gera/atualiza layouts e entrega um changelog com arquivos de UI alterados.
  - **Loom + Narração Natural:** captura expectativas de negócio sem jargão técnico.
  - **Gemini (Nuvem):** age como engenheiro de QA, traduzindo critérios de aceite em prompts e testes automatizados.
  - **Codex CLI (Local):** executa merges cirúrgicos e implementa código seguindo instruções de alto nível.
- **Princípio central:** cada IA cuida de uma fase do fluxo. O humano garante contexto (arquitetura, contratos, dados sensíveis) e valida o resultado final.

---

## 2. Setup Inicial do Workflow (Executar Apenas Uma Vez)

### 2.1. Configurar o Ambiente de Testes (Vigia)

1. **Instalar dependências** (pasta `frontend/`):
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
2. **Configurar o Vite** (`frontend/vite.config.ts`):
   - Adicionar `/// <reference types="vitest" />` no topo.
   - Incluir o bloco `test`:
     ```ts
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/setupTests.ts',
     },
     ```
3. **Criar o setup global** (`frontend/src/setupTests.ts`):
   ```ts
   import '@testing-library/jest-dom';
   ```
4. **Atualizar scripts NPM** (`frontend/package.json`):
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "test": "vitest"
   }
   ```
5. **Rodar testes**:
   ```bash
   npm run test -- --run
   ```
   *(Falhará até existir algum arquivo `*.test.ts(x)` — comportamento esperado no setup.)*

### 2.2. Configurar a “Quarentena” do Figma

Adicionar ao final do `.gitignore` (raiz do projeto):
```
# Pasta temporária para atualizações do Figma
_figma_update/
```
Essa pasta fica fora do versionamento e recebe os ZIPs brutos exportados pelo Figma Maker.

---

## 3. Fluxo de Trabalho 1 — Atualização de UI (Merge Inteligente do Figma)

1. **PO solicita ao Figma Maker** o changelog com a lista de arquivos alterados.
2. **Baixar o ZIP** gerado pelo Figma.
3. **Preparar a quarentena:**
   - Garantir que `_figma_update/` exista na raiz (ou criar).
   - Limpar conteúdo anterior e descompactar o ZIP dentro de `_figma_update/`.
   - Estrutura esperada:
     ```
     impulsyia/
     ├── frontend/
     │   └── src/...
     └── _figma_update/
         └── frontend/
             └── src/...
     ```
4. **Executar o Codex CLI (local)** com o prompt:

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

5. **Validar e commitar**:
   - Revisar `git status`.
   - `npm run test -- --run` (garantir que o merge não quebrou regras de negócio cobertas).
   - `git add`, `git commit -m "Atualiza UI com base no Figma"`, `git push`.

---

## 4. Fluxo de Trabalho 2 — Criação de Features (Hack do Loom)

1. **Gravar o Loom (PO como narrador de negócio):**
   - Mostrar a tela existente ou um protótipo.
   - Descrever comportamento esperado em linguagem natural (Ex.: “O botão Entrar só habilita quando os campos estão preenchidos.”).
2. **Enviar o material ao Gemini (nuvem) com o prompt de tradução:**

   ```text
   Olá Gemini.

   Assista a este vídeo: [link_do_seu_video_loom]

   Analise meu repositório: [URL_do_seu_repo_github_impulsyia]

   Sua Tarefa (A "Tradução"): No vídeo, eu demonstro o comportamento que eu espero de uma feature (os "critérios de aceite"). Você deve atuar como um Engenheiro de QA Sênior.

   Seu Processo de Análise:

   Assista ao vídeo para entender a REGRA DE NEGÓCIO (ex: "O botão 'Entrar' só habilita quando os campos de e-mail e senha estão preenchidos").

   Leia o código-fonte correspondente no repositório (ex: frontend/src/components/LoginPage.tsx) e consulte docs/API_CONTRACT.md para mapear data-testids e integridades de API.

   Conecte a regra de negócio (do vídeo) com os data-testids (do código).

   Gere 2 Saídas:

   SAÍDA 1 (Prompt do Codex): O prompt perfeito para meu Codex CLI local implementar a lógica da feature.

   SAÍDA 2 (Código de Teste): O código de teste completo (Vitest + React Testing Library) que automatiza a regra de negócio que eu demonstrei. O teste deve usar os data-testids que você encontrou no código.
   ```

3. **Aplicar as saídas do Gemini:**
   - **Prompt do Codex:** usado no Codex CLI (local) para gerar/ajustar a feature.
   - **Código de Teste:** criar arquivo em `frontend/src/.../*.test.tsx` com o conteúdo fornecido.
4. **Executar ciclo TDD (RED → GREEN):**
   - Rodar `npm test` e observar a falha inicial (RED).
   - Rodar o prompt do Codex para implementar a lógica.
   - Rodar `npm test` novamente até o teste passar (GREEN).
   - Refatorar se necessário, mantendo cobertura.

---

## 5. Fluxo de Trabalho 3 — Testes e Rede de Segurança (O Vigia)

- **Sem retro cobrir tudo de uma vez:** priorizar velocidade de entrega.
- **Blindagem do caminho crítico:** criar testes retroativos imediatamente para:
  1. Login e autenticação.
  2. Carregamento/listagem de agentes.
  3. Envio de mensagem e resposta do chat.
- **Regra do Bom Escoteiro:** sempre que criar uma feature nova ou tocar em código existente, aplique o Fluxo 2 (Loom → Gemini → teste → Codex). Não mergear sem teste correspondente.
- **Vigia de Regressão:** após qualquer Merge Inteligente (Fluxo 1), rodar `npm run test -- --run` para verificar se a nova UI preservou as regras de negócio cobertas pelos testes.
- **Manutenção contínua:** atualizar `docs/ARQUITETURA_IA.md` e `docs/PROCESSOS.md` sempre que novos fluxos forem definidos ou quando o caminho crítico mudar.

---

## 6. Referências Rápidas

- **Arquitetura:** `docs/ARQUITETURA_IA.md`
- **Contratos de API:** `docs/API_CONTRACT.md`
- **Setup de testes:** `frontend/vite.config.ts`, `frontend/package.json`, `frontend/src/setupTests.ts`
- **Prompt Merge Figma:** Seção 3 deste manual
- **Prompt QA (Gemini):** Seção 4 deste manual

> Siga estas orquestrações para manter o monorepo sincronizado, testável e pronto para evoluções rápidas guiadas por IA.
