from fastapi import APIRouter
from ...models.schemas import CopilotQueryRequest, CopilotQueryResponse
from ...services.rag_engine import RAGEngine

router = APIRouter(prefix="/api/copilot", tags=["copilot"])
rag_service = RAGEngine()

@router.post("/query", response_model=CopilotQueryResponse)
def query_copilot(payload: CopilotQueryRequest):
    result = rag_service.answer_query(
        query=payload.query,
        context_zone_id=payload.context_zone_id
    )
    return result
