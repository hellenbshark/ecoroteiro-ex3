import React from 'react';
import yanneImg from '../images/yanne.jpg';
import jamileImg from '../images/Jamilly.jpg';
import mariImg from '../images/Mari.jpg';
import vilmaImg from '../images/Vilma.jpg';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto pb-12 bg-nature-beige dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
        
        <h1 className="text-4xl font-extrabold text-nature-emerald mb-6 border-b pb-2">
          Sobre o EcoRoteiro
        </h1>

        <section className="mb-8 space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            O EcoRoteiro nasceu com a missão de democratizar o acesso ao ecoturismo sustentável no Ceará, utilizando o poder da Inteligência Artificial para personalizar experiências de viagem. Nosso objetivo é conectar você com a natureza de forma responsável, respeitando seus limites e seus interesses.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Acreditamos que a tecnologia deve servir para promover a conservação ambiental e o desenvolvimento local através de roteiros acessíveis e seguros.
          </p>
        </section>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 border-b pb-1">
          Nossa Equipe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">

          {/* YANNE OLIVEIRA */}
          <div className="flex items-center gap-4 p-4 bg-green-200/30 dark:bg-gray-700 rounded-xl">
            <img 
              src={yanneImg}
              alt="Foto Yanne Oliveira"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
            <p className="font-semibold text-gray-800 dark:text-gray-100">Yanne Oliveira</p>
          </div>
          
          {/* JAMILLE HELLEN */}
          <div className="flex items-center gap-4 p-4 bg-green-200/30 dark:bg-gray-700 rounded-xl">
            <img  
              src={jamileImg}  
              alt="Foto Jamile Hellen"  
              className="w-24 h-24 rounded-full object-cover shadow-md" 
            />
            <p className="font-semibold text-gray-800 dark:text-gray-100">Jamile Hellen</p>
          </div>

          {/* MARIANNA ONOFRE */}
          <div className="flex items-center gap-4 p-4 bg-green-200/30 dark:bg-gray-700 rounded-xl">
            <img 
              src={mariImg}
              alt="Foto Marianna Onofre" 
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
            <p className="font-semibold text-gray-800 dark:text-gray-100">Marianna Onofre</p>
          </div>
          
          {/* VILMA ARAÚJO */}
          <div className="flex items-center gap-4 p-4 bg-green-200/30 dark:bg-gray-700 rounded-xl">
            <img 
              src={vilmaImg}
              alt="Foto Vilma Araújo" 
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
            <p className="font-semibold text-gray-800 dark:text-gray-100">Vilma Araújo</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;