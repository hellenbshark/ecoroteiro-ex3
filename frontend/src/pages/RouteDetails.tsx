import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import localData from '../data/locais.json'; 

interface Local {
    id: string;
    nome: string;
    descricao: string;
    dificuldade: string;
    interesses: string[];
}

// --- FUNÇÃO PARA PEGAR A IMAGEM CORRETA NA PASTA PUBLIC ---
const getRouteImage = (nome: string) => {
  const n = nome ? nome.toLowerCase() : "";

  if (n.includes('cocó') || n.includes('coco')) return "/images_local/imagens_das_trilhas/parque_do_coco.png";
  if (n.includes('sabiaguaba')) return "/images_local/imagens_das_trilhas/sabiaguaba-2.jpg";
  if (n.includes('curió') || n.includes('curio')) return "/images_local/imagens_das_trilhas/Curio.jpg";
  if (n.includes('engenhoca')) return "/images_local/imagens_das_trilhas/engenhoca.jpg";
  if (n.includes('pacoti')) return "/images_local/imagens_das_trilhas/RIO-PACOTI.png";
  if (n.includes('cauípe') || n.includes('cauipe')) return "/images_local/imagens_das_trilhas/lagoa-do-cauipe-1.webp";
  if (n.includes('rajada')) return "/images_local/imagens_das_trilhas/trilha_pedra_da_rajada.jpg";
  if (n.includes('aratanha')) return "/images_local/imagens_das_trilhas/aratanha.jpg";
  if (n.includes('botânico') || n.includes('botanico')) return "/images_local/imagens_das_trilhas/botanico.jpg";

  // Fallback (foto genérica)
  return "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=800&q=80";
};

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
        case 'fácil': return 'bg-green-500';
        case 'médio': return 'bg-yellow-500';
        case 'difícil': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

const RouteDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const [route, setRoute] = useState<Local | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca o roteiro no JSON estático pelo ID
        const foundRoute = (localData as Local[]).find(local => local.id.toString() === id);
        
        if (foundRoute) {
            setRoute(foundRoute);
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-24">Carregando detalhes do roteiro...</div>;
    }

    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 flex-col text-center p-4">
                <h2 className="text-4xl font-bold text-red-600 mb-4">Roteiro Não Encontrado</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Verifique se o ID ({id}) está correto no seu arquivo locais.json.
                </p>
                <button onClick={() => navigate('/explorar-roteiros')} className="bg-nature-emerald text-white px-6 py-3 rounded-xl font-semibold hover:bg-nature-jade transition-colors">
                    Voltar para Exploração
                </button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto pb-12">
            <button onClick={() => navigate(-1)} className="text-nature-emerald hover:text-nature-jade font-medium flex items-center mb-6">
                <span className="mr-2">←</span> Voltar
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                {/* Imagem de Destaque */}
                <div className="h-96 relative">
                    {/* AQUI ESTA A CORREÇÃO DA IMAGEM */}
                    <img
                        src={getRouteImage(route.nome)}
                        alt={route.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                        <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">{route.nome}</h1>
                        <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold text-white shadow-md ${getDifficultyColor(route.dificuldade)}`}>
                            Dificuldade: {route.dificuldade}
                        </span>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-nature-emerald border-b pb-2 border-gray-200 dark:border-gray-700">Sobre o Roteiro</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                        {route.descricao}
                    </p>

                    <h3 className="text-xl font-bold text-nature-emerald">Interesses Relacionados</h3>
                    <div className="flex flex-wrap gap-3">
                        {route.interesses?.map((tag, idx) => (
                            <span key={idx} className="bg-nature-mint/40 dark:bg-nature-emerald/20 text-nature-emerald dark:text-nature-light-green text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Simulação de Informações Adicionais */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-nature-emerald mb-4">Informações Práticas</h3>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            <li className="flex items-center">
                                <span className="font-semibold w-32">Duração Média:</span> 3 a 5 horas
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-32">Melhor Época:</span> Estiagem (Julho a Dezembro)
                            </li>
                            <li className="flex items-center">
                                <span className="font-semibold w-32">Equipamento:</span> Água, Protetor Solar, Chapéu
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteDetails;