from fastapi import FastAPI, HTTPException, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os, json, logging, chromadb
from chromadb.config import Settings
from dotenv import load_dotenv
from supabase_client import supabase
from groq import Groq
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="EcoRoteiro (Final Geo-Fence)", version="7.0.0")
bearer_scheme = HTTPBearer()
collection = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=api_key) if api_key else None

# --- HELPERS ---
def limitar_tres_frases(texto: str) -> str:
    import re
    if not texto: return ""
    frases = re.split(r'(?<=[.!?])\s+', texto.strip())
    frases = [f.strip() for f in frases if f.strip()]
    return " ".join(frases[:4])

def normalize_interesses(raw):
    if not raw: return []
    if isinstance(raw, list): return raw
    if isinstance(raw, str): return [raw]
    return []

def get_difficulty_restriction(user_level: str) -> str:
    level = (user_level or "").lower()
    if level == "iniciante": return "A dificuldade máxima permitida é: fácil."
    if level == "intermediario": return "A dificuldade máxima permitida é: médio."
    return "A dificuldade máxima permitida é: fácil."

# --- CHROMA DB ---
def index_data():
    global collection
    DATA_FILE = "enriched_ecoroteiro_data.json"
    try:
        client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory="./chroma_db_store"))
        collection = client.get_or_create_collection(name="ecoroteiro_locais")
    except Exception as e:
        logger.error(f"Erro ChromaDB: {e}")
        return

    if not os.path.exists(DATA_FILE) or collection.count() > 0: return

    try:
        print("⚡ Indexando dados...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        docs, metadatas, ids = [], [], []
        for i, item in enumerate(data):
            text = item.get("full_search_text") or item.get("description_clean", "")
            if text:
                docs.append(text)
                metas.append({"title": item.get("title", ""), "dificuldade": item.get("dificuldade", ""), "json_data": json.dumps(item, ensure_ascii=False)})
                ids.append(f"doc_{i}")
        if docs:
            collection.add(embeddings=model.encode(docs).tolist(), documents=docs, metadatas=metas, ids=ids)
            client.persist() 
            print("✅ Indexação concluída.")
    except Exception as e:
        logger.error(f"Erro indexação: {e}")

# --- MODELS ---
class UserLogin(BaseModel):
    email: str
    password: str
class UserSignup(BaseModel):
    email: str
    password: str
    name: str
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    history: List[dict] = []
class UserProfile(BaseModel):
    nome: Optional[str] = None
    condicao_fisica: Optional[str] = None
    nivel_experiencia: Optional[str] = None
    interesses_usuario: List[str] = []

# --- AUTH ---
@app.post("/signup")
async def signup(user: UserSignup):
    try:
        res = supabase.auth.sign_up({"email": user.email, "password": user.password, "options": {"data": {"full_name": user.name}}})
        user_id = getattr(res.user, "id", None) if hasattr(res, "user") else res.get("user", {}).get("id")
        if user_id: supabase.table("perfis").upsert({"id": user_id, "nome": user.name}).execute()
        return {"message": "Sucesso"}
    except Exception as e: raise HTTPException(400, str(e))

@app.post("/login")
async def login(user: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
        session = getattr(res, "session", None)
        if hasattr(session, "dict"): return {"session": session.dict()}
        return {"session": session}
    except: raise HTTPException(401, "Erro no login")

def get_user_id_from_token(token):
    try:
        user_auth = supabase.auth.get_user(token.credentials)
        user = getattr(user_auth, "user", None) or getattr(user_auth, "data", {}).get("user") or {}
        if isinstance(user, dict): return user.get("id")
        return getattr(user, "id", None)
    except: return None

# --- PROFILE ---
@app.get("/profile")
async def get_profile(token: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    try:
        user_id = get_user_id_from_token(token)
        if not user_id: return {}
        uid = str(user_id)
        resp = supabase.table("perfis").select("*").filter("id", "eq", uid).execute()
        data = getattr(resp, "data", [])
        if data: return data[0]
        user_auth = supabase.auth.get_user(token.credentials)
        return { "nome": getattr(user_auth.user, "user_metadata", {}).get("full_name", ""), "id": uid }
    except: return {}

@app.put("/profile")
async def update_profile(profile: UserProfile, token: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    try:
        user_id = get_user_id_from_token(token)
        if not user_id: raise HTTPException(401, "Auth error")
        dados = profile.dict(exclude_none=True)
        dados["id"] = str(user_id)
        print(f"💾 Salvando: {dados}")
        supabase.table("perfis").upsert(dados).execute()
        return {"message": "Salvo"}
    except Exception as e:
        if "Expecting value" in str(e): return {"message": "Salvo"}
        raise HTTPException(500, detail=str(e))

# --- CHAT ---
def dificuldade_ok(nivel_user: str, dificuldade_local: str):
    d = (dificuldade_local or "").lower().strip()
    if nivel_user == "iniciante": return d in ["fácil", "facil"]
    if nivel_user == "intermediario": return d in ["fácil", "facil", "médio", "medio"]
    return True

@app.post("/chat")
async def chat(message: ChatMessage, token: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    if not groq_client: return {"response": "Sem API Key."}

    # 🛑 CAMADA 1: BLOQUEIO PALAVRAS-CHAVE (Python Guard)
    # Isso impede a IA de sequer tentar responder sobre esses lugares.
    forbidden_places = ["gramado", "recife", "rio de janeiro", "são paulo", "curitiba", "bahia", "salvador", "fernando de noronha", "amazonas", "manaus"]
    msg_lower = message.message.lower()
    
    for place in forbidden_places:
        if place in msg_lower:
            return {
                "response": f"{place.title()} é um destino incrível, mas minha especialidade é exclusiva no Ceará! Que tal eu te sugerir uma alternativa parecida por aqui, como Guaramiranga ou Jericoacoara?"
            }

    # Anti-Injection
    if any(tag in msg_lower for tag in ["<ecoturismo", "<user", "<system", "ignore todas"]):
        return {"response": "Desculpe, comando inválido. Vamos falar sobre o Ceará?"}

    user_id = get_user_id_from_token(token)
    perfil = {}
    if user_id:
        try:
            resp = supabase.table("perfis").select("*").filter("id", "eq", str(user_id)).execute()
            perfil = resp.data[0] if resp.data else {}
        except: pass

    nivel = (perfil.get("nivel_experiencia") or "").lower()
    interesses = normalize_interesses(perfil.get("interesses_usuario"))
    interesses_str = ', '.join(interesses) or 'Geral'

    campos_faltando = []
    if not nivel: campos_faltando.append("Nível")
    if not interesses: campos_faltando.append("Interesses")
    perfil_completo = len(campos_faltando) == 0

    is_greet = message.message.lower().strip() in ["oi", "olá", "ola", "e aí", "bom dia"]
    
    locais = []
    if collection and not is_greet:
        query = f"Sugestões nível {nivel} com interesses {interesses_str}" if perfil_completo else message.message
        try:
            r = collection.query(query_texts=[query], n_results=5)
            for m in r.get("metadatas", [[]])[0]:
                if "json_data" in m: locais.append(json.loads(m["json_data"]))
                else: locais.append(m)
        except Exception as e: logger.error(f"Erro RAG: {e}")

    if perfil_completo:
        locais = [l for l in locais if dificuldade_ok(nivel, l.get("dificuldade", ""))]

    contexto = json.dumps(locais, ensure_ascii=False)

    # 🛑 CAMADA 2: PROMPT BLINDADO
    master_security_prompt = f"""
    VOCÊ É O "ECOROTEIRO":
    - Especialista ÚNICO em Ceará.
    - Você NUNCA saiu do Ceará. Você desconhece detalhes de outros estados.
    
    REGRAS DE RESPOSTA (PRIORIDADE TOTAL):
    1. SE O USUÁRIO PEDIR OUTRO ESTADO (que passou pelo filtro):
       - DIGA: "Minha área de atuação é apenas o Ceará. Mas se você gosta desse estilo, recomendo [Local do Ceará]."
       - NÃO GERE O ROTEIRO SOLICITADO.
    
    2. ESCOPO:
       - Apenas Turismo Ecológico e Natureza.
       - Recuse: Culinária, Código, Matemática.
    
    3. FONTE DE DADOS:
       - Use o CONTEXTO abaixo.
       - Se vazio, use conhecimento geral APENAS DO CEARÁ.
       - Endereços: Dê Bairro/Cidade se não souber exato.
    
    CONTEXTO TÉCNICO: {contexto}
    PERFIL DO USUÁRIO: Nível {nivel}, Interesses {interesses_str}.
    """

    if is_greet:
        system_prompt = f"{master_security_prompt}\n O usuário disse 'Oi'. Saúde e pergunte o objetivo no Ceará."
    elif perfil_completo:
        system_prompt = f"{master_security_prompt}\n Responda as dúvidas do usuário focando no Ceará. Max 4 frases."
    else:
        system_prompt = f"Perfil incompleto. Peça: {', '.join(campos_faltando)}."

    formatted_history = []
    for msg in message.history:
        content = msg.get("content") or msg.get("text") or ""
        content = content.replace("<Ecoturismo Ai/>", "").replace("<User", "")
        role = msg.get("role") or "user"
        formatted_history.append({"role": role, "content": content})

    msgs = [{"role": "system", "content": system_prompt}] + formatted_history + [{"role": "user", "content": message.message}]

    try:
        out = groq_client.chat.completions.create(messages=msgs, model="llama-3.3-70b-versatile")
        return {"response": limitar_tres_frases(out.choices[0].message.content)}
    except Exception as e:
        print(f"🔥 ERRO API: {e}")
        return {"response": "Erro técnico momentâneo."}

# --- SUGGEST ---
@app.post("/routes/suggest")
async def suggest(request: Request, token: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    if not groq_client: return []
    try:
        user_id = get_user_id_from_token(token)
        perfil = {}
        if user_id:
            resp = supabase.table("perfis").select("*").filter("id", "eq", str(user_id)).execute()
            perfil = resp.data[0] if resp.data else {}

        nivel = (perfil.get('nivel_experiencia') or 'iniciante').lower()
        interesses = normalize_interesses(perfil.get('interesses_usuario'))
        interesses_str = ", ".join(interesses) if interesses else "natureza geral"
        restricao = get_difficulty_restriction(nivel)

        prompt = (
            f"Crie 3 roteiros curtos de ecoturismo no Ceará para perfil {nivel} e interesses: {interesses_str}. {restricao} "
            'IMPORTANTE: Responda APENAS com um JSON válido: [{"title": "X", "description": "Y", "difficulty": "Z", "highlights": ["A"]}]'
        )

        completion = groq_client.chat.completions.create(messages=[{"role": "user", "content": prompt}], model="llama-3.3-70b-versatile")
        
        raw = completion.choices[0].message.content
        start = raw.find('[')
        end = raw.rfind(']') + 1
        if start != -1 and end != -1: return json.loads(raw[start:end])
        return [] 
    except: return []

if __name__ == "__main__":
    index_data() 
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)