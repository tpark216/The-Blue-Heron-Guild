
import React, { useState } from 'react';
import { Colony } from '../types';

interface ColoniesProps {
  colonies: Colony[];
  userColonyId?: string;
  onJoin: (colonyId: string) => void;
  // Fix: Omit isApproved from onPropose signature as it is handled by the parent state
  onPropose: (colony: Omit<Colony, 'id' | 'membersCount' | 'isApproved'>) => void;
}

export const Colonies: React.FC<ColoniesProps> = ({ colonies, userColonyId, onJoin, onPropose }) => {
  const [showPropose, setShowPropose] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColCharter, setNewColCharter] = useState('');
  const [newColSiege, setNewColSiege] = useState('The Virtual Siege');

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold guild-font">The Colony Network</h2>
          <p className="text-slate-400 mt-2">Find your local kin or establish a new node in the network.</p>
        </div>
        <button 
          onClick={() => setShowPropose(true)}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-6 py-2 rounded-lg font-bold transition-all"
        >
          Propose New Colony
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colonies.map(col => (
          <div key={col.id} className={`bg-slate-800 p-6 rounded-xl border ${userColonyId === col.id ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-slate-700'} hover:border-amber-500/50 transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold guild-font flex items-center gap-2">
                  {col.name}
                  {userColonyId === col.id && <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded italic">Home</span>}
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{col.siege} Siege • No. {col.number}</p>
              </div>
              <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">TBHG</div>
            </div>
            <p className="text-slate-300 text-sm italic mb-6">"{col.charter}"</p>
            <div className="flex items-center justify-between mt-auto">
               <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{col.membersCount} Members</span>
               {userColonyId === col.id ? (
                 <span className="text-emerald-500 text-xs font-bold uppercase">Membership Active</span>
               ) : (
                 <button 
                   onClick={() => onJoin(col.id)}
                   className="bg-slate-700 px-4 py-2 rounded text-xs font-bold hover:bg-amber-600 hover:text-slate-950 transition-all"
                 >
                   Request Entry
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {showPropose && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 max-w-lg w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold guild-font mb-6">Propose a New Colony</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Colony Name</label>
                <input required value={newColName} onChange={e => setNewColName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Siege</label>
                <select value={newColSiege} onChange={e => setNewColSiege(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100">
                  <option>The Virtual Siege</option>
                  <option>The Virginia Siege</option>
                  <option>The Pacific Siege</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Charter (The Mission)</label>
                <textarea required rows={3} value={newColCharter} onChange={e => setNewColCharter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowPropose(false)} className="flex-1 py-2 rounded font-bold border border-slate-700 hover:bg-slate-800">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded font-bold bg-amber-600 text-slate-950 hover:bg-amber-500">Seal Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
