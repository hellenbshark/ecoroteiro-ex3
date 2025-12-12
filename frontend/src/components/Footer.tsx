import React from 'react';
const Footer: React.FC = () => {
  return (
    <footer className="bg-nature-moss text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h3 className="text-2xl font-bold font-inter mb-4">🌿 EcoRoteiro</h3>
        <p className="text-nature-light-green text-sm">Descubra os melhores roteiros de ecoturismo com inteligência artificial.</p>
        <div className="border-t border-nature-sage/30 mt-8 pt-8 text-sm text-nature-light-green">
          © 2025 EcoRoteiro. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
export default Footer;