
import React, { useState } from 'react';
import { UserProfile, Badge, BadgeProposal, PhysicalBadgeRequest } from '../types';
import { BadgeCard } from '../components/BadgeCard';

interface ProfileProps {
  user: UserProfile;
  physicalRequests: PhysicalBadgeRequest[];
  pendingProposals: BadgeProposal[];
  onLogout: () => void;
  onGenerateKeys: () => void;
  onUpdatePrivacy: (mode: 'local' | 'personal_cloud' | 'guild_sync') => void;
  onToggleShowcase: (badgeId: string) => void;
  onRequestPhysical: (badge: Badge) => void;
}

type ProfileTab = 'showcase' | 'sovereignty' | 'inscriptions';

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  physicalRequests,
  pendingProposals,
  onLogout, 
  onGenerateKeys, 
  onUpdatePrivacy, 
  onToggleShowcase,
  onRequestPhysical
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('showcase');
  const [isCurating, setIsCurating] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [sharingBadge, setSharingBadge] = useState<Badge | null>(null);
  const [selectedInProgressId, setSelectedInProgressId] = useState<string | null>(null);

  const earnedBadges = user.badges.filter(b => b.requirements.every(r => r.isCompleted));
  const inProgressBadges = user.badges.filter(b => b.requirements.some(r => !r.isCompleted));
  const showcasedBadges = earnedBadges.filter(b => user.showcasedBadgeIds.includes(b.id));
  const myProposals = pendingProposals.filter(p => p.userId === user.id);

  const generateHallSnapshotHtml = () => {
    // Limit to 8 badges
    const limitedShowcase = showcasedBadges.slice(0, 8);
    const focusBadge = inProgressBadges.find(b => b.id === selectedInProgressId);
    
    return `<div style="font-family: 'Cinzel', serif; border: 2px solid #fbbf24; padding: 30px; border-radius: 24px; background: #0f172a; color: #f1f5f9; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); max-width: 450px; margin: auto;">
  <h3 style="margin: 0 0 5px 0; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.2em; font-size: 1.2em;">The Hall of Renown</h3>
  <p style="font-size: 0.7em; color: #94a3b8; font-family: sans-serif; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px;">${user.name}'s Verified Mastery</p>
  
  <div style="font-size: 2.5em; margin: 15px 0; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; min-height: 60px;">
    ${limitedShowcase.length > 0 
      ? limitedShowcase.map(b => `<span title="${b.title}" style="cursor: help;">${b.icon || '📜'}</span>`).join('')
      : '<span style="font-size: 0.4em; color: #475569; font-family: sans-serif; text-transform: uppercase;">Hall Awaiting Inscription</span>'
    }
  </div>

  ${focusBadge ? `
  <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #1e293b;">
    <p style="font-size: 0.6em; color: #fbbf24; font-family: sans-serif; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; font-weight: 900;">Current Focus</p>
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(251,191,36,0.05); padding: 10px; border-radius: 12px; border: 1px solid rgba(251,191,36,0.1);">
      <span style="font-size: 1.5em;">${focusBadge.icon || '⚒️'}</span>
      <span style="font-size: 0.8em; font-weight: 700; color: #f1f5f9;">${focusBadge.title}</span>
    </div>
  </div>
  ` : ''}

  <div style="height: 1px; background: #1e293b; margin: 25px auto 20px auto; width: 40%;"></div>
  <p style="font-size: 0.55em; letter-spacing: 0.3em; text-transform: uppercase; color: #fbbf24; font-family: sans-serif; font-weight: 900; opacity: 0.8;">Verified by Blue Heron Guild</p>
</div>`;
  };

  const handleShareBadge = (badge: Badge) => {
    setSharingBadge(badge);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Profile Header */}
      <header className="relative bg-slate-800/20 p-8 md:p-12 rounded-[3.5rem] border border-slate-700 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 border-4 border-amber-500/50 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-[0_0_50px_rgba(251,191,36,0.2)] relative group shrink-0">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-pulse group-hover:animate-none transition-all"></div>
            <span className="relative z-10 group-hover:scale-110 transition-transform">👤</span>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl md:text-5xl font-bold guild-font tracking-tight text-slate-100">{user.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mt-2">
               <p className="text-amber-500 font-bold tracking-[0.4em] uppercase text-xs md:text-sm">{user.tier}</p>
               <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></span>
               <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Submenu Navigation */}
      <nav className="flex items-center justify-center md:justify-start gap-2 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/50 max-w-fit mx-auto md:mx-0 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('showcase')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shrink-0 ${
            activeTab === 'showcase' 
            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <span>🏛️</span> Hall of Renown
        </button>
        <button 
          onClick={() => setActiveTab('inscriptions')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shrink-0 ${
            activeTab === 'inscriptions' 
            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <span>✨</span> Forge Designs
        </button>
        <button 
          onClick={() => setActiveTab('sovereignty')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shrink-0 ${
            activeTab === 'sovereignty' 
            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <span>🔒</span> Sovereignty
        </button>
      </nav>

      {/* Tab Content Area */}
      <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {activeTab === 'showcase' && (
          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold guild-font text-slate-100 flex items-center gap-4">
                  The Hall of Renown
                </h3>
                <p className="text-slate-500 text-sm italic font-serif mt-1">Showcasing your mastered trials to the network.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSnapshotModal(true)}
                  className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-slate-800 text-slate-400 border border-slate-700 hover:border-blue-500/40 hover:text-white"
                >
                  Generate Widget
                </button>
                <button 
                  onClick={() => setIsCurating(!isCurating)}
                  className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border shadow-lg ${
                    isCurating 
                    ? 'bg-amber-600 text-slate-950 border-amber-500 scale-105' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  {isCurating ? 'Done Curating' : 'Curate Showcase'}
                </button>
              </div>
            </div>

            {isCurating ? (
              <div className="bg-slate-950/50 border-2 border-dashed border-amber-500/20 p-10 rounded-[3rem] animate-in fade-in zoom-in-95">
                 <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-8 text-center">Select up to 8 artifacts to display in your public hall</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {earnedBadges.length > 0 ? earnedBadges.map(badge => (
                      <button 
                        key={badge.id} 
                        onClick={() => onToggleShowcase(badge.id)}
                        className={`relative p-4 rounded-3xl border-2 transition-all group flex flex-col items-center gap-3 ${
                          user.showcasedBadgeIds.includes(badge.id) 
                          ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                          : 'border-slate-800 bg-slate-900 opacity-40 hover:opacity-100'
                        }`}
                      >
                        <div className="text-4xl group-hover:scale-110 transition-transform">{badge.icon || '📜'}</div>
                        <span className="text-[9px] font-bold text-center uppercase tracking-tighter leading-tight text-slate-300">{badge.title}</span>
                        {user.showcasedBadgeIds.includes(badge.id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-slate-950 border-2 border-slate-950 shadow-xl">★</div>
                        )}
                      </button>
                    )) : (
                      <div className="col-span-full py-12 text-center text-slate-600 italic font-serif">
                        "Mastery must be earned before it can be displayed."
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {showcasedBadges.length > 0 ? showcasedBadges.slice(0, 8).map(badge => (
                  <div key={badge.id} className="animate-in fade-in slide-in-from-bottom-6 relative group">
                    <BadgeCard badge={badge} variant="compact" />
                    <button 
                      onClick={() => handleShareBadge(badge)}
                      className="absolute top-4 right-4 bg-slate-950/80 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 hover:text-amber-500"
                    >
                      <span className="text-[10px] font-black uppercase">Share ↗</span>
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full py-24 text-center bg-slate-800/10 rounded-[3rem] border border-slate-800/50 flex flex-col items-center">
                     <div className="text-6xl mb-6 opacity-20 filter grayscale">🕯️</div>
                     <p className="text-slate-400 font-bold guild-font text-xl">The Hall stands empty.</p>
                     <p className="text-slate-600 text-sm mt-2 max-w-xs italic leading-relaxed">Inspire others by curating your greatest mastered trials.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'inscriptions' && (
          <section className="space-y-10">
            <div className="border-b border-slate-800 pb-6">
              <h3 className="text-3xl font-bold guild-font text-slate-100">Temple Inscriptions</h3>
              <p className="text-slate-500 text-sm italic font-serif mt-1">Paths you have forged for the community's growth.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {myProposals.length > 0 ? myProposals.map(prop => (
                <div key={prop.id} className="bg-slate-800/40 p-8 rounded-[3rem] border border-slate-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl">✨</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{prop.badge.icon || '📜'}</div>
                    <div>
                      <h4 className="font-bold text-slate-100">{prop.badge.title}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${prop.status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        Status: {prop.status}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 italic mb-6">"{prop.badge.description}"</p>
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Seal ID: {prop.id.split('-')[1]}</span>
                    <span className="text-[10px] text-slate-600 font-serif italic">{new Date(prop.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-24 text-center bg-slate-800/10 rounded-[3rem] border border-slate-800/50 flex flex-col items-center">
                   <div className="text-6xl mb-6 opacity-20 filter grayscale">⚒️</div>
                   <p className="text-slate-400 font-bold guild-font text-xl">The Chamber Fires are cold.</p>
                   <p className="text-slate-600 text-sm mt-2 italic">Visit the Oracle to design your first inscription path.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'sovereignty' && (
          <section className="space-y-12 max-w-5xl">
            <div className="border-b border-slate-800 pb-6">
              <h3 className="text-3xl font-bold guild-font text-slate-100 flex items-center gap-4">
                Sovereign Privacy Settings
              </h3>
              <p className="text-slate-500 text-sm italic font-serif mt-1">Manage your cryptographic signets and data sync protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-950 border-2 border-amber-500/20 p-8 md:p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl">🔒</span>
                </div>
                <h4 className="font-bold mb-8 uppercase text-[10px] text-amber-500 tracking-[0.4em] border-b border-slate-800 pb-4 flex items-center gap-3">
                   <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> The Sovereign Vault
                </h4>
                
                <div className="space-y-8">
                   {user.security ? (
                     <div className="space-y-4">
                       <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                          <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-3">Identity: Fully Encrypted</p>
                          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Public Signet Key</p>
                            <p className="text-[10px] text-slate-400 font-mono break-all leading-relaxed">{user.security.publicKey}</p>
                          </div>
                          <p className="text-[9px] text-slate-600 mt-4 italic font-serif">Last sovereign backup: {new Date(user.security.lastBackup).toLocaleString()}</p>
                       </div>
                       <button 
                         onClick={onGenerateKeys}
                         className="text-[10px] text-slate-500 hover:text-amber-500 font-black uppercase tracking-widest transition-colors"
                       >
                         Regenerate Signet (Destructive)
                       </button>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <p className="text-slate-400 text-sm italic leading-relaxed font-serif">"Forge your own cryptographic signet to ensure total sovereignty. Without a signet, your journal relies on standard guild encryption."</p>
                        <button 
                          onClick={onGenerateKeys}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 py-4 rounded-2xl font-black transition-all uppercase tracking-[0.2em] text-xs shadow-xl"
                        >
                          Forge Sovereign Signet
                        </button>
                     </div>
                   )}

                   <div className="pt-8 border-t border-slate-900">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Sovereign Sync Protocol</label>
                      <div className="grid grid-cols-1 gap-3">
                         {(['local', 'personal_cloud', 'guild_sync'] as const).map(mode => (
                           <button 
                             key={mode}
                             onClick={() => onUpdatePrivacy(mode)}
                             className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                               user.privacy.storageLocation === mode 
                               ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                               : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                             }`}
                           >
                             <span className="text-[10px] font-black uppercase tracking-widest">{mode.replace('_', ' ')}</span>
                             {user.privacy.storageLocation === mode && (
                               <span className="bg-amber-500 text-slate-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✓</span>
                             )}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Mobile Link */}
              <div className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl">📱</span>
                </div>
                <h4 className="font-bold mb-8 uppercase text-[10px] text-slate-500 tracking-[0.4em] border-b border-slate-800 pb-4">Guild Mobile Link</h4>
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-6">
                   <div className="relative p-2 bg-white rounded-3xl border-[6px] border-slate-800 shadow-2xl transform hover:rotate-2 transition-transform">
                      <div className="w-40 h-40 bg-slate-100 flex items-center justify-center overflow-hidden rounded-xl">
                         <div className="grid grid-cols-5 gap-1 opacity-80">
                            {[...Array(25)].map((_, i) => (
                              <div key={i} className={`w-7 h-7 ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="text-center space-y-2">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Temporal Signet QR</p>
                      <p className="text-[11px] text-slate-400 font-serif italic max-w-[220px]">Scan with the official Guild App to bridge your artifacts across domains.</p>
                   </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Snapshot Modal */}
      {showSnapshotModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[3rem] p-10 max-w-2xl w-full animate-in zoom-in-95 shadow-3xl overflow-y-auto max-h-[90vh] scrollbar-hide">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-2xl font-bold guild-font text-blue-400 uppercase tracking-widest">Hall of Renown Widget</h3>
                   <p className="text-slate-400 text-sm italic font-serif mt-1">Embed your curated achievements on your external chronicles.</p>
                </div>
                <button onClick={() => setShowSnapshotModal(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Live Preview</p>
                      <div dangerouslySetInnerHTML={{ __html: generateHallSnapshotHtml() }} />
                   </div>
                   
                   <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Inscription Code (HTML)</label>
                      <textarea 
                         readOnly 
                         className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-[10px] text-blue-300 font-mono h-32 focus:outline-none scrollbar-hide"
                         value={generateHallSnapshotHtml()}
                      />
                   </div>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(generateHallSnapshotHtml());
                       alert("Widget code copied to your clipboard.");
                     }}
                     className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-500 transition-all"
                   >
                     Copy Code
                   </button>
                </div>

                <div className="space-y-8">
                   <div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Widget Configuration</h4>
                      <p className="text-[10px] text-slate-400 italic mb-6 leading-relaxed">Limit: Only the first 8 curated badges from your "Hall of Renown" will be shown.</p>
                      
                      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Share Current Focus</label>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                         <button 
                           onClick={() => setSelectedInProgressId(null)}
                           className={`w-full p-3 text-left rounded-xl border text-[10px] font-bold transition-all ${selectedInProgressId === null ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-500'}`}
                         >
                           No Focus Displayed
                         </button>
                         {inProgressBadges.map(b => (
                           <button 
                             key={b.id}
                             onClick={() => setSelectedInProgressId(b.id)}
                             className={`w-full p-3 text-left rounded-xl border text-[10px] font-bold transition-all flex items-center gap-3 ${selectedInProgressId === b.id ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                           >
                             <span className="text-base">{b.icon || '⚒️'}</span>
                             <span className="flex-1 truncate">{b.title}</span>
                           </button>
                         ))}
                         {inProgressBadges.length === 0 && (
                           <p className="text-[9px] text-slate-700 italic text-center p-4">No active trials found.</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingBadge && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] p-12 max-w-md w-full animate-in zoom-in-95 text-center shadow-3xl">
             <div className="w-40 h-40 bg-slate-950 border-2 border-amber-500/50 rounded-full flex items-center justify-center text-7xl mx-auto mb-8 shadow-2xl">
                {sharingBadge.icon || '📜'}
              </div>
             <h3 className="text-3xl font-bold guild-font text-slate-100 uppercase tracking-tighter mb-2">{sharingBadge.title}</h3>
             <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8">Mastered Achievement</p>
             
             <div className="space-y-4">
                <p className="text-slate-400 text-sm italic font-serif leading-relaxed">"Proclaim your victory to the outer realms."</p>
                <div className="flex gap-4">
                   <button 
                     onClick={() => { alert(`Proclaiming ${sharingBadge.title} mastery...`); setSharingBadge(null); }}
                     className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                   > Proclaim Result </button>
                   <button 
                     onClick={() => { navigator.clipboard.writeText(`I have mastered the ${sharingBadge.title} trial in the Blue Heron Guild! 🏛️`); alert('Copied to clipboard.'); setSharingBadge(null); }}
                     className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-xl font-black uppercase text-[10px] tracking-widest border border-slate-700"
                   > Copy Seal </button>
                </div>
                <button onClick={() => setSharingBadge(null)} className="text-slate-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest pt-4">Dismiss</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
