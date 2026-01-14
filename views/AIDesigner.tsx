
import React, { useState } from 'react';
import { suggestSingleTask, analyzeBadgeComplexity } from '../services/gemini';
import { Badge, Domain, Difficulty, DesignChoice, BadgeProposal, BadgeRequirement } from '../types';

interface AIDesignerProps {
  onProposePublic: (proposal: Omit<BadgeProposal, 'id' | 'userId' | 'userName' | 'status' | 'submittedAt'>) => void;
}

type ForgeStep = 'basic-info' | 'ai-ask' | 'task-design' | 'complexity-review' | 'petition-details';

export const AIDesigner: React.FC<AIDesignerProps> = ({ onProposePublic }) => {
  const [step, setStep] = useState<ForgeStep>('basic-info');
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Badge Basic State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<Domain>(Domain.SKILL);
  const [designChoice, setDesignChoice] = useState<DesignChoice>('template');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Curriculum State
  const [requirements, setRequirements] = useState<BadgeRequirement[]>([]);
  const [suggestedComplexity, setSuggestedComplexity] = useState<Difficulty>(Difficulty.THREE);
  const [userComplexity, setUserComplexity] = useState<Difficulty>(Difficulty.THREE);

  // Petition State
  const [goal, setGoal] = useState('');
  const [metrics, setMetrics] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addEmptyTask = () => {
    const newReq: BadgeRequirement = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      description: '',
      isCompleted: false,
      requireAttachment: true,
      requireNote: true
    };
    setRequirements([...requirements, newReq]);
  };

  const handleAISuggest = async () => {
    setIsProcessing(true);
    try {
      const existing = requirements.map(r => r.description);
      const taskText = await suggestSingleTask(title, description, existing);
      const newReq: BadgeRequirement = {
        id: `req-${Date.now()}`,
        description: taskText,
        isCompleted: false,
        requireAttachment: true,
        requireNote: true
      };
      setRequirements([...requirements, newReq]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToComplexity = async () => {
    setIsProcessing(true);
    try {
      const rating = await analyzeBadgeComplexity(title, description, requirements);
      setSuggestedComplexity(rating as Difficulty);
      setUserComplexity(rating as Difficulty);
      setStep('complexity-review');
    } catch (e) {
      setStep('complexity-review');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitToCouncil = () => {
    const badge: Badge = {
      id: `custom-${Date.now()}`,
      title,
      description,
      domain,
      difficulty: userComplexity,
      requirements,
      reflections: '',
      evidenceUrls: [],
      isVerified: false,
      isUserCreated: true,
      designChoice,
      visualAssetUrl: uploadedImage || undefined,
      badgeShape: 'circle'
    };
    onProposePublic({ badge, goal, metrics });
    resetForge();
  };

  const resetForge = () => {
    setStep('basic-info');
    setTitle('');
    setDescription('');
    setRequirements([]);
    setGoal('');
    setMetrics('');
    setUploadedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold guild-font text-slate-100">Forge of Inscriptions</h2>
        <p className="text-slate-400 mt-4 italic font-serif">"Every mastery begins with a single defined trial."</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-3xl min-h-[500px] flex flex-col">
        {step === 'basic-info' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-bold guild-font text-amber-500 border-b border-slate-800 pb-4">Step I: Identify the Craft</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Inscription Title</label>
                  <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master of Woodcraft" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Discipline Domain</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100" value={domain} onChange={e => setDomain(e.target.value as Domain)}>
                    {Object.values(Domain).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description</label>
                  <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 h-32" value={description} onChange={e => setDescription(e.target.value)} placeholder="What knowledge will be gained?" />
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Visual Sigil Choice</p>
                <div className="flex gap-4">
                  <button onClick={() => setDesignChoice('template')} className={`flex-1 py-4 border-2 rounded-xl text-xs font-bold transition-all ${designChoice === 'template' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-600'}`}>Guild Designed</button>
                  <button onClick={() => setDesignChoice('upload')} className={`flex-1 py-4 border-2 rounded-xl text-xs font-bold transition-all ${designChoice === 'upload' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 text-slate-600'}`}>Custom Upload</button>
                </div>
                {designChoice === 'upload' && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-6 cursor-pointer hover:bg-slate-950 transition-all">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    {uploadedImage ? <img src={uploadedImage} className="w-24 h-24 object-cover rounded-lg mb-2" /> : <span className="text-3xl mb-2">🖼️</span>}
                    <span className="text-[10px] uppercase font-black text-slate-500">{uploadedImage ? 'Sigil Loaded' : 'Select Artifact Image'}</span>
                  </label>
                )}
              </div>
            </div>
            <button disabled={!title || !description} onClick={() => setStep('ai-ask')} className="mt-auto w-full py-5 bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl disabled:opacity-50">Continue to Trials</button>
          </div>
        )}

        {step === 'ai-ask' && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-10 animate-in zoom-in-95 duration-500">
            <span className="text-7xl">🔮</span>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold guild-font">Consult the AI Oracle?</h3>
              <p className="text-slate-400 italic font-serif">"Shall the Oracle suggest rigorous trials based on your description?"</p>
            </div>
            <div className="flex gap-6 w-full max-w-sm">
              <button onClick={() => { setIsAIEnabled(false); setStep('task-design'); }} className="flex-1 py-4 border border-slate-700 rounded-xl font-bold text-slate-500 hover:text-white transition-all uppercase text-[10px]">No, I am the Architect</button>
              <button onClick={() => { setIsAIEnabled(true); setStep('task-design'); }} className="flex-1 py-4 bg-amber-600 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest">Invoke the Oracle</button>
            </div>
          </div>
        )}

        {step === 'task-design' && (
          <div className="space-y-6 flex-1 flex flex-col animate-in slide-in-from-right-12">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold guild-font">Step II: The Trials</h3>
              {isAIEnabled && (
                <button onClick={handleAISuggest} disabled={isProcessing} className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all">
                  {isProcessing ? 'Weaving...' : '✨ Suggest Task'}
                </button>
              )}
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
              {requirements.map((req, idx) => (
                <div key={req.id} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex gap-4">
                    <span className="text-amber-500 font-serif font-bold italic">{idx + 1}.</span>
                    <textarea className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 text-sm h-20" placeholder="Describe the trial..." value={req.description} onChange={e => {
                      const updated = [...requirements];
                      updated[idx].description = e.target.value;
                      setRequirements(updated);
                    }} />
                    <button onClick={() => setRequirements(requirements.filter(r => r.id !== req.id))} className="text-slate-600 hover:text-rose-500 transition-colors">✕</button>
                  </div>
                  <div className="flex gap-8 pl-8 border-t border-slate-900 pt-4">
                    <button onClick={() => {
                      const updated = [...requirements];
                      updated[idx].requireAttachment = !updated[idx].requireAttachment;
                      setRequirements(updated);
                    }} className="flex items-center gap-2 group">
                      <div className={`w-8 h-4 rounded-full transition-all relative ${req.requireAttachment ? 'bg-amber-600' : 'bg-slate-800'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${req.requireAttachment ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-slate-300">File Needed</span>
                    </button>
                    <button onClick={() => {
                      const updated = [...requirements];
                      updated[idx].requireNote = !updated[idx].requireNote;
                      setRequirements(updated);
                    }} className="flex items-center gap-2 group">
                      <div className={`w-8 h-4 rounded-full transition-all relative ${req.requireNote ? 'bg-amber-600' : 'bg-slate-800'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${req.requireNote ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-slate-300">Reflection Needed</span>
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addEmptyTask} className="w-full py-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-all font-bold text-xs uppercase">+ Add Trial Line</button>
            </div>
            <div className="flex gap-4 pt-4 mt-auto">
              <button onClick={() => setStep('ai-ask')} className="flex-1 py-4 border border-slate-800 rounded-xl text-slate-500 uppercase font-black text-[10px]">Back</button>
              <button disabled={requirements.length === 0} onClick={handleToComplexity} className="flex-[2] py-4 bg-amber-600 text-slate-950 font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl">Analyze Complexity</button>
            </div>
          </div>
        )}

        {step === 'complexity-review' && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-12 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold guild-font">Step III: The Weight</h3>
              <p className="text-slate-400 font-serif italic">"Does this rating reflect the true labor required?"</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setUserComplexity(v as Difficulty)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${userComplexity === v ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                    {v} ★
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-amber-500/50 font-black uppercase tracking-widest">Oracle's Suggestion: {suggestedComplexity} Stars</p>
            </div>
            <button onClick={() => setStep('petition-details')} className="w-full max-w-sm py-5 bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl">Confirm Rating & Finalize</button>
          </div>
        )}

        {step === 'petition-details' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-12">
            <h3 className="text-2xl font-bold guild-font text-amber-500 border-b border-slate-800 pb-4">Step IV: The Petition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Final Goal Statement</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 h-40" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Sum up the impact of this mastery..." />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Success Metrics</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 h-40" value={metrics} onChange={e => setMetrics(e.target.value)} placeholder="How do we measure success?" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('complexity-review')} className="flex-1 py-4 border border-slate-800 rounded-xl text-slate-500 uppercase font-black text-[10px]">Back</button>
              <button onClick={submitToCouncil} className="flex-[2] py-4 bg-amber-600 text-slate-950 font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl">Seal Petition to Council</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
