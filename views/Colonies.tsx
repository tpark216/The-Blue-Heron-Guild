
import React, { useState, useMemo } from 'react';
import { Colony, UserProfile, ColonyEvent, ColonyNotice } from '../types';

interface ColoniesProps {
  colonies: Colony[];
  user: UserProfile;
  onJoin: (colonyId: string) => void;
  onPropose: (colony: Omit<Colony, 'id' | 'membersCount' | 'isApproved' | 'notices' | 'events'>) => void;
  onEventSignup: (colonyId: string, eventId: string) => void;
  onProposeEvent: (colonyId: string, event: Omit<ColonyEvent, 'id' | 'attendees' | 'creatorName'>) => void;
}

type ColonyTab = 'network' | 'chamber';
type Channel = 'general' | 'siege' | 'colony' | 'announcements' | 'events';

export const Colonies: React.FC<ColoniesProps> = ({ colonies, user, onJoin, onPropose, onEventSignup, onProposeEvent }) => {
  const [activeTab, setActiveTab] = useState<ColonyTab>(user.colonyId ? 'chamber' : 'network');
  const [activeChannel, setActiveChannel] = useState<Channel>('general');
  const [showPropose, setShowPropose] = useState(false);
  
  // Colony Proposal State
  const [newColName, setNewColName] = useState('');
  const [newColCharter, setNewColCharter] = useState('');
  const [newColSiege, setNewColSiege] = useState('The Virtual Siege');

  // Event Proposal State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eDesc, setEDesc] = useState('');
  const [eDate, setEDate] = useState('');

  const userColony = useMemo(() => colonies.find(c => c.id === user.colonyId), [colonies, user.colonyId]);

  const handleSubmitColony = (e: React.FormEvent) => {
    e.preventDefault();
    onPropose({
      name: newColName,
      charter: newColCharter,
      siege: newColSiege,
      number: Math.floor(Math.random() * 900) + 100,
    });
    setShowPropose(false);
    setNewColName('');
    setNewColCharter('');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.colonyId) return;
    onProposeEvent(user.colonyId, { title: eTitle, description: eDesc, date: eDate, colonyId: user.colonyId });
    setETitle('');
    setEDesc('');
    setEDate('');
    setShowEventForm(false);
  };

  // Simulated Chat Messages
  const messages: Record<string, { user: string; text: string; time: string }[]> = {
    general: [
      { user: 'Guildmaster Elara', text: 'Welcome to the global frequency. Remember, your data is your own.', time: '09:00 AM' },
      { user: 'Seeker_99', text: 'Just finished the Forest Stewardship trial! Anyone in Cascadia want to verify?', time: '11:42 AM' },
    ],
    siege: [
      { user: 'Siege Warden', text: `Access restricted to ${userColony?.siege || 'Siege'} members. Integrity checks complete.`, time: '10:00 AM' },
      { user: 'Pathfinder_Rex', text: 'Planning a group ascent in the local mountains next week.', time: '01:15 PM' },
    ],
    colony: [
      { user: 'Colony Elder', text: `Welcome to the ${userColony?.name || 'Colony'} private chamber.`, time: '08:30 AM' },
      { user: 'Member_Zoe', text: 'Does anyone have the physical forging kit I can borrow?', time: '04:20 PM' },
    ]
  };

  return (
    <div className="space-y-10 min-h-[70vh] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold guild-font uppercase tracking-tighter">The Colony Hub</h2>
          <p className="text-slate-400 mt-2 font-serif italic">Find your local kin or establish a new node in the network.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl">
          <button 
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'network' ? 'bg-amber-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Colony Network
          </button>
          {user.colonyId && (
            <button 
              onClick={() => setActiveTab('chamber')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chamber' ? 'bg-amber-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              My Chamber
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 animate-in fade-in duration-500">
        {activeTab === 'network' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colonies.map(col => (
                <div key={col.id} className={`bg-slate-900 border-2 p-8 rounded-[2.5rem] transition-all flex flex-col shadow-2xl relative overflow-hidden group ${user.colonyId === col.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                  {user.colonyId === col.id && <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl">My Home</div>}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold guild-font text-slate-100 group-hover:text-amber-500 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{col.siege} Siege • Node {col.number}</p>
                  </div>
                  <p className="text-slate-400 text-sm italic mb-10 leading-relaxed flex-1">"{col.charter}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{col.membersCount} Members Active</span>
                    {user.colonyId === col.id ? (
                      <span className="text-emerald-500 text-[10px] font-black uppercase">Active Member</span>
                    ) : (
                      <button 
                        onClick={() => onJoin(col.id)}
                        className="bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700"
                      >
                        Join Colony
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setShowPropose(true)}
                className="bg-slate-950/40 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-amber-500/30 hover:bg-slate-900/50 transition-all group shadow-inner"
              >
                <div className="text-5xl group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">🏛️</div>
                <div>
                   <h4 className="text-xl font-bold guild-font text-slate-300">Propose New Colony</h4>
                   <p className="text-xs text-slate-600 italic px-6 mt-2 font-serif">Establish a new node for shared mastery and local kinship.</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden flex h-[600px] shadow-3xl animate-in zoom-in-95 duration-300">
            {/* Sidebar like Discord */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-6 border-b border-slate-800">
                <h4 className="text-lg font-bold guild-font text-slate-100 truncate">{userColony?.name}</h4>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{userColony?.siege}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                 <div>
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-3 px-2">Voice of the Guild</p>
                    <button 
                      onClick={() => setActiveChannel('general')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${activeChannel === 'general' ? 'bg-amber-600 text-slate-950 font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                      <span className="text-base">#</span> general
                    </button>
                 </div>
                 <div>
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-3 px-2">The Siege Gate</p>
                    <button 
                      onClick={() => setActiveChannel('siege')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${activeChannel === 'siege' ? 'bg-amber-600 text-slate-950 font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                      <span className="text-base">#</span> {userColony?.siege?.toLowerCase().replace(' ', '-')}
                    </button>
                 </div>
                 <div>
                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-3 px-2">Inner Chamber</p>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setActiveChannel('colony')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${activeChannel === 'colony' ? 'bg-amber-600 text-slate-950 font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                      >
                        <span className="text-base">#</span> chatter
                      </button>
                      <button 
                        onClick={() => setActiveChannel('announcements')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${activeChannel === 'announcements' ? 'bg-amber-600 text-slate-950 font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                      >
                        <span className="text-base">📣</span> notices
                      </button>
                      <button 
                        onClick={() => setActiveChannel('events')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-all ${activeChannel === 'events' ? 'bg-amber-600 text-slate-950 font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                      >
                        <span className="text-base">🗓️</span> events
                      </button>
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-amber-500/20 text-lg">👤</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-tighter truncate">Online - Temporal Node</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Chat Content */}
            <main className="flex-1 flex flex-col relative">
               <header className="h-16 border-b border-slate-800 flex items-center px-8 justify-between">
                  <div className="flex items-center gap-3 text-slate-100 font-bold">
                     <span className="text-xl text-slate-500">#</span>
                     <span>{activeChannel === 'events' ? 'Community Gatherings' : activeChannel === 'announcements' ? 'Colony Notices' : activeChannel}</span>
                  </div>
                  {activeChannel === 'events' && (
                    <button 
                      onClick={() => setShowEventForm(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Propose Event
                    </button>
                  )}
               </header>

               <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                  {['general', 'siege', 'colony'].includes(activeChannel) && (
                    <div className="space-y-8">
                       {messages[activeChannel]?.map((m, i) => (
                         <div key={i} className="flex gap-4 group animate-in slide-in-from-bottom-2">
                            <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700 shadow-lg">
                               {m.user[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <span className="text-xs font-black text-amber-500 uppercase tracking-widest">{m.user}</span>
                                  <span className="text-[9px] text-slate-600">{m.time}</span>
                               </div>
                               <p className="text-sm text-slate-300 leading-relaxed">{m.text}</p>
                            </div>
                         </div>
                       ))}
                       {/* Placeholder for real-time engagement */}
                       <div className="pt-4 border-t border-slate-800/30">
                          <p className="text-[9px] text-slate-600 uppercase font-black text-center tracking-[0.4em] opacity-50">Encryption Tunnel Active • Only members of this path can perceive this frequency</p>
                       </div>
                    </div>
                  )}

                  {activeChannel === 'announcements' && (
                    <div className="space-y-6">
                       {userColony?.notices.length === 0 ? (
                         <div className="text-center py-20 opacity-30">
                           <div className="text-5xl mb-4">📯</div>
                           <p className="text-slate-500 italic">No formal notices from Colony leadership.</p>
                         </div>
                       ) : (
                         userColony?.notices.map(n => (
                           <div key={n.id} className="bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-xl space-y-2 animate-in slide-in-from-left-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-[9px] font-black uppercase text-amber-500">Notice from {n.author}</span>
                                 <span className="text-[9px] text-slate-600">{new Date(n.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-200 text-sm italic font-serif leading-relaxed">"{n.content}"</p>
                           </div>
                         ))
                       )}
                    </div>
                  )}

                  {activeChannel === 'events' && (
                    <div className="grid grid-cols-1 gap-6">
                       {userColony?.events.length === 0 ? (
                         <div className="text-center py-20 opacity-30">
                           <div className="text-5xl mb-4">🕯️</div>
                           <p className="text-slate-500 italic">The assembly hall is quiet. Propose a gathering to begin.</p>
                         </div>
                       ) : (
                         userColony?.events.map(e => (
                           <div key={e.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-8 animate-in zoom-in-95">
                              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                 <span className="text-[10px] font-black uppercase text-amber-500">{e.date.split('-')[1]}</span>
                                 <span className="text-2xl font-bold text-slate-100">{e.date.split('-')[2]}</span>
                              </div>
                              <div className="flex-1 space-y-3">
                                 <h4 className="text-xl font-bold guild-font text-slate-100">{e.title}</h4>
                                 <p className="text-xs text-slate-400 italic">"{e.description}"</p>
                                 <div className="flex flex-wrap gap-2 pt-2">
                                    {e.attendees.map((name, idx) => (
                                      <span key={idx} className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-[8px] font-black text-slate-500 uppercase">{name}</span>
                                    ))}
                                    <span className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg text-[8px] font-black text-emerald-500 uppercase">+ {e.attendees.length} attending</span>
                                 </div>
                              </div>
                              <div className="flex items-center">
                                 <button 
                                   disabled={e.attendees.includes(user.name)}
                                   onClick={() => onEventSignup(user.colonyId!, e.id)}
                                   className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${e.attendees.includes(user.name) ? 'bg-slate-800 text-emerald-500 border border-emerald-500/20' : 'bg-amber-600 text-slate-950 hover:bg-amber-500 shadow-xl'}`}
                                 >
                                   {e.attendees.includes(user.name) ? 'Signed Up ✓' : 'Join Event'}
                                 </button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                  )}
               </div>

               <footer className="p-6 border-t border-slate-800 bg-slate-900/50">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={`Send a transmission to #${activeChannel}...`} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-6 pr-16 text-sm focus:outline-none focus:border-amber-500 transition-all text-slate-200"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-amber-500 text-xl transition-colors">🕊️</button>
                  </div>
               </footer>
            </main>
          </div>
        )}
      </div>

      {/* Colony Proposal Modal */}
      {showPropose && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] p-10 max-w-lg w-full animate-in zoom-in-95 duration-200 shadow-3xl">
            <h3 className="text-3xl font-bold guild-font mb-8 text-amber-500 uppercase tracking-widest text-center">Establish New Node</h3>
            <form onSubmit={handleSubmitColony} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Colony Name</label>
                <input required value={newColName} onChange={e => setNewColName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 focus:border-amber-500 outline-none" placeholder="e.g. The Silver Spruce" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Siege</label>
                <select value={newColSiege} onChange={e => setNewColSiege(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 outline-none">
                  <option>The Virtual Siege</option>
                  <option>The Cascadia Siege</option>
                  <option>The Potomac Siege</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Charter & Mission</label>
                <textarea required rows={4} value={newColCharter} onChange={e => setNewColCharter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 focus:border-amber-500 outline-none" placeholder="What core trial binds your members?" />
              </div>
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setShowPropose(false)} className="flex-1 py-4 rounded-xl font-black uppercase text-[10px] text-slate-500 hover:text-white transition-all">Dismiss</button>
                <button type="submit" className="flex-[2] py-4 rounded-xl font-black uppercase text-[10px] bg-amber-600 text-slate-950 hover:bg-amber-500 shadow-xl transition-all">Submit Charter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Proposal Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-[3rem] p-10 max-w-lg w-full animate-in zoom-in-95 duration-200 shadow-3xl">
            <h3 className="text-2xl font-bold guild-font mb-8 text-amber-500 uppercase tracking-widest text-center">Propose Gathering</h3>
            <form onSubmit={handleEventSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Event Title</label>
                <input required value={eTitle} onChange={e => setETitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 focus:border-amber-500 outline-none" placeholder="e.g. Communal Gardening Workshop" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Execution Date</label>
                <input required type="date" value={eDate} onChange={e => setEDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gathering Objective</label>
                <textarea required rows={3} value={eDesc} onChange={e => setEDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 focus:border-amber-500 outline-none" placeholder="What will be mastered during this time?" />
              </div>
              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setShowEventForm(false)} className="flex-1 py-4 rounded-xl font-black uppercase text-[10px] text-slate-500 hover:text-white transition-all">Cancel</button>
                <button type="submit" className="flex-[2] py-4 rounded-xl font-black uppercase text-[10px] bg-amber-600 text-slate-950 hover:bg-amber-500 shadow-xl transition-all">Seal Gathering</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
