/**
 * Types & Interfaces for InterviewAce AI
 */

export interface AtsBreakdown {
  contact: number;       // out of 10
  education: number;     // out of 15
  projects: number;      // out of 15
  skills: number;        // out of 20
  experience: number;    // out of 15
  certifications: number;// out of 10
  keywords: number;      // out of 10
  formatting: number;    // out of 5
}

export interface ExtractedInfo {
  education: string[];
  projects: string[];
  skills: string[];
  experience: string[];
  certifications: string[];
}

export interface ResumeAnalysis {
  id: string;
  timestamp: string;
  resumeFileName: string;
  resumeText: string;
  atsScore: number;
  breakdown: AtsBreakdown;
  extractedInfo: ExtractedInfo;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  keywordDensity: { [key: string]: number };
  formattingFeedback: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  hint: string;
}

export interface AnswerEvaluation {
  scores: {
    technicalAccuracy: number;
    communication: number;
    confidence: number;
    relevance: number;
    grammar: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    actionPlan: string[];
  };
}

export interface QuestionAttempt {
  questionId: number;
  questionText: string;
  userAnswer: string;
  durationSeconds: number;
  evaluation?: AnswerEvaluation; // Filled once AI evaluates
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  timestamp: string;
  category: "Technical" | "Behavioral" | "HR" | "Domain-Specific";
  questions: InterviewQuestion[];
  attempts: QuestionAttempt[];
  avgOverallScore?: number;
  isCompleted: boolean;
}

export interface RoadmapTask {
  week: string;
  title: string;
  description: string;
  microTasks: string[];
  completedTasks: string[]; // Track checking off items locally
}

export interface RecommendedProject {
  title: string;
  description: string;
  techStack: string[];
}

export interface CareerRoadmap {
  id: string;
  timestamp: string;
  careerGoal: string;
  summary: string;
  weeklyPlan: RoadmapTask[];
  recommendedSkills: string[];
  recommendedCertifications: string[];
  recommendedProjects: RecommendedProject[];
  interviewMilestones: string[];
  completedMilestones: string[]; // Track check off state
}

export interface UserProfile {
  fullName: string;
  email: string;
  targetRole: string;
  currentCollege: string;
  graduationYear: string;
  joinedDate: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: "resume_analyzed" | "interview_started" | "interview_ended" | "roadmap_created" | "milestone_completed";
  title: string;
  description: string;
  score?: number;
}
