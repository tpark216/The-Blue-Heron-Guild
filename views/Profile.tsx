
import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { BadgeCard } from '../components/BadgeCard';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onGenerateKeys: () => void;
  onUpdatePrivacy: (mode: 'local' | 'personal_cloud' | 'guild_sync') => void;
  onToggleShowcase: (badgeId: string) => void;
}

type ProfileTab = 'showcase' | 'sovereignty';

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  onLogout, 
  onGenerateKeys, 
  onUpdatePrivacy, 
  onToggleShowcase 
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('showcase');
  const [isCurating, setIsCurating] = useState(false);

  const earnedBadges = user.badges.filter(b => b.requirements.every(r => r.isCompleted));
  const showcasedBadges = earnedBadges.filter(b => user.showcasedBadgeIds.includes(b.id));

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
      <nav className="flex items-center justify-center md:justify-start gap-2 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/50 max-w-fit mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('showcase')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
            activeTab === 'showcase' 
            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <span>🏛️</span> Hall of Renown
        </button>
        <button 
          onClick={() => setActiveTab('sovereignty')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
            activeTab === 'sovereignty' 
            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <span>🔒</span> Sovereign Settings
        </button>
      </nav>

      {/* Tab Content Area */}
      <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {activeTab === 'showcase' ? (
          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold guild-font text-slate-100 flex items-center gap-4">
                  The Hall of Renown
                </h3>
                <p className="text-slate-500 text-sm italic font-serif mt-1">Showcasing your mastered artifacts to the colony.</p>
              </div>
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

            {isCurating ? (
              <div className="bg-slate-950/50 border-2 border-dashed border-amber-500/20 p-10 rounded-[3rem] animate-in fade-in zoom-in-95">
                 <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-8 text-center">Select artifacts to display in your public hall</h4>
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
                {showcasedBadges.length > 0 ? showcasedBadges.map(badge => (
                  <div key={badge.id} className="animate-in fade-in slide-in-from-bottom-6">
                    <BadgeCard badge={badge} variant="compact" />
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
        ) : (
          <section className="space-y-12 max-w-5xl">
            <div className="border-b border-slate-800 pb-6">
              <h3 className="text-3xl font-bold guild-font text-slate-100 flex items-center gap-4">
                Sovereign Privacy Settings
              </h3>
              <p className="text-slate-500 text-sm italic font-serif mt-1">Manage your cryptographic signets and data sync protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sovereign Vault */}
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
    </div>
  );
};
