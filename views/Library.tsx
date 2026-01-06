
import React, { useState } from 'react';
import { BadgeCard } from '../components/BadgeCard';
import { Badge, Domain } from '../types';

interface LibraryProps {
  badges: Badge[];
  userBadges: Badge[];
  onDownload: (badge: Badge) => void;
}

export const Library: React.FC<LibraryProps> = ({ badges, userBadges, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState<Domain | 'All'>('All');

  const filtered = badges.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'All' || b.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const isAlreadyInJournal = (id: string) => userBadges.some(b => b.id === id);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h2 className="text-5xl font-bold guild-font tracking-tight text-slate-100">The Great Archive</h2>
          <p className="text-slate-400 mt-3 text-lg font-serif italic max-w-2xl">Scroll through the hall of verified trials proposed by the High Council and its Master Artisans.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search scrolls..." 
              className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl focus:outline-none focus:border-amber-500/50 w-full md:w-72 transition-all pr-12 text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
          <select 
            className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 appearance-none cursor-pointer"
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value as any)}
          >
            <option value="All">All Disciplines</option>
            {Object.values(Domain).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(badge => {
          const inJournal = isAlreadyInJournal(badge.id);
          return (
            <div key={badge.id} className="animate-in fade-in zoom-in-95 duration-500">
              <BadgeCard 
                badge={badge} 
                actionLabel={inJournal ? "Already Inscribed" : "Begin Inscription"}
                onAction={inJournal ? undefined : () => onDownload(badge)}
              />
            </div>
          );
        })}
        
        {/* Placeholder for "Request a Badge" */}
        <div className="bg-slate-800/10 border-2 border-dashed border-slate-700/50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-6 hover:bg-slate-800/20 hover:border-amber-500/30 transition-all cursor-pointer group shadow-inner">
           <div className="w-32 h-32 bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-800 transition-all duration-500 group-hover:scale-110 shadow-2xl">
              <span className="text-5xl group-hover:grayscale-0 grayscale transition-all">🕯️</span>
           </div>
           <div>
             <h4 className="text-2xl font-bold guild-font text-slate-200">The Unseen Paths</h4>
             <p className="text-xs text-slate-500 mt-3 leading-relaxed italic font-serif px-4">"Not all trials are inscribed in the Archive. Some must be forged by the Seeker in the fires of the AI Weaver."</p>
           </div>
           <button 
             onClick={() => window.location.hash = '#/designer'}
             className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-slate-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-amber-500/20"
           >
             Open The Weaver →
           </button>
        </div>
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-32 animate-in fade-in duration-700">
          <div className="text-6xl mb-6 opacity-20">🌫️</div>
          <p className="text-slate-500 font-bold guild-font text-2xl">The Archive remains obscure.</p>
          <p className="text-slate-600 text-sm mt-2 italic">Refine your search parameters to clear the mist.</p>
        </div>
      )}
    </div>
  );
};
