// Serviço para integração com o backend do chatbot
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  message: string;
  user_id?: string;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export class ChatService {
  static async sendMessage(message: string, userId?: string): Promise<ChatResponse> {
    try {
      const payload: ChatMessage = {
        message,
        user_id: userId
      };

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem para o backend:', error);
      // Fallback para resposta simulada em caso de erro
      return {
        response: 'Desculpe, estou com dificuldades técnicas. Tente novamente em alguns instantes.',
        suggestions: ['Tente novamente', 'Verifique sua conexão']
      };
    }
  }

  // Método para obter sugestões de roteiros baseadas no perfil do usuário
  static async getRouteSuggestions(userProfile: {
    experience_level: string;
    physical_condition: string;
    interests: string[];
    duration_preference: string;
    group_size: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_profile: userProfile }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao obter sugestões de roteiros:', error);
      return [];
    }
  }
}

// Respostas simuladas para desenvolvimento
export const mockResponses = {
  iniciante: 'Recomendo a Trilha do Parque do Cocó! É perfeita para iniciantes, com caminhada leve de 2km pela mata ciliar. Você pode observar aves e a natureza preservada. 🦜🌿',
  
  intermediario: 'Que tal a Trilha da Lagoa do Papicu? É um percurso de 4km com nível intermediário, passando por lagoas naturais e áreas de restinga. Ideal para quem já tem alguma experiência! 🏞️',
  
  avancado: 'Para aventura mais intensa, sugiro a Trilha do Morro do Careca em Maranguape! São 6km de subida com vista panorâmica incrível. Requer preparo físico, mas a recompensa vale a pena! ⛰️',
  
  praia: 'Ótima escolha! Recomendo o Ecoturismo na Praia do Futuro com foco em educação ambiental. Você pode participar de limpeza de praia e aprender sobre preservação marinha! 🏖️🌊',
  
  aves: 'Perfeito! O Parque do Cocó é o melhor local para observação de aves em Fortaleza. São mais de 200 espécies! Leve binóculos e venha no período da manhã (6h-10h) para melhor visualização. 🦅🔍',
  
  custo: 'Ótimas notícias! A maioria dos nossos roteiros são gratuitos ou com custo muito baixo (R$ 10-30). O Parque do Cocó é totalmente gratuito! Investimos em turismo sustentável acessível. 💚',
  
  tempo: 'Nossos roteiros variam de 2 a 6 horas, dependendo do nível escolhido. Trilhas leves: 2-3h, intermediárias: 3-4h, avançadas: 4-6h. Sempre com pausas para descanso e contemplação! ⏰',
  
  equipamento: 'Para qualquer trilha, leve: água, protetor solar, repelente, tênis confortável, boné e câmera! Para trilhas avançadas: lanterna, lanche e kit primeiros socorros. Sempre priorize a segurança! 🎒',
  
  default: 'Que interessante! Me conte mais sobre seu nível de experiência e o que mais te interessa: trilhas, praias, observação de aves, ou algo específico? Posso personalizar a sugestão para você! 🌿✨'
};
