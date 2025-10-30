from typing import Any, Dict, List, Optional

from .definitions import AgentDefinition, get_agent
from llms.qwen_client import QwenClient


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
    response = client.chat_completion(
        compiled_messages,
        model=model or agent.default_model,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    return {
        "agent_id": agent.id,
        "agent_name": agent.name,
        "model": response["model"],
        "message": response["content"],
        "usage": response["usage"],
    }
