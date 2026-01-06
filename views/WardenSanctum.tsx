
import React from 'react';
import { VerificationRequest, Colony } from '../types';

interface WardenSanctumProps {
  requests: VerificationRequest[];
  colonies: Colony[];
  fundBalance: number;
  onProcessRequest: (id: string, approved: boolean) => void;
  onApproveColony: (id: string) => void;
}

export const WardenSanctum: React.FC<WardenSanctumProps> = ({ 
  requests, 
  colonies, 
  fundBalance, 
  onProcessRequest,
  onApproveColony 
}) => {
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingColonies = colonies.filter(c => !c.isApproved);

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-bold guild-font tracking-tight text-slate-100">Guildmaster Council</h2>
          <p className="text-slate-400 mt-2 text-lg italic font-serif">Sovereign oversight, verification, and stewardship of the High Council.</p>
        </div>
      </header>

      {/* Financial Stewardship Panel */}
      <section className="bg-slate-950 border-2 border-amber-500/10 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="space-y-2">
             <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em]">Access Fund Reserve</p>
             <p className="text-5xl font-bold tracking-tighter">${fundBalance.toLocaleString()}</p>
             <div className="pt-4">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">Protocol: Healthy</span>
             </div>
          </div>
          <div className="space-y-2 border-l border-slate-800 pl-12">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Scholarship Impact</p>
             <p className="text-5xl font-bold tracking-tighter">14.2%</p>
             <p className="text-[10px] text-slate-500 italic mt-2">Members supported by the Fund</p>
          </div>
          <div className="space-y-4 border-l border-slate-800 pl-12 flex flex-col justify-center">
             <button className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-slate-950 px-6 py-3 rounded-xl border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all">Generate Fund Report</button>
             <button className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Allocate Grants</button>
          </div>
        </div>
      </section>

      {/* Council Settings Section */}
      <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
         <h3 className="text-xl font-bold guild-font mb-6 flex items-center gap-3">
           <span className="text-2xl">⚙️</span> Council Settings
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Membership Tiers</p>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-serif italic">Seeker to Wayfarer</span>
                    <span className="text-amber-500">5 Badges</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-serif italic">Wayfarer to Journeyer</span>
                    <span className="text-amber-500">10 Badges</span>
                  </div>
                  <button className="w-full mt-4 py-2 border border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-amber-500/50 transition-all">Adjust Thresholds</button>
               </div>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Colony Distribution</p>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-serif italic">Event Fund Allocation</span>
                    <span className="text-emerald-500">10%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-serif italic">Scholarship Target</span>
                    <span className="text-emerald-500">15%</span>
                  </div>
                  <button className="w-full mt-4 py-2 border border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-emerald-500/50 transition-all">Manage Percentages</button>
               </div>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Verification Queue */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-2xl font-bold guild-font">Member Submissions</h3>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{pendingRequests.length} Pending</span>
          </div>
          
          <div className="space-y-4">
            {pendingRequests.length > 0 ? pendingRequests.map(req => (
              <div key={req.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-xl group-hover:text-amber-500 transition-colors">{req.badgeTitle}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Submitted by {req.userName}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 italic bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">{new Date(req.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onProcessRequest(req.id, true)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Seal Mastery
                  </button>
                  <button 
                    onClick={() => onProcessRequest(req.id, false)}
                    className="flex-1 py-3 rounded-xl bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Return Scroll
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-800/10 rounded-[2.5rem] border-2 border-dashed border-slate-800">
                <p className="text-slate-600 italic font-serif">The verification queue is currently clear.</p>
              </div>
            )}
          </div>
        </section>

        {/* Colony Approvals */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-2xl font-bold guild-font">Colony Petitions</h3>
            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{pendingColonies.length} Awaiting Seal</span>
          </div>

          <div className="space-y-4">
            {pendingColonies.length > 0 ? pendingColonies.map(col => (
              <div key={col.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-xl group-hover:text-blue-400 transition-colors">{col.name}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No. {col.number}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{col.siege} Siege</p>
                </div>
                <p className="text-sm text-slate-400 italic mb-8 border-l-2 border-slate-800 pl-4 font-serif leading-relaxed">"{col.charter}"</p>
                <button 
                  onClick={() => onApproveColony(col.id)}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl"
                >
                  Approve Colony Charter
                </button>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-800/10 rounded-[2.5rem] border-2 border-dashed border-slate-800">
                <p className="text-slate-600 italic font-serif">No new petitions at this time.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
