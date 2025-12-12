import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Viajante');
  const [isProfileComplete, setIsProfileComplete] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }
        
        const savedName = localStorage.getItem('userName');
        if (savedName && savedName !== 'null') {
            setUserName(savedName);
        }

        // 1. CHECANDO O PERFIL DO USUÁRIO
        try {
            const response = await fetch('http://localhost:8000/profile', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                
                // --- CORREÇÃO: VERIFICAÇÃO ROBUSTA DE ARRAY ---
                const isInteressesValid = Array.isArray(data.interesses_usuario) && data.interesses_usuario.length > 0;

                // CRITÉRIO DE PERFIL COMPLETO:
                if (data.condicao_fisica && data.nivel_experiencia && isInteressesValid) {
                    setIsProfileComplete(true);
                } else {
                    setIsProfileComplete(false);
                }
            } else {
                 setIsProfileComplete(false);
            }
        } catch (error) {
            console.error("Erro ao carregar perfil para Dashboard:", error);
            setIsProfileComplete(false);
        }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // FUNÇÃO DE AÇÃO PARA O CARD DE RECOMENDAÇÕES
  const handleRecommendationsClick = () => {
    if (isProfileComplete) {
        navigate('/recommendations'); 
    } else {
        toast.error('Preencha seu perfil para desbloquear recomendações exclusivas!');
        navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12 bg-nature-beige dark:bg-gray-900 transition-colors">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-nature-emerald">Olá, {userName}!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">O que vamos fazer agora?</p>

        {/* GRADE DE CARDS (3 COLUNAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          
          {/* CARD 1: Falar com IA (Chatbot) */}
          <div 
            onClick={() => navigate('/chatbot')}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-nature-emerald cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Falar com IA</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Planeje sua aventura conversando com nosso guia inteligente.
            </p>
          </div>

          {/* CARD 2: RECOMENDAÇÕES PERSONALIZADAS */}
          <div 
            onClick={handleRecommendationsClick} 
            className={`p-8 rounded-3xl shadow-lg border-2 cursor-pointer transition-all duration-300 hover:-translate-y-2 group 
                ${
                    isProfileComplete 
                    ? 'bg-white dark:bg-gray-800 border-transparent hover:border-nature-emerald hover:bg-nature-mint/30 dark:hover:bg-nature-emerald/30' 
                    : 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500/50 hover:border-yellow-500' // Estilo de alerta
                }
            `}
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {isProfileComplete ? '✨' : '📝'}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Recomendações
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
                {isProfileComplete 
                    ? 'Receba roteiros personalizados com base nas suas preferências.' 
                    : 'Preencha seu perfil para desbloquear recomendações exclusivas!' 
                }
            </p>
          </div>
          
          {/* CARD 3: Meu Perfil (Configurações) */}
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border-2 border-transparent hover:border-nature-emerald cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">👤</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Meu Perfil</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Atualize seus interesses, condição física e preferências.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;