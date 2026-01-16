
import React, { useState, useMemo } from 'react';
import { BadgeCard } from '../components/BadgeCard';
import { UserProfile, Tier, Badge, BadgeRequirement, BadgeProposal, PromotionRequest, ActionStatement, UsefulLink, PhysicalBadgeRequest } from '../types';
import { getAIRecommendations, getLearningSuggestions } from '../services/gemini';
import { TIER_ASCENSION_MAP } from '../constants';

interface DashboardProps {
  user: UserProfile;
  pendingBadges: BadgeProposal[];
  physicalRequests: PhysicalBadgeRequest[];
  onUpdateBadge: (badge: Badge) => void;
  onSubmitVerification: (badge: Badge) => void;
  onRequestPromotion: (promo: Omit<PromotionRequest, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => void;
  onSuggestLink: (badge: Badge, label: string, url: string) => void;
  onRequestPhysical: (badge: Badge) => void;
}

type JournalTab = 'trials' | 'artifacts';

export const Dashboard: React.FC<DashboardProps> = ({ user, pendingBadges, physicalRequests, onUpdateBadge, onSubmitVerification, onRequestPromotion, onSuggestLink, onRequestPhysical }) => {
  const [activeTab, setActiveTab] = useState<JournalTab>('trials');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [learningGuidance, setLearningGuidance] = useState<string | null>(null);
  const [isGettingGuidance, setIsGettingGuidance] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [sharingBadge, setSharingBadge] = useState<Badge | null>(null);
  
  const [suggestLinkLabel, setSuggestLinkLabel] = useState('');
  const [suggestLinkUrl, setSuggestLinkUrl] = useState('');
  const [showLinkSuggestion, setShowLinkSuggestion] = useState(false);

  const nextTier = useMemo(() => {
    const tiers = Object.values(Tier);
    const currentIndex = tiers.indexOf(user.tier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }, [user.tier]);

  const targetTierRequirements = useMemo(() => {
    return nextTier ? TIER_ASCENSION_MAP[nextTier] : [];
  }, [nextTier]);

  const [supportingBadgeIds, setSupportingBadgeIds] = useState<string[]>([]);
  const [createdBadgeId, setCreatedBadgeId] = useState<string | null>(null);
  const [statements, setStatements] = useState<ActionStatement[]>([]);

  const inProgress = user.badges.filter(b => b.requirements.some(r => !r.isCompleted));
  const completed = user.badges.filter(b => b.requirements.every(r => r.isCompleted));
  const userPendingBadges = pendingBadges.filter(p => p.userId === user.id && p.status === 'pending');
  const userCreatedBadges = pendingBadges.filter(p => p.userId === user.id);

  const handleConsultOracle = async () => {
    setIsConsulting(true);
    try {
      const recs = await getAIRecommendations(user.badges, [user.tier]);
      setOracleResponse(recs);
    } catch (e) {
      setOracleResponse("The Weaver's guidance is currently unavailable.");
    } finally {
      setIsConsulting(false);
    }
  };

  const fetchLearningGuidance = async (badge: Badge) => {
    setIsGettingGuidance(true);
    try {
      const guidance = await getLearningSuggestions(badge.title, badge.description);
      setLearningGuidance(guidance);
    } catch (e) {
      setLearningGuidance("Explore relevant literature and seek mentorship within your Colony.");
    } finally {
      setIsGettingGuidance(false);
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

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBadge && suggestLinkLabel && suggestLinkUrl) {
      onSuggestLink(selectedBadge, suggestLinkLabel, suggestLinkUrl);
      setSuggestLinkLabel('');
      setSuggestLinkUrl('');
      setShowLinkSuggestion(false);
    }
  };

  const submitPromotionRequest = () => {
    if (!nextTier) return;
    if (nextTier === Tier.SEEKER && !createdBadgeId) return;

    onRequestPromotion({
      targetTier: nextTier,
      supportingBadgeIds: nextTier === Tier.SEEKER ? (createdBadgeId ? [createdBadgeId] : []) : supportingBadgeIds,
      actionStatements: statements
    });
    setIsPromoting(false);
    setSupportingBadgeIds([]);
    setCreatedBadgeId(null);
    setStatements([]);
  };

  const updateStatement = (reqId: string, title: string, updates: Partial<ActionStatement>) => {
    const existingIndex = statements.findIndex(s => s.requirementId === reqId);
    if (existingIndex > -1) {
      const updated = [...statements];
      updated[existingIndex] = { ...updated[existingIndex], ...updates };
      setStatements(updated);
    } else {
      setStatements([...statements, {
        requirementId: reqId,
        requirementTitle: title,
        intent: '',
        difficulties: '',
        lessons: '',
        referenceContact: '',
        ...updates
      }]);
    }
  };

  const isHighTier = nextTier === Tier.ARTISAN || nextTier === Tier.WARDEN || nextTier === Tier.KEYSTONE;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h2 className="text-5xl font-bold guild-font text-slate-100 uppercase tracking-tight">Badge Journal</h2>
          <div className="mt-6 flex items-center gap-4">
             <span className="text-amber-500 font-bold uppercase text-[10px] border border-amber-500/30 px-4 py-1.5 rounded-full bg-amber-500/5 shadow-xl">{user.tier} Status</span>
             {nextTier && (
               <button onClick={() => setIsPromoting(true)} className="bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-slate-950 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all shadow-lg">
                 Ascension Request
               </button>
             )}
          </div>
        </div>
      </header>

      {/* Journal Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl w-fit">
         <button onClick={() => setActiveTab('trials')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'trials' ? 'bg-amber-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>The Trials</button>
         <button onClick={() => setActiveTab('artifacts')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'artifacts' ? 'bg-amber-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Physical Artifacts</button>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === 'trials' ? (
          <div className="space-y-16">
            {/* Guidance Area */}
            <section className="bg-slate-900/80 border border-amber-500/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
              {!oracleResponse ? (
                <div className="flex items-center gap-8 relative z-10">
                  <div className="text-5xl">✨</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-100">Seek Guidance</h3>
                    <p className="text-slate-400 text-sm mt-1">Personalized recommendations for your unique path of mastery.</p>
                  </div>
                  <button onClick={handleConsultOracle} disabled={isConsulting} className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">
                    {isConsulting ? 'Consulting...' : 'View Next Steps'}
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-6 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Growth Pathways</h3>
                    <button onClick={() => setOracleResponse(null)} className="text-xs text-slate-500 hover:text-white uppercase font-black">✕ Close</button>
                  </div>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-serif italic border-l-2 border-amber-500/20 pl-6">{oracleResponse}</p>
                </div>
              )}
            </section>

            {/* In Progress */}
            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-10 pl-2">Trials in Progress</h3>
              {inProgress.length === 0 ? (
                <div className="text-center py-20 bg-slate-950/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
                   <p className="text-slate-500 text-sm italic">No active trials. Visit the Archive to begin your journey.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {inProgress.map(badge => (
                    <BadgeCard key={badge.id} badge={badge} actionLabel="Track Milestones" onAction={() => setSelectedBadge(badge)} />
                  ))}
                </div>
              )}
            </section>

            {/* Earned Mastery */}
            <section className="pt-12 border-t border-slate-800">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-12 pl-2">Earned Mastery</h3>
              {completed.length === 0 ? (
                <p className="text-slate-600 text-sm italic pl-2">Your hall of mastery awaits its first inscription.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
                  {completed.map(badge => (
                    <div key={badge.id} className="text-center group cursor-pointer relative" onClick={() => setSelectedBadge(badge)}>
                      <div className="w-24 h-24 mx-auto mb-4 bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] flex items-center justify-center group-hover:border-amber-500 transition-all relative overflow-hidden shadow-xl">
                        <div className="text-4xl relative z-10">{badge.icon || '📜'}</div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-black">✓</div>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-tight px-2">{badge.title}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSharingBadge(badge); }}
                        className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >↗</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="space-y-12 max-w-5xl">
            <div className="bg-amber-600/5 border border-amber-600/20 p-8 rounded-[3rem] space-y-6">
               <div className="flex gap-6 items-start">
                 <div className="text-5xl">🎖️</div>
                 <div>
                    <h4 className="text-xl font-bold text-amber-500 guild-font uppercase tracking-widest">The Physical Artifact</h4>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                      Each unique digital badge grants you <span className="text-amber-500 font-bold">one free physical artifact</span> for your collection. Any subsequent copies of the same badge require a forging fee of $15.00.
                    </p>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-8">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] border-b border-slate-800 pb-4">Completed Trials</h4>
                  {completed.length === 0 ? (
                    <p className="text-slate-600 text-sm italic">You must complete trials before they can be physicalized.</p>
                  ) : (
                    <div className="space-y-4">
                      {completed.map(badge => {
                        const isRequested = physicalRequests.some(r => r.badgeId === badge.id);
                        const isFree = !user.claimedFreePhysicalBadgeIds.includes(badge.id);
                        return (
                          <div key={badge.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-amber-500/40 transition-all shadow-xl">
                             <div className="flex items-center gap-5">
                                <span className="text-4xl group-hover:scale-110 transition-transform">{badge.icon || '📜'}</span>
                                <div>
                                   <p className="font-bold text-slate-100">{badge.title}</p>
                                   <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{isFree ? 'Free Copy Available' : 'Forging Fee Applies'}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => onRequestPhysical(badge)}
                               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFree ? 'bg-amber-600 text-slate-950 hover:bg-amber-500 shadow-amber-900/20' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                             >
                               {isFree ? 'Claim Free artifact' : 'Request artifact ($15)'}
                             </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
               </div>

               <div className="space-y-8">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em] border-b border-slate-800 pb-4">Dispatch Status</h4>
                  {physicalRequests.length === 0 ? (
                    <div className="bg-slate-950/50 p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center">
                       <p className="text-slate-600 text-sm italic">No artifact requests have been sent to the forge.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {physicalRequests.map(req => (
                        <div key={req.id} className="bg-slate-950 border border-slate-800 p-6 rounded-3xl flex justify-between items-center shadow-lg">
                           <div>
                              <p className="text-sm font-bold text-slate-200">{req.badgeTitle}</p>
                              <p className="text-[9px] text-slate-600 uppercase mt-1">Ordered: {new Date(req.submittedAt).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                              <span className={`text-[10px] font-black uppercase ${req.status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{req.status}</span>
                              <p className="text-[9px] text-slate-600">Fee: {req.cost === 0 ? 'FREE' : `$${req.cost.toFixed(2)}`}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Progress Modal */}
      {sharingBadge && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[300] flex items-center justify-center p-6">
           <div className="bg-slate-900 border border-blue-500/30 rounded-[4rem] p-12 max-w-lg w-full text-center shadow-[0_0_100px_rgba(37,99,235,0.1)] animate-in zoom-in-95 duration-300">
              <div className="w-48 h-48 bg-slate-950 border-2 border-amber-500/50 rounded-full flex items-center justify-center text-8xl mx-auto mb-10 shadow-2xl relative">
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse rounded-full"></div>
                {sharingBadge.icon || '📜'}
              </div>
              <h3 className="text-4xl font-bold guild-font text-slate-100 uppercase tracking-tighter">{sharingBadge.title}</h3>
              <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mt-2 mb-10">Trial Mastered</p>
              
              <div className="space-y-6">
                 <p className="text-slate-400 text-sm font-serif italic px-6 leading-relaxed">"Proclaim your victory and the expansion of your mastery to the outer networks."</p>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => { alert('Shared to external networks.'); setSharingBadge(null); }}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-500"
                    > Proclaim Result </button>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(`I have completed the ${sharingBadge.title} trial in the Blue Heron Guild! 🏛️`); alert('Copied to parchment.'); setSharingBadge(null); }}
                      className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-700"
                    > Copy Seal </button>
                 </div>
                 <button onClick={() => setSharingBadge(null)} className="text-slate-600 hover:text-white uppercase font-black text-[9px] tracking-widest pt-6 transition-colors">Dismiss</button>
              </div>
           </div>
        </div>
      )}

      {/* Promotion Request Modal */}
      {isPromoting && (
        <div className="fixed inset-0 bg-slate-950/95 z-[200] flex items-center justify-center p-6 backdrop-blur-md overflow-y-auto scrollbar-hide">
          <div className="bg-slate-900 border border-amber-500/20 p-10 md:p-16 rounded-[4rem] max-w-5xl w-full shadow-2xl relative my-auto animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsPromoting(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all text-xl p-2">✕</button>
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold guild-font text-slate-100 uppercase tracking-tighter">Ascension Request: {nextTier}</h3>
              <p className="text-slate-400 mt-4 text-xl">Share your progress and intent for the next stage of your journey.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div>
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">Tier Requirements</h4>
                  <div className="space-y-6">
                    {targetTierRequirements.map((treq) => (
                      <div key={treq.id} className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 space-y-4">
                        <div className="flex items-start gap-4">
                          <span className="text-amber-500 font-bold">●</span>
                          <p className="text-sm text-slate-200 font-bold leading-relaxed">{treq.description}</p>
                        </div>
                        {treq.needsStatement && (
                          <div className="space-y-4 pt-4 border-t border-slate-900">
                             <textarea 
                               className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 focus:border-amber-500 focus:outline-none min-h-[100px]"
                               placeholder="Reflect on your achievements and goals..."
                               value={statements.find(s => s.requirementId === treq.id)?.intent || ''}
                               onChange={e => updateStatement(treq.id, treq.description, { intent: e.target.value })}
                             />
                             {isHighTier && (
                               <input 
                                 className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                                 placeholder="Reference or Mentor Contact"
                                 value={statements.find(s => s.requirementId === treq.id)?.referenceContact || ''}
                                 onChange={e => updateStatement(treq.id, treq.description, { referenceContact: e.target.value })}
                               />
                             )}
                          </div>
                        )}
                        {nextTier === Tier.SEEKER && treq.id === 'ts2' && (
                          <div className="pt-4 border-t border-slate-900">
                             <p className="text-[9px] font-black text-slate-500 uppercase mb-3">Link Your First Design</p>
                             <div className="grid grid-cols-1 gap-2">
                               {userCreatedBadges.length > 0 ? userCreatedBadges.map(p => (
                                 <button 
                                   key={p.id}
                                   onClick={() => setCreatedBadgeId(p.id)}
                                   className={`p-3 rounded-xl border-2 transition-all text-left text-[10px] font-bold ${createdBadgeId === p.id ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-500'}`}
                                 >
                                   {p.badge.title} ({p.status})
                                 </button>
                               )) : (
                                 <p className="text-[9px] text-rose-500 italic">No designs found. Visit the Oracle's Temple to begin.</p>
                               )}
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">Evidence of Growth</h4>
                  <p className="text-xs text-slate-400 mb-6">Select badges that illustrate your readiness for {nextTier} level responsibility.</p>
                  <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {completed.map(b => (
                      <button 
                        key={b.id} 
                        onClick={() => setSupportingBadgeIds(prev => prev.includes(b.id) ? prev.filter(id => id !== b.id) : [...prev, b.id])} 
                        className={`p-4 rounded-3xl border-2 transition-all text-left flex items-center gap-4 group ${supportingBadgeIds.includes(b.id) ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700'}`}
                      >
                        <span className="text-2xl">{b.icon || '📜'}</span>
                        <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{b.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/50 p-8 rounded-[3rem] border border-slate-800 space-y-6 text-center">
                  <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">A Moment for Reflection</p>
                  <p className="text-xs text-slate-500 leading-relaxed italic font-serif">"The council will examine your journal reflections and the care put into your supporting artifacts."</p>
                  <button 
                    onClick={submitPromotionRequest}
                    disabled={nextTier === Tier.SEEKER ? !createdBadgeId : supportingBadgeIds.length === 0}
                    className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Milestone Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
           <div className="bg-slate-900 border border-slate-800 rounded-[3rem] max-w-6xl w-full max-h-[90vh] overflow-y-auto p-12 scrollbar-hide relative shadow-3xl">
              <button onClick={() => { setSelectedBadge(null); setLearningGuidance(null); }} className="absolute top-10 right-10 text-slate-500 hover:text-white text-xl">✕</button>
              
              <div className="flex flex-col md:flex-row gap-12 mb-16 border-b border-slate-800 pb-12">
                 <div className={`w-40 h-40 bg-slate-950 border-2 border-slate-800 rounded-2xl flex items-center justify-center text-7xl shadow-2xl shrink-0 ${selectedBadge.badgeShape === 'circle' ? 'rounded-full' : ''}`}>
                    {selectedBadge.visualAssetUrl ? <img src={selectedBadge.visualAssetUrl} className="w-full h-full object-cover" /> : selectedBadge.icon || '📜'}
                 </div>
                 <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] uppercase font-black text-amber-500 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/20">{selectedBadge.domain}</span>
                      {selectedBadge.secondaryDomains?.map(sd => (
                        <span key={sd} className="text-[10px] uppercase font-black text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">{sd}</span>
                      ))}
                    </div>
                    <h3 className="text-4xl font-bold text-amber-500 uppercase tracking-tighter">{selectedBadge.title}</h3>
                    <p className="text-slate-400 mt-2 leading-relaxed italic font-serif">"{selectedBadge.description}"</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mb-4">Learning Milestones</h4>
                    {selectedBadge.requirements.map((req, idx) => (
                      <div key={req.id} className={`p-6 rounded-2xl border transition-all ${req.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/50 border-slate-800'}`}>
                         <div className="flex items-start gap-4">
                            <span className="text-amber-500/40 font-bold">{idx + 1}.</span>
                            <div className="flex-1">
                               <p className="text-sm font-bold text-slate-200">{req.description}</p>
                               <div className="mt-4 flex gap-4">
                                  {!req.isCompleted ? (
                                    <>
                                       {req.requireAttachment && (
                                         <label className="text-[9px] bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-lg cursor-pointer transition-all uppercase font-black">
                                           <input type="file" className="hidden" onChange={e => handleFileUpload(selectedBadge, req.id, e)} />
                                           Upload Evidence
                                         </label>
                                       )}
                                       {req.requireNote && (
                                         <button onClick={() => {
                                           const note = prompt("Enter your reflection:");
                                           if (note) updateRequirement(selectedBadge, req.id, { evidenceNote: note, isCompleted: checkCompletion({...req, evidenceNote: note}) });
                                         }} className="text-[9px] border border-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all uppercase font-black">Add Note</button>
                                       )}
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-4">
                                       <span className="text-emerald-500 text-[10px] font-black uppercase">Completed</span>
                                       <button onClick={() => updateRequirement(selectedBadge, req.id, { isCompleted: false, evidenceUrl: undefined, evidenceNote: undefined })} className="text-[9px] text-rose-500 uppercase font-black">Edit</button>
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Mastery Synthesis</h4>
                      <textarea className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 h-48 text-slate-300 focus:outline-none focus:border-amber-500 font-serif italic" placeholder="Summarize your learning journey for this path..." defaultValue={selectedBadge.reflections} onBlur={e => onUpdateBadge({...selectedBadge, reflections: e.target.value})} />
                      {selectedBadge.requirements.every(r => r.isCompleted) && (
                        <button onClick={() => { onSubmitVerification(selectedBadge); setSelectedBadge(null); }} className="w-full py-5 bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:bg-amber-500 transition-all">Submit for Verification</button>
                      )}
                    </div>

                    <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em]">Resources & Directions</h4>
                        <button 
                          onClick={() => fetchLearningGuidance(selectedBadge)}
                          disabled={isGettingGuidance}
                          className="text-[9px] bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-950 px-3 py-1.5 rounded-lg font-black uppercase border border-amber-500/20 transition-all"
                        >
                          {isGettingGuidance ? 'Consulting the Oracle...' : 'Ask the Oracle for Guidance'}
                        </button>
                      </div>

                      {learningGuidance && (
                        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                          <p className="text-sm text-slate-300 font-serif leading-relaxed italic">
                            {learningGuidance}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Community Links</p>
                        <div className="space-y-2">
                          {(selectedBadge.usefulLinks || []).length > 0 ? (
                            selectedBadge.usefulLinks?.map((link, i) => (
                              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/40 group transition-all">
                                <span className="text-xs text-slate-300 font-bold group-hover:text-amber-500">{link.label}</span>
                                <span className="text-xs">🔗</span>
                              </a>
                            ))
                          ) : (
                            <p className="text-xs text-slate-600 italic">No community resources added yet.</p>
                          )}
                        </div>

                        {!showLinkSuggestion ? (
                          <button 
                            onClick={() => setShowLinkSuggestion(true)}
                            className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-amber-500 hover:border-amber-500/30 transition-all"
                          >
                            + Suggest a Resource
                          </button>
                        ) : (
                          <form onSubmit={handleLinkSubmit} className="space-y-3 p-4 bg-slate-900 border border-amber-500/10 rounded-2xl animate-in zoom-in-95 duration-200">
                            <input 
                              placeholder="Resource Label (e.g. Recommended Reading)"
                              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                              value={suggestLinkLabel}
                              onChange={e => setSuggestLinkLabel(e.target.value)}
                              required
                            />
                            <input 
                              placeholder="https://..."
                              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs"
                              value={suggestLinkUrl}
                              onChange={e => setSuggestLinkUrl(e.target.value)}
                              required
                            />
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setShowLinkSuggestion(false)} className="flex-1 py-2 text-[9px] font-black uppercase text-slate-500">Cancel</button>
                              <button type="submit" className="flex-1 py-2 bg-amber-600 text-slate-950 rounded-lg text-[9px] font-black uppercase">Submit Link</button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
