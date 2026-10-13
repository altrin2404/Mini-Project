import { createContext, useContext, useState } from "react";
import { studentProfiles } from "../simulations/studentProfiles";
import { parentProfiles } from "../simulations/parentProfiles";
import { teacherProfiles } from "../simulations/teacherProfiles";

const SimContext = createContext(null);

export function SimulationProvider({ children }) {
  const [activeRole, setActiveRole] = useState("student"); // "student" | "teacher" | "parent"
  const [studentIdx, setStudentIdx] = useState(0);
  const [parentIdx, setParentIdx]   = useState(0);
  const [teacherIdx, setTeacherIdx] = useState(0);

  // Editable student state for teacher mark entry interactions
  const [studentsList, setStudentsList] = useState(teacherProfiles[0].students);

  const activeStudent = studentProfiles[studentIdx];
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
    }}>
      {children}
    </SimContext.Provider>
  );
}

export const useSim = () => useContext(SimContext);
