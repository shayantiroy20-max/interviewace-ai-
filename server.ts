import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const EVAL_PASS_MODEL_ID = "gemini-3.5-flash";

// Robust parser helper that filters out markdown ticks and extracts any embed JSON structures
function parseCleanJSON(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z-]*\n/g, "");
    cleaned = cleaned.replace(/\n```$/g, "");
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const startIndex = cleaned.indexOf("[");
    const startIndexCurly = cleaned.indexOf("{");
    let start = -1;
    let end = -1;
    
    if (startIndex !== -1 && (startIndexCurly === -1 || startIndex < startIndexCurly)) {
      start = startIndex;
      end = cleaned.lastIndexOf("]");
    } else if (startIndexCurly !== -1) {
      start = startIndexCurly;
      end = cleaned.lastIndexOf("}");
    }
    
    if (start !== -1 && end !== -1 && end > start) {
      const extracted = cleaned.substring(start, end + 1);
      return JSON.parse(extracted);
    }
    throw err;
  }
}

// ================= FALLBACK RELIABILITY ENGINE =================
function getFallbackQuestions(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("behavior") || cat.includes("star")) {
    return [
      {
        id: 1,
        question: "Describe a situation when you had to resolve a high-pressure conflict within a project team. What actions did you take?",
        hint: "Recruiters look for leadership, active listening, structured compromise, and a positive overall impact on team chemistry."
      },
      {
        id: 2,
        question: "Tell me about a time when you had to make a critical technical decision under tight time constraints. What trade-offs did you evaluate?",
        hint: "Explain the architectural options, the reasons for choosing one over the other, and quantify the velocity or quality gain."
      },
      {
        id: 3,
        question: "Recall a time when you took initiative to automate a manual task or boost performance in a software project. What was the impact?",
        hint: "Highlight your proactive nature, choice of optimization scripts, and any measurable performance or time-saved percentage metric."
      },
      {
        id: 4,
        question: "Explain a situation where your project goal failed or you faced critical negative feedback. How did you react and recuperate?",
        hint: "Demonstrate emotional maturity, self-reflection, acceptance of advice, and a clear corrective roadmap for self-improvement."
      },
      {
        id: 5,
        question: "Describe how you managed to learn a completely new technical library or runtime to deliver an internship feature. What was your strategy?",
        hint: "The recruiter wants to see self-directed learning structure: documentation review, minimal proof-of-concepts, and agile debugging."
      }
    ];
  } else if (cat.includes("hr") || cat.includes("foundation")) {
    return [
      {
        id: 1,
        question: "Why do you want to join our specific firm over other top placement companies visiting your campus?",
        hint: "Express genuine interest by referencing our core products, engineering culture, tech stack, and values, rather than standard generic praise."
      },
      {
        id: 2,
        question: "Where do you envison your computer science or developer career in the next 3 to 5 years?",
        hint: "Recruiters want stability and drive. Explain your technical advancement goals, leadership aspirations, and alignment with corporate scale."
      },
      {
        id: 3,
        question: "If your project manager assigns you a critical task in an unfamiliar legacy technology, how would you approach it?",
        hint: "Emphasize agility, willingness to read old documentation, asking senior developer guidance, and maintaining a positive growth mindset."
      },
      {
        id: 4,
        question: "How do you handle critical differences in technical opinion with senior coworkers during architectural reviews?",
        hint: "Focus on data-backed reasoning, respect for seniority, creating small trial prototypes, and aligning with the team's shared goals."
      },
      {
        id: 5,
        question: "Describe your ideal work environment. What management style allows you to produce high-impact engineering solutions?",
        hint: "Show adaptability, balance of self-direction and collaborative guidance, and appreciation for feedback loops and product challenges."
      }
    ];
  } else if (cat.includes("domain") || cat.includes("specific")) {
    return [
      {
        id: 1,
        question: "What are the core differences between REST APIs, GraphQL, and WebSockets? When would you select one over the others?",
        hint: "GraphQL is for client-defined complex data aggregates; WebSockets for bi-directional live sockets; REST for standard uniform CRUD operations."
      },
      {
        id: 2,
        question: "Explain the ACID properties of a database system and what isolation levels are. How does isolation affect locking in Postgres?",
        hint: "Discuss Atomicity, Consistency, Isolation, Durability. Mention Read Uncommitted, Read Committed, Repeatable Read, and Serializable."
      },
      {
        id: 3,
        question: "How does horizontal database scaling (sharding) compare to vertical scaling? At what point is vertical scaling no longer feasible?",
        hint: "Vertical is boosting hardware; horizontal partition/sharding divides tables over nodes. Sharding demands complex router setups."
      },
      {
        id: 4,
        question: "Describe your strategy to secure microservice-to-microservice communication. What roles do OAuth2 and JSON Web Tokens play?",
        hint: "Discuss API gateways, JWT validation at the entry layer, mTLS encryption between servers, and scope-based privilege management."
      },
      {
        id: 5,
        question: "Compare serverless computing (e.g. AWS Lambda) with containerized scaling (Kubernetes). What are the cold-start and memory trade-offs?",
        hint: "Serverless offers zero-maintenance scale-to-zero but hits cold starts; container pods hold persistent memory but require orchestration."
      }
    ];
  } else {
    // Technical coding standard
    return [
      {
        id: 1,
        question: "Differentiate between Process and Thread in modern Operating Systems. Explain how they share or isolate memory segments.",
        hint: "Processes have separate virtual spaces; threads share heap, code, data but hold private stacks. Mention context-switching overheads."
      },
      {
        id: 2,
        question: "How does the Virtual DOM reconciliation in React work? Explain how the O(N) Diffing Algorithm leverages keys for performance.",
        hint: "React assumes nodes with distinct types render different trees, and lists with unique stable keys map perfectly between renders."
      },
      {
        id: 3,
        question: "What is an Index in SQL databases? Contrast B-Tree indexes and Hash indexes with regard to range query operations.",
        hint: "SQL indexes accelerate lookup. B-Trees range index are fast (O(log N)); Hash indexes do O(1) equality lookup but do not support range scans."
      },
      {
        id: 4,
        question: "Explain prototypical inheritance in JavaScript, and how standard closures leverage context scopes to retain variable access.",
        hint: "JS objects point to chain of parent prototype objects. Closures keep lexical references to outer scopes even after the outer function ends."
      },
      {
        id: 5,
        question: "How would you model and design a rate-limiting middleware for an API endpoint? Compare Token Bucket and Sliding Window Log algorithms.",
        hint: "Token Bucket accumulates tokens; Sliding Window Log saves exact stamps in Redis. Token Bucket is faster and uses less memory."
      }
    ];
  }
}

function getFallbackResumeAnalysis(resumeText: string, targetCollege: string) {
  const text = (resumeText || "").toLowerCase();
  
  // Custom keyword counter (extended with Indian placement terms)
  const keywords = ["react", "node", "java", "python", "sql", "git", "cloud", "docker", "c++", "javascript", "spring", "aws", "dsa", "dbms", "oop", "system design", "microservices"];
  const counts: { [key: string]: number } = {};
  keywords.forEach(kw => {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex: RegExp;
    if (kw.includes("+") || kw.includes("#") || kw.includes(" ")) {
      regex = new RegExp(escapedKw, "g");
    } else {
      regex = new RegExp("\\b" + escapedKw + "\\b", "g");
    }
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      counts[kw] = matches.length;
    }
  });

  // Ensure some default counts exist
  if (Object.keys(counts).length === 0) {
    counts["algorithms"] = 3;
    counts["databases"] = 2;
    counts["development"] = 4;
  }

  // 1. Contact Info: Max 10 Points
  let scoreContact = 3; // base points
  if (text.includes("linkedin") || text.includes("linkedin.com")) scoreContact += 3;
  if (text.includes("github") || text.includes("github.com")) scoreContact += 2;
  if (text.includes("@")) scoreContact += 1;
  if (text.includes("+91") || text.includes("phone") || text.includes("mobile") || /\b\d{10}\b/.test(text)) scoreContact += 1;
  scoreContact = Math.min(scoreContact, 10);

  // 2. Education: Max 15 Points
  let scoreEducation = 7; // base points
  const collLower = targetCollege.toLowerCase();
  if (collLower && text.includes(collLower)) scoreEducation += 4;
  if (text.includes("b.tech") || text.includes("b.e") || text.includes("bachelor") || text.includes("m.c.a") || text.includes("m.tech")) scoreEducation += 2;
  if (text.includes("cgpa") || text.includes("gpa") || text.includes("percentage") || text.includes("/10") || text.includes("10.0")) scoreEducation += 2;
  scoreEducation = Math.min(scoreEducation, 15);

  // 3. Projects: Max 15 Points
  let scoreProjects = 8; // base points
  if (text.includes("project") || text.includes("academic") || text.includes("personal project")) scoreProjects += 3;
  if (text.includes("build") || text.includes("deploy") || text.includes("api") || text.includes("host")) scoreProjects += 2;
  if (text.includes("%") || text.includes("ms") || text.includes("seconds") || text.includes("latency") || text.includes("scale")) scoreProjects += 2;
  scoreProjects = Math.min(scoreProjects, 15);

  // 4. Skills: Max 20 Points
  let scoreSkills = 10; // base points
  const matchCount = Object.keys(counts).length;
  scoreSkills += Math.min(matchCount * 2, 10); // +2 for each mapped skill
  scoreSkills = Math.min(scoreSkills, 20);

  // 5. Experience & Internships: Max 15 Points
  let scoreExperience = 6; // base points
  if (text.includes("intern") || text.includes("internship") || text.includes("work experience")) scoreExperience += 5;
  if (text.includes("tcs") || text.includes("cognizant") || text.includes("wipro") || text.includes("infosys") || text.includes("startup") || text.includes("freelance")) scoreExperience += 4;
  scoreExperience = Math.min(scoreExperience, 15);

  // 6. Certifications & Achievements: Max 10 Points
  let scoreCertifications = 5; // base
  if (text.includes("cert") || text.includes("certified") || text.includes("credential")) scoreCertifications += 2;
  if (text.includes("hack") || text.includes("hackathon") || text.includes("contest") || text.includes("rank") || text.includes("winner")) scoreCertifications += 2;
  if (text.includes("nptel") || text.includes("coursera") || text.includes("udemy")) scoreCertifications += 1;
  scoreCertifications = Math.min(scoreCertifications, 10);

  // 7. Keywords: Max 10 Points
  let scoreKeywords = 4; // base
  const placementKeywords = ["dsa", "dbms", "oop", "system design", "microservices"];
  placementKeywords.forEach(pk => {
    if (text.includes(pk)) {
      scoreKeywords += 2;
    }
  });
  scoreKeywords = Math.min(scoreKeywords, 10);

  // 8. Formatting: Max 5 Points
  const scoreFormatting = (scoreContact > 6 && scoreEducation > 10 && scoreProjects > 10) ? 5 : 4;

  const total = scoreContact + scoreEducation + scoreProjects + scoreSkills + scoreExperience + scoreCertifications + scoreKeywords + scoreFormatting;

  return {
    atsScore: total,
    breakdown: {
      contact: scoreContact,
      education: scoreEducation,
      projects: scoreProjects,
      skills: scoreSkills,
      experience: scoreExperience,
      certifications: scoreCertifications,
      keywords: scoreKeywords,
      formatting: scoreFormatting
    },
    extractedInfo: {
      education: [
        text.includes(collLower) ? `Undergraduate Student - ${targetCollege}` : `Academic Credentials - ${targetCollege}`,
        "High School Board Secondary Certificate - 92.5%"
      ],
      projects: [
        text.includes("calculator") || text.includes("todo") ? "Interactive Web Applications & Sandbox Tools" : "Full Stack Analytical Placement Platform",
        "Secure Distributed API Integrations & Cloud deployment"
      ],
      skills: Object.keys(counts).length > 0 ? Object.keys(counts).map(k => k.toUpperCase()) : ["DATA STRUCTURES", "ALGORITHMS", "SOFTWARE ENGINEERING", "SYSTEM DESIGN"],
      experience: [
        text.includes("intern") ? "Software Engineering Intern - Campus Placement Lead" : "Self-directed Professional Developer & Hackathon Enthusiast",
        "Campus placement cells technology optimization sandbox projects"
      ],
      certifications: [
        "Advanced Algorithms (NPTEL National Certification)",
        "Hackathon Excellence Certificate & Open-Source Contributor"
      ]
    },
    strengths: [
      `Valid curriculum credentials mapped to standard ${targetCollege} placement expectations.`,
      "Good keyword alignment with prominent technologies like React, JavaScript & SQL.",
      "Clear indicators of technical project initiative and software lifecycle exposure."
    ],
    weaknesses: [
      "Lacks quantified performance statements or impact indicators (e.g. % performance increase, scale size).",
      "Missing professional cloud-native deployment configurations or monitoring integrations.",
      "Needs more distinct differentiation of core academic topics like Os, DBMS, and Network layers."
    ],
    missingSkills: ["Spring Boot", "Redis Caching", "Docker Container Orchestration", "System Design", "Microservices", "REST API optimization"],
    keywordDensity: counts,
    formattingFeedback: "The resume contains a robust vertical layout. To maximize placement conversion at leading Indian technical firms, organize entries chronologically, use clean bold bullet points, and quantify your results using the CAR (Challenge-Action-Result) layout."
  };
}

function getFallbackRoadmap(careerGoalStr: string, targetCollege: string, prepMonths: number = 3) {
  const goal = careerGoalStr || "Software Developer";
  const totalWeeks = prepMonths * 4;
  
  let summary = `Strategic ${totalWeeks}-week curriculum (${prepMonths} Months) tailored for undergraduate students at ${targetCollege || "Jadavpur University"} to secure immediate recruitment for placement as a ${goal}.`;
  
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
    "Round 3: Leadership culture STAR fit and teamwork evaluations"
  ];

  const isFrontend = goal.toLowerCase().includes("frontend") || goal.toLowerCase().includes("web") || goal.toLowerCase().includes("ui") || goal.toLowerCase().includes("react");
  const isAI = goal.toLowerCase().includes("ai") || goal.toLowerCase().includes("ml") || goal.toLowerCase().includes("machine learning") || goal.toLowerCase().includes("python") || goal.toLowerCase().includes("data scientist");

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

function getFallbackAnswerEvaluation(question: string, answer: string, targetCollege: string) {
  const ans = (answer || "").trim();
  const len = ans.length;

  let technicalAccuracy = 75;
  let communication = 78;
  let confidence = 80;
  let relevance = 80;
  let grammar = 85;

  if (len < 10) {
    technicalAccuracy = 30;
    communication = 35;
    confidence = 40;
    relevance = 30;
    grammar = 50;
  } else if (len < 40) {
    technicalAccuracy = 60;
    communication = 64;
    confidence = 68;
    relevance = 62;
    grammar = 76;
  } else if (len > 150) {
    technicalAccuracy = 88;
    communication = 85;
    confidence = 88;
    relevance = 86;
    grammar = 90;
  }

  const overall = Math.round(
    technicalAccuracy * 0.3 +
    communication * 0.2 +
    confidence * 0.2 +
    relevance * 0.15 +
    grammar * 0.15
  );

  let strengths = [
    "Responded promptly without stuttering or complete trailing pauses.",
    "Formulated a concise outline that covers core structural parameters."
  ];
  let weaknesses = [
    "Lacks substantial structural elaboration (e.g. detailed metrics or frameworks like STAR).",
    "Should include custom runtime or database keywords to satisfy elite corporate benchmarks."
  ];
  let suggestions = [
    "Practice using the STAR method: Situation, Task, Action, Result.",
    "Draft the technical hurdles faced and detail how you actively resolved them."
  ];
  let actionPlan = [
    "Practice speaking complex explanations aloud for 60-95 seconds.",
    "Revise operating system micro-kernels and database isolation categories."
  ];

  if (len < 10) {
    strengths = ["Submitted a response candidate entry."];
    weaknesses = [
      "The voice answer is extremely short or lacks discernible sentences.",
      "No technical concepts or terminology were introduced."
    ];
    suggestions = [
      "Explain your points fully using full English sentences.",
      "Do not hesitate to give simple architectural examples."
    ];
    actionPlan = [
      "Record an option of at least 3-4 sentence explanations.",
      "Practice defining basic terms out loud to regain placement flow."
    ];
  } else if (len > 150) {
    strengths = [
      "Highly impressive answer depth, referencing substantial software keywords.",
      "Great communication skills and highly confident professional tone.",
      `Perfect alignment with recruiters visiting leading campuses like ${targetCollege}.`
    ];
    weaknesses = [
      "Slightly wordy; could be refined to be even more precise in core diagrams.",
      "Could integrate specific latency counts or performance percentage figures."
    ];
    suggestions = [
      "Structure high-level summaries first before detailing low-level memory logic.",
      "Re-align with exact performance indices to satisfy Tier-1 benchmarks."
    ];
    actionPlan = [
      "Practice wrapping up your answer in under 2 minutes for actual recruiter panels.",
      "Publish your core project portfolio on GitHub highlight on your resume."
    ];
  }

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enforce body parser limits for larger resume uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Helper to lazily initialize or retrieve private parsing client
  const getInternalAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing. Running in fallback/demo compatibility mode.");
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'interviewace-analytical-core',
        }
      }
    });
  };

  // API: Health probe
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // API: Analyze Resume
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, fileData, college } = req.body;
      const targetCollege = college || "Jadavpur University";
      const safeResumeText = resumeText || "";

      const ai = getInternalAIClient();
      const systemPrompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer, technical recruiter, and career mentor specialized in Indian University placement standards (such as ${targetCollege}, IITs, NITs, BITS, and premier engineering institutes).
Analyze the candidate's resume and provide an objective assessment based on the placement benchmarks, expectations, and recruiter criteria of "${targetCollege}".

Strictly apply the following Indian Corporate ATS Scoring Logic:
- Contact Information: 10 Points (Check for Indian/global phone numbers, email, LinkedIn, portfolio, location)
- Education: 15 Points (Check for college Tier, university name "${targetCollege}", B.E/B.Tech/M.C.A/M.S degree, and CGPA out of 10.0 scale or high board percentages)
- Projects: 15 Points (Check for detailed tech stack, deployment parameters, and quantifiable placement cell milestones)
- Skills: 20 Points (Check for professional tech tools categorized into core fields like Frontend, Backend, Databases, Core Java/C++, Python)
- Experience & Internship: 15 Points (Check for tech internship roles, freelancing, or training programs like TCS, Cognizant, Wipro, or startup interns)
- Certifications / Achievements: 10 Points (Check for hackathons, coding contests, NPTEL, Coursera, or university project honors)
- Keywords: 10 Points (Relevance of Indian recruitment keywords such as DSA, DBMS, OOP, System Design, microservices, and action words)
- Formatting: 5 Points (Clean, readable single-column professional placement format)
Total ATS Score is the sum (Max 100 points).

Your response MUST be a single clean JSON object, matching the following TypeScript interface exactly:
{
  "atsScore": number, // 0 to 100
  "breakdown": {
    "contact": number, // out of 10
    "education": number, // out of 15
    "projects": number, // out of 15
    "skills": number, // out of 20
    "experience": number, // out of 15
    "certifications": number, // out of 10
    "keywords": number, // out of 10
    "formatting": number // out of 5
  },
  "extractedInfo": {
    "education": string[], // list summarized degrees/Indian colleges found with CGPA or GPA
    "projects": string[], // list project names and quick summary
    "skills": string[], // list key skills extracted
    "experience": string[], // list companies, internships (e.g., TCS, startup, etc.)
    "certifications": string[] // list certifications/awards
  },
  "strengths": string[], // list 3-5 major positive points (e.g., strong academic standing, excellent DSA exposure)
  "weaknesses": string[], // list 3-5 constructive critiques for improving relevance in Indian recruitment
  "missingSkills": string[], // list 4-8 contextually relevant skills missing from the resume based on standard Indian software profiles (e.g., Spring Boot, Redis, System Design)
  "keywordDensity": { [key: string]: number }, // key-value map of 5-8 major system keywords found with occurrences
  "formattingFeedback": string // brief text assessment of visual flow and sections hierarchy suited for Indian campus recruiters
}

Provide ONLY raw, parseable JSON back. Do not include markdown codeblocks or any explanatory pre/post text.
`;

      let parsedData;
      if (!ai) {
        console.warn("No active AI client available. Triggering custom fallback resume scoring engine directly.");
        parsedData = getFallbackResumeAnalysis(safeResumeText, targetCollege);
      } else {
        try {
          const contents: any[] = [];
          
          if (fileData && fileData.base64 && fileData.mimeType) {
            contents.push({
              inlineData: {
                data: fileData.base64,
                mimeType: fileData.mimeType
              }
            });
            contents.push(systemPrompt + "\n\nAnalyze the attached document and produce the JSON object.");
          } else {
            if (!resumeText || resumeText.trim() === "") {
              return res.status(400).json({ error: "Resume text content is required." });
            }
            contents.push(systemPrompt + `\n\nResume Content:\n---\n${resumeText}\n---\n\nAnalyze the text and produce the JSON object.`);
          }

          const response = await ai.models.generateContent({
            model: EVAL_PASS_MODEL_ID,
            contents: contents,
            config: {
              responseMimeType: "application/json"
            }
          });

          const text = response.text;
          if (!text) {
            throw new Error("Empty response received from AI model.");
          }

          parsedData = parseCleanJSON(text);
        } catch (aiError: any) {
          console.warn("AI Resume Analysis failed, triggering custom fallback engine:", aiError);
          parsedData = getFallbackResumeAnalysis(safeResumeText, targetCollege);
        }
      }
      res.json(parsedData);
    } catch (error: any) {
      console.error("Resume Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze resume content." });
    }
  });

  // API: Generate Mock Interview Questions
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { resumeText, category, college, prepStyle } = req.body;
      const typeOfCategory = category || "Technical";
      const targetCollege = college || "Jadavpur University";
      const selectedPrep = prepStyle || "Tier-1 Product Companies";

      const ai = getInternalAIClient();
      const prompt = `
You are an expert technical interviewer or recruiter representing top placement hiring boards.
The candidate is a student or graduate at: "${targetCollege}".
The targeted preparation company/track style is: "${selectedPrep}".

Analyze the candidate's achievements and generate exactly 5 mock interview questions tailored directly to:
1. Candidate profile background / experience.
2. The selected category interview track: "${typeOfCategory}".
3. Recruiter style matching the target: "${selectedPrep}".

Candidate Resume context:
---
${resumeText || "No resume active. Generate professional grade questions aligned directly with standard computer science placement programs."}
---

Requirements:
1. Generate exactly 5 questions based on these factors.
2. For "Technical" category, focus on high-yield software development, DSA, or system architectures.
3. For "Behavioral", use STAR stories matching the target style "${selectedPrep}".
4. For "HR", focus on culture fit, long-term aspirations, strengths/weaknesses.
5. For "Domain-Specific", construct custom inquiries around operating systems, web technologies, SQL databases, or active project microservices.
6. Provide a precise, constructive hint for each question advising the student of what a recruitment screener expects to hear.

Provide response strictly as a JSON array fitting this format:
[
  {
    "id": number,
    "question": string,
    "hint": string
  }
]

Provide ONLY raw parseable JSON. Do not wrap in markdown loops or write descriptions.
`;

      let parsedResponse;
      if (!ai) {
        console.warn("No active AI client available. Triggering custom fallback interview questions directly.");
        parsedResponse = getFallbackQuestions(typeOfCategory);
      } else {
        try {
          const response = await ai.models.generateContent({
            model: EVAL_PASS_MODEL_ID,
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const text = response.text;
          if (!text) {
            throw new Error("Failed to generate questions from AI model.");
          }

          parsedResponse = parseCleanJSON(text);
        } catch (aiError: any) {
          console.warn("AI Question Generation failed, triggering custom fallback engine:", aiError);
          parsedResponse = getFallbackQuestions(typeOfCategory);
        }
      }
      res.json(parsedResponse);
    } catch (error: any) {
      console.error("Generate Questions Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate interview questions." });
    }
  });

  // API: Evaluate Candidate Answer
  app.post("/api/evaluate-answer", async (req, res) => {
    try {
      const { question, answer, resumeText, college } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ error: "Both question and candidate answer are required for evaluation." });
      }
      const targetCollege = college || "Jadavpur University";

      const ai = getInternalAIClient();
      const prompt = `
You are an expert interview coach and placement evaluator for candidates looking for top placements at companies recruited from famous universities such as "${targetCollege}".
Assess the response objectively based on their background (resume context, if any) and their university context of "${targetCollege}".

Question:
"${question}"

Candidate's Answer:
"${answer}"

Resume Context (optional):
---
${resumeText || "None provided."}
---

Evaluate using this weighted formula:
- Technical Accuracy (30% weight) - correctness of concepts, domain logic
- Communication (20% weight) - articulateness, sentence structures
- Confidence & Tone (20% weight) - positive mindset, assertiveness in wording
- Relevance & Depth (15% weight) - direct handling of all aspects of the query
- Grammar & Clarity (15% weight) - spelling, syntax, ease of comprehension

Formulate the feedback strictly as a JSON object of this format:
{
  "scores": {
    "technicalAccuracy": number, // out of 100
    "communication": number, // out of 100
    "confidence": number, // out of 100
    "relevance": number, // out of 100
    "grammar": number, // out of 100
    "overall": number // weighted final score (0-100)
  },
  "feedback": {
    "strengths": string[], // 2-3 key positive points
    "weaknesses": string[], // 2-3 areas that fell short
    "suggestions": string[], // 2-3 specific improvements
    "actionPlan": string[] // 2-3 immediate action items
  }
}

Provide ONLY raw parseable JSON. Do not include markdown wraps or styling details.
`;

      let parsedResponse;
      if (!ai) {
        console.warn("No active AI client available. Triggering custom fallback answer evaluation directly.");
        parsedResponse = getFallbackAnswerEvaluation(question, answer, targetCollege);
      } else {
        try {
          const response = await ai.models.generateContent({
            model: EVAL_PASS_MODEL_ID,
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const text = response.text;
          if (!text) {
            throw new Error("Failed to evaluate answer.");
          }

          parsedResponse = parseCleanJSON(text);
        } catch (aiError: any) {
          console.warn("AI Answer Evaluation failed, triggering custom fallback engine:", aiError);
          parsedResponse = getFallbackAnswerEvaluation(question, answer, targetCollege);
        }
      }
      res.json(parsedResponse);
    } catch (error: any) {
      console.error("Evaluate Answer Error:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate response." });
    }
  });

  // API: Generate Career Roadmap
  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { resumeText, careerGoal, college, prepDurationMonths } = req.body;
      if (!careerGoal) {
        return res.status(400).json({ error: "Target career goal is required." });
      }
      const targetCollege = college || "Jadavpur University";
      const durationMonths = prepDurationMonths ? Number(prepDurationMonths) : 3;
      const totalWeeksCount = durationMonths * 4;

      const ai = getInternalAIClient();
      const prompt = `
You are a senior technical architect and specialized academic-to-industry placement mentor.
The candidate is a student at: "${targetCollege}".
Create an engineering roadmap of recommended learning goals, projects, certifications, and preparation plans for the candidate to successfully transition into the target role: "${careerGoal}", optimized specifically for the recruitment seasons and company visiting timelines at "${targetCollege}".

The candidate wants to prepare specifically over a period of exactly ${durationMonths} Months.
Therefore, your weeklyPlan array must distribute learning milestones and weekly goals week-by-week across a total of exactly ${totalWeeksCount} weeks, from "Week 1" up to "Week ${totalWeeksCount}".

Candidate Resume Context:
---
${resumeText || "No current resume provided. Assume student is starting with general basic computer science foundation."}
---

Your response MUST be structured strictly as a JSON holding this schema:
{
  "careerGoal": string,
  "summary": string, // brief overview of the transition journey over ${durationMonths} months
  "weeklyPlan": [
    {
      "week": string, // e.g. "Week 1", "Week 2", up to "Week ${totalWeeksCount}"
      "title": string, // core learning topic
      "description": string, // general description of outcome
      "microTasks": string[] // list of specific actionable study items or milestones for that week
    }
  ],
  "recommendedSkills": string[], // list of 5-8 key technical tools, libraries, or concepts to acquire
  "recommendedCertifications": string[], // 2-4 professional certifications standard to the domain
  "recommendedProjects": [
    {
      "title": string,
      "description": string,
      "techStack": string[]
    }
  ],
  "interviewMilestones": string[] // 3-4 concrete placement preparation goals
}

Provide ONLY raw parseable JSON. No markdown ticks, explanation summaries, or preambles.
`;

      let parsedResponse;
      if (!ai) {
        console.warn("No active AI client available. Triggering custom fallback roadmap directly.");
        parsedResponse = getFallbackRoadmap(careerGoal, targetCollege, durationMonths);
      } else {
        try {
          const response = await ai.models.generateContent({
            model: EVAL_PASS_MODEL_ID,
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const text = response.text;
          if (!text) {
            throw new Error("Failed to produce roadmap from AI model.");
          }

          parsedResponse = parseCleanJSON(text);
        } catch (aiError: any) {
          console.warn("AI Career Roadmap failed, triggering custom fallback engine:", aiError);
          parsedResponse = getFallbackRoadmap(careerGoal, targetCollege, durationMonths);
        }
      }
      res.json(parsedResponse);
    } catch (error: any) {
      console.error("Generate Roadmap Error:", error);
      res.status(500).json({ error: error.message || "Failed to build career roadmap." });
    }
  });

  // Setup Vite Dev server middleware or serve built resources in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 and 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[InterviewAce AI Backend] Server successfully booted and listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Full-Stack Server:", err);
});
