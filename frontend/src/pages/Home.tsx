import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section com imagem de fundo */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
              alt="Nature landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Conteúdo centralizado */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Ícone */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl mb-8">
              <span className="text-4xl">🌿</span>
            </div>
            
            {/* Título */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-inter">
              EcoRoteiro
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubra e compartilhe roteiros sustentáveis. Juntos por um planeta mais verde.
            </p>
            
            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-nature-emerald to-nature-jade text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-nature-jade hover:to-nature-forest transition-all duration-200 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
              >
                Começar Agora
              </button>
              <button 
                onClick={handleLoginClick}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-200 shadow-2xl hover:scale-105"
              >
                Já tenho conta
              </button>
            </div>
            
            {/* Links para outras funcionalidades */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chatbot"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 hover:underline"
              >
                <span>💬</span>
                <span>Converse com nossa IA</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                to="/explorar-roteiros"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 hover:underline"
              >
                <span>🗺️</span>
                <span>Explorar Roteiros</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-nature-mint/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-nature-emerald mb-4">
                Por que escolher o Ecoroteiro?
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Nossa plataforma combina tecnologia de ponta com conhecimento local para criar 
                experiências únicas de ecoturismo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-nature-mint/20 to-nature-emerald/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 hover:scale-105 border border-nature-mint/30">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-nature-emerald mb-3">
                  IA Personalizada
                </h3>
                <p className="text-gray-600">
                  Roteiros criados especialmente para você, considerando seu nível de experiência, 
                  condição física e interesses.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-nature-lime/20 to-nature-jade/10 hover:shadow-lg hover:shadow-lime-500/20 transition-all duration-200 hover:scale-105 border border-nature-lime/30">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold text-nature-jade mb-3">
                  Ecoturismo Responsável
                </h3>
                <p className="text-gray-600">
                  Promovemos o turismo sustentável, respeitando o meio ambiente e 
                  apoiando comunidades locais.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-nature-sage/20 to-nature-olive/10 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 hover:scale-105 border border-nature-sage/30">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-nature-olive mb-3">
                  Conhecimento Local
                </h3>
                <p className="text-gray-600">
                  Conhecemos cada cantinho de Fortaleza e região metropolitana, 
                  oferecendo experiências autênticas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
