import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { studentProfiles } from "../simulations/studentProfiles";
import { parentProfiles } from "../simulations/parentProfiles";
import { teacherProfiles } from "../simulations/teacherProfiles";

const SimContext = createContext(null);

export function SimulationProvider({ children }) {
  const [activeRole, setActiveRole] = useState("student"); // "student" | "teacher" | "parent"
  const [studentIdx, setStudentIdx] = useState(0);
  const [parentIdx, setParentIdx]   = useState(0);
  const [teacherIdx, setTeacherIdx] = useState(0);
  const [customStudent, setCustomStudent] = useState(null);

  // Editable student state for teacher mark entry interactions
  const [studentsList, setStudentsList] = useState(teacherProfiles[0].students);

  const syncStudentFromToken = (token) => {
    if (!token) {
      setCustomStudent(null);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "student") {
        const name = (decoded.name || "").toLowerCase();
        const email = (decoded.email || "").toLowerCase();
        const id = decoded.sub || "";

        // Check 1: Match against the 5 detailed simulation profiles
        if (name.includes("rethna") || email.includes("4016") || email.includes("rethna")) {
          setStudentIdx(2); // Rethna Kumar (High Risk)
          setCustomStudent(null);
          return;
        }
        if (name.includes("jins") || email.includes("4008") || email.includes("jins")) {
          setStudentIdx(1); // Jins Mathew (Moderate Risk)
          setCustomStudent(null);
          return;
        }
        if (name.includes("mukhilan") || email.includes("4014") || email.includes("mukhilan")) {
          setStudentIdx(3); // Mukhilan (Recovering)
          setCustomStudent(null);
          return;
        }
        if (name.includes("jerish") || email.includes("4020") || email.includes("jerish")) {
          setStudentIdx(4); // Jerish (Behavioral Risk)
          setCustomStudent(null);
          return;
        }
        if (name.includes("altrin") || email.includes("4001") || email.includes("altrin")) {
          setStudentIdx(0); // Altrin (Top Achiever)
          setCustomStudent(null);
          return;
        }

        // Check 2: Match any other student in the cohort (e.g. Kevin Anto, Dennis Joseph, UCI students)
        const cleanName = decoded.name || `Student ${id}`;
        const isCritical = email.includes("4000") || email.includes("4018") || email.includes("4019");
        const isWarning = email.includes("4015") || email.includes("4012") || email.includes("4013");
        
        const template = studentProfiles[0];
        setCustomStudent({
          ...template,
          id: id,
          name: cleanName,
          label: cleanName,
          role: "student",
          dashboard: {
            ...template.dashboard,
            attendance: email.includes("4015") ? 68.5 : (isCritical ? 56 : 88),
            academic: email.includes("4015") ? 83.5 : (isCritical ? 36 : 82),
            behavior: isCritical ? 65 : 88,
            insight: `Digital Twin telemetrics active for ${cleanName}. Performance models synchronized.`,
          },
          twin: {
            ...template.twin,
            attendance: `${email.includes("4015") ? 68.5 : (isCritical ? 56 : 88)}%`,
            grade: isCritical ? "D" : (isWarning ? "B" : "A"),
            summary: `Real-time Digital Twin profile for ${cleanName} (Reg: ${id}). Assessment trajectory continuously monitored.`,
          },
          risk: {
            ...template.risk,
            riskLevel: isCritical ? "High" : (isWarning ? "Moderate" : "Low"),
            riskColor: isCritical ? "#ef4444" : (isWarning ? "#f59e0b" : "#10b981")
          }
        });
      }
    } catch (e) {
      console.warn("Could not sync student from token:", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      syncStudentFromToken(token);
    }
  }, []);

  const activeStudent = customStudent || studentProfiles[studentIdx];
  const activeParent  = parentProfiles[parentIdx];
  const activeTeacher = {
    ...teacherProfiles[teacherIdx],
    students: studentsList,
  };

  const updateStudentMarks = (id, newMarks) => {
    setStudentsList(prev =>
      prev.map(st => {
        if (st.id === id) {
          const updatedIat1 = newMarks.iat1 !== undefined ? newMarks.iat1 : st.iat1;
          const updatedIat2 = newMarks.iat2 !== undefined ? newMarks.iat2 : st.iat2;
          const updatedLab = newMarks.modelPractical !== undefined ? newMarks.modelPractical : st.modelPractical;
          const avg = Math.round((updatedIat1 + updatedIat2 + updatedLab) / 3);
          const newRisk = avg < 50 ? "High" : avg < 70 ? "Moderate" : "Low";
          return {
            ...st,
            iat1: updatedIat1,
            iat2: updatedIat2,
            modelPractical: updatedLab,
            risk: newRisk,
            status: avg >= 80 ? "Distinction Track" : avg >= 50 ? "Passing Track" : "Improvement Exam Required",
          };
        }
        return st;
      })
    );
  };

  const scheduleImprovementExam = (id) => {
    setStudentsList(prev =>
      prev.map(st =>
        st.id === id
          ? {
              ...st,
              hasImprovement: true,
              improvementNote: "Improvement Retest scheduled by Faculty Mentor.",
              status: "Improvement Retest Scheduled 🔄",
            }
          : st
      )
    );
  };

  return (
    <SimContext.Provider value={{
      activeRole, setActiveRole,
      studentIdx, setStudentIdx,
      parentIdx,  setParentIdx,
      teacherIdx, setTeacherIdx,
      activeStudent,
      activeParent,
      activeTeacher,
      studentProfiles,
      parentProfiles,
      teacherProfiles,
      updateStudentMarks,
      scheduleImprovementExam,
      syncStudentFromToken,
    }}>
      {children}
    </SimContext.Provider>
  );
}

export const useSim = () => useContext(SimContext);
