import { getStudentSemesters } from "./engineeringSemesters";

// ============================================================
// 5 PARENT SIMULATION PROFILES
// ============================================================

export const parentProfiles = [
  {
    id: 1,
    label: "P1: Parent of Altrin",
    tag: "All Clear 🟢",
    tagColor: "#10b981",
    role: "parent",
    childName: "Altrin",

    dashboard: {
      systemAlerts: [],
      twinStability: "99%",
      twinStatus: "Excellent",
      twinStatusColor: "#10b981",
      updateMsg: "Altrin's Digital Twin has been updated with new assessment data. Overall stability remains at 99%. No action required.",
    },

    childTwin: {
      overallStatus: "Excellent",
      statusColor: "#10b981",
      lastUpdated: "Today, 8:45 AM",
      academicBars: [75, 85, 92, 98],
      academicNote: "Consistent top-tier performance across all subjects. Term finals expected to be outstanding.",
      emotionalBars: [80, 82, 88, 90],
      emotionalNote: "Mood and social interaction remain high and stable. Positive peer relationships observed.",
    },

    reports: {
      semesters: getStudentSemesters("altrin", "Altrin"),
      terms: [
        { term: "Semester 1", grade: "A" },
        { term: "Semester 2", grade: "A+" },
        { term: "Semester 3", grade: "A" },
        { term: "Semester 4", grade: "A+" },
        { term: "Semester 5 (Active)", grade: "A+" },
      ],
      selectedGrade: "A+",
      attendance: "98%",
      behavior: "Exceptional",
      summary: "Altrin continues to perform at the highest level across all internals and practicals. Active participant in all technical seminars.",
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 2,
    label: "P2: Parent of Rethna",
    tag: "Urgent Action ❗",
    tagColor: "#ef4444",
    role: "parent",
    childName: "Rethna",

    dashboard: {
      systemAlerts: [
        {
          id: "a1",
          type: "Critical",
          title: "Failure Risk Detected — Math",
          message: "Rethna's Math performance has declined by 22% over the last 4 weeks. Automated intervention has been triggered. Please schedule a parent-teacher meeting immediately.",
        },
        {
          id: "a2",
          type: "Warning",
          title: "Attendance Below Threshold",
          message: "Attendance rate is at 52%. School policy requires minimum 75%. Continued absence may affect exam eligibility.",
        },
      ],
      twinStability: "32%",
      twinStatus: "Critical",
      twinStatusColor: "#ef4444",
      updateMsg: "Rethna's Digital Twin flags multiple risk indicators. Immediate parental engagement is required.",
    },

    childTwin: {
      overallStatus: "Critical",
      statusColor: "#ef4444",
      lastUpdated: "Today, 9:00 AM",
      academicBars: [55, 45, 40, 38],
      academicNote: "Academic scores declining sharply. Failing threshold reached in 2 subjects.",
      emotionalBars: [50, 45, 38, 30],
      emotionalNote: "Low engagement and reduced social interaction detected. Counsellor has been notified.",
    },

    reports: {
      terms: [
        { term: "Term 1, 2023", grade: "C+" },
        { term: "Term 2, 2023", grade: "C" },
        { term: "Term 3, 2023", grade: "C-" },
        { term: "Term 4, 2023", grade: "D+" },
        { term: "Term 1, 2024", grade: "D" },
      ],
      selectedGrade: "D",
      attendance: "52%",
      behavior: "Needs Attention",
      summary: "Rethna's performance has been on a consistent downtrend. Immediate academic support and counselling have been recommended by the school.",
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 3,
    label: "P3: Parent of Jins",
    tag: "Needs Monitoring 🟡",
    tagColor: "#f59e0b",
    role: "parent",
    childName: "Jins",

    dashboard: {
      systemAlerts: [
        {
          id: "a1",
          type: "Warning",
          title: "Attendance Approaching Threshold",
          message: "Jins's attendance has dropped to 79%, nearing the 75% minimum. Please ensure regular school attendance.",
        },
      ],
      twinStability: "68%",
      twinStatus: "Moderate",
      twinStatusColor: "#f59e0b",
      updateMsg: "Jins's Digital Twin shows stable but slightly declining metrics. A parent check-in is recommended within the week.",
    },

    childTwin: {
      overallStatus: "Moderate",
      statusColor: "#f59e0b",
      lastUpdated: "Yesterday, 5:30 PM",
      academicBars: [68, 66, 65, 65],
      academicNote: "Performance is stable. Chemistry subject needs extra attention before final exams.",
      emotionalBars: [72, 70, 72, 71],
      emotionalNote: "Emotional well-being is stable. No concerns flagged by homeroom teacher.",
    },

    reports: {
      terms: [
        { term: "Term 1, 2023", grade: "B" },
        { term: "Term 2, 2023", grade: "B-" },
        { term: "Term 3, 2023", grade: "B" },
        { term: "Term 4, 2023", grade: "B+" },
        { term: "Term 1, 2024", grade: "B" },
      ],
      selectedGrade: "B",
      attendance: "79%",
      behavior: "Moderate",
      summary: "Jins maintains a consistent average performance. Science subjects show slight decline; parental encouragement at home is recommended.",
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 4,
    label: "P4: Parent of Mukhilan",
    tag: "Great Progress 📈",
    tagColor: "#6366f1",
    role: "parent",
    childName: "Mukhilan",

    dashboard: {
      systemAlerts: [],
      twinStability: "85%",
      twinStatus: "Improving",
      twinStatusColor: "#6366f1",
      updateMsg: "Mukhilan's Digital Twin reflects a strong positive recovery. Risk level downgraded from High to Low. Excellent progress — keep up the support!",
    },

    childTwin: {
      overallStatus: "Improving",
      statusColor: "#6366f1",
      lastUpdated: "Today, 10:15 AM",
      academicBars: [40, 55, 65, 74],
      academicNote: "Steady academic improvement following counselling and intervention. English still needs focus.",
      emotionalBars: [45, 55, 68, 78],
      emotionalNote: "Significant improvement in emotional well-being. More positive social interactions observed.",
    },

    reports: {
      terms: [
        { term: "Term 1, 2023", grade: "D+" },
        { term: "Term 2, 2023", grade: "C" },
        { term: "Term 3, 2023", grade: "C+" },
        { term: "Term 4, 2023", grade: "B-" },
        { term: "Term 1, 2024", grade: "B" },
      ],
      selectedGrade: "B",
      attendance: "88%",
      behavior: "Good",
      summary: "Mukhilan's academic trajectory is now positive after a difficult start. The improvement plan has been effective. Continued home support will help consolidate these gains.",
    },
  },

  // ─────────────────────────────────────────────────────────
  {
    id: 5,
    label: "P5: Parent of Jerish",
    tag: "Behavioral Alert 🔴",
    tagColor: "#f59e0b",
    role: "parent",
    childName: "Jerish",

    dashboard: {
      systemAlerts: [
        {
          id: "a1",
          type: "Critical",
          title: "Behavioral Incident — Escalation Required",
          message: "Jerish has had 3 behavioral incidents in 2 weeks. A mandatory parent-teacher meeting has been scheduled for tomorrow at 4:00 PM. Please confirm attendance.",
        },
      ],
      twinStability: "72%",
      twinStatus: "At Risk (Behavioral)",
      twinStatusColor: "#f59e0b",
      updateMsg: "Jerish's Digital Twin shows strong academic metrics but critical behavioral flags. Your prompt engagement will help resolve this quickly.",
    },

    childTwin: {
      overallStatus: "At Risk",
      statusColor: "#f59e0b",
      lastUpdated: "Today, 11:30 AM",
      academicBars: [83, 82, 80, 81],
      academicNote: "Academic performance remains strong across all subjects. No academic risk identified.",
      emotionalBars: [70, 55, 42, 32],
      emotionalNote: "Sharp decline in emotional self-regulation. Counsellor has been engaged. Peer conflict may be a contributing factor.",
    },

    reports: {
      terms: [
        { term: "Term 1, 2023", grade: "A-" },
        { term: "Term 2, 2023", grade: "B+" },
        { term: "Term 3, 2023", grade: "A" },
        { term: "Term 4, 2023", grade: "A-" },
        { term: "Term 1, 2024", grade: "B+" },
      ],
      selectedGrade: "B+",
      attendance: "90%",
      behavior: "Critical",
      summary: "Jerish's academic record is strong with consistent A-range grades. The current concern is purely behavioral. Parental engagement and counsellor support are the recommended interventions.",
    },
  },
];
