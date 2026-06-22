import React, { useState } from "react";
import { Sparkles, Terminal, Award, User, RefreshCw, Menu, X, LogIn } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  profile,
  isLoggedIn,
  onLogout,
  onLoginClick
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#1E293B]/85 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabClick("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="p-2 bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] rounded-xl shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>InterviewAce</span>
              <span className="text-[10px] bg-[#1E293B] text-[#06B6D4] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30">AI</span>
            </h1>
            <p className="text-[9px] font-mono text-[#06B6D4] tracking-wider mt-0.5 uppercase">CAMPUS PLACEMENT SUITE</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Only when logged in) */}
        {isLoggedIn ? (
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#0F172A]/80 p-1 rounded-xl border border-slate-800">
            {[
              { id: "dashboard", label: "Dashboard", icon: Terminal },
              { id: "resume", label: "Resume Analyzer", icon: Award },
              { id: "interview", label: "Interview Coach", icon: Sparkles },
              { id: "roadmap", label: "Career Roadmap", icon: RefreshCw },
              { id: "profile", label: "Profile & Specs", icon: User }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  id={`nav-tab-${tab.id}`}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "bg-[#4F46E5] text-white shadow-md shadow-[#4F46E5]/25" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <a href="#features" onClick={() => handleTabClick("landing")} className="hover:text-[#06B6D4] transition-colors">Features</a>
            <a href="#how" onClick={() => handleTabClick("landing")} className="hover:text-[#06B6D4] transition-colors">How it Works</a>
            <a href="#testimonials" onClick={() => handleTabClick("landing")} className="hover:text-[#06B6D4] transition-colors">Testimonials</a>
            <a href="#contact" onClick={() => handleTabClick("landing")} className="hover:text-[#06B6D4] transition-colors">Contact</a>
          </nav>
        )}

        {/* Desktop Controls Area */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3" id="nav-user-badge">
              <div 
                onClick={() => handleTabClick("profile")}
                className="flex flex-col text-right cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-200 hover:text-[#06B6D4] transition-colors">{profile.fullName}</span>
                <span className="text-[10px] font-mono text-[#06B6D4]">{profile.targetRole || "CS Scholar"}</span>
              </div>
              <div 
                onClick={() => handleTabClick("profile")}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] p-[1.5px] cursor-pointer hover:opacity-90 active:scale-95 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-xs font-bold text-slate-200 uppercase">
                  {profile.fullName.charAt(0) || "S"}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-[11px] font-mono text-slate-400 hover:text-rose-450 hover:underline border-l border-slate-800 pl-3 py-1 cursor-pointer"
                id="btn-logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4.5 py-1.5 text-xs font-sans font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 rounded-lg shadow-md shadow-[#4F46E5]/20 border border-indigo-500/20 cursor-pointer transition-all duration-200 flex items-center gap-1.5"
              id="btn-nav-login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isLoggedIn && (
            <button
              onClick={onLoginClick}
              className="px-3 py-1 text-[11px] font-sans font-medium text-white bg-[#4F46E5] rounded-md shadow-sm border border-indigo-500/20 cursor-pointer"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg border border-slate-800"
            aria-label="Toggle Navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/60 animate-fadeIn text-left">
          {isLoggedIn ? (
            <div className="space-y-2 pb-2">
              <div className="flex items-center justify-between px-3 py-2 bg-[#0F172A] rounded-xl border border-slate-800 mb-2">
                <div>
                  <p className="text-xs font-bold text-slate-100">{profile.fullName}</p>
                  <p className="text-[10px] font-mono text-[#06B6D4]">{profile.targetRole || "CS Candidate"}</p>
                </div>
                <div 
                  onClick={() => handleTabClick("profile")}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] flex items-center justify-center text-xs font-bold text-white uppercase"
                >
                  {profile.fullName.charAt(0) || "S"}
                </div>
              </div>

              {[
                { id: "dashboard", label: "Dashboard", icon: Terminal },
                { id: "resume", label: "Resume Analyzer", icon: Award },
                { id: "interview", label: "Interview Coach", icon: Sparkles },
                { id: "roadmap", label: "Career Roadmap", icon: RefreshCw },
                { id: "profile", label: "Profile Specs", icon: User }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-[#4F46E5] text-white" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/10 text-xs font-medium cursor-pointer border-t border-slate-800/60 mt-2 pt-2.5"
              >
                <span>Logout Session</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 p-2">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-4 py-2.5 text-xs text-slate-350 hover:text-white hover:bg-slate-800/30 rounded-lg block font-medium"
              >
                Features
              </a>
              <a 
                href="#how" 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-4 py-2.5 text-xs text-slate-350 hover:text-white hover:bg-slate-800/30 rounded-lg block font-medium"
              >
                How it Works
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-4 py-2.5 text-xs text-slate-350 hover:text-white hover:bg-slate-800/30 rounded-lg block font-medium"
              >
                Testimonials
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-4 py-2.5 text-xs text-slate-350 hover:text-[#06B6D4] hover:bg-slate-800/30 rounded-lg block font-medium"
              >
                Contact Lead
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full py-2.5 bg-[#4F46E5] text-white text-xs font-bold rounded-lg mt-2 text-center"
              >
                Login & Enter Playroom
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
