import React, { useState } from 'react';
import { PROFESSIONALS } from './constants';
import { Professional, Role } from './types';
import ProfessionalCard from './components/ProfessionalCard';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  // Default to Copywriter initially
  const [activeProfessional, setActiveProfessional] = useState<Professional>(PROFESSIONALS[Role.COPYWRITER]);

  const professionalList = Object.values(PROFESSIONALS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-8 px-4 md:px-8">
      
      {/* Header */}
      <header className="mb-8 text-center max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 tracking-tight">
          Marketing Pro Hub
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Sua equipe de elite de marketing digital com inteligência artificial. 
          Selecione um especialista abaixo para começar a criar.
        </p>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-6xl flex flex-col gap-6 h-[80vh]">
        
        {/* Professional Selection Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {professionalList.map((prof) => (
            <div key={prof.id} className="h-32 md:h-40">
              <ProfessionalCard 
                professional={prof} 
                isActive={activeProfessional.id === prof.id}
                onClick={setActiveProfessional}
              />
            </div>
          ))}
        </section>

        {/* Chat Area */}
        <section className="flex-1 min-h-0 w-full">
          <ChatWindow professional={activeProfessional} />
        </section>
        
      </main>

      {/* Footer */}
      <footer className="mt-8 text-slate-600 text-xs">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;
