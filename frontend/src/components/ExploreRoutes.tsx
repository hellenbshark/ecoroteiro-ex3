import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import localData from '../data/locais.json';

interface Local {
  id: string;
  nome: string;
  descricao: string;
  dificuldade: string;
  interesses: string[];
}

// --- FUNÇÃO PARA ESCOLHER A COR DA DIFICULDADE ---
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'fácil':
      return 'bg-green-500 text-white';
    case 'médio':
      return 'bg-yellow-500 text-gray-800';
    case 'difícil':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-400 text-gray-800';
  }
};

// --- NOVA FUNÇÃO: ESCOLHE A IMAGEM PELO NOME ---
// O navegador busca automaticamente na pasta 'public' quando começamos com '/'
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

  // Fallback (foto genérica se não achar o nome)
  return "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=800&q=80";
};

const ExploreRoutes: React.FC = () => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA O INPUT
  const [inputNome, setInputNome] = useState('');
  const [inputDificuldade, setInputDificuldade] = useState('');
  const [inputTipo, setInputTipo] = useState('');

  // ESTADO PARA A BUSCA ATIVA
  const [activeSearchTerm, setActiveSearchTerm] = useState<{
    nome: string;
    dificuldade: string;
    tipo: string;
  }>({
    nome: '',
    dificuldade: '',
    tipo: '',
  });

  useEffect(() => {
    setLocais(localData as Local[]);
    setLoading(false);
  }, []);

  const getUniqueInteresses = (): string[] => {
    const allInteresses = locais.flatMap((local) => local.interesses);
    return [...new Set(allInteresses)].sort();
  };

  const handleSearch = () => {
    setActiveSearchTerm({
      nome: inputNome.toLowerCase(),
      dificuldade: inputDificuldade.toLowerCase(),
      tipo: inputTipo.toLowerCase(),
    });
  };

  const handleClear = () => {
    setInputNome('');
    setInputDificuldade('');
    setInputTipo('');
    setActiveSearchTerm({ nome: '', dificuldade: '', tipo: '' });
  };

  const filteredLocais = locais.filter((local) => {
    const searchNome = activeSearchTerm.nome;
    const searchDificuldade = activeSearchTerm.dificuldade;
    const searchTipo = activeSearchTerm.tipo;

    const matchesNome =
      local.nome.toLowerCase().includes(searchNome) ||
      local.descricao.toLowerCase().includes(searchNome);

    const matchesDificuldade =
      !searchDificuldade || local.dificuldade.toLowerCase() === searchDificuldade;

    const matchesTipo =
      !searchTipo ||
      local.interesses.some((interesse) => interesse.toLowerCase() === searchTipo);

    if (!searchNome && !searchDificuldade && !searchTipo) {
      return true;
    }

    return matchesNome && matchesDificuldade && matchesTipo;
  });

  const uniqueInteresses = getUniqueInteresses();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        Carregando roteiros...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
      <h2 className="text-3xl font-bold text-nature-emerald mb-4">
        Roteiros em Destaque
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Explore algumas opções de ecoturismo na região do Ceará.
      </p>

      {/* FILTROS */}
      <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Filtros de Roteiro
        </h3>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={inputNome}
            onChange={(e) => setInputNome(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-nature-emerald"
          />

          <select
            value={inputTipo}
            onChange={(e) => setInputTipo(e.target.value)}
            className="w-full md:w-1/4 px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-nature-emerald"
          >
            <option value="">Filtrar Tipo (Todos)</option>
            {uniqueInteresses.map((interesse) => (
              <option key={interesse} value={interesse.toLowerCase()}>
                {interesse}
              </option>
            ))}
          </select>

          <select
            value={inputDificuldade}
            onChange={(e) => setInputDificuldade(e.target.value)}
            className="w-full md:w-1/4 px-4 py-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-nature-emerald"
          >
            <option value="">Filtrar Dificuldade (Todas)</option>
            <option value="fácil">Fácil</option>
            <option value="médio">Médio</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>

        <div className="flex justify-start gap-4 mt-6">
          <button
            onClick={handleSearch}
            className="bg-nature-emerald text-white px-6 py-3 rounded-xl font-semibold hover:bg-nature-jade transition-colors shadow-md"
          >
            Pesquisar
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors shadow-md"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLocais.map((local) => (
          <div
            key={local.id}
            className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-48 overflow-hidden relative">
              
              {/* --- AQUI ESTÁ A MÁGICA: Usando a função getRouteImage --- */}
              <img
                src={getRouteImage(local.nome)}
                alt={local.nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1549479361-b4fa01b81609?auto=format&fit=crop&w=800&q=80";
                }}
              />

              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                  local.dificuldade
                )} shadow-sm`}
              >
                {local.dificuldade}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                {local.nome}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {local.descricao}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {local.interesses.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-nature-mint/40 dark:bg-nature-emerald/20 text-nature-emerald dark:text-nature-light-green text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-start">
                <Link
                  to={`/route/${local.id}`}
                  className="bg-nature-emerald text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-nature-jade transition-colors duration-200 shadow-md"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLocais.length === 0 && (
        <div className="text-center text-xl text-gray-500 dark:text-gray-400 mt-10">
          Nenhum roteiro encontrado. Tente outra busca.
        </div>
      )}
    </div>
  );
};

export default ExploreRoutes;