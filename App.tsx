
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { Dashboard } from './views/Dashboard';
import { Library } from './views/Library';
import { AIDesigner } from './views/AIDesigner';
import { Colonies } from './views/Colonies';
import { Auth } from './views/Auth';
import { GuildmasterCouncil } from './views/GuildmasterCouncil';
import { Profile } from './views/Profile';
import { UserProfile, Tier, Badge, AppState, Colony, VerificationRequest, BadgeProposal, PromotionRequest, CouncilStatus, LinkSuggestion, PartnershipRequest, PhysicalBadgeRequest, ColonyEvent } from './types';
import { INITIAL_BADGES, MOCK_COLONIES } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('guild_session') === 'active');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('guild_sovereign_state');
    if (saved) return JSON.parse(saved);
    return {
      user: {
        id: 'seeker-' + Math.random().toString(36).substr(2, 9),
        name: 'The Seeker', 
        email: 'seeker@guild.org', 
        tier: Tier.MEMBER,
        badges: [], showcasedBadgeIds: [], isScholarshipRecipient: false,
        prefPhysicalBadge: false, mentorshipCount: 0, serviceMilestones: 0,
        privacy: { storageLocation: 'local', isEncrypted: true, autoSync: false },
        claimedFreePhysicalBadgeIds: []
      },
      badgesLibrary: INITIAL_BADGES,
      colonies: MOCK_COLONIES.map(c => ({ ...c, isApproved: true, notices: [], events: [] })),
      accessFundBalance: 1240.50,
      verificationRequests: [],
      badgeProposals: [],
      promotionRequests: [],
      linkSuggestions: [],
      partnershipRequests: [],
      physicalBadgeRequests: []
    };
  });

  useEffect(() => { localStorage.setItem('guild_sovereign_state', JSON.stringify(appState)); }, [appState]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => setNotification({ message, type });

  const handleLogin = (u: { name: string; email: string }) => {
    setAppState(prev => ({ ...prev, user: { ...prev.user, name: u.name, email: u.email } }));
    setIsLoggedIn(true);
    localStorage.setItem('guild_session', 'active');
    showNotification(`Welcome to the Guild, ${u.name}.`, 'info');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('guild_session');
  };

  const proposePublicBadge = (pData: Omit<BadgeProposal, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => {
    const badgeWithCreator = { ...pData.badge, creatorId: appState.user.id };
    const p: BadgeProposal = { 
      ...pData, 
      badge: badgeWithCreator,
      id: 'prop-' + Date.now(), 
      userId: appState.user.id, 
      userName: appState.user.name, 
      status: 'pending', 
      submittedAt: new Date().toISOString() 
    };
    setAppState(prev => ({ ...prev, badgeProposals: [p, ...prev.badgeProposals] }));
    showNotification("Inscription proposal submitted for review.");
  };

  const handlePartnershipRequest = (req: Omit<PartnershipRequest, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => {
    const p: PartnershipRequest = {
      ...req,
      id: 'preq-' + Date.now(),
      userId: appState.user.id,
      userName: appState.user.name,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setAppState(prev => ({ ...prev, partnershipRequests: [p, ...prev.partnershipRequests] }));
    showNotification("Partnership request sent to the Council.");
  };

  const handlePhysicalBadgeRequest = (badge: Badge) => {
    const isFree = !appState.user.claimedFreePhysicalBadgeIds.includes(badge.id);
    const cost = isFree ? 0 : 15.00;
    
    const req: PhysicalBadgeRequest = {
      id: 'phys-' + Date.now(),
      userId: appState.user.id,
      badgeId: badge.id,
      badgeTitle: badge.title,
      status: 'pending',
      cost: cost,
      submittedAt: new Date().toISOString()
    };

    setAppState(prev => ({
      ...prev,
      physicalBadgeRequests: [req, ...prev.physicalBadgeRequests],
      user: { 
        ...prev.user, 
        claimedFreePhysicalBadgeIds: isFree 
          ? [...prev.user.claimedFreePhysicalBadgeIds, badge.id] 
          : prev.user.claimedFreePhysicalBadgeIds 
      }
    }));

    showNotification(isFree 
      ? `Claimed free physical copy of "${badge.title}"!` 
      : `Physical artifact request for "${badge.title}" sent ($15.00).`, 
      'success'
    );
  };

  const processProposal = (id: string, s: CouncilStatus, r?: string, asPartnerBadge?: boolean, partnerName?: string) => {
    setAppState(prev => {
      const updated = prev.badgeProposals.map(p => p.id === id ? { ...p, status: s, rejectionReason: r } as BadgeProposal : p);
      if (s === 'approved') {
        const prop = prev.badgeProposals.find(p => p.id === id);
        if (prop) {
          const official: Badge = { 
            ...prop.badge, 
            isVerified: true, 
            isUserCreated: false, 
            id: 'official-' + Date.now(),
            isPartnership: asPartnerBadge,
            partnerName: partnerName
          };
          showNotification(`Approved badge: "${prop.badge.title}".`);
          return { ...prev, badgeProposals: updated, badgesLibrary: [...prev.badgesLibrary, official] };
        }
      }
      return { ...prev, badgeProposals: updated };
    });
  };

  const handleLinkSuggestion = (badge: Badge, label: string, url: string) => {
    const suggestion: LinkSuggestion = {
      id: 'ls-' + Date.now(),
      badgeId: badge.id,
      badgeTitle: badge.title,
      userId: appState.user.id,
      userName: appState.user.name,
      label,
      url,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setAppState(prev => ({ ...prev, linkSuggestions: [suggestion, ...prev.linkSuggestions] }));
    showNotification("Resource suggestion sent to the Council.");
  };

  const processLinkSuggestion = (id: string, status: CouncilStatus) => {
    setAppState(prev => {
      const updatedSuggestions = prev.linkSuggestions.map(ls => ls.id === id ? { ...ls, status } : ls);
      if (status === 'approved') {
        const suggestion = prev.linkSuggestions.find(ls => ls.id === id);
        if (suggestion) {
          const updateBadges = (badges: Badge[]) => badges.map(b => 
            b.id === suggestion.badgeId 
            ? { ...b, usefulLinks: [...(b.usefulLinks || []), { label: suggestion.label, url: suggestion.url }] } 
            : b
          );
          return {
            ...prev,
            linkSuggestions: updatedSuggestions,
            badgesLibrary: updateBadges(prev.badgesLibrary),
            user: { ...prev.user, badges: updateBadges(prev.user.badges) }
          };
        }
      }
      return { ...prev, linkSuggestions: updatedSuggestions };
    });
  };

  const processPartnershipRequest = (id: string, status: CouncilStatus) => {
    setAppState(prev => ({
      ...prev,
      partnershipRequests: prev.partnershipRequests.map(r => r.id === id ? { ...r, status } : r)
    }));
  };

  const handlePromotionRequest = (data: Omit<PromotionRequest, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => {
    const p: PromotionRequest = { ...data, id: 'promo-' + Date.now(), userId: appState.user.id, userName: appState.user.name, status: 'pending', submittedAt: new Date().toISOString() };
    setAppState(prev => ({ ...prev, promotionRequests: [p, ...prev.promotionRequests] }));
    showNotification("Ascension application sent for review.");
  };

  const processPromotion = (id: string, s: CouncilStatus, f?: string) => {
    setAppState(prev => {
      const updated = prev.promotionRequests.map(p => p.id === id ? { ...p, status: s, councilFeedback: f } as PromotionRequest : p);
      if (s === 'approved') {
        const req = prev.promotionRequests.find(p => p.id === id);
        if (req) {
          showNotification(`Promotion granted. You are now a ${req.targetTier}.`);
          return { ...prev, promotionRequests: updated, user: { ...prev.user, tier: req.targetTier } };
        }
      }
      return { ...prev, promotionRequests: updated };
    });
  };

  const handleEventSignup = (colonyId: string, eventId: string) => {
    setAppState(prev => ({
      ...prev,
      colonies: prev.colonies.map(c => c.id === colonyId ? {
        ...c,
        events: c.events.map(e => e.id === eventId ? {
          ...e,
          attendees: e.attendees.includes(prev.user.name) ? e.attendees : [...e.attendees, prev.user.name]
        } : e)
      } : c)
    }));
    showNotification("Signed up for event!");
  };

  const handleProposeEvent = (colonyId: string, event: Omit<ColonyEvent, 'id' | 'attendees' | 'creatorName'>) => {
    const newEvent: ColonyEvent = {
      ...event,
      id: 'evt-' + Date.now(),
      creatorName: appState.user.name,
      attendees: [appState.user.name]
    };
    setAppState(prev => ({
      ...prev,
      colonies: prev.colonies.map(c => c.id === colonyId ? {
        ...c,
        events: [newEvent, ...c.events]
      } : c)
    }));
    showNotification("Colony event proposed.");
  };

  const isAdmin = appState.user.tier === Tier.WARDEN || appState.user.tier === Tier.KEYSTONE || appState.user.name.toLowerCase() === 'demo';

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout isAdmin={isAdmin} syncMode={appState.user.privacy.storageLocation} onLogout={handleLogout}>
        {notification && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-10 duration-300">
            <div className={`px-8 py-4 rounded-2xl shadow-2xl border-2 flex items-center gap-4 backdrop-blur-xl bg-amber-500/90 text-slate-950 border-amber-400`} onClick={() => setNotification(null)}>
              <div className="text-3xl">📜</div>
              <div><p className="font-black text-xs uppercase tracking-widest">Notification</p><p className="font-medium text-sm guild-font">{notification.message}</p></div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/ascent" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard user={appState.user} physicalRequests={appState.physicalBadgeRequests} pendingBadges={appState.badgeProposals} onUpdateBadge={b => setAppState(p => ({ ...p, user: { ...p.user, badges: p.user.badges.map(x => x.id === b.id ? b : x) } }))} onSubmitVerification={b => setAppState(p => ({ ...p, verificationRequests: [{ id: 'req-' + Date.now(), userId: p.user.id, userName: p.user.name, badgeId: b.id, badgeTitle: b.title, submittedAt: new Date().toISOString(), status: 'pending' }, ...p.verificationRequests] }))} onRequestPromotion={handlePromotionRequest} onSuggestLink={handleLinkSuggestion} onRequestPhysical={handlePhysicalBadgeRequest} />} />
          <Route path="/library" element={<Library badges={appState.badgesLibrary} userBadges={appState.user.badges} onDownload={b => setAppState(p => ({ ...p, user: { ...p.user, badges: [...p.user.badges, b] } }))} onProposePartnership={handlePartnershipRequest} />} />
          <Route path="/designer" element={<AIDesigner onProposePublic={proposePublicBadge} user={appState.user} />} />
          <Route path="/colonies" element={<Colonies colonies={appState.colonies} user={appState.user} onJoin={id => setAppState(p => ({ ...p, user: { ...p.user, colonyId: id } }))} onPropose={c => setAppState(p => ({ ...p, colonies: [{ ...c, id: 'col-' + Date.now(), membersCount: 1, isApproved: false, notices: [], events: [] }, ...p.colonies] }))} onEventSignup={handleEventSignup} onProposeEvent={handleProposeEvent} />} />
          <Route path="/council" element={<GuildmasterCouncil requests={appState.verificationRequests} colonies={appState.colonies} proposals={appState.badgeProposals} promotions={appState.promotionRequests} linkSuggestions={appState.linkSuggestions} partnershipRequests={appState.partnershipRequests} fundBalance={appState.accessFundBalance} onProcessRequest={(id, s) => setAppState(p => ({ ...p, verificationRequests: p.verificationRequests.map(x => x.id === id ? { ...x, status: s } : x), user: { ...p.user, badges: s === 'approved' ? p.user.badges.map(b => b.id === p.verificationRequests.find(v => v.id === id)?.badgeId ? { ...b, isVerified: true } : b) : p.user.badges } }))} onApproveColony={id => setAppState(p => ({ ...p, colonies: p.colonies.map(c => c.id === id ? { ...c, isApproved: true } : c) }))} onProcessProposal={processProposal} onProcessPromotion={processPromotion} onProcessLinkSuggestion={processLinkSuggestion} onProcessPartnershipRequest={processPartnershipRequest} />} />
          <Route path="/profile" element={<Profile user={appState.user} physicalRequests={appState.physicalBadgeRequests} pendingProposals={appState.badgeProposals} onLogout={handleLogout} onGenerateKeys={() => showNotification("Sovereign Keys Generated")} onUpdatePrivacy={m => setAppState(p => ({ ...p, user: { ...p.user, privacy: { ...p.user.privacy, storageLocation: m } } }))} onToggleShowcase={id => setAppState(p => ({ ...p, user: { ...p.user, showcasedBadgeIds: p.user.showcasedBadgeIds.includes(id) ? p.user.showcasedBadgeIds.filter(x => x !== id) : [...p.user.showcasedBadgeIds, id] } }))} onRequestPhysical={handlePhysicalBadgeRequest} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
