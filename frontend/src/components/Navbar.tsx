import React from 'react';

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
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-nature-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-nature-emerald font-inter">
              🌿 Ecoroteiro
            </h1>
          </div>

          {/* Menu Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="text-nature-emerald hover:text-nature-jade px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Início
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-nature-emerald px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Explorar
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-nature-emerald px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Chatbot
              </a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Olá, {user?.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="bg-gradient-to-r from-nature-emerald to-nature-jade text-white hover:from-nature-jade hover:to-nature-forest px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-emerald-500/25"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-nature-moss hover:text-nature-forest inline-flex items-center justify-center p-2 rounded-md"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
