
import React from 'react';
import { Link } from 'react-router-dom';
import { Tier } from '../types';

export const Landing: React.FC = () => {
  const tiers = [
    {
      rank: Tier.SEEKER,
      icon: '🌿',
      requirements: ['Complete Onboarding', 'Submit first badge proposal'],
      description: 'The first step into the grove. A seeker looks for connection and purpose.'
    },
    {
      rank: Tier.WAYFARER,
      icon: '👣',
      requirements: ['Earn 5 badges', 'Spanning at least 2 domains'],
      description: 'A traveler of the mapped paths, beginning to synthesize diverse skills.'
    },
    {
      rank: Tier.JOURNEYER,
      icon: '🛶',
      requirements: ['Earn 10 badges', 'Demonstrate sustained effort'],
      description: 'Commitment to the long walk. The journeyer finds rhythm in growth.'
    },
    {
      rank: Tier.ARTISAN,
      icon: '⚒️',
      requirements: ['Achieve depth in a skill area', 'Mentor at least one Seeker'],
      description: 'Mastery takes form. An artisan gives back as they climb.'
    },
    {
      rank: Tier.WARDEN,
      icon: '🛡️',
      requirements: ['Earn 20+ badges', 'Lead service projects', 'Design a community badge'],
      description: 'A protector of the guild values and a leader of the colonies.'
    },
    {
      rank: Tier.KEYSTONE,
      icon: '💎',
      requirements: ['Earn 30+ badges', 'Capstone project with public impact', '12 Mandatory Keystone Badges'],
      description: 'The pinnacle of ethical service and legacy. A foundation for the future.'
    }
  ];

  return (
    <div className="space-y-16 pb-24">
      <header className="text-center space-y-6 max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="flex justify-center mb-4">
           <span className="text-7xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">🪶</span>
        </div>
        <h2 className="text-6xl font-bold guild-font tracking-tight text-slate-100">The Great Ascent</h2>
        <p className="text-xl text-slate-400 font-serif italic leading-relaxed">
          "The Heron does not fly the path alone. Every wingbeat strengthens the colony, and every height reached becomes a bridge for those who follow."
        </p>
        <div className="pt-8">
          <Link to="/dashboard" className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95">
            Enter My Journal
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiers.map((t, i) => (
          <div 
            key={t.rank} 
            className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[3rem] group hover:border-amber-500/40 transition-all shadow-xl hover:shadow-amber-500/5 relative overflow-hidden flex flex-col"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl group-hover:opacity-10 transition-all pointer-events-none">
              {t.icon}
            </div>
            <div className="flex items-center gap-4 mb-6">
               <span className="text-4xl bg-slate-900 p-4 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">{t.icon}</span>
               <div>
                  <h3 className="text-2xl font-bold guild-font text-slate-100 group-hover:text-amber-500 transition-colors">{t.rank}</h3>
                  <p className="text-[10px] text-amber-500/50 font-black uppercase tracking-widest">Ascension Level {i + 1}</p>
               </div>
            </div>
            
            <p className="text-slate-400 text-sm italic mb-8 leading-relaxed font-serif">"{t.description}"</p>
            
            <div className="space-y-4 mt-auto">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] border-b border-slate-700 pb-2">The Required Trials</p>
               <ul className="space-y-3">
                  {t.requirements.map((req, ridx) => (
                    <li key={ridx} className="flex items-start gap-3 text-xs text-slate-300">
                       <span className="text-amber-500">✦</span>
                       <span className="leading-tight">{req}</span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        ))}
      </section>

      <footer className="bg-slate-950 border-2 border-slate-800 p-12 rounded-[4rem] text-center max-w-3xl mx-auto shadow-3xl">
         <h4 className="text-2xl font-bold guild-font text-amber-500 mb-4">The Sovereign Promise</h4>
         <p className="text-slate-400 text-sm leading-relaxed italic font-serif">
           "Your growth is yours alone. Our role is to witness, to verify, and to hold the space for your mastery. The Guild is not a destination, but the collective pulse of every Seeker who dares to forge a path."
         </p>
         <div className="mt-8 flex justify-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-4xl">🏛️</span>
            <span className="text-4xl">🌿</span>
            <span className="text-4xl">⚖️</span>
         </div>
      </footer>
    </div>
  );
};
