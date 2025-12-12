import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityMenu: React.FC = () => {
  const { theme, toggleTheme, increaseFontSize, decreaseFontSize, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  
  // Posição inicial
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Referências para o cálculo de arraste
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // Calcula se o botão está na metade de baixo/cima ou direita/esquerda da tela
  const isRightSide = position.x > window.innerWidth / 2;
  const isBottomSide = position.y > window.innerHeight / 2;

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setIsDragging(true);
    setHasMoved(false);
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    };

    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragRef.current) return;

      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasMoved(true);
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 70, dragRef.current.initialX + deltaX));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, dragRef.current.initialY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const toggleMenu = () => {
    if (!hasMoved) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className="fixed z-50 flex flex-col"
      style={{ left: position.x, top: position.y, touchAction: 'none' }}
    >
      {/* Menu Adaptativo */}
      <div
        className={`absolute w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-nature-mint/30 dark:border-gray-700 transition-all duration-300
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          ${isBottomSide ? 'bottom-16' : 'top-16'} 
          ${isRightSide ? 'right-0 origin-bottom-right' : 'left-0 origin-bottom-left'}
        `}
      >
        <h3 className="text-nature-emerald dark:text-nature-light-green font-bold mb-3 text-sm uppercase tracking-wider flex justify-between items-center">
          Acessibilidade
          <span className="text-[10px] text-gray-400 font-normal normal-case leading-tight text-right">Arraste o botão<br/>para mover</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-200">Modo Escuro</span>
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-nature-emerald' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <div>
            <span className="text-sm text-gray-700 dark:text-gray-200 block mb-2">Tamanho da Fonte</span>
            <div className="flex items-center gap-2">
              <button onClick={decreaseFontSize} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg text-sm font-bold transition-colors">A-</button>
              <button onClick={resetSettings} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg text-xs transition-colors">Reset</button>
              <button onClick={increaseFontSize} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg text-lg font-bold transition-colors">A+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Botão com Ícone de Braços Abertos */}
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none cursor-move ${
            isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-nature-emerald text-white'
        } ${isDragging ? 'cursor-grabbing shadow-2xl scale-110' : 'cursor-grab'}`}
        title="Acessibilidade (Arraste para mover)"
      >
        {isOpen ? (
            <span className="text-2xl font-bold">✕</span>
        ) : (
            <svg className="w-8 h-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
        )}
      </button>
    </div>
  );
};

export default AccessibilityMenu;