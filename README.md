# 🌿 Ecoroteiro

Uma plataforma de ecoturismo inteligente que utiliza IA (LLM) para sugerir roteiros personalizados em Fortaleza-CE e regiões metropolitanas, considerando o perfil do usuário, nível de experiência, condição física e interesses.

## Objetivo

O Ecoroteiro visa democratizar o acesso ao ecoturismo responsável em Fortaleza e região metropolitana, oferecendo roteiros personalizados criados por inteligência artificial que consideram as características individuais de cada usuário.

## Arquitetura resumida

- **Frontend**: React + Vite com roteamento via React Router e componentes estilizados com TailwindCSS.
- **Backend**: FastAPI que integra Supabase (auth/dados), ChromaDB para RAG e Groq LLM para geração das recomendações.

## Pré-requisitos

- Node.js 20+ e npm
- Python 3.11+ e `pip`



## Rodando o backend (FastAPI)

1. Crie e ative um ambiente virtual (opcional, mas recomendado):
   ```bash
   python -m venv .venv
   # Windows
   .\.venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
2. Instale as dependências:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Execute o servidor (escolha uma opção):
   ```bash
   # modo script (inclui indexação quando disponível)
   python backend/main.py

   # ou apenas o app FastAPI em desenvolvimento
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. A API ficará acessível em `http://localhost:8000`. O script `backend/teste.py` pode ser usado para validar a conexão com o Supabase.

## Rodando o frontend (Vite + React)

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
3. A aplicação estará disponível em `http://localhost:5173`. Certifique-se de que o backend esteja rodando para que as chamadas funcionem.

### Scripts úteis do frontend

```bash
npm run dev          
npm run build      
npm run preview     
npm run lint         
```






