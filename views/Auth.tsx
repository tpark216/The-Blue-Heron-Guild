
import React, { useState } from 'react';
import { Domain } from '../types';

interface AuthProps {
  onLogin: (userData: { name: string; email: string; interest?: Domain }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'welcome' | 'register' | 'login'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<Domain>(Domain.SKILL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({ 
        name, 
        email, 
        interest: step === 'register' ? interest : undefined 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl relative z-10">
        {step === 'welcome' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
              <div className="text-6xl mb-4">🪶</div>
              <h1 className="text-3xl font-bold guild-font guild-gold tracking-widest">THE BLUE HERON GUILD</h1>
              <p className="text-slate-400 text-sm italic mt-2">A haven for self-directed mastery and community growth.</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setStep('register')}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all transform hover:scale-[1.02]"
              >
                Seek Admission
              </button>
              <button 
                onClick={() => setStep('login')}
                className="w-full py-4 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Log In to the Registry
              </button>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Blue Heron Connections • Est. 2024</p>
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-left-8 duration-300">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold guild-font text-amber-500">Identify Yourself</h2>
              <p className="text-slate-500 text-xs">Returning members, please state your name for the record.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Known Name</label>
                <input
                  type="text"
                  required
                  placeholder="The name inscribed in your journal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Digital Identifier (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="Your correspondence address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-900/40"
            >
              Re-enter the Gates
            </button>
            <button 
              type="button"
              onClick={() => setStep('welcome')}
              className="w-full text-xs text-slate-500 hover:text-white font-bold uppercase tracking-widest"
            >
              Return to Entrance
            </button>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold guild-font text-amber-500">Sign the Ledger</h2>
              <p className="text-slate-500 text-xs">Enter your details to begin your journey.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chosen Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rowan of the Valley"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Digital Correspondence (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="seeker@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Interest Path</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as Domain)}
                >
                  {Object.values(Domain).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-[10px] text-amber-500/70 font-bold uppercase mb-1">The Seeker's Vow</p>
              <p className="text-[10px] text-slate-400 italic">"I commit to the pursuit of mastery, the support of my Colony, and the ethical stewardship of the Guild's values."</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-900/40"
            >
              Confirm Admission
            </button>
            <button 
              type="button"
              onClick={() => setStep('welcome')}
              className="w-full text-xs text-slate-500 hover:text-white font-bold uppercase tracking-widest"
            >
              Return to Entrance
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
