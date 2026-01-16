
import React, { useState } from 'react';
import { VerificationRequest, Colony, BadgeProposal, PromotionRequest, CouncilStatus, LinkSuggestion, PartnershipRequest } from '../types';

interface GuildmasterCouncilProps {
  requests: VerificationRequest[];
  colonies: Colony[];
  proposals: BadgeProposal[];
  promotions: PromotionRequest[];
  linkSuggestions: LinkSuggestion[];
  partnershipRequests: PartnershipRequest[];
  fundBalance: number;
  onProcessRequest: (id: string, approved: CouncilStatus, reason?: string) => void;
  onApproveColony: (id: string) => void;
  onProcessProposal: (id: string, approved: CouncilStatus, reason?: string, asPartnerBadge?: boolean, partnerName?: string) => void;
  onProcessPromotion: (id: string, approved: CouncilStatus, reason?: string) => void;
  onProcessLinkSuggestion: (id: string, approved: CouncilStatus) => void;
  onProcessPartnershipRequest: (id: string, approved: CouncilStatus) => void;
}

export const GuildmasterCouncil: React.FC<GuildmasterCouncilProps> = ({ 
  requests, colonies, proposals, promotions, linkSuggestions, partnershipRequests, fundBalance, onProcessRequest, onApproveColony, onProcessProposal, onProcessPromotion, onProcessLinkSuggestion, onProcessPartnershipRequest 
}) => {
  const [activeView, setActiveView] = useState<'seals' | 'proposals' | 'resources' | 'colonies' | 'partnerships' | 'sanctum'>('seals');
  const [modalData, setModalData] = useState<{ id: string; type: 'verification' | 'proposal' | 'promotion' | 'resource' | 'partnership'; targetStatus: CouncilStatus } | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // States for detailed badge approval
  const [isPartnerBadge, setIsPartnerBadge] = useState(false);
  const [pName, setPName] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingColonies = colonies.filter(c => !c.isApproved);
  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const pendingPromotions = promotions.filter(p => p.status === 'pending');
  const pendingLinks = linkSuggestions.filter(ls => ls.status === 'pending');
  const pendingPartnerships = partnershipRequests.filter(pr => pr.status === 'pending');

  const handleAction = () => {
    if (!modalData) return;
    const { id, type, targetStatus } = modalData;
    if (type === 'verification') onProcessRequest(id, targetStatus, feedback);
    else if (type === 'proposal') onProcessProposal(id, targetStatus, feedback, isPartnerBadge, pName);
    else if (type === 'promotion') onProcessPromotion(id, targetStatus, feedback);
    else if (type === 'resource') onProcessLinkSuggestion(id, targetStatus);
    else if (type === 'partnership') onProcessPartnershipRequest(id, targetStatus);
    
    setModalData(null);
    setFeedback('');
    setIsPartnerBadge(false);
    setPName('');
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-5xl font-bold guild-font text-slate-100 uppercase tracking-tighter">Guild Council</h2>
        <p className="text-slate-400 mt-2 font-serif italic">"The inner ring of stewardship and administrative sovereignty."</p>
      </header>

      <nav className="flex gap-4 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'seals', label: 'Verifications', count: pendingRequests.length + pendingPromotions.length },
          { id: 'proposals', label: 'Badge Designs', count: pendingProposals.length },
          { id: 'resources', label: 'Resource Links', count: pendingLinks.length },
          { id: 'partnerships', label: 'Partnerships', count: pendingPartnerships.length },
          { id: 'colonies', label: 'Colony Charters', count: pendingColonies.length },
          { id: 'sanctum', label: 'The Sanctum', count: 0 }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveView(t.id as any)} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeView === t.id ? 'text-amber-500' : 'text-slate-500'}`}>
            {t.label} {t.count > 0 && `(${t.count})`}
            {activeView === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-full" />}
          </button>
        ))}
      </nav>

      <div className="animate-in fade-in duration-500">
        {activeView === 'sanctum' ? (
          <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden flex h-[650px] shadow-3xl">
            {/* Discord-like Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">Admin Council</h4>
                <p className="text-[8px] text-slate-600 uppercase tracking-tighter mt-1">Sovereign Encryption Level 9</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div>
                    <p className="text-[9px] text-slate-700 uppercase font-black tracking-widest mb-3 px-2">Secure Channels</p>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs bg-amber-600 text-slate-950 font-bold shadow-lg text-left">
                        <span className="text-base">#</span> sanctum-general
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-500 hover:bg-slate-800 transition-all text-left mt-2">
                        <span className="text-base">#</span> strategy-floor
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-500 hover:bg-slate-800 transition-all text-left mt-2">
                        <span className="text-base">#</span> tech-stewardship
                    </button>
                 </div>
              </div>
              <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-amber-500/30 text-lg">🛡️</div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">Guildmaster Alpha</p>
                    <p className="text-[8px] text-slate-500 uppercase">Authorized Steward</p>
                 </div>
              </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-slate-900/30">
               <header className="h-16 border-b border-slate-800 flex items-center px-8 text-slate-100 font-bold justify-between backdrop-blur-md bg-slate-900/40">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-slate-500">#</span>
                    <span>sanctum-general</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                     <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Vault Open</span>
                  </div>
               </header>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                  <div className="text-center py-10 opacity-20 border-b border-slate-800/50">
                     <p className="text-[10px] font-black uppercase tracking-[1em]">Secure Feed Incepted</p>
                  </div>

                  <div className="flex gap-4 animate-in slide-in-from-bottom-4">
                     <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 font-black text-slate-950 shadow-xl border border-amber-400/50">G1</div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Guildmaster Prime</span>
                           <span className="text-[9px] text-slate-600">Secure Protocol v9.2</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500/20 pl-6 py-2 bg-amber-500/5 rounded-r-xl pr-6">
                           "The 12 Keystone trials are now fully integrated across all tiers. Please monitor the Seeker influx for any irregularities in proposal quality."
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-4 opacity-70 animate-in slide-in-from-bottom-4 delay-150">
                     <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700 shadow-lg">W</div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Warden Helix</span>
                           <span className="text-[9px] text-slate-600">Cascadia Node</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                           "Cascadia integrity checks complete. Forging systems for physical artifacts are synced. Ready for the first batch of claims."
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-4 animate-in slide-in-from-bottom-4 delay-300">
                     <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700 shadow-lg">G2</div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Guildmaster Beta</span>
                           <span className="text-[9px] text-slate-600">Virtual Siege</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                           "I've updated the Great Ascent page to clarify Domain definitions. Users should now find the clickable tier cards more intuitive."
                        </p>
                     </div>
                  </div>
               </div>

               <footer className="p-8 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Send encrypted transmission..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 pl-8 pr-16 text-sm focus:outline-none focus:border-amber-500 transition-all text-slate-200 shadow-inner group-hover:border-slate-700"
                    />
                    <button className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-amber-500 text-2xl transition-all hover:scale-110 active:scale-90">🕊️</button>
                  </div>
               </footer>
            </main>
          </div>
        ) : activeView === 'seals' ? (
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em]">Tier Progression Requests</h3>
              {pendingPromotions.length === 0 && <p className="text-xs text-slate-500 italic py-12 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">No pending ascensions in the ledger.</p>}
              {pendingPromotions.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold guild-font">Promotion to {p.targetTier}</h4>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Steward: {p.userName}</p>
                    </div>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full uppercase font-black tracking-widest">{new Date(p.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setModalData({ id: p.id, type: 'promotion', targetStatus: 'approved' })} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl">Approve Ascension</button>
                    <button onClick={() => setModalData({ id: p.id, type: 'promotion', targetStatus: 'rejected' })} className="flex-1 py-4 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-800">
               <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Single Seal Verifications</h3>
               {pendingRequests.length === 0 && <p className="text-xs text-slate-500 italic text-center py-6">All mastered artifacts have been verified.</p>}
               {pendingRequests.map(req => (
                 <div key={req.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl animate-in slide-in-from-left-4">
                    <div className="flex items-center gap-6">
                       <div className="text-4xl">📜</div>
                       <div>
                          <p className="font-bold text-slate-100">{req.badgeTitle}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">By: {req.userName}</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => onProcessRequest(req.id, 'approved')} className="px-5 py-2.5 bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-slate-950 transition-all">Approve</button>
                       <button onClick={() => onProcessRequest(req.id, 'rejected')} className="px-5 py-2.5 bg-rose-600/20 text-rose-500 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Deny</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : activeView === 'proposals' ? (
          <div className="space-y-8">
            {pendingProposals.length === 0 && <p className="text-xs text-slate-500 italic text-center py-32 border-2 border-dashed border-slate-800 rounded-[3rem]">All badge designs have been archived.</p>}
            {pendingProposals.map(prop => (
              <div key={prop.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95">
                 <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-32 h-32 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-center text-5xl shrink-0 shadow-inner group overflow-hidden">
                       {prop.badge.visualAssetUrl ? <img src={prop.badge.visualAssetUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <span className="transition-transform group-hover:rotate-6">📜</span>}
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="flex justify-between items-start">
                          <h4 className="text-3xl font-bold guild-font text-slate-100">{prop.badge.title}</h4>
                          <span className="text-[10px] font-black text-amber-500 border border-amber-500/30 px-3 py-1 rounded-lg uppercase tracking-widest">Level {prop.badge.difficulty}</span>
                       </div>
                       <p className="text-sm text-slate-400 font-serif italic">"{prop.badge.description}"</p>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Proposed by: {prop.userName}</p>
                       
                       <div className="flex gap-4 pt-6">
                          <button onClick={() => setModalData({ id: prop.id, type: 'proposal', targetStatus: 'approved' })} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl">Inscribe Official Badge</button>
                          <button onClick={() => setModalData({ id: prop.id, type: 'proposal', targetStatus: 'needs_info' })} className="flex-1 py-4 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/20 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Request Clarification</button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-slate-600 italic font-serif opacity-30">
             <div className="text-6xl mb-6">📜</div>
             <p>Select a ledger to begin the administrative audit.</p>
          </div>
        )}
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] max-w-md w-full animate-in zoom-in-95 shadow-3xl">
             <h3 className="text-2xl font-bold guild-font text-amber-500 mb-6 uppercase tracking-widest text-center">Council Decision</h3>
             <p className="text-slate-500 text-xs text-center mb-6 font-serif italic">"Provide clarity or guidance for the seeker's future attempts."</p>
             <textarea 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-200 h-44 focus:outline-none focus:border-amber-500 shadow-inner font-serif italic" 
                placeholder="Council notes..." 
                value={feedback} 
                onChange={e => setFeedback(e.target.value)} 
             />
             <div className="flex gap-4 mt-8">
               <button onClick={() => setModalData(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Cancel</button>
               <button onClick={handleAction} className={`flex-[2] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${modalData.targetStatus === 'approved' ? 'bg-emerald-600 text-slate-950 hover:bg-emerald-500' : 'bg-rose-600 text-white hover:bg-rose-500'}`}>Confirm Result</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
