import React, { useState } from "react";
import { 
  Map, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Layers, 
  Award, 
  TrendingUp, 
  Milestone, 
  CheckSquare, 
  BookOpen, 
  ArrowRight,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { CareerRoadmap, ResumeAnalysis } from "../types";

interface RoadmapGeneratorViewProps {
  onRoadmapCreated: (roadmap: CareerRoadmap) => void;
  roadmaps: CareerRoadmap[];
  activeRoadmap: CareerRoadmap | null;
  setActiveRoadmap: (roadmap: CareerRoadmap | null) => void;
  onUpdateRoadmap: (roadmap: CareerRoadmap) => void;
  activeResume: ResumeAnalysis | null;
  setActiveTab: (tab: string) => void;
  profile?: any;
}

export default function RoadmapGeneratorView({
  onRoadmapCreated,
  roadmaps,
  activeRoadmap,
  setActiveRoadmap,
  onUpdateRoadmap,
  activeResume,
  setActiveTab,
  profile
}: RoadmapGeneratorViewProps) {
  const [careerGoal, setCareerGoal] = useState("");
  const [prepMonths, setPrepMonths] = useState<number>(3);
  const [isAssembling, setIsAssembling] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleGenerateRoadmap = async (goalStr: string) => {
    const trimmedGoal = goalStr.trim();
    if (!trimmedGoal) {
      setErrorText("Please state your target career goal or select a standard option.");
      return;
    }

    setErrorText("");
    setIsAssembling(true);
    try {
      const resumeContext = activeResume ? activeResume.resumeText : "";
      
      let rawResult: any;
      try {
        const response = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            resumeText: resumeContext, 
            careerGoal: trimmedGoal,
            college: profile?.currentCollege || "",
            prepDurationMonths: prepMonths
          })
        });

        const contentType = response.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error("Invalid server JSON response format or service offline");
        }

        rawResult = await response.json();
      } catch (apiErr) {
        console.warn("API generate-roadmap failed, shifting to dynamic client-side compiler engine:", apiErr);
        rawResult = getLocalRoadmap(trimmedGoal, profile?.currentCollege || "Kalinga Institute of Industrial Technology", prepMonths);
      }

      // Transform raw weeklyPlan tasks to support check-off state variables
      const cleanWeeklyPlan = (rawResult.weeklyPlan || []).map((weekItem: any) => ({
        week: weekItem.week || "Week 1",
        title: weekItem.title || "Topic",
        description: weekItem.description || "",
        microTasks: weekItem.microTasks || [],
        completedTasks: [] // start empty
      }));

      const finalRoadmap: CareerRoadmap = {
        id: `rdmp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        careerGoal: trimmedGoal,
        summary: rawResult.summary || "Guided technical training transition checklist.",
        weeklyPlan: cleanWeeklyPlan,
        recommendedSkills: rawResult.recommendedSkills || [],
        recommendedCertifications: rawResult.recommendedCertifications || [],
        recommendedProjects: rawResult.recommendedProjects || [],
        interviewMilestones: rawResult.interviewMilestones || [],
        completedMilestones: []
      };

      onRoadmapCreated(finalRoadmap);
      setActiveRoadmap(finalRoadmap);
    } catch (err: any) {
      console.error(err);
      setErrorText("Critical: Failed to generate curriculum checklist locally, please try selecting a standard goal.");
    } finally {
      setIsAssembling(false);
    }
  };

  // Toggle tasks check-box state and propagate back to local persistence
  const handleToggleTask = (weekIndex: number, taskText: string) => {
    if (!activeRoadmap) return;
    
    const updatedWeeklyPlan = activeRoadmap.weeklyPlan.map((week, idx) => {
      if (idx !== weekIndex) return week;
      
      const contains = week.completedTasks.includes(taskText);
      const newCompletes = contains 
        ? week.completedTasks.filter(item => item !== taskText)
        : [...week.completedTasks, taskText];
      
      return { ...week, completedTasks: newCompletes };
    });

    const updatedMap: CareerRoadmap = {
      ...activeRoadmap,
      weeklyPlan: updatedWeeklyPlan
    };

    setActiveRoadmap(updatedMap);
    onUpdateRoadmap(updatedMap);
  };

  // Toggle Interview milestone targets state and propagate back to local persistence
  const handleToggleMilestone = (milestoneText: string) => {
    if (!activeRoadmap) return;

    const contains = activeRoadmap.completedMilestones.includes(milestoneText);
    const newCompletes = contains
      ? activeRoadmap.completedMilestones.filter(item => item !== milestoneText)
      : [...activeRoadmap.completedMilestones, milestoneText];

    const updatedMap: CareerRoadmap = {
      ...activeRoadmap,
      completedMilestones: newCompletes
    };

    setActiveRoadmap(updatedMap);
    onUpdateRoadmap(updatedMap);
  };

  const currentMap = activeRoadmap || (roadmaps.length > 0 ? roadmaps[0] : null);

  // Compute tasks checked ratios
  let totalTasks = 0;
  let finishedTasks = 0;
  if (currentMap) {
    totalTasks = currentMap.weeklyPlan.reduce((acc, cur) => acc + cur.microTasks.length, 0);
    finishedTasks = currentMap.weeklyPlan.reduce((acc, cur) => acc + cur.completedTasks.length, 0);
  }

  return (
    <div className="space-y-6">

      {/* Back and Home Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center bg-[#1E293B]/40 p-3 rounded-2xl border border-slate-800/60 animate-fadeIn" id="nav-shortcuts-roadmap animate-fadeIn">
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
      
      {/* Upper Panel: Goal custom generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="roadmap-setup-container">
        <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-5 space-y-4 text-left">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] bg-[#4F46E5]/10 px-2 py-0.5 rounded w-max border border-[#4F46E5]/20">
            <Map className="w-3.5 h-3.5 text-[#06B6D4] animate-pulse" />
            <span>AI Curriculum Architect</span>
          </div>

          <h3 className="text-xl font-bold text-slate-100">
            Assemble Your Transition Curriculum
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Specify your ultimate target job profile. We will leverage our advanced placement analysis model to contrast your focus skills and compile a weekly curriculum to minimize competence gaps.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Specify desired career goal</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Frontend Engineer (SaaS), ML Intern, Cloud Engineer"
                  className="flex-1 bg-[#0F172A] text-xs border border-slate-800/60 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono"
                  id="input-career-goal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Expected Preparation Duration</label>
              <select
                value={prepMonths}
                onChange={(e) => setPrepMonths(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-slate-800/60 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5]/40 font-mono cursor-pointer"
                id="select-prep-months"
              >
                <option value={1}>1 Month (4-Week Fast-Track Crash Course)</option>
                <option value={2}>2 Months (8-Week High-Yield Sprint)</option>
                <option value={3}>3 Months (12-Week Rigorous Preparation)</option>
                <option value={6}>6 Months (24-Week Complete Mastery)</option>
              </select>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Typical Job Presets</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Full Stack Web Developer",
                "Data Science Specialist",
                "DevOps Cloud Engineer",
                "Product Manager Placement"
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setCareerGoal(preset);
                    handleGenerateRoadmap(preset);
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono bg-[#0F172A] text-slate-300 hover:text-white border border-slate-800/50 hover:border-slate-700 rounded cursor-pointer transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {errorText && (
            <p className="text-xs font-mono text-rose-400 bg-[#311116] px-3 py-2 rounded border border-rose-900/40">
              ⚠️ {errorText}
            </p>
          )}

          <button
            onClick={() => handleGenerateRoadmap(careerGoal)}
            disabled={isAssembling || !careerGoal.trim()}
            className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#1E293B] disabled:text-slate-505 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-[#4F46E5]/15 flex items-center justify-center gap-1.5"
            id="btn-trigger-roadmap"
          >
            {isAssembling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Compiling Weekly Task Indexes...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Build Personalized Roadmap</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Active Curriculums Timeline</h4>
              <p className="text-[10px] text-slate-500">Compare structural check-ins corresponding to past targets</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{roadmaps.length} Maps Built</span>
          </div>

          {roadmaps.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar py-1">
              {roadmaps.map((map) => {
                const isSelected = currentMap?.id === map.id;
                const total = map.weeklyPlan.reduce((acc, cur) => acc + cur.microTasks.length, 0);
                const completes = map.weeklyPlan.reduce((acc, cur) => acc + cur.completedTasks.length, 0);
                const rate = total > 0 ? Math.round((completes / total) * 100) : 0;

                return (
                  <div
                    key={map.id}
                    onClick={() => {
                      setActiveRoadmap(map);
                      setCareerGoal(map.careerGoal);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer flex justify-between items-center gap-6 transition ${
                      isSelected 
                        ? "bg-[#4F46E5]/15 border-[#4F46E5]" 
                        : "bg-[#0F172A] border-slate-800/40 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200">{map.careerGoal}</p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        Seeded: {new Date(map.timestamp).toLocaleDateString()} • {map.weeklyPlan.length} week modules
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-[#06B6D4] bg-[#4F46E5]/10 px-2 py-1 rounded border border-[#4F46E5]/20">
                        {rate}% Checked
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-xs italic text-slate-500">No career roadmaps compiled inside this session sandbox yet. Select a standard preset above!</div>
          )}

          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400">
            <Award className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
            <p>Active Task completion increases overall <span className="text-slate-250 text-slate-200 font-bold">Placement Readiness score</span> inside Dashboard statistics dynamically!</p>
          </div>
        </div>
      </div>

      {/* Main Roadmap viewer */}
      {currentMap ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="roadmap-curriculum-viewer">
          
          <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 lg:col-span-7 space-y-4">
            <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{currentMap.careerGoal} structured timeline</h4>
                <p className="text-[10px] text-slate-500 text-left">Check off task items to synchronize placement readiness progress stats</p>
              </div>
              <span className="text-xs font-mono text-[#06B6D4] bg-[#4F46E5]/10 px-2.5 py-1 rounded border border-[#4F46E5]/20 font-bold">
                {finishedTasks} / {totalTasks} Completed
              </span>
            </div>

            <div className="relative border-l border-[#4F46E5]/30 pl-6 ml-4 py-2 space-y-6">
              {currentMap.weeklyPlan.map((week, wIndex) => {
                const isWeekFinished = week.completedTasks.length === week.microTasks.length && week.microTasks.length > 0;
                return (
                  <div key={wIndex} className="relative text-left">
                    {/* Ring dot Indicator */}
                    <span className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full ring-4 ring-[#0F172A] flex items-center justify-center text-[10px] ${
                      isWeekFinished ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                    }`} id={`week-dot-${wIndex}`}>
                      {wIndex + 1}
                    </span>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-wider">{week.week}</p>
                      <h4 className="text-xs font-bold text-slate-200">{week.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{week.description}</p>

                      {/* checklist tasks */}
                      <div className="space-y-1.5 pt-2">
                        {week.microTasks.map((task, tIndex) => {
                          const isDone = week.completedTasks.includes(task);
                          return (
                            <div
                              key={tIndex}
                              onClick={() => handleToggleTask(wIndex, task)}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-3 transition ${
                                isDone 
                                  ? "bg-emerald-950/10 border-emerald-500/20 text-slate-400" 
                                  : "bg-[#0F172A] border-slate-800/40 hover:bg-[#1E293B]/30 text-slate-300"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                                isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-800"
                              }`}>
                                {isDone && "✓"}
                              </div>
                              <span className={isDone ? "line-through text-slate-500" : ""}>{task}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Recommendations, certifications, special projects (Col span 5) */}
          <div className="lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0" id="recommendations-container">
            <div className="space-y-6">
              
              {/* Rec Certs and learning tools */}
            <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 space-y-4 text-left">
              <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Standard Certs & focus Skills</span>
              </h4>
              
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-slate-500 uppercase">Skills to Acquire</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentMap.recommendedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#0F172A] border border-slate-800 text-slate-300 text-[10px] font-mono rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase">Target Credentials</p>
                <div className="space-y-1.5">
                  {currentMap.recommendedCertifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prep Milestones checklist target list */}
            <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 space-y-4 text-left">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Milestone className="w-4 h-4" />
                <span>Interview Preparation Target Milestones</span>
              </h4>

              <div className="space-y-2">
                {currentMap.interviewMilestones.map((ms, idx) => {
                  const isDone = currentMap.completedMilestones.includes(ms);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleMilestone(ms)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition ${
                        isDone 
                          ? "bg-[#0F172A] border-[#1E293B] text-slate-500 line-through" 
                          : "bg-[#0F172A] border-slate-800/40 hover:bg-[#1E293B]/30 text-slate-300"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                        isDone ? "bg-amber-500 border-amber-500 text-slate-950" : "border-slate-805 border-slate-700"
                      }`}>
                        {isDone && "✓"}
                      </div>
                      <span>{ms}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Special Project ideas column */}
          <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 space-y-4 text-left h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#06B6D4] uppercase tracking-widest flex items-center gap-1">
                <CheckSquare className="w-4 h-4" />
                <span>Special Projects to Complete</span>
              </h4>
              <p className="text-slate-400 text-xs">
                Adding these technical showcase projects onto your resume will rapidly trigger higher ATS scoring indices.
              </p>

              <div className="space-y-3">
                {currentMap.recommendedProjects.map((proj, idx) => (
                  <div key={idx} className="p-3 bg-[#0F172A] rounded-xl border border-slate-805 border-slate-800/50 space-y-2">
                    <p className="text-xs font-bold text-slate-200">{proj.title}</p>
                    <p className="text-[11px] text-slate-400 leading-normal">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.map((ts, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1E293B]/40 text-[#06B6D4] border border-[#1E293B]">
                          {ts}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-xl border border-slate-800/65 text-[10px] text-slate-500 leading-normal mt-2">
              Suggested approach: Spend 2 weeks building a production mini version of these ideas to fulfill "Project Quantity" ATS demands.
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 bg-[#1E293B]/40 rounded-2xl border border-dashed border-slate-805 border-slate-800/60 p-8">
        <BookOpen className="w-12 h-12 text-[#06B6D4] animate-pulse" />
        <p className="text-xs text-slate-500 max-w-sm">No structured roadmap compiled yet. Stated your objective role or select one of the top presets above to layout your transition curriculum.</p>
      </div>
    )}
    </div>
  );
}

// Client-side fallback dynamic career roadmapper aligned to placement requirements
function getLocalRoadmap(careerGoal: string, targetCollege: string, prepMonths: number = 3) {
  const goal = (careerGoal || "").toLowerCase();
  const totalWeeks = prepMonths * 4;
  
  let summary = `Strategic ${totalWeeks}-week curriculum (${prepMonths} Months) tailored for undergraduate students at ${targetCollege || "Kalinga Institute of Industrial Technology"} to secure immediate recruitment for placement as a ${careerGoal || "Software Developer"}.`;
  
  let weeklyPlan: any[] = [];
  let recommendedSkills = ["Algorithms & DSA", "Node.js / Spring Boot Backend", "System Design", "Docker Engine", "Redis Cache", "SQL optimization"];
  let recommendedCertifications = ["AWS Certified Cloud Practitioner", "Standard NPTEL Data Structures Certification", "Cisco Network Academy Badge"];
  let recommendedProjects = [
    {
      title: "High-Performance API Rate Limiter",
      description: "A secure Express/Nest.js endpoint limiter utilizing a Redis sliding window algorithm to safeguard system resources under stress.",
      techStack: ["Node.js", "Redis", "TypeScript", "Jest"]
    },
    {
      title: "E-Commerce Microservices Cluster",
      description: "An isolation-bounded microservices booking platform employing PostgreSQL multi-version transactions and eventual consistency.",
      techStack: ["SpringBoot", "Docker", "PostgreSQL", "Kafka"]
    }
  ];
  let interviewMilestones = [
    "Round 1: Basic Technical screening and core coding verification",
    "Round 2: Scalable system design and data transaction trade-offs",
    "Round 3: Leadership culture STAR fit and collegiate teamwork STAR evaluations"
  ];

  const isFrontend = goal.includes("frontend") || goal.includes("web") || goal.includes("ui") || goal.includes("react");
  const isAI = goal.includes("ai") || goal.includes("ml") || goal.includes("machine learning") || goal.includes("python") || goal.includes("data scientist");

  if (isFrontend) {
    summary = `Strategic ${totalWeeks}-week frontend development and performance curriculum tailored for placement as a Frontend Engineer.`;
    recommendedSkills = ["React.js", "TypeScript", "Tailwind CSS", "Browser Profiling", "State Management", "Git & GitHub"];
    recommendedProjects = [
      {
        title: "Dynamic Collaborative Canvas",
        description: "A real-time reactive whiteboard utilizing absolute state synchronization and custom layout render hooks.",
        techStack: ["React.js", "TypeScript", "WebSockets", "CanvasAPI"]
      },
      {
        title: "Dynamic Multi-stage E-Commerce Layout",
        description: "A beautiful interactive checkout suite checking absolute mobile and core performance bounds.",
        techStack: ["Next.js", "TailwindCSS", "Zustand"]
      }
    ];
  } else if (isAI) {
    summary = `Strategic ${totalWeeks}-week Machine Learning and Data modeling deployment roadmap targeting placements.`;
    recommendedSkills = ["Python Programming", "PyTorch / TensorFlow", "Scikit-Learn", "Pandas & Numpy", "Hyperparameter Tuning", "Docker & API endpoints"];
    recommendedCertifications = ["Google Cloud Machine Learning Engineer Certification", "DeepLearning.AI Tensorflow Certification"];
    recommendedProjects = [
      {
        title: "Real-times CV Image Recognition",
        description: "An isolation-bounded convolutional neural networks image scoring tool packaged cleanly in Docker.",
        techStack: ["Python", "PyTorch", "Flask", "Docker"]
      },
      {
        title: "Financial Predictive Model Service",
        description: "High-accuracy gradient boosted tree system evaluating regression algorithms on standard cloud endpoints.",
        techStack: ["Python", "XGBoost", "FastAPI", "Pandas"]
      }
    ];
  }

  // Populate dynamic weeks
  for (let w = 1; w <= totalWeeks; w++) {
    let title = "";
    let description = "";
    let microTasks: string[] = [];
    
    const progress = w / totalWeeks;
    if (progress <= 0.25) {
      if (isFrontend) {
        title = `Week ${w}: HTML/CSS Engineering & ES6 Basics`;
        description = "Solidify browser layout rendering engines and functional programmatic syntax.";
        microTasks = ["Design absolute fluid flex/grid layouts", "Master variable scope and callback functions", "Audit rendering speed with lighthouse diagnostics"];
      } else if (isAI) {
        title = `Week ${w}: PyData Ecosystem & Linear Algebra`;
        description = "Establish heavy matrices computation engines and vectorized mathematical operations.";
        microTasks = ["Master Numpy tensor calculations", "Compute mathematical gradients manually", "Preprocess raw csv datasets with pandas"];
      } else {
        title = `Week ${w}: Programming Foundations & Problem Solving`;
        description = "Establish deep understanding of data variables and programmatic loop controls.";
        microTasks = ["Practice standard array transformations", "Write optimal bubble and binary searching routines", "Calculate target complexity limits"];
      }
    } else if (progress <= 0.50) {
      if (isFrontend) {
        title = `Week ${w}: React Component Lifecycle & States`;
        description = "Integrate secure modular hooks and prevent infinite component re-renders.";
        microTasks = ["Construct custom data fetch loops with cleanup", "Manage state trees with custom providers", "Reduce deep-nested prop drilling variables"];
      } else if (isAI) {
        title = `Week ${w}: Supervised Classical Machine Learning`;
        description = "Implement robust classification bounds and mathematical regressions.";
        microTasks = ["Train classification decision forests on inputs", "Build scatter analysis projections of parameters", "Evaluate precision/recall scores on datasets"];
      } else {
        title = `Week ${w}: Key-Value Transactions & SQL schema`;
        description = "Design secure tables and transaction scopes with relational indices.";
        microTasks = ["Design normalized relational structures", "Implement subquery and nested JOIN queries", "Audit latency bottlenecks using EXPLAIN ANALYZE"];
      }
    } else if (progress <= 0.75) {
      if (isFrontend) {
        title = `Week ${w}: State Management & Multi-Page Routes`;
        description = "Assemble state trees and coordinate deep route triggers.";
        microTasks = ["Setup Zustand state store logic", "Integrate secure layout route routes", "Implement lazy-loading split packages to speed initial load"];
      } else if (isAI) {
        title = `Week ${w}: Deep Learning & Neural Frameworks`;
        description = "Deploy multi-layer perception pathways and adjust feedback systems.";
        microTasks = ["Train convolution layers via PyTorch", "Tune backpropagation learning coefficients", "Design image processing ingestion flows"];
      } else {
        title = `Week ${w}: Backend API Design & Containers`;
        description = "Deploy applications in isolated container runtimes and secure request channels.";
        microTasks = ["Package programs in multi-stage Docker environment containers", "Expose secure RESTful API endpoints", "Setup JWT authentication logic and tokens"];
      }
    } else {
      if (isFrontend) {
        title = `Week ${w}: Production Quality Audits & STAR Prep`;
        description = "Polish presentation grids, resolve responsive overflows and practice STAR behavioral cases.";
        microTasks = ["Resolve horizontal scroll limits on mobile viewports", "Formulate SDE portfolio highlights with STAR metrics", "Synthesize mock reviews using digital interview sheets"];
      } else if (isAI) {
        title = `Week ${w}: Model Deployment endpoints & Practice`;
        description = "Deploy real predictions online and perform mock tests.";
        microTasks = ["Deploy model endpoints using FastAPIs on Docker", "Document model threshold parameters", "Practice explaining model trade-offs with STAR logic"];
      } else {
        title = `Week ${w}: System Concurrency & STAR Mock Reviews`;
        description = "Master high throughput variables and practice live STAR mock scenarios.";
        microTasks = ["Configure caching with redis-specific memory limits", "Solve 5 detailed system design layouts", "Explain architectural trade-offs using STAR structure"];
      }
    }
    
    weeklyPlan.push({
      week: `Week ${w}`,
      title,
      description,
      microTasks
    });
  }

  return {
    summary,
    weeklyPlan,
    recommendedSkills,
    recommendedCertifications,
    recommendedProjects,
    interviewMilestones
  };
}
