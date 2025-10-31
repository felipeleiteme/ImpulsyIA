#!/bin/bash

# Script para iniciar o frontend e o backend simultaneamente
# Uso: ./start.sh

echo "🚀 Iniciando o projeto ImpulsyIA..."

# Verificar se estamos no diretório correto
if [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
  echo "❌ Erro: Diretórios frontend ou backend não encontrados."
  echo "Por favor, execute este script na raiz do projeto."
  exit 1
fi

# Garantir dependências do backend
echo "🧰 Verificando dependências do backend..."
pushd backend > /dev/null
if ! python3 -c "import uvicorn" >/dev/null 2>&1; then
  if [[ -f requirements.txt ]]; then
    echo "📦 Instalando dependências do backend (requirements.txt)..."
    python3 -m pip install -r requirements.txt
  else
    echo "⚠️  Aviso: requirements.txt não encontrado; continue apenas se já instalou as dependências manualmente."
  fi
fi
popd > /dev/null

# Garantir dependências do frontend
echo "🧰 Verificando dependências do frontend..."
pushd frontend > /dev/null
if [[ ! -x node_modules/.bin/vite ]]; then
  echo "📦 Instalando dependências do frontend (npm install)..."
  npm install
fi
popd > /dev/null

# Função para matar processos em uma porta específica
kill_port() {
  PORT=$1
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
}

# Parar qualquer processo nas portas 3000 e 8000
echo "🛑 Parando processos nas portas 3000 e 8000..."
kill_port 3000
kill_port 8000

# Iniciar o backend em segundo plano
echo "🔧 Iniciando o backend..."
cd backend
PYTHONPATH=src python3 -m src.main > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Iniciar o frontend em segundo plano
echo "🎨 Iniciando o frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Função para encerrar os processos quando o script for interrompido
cleanup() {
  echo -e "\n🛑 Encerrando os processos..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 0
}

# Registrar a função de cleanup para quando o script for interrompido
trap cleanup SIGINT SIGTERM

echo "✅ Serviços iniciados!"
echo "🌐 Frontend: http://localhost:3000 (ou próxima porta disponível)"
echo "💻 Backend: http://localhost:8000"
echo "📄 Logs:"
echo "   Frontend: frontend.log"
echo "   Backend: backend.log"
echo ""
echo "Pressione Ctrl+C para encerrar ambos os serviços"

# Esperar pelos processos em segundo plano
wait $BACKEND_PID $FRONTEND_PID
