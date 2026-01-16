
import React, { useState } from 'react';
import { BadgeCard } from '../components/BadgeCard';
import { Badge, Domain, PartnershipRequest } from '../types';

interface LibraryProps {
  badges: Badge[];
  userBadges: Badge[];
  onDownload: (badge: Badge) => void;
  onProposePartnership: (req: Omit<PartnershipRequest, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => void;
}

export const Library: React.FC<LibraryProps> = ({ badges, userBadges, onDownload, onProposePartnership }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState<Domain | 'All'>('All');
  const [filterPartnered, setFilterPartnered] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  // Partnership Proposal State
  const [pName, setPName] = useState('');
  const [pType, setPType] = useState<'Organization' | 'Creator' | 'Institution'>('Organization');
  const [pDesc, setPDesc] = useState('');
  const [pUrl, setPUrl] = useState('');

  const filtered = badges.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = filterDomain === 'All' || b.domain === filterDomain || b.secondaryDomains?.includes(filterDomain as Domain);
    const matchesPartnered = !filterPartnered || b.isPartnership;
    return matchesSearch && matchesDomain && matchesPartnered;
  });

  const isAlreadyInJournal = (id: string) => userBadges.some(b => b.id === id);

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProposePartnership({
      partnerName: pName,
      partnerType: pType,
      description: pDesc,
      websiteUrl: pUrl || undefined
    });
    setShowPartnershipModal(false);
    setPName('');
    setPDesc('');
    setPUrl('');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h2 className="text-5xl font-bold guild-font tracking-tight text-slate-100">The Great Archive</h2>
          <p className="text-slate-400 mt-3 text-lg font-serif italic max-w-2xl">Explore verified trials, including interdisciplinary paths and sanctioned partnerships.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search scrolls & partners..." 
              className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl focus:outline-none focus:border-amber-500/50 w-full md:w-72 transition-all pr-12 text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
          <select 
            className="bg-slate-950/50 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 appearance-none cursor-pointer"
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value as any)}
          >
            <option value="All">All Disciplines</option>
            {Object.values(Domain).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button 
            onClick={() => setFilterPartnered(!filterPartnered)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterPartnered ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950/50 text-slate-400 border-slate-700/50'}`}
          >
            Partnerships Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(badge => {
          const inJournal = isAlreadyInJournal(badge.id);
          const isGuildmaster = badge.creatorId === 'guildmaster';

          return (
            <div key={badge.id} className="animate-in fade-in zoom-in-95 duration-500 relative h-full">
              <BadgeCard 
                badge={badge} 
                actionLabel={inJournal ? "Already Inscribed" : "Begin Inscription"}
                onAction={inJournal ? undefined : () => onDownload(badge)}
              />
              <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                {isGuildmaster && (
                  <span className="bg-slate-950/80 border border-amber-500/40 text-amber-500 text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest shadow-xl">
                    Council Official
                  </span>
                )}
                {badge.isPartnership && (
                  <span className="bg-blue-600 border border-blue-400 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest shadow-xl">
                    Partner: {badge.partnerName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Partnership Proposal Block */}
        <div className="bg-blue-900/10 border-2 border-dashed border-blue-500/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-6 hover:bg-blue-900/20 hover:border-blue-400 transition-all cursor-pointer group shadow-inner">
           <div className="w-32 h-32 bg-blue-950/50 rounded-full flex items-center justify-center border border-blue-800 transition-all duration-500 group-hover:scale-110 shadow-2xl">
              <span className="text-5xl group-hover:grayscale-0 grayscale transition-all">🤝</span>
           </div>
           <div>
             <h4 className="text-2xl font-bold guild-font text-blue-100">Propose a Partnership</h4>
             <p className="text-xs text-blue-300 mt-3 leading-relaxed italic font-serif px-4">"Suggest an organization, content creator, or institution to co-author verified guild milestones."</p>
           </div>
           <button 
             onClick={() => setShowPartnershipModal(true)}
             className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-blue-400 shadow-lg"
           >
             Submit Proposal →
           </button>
        </div>
      </div>
      
      {filtered.length === 0 && (searchTerm || filterDomain !== 'All' || filterPartnered) && (
        <div className="text-center py-32 animate-in fade-in duration-700">
          <div className="text-6xl mb-6 opacity-20">🌫️</div>
          <p className="text-slate-500 font-bold guild-font text-2xl">No matching inscriptions found.</p>
          <p className="text-slate-600 text-sm mt-2 italic">Broaden your search or check different disciplines.</p>
        </div>
      )}

      {/* Partnership Modal */}
      {showPartnershipModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[3rem] p-10 max-w-lg w-full animate-in zoom-in-95">
             <h3 className="text-2xl font-bold guild-font text-blue-400 mb-6 uppercase tracking-widest">Partnership Proposal</h3>
             <form onSubmit={handlePartnershipSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Propose Partner Name</label>
                    <input 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-200" 
                      value={pName}
                      onChange={e => setPName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Partnership Type</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-200"
                      value={pType}
                      onChange={e => setPType(e.target.value as any)}
                    >
                      <option value="Organization">Organization</option>
                      <option value="Creator">Content Creator</option>
                      <option value="Institution">Institution</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Description & Rationale</label>
                   <textarea 
                     required 
                     className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-200 h-32"
                     placeholder="Why should the Guild partner with them?"
                     value={pDesc}
                     onChange={e => setPDesc(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Official Website (Optional)</label>
                   <input 
                     className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-slate-200" 
                     value={pUrl}
                     onChange={e => setPUrl(e.target.value)}
                   />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowPartnershipModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500">Cancel</button>
                  <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Send to Council</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
