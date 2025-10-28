import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  initialMode?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  const handleLogin = (email: string, password: string) => {
    // Simular autenticação bem-sucedida
    console.log('Login:', { email, password });
    onAuthSuccess({ 
      name: 'Usuário Teste', 
      email 
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simular cadastro bem-sucedido
    console.log('Register:', { name, email, password });
    onAuthSuccess({ 
      name, 
      email 
    });
  };

  return (
    <div className="relative">
      {/* Transição suave entre telas */}
      <div className={`transition-all duration-500 ease-in-out ${
        isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
      }`}>
        <Login 
          onSwitchToRegister={() => setIsLogin(false)}
          onLogin={handleLogin}
        />
      </div>
      
      <div className={`transition-all duration-500 ease-in-out ${
        !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
      }`}>
        <Register 
          onSwitchToLogin={() => setIsLogin(true)}
          onRegister={handleRegister}
        />
      </div>
    </div>
  );
};

export default Auth;
