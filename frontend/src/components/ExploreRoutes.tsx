import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Route {
  id: string;
  name: string;
  image: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  type: 'trilha' | 'praia' | 'observacao' | 'aventura';
  description: string;
  duration: string;
  distance: string;
  location: string;
  highlights: string[];
}

const ExploreRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');

  // Dados mockados dos roteiros
  const routes: Route[] = [
    {
      id: '1',
      name: 'Trilha do Parque do Cocó',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'iniciante',
      type: 'trilha',
      description: 'Caminhada leve pela mata ciliar com observação de aves e natureza preservada.',
      duration: '2-3 horas',
      distance: '2 km',
      location: 'Fortaleza-CE',
      highlights: ['Observação de aves', 'Mata ciliar', 'Lagoas naturais']
    },
    {
      id: '2',
      name: 'Trilha da Lagoa do Papicu',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'intermediario',
      type: 'trilha',
      description: 'Percurso intermediário passando por lagoas naturais e áreas de restinga.',
      duration: '3-4 horas',
      distance: '4 km',
      location: 'Fortaleza-CE',
      highlights: ['Lagoas naturais', 'Área de restinga', 'Vista panorâmica']
    },
    {
      id: '3',
      name: 'Morro do Careca - Maranguape',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec2a3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'avancado',
      type: 'aventura',
      description: 'Trilha desafiadora com subida íngreme e vista panorâmica incrível.',
      duration: '4-6 horas',
      distance: '6 km',
      location: 'Maranguape-CE',
      highlights: ['Vista panorâmica', 'Desafio físico', 'Natureza preservada']
    },
    {
      id: '4',
      name: 'Ecoturismo na Praia do Futuro',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'iniciante',
      type: 'praia',
      description: 'Atividades de educação ambiental e preservação marinha na costa.',
      duration: '2-3 horas',
      distance: '1 km',
      location: 'Fortaleza-CE',
      highlights: ['Educação ambiental', 'Preservação marinha', 'Praias urbanas']
    },
    {
      id: '5',
      name: 'Observação de Aves - Parque do Cocó',
      image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'iniciante',
      type: 'observacao',
      description: 'Sessão especializada em observação de aves com mais de 200 espécies.',
      duration: '3-4 horas',
      distance: '1.5 km',
      location: 'Fortaleza-CE',
      highlights: ['200+ espécies', 'Binóculos inclusos', 'Guia especializado']
    },
    {
      id: '6',
      name: 'Trilha do Pico Alto - Guaramiranga',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      difficulty: 'avancado',
      type: 'aventura',
      description: 'Trilha de alta montanha com clima serrano e vegetação única.',
      duration: '5-7 horas',
      distance: '8 km',
      location: 'Guaramiranga-CE',
      highlights: ['Clima serrano', 'Vegetação única', 'Vista de montanha']
    }
  ];

  // Filtrar roteiros
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'todos' || route.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'todos' || route.type === selectedType;
    
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return 'bg-green-100 text-green-800';
      case 'intermediario':
        return 'bg-yellow-100 text-yellow-800';
      case 'avancado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return 'Iniciante';
      case 'intermediario':
        return 'Intermediário';
      case 'avancado':
        return 'Avançado';
      default:
        return difficulty;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trilha':
        return 'Trilha';
      case 'praia':
        return 'Praia';
      case 'observacao':
        return 'Observação';
      case 'aventura':
        return 'Aventura';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-mint/10 via-nature-emerald/5 to-nature-lime/10">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-nature-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-nature-emerald to-nature-jade rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌿</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-nature-emerald">EcoRoteiro</h1>
                  <p className="text-sm text-gray-600">Explorar Roteiros</p>
                </div>
              </button>
            </div>

            {/* Botão Voltar */}
            <button
              onClick={() => navigate('/')}
              className="bg-nature-emerald text-white px-4 py-2 rounded-lg hover:bg-nature-jade transition-colors duration-200"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e Descrição */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-nature-emerald mb-4">
            Descubra Roteiros Ecológicos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore trilhas, praias e atividades sustentáveis em Fortaleza e região metropolitana
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-nature-mint/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campo de Busca */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar roteiros
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, local ou descrição..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-emerald focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* Filtro por Dificuldade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-emerald focus:outline-none transition-colors duration-200"
              >
                <option value="todos">Todas</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atividade
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-emerald focus:outline-none transition-colors duration-200"
              >
                <option value="todos">Todos</option>
                <option value="trilha">Trilha</option>
                <option value="praia">Praia</option>
                <option value="observacao">Observação</option>
                <option value="aventura">Aventura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Roteiros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-nature-mint/20 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Imagem */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image}
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(route.difficulty)}`}>
                    {getDifficultyLabel(route.difficulty)}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-nature-emerald">
                    {getTypeLabel(route.type)}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-nature-emerald mb-2">
                  {route.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {route.description}
                </p>

                {/* Informações */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{route.distance}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {route.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-nature-mint/20 text-nature-emerald px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botão Ver Detalhes */}
                <button className="w-full bg-gradient-to-r from-nature-emerald to-nature-jade text-white py-3 px-6 rounded-xl font-semibold hover:from-nature-jade hover:to-nature-forest transition-all duration-200 shadow-lg hover:shadow-emerald-500/25">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Nenhum roteiro encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou termo de busca
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('todos');
                setSelectedType('todos');
              }}
              className="bg-nature-emerald text-white px-6 py-3 rounded-xl font-semibold hover:bg-nature-jade transition-colors duration-200"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreRoutes;


