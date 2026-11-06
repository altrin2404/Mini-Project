// ============================================================
// ENGINEERING COLLEGE 4-YEAR / 8-SEMESTER ACADEMIC CURRICULUM
// Flow per semester:
// 1. Start of Semester
// 2. Internal Exam 1 (IAT 1) & Assessment 1 (if failed -> Improvement Exam 1)
// 3. Internal Exam 2 (IAT 2) & Assessment 2 (if failed -> Improvement Exam 2)
// 4. Model Practical Examination
// 5. End Semester Practical Examination
// 6. End Semester Theory Examination
// ============================================================

export function getStudentSemesters(studentKey, studentName) {
  const years = [
    { year: 1, name: "Year 1 (Freshman)", sems: [1, 2] },
    { year: 2, name: "Year 2 (Sophomore)", sems: [3, 4] },
    { year: 3, name: "Year 3 (Junior - Current)", sems: [5, 6] },
    { year: 4, name: "Year 4 (Senior - Final)", sems: [7, 8] },
  ];

  // Base configurations by student type
  const profilesData = {
    // S1: Altrin (Star Performer)
    altrin: {
      gpas: [8.9, 9.1, 9.0, 9.3, 9.4, 0, 0, 0],
      grades: ["A", "A+", "A", "A+", "A+", "-", "-", "-"],
      attendances: ["96%", "97%", "98%", "98%", "98%", "-", "-", "-"],
      behaviors: ["Exceptional", "Exceptional", "Exceptional", "Exceptional", "Exceptional", "-", "-", "-"],
      currentSem: 5,
      getMilestones: (semNum) => {
        const isPast = semNum < 5;
        const isCurrent = semNum === 5;
        return [
          {
            id: "kickoff",
            index: 1,
            title: "Start of Semester",
            type: "Registration",
            status: "Completed",
            badgeColor: "#10b981",
            details: "Enrolled in all semester courses and received subject syllabus.",
            metrics: { attendanceRequirement: "75% Min", enrolledCredits: 24 },
          },
          {
            id: "iat1",
            index: 2,
            title: "Internal Exam 1 (IAT 1)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 1",
            score: isCurrent ? 94 : 88 + semNum,
            maxScore: 100,
            passScore: 50,
            status: "Cleared Distinction",
            badgeColor: "#10b981",
            improvementExam: null, // Passed cleanly!
            details: "Covered Unit 1 & Unit 2 with top marks.",
          },
          {
            id: "iat2",
            index: 3,
            title: "Internal Exam 2 (IAT 2)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 2",
            score: isCurrent ? 96 : 90 + semNum,
            maxScore: 100,
            passScore: 50,
            status: "Cleared Distinction",
            badgeColor: "#10b981",
            improvementExam: null, // Passed cleanly!
            details: "Covered Unit 3, 4 & 5 with excellent marks.",
          },
          {
            id: "model_practical",
            index: 4,
            title: "Model Practical Examination",
            type: "Internal Laboratory",
            score: isCurrent ? 97 : 94,
            maxScore: 100,
            passScore: 50,
            status: isCurrent ? "Completed" : "Completed",
            badgeColor: "#10b981",
            details: "Completed internal lab experiments and viva with full marks.",
          },
          {
            id: "end_practical",
            index: 5,
            title: "End Semester Practical Exam",
            type: "External University Lab",
            score: isCurrent ? 96 : 95,
            maxScore: 100,
            passScore: 50,
            status: isCurrent ? "Evaluated" : "Completed",
            badgeColor: "#10b981",
            details: "Cleared university practical lab exam and viva with distinction.",
          },
          {
            id: "end_theory",
            index: 6,
            title: "End Semester Theory Exam",
            type: "University Final Board",
            score: isCurrent ? 93 : 92,
            maxScore: 100,
            passScore: 45,
            grade: "A+",
            status: isCurrent ? "Finalizing" : "Completed",
            badgeColor: "#10b981",
            details: "Cleared university theory board exam across all subjects.",
          },
        ];
      },
    },

    // S3: Rethna (High Risk - Multiple Failures & Improvement Exams)
    rahul: {
      gpas: [6.2, 5.8, 5.4, 4.8, 4.5, 0, 0, 0],
      grades: ["C", "C-", "D+", "D", "Critical Risk", "-", "-", "-"],
      attendances: ["78%", "72%", "65%", "58%", "52%", "-", "-", "-"],
      behaviors: ["Moderate", "Moderate", "Needs Attention", "Critical", "Needs Attention", "-", "-", "-"],
      currentSem: 5,
      getMilestones: (semNum) => {
        const isCurrent = semNum === 5;
        return [
          {
            id: "kickoff",
            index: 1,
            title: "Start of Semester",
            type: "Registration",
            status: "Completed",
            badgeColor: "#10b981",
            details: "Registered with mandatory academic probation warning.",
            metrics: { attendanceRequirement: "75% Min", warningIssued: true },
          },
          {
            id: "iat1",
            index: 2,
            title: "Internal Exam 1 (IAT 1)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 1",
            score: isCurrent ? 32 : 36,
            maxScore: 100,
            passScore: 50,
            status: "Failed (< 50%) ⚠️",
            badgeColor: "#ef4444",
            improvementExam: {
              title: "Improvement Exam 1 (IAT 1 Retest)",
              triggered: true,
              score: 52,
              maxScore: 100,
              status: "Marginal Retest Pass",
              badgeColor: "#f59e0b",
              note: "Mandatory re-evaluation scheduled after remedial counselling sessions.",
            },
            details: "Scored 32/100 in core theory. Automatically routed to Improvement Exam 1.",
          },
          {
            id: "iat2",
            index: 3,
            title: "Internal Exam 2 (IAT 2)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 2",
            score: isCurrent ? 38 : 42,
            maxScore: 100,
            passScore: 50,
            status: "Failed (< 50%) ⚠️",
            badgeColor: "#ef4444",
            improvementExam: {
              title: "Improvement Exam 2 (IAT 2 Retest)",
              triggered: true,
              score: 50,
              maxScore: 100,
              status: "Cleared on Retest",
              badgeColor: "#f59e0b",
              note: "Attended special tutorial sessions before clearing the improvement exam.",
            },
            details: "Failed second assessment. Improvement Exam 2 was required to meet internal credit eligibility.",
          },
          {
            id: "model_practical",
            index: 4,
            title: "Model Practical Examination",
            type: "Internal Laboratory",
            score: isCurrent ? 58 : 60,
            maxScore: 100,
            passScore: 50,
            status: "Borderline Pass",
            badgeColor: "#f59e0b",
            details: "Record submission delayed. Viva answers lacked depth.",
          },
          {
            id: "end_practical",
            index: 5,
            title: "End Semester Practical Exam",
            type: "External University Lab",
            score: isCurrent ? 54 : 56,
            maxScore: 100,
            passScore: 50,
            status: "Passed",
            badgeColor: "#10b981",
            details: "Lab practical completed under external supervision.",
          },
          {
            id: "end_theory",
            index: 6,
            title: "End Semester Theory Exam",
            type: "University Final Board",
            score: isCurrent ? 46 : 48,
            maxScore: 100,
            passScore: 45,
            grade: "D",
            status: isCurrent ? "At High Risk" : "Completed",
            badgeColor: "#ef4444",
            details: "High probability of arrear / backlog predicted by the Digital Twin AI.",
          },
        ];
      },
    },

    // S2: Jins (Average Student)
    priya: {
      gpas: [7.2, 7.0, 6.8, 7.1, 7.0, 0, 0, 0],
      grades: ["B", "B-", "B", "B+", "B", "-", "-", "-"],
      attendances: ["82%", "80%", "79%", "79%", "79%", "-", "-", "-"],
      behaviors: ["Moderate", "Moderate", "Moderate", "Moderate", "Moderate", "-", "-", "-"],
      currentSem: 5,
      getMilestones: (semNum) => [
        {
          id: "kickoff",
          index: 1,
          title: "Start of Semester",
          type: "Registration",
          status: "Completed",
          badgeColor: "#10b981",
          details: "Normal registration without pending obligations.",
        },
        {
          id: "iat1",
          index: 2,
          title: "Internal Exam 1 (IAT 1)",
          type: "Theory Assessment",
          assessment: "Continuous Assessment 1",
          score: 65,
          maxScore: 100,
          passScore: 50,
          status: "Passed",
          badgeColor: "#6366f1",
          improvementExam: null,
          details: "Consistent mid-range performance. No improvement exam required.",
        },
        {
          id: "iat2",
          index: 3,
          title: "Internal Exam 2 (IAT 2)",
          type: "Theory Assessment",
          assessment: "Continuous Assessment 2",
          score: 68,
          maxScore: 100,
          passScore: 50,
          status: "Passed",
          badgeColor: "#6366f1",
          improvementExam: null,
          details: "Passed smoothly without needing re-assessment.",
        },
        {
          id: "model_practical",
          index: 4,
          title: "Model Practical Examination",
          type: "Internal Laboratory",
          score: 75,
          maxScore: 100,
          passScore: 50,
          status: "Completed",
          badgeColor: "#10b981",
          details: "Good lab manual upkeep and regular experiment execution.",
        },
        {
          id: "end_practical",
          index: 5,
          title: "End Semester Practical Exam",
          type: "External University Lab",
          score: 78,
          maxScore: 100,
          passScore: 50,
          status: "Completed",
          badgeColor: "#10b981",
          details: "External lab viva completed with solid performance.",
        },
        {
          id: "end_theory",
          index: 6,
          title: "End Semester Theory Exam",
          type: "University Final Board",
          score: 69,
          maxScore: 100,
          passScore: 45,
          grade: "B",
          status: "Completed",
          badgeColor: "#6366f1",
          details: "Stable academic output across all core engineering papers.",
        },
      ],
    },

    // S4: Sneha / Mukhilan (Comeback Kid - Fails early then recovers)
    comeback: {
      gpas: [6.0, 6.5, 7.0, 7.6, 8.2, 0, 0, 0],
      grades: ["C", "C+", "B", "B+", "A", "-", "-", "-"],
      attendances: ["68%", "74%", "80%", "85%", "88%", "-", "-", "-"],
      behaviors: ["Moderate", "Moderate", "Good", "Good", "Exceptional", "-", "-", "-"],
      currentSem: 5,
      getMilestones: (semNum) => {
        const hasImprovement = semNum <= 3;
        return [
          {
            id: "kickoff",
            index: 1,
            title: "Start of Semester",
            type: "Registration",
            status: "Completed",
            badgeColor: "#10b981",
            details: "Orientation and academic goal setting completed.",
          },
          {
            id: "iat1",
            index: 2,
            title: "Internal Exam 1 (IAT 1)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 1",
            score: hasImprovement ? 44 : 76,
            maxScore: 100,
            passScore: 50,
            status: hasImprovement ? "Failed (< 50%)" : "Passed",
            badgeColor: hasImprovement ? "#ef4444" : "#10b981",
            improvementExam: hasImprovement ? {
              title: "Improvement Exam 1 (IAT 1 Retest)",
              triggered: true,
              score: 72,
              maxScore: 100,
              status: "Strong Recovery (+28 pts)",
              badgeColor: "#10b981",
              note: "Dramatic score leap achieved through peer tutoring.",
            } : null,
            details: hasImprovement ? "Initial struggle followed by successful improvement exam." : "Solid first internal assessment.",
          },
          {
            id: "iat2",
            index: 3,
            title: "Internal Exam 2 (IAT 2)",
            type: "Theory Assessment",
            assessment: "Continuous Assessment 2",
            score: 82,
            maxScore: 100,
            passScore: 50,
            status: "Passed With Merit",
            badgeColor: "#10b981",
            improvementExam: null,
            details: "No improvement exam needed — performance surged after counselling.",
          },
          {
            id: "model_practical",
            index: 4,
            title: "Model Practical Examination",
            type: "Internal Laboratory",
            score: 85,
            maxScore: 100,
            passScore: 50,
            status: "Completed",
            badgeColor: "#10b981",
            details: "Demonstrated excellent lab coding skills.",
          },
          {
            id: "end_practical",
            index: 5,
            title: "End Semester Practical Exam",
            type: "External University Lab",
            score: 88,
            maxScore: 100,
            passScore: 50,
            status: "Completed",
            badgeColor: "#10b981",
            details: "Strong external evaluation in laboratory practices.",
          },
          {
            id: "end_theory",
            index: 6,
            title: "End Semester Theory Exam",
            type: "University Final Board",
            score: 81,
            maxScore: 100,
            passScore: 45,
            grade: "A",
            status: "Completed",
            badgeColor: "#10b981",
            details: "Remarkable comeback documented across semester results.",
          },
        ];
      },
    },

    // S5: Vikram (Behavioral Drift)
    vikram: {
      gpas: [8.5, 8.4, 8.2, 8.0, 7.8, 0, 0, 0],
      grades: ["A", "A", "A-", "B+", "B+", "-", "-", "-"],
      attendances: ["92%", "90%", "89%", "90%", "90%", "-", "-", "-"],
      behaviors: ["Good", "Good", "Moderate", "Warning", "Critical", "-", "-", "-"],
      currentSem: 5,
      getMilestones: (semNum) => [
        {
          id: "kickoff",
          index: 1,
          title: "Start of Semester",
          type: "Registration",
          status: "Completed",
          badgeColor: "#10b981",
          details: "Course registration complete.",
        },
        {
          id: "iat1",
          index: 2,
          title: "Internal Exam 1 (IAT 1)",
          type: "Theory Assessment",
          assessment: "Continuous Assessment 1",
          score: 82,
          maxScore: 100,
          passScore: 50,
          status: "Passed",
          badgeColor: "#10b981",
          improvementExam: null,
          details: "Good conceptual grasp, cleared without re-assessment.",
        },
        {
          id: "iat2",
          index: 3,
          title: "Internal Exam 2 (IAT 2)",
          type: "Theory Assessment",
          assessment: "Continuous Assessment 2",
          score: 80,
          maxScore: 100,
          passScore: 50,
          status: "Passed",
          badgeColor: "#10b981",
          improvementExam: null,
          details: "Passed comfortably, but behavioral flags noticed in group assignments.",
        },
        {
          id: "model_practical",
          index: 4,
          title: "Model Practical Examination",
          type: "Internal Laboratory",
          score: 72,
          maxScore: 100,
          passScore: 50,
          status: "Disciplinary Flag",
          badgeColor: "#ef4444",
          details: "Lab protocol disruption recorded during model practical sessions.",
        },
        {
          id: "end_practical",
          index: 5,
          title: "End Semester Practical Exam",
          type: "External University Lab",
          score: 76,
          maxScore: 100,
          passScore: 50,
          status: "Completed Under Review",
          badgeColor: "#f59e0b",
          details: "Practical completed with Proctor oversight.",
        },
        {
          id: "end_theory",
          index: 6,
          title: "End Semester Theory Exam",
          type: "University Final Board",
          score: 79,
          maxScore: 100,
          passScore: 45,
          grade: "B+",
          status: "Completed",
          badgeColor: "#10b981",
          details: "Strong academic capacity, with twin AI highlighting behavioral risk intervention.",
        },
      ],
    },
  };

  const selectedConfig = profilesData[studentKey] || profilesData.altrin;

  // Build the 8 semesters
  const allSemesters = [];
  for (let sem = 1; sem <= 8; sem++) {
    const yearIndex = Math.ceil(sem / 2);
    const semInYear = ((sem - 1) % 2) + 1;
    const yearObj = years[yearIndex - 1];

    const isCompleted = sem < selectedConfig.currentSem;
    const isCurrent = sem === selectedConfig.currentSem;
    const isUpcoming = sem > selectedConfig.currentSem;

    const gpa = selectedConfig.gpas[sem - 1];
    const grade = selectedConfig.grades[sem - 1];
    const attendance = selectedConfig.attendances[sem - 1];
    const behavior = selectedConfig.behaviors[sem - 1];

    allSemesters.push({
      semNumber: sem,
      yearNumber: yearIndex,
      yearName: `Year ${yearIndex}`,
      title: `Semester ${sem}`,
      subtitle: `Year ${yearIndex} • Semester ${semInYear}`,
      status: isCurrent ? "Active (Current)" : isCompleted ? "Completed" : "Upcoming",
      statusBadge: isCurrent ? "active" : isCompleted ? "completed" : "upcoming",
      gpa: gpa || (isUpcoming ? "--" : "Pending"),
      grade: grade || (isUpcoming ? "--" : "In Progress"),
      attendance: attendance || (isUpcoming ? "--" : "In Progress"),
      behavior: behavior || (isUpcoming ? "--" : "In Progress"),
      summary: isUpcoming
        ? `Semester ${sem} curriculum commences in the next academic calendar.`
        : `${studentName}'s performance across Semester ${sem}: ${grade} Grade (${gpa} GPA) with ${attendance} attendance.`,
      milestones: selectedConfig.getMilestones(sem),
    });
  }

  return allSemesters;
}
