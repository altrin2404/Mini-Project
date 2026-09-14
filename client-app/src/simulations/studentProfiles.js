// ============================================================
// 5 STUDENT SIMULATION PROFILES
// ============================================================

export const studentProfiles = [
  {
    id: 1,
    label: "S1: Arjun Sharma",
    tag: "Star Performer 🌟",
    tagColor: "#10b981",
    role: "student",
    name: "Arjun Sharma",

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
      trendAcademic:  [88, 90, 91, 92],
      trendBehavior:  [92, 93, 94, 95],
      insight: "Outstanding consistency across all metrics! Behavior improved 3% vs last month.",
      attentionSubject: null,
      attentionMsg: null,
    },

    twin: {
      terms: [
        { term: "Term 1, 2023", grade: "A" },
        { term: "Term 2, 2023", grade: "A+" },
        { term: "Term 3, 2023", grade: "A" },
        { term: "Term 4, 2023", grade: "A+" },
        { term: "Term 1, 2024", grade: "A+" },
      ],
      selectedTerm: "Term 1, 2024",
      grade: "A+",
      attendance: "98%",
      behavior: "Exceptional",
      summary: "Arjun consistently demonstrates excellence. Strong conceptual grasp across all subjects with active classroom participation.",
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
    label: "S2: Priya Mehta",
    tag: "Average Student 📊",
    tagColor: "#6366f1",
    role: "student",
    name: "Priya Mehta",

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
      trendAcademic:  [68, 65, 65, 65],
      trendBehavior:  [75, 73, 72, 72],
      insight: "Performance is steady but showing slight attendance decline. Consistent effort recommended.",
      attentionSubject: "Chemistry",
      attentionMsg: "Chemistry scores dipped 8% this term.",
    },

    twin: {
      terms: [
        { term: "Term 1, 2023", grade: "B" },
        { term: "Term 2, 2023", grade: "B-" },
        { term: "Term 3, 2023", grade: "B" },
        { term: "Term 4, 2023", grade: "B+" },
        { term: "Term 1, 2024", grade: "B" },
      ],
      selectedTerm: "Term 1, 2024",
      grade: "B",
      attendance: "79%",
      behavior: "Moderate",
      summary: "Priya demonstrates average performance. Consistent effort but struggles with concept application in Science subjects.",
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
    label: "S3: Rahul Kumar",
    tag: "High Risk ⚠️",
    tagColor: "#ef4444",
    role: "student",
    name: "Rahul Kumar",

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
      trendAcademic:  [50, 45, 40, 38],
      trendBehavior:  [58, 52, 48, 45],
      insight: "Significant decline across all metrics. Immediate intervention recommended.",
      attentionSubject: "Math",
      attentionMsg: "Math score dropped 22% over last month. Intervention triggered.",
    },

    twin: {
      terms: [
        { term: "Term 1, 2023", grade: "C+" },
        { term: "Term 2, 2023", grade: "C" },
        { term: "Term 3, 2023", grade: "C-" },
        { term: "Term 4, 2023", grade: "D+" },
        { term: "Term 1, 2024", grade: "D" },
      ],
      selectedTerm: "Term 1, 2024",
      grade: "D",
      attendance: "52%",
      behavior: "Needs Attention",
      summary: "Rahul shows a consistent downward trajectory. Multiple absences and low academic scores indicate urgent need for counselling and parental involvement.",
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
        { icon: "Clock", title: "Attendance Critical — 52%", time: "Today", msg: "Rahul has missed 14 of 30 sessions this month. Detention notice issued." },
        { icon: "AlertCircle", title: "Counsellor Referral Pending", time: "Yesterday, 3:00 PM", msg: "Referred to school counsellor for academic and behavioral assessment." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 4,
    label: "S4: Ananya Singh",
    tag: "Recovering 📈",
    tagColor: "#6366f1",
    role: "student",
    name: "Ananya Singh",

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
      trendAcademic:  [55, 62, 68, 74],
      trendBehavior:  [60, 68, 74, 80],
      insight: "Remarkable recovery! Attendance improved +12% and academic scores are on an upward trend after counselling.",
      attentionSubject: "English",
      attentionMsg: "English essay scores still lagging — extra support recommended.",
    },

    twin: {
      terms: [
        { term: "Term 1, 2023", grade: "D+" },
        { term: "Term 2, 2023", grade: "C" },
        { term: "Term 3, 2023", grade: "C+" },
        { term: "Term 4, 2023", grade: "B-" },
        { term: "Term 1, 2024", grade: "B" },
      ],
      selectedTerm: "Term 1, 2024",
      grade: "B",
      attendance: "88%",
      behavior: "Good",
      summary: "Ananya's digital twin reflects a strong recovery arc. Post-intervention data shows consistent improvement in all three tracked dimensions.",
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
    label: "S5: Dev Patel",
    tag: "Behavioral Risk 🔴",
    tagColor: "#f59e0b",
    role: "student",
    name: "Dev Patel",

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
      trendAcademic:  [83, 82, 80, 81],
      trendBehavior:  [70, 55, 40, 32],
      insight: "Academic and attendance metrics are strong, but behavioral index shows a sharp decline — disciplinary review triggered.",
      attentionSubject: "Behavior",
      attentionMsg: "Behavioral score dropped 38% in 4 weeks — 3 disciplinary incidents recorded.",
    },

    twin: {
      terms: [
        { term: "Term 1, 2023", grade: "A-" },
        { term: "Term 2, 2023", grade: "B+" },
        { term: "Term 3, 2023", grade: "A" },
        { term: "Term 4, 2023", grade: "A-" },
        { term: "Term 1, 2024", grade: "B+" },
      ],
      selectedTerm: "Term 1, 2024",
      grade: "B+",
      attendance: "90%",
      behavior: "Critical",
      summary: "Dev's academic record is strong, but recent behavioral incidents have flagged the twin for disciplinary monitoring. No academic risk — behavioral intervention is the focus.",
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
