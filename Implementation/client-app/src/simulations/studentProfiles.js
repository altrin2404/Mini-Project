import { getStudentSemesters } from "./engineeringSemesters";

// ============================================================
// GAMIFIED REWARDS & BADGES GENERATOR
// ============================================================
export function getStudentRewards(studentId) {
  if (studentId === 1) {
    // Altrin: Top 1% Status
    return {
      level: 5,
      levelTitle: "Status: Top 1% (Level 5)",
      currentXp: 3850,
      nextLevelXp: 4500,
      rank: "Status: Top 1",
      streaks: [
        { id: "att", name: "Biometric Attendance Streak", value: "32 Days", icon: "Flame", color: "#f97316", desc: "Never missed a class • Well above 75% cutoff" },
        { id: "lab", name: "Lab Code Execution Streak", value: "6 Labs", icon: "Zap", color: "#eab308", desc: "Passed 100% of test cases on first run" },
        { id: "iat", name: "Internal Exam Distinction", value: "2 Exams", icon: "Award", color: "#6366f1", desc: "Scored 90%+ in both IAT 1 and IAT 2" },
      ],
      badges: [
        { id: "b1", title: "75%+ Attendance Met", category: "Attendance", icon: "ShieldCheck", unlocked: true, date: "Unlocked Week 4", desc: "Biometric attendance kept above 75% cutoff.", xp: "+250 XP" },
        { id: "b2", title: "IAT 1 Distinction (94%)", category: "Academics", icon: "Trophy", unlocked: true, date: "Unlocked Month 2", desc: "Scored 94/100 in Internal Exam 1.", xp: "+400 XP" },
        { id: "b3", title: "Lab Practical Distinction", category: "Practical", icon: "Terminal", unlocked: true, date: "Unlocked Month 3", desc: "Scored 97/100 in Model Practical lab examination.", xp: "+350 XP" },
        { id: "b4", title: "Zero Arrears", category: "Academics", icon: "CheckCircle2", unlocked: true, date: "Semester 1–4", desc: "Passed all subjects with no backlogs.", xp: "+500 XP" },
        { id: "b5", title: "Semester 5 (Top 1%)", category: "Excellence", icon: "Crown", unlocked: true, date: "Active", desc: "Maintained 9.4 GPA in current semester.", xp: "+600 XP" },
        { id: "b6", title: "End Semester Board Exam", category: "Final Exam", icon: "Sparkles", unlocked: false, date: "Upcoming", desc: "University final theory board exams.", xp: "+1,000 XP" },
      ],
    };
  }

  if (studentId === 3) {
    // Rethna: Improvement Exam Cleared
    return {
      level: 2,
      levelTitle: "Status: Retest Cleared (Level 2)",
      currentXp: 1120,
      nextLevelXp: 2000,
      rank: "Status: Needs Attendance Support",
      streaks: [
        { id: "retest", name: "Improvement Exam Cleared", value: "1 Retest", icon: "RotateCcw", color: "#10b981", desc: "Passed Improvement Exam 1 (52/100)" },
        { id: "counsel", name: "Tutorial Classes Attended", value: "4 Sessions", icon: "Zap", color: "#6366f1", desc: "Attended all extra help sessions" },
      ],
      badges: [
        { id: "b1", title: "Improvement Exam 1 Cleared", category: "Academics", icon: "RotateCcw", unlocked: true, date: "Cleared Week 6", desc: "Cleared IAT 1 retest with 52/100.", xp: "+350 XP" },
        { id: "b2", title: "75% Attendance Requirement", category: "Attendance", icon: "ShieldAlert", unlocked: false, date: "Current: 52%", desc: "Must reach 75% attendance for final exam eligibility.", xp: "+500 XP" },
        { id: "b3", title: "Model Lab Pass", category: "Practical", icon: "Terminal", unlocked: true, date: "Passed Month 4", desc: "Scored 58/100 in Model Practical.", xp: "+200 XP" },
      ],
    };
  }

  // Default for Jins, Vikram, Jerish
  return {
    level: 3,
    levelTitle: "Status: On Track (Level 3)",
    currentXp: 2150,
    nextLevelXp: 3000,
    rank: "Status: Regular Passing",
    streaks: [
      { id: "att", name: "Biometric Attendance Streak", value: "18 Days", icon: "Flame", color: "#f97316", desc: "Above 75% cutoff (Current: 79%)" },
      { id: "iat", name: "Internal Exams Cleared", value: "2 Exams", icon: "Award", color: "#6366f1", desc: "Cleared IAT 1 and IAT 2" },
    ],
    badges: [
      { id: "b1", title: "75%+ Attendance Met", category: "Attendance", icon: "ShieldCheck", unlocked: true, date: "Unlocked Week 3", desc: "Attendance safely above 75% minimum.", xp: "+250 XP" },
      { id: "b2", title: "Both IATs Passed", category: "Academics", icon: "CheckCircle2", unlocked: true, date: "Unlocked Month 3", desc: "Passed both internal theory exams.", xp: "+300 XP" },
      { id: "b3", title: "Model Lab Cleared", category: "Practical", icon: "Terminal", unlocked: true, date: "Unlocked Month 4", desc: "Completed practical lab evaluation.", xp: "+250 XP" },
    ],
  };
}

// ============================================================
// 5 STUDENT SIMULATION PROFILES
// ============================================================

export const studentProfiles = [
  {
    id: 1,
    label: "S1: Altrin",
    tag: "Status: Top 1",
    tagColor: "#10b981",
    role: "student",
    name: "Altrin",
    rewards: getStudentRewards(1),

    dashboard: {
      attendance: 98,
      attendanceDelta: "+3.1%",
      attendanceBadge: "success",
      academic: 92,
      academicBadge: "info",
      academicLabel: "Excellent",
      behavior: 95,
      behaviorBadge: "success",
      behaviorLabel: "Exceptional",
      trendAttendance: [95, 96, 97, 98],
      trendAcademic: [88, 90, 91, 92],
      trendBehavior: [92, 93, 94, 95],
      insight: "Outstanding consistency across all metrics! Behavior improved 3% vs last month.",
      attentionSubject: null,
      attentionMsg: null,
    },

    twin: {
      degree: "B.E. Computer Science & Engineering (4 Years / 8 Semesters)",
      currentSemester: 5,
      semesters: getStudentSemesters("altrin", "Altrin"),
      terms: [
        { term: "Semester 1", grade: "A" },
        { term: "Semester 2", grade: "A+" },
        { term: "Semester 3", grade: "A" },
        { term: "Semester 4", grade: "A+" },
        { term: "Semester 5 (Active)", grade: "A+" },
      ],
      selectedTerm: "Semester 5 (Active)",
      grade: "A+",
      attendance: "98%",
      behavior: "Exceptional",
      summary: "Altrin consistently demonstrates excellence across all internal assessments and laboratory exams. Strong conceptual grasp with no improvement exams required.",
    },

    risk: {
      academic: 10,
      attendance: 5,
      behavior: 5,
      trend: [18, 14, 11, 8],
      riskLevel: "Low",
      riskColor: "#10b981",
    },

    alerts: {
      critical: null,
      items: [
        { icon: "BookOpen", title: "Assignment Submitted Early", time: "Today, 8:00 AM", msg: "Physics lab report submitted 2 days before deadline." },
        { icon: "CheckCircle", title: "Perfect Attendance — Week 28", time: "Yesterday", msg: "No absences or late arrivals recorded this week." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 2,
    label: "S2: Jins",
    tag: "Average Student 📊",
    tagColor: "#6366f1",
    role: "student",
    name: "Jins",
    rewards: getStudentRewards(2),

    dashboard: {
      attendance: 79,
      attendanceDelta: "-1.2%",
      attendanceBadge: "warning",
      academic: 65,
      academicBadge: "info",
      academicLabel: "Stable",
      behavior: 72,
      behaviorBadge: "warning",
      behaviorLabel: "Moderate",
      trendAttendance: [82, 80, 79, 79],
      trendAcademic: [68, 65, 65, 65],
      trendBehavior: [75, 73, 72, 72],
      insight: "Performance is steady but showing slight attendance decline. Consistent effort recommended.",
      attentionSubject: "Chemistry",
      attentionMsg: "Chemistry scores dipped 8% this term.",
    },

    twin: {
      degree: "B.E. Computer Science & Engineering (4 Years / 8 Semesters)",
      currentSemester: 5,
      semesters: getStudentSemesters("priya", "Jins"),
      terms: [
        { term: "Semester 1", grade: "B" },
        { term: "Semester 2", grade: "B-" },
        { term: "Semester 3", grade: "B" },
        { term: "Semester 4", grade: "B+" },
        { term: "Semester 5 (Active)", grade: "B" },
      ],
      selectedTerm: "Semester 5 (Active)",
      grade: "B",
      attendance: "79%",
      behavior: "Moderate",
      summary: "Jins demonstrates steady, average performance. Cleared all internals without needing improvement retests, but benefits from additional practice in practical coding.",
    },

    risk: {
      academic: 38,
      attendance: 30,
      behavior: 22,
      trend: [35, 38, 40, 42],
      riskLevel: "Moderate",
      riskColor: "#f59e0b",
    },

    alerts: {
      critical: null,
      items: [
        { icon: "Clock", title: "Attendance Warning", time: "3 days ago", msg: "Attendance dropped below 80% threshold this month." },
        { icon: "BookOpen", title: "Chemistry Mid-term Review", time: "Today, 9:00 AM", msg: "Scheduled review session recommended before final exam." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 3,
    label: "S3: Rethna",
    tag: "High Risk ⚠️",
    tagColor: "#ef4444",
    role: "student",
    name: "Rethna",
    rewards: getStudentRewards(3),

    dashboard: {
      attendance: 52,
      attendanceDelta: "-8.5%",
      attendanceBadge: "danger",
      academic: 38,
      academicBadge: "danger",
      academicLabel: "Critical",
      behavior: 45,
      behaviorBadge: "warning",
      behaviorLabel: "Needs Attention",
      trendAttendance: [70, 62, 56, 52],
      trendAcademic: [50, 45, 40, 38],
      trendBehavior: [58, 52, 48, 45],
      insight: "Significant decline across all metrics. Immediate intervention recommended.",
      attentionSubject: "Math",
      attentionMsg: "Math score dropped 22% over last month. Intervention triggered.",
    },

    twin: {
      degree: "B.E. Computer Science & Engineering (4 Years / 8 Semesters)",
      currentSemester: 5,
      semesters: getStudentSemesters("rahul", "Rethna"),
      terms: [
        { term: "Semester 1", grade: "C" },
        { term: "Semester 2", grade: "C-" },
        { term: "Semester 3", grade: "D+" },
        { term: "Semester 4", grade: "D" },
        { term: "Semester 5 (Active)", grade: "Critical Risk" },
      ],
      selectedTerm: "Semester 5 (Active)",
      grade: "D",
      attendance: "52%",
      behavior: "Needs Attention",
      summary: "Rethna shows critical academic risk. Failed both Internal Exam 1 (IAT 1) and Internal Exam 2 (IAT 2), requiring mandatory Improvement Exams. Borderline attendance puts semester eligibility in jeopardy.",
    },

    risk: {
      academic: 72,
      attendance: 80,
      behavior: 58,
      trend: [55, 62, 70, 78],
      riskLevel: "High",
      riskColor: "#ef4444",
    },

    alerts: {
      critical: {
        badge: "! CRITICAL",
        type: "Academic Risk",
        title: "Failure Risk Detected",
        msg: "Academic performance in Math has declined 22% in 4 weeks. Automated intervention has been triggered. Parent notification sent.",
      },
      items: [
        { icon: "Clock", title: "Attendance Critical — 52%", time: "Today", msg: "Rethna has missed 14 of 30 sessions this month. Detention notice issued." },
        { icon: "AlertCircle", title: "Counsellor Referral Pending", time: "Yesterday, 3:00 PM", msg: "Referred to school counsellor for academic and behavioral assessment." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 4,
    label: "S4: Mukhilan",
    tag: "Recovering 📈",
    tagColor: "#6366f1",
    role: "student",
    name: "Mukhilan",
    rewards: getStudentRewards(4),

    dashboard: {
      attendance: 88,
      attendanceDelta: "+12.0%",
      attendanceBadge: "success",
      academic: 74,
      academicBadge: "info",
      academicLabel: "Improving",
      behavior: 80,
      behaviorBadge: "info",
      behaviorLabel: "Good",
      trendAttendance: [65, 72, 80, 88],
      trendAcademic: [55, 62, 68, 74],
      trendBehavior: [60, 68, 74, 80],
      insight: "Remarkable recovery! Attendance improved +12% and academic scores are on an upward trend after counselling.",
      attentionSubject: "English",
      attentionMsg: "English essay scores still lagging — extra support recommended.",
    },

    twin: {
      degree: "B.E. Computer Science & Engineering (4 Years / 8 Semesters)",
      currentSemester: 5,
      semesters: getStudentSemesters("comeback", "Mukhilan"),
      terms: [
        { term: "Semester 1", grade: "C" },
        { term: "Semester 2", grade: "C+" },
        { term: "Semester 3", grade: "B" },
        { term: "Semester 4", grade: "B+" },
        { term: "Semester 5 (Active)", grade: "A" },
      ],
      selectedTerm: "Semester 5 (Active)",
      grade: "A",
      attendance: "88%",
      behavior: "Good",
      summary: "Mukhilan's digital twin reflects a powerful comeback trajectory. After requiring Improvement Exam 1 in earlier semesters, she surged to 82% in IAT 2 and cleared all practical milestones.",
    },

    risk: {
      academic: 28,
      attendance: 18,
      behavior: 20,
      trend: [65, 55, 40, 28],
      riskLevel: "Low",
      riskColor: "#10b981",
    },

    alerts: {
      critical: null,
      items: [
        { icon: "CheckCircle", title: "Risk Level Downgraded to Low", time: "2 days ago", msg: "Following 6 weeks of improvement, risk classification updated from High → Low." },
        { icon: "BookOpen", title: "English Essay Support Session", time: "Tomorrow, 2:00 PM", msg: "Remedial writing workshop scheduled to address remaining gap." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 5,
    label: "S5: Jerish",
    tag: "Behavioral Risk 🔴",
    tagColor: "#f59e0b",
    role: "student",
    name: "Jerish",
    rewards: getStudentRewards(5),

    dashboard: {
      attendance: 90,
      attendanceDelta: "+0.5%",
      attendanceBadge: "success",
      academic: 81,
      academicBadge: "info",
      academicLabel: "Good",
      behavior: 32,
      behaviorBadge: "danger",
      behaviorLabel: "Critical",
      trendAttendance: [90, 89, 90, 90],
      trendAcademic: [83, 82, 80, 81],
      trendBehavior: [70, 55, 40, 32],
      insight: "Academic and attendance metrics are strong, but behavioral index shows a sharp decline — disciplinary review triggered.",
      attentionSubject: "Behavior",
      attentionMsg: "Behavioral score dropped 38% in 4 weeks — 3 disciplinary incidents recorded.",
    },

    twin: {
      degree: "B.E. Computer Science & Engineering (4 Years / 8 Semesters)",
      currentSemester: 5,
      semesters: getStudentSemesters("vikram", "Jerish"),
      terms: [
        { term: "Semester 1", grade: "A" },
        { term: "Semester 2", grade: "A" },
        { term: "Semester 3", grade: "A-" },
        { term: "Semester 4", grade: "B+" },
        { term: "Semester 5 (Active)", grade: "B+" },
      ],
      selectedTerm: "Semester 5 (Active)",
      grade: "B+",
      attendance: "90%",
      behavior: "Critical",
      summary: "Strong theoretical performance in both internal assessments (no improvement exams needed), but recent lab and behavioral incidents triggered disciplinary flags.",
    },

    risk: {
      academic: 15,
      attendance: 10,
      behavior: 75,
      trend: [30, 42, 58, 72],
      riskLevel: "High",
      riskColor: "#ef4444",
    },

    alerts: {
      critical: {
        badge: "! CRITICAL",
        type: "Behavioral",
        title: "Disciplinary Action Required",
        msg: "Three behavioral incidents recorded in 2 weeks. Behavior index at 32/100. Automatic escalation to teacher and parent.",
      },
      items: [
        { icon: "AlertCircle", title: "Disciplinary Incident — Lab Class", time: "Today, 11:00 AM", msg: "Disruption reported during Physics lab. Third incident this month." },
        { icon: "Clock", title: "Parent Meeting Scheduled", time: "Tomorrow, 4:00 PM", msg: "Mandatory parent-teacher meeting has been triggered by the system." },
      ],
    },
  },
];
