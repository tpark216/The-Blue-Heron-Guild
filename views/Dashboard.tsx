
import React, { useState } from 'react';
import { BadgeCard } from '../components/BadgeCard';
import { UserProfile, Tier, Domain, Badge, BadgeRequirement } from '../types';
import { getAIRecommendations } from '../services/gemini';

interface DashboardProps {
  user: UserProfile;
  onUpdateBadge: (badge: Badge) => void;
  onSubmitVerification: (badge: Badge) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateBadge, onSubmitVerification }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  
  const inProgress = user.badges.filter(b => b.requirements.some(r => !r.isCompleted));
  const completed = user.badges.filter(b => b.requirements.every(r => r.isCompleted));
  const uniqueDomains = Array.from(new Set(completed.map(b => b.domain)));

  const handleConsultOracle = async () => {
    setIsConsulting(true);
    try {
      const recs = await getAIRecommendations(user.badges, [user.tier]);
      setOracleResponse(recs);
    } catch (e) {
      setOracleResponse("The Oracle is silent. Perhaps meditation is required.");
    } finally {
      setIsConsulting(false);
    }
  };

  const updateRequirement = (badge: Badge, reqId: string, updates: Partial<BadgeRequirement>) => {
    const updatedBadge = {
      ...badge,
      requirements: badge.requirements.map(r => 
        r.id === reqId ? { ...r, ...updates } : r
      )
    };
    onUpdateBadge(updatedBadge);
    if (selectedBadge?.id === badge.id) setSelectedBadge(updatedBadge);
  };

  const handleFileUpload = (badge: Badge, reqId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateRequirement(badge, reqId, { 
          evidenceUrl: reader.result as string,
          isCompleted: true 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-20'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h2 className="text-5xl font-bold guild-font tracking-tight text-slate-100">The Badge Journal</h2>
          <p className="text-amber-500/70 text-sm font-bold tracking-[0.3em] uppercase mt-2 border-l-2 border-amber-500/30 pl-3">Custodian: {user.name}</p>
          <div className="mt-6 flex items-center space-x-4">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-[10px] border border-amber-500/40 px-3 py-1 rounded-full bg-amber-500/5 shadow-[0_0_15px_rgba(251,191,36,0.1)]">{user.tier}</span>
            <div className="h-2 w-48 bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
               <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-1000" style={{ width: `${Math.min(100, (completed.length % 5) * 20)}%` }}></div>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Next Milestone</span>
          </div>
        </div>
        <div className="flex bg-slate-800/30 backdrop-blur-md p-5 rounded-3xl border border-slate-700/40 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-700">
           <StatItem label="Mastered" value={completed.length} color="text-amber-500" />
           <StatItem label="Pursuing" value={inProgress.length} color="text-blue-400" />
           <StatItem label="Domains" value={uniqueDomains.length} color="text-emerald-400" />
        </div>
      </header>

      {/* Oracle Revelation Area */}
      <section className="bg-slate-900/80 backdrop-blur-lg border border-amber-500/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl transition-all hover:border-amber-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        {!oracleResponse ? (
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse">🔮</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold guild-font text-slate-100">The Oracle's Sight</h3>
              <p className="text-slate-400 text-sm italic mt-1">Gaze into the shifting mists to find your next trials.</p>
            </div>
            <button 
              onClick={handleConsultOracle}
              disabled={isConsulting}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isConsulting ? 'Seeking Revelation...' : 'Invoke the Sight'}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-6 duration-500 relative z-10">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold guild-font text-amber-500 flex items-center gap-3">
                 <span className="text-2xl animate-pulse">✨</span> Oracle's Revelation
               </h3>
               <button onClick={() => setOracleResponse(null)} className="text-slate-500 hover:text-white text-xs font-bold bg-slate-800/50 hover:bg-slate-700 px-4 py-1.5 rounded-full transition-all border border-slate-700/50">Close Sight</button>
            </div>
            <div className="text-slate-200 italic leading-relaxed font-serif whitespace-pre-wrap text-lg bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10">
              {oracleResponse}
            </div>
          </div>
        )}
      </section>

      {/* Active Badges */}
      <section>
        <div className="flex items-center space-x-6 mb-10">
          <h3 className="text-2xl font-bold guild-font tracking-widest text-slate-400 uppercase text-xs">The Ledger of Trials</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
        </div>
        
        {inProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {inProgress.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                actionLabel="Review Journal Entry"
                onAction={() => setSelectedBadge(badge)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-800/10 rounded-[3rem] border-2 border-dashed border-slate-700/30 flex flex-col items-center animate-in fade-in zoom-in-95">
             <div className="text-6xl mb-6 opacity-20 filter grayscale">📖</div>
             <p className="text-slate-400 font-bold guild-font text-xl">Your journal is currently silent.</p>
             <p className="text-slate-600 text-sm mt-2 max-w-xs italic leading-relaxed">Seek the Archive or weave a new path with the AI Weaver to begin your next chapter.</p>
          </div>
        )}
      </section>

      {/* Modal View */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="bg-slate-900 border border-amber-500/20 rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto p-10 md:p-16 scrollbar-hide relative shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedBadge(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all bg-slate-800/80 w-12 h-12 rounded-full flex items-center justify-center border border-slate-700 shadow-xl">✕</button>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16 border-b border-slate-800/50 pb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150 group-hover:bg-amber-500/30 transition-all opacity-50"></div>
                <div className={`relative w-48 h-48 flex items-center justify-center transition-all duration-700 bg-slate-900 border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 ${selectedBadge.badgeShape === 'circle' ? 'rounded-full' : (selectedBadge.badgeShape === 'rectangle' ? 'rounded-xl aspect-[4/3] w-60 h-44' : 'rounded-3xl')} overflow-hidden`}>
                  {selectedBadge.visualAssetUrl ? (
                    <img src={selectedBadge.visualAssetUrl} alt="Artwork" className="w-full h-full object-cover shadow-2xl" />
                  ) : (
                    <span className="text-7xl">{selectedBadge.icon || '📜'}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <h3 className="text-5xl font-bold guild-font text-amber-500 tracking-tight">{selectedBadge.title}</h3>
                   {selectedBadge.isVerified && <span className="text-emerald-500 text-3xl filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="Verified Mastery">🛡️</span>}
                </div>
                <p className="text-slate-400 leading-relaxed max-w-3xl text-xl italic font-serif">"{selectedBadge.description}"</p>
                <div className="flex justify-center md:justify-start gap-4 mt-8">
                  <span className="text-[10px] uppercase font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded-full tracking-[0.3em] border border-amber-500/20 shadow-inner">{selectedBadge.domain}</span>
                  <div className="flex flex-col items-center md:items-start gap-1">
                    <span className="text-[8px] uppercase font-black text-slate-500 tracking-[0.1em]">Complexity</span>
                    {renderStars(selectedBadge.difficulty)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em] border-b border-slate-800 pb-4 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> 
                    The Path of Trials
                  </span>
                  <span className="text-slate-500 font-bold">{selectedBadge.requirements.filter(r => r.isCompleted).length} / {selectedBadge.requirements.length} Trials</span>
                </h4>
                <div className="space-y-5">
                  {selectedBadge.requirements.map((req, idx) => (
                    <div key={req.id} className={`bg-slate-800/20 border border-slate-800 rounded-2xl p-6 transition-all hover:bg-slate-800/40 ${req.isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                           <div className="flex items-center gap-4 mb-2">
                              <span className="text-amber-500/40 font-serif font-bold italic">{idx + 1}.</span>
                              <p className={`text-base font-bold leading-tight ${req.isCompleted ? 'text-slate-100' : 'text-slate-500'}`}>{req.description}</p>
                           </div>
                           {req.evidenceNote && <p className="text-sm text-slate-500 italic ml-8 mt-3 border-l-2 border-slate-700 pl-4 py-1 leading-relaxed">"{req.evidenceNote}"</p>}
                        </div>
                        
                        {req.isCompleted ? (
                          <div className="flex items-center gap-4">
                            {req.evidenceUrl && <div className="w-14 h-14 rounded-xl border-2 border-slate-700 bg-slate-950 overflow-hidden shadow-2xl transition-transform hover:scale-150 hover:z-20 cursor-pointer"><img src={req.evidenceUrl} className="w-full h-full object-cover" /></div>}
                            <button 
                              onClick={() => updateRequirement(selectedBadge, req.id, { isCompleted: false, evidenceUrl: undefined })}
                              className="text-[10px] text-rose-500 font-black uppercase tracking-widest hover:text-rose-400 transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-3 shrink-0">
                             <input 
                               type="file" 
                               id={`file-${req.id}`} 
                               className="hidden" 
                               onChange={(e) => handleFileUpload(selectedBadge, req.id, e)} 
                             />
                             <label 
                               htmlFor={`file-${req.id}`}
                               className="text-[10px] bg-slate-700 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl cursor-pointer transition-all uppercase tracking-[0.1em] shadow-lg"
                             >
                               Attach
                             </label>
                             <button 
                               onClick={() => {
                                 const note = prompt("Inscribe your textual proof for this requirement:");
                                 if (note) updateRequirement(selectedBadge, req.id, { evidenceNote: note, isCompleted: true });
                               }}
                               className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-white font-black px-4 py-2 rounded-xl uppercase tracking-[0.1em] border border-slate-700 transition-all shadow-lg"
                             >
                               Note
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em] border-b border-slate-800 pb-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Seeker's Synthesis
                </h4>
                <textarea 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl p-8 text-lg text-slate-300 focus:outline-none focus:border-amber-500/50 h-80 resize-none placeholder:italic leading-relaxed shadow-inner font-serif italic"
                  placeholder="Inscribe the wisdom you have synthesized... What truths have been uncovered in your journey across these trials?"
                  defaultValue={selectedBadge.reflections}
                  onBlur={(e) => onUpdateBadge({...selectedBadge, reflections: e.target.value})}
                />
                
                <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl backdrop-blur-sm">
                   <p className="text-[11px] text-amber-500 font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                     <span className="text-sm">🔏</span> Sovereign Privacy Seal
                   </p>
                   <p className="text-xs text-slate-500 leading-relaxed italic font-serif">"This ledger remains your own. Evidence is encrypted by your Signet Key and stays hidden from the High Council until you explicitly summon them for verification."</p>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-800/50 flex flex-col md:flex-row gap-6">
              <button 
                onClick={() => setSelectedBadge(null)}
                className="flex-1 py-5 rounded-2xl border-2 border-slate-800 font-black hover:bg-slate-800 text-slate-500 hover:text-white transition-all uppercase tracking-[0.3em] text-xs"
              >
                Seal Entry
              </button>
              {selectedBadge.requirements.every(r => r.isCompleted) && (
                <button 
                  onClick={() => {
                    onSubmitVerification(selectedBadge);
                    setSelectedBadge(null);
                  }}
                  className="flex-[2] py-5 rounded-2xl bg-amber-600 text-slate-950 font-black hover:bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] transform hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3"
                >
                  <span>Request High Verification</span>
                  <span className="text-xl">⚖️</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mastery Archive */}
      {completed.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 pb-12">
          <div className="flex items-center space-x-6 mb-12">
            <h3 className="text-2xl font-bold guild-font tracking-widest text-slate-400 uppercase text-xs">The Hall of Mastery</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
            {completed.map(badge => (
              <div 
                key={badge.id} 
                className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800/40 text-center flex flex-col items-center group transition-all hover:bg-slate-800/80 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 cursor-pointer relative"
                onClick={() => setSelectedBadge(badge)}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full scale-150 blur-2xl group-hover:bg-amber-500/40 transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="text-5xl group-hover:scale-125 transition-transform duration-500 relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    {badge.visualAssetUrl ? (
                      <img src={badge.visualAssetUrl} alt={badge.title} className="w-full h-full object-cover rounded-xl shadow-lg" />
                    ) : (
                      badge.icon || '📜'
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center text-[10px] text-slate-950 font-black z-20">✓</div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-amber-500 transition-colors leading-tight">{badge.title}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="text-center px-10 first:border-0 border-l border-slate-700/50">
    <div className={`text-4xl font-bold ${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>{value}</div>
    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2 whitespace-nowrap">{label}</div>
  </div>
);
