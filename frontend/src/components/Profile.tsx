import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const condicaoOptions = [ { label: 'Baixa', value: 'baixa' }, { label: 'Média', value: 'media' }, { label: 'Alta', value: 'alta' } ];
const nivelOptions = [ { label: 'Iniciante', value: 'iniciante' }, { label: 'Intermediário', value: 'intermediario' }, { label: 'Avançado', value: 'avancado' } ];
const interesseOptions = [ { label: 'Praia', value: 'praia' }, { label: 'Trilha', value: 'trilha' }, { label: 'Observação de Aves', value: 'observacao_aves' }, { label: 'Ecoturismo Costeiro', value: 'ecoturismo_costeiro' }, { label: 'Educação Ambiental', value: 'educacao_ambiental' } ];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [condicaoFisica, setCondicaoFisica] = useState('');
  const [nivelExperiencia, setNivelExperiencia] = useState('');
  const [interessesUsuario, setInteressesUsuario] = useState<string[]>([]);

  // 1. CARREGAR DADOS AO ABRIR A PÁGINA
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { 
        navigate('/login'); 
        return; 
      }

      try {
        const response = await fetch('http://localhost:8000/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Perfil carregado:", data); // Debug para ver se os dados chegaram

          // Preenche os campos com o que veio do banco
          if (data) {
            if (data.nome) setNome(data.nome);
            if (data.condicao_fisica) setCondicaoFisica(data.condicao_fisica);
            if (data.nivel_experiencia) setNivelExperiencia(data.nivel_experiencia);
            if (data.interesses_usuario) {
               // Garante que é uma lista (array), mesmo se vier diferente
               setInteressesUsuario(Array.isArray(data.interesses_usuario) ? data.interesses_usuario : []);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        toast.error("Não foi possível carregar seus dados.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  // 2. SALVAR DADOS
  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!nome.trim()) {
        toast.error("O nome é obrigatório.");
        return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('accessToken');

    try {
      // Prepara o pacote de dados para enviar
      const payload = {
        nome: nome, 
        condicao_fisica: condicaoFisica,
        nivel_experiencia: nivelExperiencia,
        interesses_usuario: interessesUsuario
      };

      const response = await fetch('http://localhost:8000/profile', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Perfil atualizado com sucesso!');
        
        // Atualiza o nome no cache do navegador para o menu mudar instantaneamente
        if (nome) {
            localStorage.setItem('userName', nome);
            window.dispatchEvent(new Event('userUpdated'));
        }
        
        // Opcional: Redirecionar para o Dashboard após salvar
        // Se quiser ficar na tela, remova esta linha abaixo
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      toast.error('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInterest = (val: string) => {
    setInteressesUsuario(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-nature-emerald">Carregando dados...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 bg-nature-beige dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-white/20 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-nature-emerald">Editar Perfil</h2>
            <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-nature-emerald font-medium">Voltar</button>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* CAMPO NOME (Agora editável) */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Seu Nome</label>
             <input 
                value={nome} 
                onChange={e => setNome(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-nature-emerald focus:ring-2 focus:ring-nature-emerald/20 transition-all"
                placeholder="Seu nome completo"
                required
             />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Condição Física</label>
              <select 
                value={condicaoFisica} 
                onChange={e => setCondicaoFisica(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-nature-emerald focus:ring-2 focus:ring-nature-emerald/20 transition-all"
              >
                <option value="">Selecione...</option>
                {condicaoOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Nível de Experiência</label>
              <select 
                value={nivelExperiencia} 
                onChange={e => setNivelExperiencia(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-nature-emerald focus:ring-2 focus:ring-nature-emerald/20 transition-all"
              >
                <option value="">Selecione...</option>
                {nivelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Interesses em Ecoturismo</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interesseOptions.map(o => {
                const isSelected = interessesUsuario.includes(o.value);
                return (
                  <label 
                    key={o.value} 
                    className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                        ? 'border-nature-emerald bg-nature-mint/30 dark:bg-nature-emerald/20 shadow-inner' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-nature-emerald/50'
                    }`}
                  >
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleInterest(o.value)} 
                        className="w-5 h-5 text-nature-emerald rounded focus:ring-nature-emerald" 
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{o.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full bg-nature-emerald hover:bg-nature-jade text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;