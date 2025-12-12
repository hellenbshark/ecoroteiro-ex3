import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Define o formato de mensagem para o estado do React
interface ChatMessage {
    text: string;
    isUser: boolean;
    id: string;
}

// Define o formato de histórico esperado pelo backend (main.py)
interface APIHistoryMessage {
    role: 'user' | 'assistant';
    text: string;
}

const Chatbot: React.FC = () => {
    const navigate = useNavigate();
    
    // Mensagem inicial
    const [messages, setMessages] = useState<ChatMessage[]>([
        { text: 'Olá! Sou sua inteligência artificial de ecoturismo. Como posso ajudar você hoje?', isUser: false, id: 'init' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Rola para baixo automaticamente
    useEffect(() => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }, [messages]);

    // 🆕 FUNÇÃO PARA CONSTRUIR O HISTÓRICO PARA O BACKEND
    const getChatHistory = (): APIHistoryMessage[] => {
        // Filtra a mensagem inicial (ID 'init') e formata o restante
        return messages
            .filter(m => m.id !== 'init')
            .map(m => ({
                role: m.isUser ? 'user' : 'assistant',
                text: m.text
            }));
    };

    const send = async () => {
        if(!input.trim()) return;
        
        const userMsg = input;
        setInput(''); 
        
        // 1. Adiciona mensagem do usuário na tela
        setMessages(prev => [...prev, { text: userMsg, isUser: true, id: Date.now().toString() }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            
            // 2. CONSTRÓI O PAYLOAD COM O HISTÓRICO COMPLETO
            const currentHistory = getChatHistory();
            
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    message: userMsg, 
                    // 🔑 CORREÇÃO CRÍTICA: ENVIA O HISTÓRICO CORRETO
                    history: currentHistory 
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Adiciona resposta da IA
                setMessages(prev => [...prev, { text: data.response, isUser: false, id: (Date.now()+1).toString() }]);
            } else {
                setMessages(prev => [...prev, { text: 'Minha conexão caiu. Por favor, tente novamente.', isUser: false, id: (Date.now()+1).toString() }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: 'Erro ao conectar com o servidor.', isUser: false, id: (Date.now()+1).toString() }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // O restante do seu JSX (a renderização visual) permanece igual
        <div className="flex flex-col h-[calc(100vh-64px)] bg-nature-beige dark:bg-gray-900 transition-colors">
            
            <div className="p-4 max-w-4xl mx-auto w-full">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-nature-emerald hover:text-nature-jade font-medium flex items-center mb-4 transition-colors"
                >
                    <span className="mr-2">←</span> Voltar para o Painel
                </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[85%] md:max-w-lg p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                                m.isUser 
                                    ? 'bg-nature-emerald text-white rounded-br-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                            }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                
                {/* Animação de "Digitando..." */}
                {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 flex items-center space-x-2 w-20 justify-center">
                            <div className="w-2 h-2 bg-nature-emerald/60 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-nature-emerald/60 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-nature-emerald/60 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="pb-4" />
            </div>

            {/* Área de Input (Digitação) */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && send()}
                        className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-nature-emerald/30 dark:text-white placeholder-gray-400 transition-all shadow-inner" 
                        placeholder="Digite sua mensagem..." 
                        disabled={isLoading}
                        autoFocus
                    />
                    <button 
                        onClick={send} 
                        disabled={isLoading || !input.trim()} 
                        className="bg-nature-emerald text-white p-4 rounded-xl hover:bg-nature-jade disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        {/* Ícone de Enviar (Aviãozinho) */}
                        <svg className="w-6 h-6 transform rotate-0 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;