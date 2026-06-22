# InterviewAce AI 🚀

> **Mock Assessment & Recruitment Analytics Performance Platform**  
> *"Nail Your University Placements with Predictive Intelligence"*

---

## 💡 Problem Statement
University students face high friction when transitioning from academics into corporate roles. 
Indeed, over **70% of candidate resumes** fail to cross Applicant Tracking Systems (ATS) filters, and many prospects perform poorly in mock parameters due to delivery pacing glitches and inadequate alignment with recruiter expectations. Standard educational portals lack customized, project-specific technical mock rounds, or real-time diagnostic scoring tracks.

---

## ✨ Our Solution: InterviewAce AI
**InterviewAce AI** acts as an immersive sandbox coaching suite matching candidates directly against rigorous industry checklists using optimized server-side analysis models.

Designed to look like an ultra-premium enterprise SaaS product, the platform supports:
1. **Dynamic Resume Audit Panel:** Highlights formatting critiques, keyword density graphs, and triggers customizable skill-gaps.
2. **Interactive Mock Interview Coach:** Generates tailormade questions. Converts spoken audio into text utilizing browser Speech Recognition, calculating fluency, clarity, and grammatical correctness.
3. **Structured Career Transition Roadmap:** Assembles week-by-week developer curricula. Cheek-off controls update dashboard progress.
4. **Verified Assessment Ledger PDF exports:** One-click compiling of assessment cards of questions, answers, scores, and roadmap summaries into structured PDF layout documents.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 18+, TypeScript, Tailwind CSS, Recharts (Area charts, Competence radar grids), Lucide Icons, Framer Motion
- **Backend Core:** Express.js + Vite Sandbox Middleware
- **AI Engine Core:** Secure REST API gateway client
- **PDF Core:** jsPDF layout generator
- **State Preservation:** Unified browser local storage caching module.

---

## 📊 Dual Scoring Mathematical Logics

### 📝 1. Resume ATS Score (Max 100 Points)
- **Contact Integrity:** 10 Points (Verifies phone, email, portfolio/LinkedIn link)
- **Academic Pedagogy:** 15 Points (Grades GPAs, colleges metadata)
- **Project Quantifications:** 15 Points (Checks for metrics-oriented project bullets)
- **Tool-Stack Coverage:** 20 Points (Scans categorized library listings)
- **Professional Experience:** 15 Points (Grades work history)
- **Credentials & Awards:** 10 Points
- **Industry Keywords:** 10 Points (Corporate software dev phrases)
- **Visual Formatting:** 5 Points (Clean column alignment)

### 🎙️ 2. Answer Evaluation Weighting
- **Technical Accuracy:** 30% Weight
- **Communication Flow:** 20% Weight
- **Confidence of Delivery:** 20% Weight
- **Relevance & Depth:** 15% Weight
- **Grammar & Syntax:** 15% Weight

---

## 🚀 Installation & Local Launch

### Prerequisite Environment Variables
Create a local `.env` file in your workspace root declaring your API gateway token parameters:
```env
# Server Secret API Token
API_KEY="your_api_key_here"

# Local or production deployment URL
APP_URL="http://localhost:3000"
```

### Setup Command Steps
```bash
# 1. Install dependencies from package manifest
npm install

# 2. Boot up full-stack development workspace
npm run dev

# 3. Compiles production resources (combines Vite static assets & Express Node bundle)
npm run build

# 4. Standalone launch sequence
npm run start
```

---

## 🔮 Future Scope
- **Real-time Live Audio PCM Streaming:** Bridge local audio directly with Live APIs for simultaneous duplex dialogue.
- **Video Emotion Analytics:** Capture webcam frames (1 FPS limitations) to estimate mock behavioral eye contacts.
- **Relational Enterprise Sync:** Multi-member dashboard metrics synchronization for college placement directors.

---

*InterviewAce AI is designed by Senior Architects. Certified and compiled green.*
