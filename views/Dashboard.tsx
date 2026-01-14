
import React, { useState } from 'react';
import { BadgeCard } from '../components/BadgeCard';
import { UserProfile, Tier, Badge, BadgeRequirement, BadgeProposal, PromotionRequest, ActionStatement } from '../types';
import { getAIRecommendations } from '../services/gemini';

interface DashboardProps {
  user: UserProfile;
  pendingBadges: BadgeProposal[];
  onUpdateBadge: (badge: Badge) => void;
  onSubmitVerification: (badge: Badge) => void;
  onRequestPromotion: (promo: Omit<PromotionRequest, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, pendingBadges, onUpdateBadge, onSubmitVerification, onRequestPromotion }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  // Promotion State
  const [targetTier, setTargetTier] = useState<Tier>(Tier.WAYFARER);
  const [supportingBadgeIds, setSupportingBadgeIds] = useState<string[]>([]);
  const [statements, setStatements] = useState<ActionStatement[]>([]);

  const inProgress = user.badges.filter(b => b.requirements.some(r => !r.isCompleted));
  const completed = user.badges.filter(b => b.requirements.every(r => r.isCompleted));
  const userPendingBadges = pendingBadges.filter(p => p.status === 'pending');

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
      requirements: badge.requirements.map(r => r.id === reqId ? { ...r, ...updates } : r)
    };
    onUpdateBadge(updatedBadge);
    if (selectedBadge?.id === badge.id) setSelectedBadge(updatedBadge);
  };

  const checkCompletion = (req: BadgeRequirement): boolean => {
    const hasEvidence = req.requireAttachment ? !!req.evidenceUrl : true;
    const hasNote = req.requireNote ? !!req.evidenceNote : true;
    return hasEvidence && hasNote;
  };

  const handleFileUpload = (badge: Badge, reqId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const req = badge.requirements.find(r => r.id === reqId);
        if (!req) return;
        const updates: Partial<BadgeRequirement> = { evidenceUrl: reader.result as string };
        const tempReq = { ...req, ...updates };
        updates.isCompleted = checkCompletion(tempReq);
        updateRequirement(badge, reqId, updates);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPromotionRequest = () => {
    onRequestPromotion({
      targetTier,
      supportingBadgeIds,
      actionStatements: statements
    });
    setIsPromoting(false);
    setSupportingBadgeIds([]);
    setStatements([]);
  };

  const addStatement = (title: string) => {
    setStatements([...statements, {
      requirementTitle: title,
      intent: '',
      difficulties: '',
      lessons: '',
      referenceContact: ''
    }]);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h2 className="text-5xl font-bold guild-font text-slate-100">The Badge Journal</h2>
          <p className="text-amber-500/70 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Custodian: {user.name}</p>
          <div className="mt-6 flex items-center gap-4">
             <span className="text-amber-500 font-bold uppercase text-[10px] border border-amber-500/30 px-4 py-1.5 rounded-full bg-amber-500/5">{user.tier}</span>
             <button onClick={() => setIsPromoting(true)} className="bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-slate-950 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-700 transition-all">Request Promotion</button>
          </div>
        </div>
      </header>

      {/* Oracle Revelation */}
      <section className="bg-slate-900/80 border border-amber-500/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        {!oracleResponse ? (
          <div className="flex items-center gap-8 relative z-10">
            <div className="text-5xl animate-pulse">🔮</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold guild-font text-slate-100">Oracle's Sight</h3>
              <p className="text-slate-400 text-sm italic mt-1">Consult the mists for your next path.</p>
            </div>
            <button onClick={handleConsultOracle} disabled={isConsulting} className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
              {isConsulting ? 'Consulting...' : 'Invoke Sight'}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-6 duration-500">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold guild-font text-amber-500">Oracle's Revelation</h3>
               <button onClick={() => setOracleResponse(null)} className="text-xs text-slate-500 hover:text-white uppercase font-black">✕ Close</button>
             </div>
             <p className="text-slate-200 italic font-serif leading-relaxed whitespace-pre-wrap">{oracleResponse}</p>
          </div>
        )}
      </section>

      {/* Pending Inscriptions Section */}
      {userPendingBadges.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-6">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-6 border-l-4 border-amber-500 pl-4">Pending Approval Inscriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPendingBadges.map(prop => (
              <div key={prop.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl opacity-60">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">📜</div>
                  <div>
                    <h4 className="font-bold text-slate-200">{prop.badge.title}</h4>
                    <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Awaiting Council Review</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">"Sent on {new Date(prop.submittedAt).toLocaleDateString()}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ledger of Trials (Active) */}
      <section>
        <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-8">Current Trials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {inProgress.map(badge => (
            <BadgeCard key={badge.id} badge={badge} actionLabel="Review Journal" onAction={() => setSelectedBadge(badge)} />
          ))}
        </div>
      </section>

      {/* Hall of Mastery (Completed) */}
      {completed.length > 0 && (
        <section className="pt-12 border-t border-slate-800">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-12">Hall of Mastery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
            {completed.map(badge => (
              <div key={badge.id} className="text-center group cursor-pointer" onClick={() => setSelectedBadge(badge)}>
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-900 border-2 border-slate-800 rounded-2xl flex items-center justify-center group-hover:border-amber-500 transition-all relative overflow-hidden">
                   <div className="text-4xl relative z-10">{badge.icon || '📜'}</div>
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-black">✓</div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">{badge.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotion Request Modal */}
      {isPromoting && (
        <div className="fixed inset-0 bg-slate-950/95 z-[200] flex items-center justify-center p-6 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/20 p-10 rounded-[3rem] max-w-4xl w-full shadow-[0_0_100px_rgba(251,191,36,0.1)] relative my-auto">
            <button onClick={() => setIsPromoting(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all text-xl">✕</button>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold guild-font text-amber-500">Petition for Ascension</h3>
              <p className="text-slate-400 italic font-serif">"The Seeker must demonstrate the weight of their mastery to the Council."</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Target Tier</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100" value={targetTier} onChange={e => setTargetTier(e.target.value as Tier)}>
                    {Object.values(Tier).filter(t => t !== Tier.SEEKER && t !== Tier.KEYSTONE).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Attach Supporting Badges</label>
                  <div className="grid grid-cols-2 gap-4">
                    {completed.map(b => (
                      <button key={b.id} onClick={() => {
                        setSupportingBadgeIds(prev => prev.includes(b.id) ? prev.filter(id => id !== b.id) : [...prev, b.id]);
                      }} className={`p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${supportingBadgeIds.includes(b.id) ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-600'}`}>
                        <span className="text-xl">{b.icon || '📜'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">{b.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service & Mentoring Statements</label>
                      <button onClick={() => addStatement("New Statement")} className="text-amber-500 text-[9px] font-black uppercase tracking-widest">+ Add Statement</button>
                    </div>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                      {statements.map((s, idx) => (
                        <div key={idx} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                           <input className="w-full bg-transparent border-b border-slate-800 pb-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500" placeholder="Requirement Title (e.g. Community Service)" value={s.requirementTitle} onChange={e => {
                             const updated = [...statements];
                             updated[idx].requirementTitle = e.target.value;
                             setStatements(updated);
                           }} />
                           <textarea className="w-full bg-slate-900 rounded-lg p-3 text-xs text-slate-400 focus:outline-none" placeholder="Intent & Execution..." value={s.intent} onChange={e => {
                             const updated = [...statements];
                             updated[idx].intent = e.target.value;
                             setStatements(updated);
                           }} />
                           <div className="grid grid-cols-2 gap-4">
                             <input className="bg-slate-900 rounded-lg p-2 text-[10px] focus:outline-none" placeholder="Difficulties..." value={s.difficulties} onChange={e => {
                               const updated = [...statements];
                               updated[idx].difficulties = e.target.value;
                               setStatements(updated);
                             }} />
                             <input className="bg-slate-900 rounded-lg p-2 text-[10px] focus:outline-none" placeholder="Reference Contact..." value={s.referenceContact} onChange={e => {
                               const updated = [...statements];
                               updated[idx].referenceContact = e.target.value;
                               setStatements(updated);
                             }} />
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
                 <button onClick={submitPromotionRequest} className="w-full py-5 bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-2xl">Submit Ascension Petition</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trial Review Modal (existing) */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
           <div className="bg-slate-900 border border-amber-500/20 rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto p-12 scrollbar-hide relative shadow-3xl">
              <button onClick={() => setSelectedBadge(null)} className="absolute top-10 right-10 text-slate-500 hover:text-white text-xl">✕</button>
              
              <div className="flex gap-12 mb-16 border-b border-slate-800 pb-12">
                 <div className={`w-40 h-40 bg-slate-950 border-2 border-slate-800 rounded-2xl flex items-center justify-center text-7xl shadow-2xl ${selectedBadge.badgeShape === 'circle' ? 'rounded-full' : ''}`}>
                    {selectedBadge.visualAssetUrl ? <img src={selectedBadge.visualAssetUrl} className="w-full h-full object-cover" /> : selectedBadge.icon || '📜'}
                 </div>
                 <div>
                    <h3 className="text-4xl font-bold guild-font text-amber-500">{selectedBadge.title}</h3>
                    <p className="text-slate-400 italic font-serif mt-2 leading-relaxed">"{selectedBadge.description}"</p>
                    <div className="flex gap-4 mt-6">
                       <span className="text-[10px] uppercase font-black text-amber-500 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/20">{selectedBadge.domain}</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4">Trials Checklist</h4>
                    {selectedBadge.requirements.map((req, idx) => (
                      <div key={req.id} className={`p-6 rounded-2xl border transition-all ${req.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/50 border-slate-800'}`}>
                         <div className="flex items-start gap-4">
                            <span className="text-amber-500/40 font-serif font-bold italic">{idx + 1}.</span>
                            <div className="flex-1">
                               <p className="text-sm font-bold text-slate-200">{req.description}</p>
                               <div className="mt-4 flex gap-4">
                                  {!req.isCompleted ? (
                                    <>
                                       {req.requireAttachment && (
                                         <label className="text-[9px] bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-lg cursor-pointer transition-all uppercase font-black">
                                           <input type="file" className="hidden" onChange={e => handleFileUpload(selectedBadge, req.id, e)} />
                                           Attach File
                                         </label>
                                       )}
                                       {req.requireNote && (
                                         <button onClick={() => {
                                           const note = prompt("Enter reflection:");
                                           if (note) updateRequirement(selectedBadge, req.id, { evidenceNote: note, isCompleted: checkCompletion({...req, evidenceNote: note}) });
                                         }} className="text-[9px] border border-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all uppercase font-black">Add Note</button>
                                       )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-4">
                                       <span className="text-emerald-500 text-[10px] font-black uppercase">Trial Mastered</span>
                                       <button onClick={() => updateRequirement(selectedBadge, req.id, { isCompleted: false, evidenceUrl: undefined, evidenceNote: undefined })} className="text-[9px] text-rose-500 uppercase font-black">Revoke</button>
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4">Mastery Synthesis</h4>
                    <textarea className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 h-64 text-slate-300 font-serif italic focus:outline-none focus:border-amber-500" placeholder="Record your truths..." defaultValue={selectedBadge.reflections} onBlur={e => onUpdateBadge({...selectedBadge, reflections: e.target.value})} />
                    {selectedBadge.requirements.every(r => r.isCompleted) && (
                      <button onClick={() => { onSubmitVerification(selectedBadge); setSelectedBadge(null); }} className="w-full py-5 bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl">Request Verification Seal</button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
