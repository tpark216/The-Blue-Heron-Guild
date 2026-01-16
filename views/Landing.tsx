
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tier, Domain } from '../types';
import { TIER_ASCENSION_MAP } from '../constants';

export const Landing: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const domainDefinitions = [
    {
      domain: Domain.IDEOLOGY,
      title: 'Ideologies',
      icon: '🧠',
      content: 'Beliefs and institutions that guide the values that we share and communities we create. These can be political, religious, or ideological systems.'
    },
    {
      domain: Domain.ETHICS,
      title: 'Ethics',
      icon: '⚖️',
      content: "The rules and regulations that guide our community's progression and how we should treat those outside of our ideological beliefs and institutions."
    },
    {
      domain: Domain.ENVIRONMENT,
      title: 'Environment',
      icon: '🌿',
      content: 'The world in which our community inhabits and the duty we owe to it.'
    },
    {
      domain: Domain.SOCIETY,
      title: 'Society',
      icon: '🏗️',
      content: 'The diverse communities that make our world or have shaped our world and the lessons we can take away from them. This is more sociological and anthropological in nature.'
    }
  ];

  const tiers = [
    { rank: Tier.MEMBER, icon: '🌱', label: 'The Foundation' },
    { rank: Tier.SEEKER, icon: '🌿', label: 'Active Curiosity' },
    { rank: Tier.WAYFARER, icon: '👣', label: 'The Path Forward' },
    { rank: Tier.JOURNEYER, icon: '🛶', label: 'Colony Service' },
    { rank: Tier.ARTISAN, icon: '⚒️', label: 'Expert Mastery' },
    { rank: Tier.WARDEN, icon: '🛡️', label: 'Stewardship' },
    { rank: Tier.KEYSTONE, icon: '💎', label: 'Pinnacle Influence' }
  ];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-1000">
      <header className="text-center space-y-4 max-w-4xl mx-auto py-8">
        <h2 className="text-5xl md:text-7xl font-bold guild-font tracking-tighter text-slate-100 uppercase leading-none">The Great Ascent</h2>
        <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto">"An architected path of mastery, service, and sovereign identity."</p>
      </header>

      {/* Domain Information Blocks */}
      <section className="bg-slate-950/50 border border-slate-800 p-8 md:p-12 rounded-[4rem] shadow-inner">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold guild-font text-amber-500 uppercase tracking-widest">Domains of the Guild</h3>
          <p className="text-slate-500 text-sm italic font-serif mt-2">The four pillars of our collective curricula.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domainDefinitions.map((d) => (
            <div key={d.domain} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all group">
              <div className="flex items-center gap-4">
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">{d.icon}</span>
                <h4 className="text-xl font-bold guild-font text-slate-100 uppercase">{d.title}</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-serif italic">"{d.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ascension Progression Visualization */}
      <section className="space-y-12">
        <div className="text-center">
          <h3 className="text-3xl font-bold guild-font text-slate-100 uppercase tracking-widest">The Tiered Path</h3>
          <p className="text-slate-500 text-sm mt-2 font-serif italic">Select a rank to view the paired Mandatory Keystones and ascension requirements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t, i) => (
            <button
              key={t.rank}
              onClick={() => setSelectedTier(t.rank)}
              className={`bg-slate-800/40 border-2 p-8 rounded-[3rem] text-left group transition-all shadow-xl relative overflow-hidden flex flex-col hover:scale-[1.05] ${
                selectedTier === t.rank ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl group-hover:rotate-12 transition-transform">{t.icon}</span>
                <div>
                  <h4 className="text-xl font-bold guild-font text-slate-100 uppercase tracking-tighter leading-none">{t.rank}</h4>
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-1">Tier {i}</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">{t.label}</p>
              <div className="mt-auto flex items-center justify-between text-amber-500/60 font-black text-[9px] uppercase tracking-widest">
                <span>View Requirements</span>
                <span className="text-lg">↗</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Requirements Modal */}
      {selectedTier && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 border-2 border-amber-500/30 rounded-[4rem] p-10 md:p-14 max-w-3xl w-full shadow-3xl relative overflow-y-auto max-h-[90vh] scrollbar-hide">
            <button onClick={() => setSelectedTier(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white text-xl p-2 transition-colors">✕</button>
            
            <div className="flex items-center gap-6 mb-12 border-b border-slate-800 pb-10">
              <div className="text-7xl">
                {tiers.find(t => t.rank === selectedTier)?.icon}
              </div>
              <div>
                <h3 className="text-4xl font-bold guild-font text-slate-100 uppercase tracking-tighter leading-none">Ascending to {selectedTier}</h3>
                <p className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mt-3">Mandatory Keystone Pairs & Milestones</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 border-b border-slate-800 pb-2">Mandatory Keystones</h4>
                <div className="space-y-4">
                  {TIER_ASCENSION_MAP[selectedTier].filter(r => r.description.includes('Keystone')).map(k => (
                    <div key={k.id} className="bg-slate-950 border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4 group hover:border-amber-500 transition-all">
                      <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                      <p className="text-xs text-slate-200 font-bold leading-tight">{k.description.replace('Master ', '')}</p>
                    </div>
                  ))}
                  {TIER_ASCENSION_MAP[selectedTier].filter(r => r.description.includes('Keystone')).length === 0 && (
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-dashed border-slate-800 text-center">
                      <p className="text-xs text-slate-600 italic">Universal orientation completed upon entry.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 border-b border-slate-800 pb-2">Growth Milestones</h4>
                <div className="space-y-3">
                  {TIER_ASCENSION_MAP[selectedTier].filter(r => !r.description.includes('Keystone')).map(m => (
                    <div key={m.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-start gap-4">
                      <span className="text-amber-500 mt-1">●</span>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                  {TIER_ASCENSION_MAP[selectedTier].filter(r => !r.description.includes('Keystone')).length === 0 && (
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-dashed border-slate-700">
                      <p className="text-xs text-slate-600 italic">Initial registry status secured.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 text-center">
              <button onClick={() => setSelectedTier(null)} className="px-16 py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95">Accept the Trial</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-12">
        <Link to="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
          Return to Badge Journal
        </Link>
      </div>
    </div>
  );
};
