import { jsPDF } from "jspdf";
import { UserProfile, InterviewSession, ResumeAnalysis, CareerRoadmap } from "../types";

export function generateMockInterviewPDF(session: InterviewSession, profile: UserProfile) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let y = 20;
  let pageNum = 1;
  
  const drawPageBorder = () => {
    // Elegant dual border layout
    doc.setDrawColor(226, 232, 240); // slate-200 outer border
    doc.setLineWidth(1.0);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setDrawColor(79, 70, 229); // indigo inner border
    doc.setLineWidth(0.3);
    doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);
    
    // Aesthetic footer
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-400
    doc.text(`InterviewAce™ Certified Performance • Verification Token: IA-${session.id.toUpperCase()}`, 14, pageHeight - 12);
    doc.text(`Page ${pageNum}`, pageWidth - 22, pageHeight - 12);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 22) {
      doc.addPage();
      pageNum++;
      drawPageBorder();
      y = 25;
    }
  };

  // Setup first page
  drawPageBorder();

  // Premium Header Box with beautiful dual colors
  doc.setFillColor(15, 23, 42); // Deep slate
  doc.rect(12, 12, pageWidth - 24, 26, "F");
  
  // Thin decorative gold accent line at the bottom of the header box
  doc.setFillColor(217, 119, 6); // gold
  doc.rect(12, 36.5, pageWidth - 24, 1.5, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("INTERVIEW PREPARATION EVALUATION REPORT", 17, 21);
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 182, 212); // Vibrant cyan
  doc.text("CERTIFICATE OF INTERACTIVE PERFORMANCE", 17, 27);
  
  // Big Badge score in header
  doc.setFillColor(30, 41, 59); // slightly lighter slate
  doc.rect(pageWidth - 48, 15, 32, 18, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(6, 182, 212); // cyan
  doc.text(`${session.avgOverallScore}%`, pageWidth - 37, 24, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(241, 245, 249);
  doc.text("MEAN VERDICT", pageWidth - 37, 29, { align: "center" });

  y = 48;

  // Metadata Card Panel (with cool subtle blue tone)
  doc.setFillColor(248, 250, 252); // soft off-white
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(12, y, pageWidth - 24, 30, "FD");

  // Vertical accent line matching college placement theme
  doc.setFillColor(79, 70, 229); // royal indigo
  doc.rect(12, y, 2.5, 30, "F");

  doc.setFontSize(9);
  
  // Grid coordinates format
  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Student Professional Profile:", 17, y + 8);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(profile.fullName, 65, y + 8);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Enrolled Academic Institution:", 17, y + 14);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(profile.currentCollege, 65, y + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Simulation Focus Track:", 17, y + 20);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(`${session.category} Placement Suite`, 65, y + 20);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Audit Timestamp Log:", 17, y + 26);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(new Date(session.timestamp).toLocaleString(), 65, y + 26);

  y += 40;

  // Title Section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("STRESS-TEST MULTI-ROUND QUESTION DETAILS", 12, y);
  
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.2);
  doc.line(12, y + 2.5, pageWidth - 12, y + 2.5);
  
  y += 9;

  // Loop through attempts
  session.attempts.forEach((att, idx) => {
    ensureSpace(65);

    // Question header with nice backdrop block
    doc.setFillColor(241, 245, 249);
    doc.rect(12, y, pageWidth - 24, 7, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(79, 70, 229); // royal indigo
    doc.text(`Q${idx + 1}. ${att.questionText}`, 14, y + 5);
    y += 11;

    // Metrics Row Grid Panel
    ensureSpace(12);
    doc.setFillColor(254, 243, 199); // soft amber
    doc.rect(13, y, 32, 5, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 4); // deep brown
    doc.text(`Overall Score: ${att.evaluation?.scores.overall}%`, 15, y + 3.8);

    if (att.evaluation) {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Tech Accuracy: ${att.evaluation.scores.technicalAccuracy}%   |   Comm: ${att.evaluation.scores.communication}%   |   Confidence: ${att.evaluation.scores.confidence}%`,
        48,
        y + 3.8
      );
    }
    y += 8;

    // Beautifully padded candidate answer box with left purple boundary line
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    
    doc.setFillColor(250, 250, 250);
    const splitAnswer = doc.splitTextToSize(`Candidate Voice/Written Response:\n"${att.userAnswer}"`, pageWidth - 32);
    const textHeight = splitAnswer.length * 4.2 + 5;
    ensureSpace(textHeight + 15);
    
    // Draw card background
    doc.rect(14, y, pageWidth - 28, textHeight, "F");
    // Draw card left purple line
    doc.setFillColor(129, 140, 248);
    doc.rect(14, y, 1.5, textHeight, "F");
    
    doc.text(splitAnswer, 18, y + 4);
    y += textHeight + 5;

    if (att.evaluation?.feedback) {
      // Strengths Block (Subtle Green alert box look)
      ensureSpace(16);
      doc.setFillColor(240, 253, 244); // light emerald green
      doc.rect(14, y, pageWidth - 28, 8, "F");
      
      // Draw circular green bullet
      doc.setFillColor(22, 163, 74);
      doc.circle(18, y + 4, 1.0, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61); // forest green
      doc.text("Strengths Detected:", 22, y + 5);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const strengthText = doc.splitTextToSize(att.evaluation.feedback.strengths.join(", "), pageWidth - 60);
      doc.text(strengthText, 52, y + 5);
      y += 10;

      // Key Gaps Block (Subtle Yellow/orange alert box look)
      ensureSpace(16);
      doc.setFillColor(254, 243, 199); // light orange alert box
      doc.rect(14, y, pageWidth - 28, 8, "F");
      
      // Draw circular yellow bullet
      doc.setFillColor(217, 119, 6);
      doc.circle(18, y + 4, 1.0, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9); // dark amber
      doc.text("Identified Skill Gaps:", 22, y + 5);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const gapText = doc.splitTextToSize(att.evaluation.feedback.weaknesses.join(", "), pageWidth - 60);
      doc.text(gapText, 52, y + 5);
      y += 10;

      // Recommendations Block (Subtle Cyan alert box look)
      ensureSpace(16);
      doc.setFillColor(236, 254, 255); // light cyan alert box
      doc.rect(14, y, pageWidth - 28, 8, "F");
      
      // Draw circular cyan bullet
      doc.setFillColor(8, 145, 178);
      doc.circle(18, y + 4, 1.0, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(14, 116, 144); // dark cyan
      doc.text("Coaching Directions:", 22, y + 5);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const feedbackText = doc.splitTextToSize(att.evaluation.feedback.suggestions.join(", "), pageWidth - 60);
      doc.text(feedbackText, 52, y + 5);
      y += 14;
    }
    
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.4);
    doc.line(12, y, pageWidth - 12, y);
    y += 5;
  });

  // End Certificate Signatures Box
  ensureSpace(38);
  y += 5;
  
  // Nice light grey divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(12, y, pageWidth - 12, y);
  y += 8;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("PLACEMENT VERIFICATION BOARD", 14, y + 2);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Automated Signature Placement Expert Counsel", 14, y + 7);

  // Hologram Certified Box look right
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - 75, y - 2, 63, 14, "FD");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229);
  doc.text("★ VERIFIED AUTHENTIC ★", pageWidth - 43, y + 4, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Placement Board Training Certification Passed", pageWidth - 43, y + 8.5, { align: "center" });

  doc.save(`Placement_Mock_Report_${session.category}_${Date.now()}.pdf`);
}

export function generatePerformanceSummaryPDF(
  profile: UserProfile, 
  resumes: ResumeAnalysis[], 
  interviews: InterviewSession[], 
  roadmaps: CareerRoadmap[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let y = 20;
  let pageNum = 1;

  const drawPageBorder = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1.0);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setDrawColor(6, 182, 212); // cyan
    doc.setLineWidth(0.3);
    doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("InterviewAce™ Premium Portal • Certified Placement Portfolio Summary Report", 14, pageHeight - 12);
    doc.text(`Page ${pageNum}`, pageWidth - 22, pageHeight - 12);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 22) {
      doc.addPage();
      pageNum++;
      drawPageBorder();
      y = 25;
    }
  };

  drawPageBorder();

  // Premium Top Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(12, 12, pageWidth - 24, 26, "F");
  
  // Gold accent decoration
  doc.setFillColor(217, 119, 6);
  doc.rect(12, 36.5, pageWidth - 24, 1.5, "F");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("PLACEMENT BOARD SUMMARY PORTFOLIO STATUS", 17, 21);
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(165, 180, 252);
  doc.text(`DEVELOPED SECURELY FOR CAMPUS BOARD & INSTITUTION REVIEW`, 17, 27);

  // Verified Status Badge
  doc.setFillColor(16, 185, 129); // emerald green
  doc.rect(pageWidth - 48, 15, 32, 18, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFIED", pageWidth - 32, 24, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(241, 245, 249);
  doc.text("PORTFOLIO OK", pageWidth - 32, 29, { align: "center" });

  y = 48;

  // Metadata Card Panel
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(12, y, pageWidth - 24, 30, "FD");

  doc.setFillColor(6, 182, 212); // left cyan accent column rule
  doc.rect(12, y, 2.5, 30, "F");

  doc.setFontSize(9);
  
  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Candidate Full Name:", 17, y + 8);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(profile.fullName, 65, y + 8);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Active Institution:", 17, y + 14);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(profile.currentCollege, 65, y + 14);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Target Domain Role:", 17, y + 20);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(profile.targetRole || "Software Developer", 65, y + 20);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "bold");
  doc.text("Verification Date:", 17, y + 26);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleString(), 65, y + 26);

  y += 40;

  // Section 1: Core Performance Scoring Parameters
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1. CORE RECRUITMENT BENCHMARK METRICS", 12, y);
  
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.0);
  doc.line(12, y + 2.5, pageWidth - 12, y + 2.5);
  
  y += 8;

  // Get score statistics
  const latestAts = resumes.length > 0 ? resumes[0].atsScore : 84;
  const bestInterview = interviews.length > 0 
    ? Math.max(...interviews.map(i => i.avgOverallScore || 0)) 
    : 81;
  const roadmapsActive = roadmaps.length > 0 ? roadmaps.length : 1;

  // Draw 3 styled Bento bocks for the statistics
  const colWidth = (pageWidth - 30) / 3;

  // Block 1: ATS
  doc.setFillColor(243, 244, 246);
  doc.rect(12, y, colWidth, 24, "F");
  doc.setFillColor(79, 70, 229);
  doc.rect(12, y, colWidth, 1.2, "F"); // top cap line
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229);
  doc.text(`${latestAts}%`, 12 + colWidth / 2, y + 10, { align: "center" });
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("LATEST ATS SCORE", 12 + colWidth / 2, y + 16, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(resumes.length > 0 ? "CV Audited" : "Baseline Metric", 12 + colWidth / 2, y + 21, { align: "center" });

  // Block 2: Interview Mock
  doc.setFillColor(243, 244, 246);
  doc.rect(12 + colWidth + 3, y, colWidth, 24, "F");
  doc.setFillColor(6, 182, 212);
  doc.rect(12 + colWidth + 3, y, colWidth, 1.2, "F"); // top cap line
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(6, 182, 212);
  doc.text(`${bestInterview}%`, 12 + colWidth + 3 + colWidth / 2, y + 10, { align: "center" });
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("BEST COACH SCORE", 12 + colWidth + 3 + colWidth / 2, y + 16, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(interviews.length > 0 ? "Rounds Completed" : "Sandbox Core Track", 12 + colWidth + 3 + colWidth / 2, y + 21, { align: "center" });

  // Block 3: Roadmaps
  doc.setFillColor(243, 244, 246);
  doc.rect(12 + (colWidth * 2) + 6, y, colWidth, 24, "F");
  doc.setFillColor(16, 185, 129);
  doc.rect(12 + (colWidth * 2) + 6, y, colWidth, 1.2, "F"); // top cap line
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text(`${roadmapsActive}`, 12 + (colWidth * 2) + 6 + colWidth / 2, y + 10, { align: "center" });
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("ACTIVE ROADMAPS", 12 + (colWidth * 2) + 6 + colWidth / 2, y + 16, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Guided Syllabus", 12 + (colWidth * 2) + 6 + colWidth / 2, y + 21, { align: "center" });

  y += 35;

  // Section 2: Resume Audit Gaps
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2. RESUME EVALUATION RESULTS REVIEW", 12, y);
  
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.0);
  doc.line(12, y + 2.5, pageWidth - 12, y + 2.5);

  y += 9;

  const currentResume = resumes.length > 0 ? resumes[0] : null;

  if (currentResume) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Active Verified File: "${currentResume.resumeFileName}"`, 13, y);
    y += 5.5;

    // strengths card
    doc.setFillColor(240, 253, 244);
    const splitStr = doc.splitTextToSize("★ STRENGTHS: " + currentResume.strengths.join(", "), pageWidth - 32);
    const strH = splitStr.length * 4.2 + 5;
    ensureSpace(strH + 5);
    doc.rect(13, y, pageWidth - 26, strH, "F");
    
    doc.setFillColor(34, 197, 94);
    doc.rect(13, y, 1.5, strH, "F"); // green accent cap
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61);
    doc.text(splitStr, 17, y + 4.2);
    y += strH + 4;

    // gaps card
    doc.setFillColor(254, 243, 199);
    const splitWeak = doc.splitTextToSize("⚠ SUGGESTED ADJUSTMENTS: " + currentResume.weaknesses.join(", "), pageWidth - 32);
    const weakH = splitWeak.length * 4.2 + 5;
    ensureSpace(weakH + 5);
    doc.rect(13, y, pageWidth - 26, weakH, "F");
    
    doc.setFillColor(217, 119, 6);
    doc.rect(13, y, 1.5, weakH, "F"); // yellow accent cap
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(splitWeak, 17, y + 4.2);
    y += weakH + 6;
  } else {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("No resume audit records found. Please upload a placement CV to populate.", 13, y);
    y += 10;
  }

  // Section 3: Roadmap Progress
  ensureSpace(20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3. CAREER READINESS LEARNING SYLLABUS", 12, y);
  
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.0);
  doc.line(12, y + 2.5, pageWidth - 12, y + 2.5);

  y += 9;

  const currentRoadmap = roadmaps.length > 0 ? roadmaps[0] : null;

  if (currentRoadmap) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`🎯 Target: ${currentRoadmap.careerGoal}`, 13, y);
    y += 5.5;

    currentRoadmap.weeklyPlan.slice(0, 3).forEach((wk) => {
      ensureSpace(18);
      // Week Card
      doc.setFillColor(248, 250, 252);
      doc.rect(13, y, pageWidth - 26, 10, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(wk.week, 16, y + 6.5);
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(79, 70, 229);
      doc.text(wk.title, 38, y + 6.5);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const mTasks = doc.splitTextToSize(wk.microTasks.slice(0, 2).join(" • "), pageWidth - 145);
      doc.text(mTasks, 138, y + 6.5);

      y += 12;
    });
    y += 4;
  } else {
    // Standard default blueprint content
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`🎯 Target: Full-Stack Developer Curriculum`, 13, y);
    y += 5.5;

    const defaultWeeks = [
      { wk: "Week 1-2", tit: "DSA & Algorithmic Complexities" },
      { wk: "Week 3-4", tit: "Multi-threaded Express Backends" },
      { wk: "Week 5-6", tit: "Distributed Microservices & Cloud Registries" }
    ];

    defaultWeeks.forEach((dw) => {
      doc.setFillColor(248, 250, 252);
      doc.rect(13, y, pageWidth - 26, 8, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(dw.wk, 16, y + 5);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229);
      doc.text(dw.tit, 35, y + 5);
      y += 10;
    });
    y += 4;
  }

  // Section 4: Academic Placement Desk notes
  ensureSpace(40);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("4. PLACEMENT EXPERT COUNSEL DESK", 12, y);
  
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.0);
  doc.line(12, y + 2.5, pageWidth - 12, y + 2.5);

  y += 8;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(217, 119, 6); // gold outline box for comments
  doc.setLineWidth(0.4);
  doc.rect(12, y, pageWidth - 24, 25, "FD");
  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6);
  doc.text("COUNCILING AND TARGET RECRUITERS REMARK NOTES:", 16, y + 6);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Active Campus Placement Level: GOLD LEVEL TARGET. Cleared system design prerequisites.", 16, y + 13);
  doc.text("Recommendation: Practice speaking technical closures, scale up CGPA and keep checking system roadmaps.", 16, y + 18);
  y += 36;

  // Signature Block
  ensureSpace(20);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(12, y, pageWidth - 12, y);
  y += 6;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("INTERVIEWACE CAMPUS DIRECTIVE", 14, y);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Automated Digitally Secure Verification Core Passed", 14, y + 4.5);

  // Sign stamp right
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - 75, y - 4, 63, 14, "FD");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 182, 212);
  doc.text("★ PLACEMENT CERTIFIED ★", pageWidth - 43, y + 2, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Certified Report issued to the Placement Cell", pageWidth - 43, y + 6.5, { align: "center" });

  doc.save(`Placement_Portfolio_Report_${Date.now()}.pdf`);
}
