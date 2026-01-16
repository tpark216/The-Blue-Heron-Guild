
import React from 'react';
import { Badge, Domain } from '../types';

interface BadgeCardProps {
  badge: Badge;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'compact' | 'full';
}

const domainColors: Record<Domain, string> = {
  [Domain.SKILL]: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
  [Domain.SERVICE]: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  [Domain.KNOWLEDGE]: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  [Domain.ETHICS]: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  [Domain.SOCIETY]: 'text-rose-400 border-rose-500/30 bg-rose-500/5',
  [Domain.ENVIRONMENT]: 'text-teal-400 border-teal-500/30 bg-teal-500/5',
  [Domain.IDEOLOGY]: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, actionLabel, onAction, variant = 'full' }) => {
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-2xl',
    rectangle: 'rounded-xl aspect-[4/3] w-[90%] h-auto',
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500 text-[10px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-20'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-[2.5rem] p-6 hover:border-amber-500/40 transition-all flex flex-col group h-full shadow-2xl hover:shadow-amber-500/5 relative overflow-hidden">
      <div className="flex justify-center items-center mb-8 relative h-48 w-full bg-slate-950/30 rounded-3xl overflow-hidden border border-slate-800 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-slate-800/50 pointer-events-none"></div>
        
        <div className={`relative w-36 h-36 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 bg-slate-900 border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${shapeClasses[badge.badgeShape]} overflow-hidden`}>
          {badge.visualAssetUrl ? (
            <img src={badge.visualAssetUrl} alt={badge.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2">
              <span className="text-5xl drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] filter grayscale group-hover:grayscale-0 transition-all duration-500">{badge.icon || '📜'}</span>
              <div className="absolute inset-x-0 bottom-2 opacity-20 text-[6px] font-black uppercase tracking-[0.5em] text-slate-500">Official Sigil</div>
            </div>
          )}
          
          {badge.isVerified && (
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-tr from-amber-400 via-transparent to-blue-400 mix-blend-overlay"></div>
          )}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-[8px] uppercase font-black px-2 py-1 rounded-full tracking-widest ${domainColors[badge.domain]} border`}>
            {badge.domain}
          </span>
          {badge.secondaryDomains?.map(sd => (
            <span key={sd} className={`text-[8px] uppercase font-black px-2 py-1 rounded-full tracking-widest text-slate-400 border border-slate-700 bg-slate-800/50`}>
              {sd}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-end gap-1">
          {renderStars(badge.difficulty)}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 guild-font text-slate-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{badge.title}</h3>
      <p className="text-slate-400 text-xs mb-6 flex-1 italic leading-relaxed line-clamp-2">"{badge.description}"</p>
      
      {variant === 'full' && (
        <div className="space-y-3 mb-6 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Milestones</p>
            <span className="text-[8px] text-amber-500 font-bold">{badge.requirements.filter(r => r.isCompleted).length}/{badge.requirements.length}</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-amber-500/50 transition-all duration-500" 
               style={{ width: `${(badge.requirements.filter(r => r.isCompleted).length / badge.requirements.length) * 100}%` }}
             ></div>
          </div>
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="w-full bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-slate-950 py-3.5 rounded-xl font-black text-xs transition-all uppercase tracking-[0.2em] shadow-lg active:scale-95"
        >
          {actionLabel || 'Pursue Milestone'}
        </button>
      )}
    </div>
  );
};
