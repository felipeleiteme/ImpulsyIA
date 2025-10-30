import logging
from typing import Any, Dict, List, Optional

from .definitions import AgentDefinition, get_agent
from llms.qwen_client import QwenClient


logger = logging.getLogger(__name__)


def build_agent_messages(agent: AgentDefinition, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Insert the agent system prompt before the user/assistant history."""
    compiled: List[Dict[str, str]] = [{"role": "system", "content": agent.system_prompt}]

    for message in messages:
        role = message.get("role")
        content = message.get("content")
        if role not in {"user", "assistant", "system"}:
            raise ValueError(f"Unsupported role '{role}'. Use 'user', 'assistant' or 'system'.")
        if not content:
            raise ValueError("Message content must not be empty.")
        compiled.append({"role": role, "content": content})

    return compiled


def _extract_latest_user_message(messages: List[Dict[str, str]]) -> str:
    """Return the content of the last user message, if any."""
    for message in reversed(messages):
        if message.get("role") == "user":
            return (message.get("content") or "").strip()
    return ""


def _build_fallback_response(
    agent: AgentDefinition,
    messages: List[Dict[str, str]],
    error: Exception,
) -> Dict[str, Any]:
    """Create a deterministic offline response when the upstream LLM is unavailable."""
    latest_user_message = _extract_latest_user_message(messages)
    fallback_text = (
        f"Ola! Eu sou {agent.name}. O servico de IA esta temporariamente indisponivel, "
        "entao vou deixar uma orientacao inicial baseada no meu papel.\n\n"
    )

    if latest_user_message:
        fallback_text += f"Anotei o que voce compartilhou: {latest_user_message}\n\n"

    fallback_text += (
        "Sugestao: registre os pontos principais, organize as suas duvidas e, quando o assistente voltar, "
        "retomaremos a conversa a partir daqui. Se o problema persistir, verifique as configuracoes da chave "
        "DASHSCOPE_API_KEY ou a conexao com o endpoint configurado."
    )

    return {
        "agent_id": agent.id,
        "agent_name": agent.name,
        "model": "offline-fallback",
        "message": fallback_text,
        "usage": {"fallback": True, "reason": str(error)},
    }


def run_agent_chat(
    agent_id: str,
    messages: List[Dict[str, str]],
    *,
    model: Optional[str] = None,
    temperature: float = 0.5,
    max_tokens: Optional[int] = None,
) -> Dict[str, Any]:
    """Generate a response from the requested agent."""
    agent: AgentDefinition = get_agent(agent_id)
    compiled_messages = build_agent_messages(agent, messages)

    client = QwenClient(default_model=agent.default_model)
    try:
        response = client.chat_completion(
            compiled_messages,
            model=model or agent.default_model,
            temperature=temperature,
            max_tokens=max_tokens,
        )
    except RuntimeError as exc:
        logger.warning(
            "Falling back to offline response for agent '%s' due to upstream error: %s",
            agent.id,
            exc,
        )
        return _build_fallback_response(agent, messages, exc)

    return {
        "agent_id": agent.id,
        "agent_name": agent.name,
        "model": response["model"],
        "message": response["content"],
        "usage": response["usage"],
    }
