from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional


PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"


@dataclass(frozen=True)
class AgentDefinition:
    """Metadata and system prompt for a conversational agent."""

    id: str
    name: str
    description: str
    system_prompt: str
    default_model: Optional[str] = None


def _load_prompt(filename: str) -> str:
    path = PROMPTS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text(encoding="utf-8").strip()


AGENTS: Dict[str, AgentDefinition] = {
    "mestre_mapeamento": AgentDefinition(
        id="mestre_mapeamento",
        name="Mestre do Mapeamento",
        description="Especialista em mapeamento holístico de papéis de vida usando o sistema M.A.P.A.",
        system_prompt=_load_prompt("mestre_mapeamento.txt"),
        default_model="qwen-plus",
    ),
    "diagnosticador_foco": AgentDefinition(
        id="diagnosticador_foco",
        name="Diagnosticador F.O.C.O.",
        description="Facilitador que separa fatos, emoções e contexto para criar diagnósticos acionáveis.",
        system_prompt=_load_prompt("diagnosticador_foco.txt"),
        default_model="qwen-plus",
    ),
    "validador_estrategico": AgentDefinition(
        id="validador_estrategico",
        name="Validador Estratégico",
        description="Consultor que avalia intensidade, controle e timing para validar investimentos de energia.",
        system_prompt=_load_prompt("validador_estrategico.txt"),
        default_model="qwen-plus",
    ),
    "laboratorio_cientifico": AgentDefinition(
        id="laboratorio_cientifico",
        name="Laboratório Científico",
        description="Coordenador de painel multi-IA focado em encontrar métodos científicos validados.",
        system_prompt=_load_prompt("laboratorio_cientifico.txt"),
        default_model="qwen-plus",
    ),
    "tutor_socratico": AgentDefinition(
        id="tutor_socratico",
        name="Tutor Socrático",
        description="Especialista em validar domínio ativo de métodos com questionamentos em quatro níveis.",
        system_prompt=_load_prompt("tutor_socratico.txt"),
        default_model="qwen-plus",
    ),
    "arquiteto_implementacao": AgentDefinition(
        id="arquiteto_implementacao",
        name="Arquiteto de Implementação",
        description="Planejador macro que converte o Método Ouro em currículo progressivo e mensurável.",
        system_prompt=_load_prompt("arquiteto_implementacao.txt"),
        default_model="qwen-plus",
    ),
    "construtor_sistemas": AgentDefinition(
        id="construtor_sistemas",
        name="Construtor de Sistemas",
        description="Arquiteto de KBFs personalizados que unem contexto externo e interno do usuário.",
        system_prompt=_load_prompt("construtor_sistemas.txt"),
        default_model="qwen-plus",
    ),
}


def get_agent(agent_id: str) -> AgentDefinition:
    try:
        return AGENTS[agent_id]
    except KeyError as exc:
        raise ValueError(f"Agent '{agent_id}' not found") from exc


def list_agents() -> Dict[str, AgentDefinition]:
    return AGENTS
