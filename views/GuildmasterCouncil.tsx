
import React, { useState } from 'react';
import { VerificationRequest, Colony, BadgeProposal, PromotionRequest, CouncilStatus } from '../types';

interface GuildmasterCouncilProps {
  requests: VerificationRequest[];
  colonies: Colony[];
  proposals: BadgeProposal[];
  promotions: PromotionRequest[];
  fundBalance: number;
  onProcessRequest: (id: string, approved: CouncilStatus, reason?: string) => void;
  onApproveColony: (id: string) => void;
  onProcessProposal: (id: string, approved: CouncilStatus, reason?: string) => void;
  onProcessPromotion: (id: string, approved: CouncilStatus, reason?: string) => void;
}

export const GuildmasterCouncil: React.FC<GuildmasterCouncilProps> = ({ 
  requests, colonies, proposals, promotions, fundBalance, onProcessRequest, onApproveColony, onProcessProposal, onProcessPromotion 
}) => {
  const [activeView, setActiveView] = useState<'seals' | 'proposals' | 'colonies'>('seals');
  const [modalData, setModalData] = useState<{ id: string; type: 'verification' | 'proposal' | 'promotion'; targetStatus: CouncilStatus } | null>(null);
  const [feedback, setFeedback] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingColonies = colonies.filter(c => !c.isApproved);
  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const pendingPromotions = promotions.filter(p => p.status === 'pending');

  const handleAction = () => {
    if (!modalData) return;
    const { id, type, targetStatus } = modalData;
    if (type === 'verification') onProcessRequest(id, targetStatus, feedback);
    else if (type === 'proposal') onProcessProposal(id, targetStatus, feedback);
    else if (type === 'promotion') onProcessPromotion(id, targetStatus, feedback);
    
    setModalData(null);
    setFeedback('');
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-5xl font-bold guild-font text-slate-100">Guildmaster Council</h2>
        <p className="text-slate-400 mt-2 font-serif italic">High Oversight of the Sovereign Registry.</p>
      </header>

      <nav className="flex gap-4 border-b border-slate-800 pb-2">
        {[
          { id: 'seals', label: 'Mastery Seals', count: pendingRequests.length + pendingPromotions.length },
          { id: 'proposals', label: 'Inscriptions', count: pendingProposals.length },
          { id: 'colonies', label: 'Colonies', count: pendingColonies.length }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveView(t.id as any)} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeView === t.id ? 'text-amber-500' : 'text-slate-500'}`}>
            {t.label} ({t.count})
            {activeView === t.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-full" />}
          </button>
        ))}
      </nav>

      <div className="animate-in fade-in duration-500">
        {activeView === 'seals' && (
          <div className="space-y-10">
            {/* Promotions Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em]">Ascension Petitions</h3>
              {pendingPromotions.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold guild-font">Promotion to {p.targetTier}</h4>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Submitted by {p.userName}</p>
                    </div>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full">{new Date(p.submittedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Supporting Badges</p>
                       <div className="flex flex-wrap gap-3">
                         {p.supportingBadgeIds.map(id => <span key={id} className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg">Badge Ref: {id}</span>)}
                       </div>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Action Statements</p>
                       <div className="space-y-4">
                         {p.actionStatements.map((s, i) => (
                           <div key={i} className="text-xs text-slate-400 italic bg-slate-950 p-4 rounded-xl border border-slate-800">
                             <strong>{s.requirementTitle}:</strong> "{s.intent.substring(0, 100)}..."
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setModalData({ id: p.id, type: 'promotion', targetStatus: 'approved' })} className="flex-1 py-3 bg-emerald-600 text-slate-950 font-black rounded-xl text-[10px] uppercase">Seal Ascension</button>
                    <button onClick={() => setModalData({ id: p.id, type: 'promotion', targetStatus: 'needs_info' })} className="flex-1 py-3 bg-amber-600/10 text-amber-500 border border-amber-500/20 font-black rounded-xl text-[10px] uppercase">Request Info</button>
                    <button onClick={() => setModalData({ id: p.id, type: 'promotion', targetStatus: 'rejected' })} className="flex-1 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 font-black rounded-xl text-[10px] uppercase">Return</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'proposals' && (
          <div className="space-y-8">
            {pendingProposals.map(prop => (
              <div key={prop.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                 <div className="flex gap-10">
                    <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center text-5xl">
                       {prop.badge.visualAssetUrl ? <img src={prop.badge.visualAssetUrl} className="w-full h-full object-cover rounded-2xl" /> : '📜'}
                    </div>
                    <div className="flex-1 space-y-4">
                       <h4 className="text-3xl font-bold guild-font">{prop.badge.title}</h4>
                       <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                          <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Goal</p>
                            <p className="text-xs text-slate-400 italic">"{prop.goal}"</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Metrics</p>
                            <p className="text-xs text-slate-400 italic">"{prop.metrics}"</p>
                          </div>
                       </div>
                       <div className="flex gap-4 pt-6">
                          <button onClick={() => setModalData({ id: prop.id, type: 'proposal', targetStatus: 'approved' })} className="flex-1 py-3 bg-emerald-600 text-slate-950 font-black rounded-xl text-[10px] uppercase">Inscribe Badge</button>
                          <button onClick={() => setModalData({ id: prop.id, type: 'proposal', targetStatus: 'needs_info' })} className="flex-1 py-3 bg-amber-600/10 text-amber-500 border border-amber-500/20 font-black rounded-xl text-[10px] uppercase">More Info</button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'colonies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pendingColonies.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <h4 className="text-xl font-bold guild-font">{c.name}</h4>
                <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-4">{c.siege}</p>
                <p className="text-sm text-slate-400 italic mb-8 border-l-2 border-slate-800 pl-4">"{c.charter}"</p>
                <button onClick={() => onApproveColony(c.id)} className="w-full py-4 bg-amber-600 text-slate-950 font-black rounded-xl text-[10px] uppercase">Approve Charter</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[300] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-md w-full animate-in zoom-in-95">
             <h3 className="text-2xl font-bold guild-font text-amber-500 mb-6">Council Verdict</h3>
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">High Council Feedback</label>
             <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 h-40 focus:outline-none focus:border-amber-500" placeholder="Provide clarity or congratulations..." value={feedback} onChange={e => setFeedback(e.target.value)} />
             <div className="flex gap-4 mt-8">
               <button onClick={() => setModalData(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500">Back</button>
               <button onClick={handleAction} className={`flex-[2] py-4 rounded-xl font-black text-[10px] uppercase ${modalData.targetStatus === 'approved' ? 'bg-emerald-600 text-slate-950' : 'bg-rose-600 text-white'}`}>Confirm Decision</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
