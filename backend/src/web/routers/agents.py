from typing import List, Literal, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from agents.definitions import AgentDefinition, get_agent, list_agents
from agents.service import run_agent_chat


router = APIRouter()


class AgentMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(..., min_length=1)


class AgentChatRequest(BaseModel):
    messages: List[AgentMessage]
    model: Optional[str] = None
    temperature: Optional[float] = Field(default=0.5, ge=0.0, le=1.5)
    max_tokens: Optional[int] = Field(default=None, gt=0)


class AgentChatResponse(BaseModel):
    agent_id: str
    agent_name: str
    model: str
    message: str
    usage: Optional[dict] = None


class AgentSummary(BaseModel):
    id: str
    name: str
    description: str


@router.get("/", response_model=List[AgentSummary])
def list_available_agents() -> List[AgentSummary]:
    agents: List[AgentSummary] = []
    for agent in list_agents().values():
        agents.append(
            AgentSummary(
                id=agent.id,
                name=agent.name,
                description=agent.description,
            )
        )
    return agents


@router.post("/{agent_id}/chat", response_model=AgentChatResponse)
def chat_with_agent(agent_id: str, payload: AgentChatRequest) -> AgentChatResponse:
    try:
        _agent: AgentDefinition = get_agent(agent_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    try:
        result = run_agent_chat(
            agent_id=agent_id,
            messages=[message.model_dump() for message in payload.messages],
            model=payload.model,
            temperature=payload.temperature or 0.5,
            max_tokens=payload.max_tokens,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Não foi possível gerar a resposta do agente: {exc}",
        ) from exc

    return AgentChatResponse(**result)
