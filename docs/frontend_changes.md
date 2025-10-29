# Frontend Changes Documentation

This document details all changes made to the frontend during the frontend-backend integration process.

## 1. Configuration Changes

### 1.1 `vite.config.ts`

**Purpose**: Added proxy configuration to enable API requests to the backend during development.

**Changes Made**:
- Added a `proxy` configuration under the `server` object
- Configured all `/api/*` requests to be forwarded to `http://localhost:8000` (backend server)
- Set `changeOrigin: true` to modify the host header to match the target
- Set `secure: false` to allow connections to non-verified HTTPS servers (useful in development)

**Before**:
```typescript
server: {
  port: 3000,
  open: true,
},
```

**After**:
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

## 2. API Integration Changes

### 2.1 `src/App.tsx`

**Purpose**: Replaced simulated API calls with real backend API calls.

#### 2.1.1 Login Function (`handleLogin`)

**Changes Made**:
- Converted from a simulated function to an async function
- Added actual API call to `/api/auth/token` endpoint
- Implemented proper error handling
- Added request headers with Content-Type
- Added response handling with JSON parsing

**Before**:
```typescript
const handleLogin = (email: string, password: string) => {
  // Simular autenticação - em produção, fazer chamada API real
  console.log('Login com:', email);
  setIsAuthenticated(true);
  setShowSignUp(false);
};
```

**After**:
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    // Chamada API real para autenticação
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login bem-sucedido:', data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no login:', response.status);
      // Tratar erro de login
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    // Tratar erro de rede
  }
};
```

#### 2.1.2 Signup Function (`handleSignUp`)

**Changes Made**:
- Converted from a simulated function to an async function
- Added actual API call to `/api/auth/token` endpoint
- Implemented proper error handling
- Added request headers with Content-Type

**Before**:
```typescript
const handleSignUp = (name: string, email: string, password: string) => {
  // Simular criação de conta - em produção, fazer chamada API real
  console.log('Criando conta para:', name, email);
  setIsAuthenticated(true);
  setShowSignUp(false);
};
```

**After**:
```typescript
const handleSignUp = async (name: string, email: string, password: string) => {
  try {
    // Chamada API real para criação de conta
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Ajuste dependendo da implementação real
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Cadastro bem-sucedido:', data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no cadastro:', response.status);
      // Tratar erro de cadastro
    }
  } catch (error) {
    console.error('Erro na requisição de cadastro:', error);
    // Tratar erro de rede
  }
};
```

#### 2.1.3 Chat Message Function (`handleSendMessage`)

**Changes Made**:
- Converted from a simulated function with timeout to an async function with actual API call
- Added actual API call to `/api/chat/stream` endpoint
- Implemented proper error handling
- Added request headers with Content-Type
- Added response handling with JSON parsing

**Before**:
```typescript
const handleSendMessage = () => {
  if (message.trim()) {
    setMessages([...messages, {
      id: messages.length + 1,
      type: 'user',
      content: message,
    }]);
    setMessage('');
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'assistant',
        content: 'Entendi. Vamos explorar isso juntos. Você já tentou algo antes nessa área? O que funcionou e o que não funcionou?',
      }]);
    }, 2000);
  }
};
```

**After**:
```typescript
const handleSendMessage = async () => {
  if (message.trim()) {
    setMessages([...messages, {
      id: messages.length + 1,
      type: 'user',
      content: message,
    }]);
    setMessage('');
    setIsThinking(true);
    
    try {
      // Chamada API real para enviar mensagem e receber resposta do assistente
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: data.message || 'Resposta do assistente',
        }]);
      } else {
        console.error('Falha ao enviar mensagem:', response.status);
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        }]);
      }
    } catch (error) {
      console.error('Erro na requisição de mensagem:', error);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro de conexão.',
      }]);
    }
  }
};
```

## 3. Additional Changes

### 3.1 Dependencies

The following development dependencies were added to support proper frontend functionality:

- `autoprefixer`
- `postcss` 
- `tailwindcss`

## 4. Service Architecture Changes

### 4.1 API Service Module (`src/services/api.ts`)

**Purpose**: Centralized API service to isolate all backend communication logic.

**Changes Made**:
- Created a new `services` directory
- Created `api.ts` file with organized API functions by domain
- Implemented standardized response format with success/error handling
- Created separate service objects for different API domains (auth, chat, payments)

**Implementation Details**:
- Defined a generic `ApiResponse<T>` interface for consistent responses
- Created `authAPI` object with `login` and `signup` functions
- Created `chatAPI` object with `sendMessage` function
- Created `paymentsAPI` object with `webhook` function
- Used the proxy configuration from `vite.config.ts` to target `/api` endpoints

### 4.2 Module Import Updates (`src/App.tsx`)

**Changes Made**:
- Added import for the new API services: `import { authAPI, chatAPI } from './services/api';`
- Updated all API call functions to use the centralized services instead of direct fetch calls

#### 4.2.1 Login Function Update

**Before**:
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login bem-sucedido:', data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no login:', response.status);
      // Tratar erro de login
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    // Tratar erro de rede
  }
};
```

**After**:
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await authAPI.login(email, password);
    
    if (result.success) {
      console.log('Login bem-sucedido:', result.data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no login:', result.error);
      // Tratar erro de login de forma mais específica
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    // Tratar erro de rede
  }
};
```

#### 4.2.2 Signup Function Update

**Before**:
```typescript
const handleSignUp = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Cadastro bem-sucedido:', data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no cadastro:', response.status);
      // Tratar erro de cadastro
    }
  } catch (error) {
    console.error('Erro na requisição de cadastro:', error);
    // Tratar erro de rede
  }
};
```

**After**:
```typescript
const handleSignUp = async (name: string, email: string, password: string) => {
  try {
    const result = await authAPI.signup(name, email, password);
    
    if (result.success) {
      console.log('Cadastro bem-sucedido:', result.data);
      setIsAuthenticated(true);
      setShowSignUp(false);
    } else {
      console.error('Falha no cadastro:', result.error);
      // Tratar erro de cadastro de forma mais específica
    }
  } catch (error) {
    console.error('Erro na requisição de cadastro:', error);
    // Tratar erro de rede
  }
};
```

#### 4.2.3 Chat Message Function Update

**Before**:
```typescript
const handleSendMessage = async () => {
  if (message.trim()) {
    setMessages([...messages, {
      id: messages.length + 1,
      type: 'user',
      content: message,
    }]);
    setMessage('');
    setIsThinking(true);
    
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: data.message || 'Resposta do assistente',
        }]);
      } else {
        console.error('Falha ao enviar mensagem:', response.status);
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        }]);
      }
    } catch (error) {
      console.error('Erro na requisição de mensagem:', error);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro de conexão.',
      }]);
    }
  }
};
```

**After**:
```typescript
const handleSendMessage = async () => {
  if (message.trim()) {
    setMessages([...messages, {
      id: messages.length + 1,
      type: 'user',
      content: message,
    }]);
    setMessage('');
    setIsThinking(true);
    
    try {
      const result = await chatAPI.sendMessage(message);
      
      if (result.success) {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: result.data?.message || 'Resposta do assistente',
        }]);
      } else {
        console.error('Falha ao enviar mensagem:', result.error);
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        }]);
      }
    } catch (error) {
      console.error('Erro na requisição de mensagem:', error);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro de conexão.',
      }]);
    }
  }
};
```

## 5. Integration Strategy Summary

The integration approach was designed to:
- Minimize changes to existing frontend code
- Enable seamless communication between frontend and backend during development
- Maintain the existing UI and functionality while implementing real API calls
- Use a proxy-based approach that mirrors how the application would be deployed in production
- Organize API calls into centralized service modules for better maintainability

## 6. Running the Integrated Application

After these changes:
1. **Backend**: Runs on `http://localhost:8000`
2. **Frontend**: Runs on `http://localhost:3000` with the proxy configured to forward API requests to the backend

This setup allows the frontend to communicate with the backend using the same `/api/*` endpoints, making the transition from development to production deployment straightforward.

## 7. Startup Script

A convenient startup script (`start.sh`) has been added to simplify running both frontend and backend simultaneously:

```bash
./start.sh
```

This script will:
- Start the backend server on port 8000
- Start the frontend server on port 3000 (or next available port)
- Automatically handle the integration between frontend and backend
- Display logs for both services
- Gracefully shut down both services when interrupted with Ctrl+C