from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

app = FastAPI(
    title="Ecoroteiro API",
    description="API para plataforma de ecoturismo com IA em Fortaleza-CE",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de dados
class UserProfile(BaseModel):
    name: str
    experience_level: str  # iniciante, intermediario, avancado
    physical_condition: str  # baixa, media, alta
    interests: List[str]  # praia, trilha, observacao_aves, etc.
    duration_preference: str  # meio_dia, dia_inteiro, fim_semana
    group_size: int

class RouteRequest(BaseModel):
    user_profile: UserProfile
    specific_location: Optional[str] = None
    budget_range: Optional[str] = None

class RouteSuggestion(BaseModel):
    title: str
    description: str
    duration: str
    difficulty: str
    highlights: List[str]
    estimated_cost: str
    best_time: str
    requirements: List[str]
    locations: List[str]

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

# Dados mockados para demonstração
MOCK_ROUTES = [
    {
        "title": "Trilha do Cocó - Observação de Aves",
        "description": "Caminhada pela mata ciliar do Parque do Cocó com foco na observação de aves nativas e migratórias.",
        "duration": "3-4 horas",
        "difficulty": "Fácil",
        "highlights": ["Observação de aves", "Mata ciliar preservada", "Lagoas naturais"],
        "estimated_cost": "R$ 0-50",
        "best_time": "Manhã (6h-10h)",
        "requirements": ["Roupas confortáveis", "Repelente", "Binóculos (opcional)"],
        "locations": ["Parque do Cocó", "Lagoa do Cocó"]
    },
    {
        "title": "Praia do Futuro - Ecoturismo Costeiro",
        "description": "Exploração da costa de Fortaleza com foco na preservação marinha e educação ambiental.",
        "duration": "Meio dia",
        "difficulty": "Fácil",
        "highlights": ["Educação ambiental", "Preservação marinha", "Praias urbanas"],
        "estimated_cost": "R$ 20-80",
        "best_time": "Tarde (14h-18h)",
        "requirements": ["Protetor solar", "Roupas de banho", "Água"],
        "locations": ["Praia do Futuro", "Beira Mar"]
    }
]

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do Ecoroteiro! 🌿"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Ecoroteiro API"}

@app.post("/routes/suggest", response_model=List[RouteSuggestion])
async def suggest_routes(request: RouteRequest):
    """
    Sugere roteiros personalizados baseados no perfil do usuário.
    Em produção, aqui seria integrado com um modelo LLM.
    """
    try:
        # Lógica de filtragem baseada no perfil do usuário
        filtered_routes = []
        
        for route in MOCK_ROUTES:
            # Filtrar por nível de experiência
            if request.user_profile.experience_level == "iniciante" and route["difficulty"] == "Fácil":
                filtered_routes.append(route)
            elif request.user_profile.experience_level in ["intermediario", "avancado"]:
                filtered_routes.append(route)
        
        # Filtrar por interesses
        interest_filtered = []
        for route in filtered_routes:
            for interest in request.user_profile.interests:
                if interest in route["description"].lower() or interest in route["title"].lower():
                    interest_filtered.append(route)
                    break
        
        if not interest_filtered:
            interest_filtered = filtered_routes[:2]  # Fallback para primeiras opções
        
        return interest_filtered[:3]  # Retornar até 3 sugestões
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar sugestões: {str(e)}")

@app.post("/chat")
async def chat_with_ai(message: ChatMessage):
    """
    Endpoint para chat com IA (será integrado com LLM em produção).
    """
    try:
        # Resposta mockada - em produção seria integrado com OpenAI ou outro LLM
        responses = {
            "olá": "Olá! Sou o assistente do Ecoroteiro. Como posso ajudar você a descobrir os melhores roteiros de ecoturismo em Fortaleza?",
            "roteiro": "Posso sugerir roteiros incríveis! Me conte sobre seu nível de experiência e interesses.",
            "praia": "Fortaleza tem praias maravilhosas! Posso sugerir roteiros de ecoturismo costeiro na Praia do Futuro ou Beira Mar.",
            "trilha": "Temos trilhas incríveis no Parque do Cocó! É perfeito para observação de aves e contato com a natureza.",
            "custo": "Nossos roteiros variam de gratuitos a R$ 100 por pessoa, dependendo das atividades incluídas."
        }
        
        message_lower = message.message.lower()
        response = "Desculpe, não entendi. Posso ajudar com informações sobre roteiros, custos, trilhas ou praias. O que você gostaria de saber?"
        
        for key, value in responses.items():
            if key in message_lower:
                response = value
                break
        
        return {
            "response": response,
            "suggestions": [
                "Sugerir roteiro personalizado",
                "Informações sobre trilhas",
                "Roteiros de praia",
                "Custos e orçamento"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no chat: {str(e)}")

@app.get("/routes/popular")
async def get_popular_routes():
    """
    Retorna os roteiros mais populares.
    """
    return MOCK_ROUTES

@app.get("/routes/{route_id}")
async def get_route_details(route_id: int):
    """
    Retorna detalhes de um roteiro específico.
    """
    if route_id < 0 or route_id >= len(MOCK_ROUTES):
        raise HTTPException(status_code=404, detail="Roteiro não encontrado")
    
    return MOCK_ROUTES[route_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

