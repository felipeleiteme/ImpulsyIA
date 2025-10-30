// src/services/api.ts
// Centralized API service for all backend communications

import { supabase } from './supabase';

const API_BASE_URL = '/api'; // Using the proxy configured in vite.config.ts

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const withAuthHeaders = async (
  baseHeaders: Record<string, string> = {},
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...baseHeaders,
  };

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Unable to retrieve Supabase session for auth headers', error);
  }

  return headers;
};

// Authentication API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          error: `Login failed: ${response.status}`,
          message: result?.detail || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Unable to connect to the server'
      };
    }
  },

  signup: async (name: string, email: string, password: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> => {
    try {
      // Note: This is a placeholder - adjust based on actual backend signup endpoint
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Signup successful'
        };
      } else {
        return {
          success: false,
          error: `Signup failed: ${response.status}`,
          message: result?.detail || 'Signup failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Unable to connect to the server'
      };
    }
  },
};

// Chat API functions
export const chatAPI = {
  sendMessage: async (message: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: await withAuthHeaders(),
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Message sent successfully'
        };
      } else {
        return {
          success: false,
          error: `Failed to send message: ${response.status}`,
          message: result?.detail || 'Failed to send message'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Unable to connect to the server'
      };
    }
  },
};

// Payments API functions
type AgentRole = 'assistant' | 'user' | 'system';

interface AgentSummary {
  id: string;
  name: string;
  description: string;
}

interface AgentChatMessage {
  role: AgentRole;
  content: string;
}

interface AgentChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AgentChatResponsePayload {
  agent_id: string;
  agent_name: string;
  model: string;
  message: string;
  usage?: Record<string, unknown>;
}

export const agentsAPI = {
  list: async (): Promise<ApiResponse<AgentSummary[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: 'GET',
        headers: await withAuthHeaders(),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Agentes carregados com sucesso',
        };
      }

      return {
        success: false,
        error: `Falha ao carregar agentes: ${response.status}`,
        message: result?.detail || 'Não foi possível carregar os agentes',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede',
        message: 'Não foi possível conectar ao servidor',
      };
    }
  },
  chat: async (
    agentId: string,
    messages: AgentChatMessage[],
    options: AgentChatOptions = {}
  ): Promise<ApiResponse<AgentChatResponsePayload>> => {
    try {
      const payload = {
        messages,
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      };

      const response = await fetch(`${API_BASE_URL}/agents/${agentId}/chat`, {
        method: 'POST',
        headers: await withAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Mensagem processada com sucesso',
        };
      }

      return {
        success: false,
        error: `Falha ao enviar mensagem: ${response.status}`,
        message: result?.detail || 'Não foi possível processar a mensagem',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede',
        message: 'Não foi possível conectar ao servidor',
      };
    }
  },
};

export const paymentsAPI = {
  webhook: async (data: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/webhook`, {
        method: 'POST',
        headers: await withAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result,
          message: 'Webhook processed successfully'
        };
      } else {
        return {
          success: false,
          error: `Failed to process webhook: ${response.status}`,
          message: result?.detail || 'Failed to process webhook'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        message: 'Unable to connect to the server'
      };
    }
  },
};
