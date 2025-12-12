import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# --- Configuração ---
GROQ_CLIENT = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Arquivos de entrada e saída
RAW_DATA_FILE = "locais.json"
ENRICHED_DATA_FILE = "enriched_ecoroteiro_data.json"

# Esquema JSON OBRIGATÓRIO que o Groq deve retornar
ENRICHMENT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string", "description": "Nome conciso e amigável."},
        "description_clean": {"type": "string", "description": "Descrição detalhada e revisada."},
        "dificuldade": {"type": "string", "description": "Dificuldade padronizada (usar SOMENTE: 'fácil', 'médio' ou 'difícil')."},
        "localizacao_detalhada": {"type": "string", "description": "Cidade e Ponto de Referência."},
        "interesses_chave": {"type": "array", "items": {"type": "string"}, "description": "Lista de interesses (ex: 'trilha', 'praia', 'aves')."}
    },
    "required": ["title", "dificuldade", "localizacao_detalhada"]
}

def load_raw_data():
    """Carrega os dados brutos do arquivo locais.json."""
    if not os.path.exists(RAW_DATA_FILE):
        raise FileNotFoundError(f"Erro: Arquivo '{RAW_DATA_FILE}' não encontrado.")
    
    with open(RAW_DATA_FILE, 'r', encoding='utf-8') as f:
        # Tenta carregar como lista; se for um único objeto, encapsula em uma lista
        raw_data = json.load(f)
        if not isinstance(raw_data, list):
            raw_data = [raw_data]
            
    print(f"Carregado {len(raw_data)} itens brutos de {RAW_DATA_FILE}.")
    return raw_data

def enrich_data_with_groq(raw_item):
    """Usa Groq para estruturar e padronizar um único item de dado."""
    # Transforma o objeto JSON bruto em uma string para o prompt
    raw_text = json.dumps(raw_item, ensure_ascii=False)
    
    system_prompt = f"""
    Sua tarefa é analisar o objeto JSON abaixo sobre um local de ecoturismo no Ceará e transformá-lo em um novo objeto JSON PADRONIZADO, seguindo o esquema fornecido.
    
    REGRAS CRÍTICAS DE PADRONIZAÇÃO:
    1. A dificuldade DEVE ser SOMENTE uma das três opções (fácil, médio, ou difícil). Use o termo com acento.
    2. Garanta que a descrição e todos os campos obrigatórios sejam preenchidos com alta acurácia e baseados no conhecimento sobre o Ceará.
    
    Objeto JSON Bruto: {raw_text}
    """
    
    try:
        completion = GROQ_CLIENT.chat.completions.create(
            messages=[{"role": "user", "content": system_prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object", "schema": ENRICHMENT_SCHEMA}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Erro ao enriquecer item. Retorno da API inválido ou erro: {e}")
        return None

def process_and_save_data():
    """Processa todos os dados brutos e salva os enriquecidos."""
    try:
        raw_list = load_raw_data()
    except FileNotFoundError as e:
        print(e)
        return
        
    enriched_list = []

    for i, item in enumerate(raw_list):
        print(f"Processando item {i+1}/{len(raw_list)}...")
        enriched_item = enrich_data_with_groq(item)
        
        if enriched_item:
            # Cria o texto completo que será indexado no ChromaDB
            search_text = (
                f"Título: {enriched_item.get('title', '')}. "
                f"Dificuldade: {enriched_item.get('dificuldade', '')}. "
                f"Local: {enriched_item.get('localizacao_detalhada', '')}. "
                f"Interesses: {', '.join(enriched_item.get('interesses_chave', []))}. "
                f"Descrição: {enriched_item.get('description_clean', '')}"
            )
            enriched_item["full_search_text"] = search_text
            enriched_list.append(enriched_item)
            
    # Salva o resultado final que será usado para o ChromaDB
    with open(ENRICHED_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(enriched_list, f, ensure_ascii=False, indent=4)
    
    print(f"\n✅ Processamento concluído. {len(enriched_list)} itens enriquecidos salvos em {ENRICHED_DATA_FILE}")

if __name__ == "__main__":
    process_and_save_data()