import React from 'react';
import { Professional } from '../types';

interface ProfessionalCardProps {
  professional: Professional;
  isActive: boolean;
  onClick: (prof: Professional) => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(professional)}
      className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 border text-left w-full h-full
        ${isActive 
          ? `bg-slate-800 border-${professional.color.replace('bg-', '')} shadow-lg shadow-${professional.color.replace('bg-', '')}/20 scale-[1.02]` 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
        }
      `}
    >
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-full mb-3 text-2xl shadow-inner
        ${isActive ? `bg-gradient-to-br ${professional.gradient} text-white` : 'bg-slate-700 text-slate-400 group-hover:bg-slate-700/80'}
      `}>
        {professional.icon}
      </div>
      
      <div className="flex flex-col items-center text-center">
        <h3 className={`font-bold text-sm md:text-base mb-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
          {professional.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2">
          {professional.title}
        </p>
      </div>

      {isActive && (
        <div className={`absolute -bottom-[1px] left-1/2 transform -translate-x-1/2 w-1/3 h-[3px] rounded-t-full bg-gradient-to-r ${professional.gradient}`} />
      )}
    </button>
  );
};

export default ProfessionalCard;
