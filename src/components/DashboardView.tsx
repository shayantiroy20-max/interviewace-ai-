import React from "react";
import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Calendar,
  CheckCircle2, 
  ArrowUpRight,
  Download
} from "lucide-react";
import { 
  ResumeAnalysis, 
  InterviewSession, 
  CareerRoadmap, 
  ActivityLog, 
  UserProfile 
} from "../types";
import { generatePerformanceSummaryPDF } from "../utils/pdfGenerator";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";

interface DashboardViewProps {
  profile: UserProfile;
  resumes: ResumeAnalysis[];
  interviews: InterviewSession[];
  roadmaps: CareerRoadmap[];
  activityLogs: ActivityLog[];
  setActiveTab: (tab: string) => void;
  onRefreshData: () => void;
}

export default function DashboardView({
  profile,
  resumes,
  interviews,
  roadmaps,
  activityLogs,
  setActiveTab,
  onRefreshData
}: DashboardViewProps) {

  // Calculated Metrics
  const lastResume = resumes[0] || null;
  const bestResumeScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore)) : 0;
  
  const completedInterviews = interviews.filter(i => i.isCompleted);
  const avgInterviewScore = completedInterviews.length > 0 
    ? Math.round(completedInterviews.reduce((acc, current) => acc + (current.avgOverallScore || 0), 0) / completedInterviews.length)
    : 0;
  
  const bestInterviewScore = completedInterviews.length > 0
    ? Math.max(...completedInterviews.map(i => i.avgOverallScore || 0))
    : 0;

  // Let's calculate a cumulative "Placement Readiness Score" based on:
  // - 40% Resume ATS Score (best)
  // - 40% Average Interview Score (best or average)
  // - 20% Career Roadmap Tasks completion status
  const currentRoadmap = roadmaps[0] || null;
  let taskCompletionRate = 0;
  if (currentRoadmap) {
    const totalWeeklyTasks = currentRoadmap.weeklyPlan.reduce((acc, cur) => acc + cur.microTasks.length, 0);
    const completedWeeklyTasks = currentRoadmap.weeklyPlan.reduce((acc, cur) => acc + cur.completedTasks.length, 0);
    const totalMilestones = currentRoadmap.interviewMilestones.length;
    const completedMilestones = currentRoadmap.completedMilestones.length;

    const totalCalculated = totalWeeklyTasks + totalMilestones;
    const completedCalculated = completedWeeklyTasks + completedMilestones;
    if (totalCalculated > 0) {
      taskCompletionRate = Math.round((completedCalculated / totalCalculated) * 100);
    }
  }

  const baseResumeReady = bestResumeScore > 0 ? bestResumeScore : 65; // fallback default
  const baseInterviewReady = avgInterviewScore > 0 ? avgInterviewScore : 60; // fallback default
  const baseRoadmapReady = taskCompletionRate > 0 ? taskCompletionRate : 30; // fallback default
  
  const placementReadiness = Math.round(
    (baseResumeReady * 0.45) + 
    (baseInterviewReady * 0.45) + 
    (baseRoadmapReady * 0.10)
  );

  // Recharts: Chart 1 Competence Radar Data
  // Extracted from completed interview evaluation averages, or fallback starter
  let competencyData = [
    { subject: "Tech Accuracy", value: 75, fullMark: 100 },
    { subject: "Communication", value: 70, fullMark: 100 },
    { subject: "Confidence", value: 65, fullMark: 100 },
    { subject: "Relevance", value: 80, fullMark: 100 },
    { subject: "Grammar", value: 80, fullMark: 100 }
  ];

  if (completedInterviews.length > 0) {
    let techSum = 0, commSum = 0, confSum = 0, relSum = 0, gramSum = 0, count = 0;
    completedInterviews.forEach(session => {
      session.attempts.forEach(attempt => {
        if (attempt.evaluation) {
          techSum += attempt.evaluation.scores.technicalAccuracy;
          commSum += attempt.evaluation.scores.communication;
          confSum += attempt.evaluation.scores.confidence;
          relSum += attempt.evaluation.scores.relevance;
          gramSum += attempt.evaluation.scores.grammar;
          count++;
        }
      });
    });

    if (count > 0) {
      competencyData = [
        { subject: "Tech Accuracy", value: Math.round(techSum / count), fullMark: 100 },
        { subject: "Communication", value: Math.round(commSum / count), fullMark: 100 },
        { subject: "Confidence", value: Math.round(confSum / count), fullMark: 100 },
        { subject: "Relevance", value: Math.round(relSum / count), fullMark: 100 },
        { subject: "Grammar", value: Math.round(gramSum / count), fullMark: 100 }
      ];
    }
  }

  // Recharts: Chart 2 Timeline Area Chart Data
  // We can plot individual completed interviews overall scores chronologically
  const timelineData = completedInterviews.length > 0
    ? [...completedInterviews]
        .reverse()
        .map((session, index) => ({
          name: `Mock #${index + 1}`,
          Score: session.avgOverallScore || 0,
          Readiness: Math.round((session.avgOverallScore || 0) * 0.8 + 15)
        }))
    : [
        { name: "Initial", Score: 70, Readiness: 65 },
        { name: "Mock #1", Score: 78, Readiness: 72 },
        { name: "Mock #2", Score: 85, Readiness: 80 },
        { name: "Mock #3", Score: 88, Readiness: 84 }
      ];

  return (
    <div className="space-y-6">
      {/* Dynamic Profile Cover Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E293B]/80 via-[#1E293B]/30 to-[#1E293B]/85 border border-slate-800/60 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xl" id="dashboard-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#06B6D4] bg-[#1E293B]/90 px-2 py-0.5 rounded border border-[#1E293B] uppercase tracking-widest animate-pulse">Candidate Console</span>
            <span className="text-xs font-mono font-medium text-slate-400">Student Profile Sync: Online</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Welcome Back, {profile.fullName}!
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#F8FAFC]">
            <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-[#06B6D4]" /> <span className="text-slate-300">{profile.currentCollege || "University student"}</span></div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#06B6D4]" /> <span className="text-slate-300">{profile.targetRole || "Software Intern"}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#06B6D4]" /> <span className="text-slate-300">Batch of {profile.graduationYear || "2027"}</span></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => generatePerformanceSummaryPDF(profile, resumes, interviews, roadmaps)}
            className="px-4 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl border border-indigo-500/10 flex items-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer active:scale-95 transition-all duration-150"
            title="Export high-fidelity summary portfolio for placement mentors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Mentor Summary PDF</span>
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            id="dash-cta-btn-mock"
            className="px-4.5 py-2.5 text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl border border-cyan-500/10 flex items-center gap-1.5 shadow-lg shadow-cyan-600/10 cursor-pointer active:scale-95 transition-all duration-150"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Mock Interview</span>
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className="px-4.5 py-2.5 text-xs bg-[#1E293B]/60 hover:bg-[#1E293B]/95 text-slate-200 font-medium rounded-xl border border-slate-800/60 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all duration-150"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Audit Resume</span>
          </button>
        </div>
      </div>

      {/* Numerical Performance Score Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-cards-row">
        {/* Placement Readiness Card */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 hover:border-[#4F46E5]/40 transition-all flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Placement Readiness</p>
            <h3 className="text-3xl font-extrabold text-white">{placementReadiness}%</h3>
            <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>Optimizing with Practice</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center text-[#06B6D4]">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Best Resume ATS Score Card */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 hover:border-[#06B6D4]/40 transition-all flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Best Resume ATS Rating</p>
            <h2 className="text-3xl font-extrabold text-white">{bestResumeScore || "N/A"}<span className="text-xs text-slate-500">/100</span></h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {lastResume ? `Updated: ${new Date(lastResume.timestamp).toLocaleDateString()}` : "Ready for analysis"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Interview Coach Score */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 hover:border-purple-500/40 transition-all flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Avg Interview Performance</p>
            <h3 className="text-3xl font-extrabold text-purple-405 text-white">{avgInterviewScore || "N/A"}<span className="text-xs text-slate-500">/100</span></h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Based on {completedInterviews.length} mock sessions
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Roadmap Tasks */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 hover:border-emerald-500/40 transition-all flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Roadmap Milestone Track</p>
            <h3 className="text-3xl font-extrabold text-emerald-450 text-white">{taskCompletionRate}%</h3>
            <p className="text-[10px] text-slate-500 font-mono">
              {currentRoadmap ? `Goal: ${currentRoadmap.careerGoal}` : "No active map yet"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Recharts Charts Section (Two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-layout">
        
        {/* Left Side: Mock Evaluation growth */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 lg:col-span-7 flex flex-col justify-between shadow-lg">
          <div className="border-b border-slate-800/60 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Interview Growth Tracker</h4>
              <p className="text-[10px] text-slate-500">Chronological analysis of mock evaluations and predictive readiness curves</p>
            </div>
            <span className="text-[9px] font-mono bg-slate-950 text-[#06B6D4] px-2 py-0.5 rounded border border-indigo-900 uppercase">Interactive Chart</span>
          </div>

          <div className="w-full h-64 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a354c" strokeOpacity={0.4} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[30, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} labelStyle={{ color: "#94a3b8" }} />
                <Area type="monotone" dataKey="Score" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Coach score" />
                <Area type="monotone" dataKey="Readiness" stroke="#06B6D4" strokeWidth={1} fillOpacity={1} fill="url(#colorReadiness)" name="Predicted Readiness" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Skill Competency Radar */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 lg:col-span-5 flex flex-col justify-between shadow-lg">
          <div className="border-b border-slate-800/60 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Coach Competency Diagnostics</h4>
              <p className="text-[10px] text-slate-500">Average scoring profile across all speech/text review categories</p>
            </div>
            <span className="text-[9px] font-mono bg-slate-950 text-[#06B6D4] px-2 py-0.5 rounded border border-cyan-900 uppercase">Radar Analysis</span>
          </div>

          <div className="w-full h-64 flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competencyData} outerRadius="70%">
                <PolarGrid stroke="#2a354c" strokeOpacity={0.4} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#64748b" angle={30} domain={[0, 100]} fontSize={9} />
                <Radar name="Candidate Scores" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two columns: Active goals & Checklist and Activity Feed log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-lower-layout">
        
        {/* Active Roadmap Progress */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between shadow-lg">
          <div className="border-b border-slate-800/60 pb-3 mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200">Roadmap Targets Checked</h4>
            <button 
              onClick={() => setActiveTab("roadmap")} 
              className="text-[#06B6D4] hover:text-[#4F46E5] text-xs font-mono flex items-center gap-0.5 hover:underline"
            >
              <span>Manage Roadmap</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {currentRoadmap ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#0F172A] p-3 rounded-lg border border-slate-800/60">
                <div>
                  <p className="text-xs font-bold text-slate-200">{currentRoadmap.careerGoal}</p>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-1">{currentRoadmap.summary}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#06B6D4] bg-[#4F46E5]/10 px-2 py-0.5 rounded border border-[#4F46E5]/20">
                  {taskCompletionRate}% Done
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {/* Grab top 3 items to show */}
                {currentRoadmap.weeklyPlan.map((week, wIndex) => (
                  <div key={wIndex} className="p-2.5 bg-[#0F172A]/40 rounded-lg border border-slate-800/30 space-y-1.5">
                    <p className="text-[10px] font-mono text-[#06B6D4] flex justify-between">
                      <span>{week.week}</span>
                      <span>{week.completedTasks.length}/{week.microTasks.length} Checked</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-300">{week.title}</p>
                    <div className="space-y-1 pl-1">
                      {week.microTasks.slice(0, 2).map((task, tIndex) => {
                        const isDone = week.completedTasks.includes(task);
                        return (
                          <div key={tIndex} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded flex items-center justify-center border text-[9px] ${
                              isDone ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "border-slate-700"
                            }`}>
                              {isDone && "✓"}
                            </div>
                            <span className={`text-[11px] truncate ${isDone ? "text-slate-500 line-through" : "text-slate-400"}`}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center space-y-3 bg-[#0F172A]/45 rounded-xl border border-dashed border-slate-800 p-4">
              <p className="text-xs text-slate-500">No career roadmap setup yet. Generate your weekly structured microtask developer curriculum now!</p>
              <button 
                onClick={() => setActiveTab("roadmap")}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-xs text-white rounded-lg cursor-pointer"
              >
                Assemble Roadmap Plan
              </button>
            </div>
          )}
        </div>

        {/* Timeline Log Activities list */}
        <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between shadow-lg">
          <div className="border-b border-slate-800/60 pb-3 mb-4">
            <h4 className="text-sm font-bold text-slate-200">Recent Prep Activities Stream</h4>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
            {activityLogs.slice(0, 5).map((log, index) => {
              return (
                <div key={log.id || index} className="flex items-start gap-3 bg-[#0F172A]/40 p-2.5 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs mt-0.5 shrink-0 ${
                    log.type === "resume_analyzed" 
                      ? "bg-cyan-950 text-[#06B6D4] border border-cyan-900" 
                      : log.type === "interview_ended"
                      ? "bg-purple-950 text-purple-400 border border-purple-900"
                      : "bg-[#4F46E5]/15 text-[#06B6D4] border border-slate-800"
                  }`}>
                    {log.type === "resume_analyzed" ? "RES" : log.type === "interview_ended" ? "INT" : "MAP"}
                  </div>
                  <div className="flex-1 space-y-0.5 text-left min-w-0">
                    <p className="text-xs font-bold text-slate-200 flex justify-between items-center">
                      <span>{log.title}</span>
                      {log.score !== undefined && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          log.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-[#4F46E5]/10 text-[#06B6D4] border border-indigo-500/10"
                        }`}>
                          {log.score}%
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{log.description}</p>
                    <p className="text-[9px] font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}

            {activityLogs.length === 0 && (
              <p className="text-xs text-slate-500 py-10 text-center">No logs listed. Bootstrapping profile progress...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
