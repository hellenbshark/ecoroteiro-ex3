import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de envio
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Se o e-mail ${email} estiver cadastrado, você receberá um link de recuperação.`);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Fundo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2071&q=80" 
          alt="Background" 
          className="w-full h-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-nature-beige/90 dark:bg-gray-900/90"></div>
      </div>

      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-nature-emerald mb-2">Recuperar Senha</h2>
          <p className="text-gray-600 dark:text-gray-300">Digite seu e-mail para receber as instruções.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail cadastrado</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-nature-emerald focus:outline-none transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-nature-emerald text-white py-3 rounded-xl font-bold hover:bg-nature-jade transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-500 hover:text-nature-emerald transition-colors font-medium">
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;