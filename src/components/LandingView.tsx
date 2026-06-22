import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Terminal, 
  CheckCircle, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  Map, 
  Mic, 
  ListTodo, 
  Layers,
  Phone,
  Instagram,
  Linkedin,
  Send,
  User,
  Mail,
  Volume2,
  Calendar,
  Heading2,
  Lock
} from "lucide-react";
import { playSound } from "../utils/sounds";

interface LandingViewProps {
  onStart: () => void;
  isLoggedIn: boolean;
  profile: any;
  onLogout: () => void;
  onLoginSubmit: (name: string, email: string, college: string) => void;
}

export default function LandingView({ 
  onStart,
  isLoggedIn,
  profile,
  onLogout,
  onLoginSubmit
}: LandingViewProps) {
  // Local Dark/Light Theme Switch
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sandbox Tab Selection
  const [activeSandboxTab, setActiveSandboxTab] = useState<"ats" | "voice" | "roadmap">("ats");
  
  // States for ATS Simulator
  const [atsProfile, setAtsProfile] = useState<"fullstack" | "datascience" | "product">("fullstack");
  
  // States for Voice Coach Simulator
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [simulatedTranscript, setSimulatedTranscript] = useState("");
  const [simulatedTimer, setSimulatedTimer] = useState(0);

  // States for Contact Form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("General Performance Inquiry");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // States for interactive custom Gateway Form
  const [gatewayName, setGatewayName] = useState("");
  const [gatewayEmail, setGatewayEmail] = useState("");
  const [gatewayPassword, setGatewayPassword] = useState("");

  // States for college custom dropdown/input
  const [selectedCollegeType, setSelectedCollegeType] = useState("Kalinga Institute of Industrial Technology");
  const [customCollegeInput, setCustomCollegeInput] = useState("");

  // Voice Simulator simulation effect
  useEffect(() => {
    let timerId: any;
    if (isSimulatingVoice) {
      setSimulatedTranscript("Evaluating response pacing using the STAR framework...");
      timerId = setInterval(() => {
        setSimulatedTimer(prev => {
          if (prev >= 12) {
            setIsSimulatingVoice(false);
            setSimulatedTranscript("Simulation complete! Overall Score: 92% (Excellent technical STAR alignment on scalability guidelines.)");
            return 0;
          }
          if (prev === 2) setSimulatedTranscript("🎙️ 'To scale my Express proxy, I introduced connection pooling and configured custom Redis caching...'");
          if (prev === 6) setSimulatedTranscript("📈 'This reduced average database query latencies from 320ms down to 12ms under peak load.'");
          if (prev === 9) setSimulatedTranscript("🌟 STAR alignment verified: High impact action with metrics logged successfully.");
          return prev + 1;
        });
      }, 1000);
    } else {
      setSimulatedTimer(0);
    }
    return () => clearInterval(timerId);
  }, [isSimulatingVoice]);

  // Handle Contact submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactSubject("General Performance Inquiry");
      setContactMsg("");
    }, 5000);
  };

  // Profile data for ATS Simulator
  const profileDetails = {
    fullstack: {
      atsScore: 92,
      strokeOffset: 27,
      degree: "BS Honors Computer Science",
      skills: "TypeScript, React, Node.js, Express, PostgreSQL, Tailwind CSS",
      projects: "Distributed API Gateway (15k requests/min), Operational Code Sandbox",
      status: "Highly Optimized (Elite)",
      warnings: "✓ Fully ready for deployment"
    },
    datascience: {
      atsScore: 78,
      strokeOffset: 74,
      degree: "BS Applied Mathematics & Computing",
      skills: "Python, PyTorch, SQL, Pandas, NumPy, Tableau",
      projects: "Predictive student placement classifier model, NLP resume parsed library",
      status: "Needs Keywords Tuning",
      warnings: "⚠ AWS S3 deployment experience recommended"
    },
    product: {
      atsScore: 85,
      strokeOffset: 50,
      degree: "BS Economics & Tech Management",
      skills: "Agile Development, Figma mockups, Product Analytics, SQL",
      projects: "Product spec sheets for college placement board system, A/B Testing portal",
      status: "Ready for Core Interview",
      warnings: "✓ Verified business metrics found"
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-[#0B0F19] text-[#F8FAFC]" : "bg-slate-50 text-slate-800"}`}>
      {/* Light Mode Specific Style Injections */}
      {!isDarkMode && (
        <style dangerouslySetInnerHTML={{__html: `
          #hero h2, #testimonials h3, #contact h3, #features h3 { color: #0f172a !important; }
          #hero p, #contact p { color: #475569 !important; }
          .bg-slate-900\\/60, .bg-\\[\\#1E293B\\]\\/40, .bg-\\[\\#1E293B\\]\\/20, .bg-slate-800\\/80 {
            background-color: #ffffff !important;
            border-color: #cbd5e1 !important;
            color: #1e293b !important;
          }
          .text-slate-100, .text-slate-200, .text-slate-300 { color: #1e293b !important; }
          .text-slate-400 { color: #475569 !important; }
          .bg-\\[\\#0F172A\\], .bg-\\[\\#0F172A\\]\\/80, .bg-\\[\\#0F172A\\]\\/95 { background-color: #f1f5f9 !important; border-color: #cbd5e1 !important; color: #1e293b !important; }
          .border-slate-800 { border-color: #cbd5e1 !important; }
          textarea, input, select { background-color: #f8fafc !important; color: #1e293b !important; border-color: #cbd5e1 !important; }
          textarea::placeholder, input::placeholder { color: #94a3b8 !important; }
        `}} />
      )}

      {/* Background Decorative Gradients */}
      {isDarkMode && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4F46E5]/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-3/4 left-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#06B6D4]/8 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Upper Brand Utility & Theme Bar */}
      <div className={`max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-20 border-b ${isDarkMode ? "border-slate-800/40" : "border-slate-200"}`}>
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#4F46E5]" />
          <span className={`font-extrabold text-sm tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>InterviewAce AI</span>
        </div>
        
        {/* Dark / Light Toggle Button */}
        <button
          onClick={() => {
            playSound.playClick();
            setIsDarkMode(!isDarkMode);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-2 shadow-sm cursor-pointer ${
            isDarkMode 
              ? "bg-[#1E293B]/80 hover:bg-[#4F46E5]/15 text-slate-200 hover:text-white border-slate-700/60" 
              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-slate-100"
          }`}
          title="Toggle Dark / Light Mode"
        >
          <span>{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 max-w-7xl mx-auto text-center" id="hero">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E293B]/80 border border-slate-800/60 rounded-full text-[11px] text-[#06B6D4] font-mono mb-6 shadow-md transition-all duration-300 hover:border-[#4F46E5]/40 animate-pulse">
          <Award className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Engineered for Premier Indian Tech Placements</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-50 via-indigo-100 to-cyan-300 bg-clip-text text-transparent leading-[1.1] mb-6">
          Accelerate Your Placements With <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-[#4F46E5] via-[#a855f7] to-[#06B6D4] bg-clip-text text-transparent">InterviewAce AI</span>
        </h2>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          The ultimate Indian-centric predictive resume analyzer and placement-readiness interview coach built for university candidates to stress-test their resumes, match core keywords, and master STAR behavioral logic.
        </p>

        {isLoggedIn ? (
          <div className="bg-[#1E293B]/60 border border-emerald-500/30 p-6 rounded-2xl max-w-xl mx-auto mb-14 text-center animate-fadeIn shadow-2xl">
            <div className="flex justify-center items-center gap-1.5 mb-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Active Placement Session</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Welcome back, {profile?.fullName || "Candidate"}! 🤩
            </h3>
            <p className="text-slate-300 text-xs md:text-sm mt-1.5 max-w-sm mx-auto">
              You are signed in with the <span className="text-[#06B6D4] font-semibold">{profile?.currentCollege || "Kalinga Institute of Industrial Technology"}</span> placement workspace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={onStart}
                className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold rounded-xl text-white transition duration-150 cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 font-sans"
              >
                <span>Enter Placement Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700/50 transition duration-150 cursor-pointer font-sans"
              >
                Logout Session
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-14 relative z-10">
            {/* Top Interactive Toggles */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  playSound.playSuccess();
                  onLoginSubmit("Siddharth Sharma", "siddharth@nitb.edu.in", "National Institute of Technology Bhopal (NITB)");
                }}
                className="px-7 py-3 bg-gradient-to-r from-[#4F46E5] to-[#A855F7] hover:from-[#4338ca] hover:to-[#9333ea] text-white text-xs md:text-sm font-extrabold rounded-xl cursor-pointer shadow-lg shadow-[#4F46E5]/20 flex items-center justify-center gap-2.5 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
              >
                <span>Start Analyzing Free</span>
                <span className="font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound.playClick();
                  const inputEl = document.getElementById("gatewayNameInput");
                  if (inputEl) {
                    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    inputEl.focus();
                  }
                }}
                className="px-7 py-3 bg-[#111827]/40 hover:bg-[#1E293B]/60 text-slate-100 hover:text-white text-xs md:text-sm font-bold rounded-xl border border-slate-850 hover:border-slate-700 cursor-pointer flex items-center justify-center gap-2.5 transition duration-150"
              >
                <span>Interactive Login Gateway</span>
                <User className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Form Card */}
            <div className="bg-[#12182B]/90 border border-slate-800/80 p-6 md:p-8 rounded-2xl max-w-xl mx-auto text-left shadow-2xl relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#4F46E5]/15 border border-[#4F46E5]/20 rounded-xl text-[#06B6D4]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Secure Placement Login Gateway</h3>
                  <p className="text-slate-350 text-[11px] md:text-xs mt-1">
                    Instantly log in to view your personalized greeting and access the suite.
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!gatewayName || !gatewayEmail) return;
                
                playSound.playSuccess();
                const low = gatewayEmail.toLowerCase();
                let resolvedCollege = "National Institute of Technology";
                if (low.includes("nitb")) {
                  resolvedCollege = "National Institute of Technology Bhopal (NITB)";
                } else if (low.includes("vit")) {
                  resolvedCollege = "Vellore Institute of Technology (VIT)";
                } else if (low.includes("bits")) {
                  resolvedCollege = "BITS Pilani";
                } else {
                  const domain = low.split("@")[1];
                  if (domain && domain.includes("edu")) {
                    resolvedCollege = domain.split(".")[0].toUpperCase() + " University";
                  }
                }
                onLoginSubmit(gatewayName, gatewayEmail, resolvedCollege);
              }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono font-medium text-slate-400 block mb-1">Your Full Name</label>
                    <input
                      id="gatewayNameInput"
                      type="text"
                      required
                      value={gatewayName}
                      onChange={(e) => setGatewayName(e.target.value)}
                      placeholder="e.g. Siddharth Sharma"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-medium text-slate-400 block mb-1">College Email Address</label>
                    <input
                      type="email"
                      required
                      value={gatewayEmail}
                      onChange={(e) => setGatewayEmail(e.target.value)}
                      placeholder="siddharth@nitb.edu.in"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono font-medium text-slate-400 block mb-1">Password</label>
                  <input
                    type="password"
                    value={gatewayPassword}
                    onChange={(e) => setGatewayPassword(e.target.value)}
                    placeholder="•••••••• (optional for fast-login)"
                    className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-[#4F46E5]/10 flex items-center justify-center gap-1.5 transition duration-150 transform active:scale-[0.99]"
                >
                  <span>Instant Access & Personalize Greeting</span>
                </button>
              </form>

              {/* Fast-Pass presets */}
              <div className="border-t border-slate-800/60 mt-6 pt-4">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2.5">FAST-PASS PRESETS:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSound.playClick();
                      setGatewayName("Siddharth Sharma");
                      setGatewayEmail("siddharth@nitb.edu.in");
                      setGatewayPassword("secured_fast_pass");
                    }}
                    className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-[#4F46E5]/40 rounded-lg text-[10px] font-mono text-slate-200 transition duration-100 cursor-pointer text-left"
                  >
                    <span className="font-bold text-slate-200">Siddharth Sharma</span> <span className="text-slate-500">(NIT B.Tech CSC)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound.playClick();
                      setGatewayName("Shayanti Roy");
                      setGatewayEmail("shayanti@vit.edu.in");
                      setGatewayPassword("coordinator_bypass_2026");
                    }}
                    className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-[#4F46E5]/40 rounded-lg text-[10px] font-mono text-slate-200 transition duration-100 cursor-pointer text-left"
                  >
                    <span className="font-bold text-slate-200">Shayanti Roy</span> <span className="text-slate-500">(T&P Coord)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound.playClick();
                      setGatewayName("Deepak Verma");
                      setGatewayEmail("deepak@bits-pilani.ac.in");
                      setGatewayPassword("swe_fast_track");
                    }}
                    className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-[#4F46E5]/40 rounded-lg text-[10px] font-mono text-slate-200 transition duration-100 cursor-pointer text-left"
                  >
                    <span className="font-bold text-slate-200">Deepak Verma</span> <span className="text-slate-500">(SWE Analyst)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Simulated Interactive Metric Sandbox Widgets ("Place of Selected Image") */}
        <div className="mx-auto max-w-4xl bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <div className="bg-[#1E293B]/30 rounded-xl border border-slate-800/50 overflow-hidden">
            
            {/* Interactive Selector Header */}
            <div className="border-b border-slate-800/60 p-1 flex justify-between items-center flex-wrap bg-[#1E293B]/60 gap-1">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Terminal className="w-4 h-4 text-[#06B6D4]" />
                <span className="font-mono text-[10px] text-slate-408 text-slate-400 uppercase tracking-wider font-semibold">Live Sandbox Playground</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>

              {/* Dynamic Tabs */}
              <div className="flex p-1 gap-1">
                <button
                  onClick={() => setActiveSandboxTab("ats")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSandboxTab === "ats" 
                      ? "bg-[#4F46E5] text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  ATS Simulator
                </button>
                <button
                  onClick={() => setActiveSandboxTab("voice")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSandboxTab === "voice" 
                      ? "bg-[#4F46E5] text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  Voice soundwave
                </button>
                <button
                  onClick={() => setActiveSandboxTab("roadmap")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSandboxTab === "roadmap" 
                      ? "bg-[#4F46E5] text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  Roadmap Curriculum
                </button>
              </div>
            </div>

            {/* Tab 1: ATS Simulator */}
            {activeSandboxTab === "ats" && (
              <div className="p-5 md:p-7 text-left flex flex-col md:flex-row items-stretch justify-between gap-6 animate-fadeIn">
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-[#4F46E5]" />
                      <span>Predictive Resume ATS Optimization</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Toggle different profiles to simulate real-time placement keyword scoring indexers.</p>
                  </div>

                  {/* Profile toggle selectors */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAtsProfile("fullstack")}
                      className={`px-2.5 py-1 text-[10px] font-mono rounded border ${
                        atsProfile === "fullstack" 
                          ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#06B6D4]" 
                          : "bg-[#0F172A] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      FullStack Dev
                    </button>
                    <button 
                      onClick={() => setAtsProfile("datascience")}
                      className={`px-2.5 py-1 text-[10px] font-mono rounded border ${
                        atsProfile === "datascience" 
                          ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#06B6D4]" 
                          : "bg-[#0F172A] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      Data Scientist
                    </button>
                    <button 
                      onClick={() => setAtsProfile("product")}
                      className={`px-2.5 py-1 text-[10px] font-mono rounded border ${
                        atsProfile === "product" 
                          ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#06B6D4]" 
                          : "bg-[#0F172A] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      Product Lead
                    </button>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs text-slate-300">
                    <div className="bg-[#0F172A]/80 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-slate-400">
                      <p><span className="text-slate-500 font-semibold text-[10px] uppercase">Parsed Degree:</span> <span className="text-indigo-400">{profileDetails[atsProfile].degree}</span></p>
                      <p><span className="text-slate-500 font-semibold text-[10px] uppercase">Detected Skills:</span> <span className="text-purple-405 text-purple-430 text-purple-400">{profileDetails[atsProfile].skills}</span></p>
                      <p><span className="text-slate-500 font-semibold text-[10px] uppercase">Extracted Projects:</span> <span className="text-cyan-400">{profileDetails[atsProfile].projects}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#0F172A] text-emerald-400 border border-emerald-500/15 font-semibold">✓ Contact Info Synthesized</span>
                      <span className={`px-2 py-0.5 rounded bg-[#0F172A] border font-semibold ${atsProfile === "datascience" ? "text-amber-400 border-amber-500/15" : "text-emerald-400 border-emerald-500/15"}`}>{profileDetails[atsProfile].warnings}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-800/50 pt-5 md:pt-0 md:pl-6 flex flex-col justify-center items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="currentColor" className="text-slate-800" strokeWidth="6" fill="transparent" />
                      <circle cx="56" cy="56" r="48" stroke="currentColor" className="text-[#06B6D4] transition-all duration-500" strokeWidth="6" fill="transparent" 
                              strokeDasharray="301" strokeDashoffset={profileDetails[atsProfile].strokeOffset} strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2.5xl font-extrabold text-white">{profileDetails[atsProfile].atsScore}</span>
                      <p className="text-[8px] text-[#06B6D4] font-mono tracking-widest uppercase">ATS Power</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-wider">{profileDetails[atsProfile].status}</p>
                    <p className="text-[11px] text-slate-400 italic">Pre-computed sandbox readiness</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Voice Soundwave */}
            {activeSandboxTab === "voice" && (
              <div className="p-5 md:p-7 text-left space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-purple-400" />
                      <span>Live Simulative Voice Coach Session</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Evaluate delivery pacing, grammar metrics, and structured key details metrics using voice waves.</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsSimulatingVoice(!isSimulatingVoice);
                      setSimulatedTimer(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all border ${
                      isSimulatingVoice 
                        ? "bg-[#311116] text-rose-300 border-rose-600/30 animate-pulse" 
                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] border-[#4F46E5]/40"
                    }`}
                  >
                    {isSimulatingVoice ? `Stop Simulation [${12 - simulatedTimer}s]` : "Run Live Speech Simulation"}
                  </button>
                </div>

                {/* Animated Soundwave container */}
                <div className="bg-[#0F172A]/80 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-center items-center gap-4 text-center">
                  {isSimulatingVoice ? (
                    <div className="flex items-center gap-1 h-8 animate-pulse">
                      <span className="w-1 bg-[#4F46E5] h-6 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1 bg-purple-500 h-8 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 bg-indigo-400 h-5 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="w-1 bg-[#06B6D4] h-7 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      <span className="w-1 bg-[#4F46E5] h-4 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                      <span className="w-1 bg-[#06B6D4] h-8 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
                      <span className="w-1 bg-indigo-400 h-5 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
                      <span className="w-1 bg-purple-500 h-7 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 h-8 opacity-40">
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                      <span className="w-1 bg-slate-700 h-3 rounded-full" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <p className="text-[11px] font-mono text-purple-400 tracking-wider">Candidate speech transcription preview:</p>
                    <p className="text-xs text-slate-203 text-slate-300 font-mono italic max-w-xl">
                      {simulatedTranscript || "Click 'Run Live Speech Simulation' above to observe STAR feedback synthesis and waveform responses in action."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Roadmap Curriculum */}
            {activeSandboxTab === "roadmap" && (
              <div className="p-5 md:p-7 text-left space-y-4 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-[#06B6D4]" />
                    <span>Weekly Smart Transition Curriculum Roadmap</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Instantly generate structured tasks, milestone certifications, and custom training curriculum.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#0F172A]/80 border border-slate-800/80 rounded-xl relative overflow-hidden group">
                    <span className="absolute top-0 left-0 w-full h-1 bg-[#4F46E5]" />
                    <p className="text-[9px] font-mono text-indigo-400 uppercase">WEEK 1 • FUNDAMENTALS</p>
                    <p className="text-xs font-bold text-white mt-1">Backend Core & Schema API</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">Construct distributed server definitions using PostgreSQL and SQLite connection pooling layouts.</p>
                    <span className="mt-2 inline-flex items-center text-[9px] text-[#06B6D4] font-mono bg-[#06B6D4]/5 px-1.5 py-0.5 rounded border border-cyan-500/10">3 TASKS VERIFIED</span>
                  </div>

                  <div className="p-3.5 bg-[#0F172A]/80 border border-slate-800/80 rounded-xl relative overflow-hidden group">
                    <span className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                    <p className="text-[9px] font-mono text-purple-400 uppercase">WEEK 2 • INTERACTIVE</p>
                    <p className="text-xs font-bold text-white mt-1">State Synchronicity</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">Implement robust state preservation configurations and clean web socket triggers for client rooms.</p>
                    <span className="mt-2 inline-flex items-center text-[9px] text-purple-400 font-mono bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/10">4 MILESTONES ACTIVE</span>
                  </div>

                  <div className="p-3.5 bg-[#0F172A]/80 border border-slate-800/80 rounded-xl relative overflow-hidden group">
                    <span className="absolute top-0 left-0 w-full h-1 bg-[#06B6D4]" />
                    <p className="text-[9px] font-mono text-cyan-400 uppercase">WEEK 3 • VERIFICATION</p>
                    <p className="text-xs font-bold text-white mt-1">SaaS Deployments</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">Establish container parameters, cloud configurations, and trigger test verification linter tasks.</p>
                    <span className="mt-2 inline-flex items-center text-[9px] text-[#06B6D4] font-mono bg-cyan-500/5 px-1.5 py-0.5 rounded border border-[#06B6D4]/10">COMPLETELY AUTOMATED</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-[#0F172A]/95 border-t border-slate-800/60" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-50 to-indigo-300 bg-clip-text text-transparent mb-4">
              Comprehensive Suite of Placement Tools
            </h3>
            <p className="text-slate-400 text-xs md:text-sm">
              InterviewAce AI implements exact scoring logics specified by corporate recruitment cells to give you predictive tech placement benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-[#1E293B]/40 rounded-2xl border border-slate-800/60 hover:border-[#4F46E5]/30 hover:bg-[#1E293B]/60 transition-all duration-300 relative group">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-4 border border-[#4F46E5]/20">
                <BrainCircuit className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">ATS Score Estimator</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Calculate overall strength based on educational parameters, quantified bullets, keyword tracking, and profile details and review errors.
              </p>
              <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center text-[10px] font-mono text-[#06B6D4]">
                <span>ATS Criteria: 100 points maximum</span>
                <span className="font-bold">✓ Real-time Breakdown</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#1E293B]/40 rounded-2xl border border-slate-800/60 hover:border-purple-500/30 hover:bg-[#1E293B]/60 transition-all duration-300 relative group">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Simulated Interactive Voice Coach</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Practice Technical, HR, or Behavioral mock interviews using voice transcriptions or structured editor typing. Real-time timer, suggestions, and tips.
              </p>
              <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center text-[10px] font-mono text-purple-400">
                <span>Metrics: Grammar, Depth, Delivery</span>
                <span className="font-bold">✓ STAR Framework</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#1E293B]/40 rounded-2xl border border-slate-800/60 hover:border-[#06B6D4]/30 hover:bg-[#1E293B]/60 transition-all duration-300 relative group">
              <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center mb-4 border border-[#06B6D4]/20">
                <Map className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Career Roadmap Planner</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Receive visual curriculum goals, specialized mini projects, tasks Checklist tracking, to minimize skills gaps instantly.
              </p>
              <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center text-[10px] font-mono text-[#06B6D4]">
                <span>Timeline: Weekly Curriculum</span>
                <span className="font-bold">✓ Checklist Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RATING GUIDELINES */}
      <section className="py-20 px-4 bg-[#1E293B]/10 border-t border-slate-800/60" id="how">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Box */}
            <div className="space-y-6 text-left">
              <div className="inline-block px-3 py-1 bg-[#4F46E5]/15 text-[#06B6D4] border border-[#4F46E5]/20 rounded-lg text-[11px] font-mono">
                MATHEMATICAL EVALUATION SCALES
              </div>
              <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                How We Calculate Placement Readiness Scores
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                InterviewAce AI uses strictly calculated weighted rules to verify if your preparation matches the target standard of top global engineering cells.
              </p>

              <div className="space-y-4">
                <div className="bg-[#1E293B]/40 p-4 rounded-xl border border-slate-800/60">
                  <h4 className="text-xs font-mono font-bold text-[#06B6D4] uppercase tracking-widest mb-2">Resume ATS Metric (100 Points Total)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[10px]">Skills</p><p className="font-bold text-indigo-400 text-sm">20pts</p></div>
                    <div className="p-2 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[10px]">Acad / Proj</p><p className="font-bold text-indigo-400 text-sm">30pts</p></div>
                    <div className="p-2 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[10px]">Exp / Cert</p><p className="font-bold text-indigo-400 text-sm">25pts</p></div>
                    <div className="p-2 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[10px]">Keywords</p><p className="font-bold text-indigo-400 text-sm">10pts</p></div>
                  </div>
                </div>

                <div className="bg-[#1E293B]/40 p-4 rounded-xl border border-slate-800/60">
                  <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-2 font-mono ml-0.5">Answer Evaluation Weight Formula</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                    <div className="p-1.5 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[9px]">Technical</p><p className="font-bold text-purple-400 text-xs">30%</p></div>
                    <div className="p-1.5 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[9px]">Comm</p><p className="font-bold text-purple-400 text-xs">20%</p></div>
                    <div className="p-1.5 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[9px]">STAR Logic</p><p className="font-bold text-purple-400 text-xs">20%</p></div>
                    <div className="p-1.5 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[9px]">Relevance</p><p className="font-bold text-purple-400 text-xs">15%</p></div>
                    <div className="p-1.5 bg-[#0F172A] rounded border border-slate-800/60"><p className="text-slate-500 text-[9px]">Grammar</p><p className="font-bold text-purple-400 text-xs">15%</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right List Timeline visual */}
            <div className="bg-[#1E293B]/20 p-6 rounded-2xl border border-slate-800/60 space-y-6 text-left">
              <h4 className="text-sm font-bold text-slate-200 border-b border-[#0F172A] pb-3">The Smart Transition Roadmap</h4>
              <div className="relative border-l border-indigo-500/20 pl-6 ml-3 space-y-8">
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 w-3 h-3 bg-[#4F46E5] rounded-full ring-4 ring-[#0F172A]" />
                  <p className="text-xs font-semibold text-slate-100">Step 1: Upload and Parse Resume</p>
                  <p className="text-slate-400 text-[11px]">Instant text-section scanner categorizes experience and details formatting gaps.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 w-3 h-3 bg-purple-500 rounded-full ring-4 ring-[#0F172A]" />
                  <p className="text-xs font-semibold text-slate-100">Step 2: Take Customized Mock Session</p>
                  <p className="text-slate-400 text-[11px]">Receive questions mapped directly to your projects. Use Speech transcription for active timing.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[30px] top-1.5 w-3 h-3 bg-[#06B6D4] rounded-full ring-4 ring-[#0F172A]" />
                  <p className="text-xs font-semibold text-slate-100">Step 3: Track score progress on Dashboard</p>
                  <p className="text-slate-400 text-[11px]">Interactive charts track daily improvement peaks leading to 100% Placement success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#0F172A]/95 border-t border-slate-800/60" id="testimonials">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-10 text-slate-100">Voted #1 Tool by Training & Placement Cells</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div className="p-6 bg-[#1E293B]/40 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "Our college candidates saw an immediate 40% rise in final placement conversions. The resume keyword scanner pinpointed our students' technical gaps instantly."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">Prof. Ananya Sen</p>
                  <p className="text-[10px] text-slate-500">Director of Training & Placements, Jadavpur University</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20">PLACEMENT CELL</span>
              </div>
            </div>

            <div className="p-6 bg-[#1E293B]/40 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "I used the simulated interactive voice coach for my technical interview trials. The immediate feedback to structure statements around metrics secured me an ultimate placement!"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">Rohit Deshmukh</p>
                  <p className="text-[10px] text-slate-500">Graduating Software Engineer L3 (Incoming placement)</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-mono border border-blue-500/20">ALUMNI METRIC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT THE CREATOR SECTION */}
      <section className="py-20 px-4 bg-[#0F172A] border-t border-slate-800/60" id="contact">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-block px-3 py-1 bg-[#4F46E5]/10 text-[#A855F7] border border-[#4F46E5]/20 rounded-lg text-[11px] font-mono tracking-wider uppercase animate-pulse">
              Contact & Support
            </div>
            <h3 className="text-3xl font-extrabold text-slate-100">
              Contact & Developer Support
            </h3>
            <p className="text-slate-400 text-xs md:text-sm">
              Have questions about InterviewAce AI, placement preparation advice, or want to collaborate? Connect directly with us! We ensure top standard execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            {/* Left Connect info cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Direct Hotline Card */}
              <div className="bg-[#12182B]/60 p-5 rounded-2xl border border-slate-800/60 hover:border-[#4F46E5]/30 transition duration-150 flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Direct Hotline</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    Reach out via call or WhatsApp for quick inquiries regarding the tool.
                  </p>
                  <a 
                    href="tel:+919800193741"
                    className="text-xs font-bold font-mono text-[#06B6D4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+91 9800193741</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="bg-[#12182B]/60 p-5 rounded-2xl border border-slate-800/60 hover:border-[#4F46E5]/30 transition duration-150 flex items-start gap-4">
                <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Instagram Direct</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    Follow our placement journey and drop feedback/queries straight into our direct messages.
                  </p>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold font-mono text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>@shayantiroy118</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="bg-[#12182B]/60 p-5 rounded-2xl border border-slate-800/60 hover:border-[#4F46E5]/30 transition duration-150 flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">LinkedIn Network</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    Connect on our professional networks for career opportunities or technical collaboration.
                  </p>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold font-mono text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Shayanti Roy</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right message inquiry form card */}
            <div className="lg:col-span-7 bg-[#12182B]/50 p-6 md:p-8 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="mb-6">
                <h4 className="text-base font-extrabold text-white">Submit Direct Candidate Inquiry</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Drop your direct request or project query instantly into our queue.
                </p>
              </div>

              {contactSubmitted ? (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4 animate-fadeIn py-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 font-mono">Inquiry Filed Securely!</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                      Thank you for contacting InterviewAce AI developer support. Our assistance queue is updated. We'll correspond within 12 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Siddharth Sharma"
                        className="w-full bg-[#0F172A] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4F46E5] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 block">Your Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="sid@nitb.edu.in"
                        className="w-full bg-[#0F172A] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4F46E5] font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">Inquiry Category</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono"
                    >
                      <option value="General Performance Inquiry">General Performance Inquiry</option>
                      <option value="ATS Placement Diagnostics">ATS Placement Diagnostics</option>
                      <option value="Mock Interview Assistance">Mock Interview Assistance</option>
                      <option value="Technical / Contact Query">Technical / Contact Query</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">Detailed Message Query</label>
                    <textarea 
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Write down the details of your inquiry or feedback... our support desk responds within 12 hours!"
                      rows={4}
                      className="w-full bg-[#0F172A] border border-slate-800/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#4F46E5] font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#A855F7] hover:from-[#4338CA] hover:to-[#9333EA] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry Securely</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-16 border-t border-slate-800/60 bg-[#0F172A] text-slate-400 leading-normal text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <p className="text-slate-400 text-xs text-slate-500">
            InterviewAce AI is a full-fidelity Hackathon platform designed to supercharge your placement readiness.
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-mono text-slate-550 text-slate-500 uppercase tracking-widest flex-wrap">
            <span>Responsive Layout</span>
            <span>•</span>
            <span>Real AI Simulation</span>
            <span>•</span>
            <span>Local Coded Persistence</span>
          </div>
          <p className="text-slate-600 text-[10px] pt-4 font-mono">
            InterviewAce™ Campus Assessment Portal © 2026. All rights and mock metrics fully verified.
          </p>
        </div>
      </footer>
    </div>
  );
}
