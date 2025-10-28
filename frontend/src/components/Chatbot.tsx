import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Oi! Quer descobrir uma trilha ecológica em Fortaleza ou região metropolitana?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular resposta da IA
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('iniciante') || input.includes('leve') || input.includes('fácil')) {
      return 'Recomendo a Trilha do Parque do Cocó! É perfeita para iniciantes, com caminhada leve de 2km pela mata ciliar. Você pode observar aves e a natureza preservada. 🦜🌿';
    }
    
    if (input.includes('intermediário') || input.includes('médio')) {
      return 'Que tal a Trilha da Lagoa do Papicu? É um percurso de 4km com nível intermediário, passando por lagoas naturais e áreas de restinga. Ideal para quem já tem alguma experiência! 🏞️';
    }
    
    if (input.includes('avançado') || input.includes('difícil')) {
      return 'Para aventura mais intensa, sugiro a Trilha do Morro do Careca em Maranguape! São 6km de subida com vista panorâmica incrível. Requer preparo físico, mas a recompensa vale a pena! ⛰️';
    }
    
    if (input.includes('praia') || input.includes('mar')) {
      return 'Ótima escolha! Recomendo o Ecoturismo na Praia do Futuro com foco em educação ambiental. Você pode participar de limpeza de praia e aprender sobre preservação marinha! 🏖️🌊';
    }
    
    if (input.includes('observação') || input.includes('aves') || input.includes('pássaros')) {
      return 'Perfeito! O Parque do Cocó é o melhor local para observação de aves em Fortaleza. São mais de 200 espécies! Leve binóculos e venha no período da manhã (6h-10h) para melhor visualização. 🦅🔍';
    }
    
    if (input.includes('custo') || input.includes('preço') || input.includes('gratuito')) {
      return 'Ótimas notícias! A maioria dos nossos roteiros são gratuitos ou com custo muito baixo (R$ 10-30). O Parque do Cocó é totalmente gratuito! Investimos em turismo sustentável acessível. 💚';
    }
    
    if (input.includes('tempo') || input.includes('duração') || input.includes('horas')) {
      return 'Nossos roteiros variam de 2 a 6 horas, dependendo do nível escolhido. Trilhas leves: 2-3h, intermediárias: 3-4h, avançadas: 4-6h. Sempre com pausas para descanso e contemplação! ⏰';
    }
    
    if (input.includes('equipamento') || input.includes('o que levar')) {
      return 'Para qualquer trilha, leve: água, protetor solar, repelente, tênis confortável, boné e câmera! Para trilhas avançadas: lanterna, lanche e kit primeiros socorros. Sempre priorize a segurança! 🎒';
    }
    
    // Resposta padrão
    return 'Que interessante! Me conte mais sobre seu nível de experiência e o que mais te interessa: trilhas, praias, observação de aves, ou algo específico? Posso personalizar a sugestão para você! 🌿✨';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-mint/20 via-nature-emerald/10 to-nature-lime/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-nature-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Título */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-nature-emerald to-nature-jade rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌿</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-nature-emerald">EcoRoteiro</h1>
                  <p className="text-sm text-gray-600">Chat de Roteiros Ecológicos</p>
                </div>
              </button>
            </div>

            {/* Botão Voltar */}
            <button
              onClick={() => navigate('/')}
              className="bg-nature-emerald text-white px-4 py-2 rounded-lg hover:bg-nature-jade transition-colors duration-200"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-nature-emerald to-nature-jade text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-nature-mint/30'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 border border-nature-mint/30 px-4 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-nature-emerald rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-nature-emerald rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-nature-emerald rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">IA está pensando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-nature-mint/30 p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem aqui..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-emerald focus:outline-none transition-colors duration-200"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-nature-emerald to-nature-jade text-white px-6 py-3 rounded-xl font-semibold hover:from-nature-jade hover:to-nature-forest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Enviar</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


