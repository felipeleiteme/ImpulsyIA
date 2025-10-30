from typing import Any, List, Optional

from openai import OpenAI, OpenAIError

from core.config import (
    DASHSCOPE_API_KEY,
    QWEN_BASE_URL,
    QWEN_DEFAULT_MODEL,
)


class QwenClient:
    """Thin wrapper around the OpenAI-compatible Qwen endpoint."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        default_model: Optional[str] = None,
    ) -> None:
        self.api_key = api_key or DASHSCOPE_API_KEY
        if not self.api_key:
            raise ValueError(
                "DASHSCOPE_API_KEY is not set. Configure the environment variable before using Qwen."
            )
        self.base_url = base_url or QWEN_BASE_URL
        self.default_model = default_model or QWEN_DEFAULT_MODEL
        self._client = OpenAI(api_key=self.api_key, base_url=self.base_url)

    def chat_completion(
        self,
        messages: List[dict[str, Any]],
        model: Optional[str] = None,
        temperature: float = 0.5,
        max_tokens: Optional[int] = None,
    ) -> dict[str, Any]:
        """Send a chat completion request to Qwen."""
        try:
            response = self._client.chat.completions.create(
                model=model or self.default_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except OpenAIError as exc:
            raise RuntimeError(f"Qwen API error: {exc}") from exc

        choice = response.choices[0]
        return {
            "content": choice.message.content,
            "model": response.model,
            "usage": response.usage.dict() if response.usage else None,
        }
