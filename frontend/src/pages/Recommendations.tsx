import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// --- INTERFACES ---

interface RouteSuggestion {
  title: string;
  description: string;
  difficulty: string;
  highlights: string[];
}

// --- FUNÇÃO QUE ESCOLHE A IMAGEM (AGORA COM CAMINHOS DA PASTA PUBLIC) ---
const getRouteImage = (title: string) => {
  const t = title ? title.toLowerCase() : "";

  // O caminho começa com / porque a pasta 'images_local' está dentro de 'public'
  if (t.includes('cocó') || t.includes('coco')) return "/frontend/public/images_local/imagens_das_trilhas/parque_do_coco.png";
  if (t.includes('sabiaguaba')) return "/frontend/public/images_local/imagens_das_trilhas/sabiaguaba-2.jpg";
  if (t.includes('curió') || t.includes('curio')) return "/frontend/public/images_local/imagens_das_trilhas/Curio.jpg";
  if (t.includes('engenhoca')) return "/frontend/public/images_local/imagens_das_trilhas/engenhoca.jpg";
  if (t.includes('pacoti')) return "/frontend/public/images_local/imagens_das_trilhas/RIO-PACOTI.png";
  if (t.includes('cauípe') || t.includes('cauipe')) return "/frontend/public/images_local/imagens_das_trilhas/lagoa-do-cauipe-1.webp";
  if (t.includes('rajada')) return "/frontend/public/images_local/imagens_das_trilhas/trilha_pedra_da_rajada.jpg";
  if (t.includes('aratanha')) return "/frontend/public/images_local/imagens_das_trilhas/aratanha.jpg";
  if (t.includes('botânico') || t.includes('botanico')) return "/frontend/public/images_local/imagens_das_trilhas/botanico.jpg";

  // Imagem padrão online caso não encontre correspondência
  return "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=800&q=80";
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'fácil': return 'bg-green-500 text-white';
    case 'médio': return 'bg-yellow-500 text-gray-800';
    case 'difícil': return 'bg-red-500 text-white';
    default: return 'bg-gray-400 text-gray-800';
  }
};

// --- COMPONENTE ---

const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RouteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setUserName(localStorage.getItem('userName') || 'Viajante');

    if (!token) {
      toast.error('Você precisa estar logado.');
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/routes/suggest', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRecommendations(Array.isArray(data) ? data : []);
        } else {
          throw new Error('Erro ao buscar dados');
        }
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar roteiros.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12 transition-colors">
      <button onClick={() => navigate(-1)} className="text-nature-emerald hover:text-nature-jade font-medium flex items-center mb-6">
        <span className="mr-2">←</span> Voltar
      </button>

      <h1 className="text-4xl font-extrabold text-nature-emerald mb-2">Suas Recomendações</h1>
      <p className="text-xl text-gray-600 mb-8">Roteiros únicos, criados para você, {userName}.</p>

      {isLoading ? (
        <div className="text-center mt-12 text-nature-emerald">Carregando...</div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {recommendations.map((route, index) => (
            <div key={index} className="group bg-white rounded-3xl shadow-lg border overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                
                {/* Aqui chamamos a função que retorna o caminho da string */}
                <img
                  src={getRouteImage(route.title)}
                  alt={route.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback caso a imagem local falhe
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(route.difficulty)} shadow-sm`}>
                  {route.difficulty}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{route.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{route.description}</p>
                <div className="flex flex-wrap gap-2">
                  {route.highlights?.map((tag, idx) => (
                    <span key={idx} className="bg-nature-mint/40 text-nature-emerald text-xs font-medium px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;