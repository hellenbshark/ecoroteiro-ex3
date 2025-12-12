import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false, 
  user, 
  onLoginClick, 
  onLogout 
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg border-b border-nature-sage/20 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Clicar aqui já leva para a Home (que é o Chat quando logado) */}
          <div className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Link to="/" className="text-2xl font-bold text-nature-emerald font-inter flex items-center gap-2">
              <span className="text-3xl">🌿</span> EcoRoteiro
            </Link>
          </div>

          {/* Menu Items Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              
              {/* Link Início (Leva ao Chat se logado) */}
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-nature-emerald px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Início
              </Link>

              {/* Link Explorar */}
              <Link
                to="/explorar-roteiros"
                className="text-gray-600 dark:text-gray-300 hover:text-nature-emerald px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Explorar Roteiros
              </Link>
              
              {/* NOVO LINK: Sobre Nós */}
              <Link
                to="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-nature-emerald px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sobre Nós
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4 ml-4">
                  {/* Link Perfil (Clicando no Nome) */}
                  <Link to="/profile" className="flex items-center gap-2 text-sm text-nature-emerald font-semibold cursor-pointer bg-nature-emerald/10 px-3 py-2 rounded-lg hover:bg-nature-emerald/20 transition-all">
                    <span>👤</span>
                    {user?.name}
                  </Link>
                  
                  <button
                    onClick={onLogout}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors duration-200"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-nature-emerald to-nature-jade text-white hover:from-nature-jade hover:to-nature-forest px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-emerald-500/25 ml-4"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button (Simplificado) */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-nature-moss dark:text-nature-sage hover:text-nature-forest p-2 rounded-md"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;