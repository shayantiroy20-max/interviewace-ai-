import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  CheckCircle, 
  Mic, 
  MicOff, 
  Play, 
  Award,
  ChevronRight, 
  Timer, 
  Info, 
  ThumbsUp, 
  BookOpen, 
  History,
  Download,
  AlertCircle
} from "lucide-react";
import { 
  InterviewQuestion, 
  QuestionAttempt, 
  AnswerEvaluation, 
  InterviewSession, 
  ResumeAnalysis 
} from "../types";
import { motion } from "motion/react";
import { generateMockInterviewPDF } from "../utils/pdfGenerator";
import { playSound } from "../utils/sounds";

interface InterviewCoachViewProps {
  activeResume: ResumeAnalysis | null;
  onInterviewCompleted: (session: InterviewSession) => void;
  sessionsHistory: InterviewSession[];
  setActiveTab: (tab: string) => void;
  profile?: any;
}

export default function InterviewCoachView({
  activeResume,
  onInterviewCompleted,
  sessionsHistory,
  setActiveTab,
  profile
}: InterviewCoachViewProps) {
  // Config & Session State
  const [selectedCategory, setSelectedCategory] = useState<"Technical" | "Behavioral" | "HR" | "Domain-Specific">("Technical");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prepStyle, setPrepStyle] = useState("Tier-1 Product Companies (Google, Microsoft, Amazon)");
  const [customPrepStyle, setCustomPrepStyle] = useState("");

  // Active Question Attempt parameters
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<AnswerEvaluation | null>(null);

  // Multi-Round Placement Sandbox States
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [isNextRoundLoading, setIsNextRoundLoading] = useState<boolean>(false);
  const [hasTimeExpiredTriggered, setHasTimeExpiredTriggered] = useState<boolean>(false);
  const [showQuickTips, setShowQuickTips] = useState<boolean>(false);

  // Custom persistent non-blocking toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "info" | "success" | "warning" | "error" } | null>(null);

  const triggerToast = (text: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 4500);
  };

  // Speech Recognition hook bindings
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const QUESTION_TIME_LIMIT = 90; // Strict 90 seconds limit per question

  // Start stopwatch timer for active answering
  useEffect(() => {
    if (activeSession && !activeEvaluation && !isEvaluating && !roundCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession, activeEvaluation, isEvaluating, roundCompleted]);

  // Handle countdown expiry automatically
  useEffect(() => {
    if (activeSession && !activeEvaluation && !isEvaluating && !roundCompleted) {
      if (secondsElapsed >= QUESTION_TIME_LIMIT && !hasTimeExpiredTriggered) {
        setHasTimeExpiredTriggered(true);
        if (timerRef.current) clearInterval(timerRef.current);
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setIsListening(false);
        }
        
        playSound.playClick();
        
        const partialAns = userAnswer.trim() !== "" 
          ? userAnswer 
          : "[Time Limit Reached: Candidate did not formulate a verbal or written response within the 90 seconds preparation limit.]";
        
        triggerToast("Time limit reached! Submitting your response automatically for placement diagnostics.", "warning");
        handleSubmitAnswer(partialAns);
      }
    }
  }, [secondsElapsed, activeSession, activeEvaluation, isEvaluating, hasTimeExpiredTriggered, roundCompleted]);

  // Clean values on active question changes
  const handleQuestionChange = (newIndex: number) => {
    setCurrentQuestionIndex(newIndex);
    setUserAnswer("");
    setShowHint(false);
    setSecondsElapsed(0);
    setActiveEvaluation(null);
    setHasTimeExpiredTriggered(false);
  };

  // Web Speech Recognition Initializer
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("Speech recognition is not fully supported in this iframe browser sandbox. Please type or paste your answer.", "info");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setUserAnswer(prev => prev + finalTranscript);
      }
    };

    rec.onerror = (err: any) => {
      console.error("Speech Recognition Error:", err);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Helper mapping to provide a sequence of diverse category question types across rounds
  const getRoundCategory = (initial: string, round: number): "Technical" | "Behavioral" | "HR" | "Domain-Specific" => {
    if (round === 1) return initial as any;
    if (round === 2) {
      if (initial === "Technical") return "Domain-Specific";
      if (initial === "Behavioral") return "HR";
      if (initial === "HR") return "Behavioral";
      return "Technical";
    }
    // Round 3
    if (initial === "Technical") return "Behavioral";
    if (initial === "Behavioral") return "Technical";
    if (initial === "HR") return "Technical";
    return "HR";
  };

  const getRoundFriendlyName = (roundNum: number, category: string) => {
    if (roundNum === 1) return `${category} Basics & Technical core`;
    if (roundNum === 2) return `Analytical Troubleshooting & Core scenarios`;
    return `Leadership Foundations, HR & Culture STAR fit`;
  };

  // API Call: Setup questions
  const handleGenerateQuestions = async () => {
    playSound.playClick();
    setIsGenerating(true);
    setCurrentRound(1);
    setRoundCompleted(false);
    setHasTimeExpiredTriggered(false);
    
    try {
      const resumeContext = activeResume ? activeResume.resumeText : "No specific resumes loaded. Assume standard placement candidate.";
      const selectedPrep = prepStyle === "Other" ? customPrepStyle : prepStyle;
      
      let data: InterviewQuestion[] = [];
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            resumeText: resumeContext, 
            category: selectedCategory,
            college: profile?.currentCollege || "",
            prepStyle: selectedPrep
          })
        });

        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error("Invalid server JSON response format or service offline");
        }
        data = await res.json();
      } catch (apiErr) {
        console.warn("API generate-questions request failed, falling back to dynamic client-side assessment questions:", apiErr);
        data = getLocalQuestions(selectedCategory, selectedPrep);
      }

      const newSession: InterviewSession = {
        id: `sess-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: selectedCategory,
        questions: data.slice(0, 5), // strict 5 questions per round
        attempts: [],
        isCompleted: false
      };

      playSound.playSuccess();
      setActiveSession(newSession);
      setShowQuestionsModal(true);
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setSecondsElapsed(0);
      setShowHint(false);
      setActiveEvaluation(null);
    } catch (err: any) {
      triggerToast(err.message || "Something went wrong during question setup.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Proceed to load the next round's questions (5 questions)
  const handleProceedToNextRound = async () => {
    if (!activeSession) return;
    setIsNextRoundLoading(true);
    playSound.playClick();
    
    try {
      const nextRoundNum = currentRound + 1;
      const nextCategory = getRoundCategory(selectedCategory, nextRoundNum);
      const resumeContext = activeResume ? activeResume.resumeText : "No specific resumes loaded.";
      const selectedPrep = prepStyle === "Other" ? customPrepStyle : prepStyle;
      
      let nextQuestions: InterviewQuestion[] = [];
      try {
        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            resumeText: resumeContext, 
            category: nextCategory,
            college: profile?.currentCollege || "",
            prepStyle: selectedPrep
          })
        });

        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error("Invalid server JSON response format or service offline");
        }
        nextQuestions = await res.json();
      } catch (apiErr) {
        console.warn("API next round questions request failed, running browser-compiled fallback generation:", apiErr);
        nextQuestions = getLocalQuestions(nextCategory, selectedPrep);
      }

      // Remap question IDs to prevent duplicate indices
      const startId = activeSession.questions.length + 1;
      const remappedQuestions = nextQuestions.slice(0, 5).map((q, idx) => ({
        ...q,
        id: startId + idx
      }));

      const updatedSessionObj: InterviewSession = {
        ...activeSession,
        questions: [...activeSession.questions, ...remappedQuestions]
      };

      setActiveSession(updatedSessionObj);
      setCurrentRound(nextRoundNum);
      setSecondsElapsed(0);
      setUserAnswer("");
      setActiveEvaluation(null);
      setHasTimeExpiredTriggered(false);
      setRoundCompleted(false);
      setCurrentQuestionIndex(activeSession.questions.length); // first index of newly fetched set (index 5 or 10)
      
      playSound.playSuccess();
    } catch (err: any) {
      triggerToast(err.message || "Failed to launch next evaluation round.", "error");
    } finally {
      setIsNextRoundLoading(false);
    }
  };

  // Instantly simulate quick-solve for the full 3 rounds (15 questions total)
  const handleQuickSolveSession = async () => {
    if (!activeSession) return;
    setIsEvaluating(true);
    playSound.playClick();
    try {
      // Setup total 15 sample questions representing all 3 rounds
      const finalQuestionsList = [...activeSession.questions];
      const targetCount = 15;
      
      const sampleTechnicalQuestions = [
        { id: 6, question: "Identify the difference between optimistic concurrency structures and locks in relational transactions?", hint: "Mention row isolation level benefits." },
        { id: 7, question: "How would you handle horizontal sharding across PostgreSQL clusters under high relational load?", hint: "Mention partition hashing keys." },
        { id: 8, question: "Describe thread pool exhaust issues and why Node.js loops block during intensive synchronous runs.", hint: "Advise using Worker threads thread pool segregation." },
        { id: 9, question: "What is your optimization strategy to secure sub-100ms API endpoints?", hint: "Cover Redis read Caches and query pagination indices." },
        { id: 10, question: "Why do memory leak issues arise in persistent JS closures, and how do you monitor them?", hint: "Target V8 heap profiling snapshots." },
        { id: 11, question: "Under STAR format, explain a instance where you reconciled conflict regarding backend frameworks.", hint: "Focus on empirical benchmarks and team consensus." },
        { id: 12, question: "How did you scale database queries for a major client academic portal?", hint: "Emphasize quantifiable metrics (like latency dropping by 40%)." },
        { id: 13, question: "Why are you looking to join this particular engineering firm?", hint: "Align your academic base to the firm's growth scale." },
        { id: 14, question: "Describe your leadership style when coordinating collegiate coding teams.", hint: "Cover task delegation, tracking, and open mentorship channels." },
        { id: 15, question: "Tell us about your biggest technology failure and what core lessons was acquired.", hint: "Share the issue objectively, but emphasize the immediate testing fallback adopted." }
      ];

      while (finalQuestionsList.length < targetCount) {
        const nextQ = sampleTechnicalQuestions[finalQuestionsList.length - 5];
        if (nextQ) {
          finalQuestionsList.push(nextQ);
        } else {
          finalQuestionsList.push({
            id: finalQuestionsList.length + 1,
            question: `Placement question number ${finalQuestionsList.length + 1} analysis`,
            hint: "Define target parameters explicitly."
          });
        }
      }

      const updatedAttempts: QuestionAttempt[] = [];
      const userAnswersMap = [
        "To optimize database performance, standard B-tree index structures should be adopted on search query columns to prevent sequential disk scans. I would also introduce paging boundaries to maintain sub-100ms JSON packet speeds.",
        "A process runs inside distinct secluded virtual memory blocks isolated from sibling runtimes. Threads, however, execute within a common parent process footprint, utilizing shared heap addresses but with private instruction registers.",
        "We prioritize REST design strategies for simple standard asset resources due to structured conventions, but would adopt WebSocket architectures for real-time multiplayer lobbies to cut overhead.",
        "We achieved a significant throughput increase from 200 to 1200 operations per second by using Redis caching and moving static elements to regional edge CDNs.",
        "To debug memory leaks, I capture V8 chrome heap allocations snapshots, audit lingering event listener bindings, and clear global objects on scope destruction.",
        "In our railway project, database locks timed out under simulated peak load conditions. I ran explain analyze audits, identified sequential table joins, introduced foreign key indexing, and successfully dropped average query delay to less than 40 milliseconds.",
        "We scaled our system by delegating read tasks to replicated transactional clusters, while restricting direct write commits strictly to the principal server engine.",
        "My long term roadmap goal is to deepen my systems design expertise and transition into a Principal Cloud Infrastructure Architect, driving platform scale.",
        "I resolved technical differences by hosting benchmark showdown trials, evaluating latency metrics, and choosing the framework that proved most efficient.",
        "During database updates, we experienced an accidental production schema rollback. I immediately initialized the hot standby snapshot, restored services under 120 seconds, and improved our CI/CD verify stages.",
        "I lead by ensuring clear task breakdowns, establishing automated verification tests, and maintaining synchronous review pairings across development teams.",
        "Your firm's dedication to high scale container microservices fits my deep motivation to master scalable cloud-native architectures.",
        "When our project demo broke during a live staging review, I immediately bypassed the broken CDN using a fallback local build to successfully finish the presentation.",
        "I handle rapid scope increases by prioritizing core MVP requirements, maintaining strong client updates, and scheduling incremental sprint deliverables.",
        "I plan to leverage my solid academic foundation and systems design base to contribute immediate value to cloud infrastructure initiatives from Day 1."
      ];

      for (let i = 0; i < targetCount; i++) {
        const q = finalQuestionsList[i];
        const simulatedAns = userAnswersMap[i] || "We optimize structures using comprehensive analytics and responsive modular code patterns.";

        const simulatedEval: AnswerEvaluation = {
          scores: {
            technicalAccuracy: 82 + (i % 3) * 6,
            communication: 80 + (i % 2) * 8,
            confidence: 85 + (i % 3) * 4,
            relevance: 83 + (i % 2) * 5,
            grammar: 90,
            overall: 84 + (i % 3) * 4
          },
          feedback: {
            strengths: [
              "Formulated an excellently structured response with physical results.",
              "Excellent utilization of domain specialized terminology and confidence."
            ],
            weaknesses: [
              "Could further expand on specific testing tools used.",
              "Briefly mention memory complexity guidelines next time."
            ],
            suggestions: [
              "Reference CAR (Context, Action, Result) guidelines in explanations.",
              "Include a quick sentence about clean error boundaries."
            ],
            actionPlan: [
              "Refine pacing to fit under our standard 90 seconds limit.",
              "Practice system design mocks to sharpen architecture answers."
            ]
          }
        };

        updatedAttempts.push({
          questionId: q.id,
          questionText: q.question,
          userAnswer: simulatedAns,
          durationSeconds: 15,
          evaluation: simulatedEval,
          timestamp: new Date().toISOString()
        });
      }

      const total = updatedAttempts.reduce((acc, curr) => acc + (curr.evaluation?.scores.overall || 0), 0);
      const avgScore = Math.round(total / updatedAttempts.length);

      const finalSessionObj: InterviewSession = {
        ...activeSession,
        questions: finalQuestionsList,
        attempts: updatedAttempts,
        avgOverallScore: avgScore,
        isCompleted: true
      };

      setCurrentRound(3);
      setRoundCompleted(false);
      setActiveSession(finalSessionObj);
      onInterviewCompleted(finalSessionObj);
      
      playSound.playSuccess();
      
      // Clear expired timer locks
      setHasTimeExpiredTriggered(false);

      // Trigger gorgeous instant PDF summary download
      setTimeout(() => {
        generateMockInterviewPDF(finalSessionObj, profile || { fullName: "Rohan Sharma", currentCollege: profile?.currentCollege || "Jadavpur University" });
      }, 300);

    } catch (err: any) {
      triggerToast("Failed to simulate professional session grades.", "error");
    } finally {
      setIsEvaluating(false);
    }
  };

  // API Call: Submit written or spoken answer for evaluation
  const handleSubmitAnswer = async (forcedAnswer?: string) => {
    const finalAnswer = (forcedAnswer !== undefined) ? forcedAnswer : userAnswer;
    
    if (!finalAnswer || finalAnswer.trim() === "") {
      triggerToast("Please enter or record a verbal or written answer to evaluate.", "warning");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    try {
      const currentQuestion = activeSession!.questions[currentQuestionIndex];
      const resumeContext = activeResume ? activeResume.resumeText : "";

      let evaluationData: AnswerEvaluation;
      try {
        const res = await fetch("/api/evaluate-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion.question,
            answer: finalAnswer,
            resumeText: resumeContext,
            college: profile?.currentCollege || ""
          })
        });

        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          throw new Error("Invalid server JSON response format or service offline");
        }
        evaluationData = await res.json();
      } catch (apiErr) {
        console.warn("API evaluate-answer failed, compiling live feedback inside client-side evaluation engine:", apiErr);
        evaluationData = getLocalAnswerEvaluation(
          currentQuestion.question,
          finalAnswer,
          profile?.currentCollege || "Kalinga Institute of Industrial Technology"
        );
      }

      setActiveEvaluation(evaluationData);

      // Create Question Attempt record
      const newAttempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        userAnswer: finalAnswer,
        durationSeconds: secondsElapsed,
        evaluation: evaluationData,
        timestamp: new Date().toISOString()
      };

      // Append into current session parameters
      const updatedAttempts = [...activeSession!.attempts, newAttempt];
      const updatedSession = { ...activeSession!, attempts: updatedAttempts };

      // Determine progression logic based on multi-round requirement
      const questionsInActiveRoundCount = 5;
      const targetTotalRounds = 3;
      const currentRoundAttemptsCount = updatedAttempts.length;

      // Clear the time expired triggers for successor questions
      setHasTimeExpiredTriggered(false);

      if (currentRoundAttemptsCount === currentRound * questionsInActiveRoundCount) {
        if (currentRound < targetTotalRounds) {
          // Unlocks Next Round window
          setRoundCompleted(true);
          setActiveSession(updatedSession);
        } else {
          // All 3 rounds completed! Finalize whole session
          const total = updatedAttempts.reduce((acc, current) => acc + (current.evaluation?.scores.overall || 0), 0);
          const avgScore = Math.round(total / updatedAttempts.length);
          
          const finalSessionObj: InterviewSession = {
            ...updatedSession,
            avgOverallScore: avgScore,
            isCompleted: true
          };

          setActiveSession(finalSessionObj);
          onInterviewCompleted(finalSessionObj);
        }
      } else {
        setActiveSession(updatedSession);
      }

    } catch (err: any) {
      triggerToast(err.message || "Failed to analyze response content.", "error");
    } finally {
      setIsEvaluating(false);
    }
  };

  const activeQuestion = activeSession ? activeSession.questions[currentQuestionIndex] : null;

  return (
    <div className="space-y-6">

      {/* Dynamic Non-blocking Status Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm w-full bg-[#1e293b]/95 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slideIn" id="dynamic-toast-popup">
          <div className="mt-0.5">
            {toastMessage.type === "success" && <div className="text-emerald-400 font-bold font-mono">✓</div>}
            {toastMessage.type === "error" && <div className="text-rose-400 font-bold font-mono">✗</div>}
            {toastMessage.type === "warning" && <div className="text-amber-400 font-bold font-mono">⚠</div>}
            {toastMessage.type === "info" && <div className="text-[#06B6D4] font-bold font-mono">ℹ</div>}
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-200 leading-normal font-sans font-medium">{toastMessage.text}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-slate-200 text-xs font-mono px-1.5 transition duration-150 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation and Profile Header */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center bg-[#1E293B]/40 p-3 rounded-2xl border border-slate-800/60 animate-fadeIn" id="nav-shortcuts-interview">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { playSound.playClick(); setActiveTab("dashboard"); }}
            className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#4F46E5]/15 transition duration-150"
            id="back-btn-dashboard"
          >
            <span>← Back to Dashboard</span>
          </button>
          <button
            onClick={() => { playSound.playClick(); setActiveTab("landing"); }}
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

      {/* Main setup selector panel (shown if no live interview session is running) */}
      {!activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="coach-setup-panel">
          <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#06B6D4] bg-[#4F46E5]/10 px-2 py-0.5 rounded w-max border border-[#4F46E5]/20">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Multi-Round Evaluation Sandbox</span>
            </div>

            <h3 className="text-xl font-bold text-slate-100 leading-normal">
              Acquire Confidence Under Stressful Corporate Settings
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Our placement simulator launches a structured, <span className="text-[#06B6D4] font-bold">3-Round recruitment sandbox</span>. Each round has a different theme and strict <span className="text-amber-400 font-bold">90-second countdown limits</span> to mirror real-world corporate interview environments.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Select Initial Round Focus Track</label>
              <div className="grid grid-cols-2 gap-2" id="track-selectors">
                {[
                  { id: "Technical", label: "Technical Coding", desc: "React, TS, Systems" },
                  { id: "Behavioral", label: "Behavioral (STAR)", desc: "Conflict, Leadership" },
                  { id: "HR", label: "HR Foundations", desc: "Goals, Salary, Culture" },
                  { id: "Domain-Specific", label: "Domain-Specific", desc: "Product, SQL, Cloud" }
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setSelectedCategory(track.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                      selectedCategory === track.id 
                        ? "bg-[#4F46E5]/15 border-[#4F46E5] ring-1 ring-[#4F46E5]" 
                        : "bg-[#0F172A] border-slate-800/40 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-100">{track.label}</span>
                    <span className="text-[9px] text-slate-500 font-mono uppercase">{track.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Placement Preparation Style</label>
              <select
                value={prepStyle}
                onChange={(e) => setPrepStyle(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono cursor-pointer mb-2"
              >
                <option value="Tier-1 Product Companies (Google, Microsoft, Amazon)">Tier-1 Product Companies (Google, Microsoft, Amazon)</option>
                <option value="Scaled Startups & Tech Unicorns (Ola, Swiggy, Paytm, Zoho)">Scaled Startups & Tech Unicorns (Ola, Swiggy, Paytm, Zoho)</option>
                <option value="Service/National Recruiters (TCS NQT, Infosys, Wipro, Cognizant)">Service/National Recruiters (TCS NQT, Infosys, Wipro, Cognizant)</option>
                <option value="Other">Other / Custom Prep Track...</option>
              </select>

              {prepStyle === "Other" && (
                <input
                  type="text"
                  required
                  placeholder="Enter targeted preparation target"
                  value={customPrepStyle}
                  onChange={(e) => setCustomPrepStyle(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#4F46E5] font-mono text-xs animate-fadeIn"
                />
              )}
            </div>

            {/* Context Notice */}
            <div className="bg-[#0F172A] p-3 rounded-lg border border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
              {activeResume ? (
                <p>MAPPED! Questions will automatically be generated using experience points from <span className="font-bold text-slate-200">'{activeResume.resumeFileName}'</span>.</p>
              ) : (
                <p>GENERAL MODE: No parsed resume active in workspace. We will seed default baseline domain questions instead.</p>
              )}
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#1E293B] disabled:text-slate-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-[#4F46E5]/15 flex items-center justify-center gap-2 transition"
              id="btn-coach-setup-generate"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Synthesizing Tailored Prompts...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Start Multi-Round Interview</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Historical logs of past mocks */}
          <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="border-b border-slate-800/60 pb-3">
              <h4 className="text-sm font-bold text-slate-200">Past Interview Reports History</h4>
              <p className="text-[10px] text-slate-500">Monitor historic scoring curves from previously saved evaluations</p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-1">
              {sessionsHistory.map((sess, index) => (
                <div key={sess.id || index} className="p-3 bg-[#0F172A] rounded-xl border border-slate-800/60 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200">{sess.category} Placement Simulation</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {sess.attempts.length} attempts evaluated • {new Date(sess.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sess.avgOverallScore !== undefined && (
                      <div className="text-right">
                        <span className={`text-xs font-mono font-extrabold px-2 py-1 rounded bg-[#4F46E5]/10 text-[#06B6D4] border border-[#4F46E5]/20`}>
                          {sess.avgOverallScore}% Mean
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => generateMockInterviewPDF(sess, profile || { fullName: "Rohan Sharma", currentCollege: profile?.currentCollege || "Jadavpur University" })}
                      className="p-1.5 rounded-lg bg-[#4F46E5]/10 text-[#06B6D4] hover:bg-[#4F46E5]/20 border border-[#4F46E5]/30 cursor-pointer flex items-center gap-1 transition"
                      title="Download assessment PDF Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {sessionsHistory.length === 0 && (
                <div className="py-20 text-center text-xs text-slate-500 italic">No past mock completions logged in this profile. Click "Begin Interview" to save scoring checkpoints!</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Action Interface: Active question answering workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="coach-active-workspace">
          
          {/* Left Column: Question console and Speech Recorder */}
          <div className="bg-[#1E293B]/40 p-6 rounded-2xl border border-slate-800/60 lg:col-span-7 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  ROUND {currentRound} OF 3: {getRoundFriendlyName(currentRound, activeSession.category)}
                </span>
                <span className="text-xs font-semibold text-slate-400 mt-1">
                  Question {currentQuestionIndex + 1} of {activeSession.questions.length} (Absolute Index)
                </span>
              </div>

              {/* Delivery Timer - Countdown from 90 */}
              <div className={`flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 border rounded transition-colors ${
                QUESTION_TIME_LIMIT - secondsElapsed <= 15 
                  ? "text-rose-400 bg-rose-950/20 border-rose-800 animate-pulse font-bold animate-pulse" 
                  : QUESTION_TIME_LIMIT - secondsElapsed <= 40 
                    ? "text-amber-400 bg-amber-950/15 border-amber-800/65" 
                    : "text-emerald-400 bg-emerald-950/10 border-emerald-800/40"
              }`}>
                <Timer className="w-3.5 h-3.5" />
                <span>
                  {Math.max(0, QUESTION_TIME_LIMIT - secondsElapsed)}s left
                </span>
              </div>
            </div>

            {/* Countdown Visual Progress Bar */}
            <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
              <motion.div 
                className={`h-full ${
                  QUESTION_TIME_LIMIT - secondsElapsed <= 15 
                    ? "bg-rose-500" 
                    : QUESTION_TIME_LIMIT - secondsElapsed <= 40 
                      ? "bg-amber-500" 
                      : "bg-emerald-550 bg-emerald-500"
                }`}
                initial={{ width: "100%" }}
                animate={{ width: `${Math.max(0, ((QUESTION_TIME_LIMIT - secondsElapsed) / QUESTION_TIME_LIMIT) * 100)}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            {/* active prompt question label */}
            <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-800/60 space-y-1 text-left relative overflow-hidden shadow-inner">
              <p className="text-[10px] font-mono font-extrabold text-[#06B6D4] tracking-widest uppercase mb-1">Target Prompt</p>
              <h4 className="text-sm md:text-base font-bold text-slate-100 leading-normal">{activeQuestion?.question}</h4>
            </div>

            {/* Hint toggler */}
            <div className="text-left space-y-2">
              <button 
                onClick={() => { playSound.playClick(); setShowHint(!showHint); }}
                className="text-xs text-slate-400 hover:text-indigo-400 font-mono flex items-center gap-1 cursor-pointer hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? "Hide Expected Response Tippings" : "Toggle Expected Recruiter Tips"}</span>
              </button>
              {showHint && (
                <div className="p-3 bg-[#1E293B]/50 rounded-lg border border-[#4F46E5]/15 text-[11px] text-indigo-300 leading-relaxed font-mono">
                  💡 {activeQuestion?.hint}
                </div>
              )}
            </div>

            {/* Custom Interactive Quick Placement Tips Panel */}
            <div className="text-left bg-[#1E293B]/20 p-3.5 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>💡 Placement Diagnostics Hacks & Tips</span>
                </div>
                <button
                  onClick={() => { playSound.playClick(); setShowQuickTips(!showQuickTips); }}
                  className="px-2.5 py-1 bg-[#4F46E5]/15 hover:bg-[#4F46E5]/30 border border-[#4F46E5]/30 rounded-lg text-[10px] font-mono text-[#06B6D4] cursor-pointer transition"
                >
                  {showQuickTips ? "Hide Quick Tips ✕" : "Show Quick Tips info"}
                </button>
              </div>

              {showQuickTips && (
                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300 leading-relaxed font-sans border-t border-slate-800/40 pt-2.5 animate-fadeIn">
                  <div className="space-y-1 bg-[#0F172A]/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-[#06B6D4] font-mono text-[10px] uppercase">★ STAR Method Structure</p>
                    <p className="text-slate-400">State the <strong>Situation</strong>, describe the <strong>Task</strong> you owned, highlight your proactive <strong>Action</strong>, and focus on the quantified <strong>Result</strong> (e.g. Optimized database performance by 40%).</p>
                  </div>
                  <div className="space-y-1 bg-[#0F172A]/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-indigo-400 font-mono text-[10px] uppercase">★ System Design Code-Trio</p>
                    <p className="text-slate-400">For Technical Rounds: emphasize <strong>scalability</strong> (indexing, load balancing, caching) and <strong>trade-offs</strong> (latency vs. memory storage) in your system architecture description.</p>
                  </div>
                  <div className="space-y-1 bg-[#0F172A]/60 p-2.5 rounded-lg border border-slate-800 col-span-1 md:col-span-2">
                    <p className="font-bold text-amber-400 font-mono text-[10px] uppercase">📢 National Recruiters (TCS NQT, Zoho) Core Hack</p>
                    <p className="text-slate-400">Keep code definitions strictly modular, clarify Object-Oriented Principles (OOP) details, and maintain high confidence during verbal diagnostics. Mention code coverage, query indexes, and API latency variables.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Answer board with SPEECH VOICE Recording */}
            <div className="space-y-1.5 text-left relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Response Formulation</label>
                
                {/* Speech Microphone Toggle */}
                <div className="relative">
                  {isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-rose-600/20"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { playSound.playClick(); toggleSpeechRecognition(); }}
                    className={`relative z-10 px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
                      isListening 
                        ? "bg-[#311116] text-rose-300 border-rose-600/35 font-bold" 
                        : "bg-[#1E293B] text-slate-350 border-slate-700/60 hover:bg-slate-800"
                    }`}
                  >
                    {isListening ? <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
                    <span>{isListening ? "Microphone ON • Transcribing..." : "Toggle Speech-to-Text Mode"}</span>
                  </motion.button>
                </div>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Formulate your structured response here... You can either type your detailed response with bullet indicators, or toggle the speech microphone to record your spoken words aloud."
                className="w-full bg-[#0F172A] border border-slate-800 rounded-xl p-4 text-xs text-slate-200 outline-none focus:border-[#4F46E5] transition font-sans h-44 leading-relaxed"
                disabled={isEvaluating}
              />
            </div>

            {/* Action Submit response buttons */}
            <div className="flex gap-3 justify-end items-center flex-wrap pt-1">
              <button
                onClick={handleQuickSolveSession}
                disabled={isEvaluating}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-mono rounded-xl cursor-pointer border border-slate-705 border-slate-700/40 transition shrink-0"
              >
                Simulate Solve All Rounds
              </button>
              <button
                onClick={() => handleSubmitAnswer()}
                disabled={isEvaluating}
                className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#1E293B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-650/10 transition disabled:opacity-50 min-w-[150px] justify-center"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                    <span>Grading Response...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Evaluate Answer</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: AI Live Diagnostic evaluation feedback block */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-stretch">
            {activeEvaluation ? (
              <div className="bg-[#1E293B]/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between space-y-4 text-left animate-fadeIn">
                <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Round {currentRound} Diagnostic Audit</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Real-time analytical grades evaluated dynamically</p>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-1 rounded">
                    Overall {activeEvaluation.scores.overall}%
                  </span>
                </div>

                {/* Score breakdown metrics boxes */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2 text-center select-none font-mono">
                  {[
                    { label: "Technical Acc.", val: activeEvaluation.scores.technicalAccuracy, color: "text-blue-400" },
                    { label: "Communication", val: activeEvaluation.scores.communication, color: "text-indigo-400" },
                    { label: "Confidence", val: activeEvaluation.scores.confidence, color: "text-amber-400" },
                    { label: "Relevance Level", val: activeEvaluation.scores.relevance, color: "text-cyan-400" }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-[#0F172A] p-2 rounded-xl border border-slate-800/60">
                      <p className="text-[8px] text-slate-500 uppercase leading-normal">{s.label}</p>
                      <p className={`text-sm font-black mt-0.5 ${s.color}`}>{s.val}%</p>
                    </div>
                  ))}
                </div>

                {/* Bullets lists */}
                <div className="space-y-3.5 pr-1 max-h-52 overflow-y-auto no-scrollbar pt-1">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase">★ Core Strengths Found</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {activeEvaluation.feedback.strengths.map((str, sIdx) => <li key={sIdx}>• {str}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono font-bold text-amber-450 text-amber-450 text-amber-400 uppercase">⚠ Gaps Identified</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {activeEvaluation.feedback.weaknesses.map((weak, wIdx) => <li key={wIdx}>• {weak}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase">💡 Suggestions for correction</p>
                    <ul className="space-y-1 text-xs text-slate-300 bg-[#0F172A] p-2 rounded border border-slate-800/60">
                      {activeEvaluation.feedback.suggestions.map((sug, sIdx) => <li key={sIdx}>• {sug}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Transition Trigger to Next Step */}
                <div className="pt-2 border-t border-slate-800">
                  {currentQuestionIndex + 1 < activeSession.questions.length ? (
                    <button
                      onClick={() => { playSound.playClick(); handleQuestionChange(currentQuestionIndex + 1); }}
                      className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#4F46E5]/15"
                      id="btn-coach-next-question"
                    >
                      <span>Proceed to Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30 text-center space-y-2 animate-fadeIn">
                      <p className="text-xs font-bold text-emerald-400">Section Round Finished!</p>
                      <p className="text-[10px] text-slate-400 leading-normal">Your ratings look robust. Click the advancement prompt to save progress and unlock target rounds.</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                        <button
                          onClick={() => {
                            playSound.playClick();
                            generateMockInterviewPDF(activeSession, profile || { fullName: "Rohan Sharma", currentCollege: profile?.currentCollege || "Jadavpur University" });
                          }}
                          className="px-3.5 py-2 text-[10px] font-mono text-[#06B6D4] bg-[#4F46E5]/20 hover:bg-[#4F46E5]/35 border border-[#4F46E5]/40 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 font-bold shrink-0 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Report PDF</span>
                        </button>
                        <button
                          onClick={() => { playSound.playClick(); setActiveSession(null); }}
                          className="px-3.5 py-2 text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-lg cursor-pointer hover:bg-slate-900 transition flex-1"
                          id="btn-coach-complete-quit"
                        >
                          Exit Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-3 bg-[#0F172A]/40 rounded-2xl border border-dashed border-slate-800 p-6">
                <BookOpen className="w-10 h-10 text-slate-700 animate-pulse" />
                <p className="text-xs font-bold text-slate-350 text-slate-300 font-mono">Round {currentRound} Evaluation Console</p>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">Waiting for answer prompt submission. Record your speech transcript using the mic or write detailed technical answers to evaluate placement metrics.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto-Appearing Modal Overlay for Generated Interview Scenario */}
      {showQuestionsModal && activeSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090D16]/90 backdrop-blur-md animate-fadeIn" id="interview-questions-modal">
          <div className="bg-[#1E293B] border border-slate-800/80 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Header */}
            <div className="p-5 border-b border-slate-800/60 bg-[#0F172A] flex justify-between items-center">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#06B6D4] bg-[#4F46E5]/10 px-2.5 py-0.5 rounded border border-[#4F46E5]/20 uppercase">
                  ROUND {currentRound} of 3 CONFIGURATION
                </span>
                <h3 className="text-base font-extrabold text-white">Interactive Syllabus Synthesized</h3>
              </div>
              <button 
                onClick={() => { playSound.playClick(); setShowQuestionsModal(false); }}
                className="text-slate-400 hover:text-white transition cursor-pointer text-sm font-mono w-8 h-8 rounded-full hover:bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* List content */}
            <div className="p-6 overflow-y-auto no-scrollbar space-y-4 text-left">
              <p className="text-slate-400 text-xs leading-relaxed">
                Welcome to Round {currentRound} of your placement simulation! We have synthesized <span className="text-[#06B6D4] font-bold">5 tailored interview questions</span> designed specifically for your professional background:
              </p>

              <div className="space-y-3">
                {activeSession.questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-[#0F172A] rounded-xl border border-slate-800/60 hover:border-[#4F46E5]/30 leading-normal text-left transition text-xs space-y-1.5 shadow-sm">
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-extrabold text-slate-100">{q.question}</p>
                    </div>
                    {q.hint && (
                      <div className="pl-7 text-[10px] text-slate-400 font-mono flex items-start gap-1">
                        <span className="font-bold text-[#06B6D4] shrink-0">💡 Recruiter Tip:</span>
                        <span>{q.hint}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0F172A]/80 border-t border-slate-800/60 flex justify-end gap-3">
              <button
                onClick={() => { playSound.playClick(); setShowQuestionsModal(false); }}
                className="px-4 py-2 border border-slate-800/60 hover:bg-[#1E293B]/60 text-slate-400 hover:text-white text-xs font-semibold rounded-xl cursor-pointer transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => { playSound.playSuccess(); setShowQuestionsModal(false); }}
                className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md shadow-[#4F46E5]/15 flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Begin Active Simulation Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Appearing Round Complete Success Modal Overlay */}
      {roundCompleted && activeSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#090D16]/95 backdrop-blur-md animate-fadeIn" id="round-complete-modal">
          <div className="bg-[#1E293B] border border-slate-800/80 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-550/15 bg-emerald-500/10 border border-emerald-555 border-emerald-550/20 text-emerald-450 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 animate-bounce" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-100 tracking-tight">ROUND {currentRound} COMPLETED!</h3>
              <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider">Placement Milestone Unlocked</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                Superb performance, {profile?.fullName || "Candidate"}! You have navigated all 5 questions for Round {currentRound} with excellent response precision.
              </p>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-xl border border-slate-800/60 max-w-sm mx-auto w-full text-left font-mono">
              <div>
                <p className="text-[9px] text-slate-500 uppercase">Current Tier status</p>
                <p className="text-xs text-indigo-300 font-bold">Round {currentRound} of 3</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase">Questions Solved</p>
                <p className="text-xs text-emerald-400 font-bold">{currentRound * 5} Total Attempts</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  playSound.playClick();
                  setRoundCompleted(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-800/80 hover:bg-[#1E293B]/60 text-slate-450 text-slate-405 hover:text-white text-xs font-semibold rounded-xl cursor-pointer transition flex-1"
              >
                Review This Round's Feedback
              </button>
              <button
                onClick={handleProceedToNextRound}
                disabled={isNextRoundLoading}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md shadow-[#4F46E5]/15 flex items-center justify-center gap-1.5 transition flex-1 disabled:opacity-50"
              >
                {isNextRoundLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Next Syllabus...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Advance to Round {currentRound + 1}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Client-side fallback dynamic interview question generator
function getLocalQuestions(category: string, prepStyle: string): InterviewQuestion[] {
  const isDigital = prepStyle.toLowerCase().includes("digital") || prepStyle.toLowerCase().includes("tcs");
  const isProduct = prepStyle.toLowerCase().includes("product") || prepStyle.toLowerCase().includes("top-tier");

  if (category === "Technical") {
    if (isProduct) {
      return [
        { id: 1, question: "How would you design a distributed rate limiter for API endpoints supporting 100k requests/second?", hint: "Discuss token bucket or sliding window algorithms, and Redis persistence." },
        { id: 2, question: "Identify the trade-offs between optimistic concurrency controls and pessimistic row locking in high-volume relational Databases.", hint: "Discuss row versions, transaction abort frequency, and throughput benchmarks." },
        { id: 3, question: "What is your approach to diagnosing memory leaks and high CPU cycles in persistent Node.js event loops?", hint: "Focus on V8 heap layout snapshots, profiling charts, and unhandled event listeners." },
        { id: 4, question: "Explain how B-Trees improve database query performance and list instances where they fail to optimize index lookup speeds.", hint: "Cover index cardinalities, sequential scan triggers, and multi-column scan order." },
        { id: 5, question: "Describe how you would design an efficient replication latency controller for globally-distributed read replicas.", hint: "Discuss write-through policies, polling margins, and eventual vs strong consistency bounds." }
      ];
    } else {
      return [
        { id: 1, question: "What are the differences between Array and LinkedList structures, and when do you choose one over the other?", hint: "Contrast contiguous memory cache locality with constant-time deletions." },
        { id: 2, question: "Explain the pillars of Object-Oriented Programming (OOP) and how polymorphism is used in production systems.", hint: "Mention inheritance, encapsulation, abstraction, and method overloading/overriding models." },
        { id: 3, question: "How does the virtual DOM in React improve performance compared to direct browser DOM manipulation?", hint: "Explain batch updates, reconciliation algorithms, and diff calculations." },
        { id: 4, question: "What are foreign key constraints, and why are indexes critical on relational table search columns?", hint: "Focus on join runtimes, disk scans, and ACID compliance guarantees." },
        { id: 5, question: "How do you handle asynchronous operations in Node.js, and what is the callback hell mitigation method?", hint: "Discuss Promises, Async/Await syntax, and loop thread pool execution queues." }
      ];
    }
  } else if (category === "Behavioral") {
    return [
      { id: 1, question: "Under the STAR methodology, tell us about a time you had to resolve a serious technical conflict within a software project team.", hint: "Describe the Situation, Task, Action you took, and the quantifiable positive Result." },
      { id: 2, question: "Describe a situation where a critical software bug was uncovered close to a production release. How did you react?", hint: "Highlight immediate mitigation actions, collaborative debugging, and post-mortem fallbacks." },
      { id: 3, question: "How did you manage a scenario where your engineering project requirements were suddenly modified mid-sprint?", hint: "Cover agile adaptiveness, item reprioritization, and active client progress reporting." },
      { id: 4, question: "Tell us about a time you had to lead or coordinate a collaborative developer team under tight deadlines.", hint: "Highlight clear action blueprints, task tracking delegation, and peer pair-programming support." },
      { id: 5, question: "Describe your strategy for explaining highly complex technical architectures to non-technical business partners.", hint: "Advise using humble metaphors, functional flow diagrams, and stripping away abstract jargon." }
    ];
  } else if (category === "HR") {
    return [
      { id: 1, question: "Why are you interested in joining our particular engineering team, and what value do you expect to add from Day 1?", hint: "Align your university foundations and personal project stacks to our specific development standards." },
      { id: 2, question: "Where do you envision your technical specialization and career progression heading over the next 5 years?", hint: "Discuss mastering system design, deepening cloud deployment skills, and aspiring to technical leadership." },
      { id: 3, question: "How do you handle rapid context changes and keep your development skills aligned with trending tech frameworks?", hint: "Mention technical publication reviews, active open-source contribution, and building side-sandbox prototypes." },
      { id: 4, question: "What is your greatest technical or organizational area of growth, and how are you actively improving it?", hint: "State an honest growth margin (e.g. public presenting or early system-design optimization) and how you are scaling it." },
      { id: 5, question: "Why should our recruitment team select you over other qualified candidates from top-tier technical colleges?", hint: "Emphasize your placement readiness, hands-on full-stack projects, and immediate adaptability." }
    ];
  } else {
    // Domain-Specific (Default/System design)
    return [
      { id: 1, question: "How would you design a distributed cache coherence protocol across multiple regional microservices clusters?", hint: "Mention cache-aside patterns, TTL expirations, and pub-sub write invalidations." },
      { id: 2, question: "Explain the CAP theorem and justify your choice of database for a real-time trading order book ledger.", hint: "Highlight partition-tolerance, consistency constraints, and transactional ACID requirements." },
      { id: 3, question: "How would you structure database schemas to handle complex hierarchical social comments threads?", hint: "Mention CTE recursive queries, materialized path indexes, or closure tables." },
      { id: 4, question: "Describe the network flow path of a client request routed through load balancers, API gateways, and microservices.", hint: "Discuss TLS termination, reverse-proxy headers, JWT validation, and service discovery." },
      { id: 5, question: "What mitigation strategies would you deploy to protect production microservices against cascading network time-out failures?", hint: "Explain bulkhead isolation boundaries, circuit breakers, and fallback responses." }
    ];
  }
}

// Client-side fallback dynamic interview answer grader and advisor
function getLocalAnswerEvaluation(question: string, answer: string, college: string): AnswerEvaluation {
  const ans = (answer || "").toLowerCase();
  
  const wordCount = ans.split(/\s+/).filter(Boolean).length;
  
  // Scoring parameters
  let technicalAccuracy = 60;
  let communication = 65;
  let confidence = 70;
  let relevance = 60;
  let grammar = 80;

  if (wordCount > 30) {
    technicalAccuracy += 10;
    communication += 10;
    relevance += 10;
  }
  if (wordCount > 60) {
    technicalAccuracy += 10;
    communication += 10;
    relevance += 10;
  }

  const positiveTechKeywords = [
    "index", "cache", "redis", "lock", "scalable", "star", "result", "metric", "measure",
    "architecture", "latency", "async", "reconciliation", "diff", "virtual", "normalized",
    "database", "thread", "isolation", "explain", "explain analyze", "performance", "optimization",
    "lead", "delegation", "priority", "agile", "collaboration", "testing"
  ];
  
  let pMatches = 0;
  positiveTechKeywords.forEach(kw => {
    if (ans.includes(kw)) pMatches++;
  });

  technicalAccuracy += Math.min(pMatches * 5, 20);
  relevance += Math.min(pMatches * 3, 10);
  confidence += Math.min(pMatches * 4, 15);

  technicalAccuracy = Math.min(technicalAccuracy, 100);
  communication = Math.min(communication, 100);
  confidence = Math.min(confidence, 100);
  relevance = Math.min(relevance, 100);
  grammar = Math.min(grammar, 100);

  const overall = Math.round(
    (technicalAccuracy + communication + confidence + relevance + grammar) / 5
  );

  const strengths = [];
  if (wordCount > 40) {
    strengths.push("Provided a detailed explanation mapping out practical development steps.");
  } else {
    strengths.push("Gave a concise response highlighting key system attributes.");
  }
  if (pMatches > 2) {
    strengths.push("Integrated relevant domain keywords suggesting hands-on architectural experience.");
  }
  if (ans.includes("metric") || ans.includes("reduced") || ans.includes("%") || ans.includes("ms")) {
    strengths.push("Successfully quantified project results matching top product requirements.");
  } else {
    strengths.push("Identified core logical trade-offs related to implementation speed.");
  }

  const weaknesses = [];
  if (wordCount < 30) {
    weaknesses.push("The response is brief and would benefit from deeper explanation of design patterns.");
  }
  if (pMatches < 2) {
    weaknesses.push("Relatively low usage of professional technical terminology.");
  }

  const suggestions = [];
  if (wordCount < 45) {
    suggestions.push("The response is slightly brief. Expand with a concrete situation, your actions, and the objective metrics of success.");
  }
  if (!ans.includes("metric") && !ans.includes("%")) {
    suggestions.push("Incorporate quantifiable key performance indicators (KPIs) to back up operational gains, such as 'cutting memory allocations by 25%'.");
  }

  const actionPlan = [
    "Draft a written answer template using the STAR method (Situation, Task, Action, Result).",
    "Include at least 3 industrial terms (e.g. concurrency, ACID, Redis caching) in your verbal explanation.",
    "Practice recording yourself to control speech timing and pace transitions."
  ];

  return {
    scores: {
      technicalAccuracy,
      communication,
      confidence,
      relevance,
      grammar,
      overall
    },
    feedback: {
      strengths,
      weaknesses,
      suggestions,
      actionPlan
    }
  };
}
