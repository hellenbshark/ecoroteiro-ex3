import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
            alt="Natureza"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-inter animate-fade-in">
            Descubra o Ecoturismo
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light animate-slide-in-up">
            Roteiros sustentáveis personalizados por Inteligência Artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explorar-roteiros" className="bg-nature-emerald hover:bg-nature-jade text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg">
              Ver Roteiros
            </Link>
            <Link to="/register" className="bg-white/20 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;