
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
  syncMode?: 'local' | 'personal_cloud' | 'guild_sync';
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin, syncMode, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Badge Journal', path: '/dashboard', icon: '📜' },
    { name: 'Great Ascent', path: '/ascent', icon: '🏔️' },
    { name: 'The Archive', path: '/library', icon: '📚' },
    { name: 'The Oracle', path: '/designer', icon: '✨' },
    { name: 'Colony Hub', path: '/colonies', icon: '🏰' },
    ...(isAdmin ? [{ name: 'Guildmaster Council', path: '/council', icon: '🏛️' }] : []),
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <nav className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col hidden md:flex shrink-0">
        <div className="mb-8">
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold guild-font guild-gold tracking-widest">BLUE HERON</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">The Guild Portal</p>
          </Link>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-amber-500/10 text-amber-500 border-r-4 border-amber-500 shadow-lg shadow-amber-900/10' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold tracking-wide">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 transition-all group"
          >
            <span className="group-hover:rotate-12 transition-transform">🔑</span>
            Revoke Access
          </button>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 shadow-inner">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Storage Mode</p>
              <span className={`w-1.5 h-1.5 rounded-full ${syncMode === 'local' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            </div>
            <p className="text-xs text-amber-500 font-bold capitalize">{syncMode?.replace('_', ' ') || 'Local'}</p>
          </div>
          <p className="text-[8px] text-slate-500 text-center uppercase tracking-tighter">Sovereign Data Protection Active</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-3 z-50 shadow-2xl backdrop-blur-md">
         {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 transition-transform active:scale-90 ${location.pathname === item.path ? 'text-amber-500' : 'text-slate-400'}`}
            >
              <span className="text-2xl">{item.icon}</span>
            </Link>
          ))}
          <button 
            onClick={onLogout}
            className="p-2 text-rose-500 transition-transform active:scale-90"
          >
            <span className="text-2xl">🔑</span>
          </button>
      </div>
    </div>
  );
};
