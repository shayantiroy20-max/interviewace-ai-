import React, { useState, useEffect } from "react";
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredResumes, 
  addStoredResume, 
  getStoredInterviews, 
  addStoredInterview, 
  getStoredRoadmaps, 
  addStoredRoadmap, 
  saveStoredRoadmaps,
  getStoredActivity, 
  addActivity,
  clearAllData 
} from "./utils/storage";
import { 
  UserProfile, 
  ResumeAnalysis, 
  InterviewSession, 
  CareerRoadmap, 
  ActivityLog 
} from "./types";
import Navbar from "./components/Navbar";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import ResumeAnalyzerView from "./components/ResumeAnalyzerView";
import InterviewCoachView from "./components/InterviewCoachView";
import RoadmapGeneratorView from "./components/RoadmapGeneratorView";
import ProfileView from "./components/ProfileView";
import { Sparkles, Terminal, LogIn, Mail, User, ShieldCheck } from "lucide-react";
import { playSound } from "./utils/sounds";

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTabRaw] = useState<string>("landing");
  
  const changeTab = (tab: string) => {
    playSound.playClick();
    setActiveTabRaw(tab);
  };
  
  // Persistent State variables
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Starts on the main landing page as expected
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE_FALLBACK);
  const [resumes, setResumes] = useState<ResumeAnalysis[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Active highlighted entries
  const [activeResume, setActiveResume] = useState<ResumeAnalysis | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(null);

  // Custom User popup sign in
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginCollege, setLoginCollege] = useState("Kalinga Institute of Industrial Technology");
  const [customLoginCollege, setCustomLoginCollege] = useState("");

  // Populate data on start
  useEffect(() => {
    loadAllStorageData();
  }, []);

  const loadAllStorageData = () => {
    const prof = getStoredProfile();
    const resList = getStoredResumes();
    const intList = getStoredInterviews();
    const rdmpList = getStoredRoadmaps();
    const actList = getStoredActivity();

    setProfile(prof);
    setResumes(resList);
    setInterviews(intList);
    setRoadmaps(rdmpList);
    setActivityLogs(actList);

    if (resList.length > 0) setActiveResume(resList[0]);
    if (rdmpList.length > 0) setActiveRoadmap(rdmpList[0]);
  };

  // State Change Triggers
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    saveStoredProfile(updatedProfile);
    setProfile(updatedProfile);
    playSound.playSuccess();
    addActivity({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "milestone_completed",
      title: "User Profile Updated",
      description: `Target role was modified to: ${updatedProfile.targetRole}`
    });
    setActivityLogs(getStoredActivity());
  };

  const handleAnalysisSuccess = (newAnalysis: ResumeAnalysis) => {
    addStoredResume(newAnalysis);
    const updatedRes = getStoredResumes();
    setResumes(updatedRes);
    playSound.playSuccess();
    setActivityLogs(getStoredActivity());
  };

  const handleInterviewCompleted = (newSession: InterviewSession) => {
    addStoredInterview(newSession);
    setInterviews(getStoredInterviews());
    playSound.playSuccess();
    setActivityLogs(getStoredActivity());
  };

  const handleRoadmapCreated = (newRoadmap: CareerRoadmap) => {
    addStoredRoadmap(newRoadmap);
    const updatedMaps = getStoredRoadmaps();
    setRoadmaps(updatedMaps);
    playSound.playSuccess();
    setActivityLogs(getStoredActivity());
  };

  // When task or milestone checkbox state values toggle
  const handleUpdateRoadmap = (updatedRoadmap: CareerRoadmap) => {
    const currentList = getStoredRoadmaps();
    const index = currentList.findIndex(m => m.id === updatedRoadmap.id);
    if (index !== -1) {
      currentList[index] = updatedRoadmap;
      saveStoredRoadmaps(currentList);
      setRoadmaps(currentList);
      setActivityLogs(getStoredActivity());
    }
  };

  const handleResetDatabase = () => {
    clearAllData();
    // Re-seed original presentation items
    loadAllStorageData();
    playSound.playClick();
    changeTab("dashboard");
  };

  // Custom simulation logins
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName) return;

    playSound.playSuccess();
    const finalCollege = loginCollege;
    const newProfile: UserProfile = {
      fullName: loginName,
      email: loginEmail,
      targetRole: "Software Developer",
      currentCollege: finalCollege || "Jadavpur University",
      graduationYear: "2027",
      joinedDate: new Date().toISOString()
    };

    saveStoredProfile(newProfile);
    setProfile(newProfile);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    changeTab("dashboard");
    
    addActivity({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "milestone_completed",
      title: "Placement sandbox account active",
      description: `Authenticated placement profile for '${loginName}'`
    });
    setActivityLogs(getStoredActivity());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    playSound.playClick();
    changeTab("landing");
  };

  return (
    <div className="bg-[#0F172A] text-[#F8FAFC] min-h-screen font-sans antialiased text-left selection:bg-[#4F46E5] selection:text-white flex flex-col justify-between">
      
      {/* Sleek top Header custom bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={changeTab} 
        profile={profile}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => { playSound.playClick(); setShowLoginModal(true); }}
      />

      {/* Main Workspace Frame container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* LANDING TAB */}
        {activeTab === "landing" && (
          <LandingView 
            isLoggedIn={isLoggedIn}
            profile={profile}
            onStart={() => {
              playSound.playClick();
              if (isLoggedIn) {
                changeTab("dashboard");
              } else {
                setShowLoginModal(true);
              }
            }}
            onLogout={handleLogout}
            onLoginSubmit={(name, email, college) => {
              playSound.playSuccess();
              const newProfile: UserProfile = {
                fullName: name,
                email: email,
                targetRole: "Software Developer",
                currentCollege: college || "Kalinga Institute of Industrial Technology",
                graduationYear: "2027",
                joinedDate: new Date().toISOString()
              };
              saveStoredProfile(newProfile);
              setProfile(newProfile);
              setIsLoggedIn(true);
              addActivity({
                id: `act-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: "milestone_completed",
                title: "Placement sandbox account active",
                description: `Authenticated placement profile for '${name}'`
              });
              setActivityLogs(getStoredActivity());
              changeTab("dashboard");
            }}
          />
        )}

        {/* DASHBOARD TAB */}
        {isLoggedIn && activeTab === "dashboard" && (
          <DashboardView 
            profile={profile}
            resumes={resumes}
            interviews={interviews}
            roadmaps={roadmaps}
            activityLogs={activityLogs}
            setActiveTab={changeTab}
            onRefreshData={loadAllStorageData}
          />
        )}

        {/* RESUME ANALYZER TAB */}
        {isLoggedIn && activeTab === "resume" && (
          <ResumeAnalyzerView 
            onAnalysisSuccess={handleAnalysisSuccess}
            resumes={resumes}
            activeResume={activeResume}
            setActiveResume={setActiveResume}
            setActiveTab={changeTab}
            profile={profile}
          />
        )}

        {/* INTERVIEW COACH TAB */}
        {isLoggedIn && activeTab === "interview" && (
          <InterviewCoachView 
            activeResume={activeResume}
            onInterviewCompleted={handleInterviewCompleted}
            sessionsHistory={interviews}
            setActiveTab={changeTab}
            profile={profile}
          />
        )}

        {/* CAREER ROADMAP TAB */}
        {isLoggedIn && activeTab === "roadmap" && (
          <RoadmapGeneratorView 
            onRoadmapCreated={handleRoadmapCreated}
            roadmaps={roadmaps}
            activeRoadmap={activeRoadmap}
            setActiveRoadmap={setActiveRoadmap}
            onUpdateRoadmap={handleUpdateRoadmap}
            activeResume={activeResume}
            setActiveTab={changeTab}
            profile={profile}
          />
        )}

        {/* USER PROFILE TAB */}
        {isLoggedIn && activeTab === "profile" && (
          <ProfileView 
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onResetDatabase={handleResetDatabase}
            setActiveTab={changeTab}
          />
        )}
      </main>

      {/* FOOTER STATS PANEL (Only visible during dashboard navigation) */}
      {isLoggedIn && activeTab !== "landing" && (
        <div className="border-t border-slate-800/60 bg-[#1E293B]/40 py-4 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" /> SECURE SECRETS SANDBOX</span>
            <span>SYSTEM CONSOLE: SYNCHRONIZED</span>
            <span>TIMESTAMP: 2026 UTC BUILD</span>
          </div>
        </div>
      )}

      {/* Custom Sleek Modal Overlay for Authentication */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#1E293B]/95 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl relative animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-[#4F46E5]/15 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto text-[#4F46E5]">
                <LogIn className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Unlock InterviewAce AI</h3>
              <p className="text-slate-400 text-[11px] max-w-xs mx-auto text-center leading-normal">
                Enter your placement details to seed high-fidelity mock charts and start analyzing developer resumes.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#06B6D4]" />
                  <span>Candidate Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rohan Sharma"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#06B6D4]" />
                  <span>Placement Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="rohan.placement@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">College/Institute (India or Global)</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. Kalinga Institute of Industrial Technology, IIT Bombay, NIT Trichy"
                   value={loginCollege}
                   onChange={(e) => setLoginCollege(e.target.value)}
                   className="w-full bg-[#0F172A] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                 />
               </div>

               <button
                 type="submit"
                 className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-md shadow-indigo-600/10"
                 id="btn-login-modal-submit"
               >
                 Sign In & Initialize Sandbox
               </button>
             </form>

             <button
               onClick={() => setShowLoginModal(false)}
               className="text-[11px] font-mono text-slate-400 hover:text-rose-400 decoration-dotted hover:underline mt-2 cursor-pointer w-full text-center"
             >
               Cancel
             </button>
           </div>
         </div>
       )}
     </div>
   );
 }

 // Global fallback mock startup details
 const DEFAULT_PROFILE_FALLBACK: UserProfile = {
   fullName: "Rohan Sharma",
   email: "rohan.placement@gmail.com",
   targetRole: "Software Developer",
   currentCollege: "Kalinga Institute of Industrial Technology",
   graduationYear: "2027",
   joinedDate: "2026-06-18T10:00:00Z"
 };
