
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tier } from '../types';

export const Landing: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

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
      rank: Tier.GUILDMASTER,
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

  const tutorialSteps = [
    {
      title: "Welcome to the Grove",
      icon: "🪶",
      content: "The Blue Heron Guild is a decentralized ledger of adult mastery. Unlike traditional platforms, we don't own your data—you do. This is the Great Ascent, the roadmap of your journey from Seeker to Keystone."
    },
    {
      title: "The Sovereign Signet",
      icon: "🔒",
      content: "Data Sovereignty is our foundational law. When you join, you forge a cryptographic Signet. Your journal entries, evidence, and reflections are encrypted with your private key and stored locally or in your personal cloud. The Guild never sees your work unless you petition for verification."
    },
    {
      title: "The Badge Journal",
      icon: "📜",
      content: "Your Journal is your private workshop. Here you track progress on 'Trials'. Some trials require physical evidence (attachments), while others require deep synthesis (reflections). You decide when a trial is complete."
    },
    {
      title: "The AI Weaver",
      icon: "✨",
      content: "Can't find a path that fits your goal? The AI Weaver (Oracle) helps you forge custom inscriptions. You define the title and domain, and the Oracle suggests rigorous, scout-style trials. Once finalized, you can petition the Council to make your badge official for everyone."
    },
    {
      title: "Colonies & Community",
      icon: "🏰",
      content: "Mastery is not a solo flight. Colonies are local nodes where Seekers meet to practice and mentor. As you reach Artisan tier, you'll begin mentoring others, strengthening the entire guild network."
    },
    {
      title: "The High Council",
      icon: "🏛️",
      content: "The Guildmaster Council oversees the High Registry. They review badge proposals for rigor and verify 'Mastery Seals' for promotion. Their goal is to maintain the standard of excellence across all colonies."
    }
  ];

  return (
    <div className="space-y-16 pb-24 relative">
      {/* Tutorial Button - Top Right */}
      <div className="absolute top-0 right-0 z-40 animate-in fade-in slide-in-from-right-4 duration-1000">
        <button 
          onClick={() => { setShowTutorial(true); setTutorialStep(0); }}
          className="group flex items-center gap-3 bg-slate-950/50 hover:bg-amber-600 border border-amber-500/30 hover:border-amber-400 px-6 py-3 rounded-2xl transition-all shadow-2xl"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">📖</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 group-hover:text-slate-950">Seeker's Orientation</span>
        </button>
      </div>

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

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3.5rem] p-10 md:p-16 max-w-2xl w-full shadow-[0_0_100px_rgba(251,191,36,0.1)] relative">
            <button 
              onClick={() => setShowTutorial(false)}
              className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors text-xl"
            >✕</button>

            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-amber-500/10 border-2 border-amber-500/50 rounded-full flex items-center justify-center text-5xl animate-bounce shadow-2xl">
                  {tutorialSteps[tutorialStep].icon}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold guild-font text-amber-500">{tutorialSteps[tutorialStep].title}</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {tutorialSteps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === tutorialStep ? 'w-8 bg-amber-500' : 'w-2 bg-slate-800'}`}></div>
                  ))}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed font-serif italic border-l-4 border-amber-500/20 pl-8 text-left">
                  {tutorialSteps[tutorialStep].content}
                </p>
              </div>

              <div className="flex gap-4 pt-10">
                {tutorialStep > 0 && (
                  <button 
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="flex-1 py-4 border border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                  >
                    Back
                  </button>
                )}
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button 
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="flex-[2] py-4 bg-amber-600 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-amber-500 transition-all"
                  >
                    Next Revelation
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="flex-[2] py-4 bg-emerald-600 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 transition-all"
                  >
                    Begin Your Ascent
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
