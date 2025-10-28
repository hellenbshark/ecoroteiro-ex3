# 🌿 Ecoroteiro

Uma plataforma de ecoturismo inteligente que utiliza IA (LLM) para sugerir roteiros personalizados em Fortaleza-CE, considerando o perfil do usuário, nível de experiência, condição física e interesses.

## 🎯 Objetivo

O Ecoroteiro visa democratizar o acesso ao ecoturismo responsável em Fortaleza e região metropolitana, oferecendo roteiros personalizados criados por inteligência artificial que consideram as características individuais de cada usuário.

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** - Biblioteca para interface de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Poppins/Inter** - Tipografia moderna

### Backend
- **Python 3.8+** - Linguagem de programação
- **FastAPI** - Framework web moderno e rápido
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI
- **OpenAI API** - Integração com LLM (futuro)

### Comunicação
- **API REST** - Comunicação entre frontend e backend
- **CORS** - Configurado para desenvolvimento local

## 🎨 Design System

### Cores do Tema Natureza
- **Verde Musgo**: `#8B9A5B` - Cor principal
- **Verde Claro**: `#A8C09A` - Acentos
- **Bege**: `#F5F5DC` - Fundo suave
- **Sage**: `#9CAF88` - Elementos secundários
- **Forest**: `#6B8E23` - Hover states

### Tipografia
- **Poppins** - Títulos e elementos principais
- **Inter** - Texto corrido e interface

## 📁 Estrutura do Projeto

```
EcoRoteiro/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── App.tsx          # Componente principal
│   │   ├── index.css        # Estilos globais + Tailwind
│   │   └── main.tsx         # Ponto de entrada
│   ├── tailwind.config.js   # Configuração do Tailwind
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # API FastAPI
│   ├── main.py             # Aplicação principal
│   ├── requirements.txt    # Dependências Python
│   └── env.example         # Variáveis de ambiente
├── shared/                 # Modelos compartilhados (futuro)
└── README.md               # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** 18+ (para frontend)
- **Python** 3.8+ (para backend)
- **npm** ou **yarn** (gerenciador de pacotes)

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd EcoRoteiro
```

### 2. Configurar o Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend estará disponível em: `http://localhost:5173`

### 3. Configurar o Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
O backend estará disponível em: `http://localhost:8000`

### 4. Documentação da API
Acesse `http://localhost:8000/docs` para ver a documentação interativa da API (Swagger UI).

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente (Backend)
Copie o arquivo `env.example` para `.env` e configure:

```env
# Configurações da API
API_HOST=0.0.0.0
API_PORT=8000

# Configurações do LLM (OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Configurações de CORS
FRONTEND_URL=http://localhost:5173

# Configurações de ambiente
ENVIRONMENT=development
DEBUG=True
```

### Scripts Disponíveis

#### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter ESLint
```

#### Backend
```bash
python main.py       # Executar servidor
uvicorn main:app --reload  # Desenvolvimento com reload
```

## 🌟 Funcionalidades Atuais

### Frontend
- ✅ Layout responsivo com tema natureza
- ✅ Navbar com navegação
- ✅ Footer informativo
- ✅ Seção hero atrativa
- ✅ Seção de features
- ✅ Design system consistente

### Backend
- ✅ API REST com FastAPI
- ✅ Endpoints para sugestão de roteiros
- ✅ Chat com IA (mockado)
- ✅ CORS configurado
- ✅ Documentação automática (Swagger)
- ✅ Validação de dados com Pydantic

## 🚧 Próximas Funcionalidades

### Integração com LLM
- [ ] Integração real com OpenAI GPT
- [ ] Geração dinâmica de roteiros
- [ ] Chat inteligente contextual

### Frontend Avançado
- [ ] Página de perfil do usuário
- [ ] Formulário de preferências
- [ ] Visualização de roteiros
- [ ] Sistema de avaliações

### Backend Avançado
- [ ] Banco de dados (PostgreSQL)
- [ ] Autenticação de usuários
- [ ] Cache de respostas
- [ ] Logs e monitoramento

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Projeto**: Ecoroteiro
- **Localização**: Fortaleza-CE, Brasil
- **Objetivo**: Ecoturismo responsável e sustentável

---

Feito com ❤️ para promover o ecoturismo sustentável em Fortaleza-CE


