import React, { useState } from "react";
import { 
  User, 
  Terminal, 
  Save, 
  RefreshCw, 
  Award, 
  FileText, 
  Tv, 
  Sliders, 
  Info, 
  ExternalLink,
  Laptop,
  CheckCircle,
  Play
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetDatabase: () => void;
  setActiveTab: (tab: string) => void;
}

export default function ProfileView({
  profile,
  onSaveProfile,
  onResetDatabase,
  setActiveTab
}: ProfileViewProps) {
  // Form coordinates
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [currentCollege, setCurrentCollege] = useState(profile.currentCollege);
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear);
  const [isSaved, setIsSaved] = useState(false);

  // Active specs tabs for hackathon deliverables
  const [activeSpecTab, setActiveSpecTab] = useState<"ppt" | "script" | "dev" | "guide">("ppt");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      fullName,
      email,
      targetRole,
      currentCollege,
      graduationYear,
      joinedDate: profile.joinedDate
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDbReset = () => {
    if (confirm("Reset local storage and restore default seed files? This restores high-fidelity charts.")) {
      onResetDatabase();
    }
  };

  return (
    <div className="space-y-6">

      {/* Back and Home Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center bg-[#1E293B]/40 p-3 rounded-2xl border border-slate-800/60 animate-fadeIn" id="nav-shortcuts-profile animate-fadeIn">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-4.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#4F46E5]/15 transition duration-150"
            id="back-btn-dashboard"
          >
            <span>← Back to Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("landing")}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/60 transition duration-150"
            id="back-btn-homepage"
          >
            <span>🏠 Return to Homepage</span>
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400 text-right">
          Active Student Profile: <span className="text-[#06B6D4] font-bold">{profile?.currentCollege || "Jadavpur University"}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="profile-management-layout">
        
        {/* Profile Edit Column (Col span 5) */}
        <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] bg-[#4F46E5]/10 px-2 py-0.5 rounded w-max border border-[#4F46E5]/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile settings</span>
          </div>

          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest border-b border-slate-800/60 pb-2">Edit Candidate Parameters</h3>

          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#06B6D4]">Student full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-lg p-2.5 text-xs text-slate-202 text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#06B6D4]">Placement Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-lg p-2.5 text-xs text-slate-205 text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#06B6D4]">Target placement Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#06B6D4]">Current College / Institute</label>
              <input
                type="text"
                required
                value={currentCollege}
                onChange={(e) => setCurrentCollege(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#06B6D4]">Expected Graduation Year</label>
              <input
                type="text"
                required
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
              />
            </div>

            {isSaved && (
              <p className="text-xs font-mono text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded border border-emerald-900/30">
                ✓ Academic profile updated successfully!
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md shadow-[#4F46E5]/15"
              id="btn-profile-save"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>Save Profile settings</span>
            </button>
          </form>

          {/* Reset Control */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-left">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Diagnostic controls</h4>
            <button
              onClick={handleDbReset}
              className="w-full py-2 border border-slate-805 hover:bg-[#311116] text-rose-450 text-rose-450 text-rose-400 hover:text-rose-350 text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition"
              id="btn-db-reset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset placement Database state</span>
            </button>
          </div>
        </div>

        {/* Specs and Deliverables Tabs (Col span 7) */}
        <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-slate-200 text-left">Placement Hackathon Deliverables Specs</h3>
            <p className="text-[10px] text-slate-500 text-left">Access slide outlines, demo scripts, and architecture details directly</p>
          </div>

          {/* Specs subtabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#0F172A] rounded-xl border border-slate-800/60">
            {[
              { id: "ppt", label: "PPT Contents", icon: FileText },
              { id: "script", label: "Demo Script", icon: Tv },
              { id: "dev", label: "Technical Blueprint", icon: Laptop },
              { id: "guide", label: "Deployment Guide", icon: Sliders }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSpecTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    activeSpecTab === tab.id 
                      ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/15" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/30"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800/60 overflow-y-auto no-scrollbar max-h-96 text-left font-mono text-xs text-slate-300 space-y-4">
            
            {/* PPT OUTLINE */}
            {activeSpecTab === "ppt" && (
              <div className="space-y-4 font-mono">
                <h4 className="text-sm font-extrabold text-indigo-400 border-b border-slate-850 pb-2">Slide Outlines: InterviewAce AI Pitch Presentation</h4>
                
                <div className="space-y-3.5">
                  <div className="p-3 bg-slate-900/50 rounded border border-slate-850">
                    <p className="text-xs font-extrabold text-white">Slide 1: Title and Tagline</p>
                    <p className="text-[10px] text-slate-400 mt-1">• Title: InterviewAce AI</p>
                    <p className="text-[10px] text-slate-405 text-slate-400">• Tagline: AI-Powered Resume Analyzer & Interview Coach</p>
                    <p className="text-[10px] text-slate-400">• Creator: Shayan Roy Placement Sandbox</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded border border-slate-850">
                    <p className="text-xs font-extrabold text-white">Slide 2: The Core Problem</p>
                    <p className="text-[10px] text-slate-405 text-slate-400">• University students struggle with placement readiness due to implicit corporate expectations.</p>
                    <p className="text-[10px] text-slate-440 text-slate-400">• Standard tools lack actionable technical skill recommendations or customized mock simulations mapped onto their listed academic projects.</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded border border-slate-850">
                    <p className="text-xs font-extrabold text-white">Slide 3: Our Solution</p>
                    <p className="text-[10px] text-slate-400">• Real-time Adaptive ATS score estimator measuring sub-criterion fields (contact, education, formatting, certified keywords).</p>
                    <p className="text-[10px] text-slate-400">• Speech transcription voice microphone coach testing confidence delivery and conceptual technical correctness instantly.</p>
                    <p className="text-[10px] text-slate-400">• Gantt milestone transition roadmap generating daily checklist items.</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded border border-slate-850">
                    <p className="text-xs font-extrabold text-white">Slide 4: Double Scoring Mathematical Logic</p>
                    <p className="text-[10px] text-slate-400">• ATS Index: Contact(10) + Academics(15) + Projects(15) + Skills(20) + Work(15) + Certifications(10) + Keywords(10) + Style(5) = Max 100.</p>
                    <p className="text-[10px] text-slate-400">• Coach scoring formula: Technical Accuracy (30%) + Communication (20%) + Confidence (20%) + Relevance (15%) + Grammar (15%) = Max 100.</p>
                  </div>
                </div>
              </div>
            )}

            {/* DEMO VIDEO SCRIPT */}
            {activeSpecTab === "script" && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-indigo-400 border-b border-slate-850 pb-2">Presenter Demo Script (2-minute Timeline)</h4>
                
                <div className="space-y-3 font-sans leading-relaxed text-slate-350">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-850 border-l-4 border-l-indigo-500">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">0:00 - 0:30 | HOOK INTRO</p>
                    <p className="text-xs italic text-slate-300">
                      "Hello judges! Over 70% of engineering students fail their initial rounds because their resumes don't align with corporate ATS indexing. Introducing InterviewAce AI—your personal placement appraisal simulator built with custom analytical neural models."
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-850 border-l-4 border-l-cyan-500">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">0:30 - 1:15 | DYNAMIC AUDIT & MOCK SETUP</p>
                    <p className="text-xs italic text-slate-300">
                      "Watch how we paste a standard academic resume details and run a deep appraisal. Instantly, our model grades contact accuracy, highlights missing recruiter systems, and tracks strengths and weaknesses. We then launch our mock technical panel which parses our projects to generate questions tailored directly to us."
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded border border-slate-850 border-l-4 border-l-purple-500">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">1:15 - 2:00 | COACH VOICE & ROADMAP RESULTS</p>
                    <p className="text-xs italic text-slate-300">
                      "I speak my response using the advanced Speech Recognition tool, simulating active high pressure delivery pacing. Our evaluator instantly scores delivery accuracy, communication flow, and provides suggest improvements. Finally, we establish our Gantt checklist, tracking weekly tasks to 100% placement success. Thank you!"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TECHNICAL BLUEPRINT */}
            {activeSpecTab === "dev" && (
              <div className="space-y-4 text-xs font-mono">
                <h4 className="text-sm font-extrabold text-indigo-400 border-b border-slate-855 border-slate-850 pb-2">System Topology and Core Libraries</h4>
                
                <div className="space-y-2.5 text-slate-400">
                  <p><span className="text-white">Frontend Architecture:</span> Single Page React 18+ App managed via standard hooks, styled with glassmorphic Tailwind utility variables.</p>
                  <p><span className="text-white">Backend Architecture:</span> Express.js server on standard Node hosting REST endpoints mapped chronologically to standard prompt templates.</p>
                  <p><span className="text-white">AI Engine Core:</span> Self-developed multi-pass evaluation model for exceptionally low response latency.</p>
                  <p><span className="text-white">Charting Tool:</span> Recharts Responsive Area & Radar visualizers.</p>
                  <p><span className="text-white">Persistence Strategy:</span> Local browser caching Layer ensuring resume history scores and checked roadmap weekly checklist items survive browser refreshes.</p>
                </div>
              </div>
            )}

            {/* DEPLOYMENT GUIDE */}
            {activeSpecTab === "guide" && (
              <div className="space-y-3 text-xs text-left text-slate-400 font-mono">
                <h4 className="text-sm font-extrabold text-indigo-400 border-b border-slate-850 pb-2">Vercel & Cloud Environment Variables</h4>
                
                <p>1. Copy all source files into your local project workspace.</p>
                <p>2. Create a production <span className="text-white">.env</span> file declaring the required API secrets:</p>
                
                <div className="bg-slate-900 p-2 rounded text-[10px] text-white border border-slate-850">
                  <p>AI_SERVICE_KEY="YourCustomIntelligentServiceTokenHere"</p>
                  <p>APP_URL="https://interviewace-ai.vercel.app"</p>
                  <p>NODE_ENV="production"</p>
                </div>

                <p>3. Build and test locally using commands:</p>
                <div className="bg-slate-900 p-2 rounded text-[10px] text-white border border-slate-850">
                  <p>npm run build</p>
                  <p>npm run start</p>
                </div>
                
                <p>4. Deploy seamlessly on Vercel or standard Cloud platforms!</p>
              </div>
            )}

          </div>

          {/* Prompt guide footnote */}
          <div className="flex gap-2 p-3 bg-[#1E293B]/40 text-[10.5px] text-slate-400 rounded-lg border border-slate-800/60 text-left">
            <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
            <p>Database Reset will wipe local evaluations cache and restore our top presentation data. Use this control if you wish to reset your sandbox demonstration state.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
