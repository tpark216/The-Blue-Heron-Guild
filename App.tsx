
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { Dashboard } from './views/Dashboard';
import { Library } from './views/Library';
import { AIDesigner } from './views/AIDesigner';
import { Colonies } from './views/Colonies';
import { Auth } from './views/Auth';
import { WardenSanctum } from './views/WardenSanctum';
import { UserProfile, Tier, Badge, AppState, Colony, Domain, VerificationRequest } from './types';
import { INITIAL_BADGES, MOCK_COLONIES } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('guild_session') === 'active';
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('guild_sovereign_state');
    if (saved) return JSON.parse(saved);

    return {
      user: {
        id: 'seeker-' + Math.random().toString(36).substr(2, 9),
        name: 'The Seeker',
        email: 'seeker@guild.org',
        tier: Tier.SEEKER,
        badges: [],
        isScholarshipRecipient: false,
        prefPhysicalBadge: false,
        mentorshipCount: 0,
        serviceMilestones: 0,
        privacy: {
          storageLocation: 'local',
          isEncrypted: true,
          autoSync: false
        }
      },
      badgesLibrary: INITIAL_BADGES,
      colonies: MOCK_COLONIES.map(c => ({ ...c, isApproved: true })),
      accessFundBalance: 1240.50,
      verificationRequests: []
    };
  });

  useEffect(() => {
    localStorage.setItem('guild_sovereign_state', JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setAppState(prev => ({
      ...prev,
      user: { ...prev.user, name: userData.name, email: userData.email }
    }));
    setIsLoggedIn(true);
    localStorage.setItem('guild_session', 'active');
    showNotification(`Welcome to the Great Hall, ${userData.name}.`, 'info');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('guild_session');
  };

  const downloadBadge = (badge: Badge) => {
    if (appState.user.badges.some(b => b.id === badge.id)) {
      showNotification("This trial is already inscribed in your journal.", "info");
      return;
    }
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        badges: [...prev.user.badges, { ...badge }]
      }
    }));
    showNotification(`"${badge.title}" successfully inscribed to your Badge Journal.`, 'success');
  };

  const joinColony = (colonyId: string) => {
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        colonyId
      }
    }));
    const colony = appState.colonies.find(c => c.id === colonyId);
    showNotification(`Your journey is now linked with ${colony?.name || 'the colony'}.`, 'success');
  };

  const updateBadgeInJournal = (updatedBadge: Badge) => {
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        badges: prev.user.badges.map(b => b.id === updatedBadge.id ? updatedBadge : b)
      }
    }));
  };

  const submitForVerification = (badge: Badge) => {
    const newRequest: VerificationRequest = {
      id: 'req-' + Date.now(),
      userId: appState.user.id,
      userName: appState.user.name,
      badgeId: badge.id,
      badgeTitle: badge.title,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setAppState(prev => ({
      ...prev,
      verificationRequests: [newRequest, ...prev.verificationRequests]
    }));
    showNotification("Journal entry submitted to the Warden Council.");
  };

  const processVerification = (requestId: string, approved: boolean) => {
    setAppState(prev => {
      const req = prev.verificationRequests.find(r => r.id === requestId);
      if (!req) return prev;

      const updatedRequests = prev.verificationRequests.map(r => 
        r.id === requestId ? { ...r, status: approved ? 'approved' : 'rejected' } as VerificationRequest : r
      );

      if (approved) {
        const updatedBadges = prev.user.badges.map(b => 
          b.id === req.badgeId ? { ...b, isVerified: true } : b
        );
        showNotification(`High Mastery granted for "${req.badgeTitle}".`);
        return { 
          ...prev, 
          verificationRequests: updatedRequests, 
          user: { ...prev.user, badges: updatedBadges } 
        };
      }

      return { ...prev, verificationRequests: updatedRequests };
    });
  };

  const generateSignetKeys = () => {
    const publicKey = 'pub_' + Math.random().toString(36).substr(2, 16);
    const privateKeyHash = 'priv_' + Math.random().toString(36).substr(2, 32);
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        security: {
          publicKey,
          privateKeyHash,
          lastBackup: new Date().toISOString()
        }
      }
    }));
    showNotification("Sovereign Signet Keys generated.", "success");
  };

  const isAdmin = (appState.user.tier === Tier.WARDEN || appState.user.tier === Tier.KEYSTONE) || 
                  (appState.user.name.toLowerCase() === 'demo' && appState.user.email.toLowerCase() === 'demo@demo.com');

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout isAdmin={isAdmin} syncMode={appState.user.privacy.storageLocation}>
        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-10 duration-300">
            <div className={`px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.4)] border-2 flex items-center gap-4 backdrop-blur-xl ${
              notification.type === 'success' 
              ? 'bg-amber-500/90 text-slate-950 border-amber-400' 
              : notification.type === 'warning'
              ? 'bg-rose-500/90 text-white border-rose-400'
              : 'bg-slate-800/90 text-amber-500 border-slate-700'
            }`}>
              <div className="text-3xl animate-bounce">
                {notification.type === 'success' ? '📜' : '⚖️'}
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-[0.2em] mb-0.5">Guild Bulletin</p>
                <p className="font-medium text-sm guild-font leading-tight">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <Dashboard 
              user={appState.user} 
              onUpdateBadge={updateBadgeInJournal} 
              onSubmitVerification={submitForVerification} 
            />
          } />
          <Route path="/library" element={<Library badges={appState.badgesLibrary} userBadges={appState.user.badges} onDownload={downloadBadge} />} />
          <Route path="/designer" element={<AIDesigner onBadgeCreated={downloadBadge} />} />
          <Route path="/colonies" element={<Colonies colonies={appState.colonies} userColonyId={appState.user.colonyId} onJoin={joinColony} onPropose={(col) => {
            const created: Colony = { ...col, id: 'col-' + Date.now(), membersCount: 1, isApproved: false };
            setAppState(prev => ({ ...prev, colonies: [created, ...prev.colonies] }));
            showNotification("Colony petition sealed. Awaiting Warden approval.");
          }} />} />
          <Route path="/warden" element={
            <WardenSanctum 
              requests={appState.verificationRequests} 
              colonies={appState.colonies} 
              fundBalance={appState.accessFundBalance} 
              onProcessRequest={processVerification}
              onApproveColony={(id) => {
                setAppState(prev => ({ ...prev, colonies: prev.colonies.map(c => c.id === id ? { ...c, isApproved: true } : c) }));
                showNotification("Colony charter approved.");
              }}
            />
          } />
          <Route path="/profile" element={
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
               <div className="text-center relative bg-slate-800/20 p-10 rounded-3xl border border-slate-700">
                 <button onClick={handleLogout} className="absolute top-6 right-6 text-[10px] text-rose-500 font-bold uppercase hover:underline border border-rose-500/20 px-3 py-1 rounded-full">Revoke Registry Access</button>
                 <div className="w-32 h-32 bg-slate-900 border-4 border-amber-500/50 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-2xl relative">
                    <div className="absolute inset-0 bg-amber-500/5 rounded-full animate-pulse"></div>
                    👤
                 </div>
                 <h2 className="text-4xl font-bold guild-font">{appState.user.name}</h2>
                 <p className="text-amber-500 font-bold tracking-[0.4em] uppercase text-sm mt-1">{appState.user.tier}</p>
                 <p className="text-slate-500 text-xs mt-6 uppercase font-bold tracking-widest bg-slate-800/50 px-4 py-2 rounded-full inline-block">{appState.user.email}</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-slate-950 border-2 border-amber-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-6xl">🔒</span>
                    </div>
                    <h3 className="font-bold mb-6 uppercase text-xs text-amber-500 tracking-[0.3em] border-b border-slate-800 pb-3">The Sovereign Vault</h3>
                    
                    <div className="space-y-6">
                       {appState.user.security ? (
                         <div className="space-y-4">
                           <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                              <p className="text-emerald-500 text-[10px] font-bold uppercase mb-1">Status: Fully Sovereign</p>
                              <p className="text-xs text-slate-400 font-mono break-all">{appState.user.security.publicKey}</p>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-4">
                            <p className="text-sm text-slate-400 italic">Forge your own keys to ensure total privacy.</p>
                            <button 
                              onClick={generateSignetKeys}
                              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-xs shadow-lg"
                            >
                              Forge Signet Keys
                            </button>
                         </div>
                       )}

                       <div className="pt-6 border-t border-slate-900">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Data Sync Protocol</label>
                          <div className="flex flex-col gap-2">
                             {(['local', 'personal_cloud', 'guild_sync'] as const).map(mode => (
                               <button 
                                 key={mode}
                                 onClick={() => setAppState(prev => ({ ...prev, user: { ...prev.user, privacy: { ...prev.user.privacy, storageLocation: mode }}}))}
                                 className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                                   appState.user.privacy.storageLocation === mode 
                                   ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                                   : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                                 }`}
                               >
                                 <span className="capitalize">{mode.replace('_', ' ')}</span>
                                 {appState.user.privacy.storageLocation === mode && <span className="text-sm">✓</span>}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col">
                    <h3 className="font-bold mb-6 uppercase text-xs text-slate-500 tracking-[0.3em] border-b border-slate-800 pb-3">Mobile Device Pairing</h3>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                       <div className="w-40 h-40 bg-white p-2 rounded-xl border-4 border-slate-800 shadow-inner">
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
                             <div className="grid grid-cols-4 gap-1">
                                {[...Array(16)].map((_, i) => (
                                  <div key={i} className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
