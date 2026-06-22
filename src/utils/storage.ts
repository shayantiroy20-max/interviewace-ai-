import { 
  UserProfile, 
  ResumeAnalysis, 
  InterviewSession, 
  CareerRoadmap, 
  ActivityLog 
} from "../types";

// Constant Storage Keys
const KEYS = {
  PROFILE: "interviewace_profile",
  RESUMES: "interviewace_resumes",
  INTERVIEWS: "interviewace_interviews",
  ROADMAPS: "interviewace_roadmaps",
  ACTIVITY: "interviewace_activity",
  THEME: "interviewace_theme"
};

// Initial realistic seed data for high-fidelity presentation
const DEFAULT_PROFILE: UserProfile = {
  fullName: "Rohan Sharma",
  email: "rohan.placement@gmail.com",
  targetRole: "Software Engineer",
  currentCollege: "Kalinga Institute of Industrial Technology",
  graduationYear: "2027",
  joinedDate: "2026-06-18T10:00:00Z"
};

const DEFAULT_RESUME_HISTORY: ResumeAnalysis[] = [
  {
    id: "res-seed-1",
    timestamp: "2026-06-19T14:30:00Z",
    resumeFileName: "Rohan_Sharma_Software_Resume.pdf",
    resumeText: "Rohan Sharma - Software Engineer. Tech stack: React, Node, Express, MongoDB, TypeScript, Python, AWS. Projects: Scalable Indian Railway Booking Portal microservice with Spring Boot & Express. Education: Jadavpur University B.E. in CS.",
    atsScore: 92,
    breakdown: {
      contact: 10,
      education: 15,
      projects: 14,
      skills: 18,
      experience: 13,
      certifications: 8,
      keywords: 9,
      formatting: 5
    },
    extractedInfo: {
      education: ["B.E. in Computer Science, Jadavpur University (CGPA: 9.32/10.00)"],
      projects: ["Scalable Indian Railway Booking Portal", "Interactive Virtual Classroom & Doubt Clearing Sandbox"],
      skills: ["ReactJS", "TypeScript", "Node.js", "Express", "Spring Boot", "Core Java", "PostgreSQL", "Tailwind CSS", "Git"],
      experience: ["Software Engineering Intern @ TCS Innovation Labs", "Freelance Web Systems Developer"],
      certifications: ["Advanced DSA & Algorithmic Problem Solving (Jadavpur University Coursework)", "TCS Certified Developer Catalyst"]
    },
    strengths: [
      "Excellent academic background from a leading Indian institution with high CGPA (9.32/10.00)",
      "Strong core technology stack matching domestic and product-firm standards (React, Spring Boot, Java, SQL)",
      "Quantifiable project milestones with detailed latency improvements"
    ],
    weaknesses: [
      "Could include deeper system-level optimization strategies like Docker orchestration",
      "Formatting could benefit from more centralized section layout rules",
      "Slightly low word count inside work history bullets"
    ],
    missingSkills: [
      "Docker",
      "Kubernetes",
      "Redis",
      "Jest Unit Testing",
      "CI/CD Pipelines",
      "GraphQL"
    ],
    keywordDensity: {
      "React": 5,
      "TypeScript": 3,
      "Node.js": 2,
      "API": 4,
      "Database": 2,
      "Deploy": 2
    },
    formattingFeedback: "The resume contains clear header demarcations. Recommended to reduce line spacing to bring all sections cleanly onto a single visual page."
  }
];

const DEFAULT_INTERVIEW_HISTORY: InterviewSession[] = [
  {
    id: "int-seed-1",
    timestamp: "2026-06-19T16:00:00Z",
    category: "Technical",
    isCompleted: true,
    avgOverallScore: 88,
    questions: [
      { id: 1, question: "Explain the difference between interface and type in TypeScript.", hint: "Think about extensible options and union type definitions." },
      { id: 2, question: "How does the React Virtual DOM work and how does Fiber improve it?", hint: "Recall reconciliation, rendering stages, and prioritized state updates." }
    ],
    attempts: [
      {
        questionId: 1,
        questionText: "Explain the difference between interface and type in TypeScript.",
        userAnswer: "Interfaces are extensible via declaration merging and are generally used to define object shapes. Types of variables can define aliases, unions, or primitives and cannot be redclared.",
        durationSeconds: 45,
        timestamp: "2026-06-19T16:02:00Z",
        evaluation: {
          scores: {
            technicalAccuracy: 92,
            communication: 90,
            confidence: 85,
            relevance: 95,
            grammar: 90,
            overall: 91
          },
          feedback: {
            strengths: ["Proper identification of declaration merging properties", "Direct, well-structured explanation"],
            weaknesses: ["Could mention performance differences during TS compiler resolution"],
            suggestions: ["Mention the 'extends' vs '&' syntactic difference explicitly"],
            actionPlan: ["Revise complex utility types and generic boundaries"]
          }
        }
      },
      {
        questionId: 2,
        questionText: "How does the React Virtual DOM work and how does Fiber improve it?",
        userAnswer: "React makes a virtual copy of the DOM in memory, diffs it when state updates, and does batch updates on the real DOM. Fiber allows splitting work into small chunks to keep the browser responsive.",
        durationSeconds: 72,
        timestamp: "2026-06-19T16:05:00Z",
        evaluation: {
          scores: {
            technicalAccuracy: 85,
            communication: 88,
            confidence: 80,
            relevance: 85,
            grammar: 85,
            overall: 85
          },
          feedback: {
            strengths: ["Accurate identification of Fiber slicing mechanism", "Correct definition of diffing"],
            weaknesses: ["Missed describing the priority scheduler (concurrency APIs)"],
            suggestions: ["Use terms like reconciliation loop and priority levels"],
            actionPlan: ["Study concurrent rendering features in React 18+"]
          }
        }
      }
    ]
  },
  {
    id: "int-seed-2",
    timestamp: "2026-06-20T11:20:00Z",
    category: "Behavioral",
    isCompleted: true,
    avgOverallScore: 79,
    questions: [
      { id: 1, question: "Tell me about a time you handled a disagreement with a technical teammate.", hint: "Use the STAR method: Situation, Task, Action, Result." }
    ],
    attempts: [
      {
        questionId: 1,
        questionText: "Tell me about a time you handled a disagreement with a technical teammate.",
        userAnswer: "We disagreed on whether to use SQL or NoSQL. I set up a mock comparison file and ran latency checks. We found MongoDB was faster for our high-write events, so we compromised of utilizing that.",
        durationSeconds: 90,
        timestamp: "2026-06-20T11:23:00Z",
        evaluation: {
          scores: {
            technicalAccuracy: 80,
            communication: 82,
            confidence: 76,
            relevance: 80,
            grammar: 78,
            overall: 79
          },
          feedback: {
            strengths: ["Objective data-driven approach to settling technical disputes", "Clear outcome achieved"],
            weaknesses: ["STAR structure is weak; didn't explain interpersonal skills used during consensus"],
            suggestions: ["Describe the emotional intelligence and listening elements first before testing benchmarking scripts"],
            actionPlan: ["Format behavioral narratives around collaborative dialogue frameworks"]
          }
        }
      }
    ]
  }
];

const DEFAULT_ROADMAPS: CareerRoadmap[] = [
  {
    id: "rdmp-seed-1",
    timestamp: "2026-06-20T09:15:00Z",
    careerGoal: "Software Engineer (Product Firms)",
    summary: "Guided curriculum to transition Kalinga Institute of Industrial Technology software background into full production-grade Cloud, DSA, and microservice operations.",
    weeklyPlan: [
      {
        week: "Week 1-2",
        title: "Dockerization & Networking",
        description: "Understand virtual environments, package management, container ports, and local networks.",
        microTasks: [
          "Dockerize backend Express API",
          "Set up a docker-compose network bridging Redis & postgres database elements",
          "Test volume bindings for hot recovery container reloads"
        ],
        completedTasks: [
          "Dockerize backend Express API"
        ]
      },
      {
        week: "Week 3-4",
        title: "Relational Mapping & Transactions",
        description: "Master SQL databases, indexing policies, transaction isolation, and ORMs (Drizzle/Prisma).",
        microTasks: [
          "Write Postgres schema with cascade foreign constraints",
          "Implement connection pooling on Express middleware routers",
          "Execute benchmarking tests for indexed queries vs sequential scans"
        ],
        completedTasks: []
      },
      {
        week: "Week 5-6",
        title: "Event Pipelines & Caching",
        description: "Reduce UI pings and heavy read delays via redis pub/sub and bullmq async tasks.",
        microTasks: [
          "Configure Redis caching on public resume endpoints",
          "Write automated Jest integrations mimicking token refreshes"
        ],
        completedTasks: []
      }
    ],
    recommendedSkills: [
      "Docker & Containers",
      "PostgreSQL & Advanced Indexing",
      "Redis Cache Architectures",
      "CI/CD Pipeline Configurations (GitHub Actions)",
      "System Design (Scalability, System Topologies)"
    ],
    recommendedCertifications: [
      "AWS Certified Solutions Architect",
      "HashiCorp Terraform Associate"
    ],
    recommendedProjects: [
      {
        title: "Distributed PDF Analytics Engine",
        description: "A production pipeline converting PDF documents to vectors under an asynchronous queue.",
        techStack: ["NodeJS", "Express", "Redis", "MinIO", "TypeScript"]
      },
      {
        title: "High Frequency Real-time Metrics Dashboard",
        description: "Live time-series chart server displaying CPU thresholds inside a clustered server layout.",
        techStack: ["React", "Go", "WebSockets", "InfluxDB"]
      }
    ],
    interviewMilestones: [
      "Solve 50 Advanced Linked Lists / Tree puzzles",
      "Complete mock HR behavioral simulation under STAR structure",
      "Construct high-level scaling schema for Amazon-like microservices",
      "Mock core API rates with synthetic JMeter payloads"
    ],
    completedMilestones: [
      "Solve 50 Advanced Linked Lists / Tree puzzles"
    ]
  }
];

const DEFAULT_ACTIVITY: ActivityLog[] = [
  {
    id: "act-1",
    timestamp: "2026-06-18T10:15:00Z",
    type: "resume_analyzed",
    title: "Initial Resume Uploaded",
    description: "Successfully processed and compiled ATS scoring metric (84% Readiness)",
    score: 84
  },
  {
    id: "act-2",
    timestamp: "2026-06-19T16:10:00Z",
    type: "interview_ended",
    title: "Completed Technical Mock",
    description: "Conducted double-question module in React and TypeScript frameworks with positive overall progress.",
    score: 88
  },
  {
    id: "act-3",
    timestamp: "2026-06-20T09:20:00Z",
    type: "roadmap_created",
    title: "SaaS Roadmap Built",
    description: "Generated 6-week technical program targeting full stack integrations & orchestration tools."
  },
  {
    id: "act-4",
    timestamp: "2026-06-20T11:25:00Z",
    type: "interview_ended",
    title: "Completed Behavioral Mock",
    description: "Answered critical teammate disagreement simulation using initial scenario scripts.",
    score: 79
  }
];

export const getStoredProfile = (): UserProfile => {
  const data = localStorage.getItem(KEYS.PROFILE);
  if (!data) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(data);
};

export const saveStoredProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getStoredResumes = (): ResumeAnalysis[] => {
  const data = localStorage.getItem(KEYS.RESUMES);
  if (!data) {
    localStorage.setItem(KEYS.RESUMES, JSON.stringify(DEFAULT_RESUME_HISTORY));
    return DEFAULT_RESUME_HISTORY;
  }
  return JSON.parse(data);
};

export const saveStoredResumes = (resumes: ResumeAnalysis[]): void => {
  localStorage.setItem(KEYS.RESUMES, JSON.stringify(resumes));
};

export const addStoredResume = (resume: ResumeAnalysis): void => {
  const current = getStoredResumes();
  saveStoredResumes([resume, ...current]);
  addActivity({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: "resume_analyzed",
    title: "New Resume Evaluated",
    description: `Analyzed '${resume.resumeFileName}' with ATS score of ${resume.atsScore}`,
    score: resume.atsScore
  });
};

export const getStoredInterviews = (): InterviewSession[] => {
  const data = localStorage.getItem(KEYS.INTERVIEWS);
  if (!data) {
    localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(DEFAULT_INTERVIEW_HISTORY));
    return DEFAULT_INTERVIEW_HISTORY;
  }
  return JSON.parse(data);
};

export const saveStoredInterviews = (interviews: InterviewSession[]): void => {
  localStorage.setItem(KEYS.INTERVIEWS, JSON.stringify(interviews));
};

export const addStoredInterview = (interview: InterviewSession): void => {
  const current = getStoredInterviews();
  saveStoredInterviews([interview, ...current]);
  addActivity({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: "interview_ended",
    title: `Mock Interview Finished`,
    description: `Completed a ${interview.category} setup of ${interview.attempts.length} attempts.`,
    score: interview.avgOverallScore
  });
};

export const getStoredRoadmaps = (): CareerRoadmap[] => {
  const data = localStorage.getItem(KEYS.ROADMAPS);
  if (!data) {
    localStorage.setItem(KEYS.ROADMAPS, JSON.stringify(DEFAULT_ROADMAPS));
    return DEFAULT_ROADMAPS;
  }
  return JSON.parse(data);
};

export const saveStoredRoadmaps = (roadmaps: CareerRoadmap[]): void => {
  localStorage.setItem(KEYS.ROADMAPS, JSON.stringify(roadmaps));
};

export const addStoredRoadmap = (roadmap: CareerRoadmap): void => {
  const current = getStoredRoadmaps();
  saveStoredRoadmaps([roadmap, ...current]);
  addActivity({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: "roadmap_created",
    title: "New Learning Path Setup",
    description: `Generated dynamic roadmap targeting '${roadmap.careerGoal}'`
  });
};

export const getStoredActivity = (): ActivityLog[] => {
  const data = localStorage.getItem(KEYS.ACTIVITY);
  if (!data) {
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(DEFAULT_ACTIVITY));
    return DEFAULT_ACTIVITY;
  }
  return JSON.parse(data);
};

export const saveStoredActivity = (activity: ActivityLog[]): void => {
  localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(activity));
};

export const addActivity = (log: ActivityLog): void => {
  const current = getStoredActivity();
  saveStoredActivity([log, ...current]);
};

export const clearAllData = (): void => {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.RESUMES);
  localStorage.removeItem(KEYS.INTERVIEWS);
  localStorage.removeItem(KEYS.ROADMAPS);
  localStorage.removeItem(KEYS.ACTIVITY);
};
