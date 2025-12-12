import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Erro ao fazer login");
        setIsLoading(false);
        return;
      }

      const token = data?.session?.access_token;

      if (!token) {
        toast.error("Token inválido");
        return;
      }

      localStorage.setItem("accessToken", token);

      // --- Buscar perfil ---
      try {
        const profileRes = await fetch('http://localhost:8000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profileData = await profileRes.json();

        if (profileData?.nome) {
          localStorage.setItem("userName", profileData.nome);
        } else {
          localStorage.setItem("userName", "Viajante");
        }

      } catch {
        localStorage.setItem("userName", "Viajante");
      }

      window.dispatchEvent(new Event("userUpdated"));

      toast.success("Login realizado!");
      navigate('/dashboard');

    } catch (error) {
      toast.error("Erro ao conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2071"
          alt="Nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-nature-emerald text-center mb-2">Bem-vindo</h1>
        <p className="text-center text-gray-600 mb-6">Faça login para continuar</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-nature-emerald text-white py-3 rounded-xl font-bold hover:bg-nature-jade disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-700">
          Ainda não tem conta? <Link to="/register" className="text-nature-emerald font-semibold hover:underline">Cadastrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;