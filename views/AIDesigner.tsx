
import React, { useState } from 'react';
import { generateBadgeContent } from '../services/gemini';
import { Badge, Domain, Difficulty, DesignChoice, BadgeShape } from '../types';

interface AIDesignerProps {
  onBadgeCreated: (badge: Badge) => void;
}

export const AIDesigner: React.FC<AIDesignerProps> = ({ onBadgeCreated }) => {
  const [mode, setMode] = useState<'choice' | 'manual' | 'ai'>('choice');
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<Partial<Badge> | null>(null);
  
  // Design State
  const [designChoice, setDesignChoice] = useState<DesignChoice>('template');
  const [badgeShape, setBadgeShape] = useState<BadgeShape>('circle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Manual Creation State
  const [manualBadge, setManualBadge] = useState<Partial<Badge>>({
    title: '',
    description: '',
    domain: Domain.SKILL,
    difficulty: Difficulty.ONE,
    requirements: [
      { id: '1', description: 'Trial one of mastery.', isCompleted: false },
      { id: '2', description: 'Trial two of service.', isCompleted: false }
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setDesignChoice('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIInvoke = async () => {
    if (!topic || !goal) return;
    setIsGenerating(true);
    try {
      const result = await generateBadgeContent(topic, goal);
      setPreview(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBadge = (data: Partial<Badge>) => {
    const newBadge: Badge = {
      ...data as Badge,
      id: `custom-${Date.now()}`,
      reflections: '',
      evidenceUrls: [],
      isVerified: false,
      isUserCreated: true,
      icon: '✨',
      designChoice,
      badgeShape,
      visualAssetUrl: uploadedImage || undefined
    };
    onBadgeCreated(newBadge);
    resetForm();
  };

  const resetForm = () => {
    setPreview(null);
    setMode('choice');
    setDesignChoice('template');
    setUploadedImage(null);
    setTopic('');
    setGoal('');
    setBadgeShape('circle');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'opacity-100' : 'opacity-20'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const BadgeForgeUI = () => (
    <div className="bg-slate-950 border-2 border-slate-800 p-8 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-transparent"></div>
      
      <div className="w-full">
        <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-[0.3em] flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Artifact Geometry
        </h4>
        
        {/* Shape Selector */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(['circle', 'square', 'rectangle'] as BadgeShape[]).map(shape => (
            <button 
              key={shape}
              type="button"
              onClick={() => setBadgeShape(shape)}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${badgeShape === shape ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-slate-800 bg-slate-900/50 opacity-60 hover:opacity-100'}`}
            >
              <div className={`w-8 h-8 border-2 transition-all ${badgeShape === shape ? 'border-amber-500' : 'border-slate-600'} ${shape === 'circle' ? 'rounded-full' : (shape === 'rectangle' ? 'rounded-sm aspect-[4/3] w-10 h-8 mt-1' : 'rounded-md')}`}></div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{shape}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6 pt-6 border-t border-slate-900">
          <p className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em]">Design Source</p>
          <div className="grid grid-cols-1 gap-4">
            <label className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploadedImage ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900'}`}>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              <div className="text-4xl mb-3">{uploadedImage ? '🖼️' : '📤'}</div>
              <div className="text-[10px] font-black uppercase tracking-widest">{uploadedImage ? 'Design Received' : 'Upload Artifact Design'}</div>
              <p className="text-[8px] text-slate-500 mt-2 uppercase tracking-tighter italic">Standard 4" x 4" physical format</p>
            </label>
          </div>
        </div>
      </div>

      {/* Real-time Forge Preview */}
      <div className="pt-10 flex flex-col items-center">
         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-6 italic">The Forge Mirror</p>
         <div className={`w-40 h-40 bg-slate-900 border-4 border-amber-500/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden transition-all duration-500 ${badgeShape === 'circle' ? 'rounded-full' : (badgeShape === 'rectangle' ? 'rounded-xl aspect-[4/3] w-48 h-36' : 'rounded-3xl')}`}>
            {uploadedImage ? (
              <img src={uploadedImage} className="w-full h-full object-cover animate-in fade-in duration-700" />
            ) : (
              <div className="text-4xl opacity-20 filter grayscale animate-pulse">📜</div>
            )}
         </div>
         <p className="text-[8px] text-slate-600 mt-6 max-w-[200px] text-center uppercase tracking-widest leading-relaxed">
           "Whether circle, square, or rectangle, the artifact occupies a standard 4-inch footprint."
         </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-5xl font-bold guild-font tracking-tight text-slate-100">The Forge of Inscriptions</h2>
        <p className="text-slate-400 mt-3 text-lg italic max-w-2xl mx-auto font-serif">Seekers do not merely earn badges; they define the geometry of their own mastery.</p>
      </div>

      {mode === 'choice' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in zoom-in-95 duration-500">
          <button 
            onClick={() => setMode('manual')}
            className="group bg-slate-900 border-2 border-slate-800 p-12 rounded-[3rem] text-left hover:border-amber-500/40 transition-all flex flex-col items-start space-y-6 shadow-2xl"
          >
            <div className="text-5xl bg-slate-800 p-5 rounded-3xl group-hover:bg-amber-500/10 group-hover:scale-110 transition-all shadow-xl">🛠️</div>
            <div>
              <h3 className="text-3xl font-bold guild-font text-slate-100">Manual Forge</h3>
              <p className="text-slate-400 mt-2 leading-relaxed text-sm">Forge every trial and visual sigil with your own intent. No Oracle intervention.</p>
            </div>
            <span className="text-amber-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-auto group-hover:translate-x-4 transition-transform">Begin Drafting →</span>
          </button>

          <button 
            onClick={() => setMode('ai')}
            className="group bg-slate-950 border-2 border-amber-500/10 p-12 rounded-[3rem] text-left hover:border-amber-500/40 transition-all flex flex-col items-start space-y-6 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 text-amber-500 opacity-5 text-9xl group-hover:opacity-10 transition-all pointer-events-none">✨</div>
            <div className="text-5xl bg-amber-500/10 p-5 rounded-3xl group-hover:scale-110 transition-all shadow-xl">🔮</div>
            <div>
              <h3 className="text-3xl font-bold guild-font text-amber-500">Oracle Weaving</h3>
              <p className="text-slate-400 mt-2 leading-relaxed text-sm">Consult the High Council's Oracle to weave a balanced curriculum of physical trials.</p>
            </div>
            <span className="text-amber-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-auto group-hover:translate-x-4 transition-transform">Consult the Sight →</span>
          </button>
        </div>
      )}

      {(mode === 'ai' || mode === 'manual') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[3.5rem] p-12 space-y-10 shadow-3xl">
            <button onClick={() => setMode('choice')} className="text-[10px] text-slate-500 hover:text-white uppercase font-black tracking-[0.3em] flex items-center gap-3 group transition-colors">
               <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> Return to Archive Entrance
            </button>
            
            {mode === 'ai' ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Mastery Topic</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 focus:border-amber-500/50 focus:outline-none transition-all shadow-inner" 
                    placeholder="e.g. Lunar Navigation" 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">The Seeker's Intent</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 focus:border-amber-500/50 focus:outline-none transition-all shadow-inner font-serif" 
                    rows={4} 
                    placeholder="Describe the ultimate mastery you seek..."
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAIInvoke}
                  disabled={isGenerating || !topic || !goal}
                  className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition-all shadow-2xl shadow-amber-900/30 disabled:opacity-50 uppercase tracking-[0.3em] text-xs"
                >
                  {isGenerating ? 'The Oracle is Speaking...' : 'Summon Curriculum'}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Inscription Title</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 focus:border-amber-500/50 focus:outline-none shadow-inner" 
                    value={manualBadge.title}
                    onChange={e => setManualBadge({...manualBadge, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Domain</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 appearance-none"
                        value={manualBadge.domain}
                        onChange={e => setManualBadge({...manualBadge, domain: e.target.value as Domain})}
                      >
                        {Object.values(Domain).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Complexity (Stars)</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 appearance-none"
                        value={manualBadge.difficulty}
                        onChange={e => setManualBadge({...manualBadge, difficulty: parseInt(e.target.value) as Difficulty})}
                      >
                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Star{v > 1 ? 's' : ''} ({v === 1 ? 'Quick' : v === 5 ? 'Vast' : 'Steady'})</option>)}
                      </select>
                   </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Description</label>
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 focus:border-amber-500/50 focus:outline-none shadow-inner font-serif" 
                    rows={4}
                    value={manualBadge.description}
                    onChange={e => setManualBadge({...manualBadge, description: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => saveBadge(manualBadge)}
                  className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition-all shadow-2xl uppercase tracking-[0.3em] text-xs"
                >
                  Seal Custom Inscription
                </button>
              </div>
            )}
          </div>

          <div className="space-y-10">
            <BadgeForgeUI />
            
            {preview && (
              <div className="bg-slate-950/80 border-2 border-emerald-500/20 p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-right-12 duration-700 shadow-3xl relative overflow-hidden backdrop-blur-xl">
                 <div className="absolute top-0 right-0 bg-emerald-600 text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-xl">The Revelation</div>
                 <div className="flex justify-between items-start gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-4xl font-bold text-emerald-400 guild-font leading-tight">{preview.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Complexity:</span>
                        {renderStars(preview.difficulty || 1)}
                      </div>
                    </div>
                    <div className={`w-24 h-24 border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-2xl ${badgeShape === 'circle' ? 'rounded-full' : (badgeShape === 'rectangle' ? 'rounded-xl' : 'rounded-2xl')}`}>
                       {uploadedImage ? (
                         <img src={uploadedImage} alt="Forge Art" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-slate-900 flex items-center justify-center text-4xl">✨</div>
                       )}
                    </div>
                 </div>
                 <p className="text-slate-400 text-lg leading-relaxed italic font-serif border-l-2 border-emerald-500/20 pl-6">"{preview.description}"</p>
                 <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> The Weaving of Trials:
                    </p>
                    <ul className="space-y-3">
                       {preview.requirements?.map((req, i) => (
                         <li key={i} className="flex items-start gap-4">
                           <span className="text-emerald-500 font-bold font-serif">{i + 1}.</span>
                           <span className="text-slate-300 text-sm leading-tight">{req.description}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button onClick={() => setPreview(null)} className="flex-1 py-4 rounded-xl border border-slate-800 font-bold text-slate-500 hover:text-white transition-all text-xs uppercase tracking-widest">Discard Sight</button>
                    <button onClick={() => saveBadge(preview)} className="flex-[2] py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black transition-all shadow-xl text-xs uppercase tracking-widest">Inscribe to Journal</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
