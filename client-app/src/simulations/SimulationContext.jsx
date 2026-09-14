import { createContext, useContext, useState } from "react";
import { studentProfiles } from "../simulations/studentProfiles";
import { parentProfiles } from "../simulations/parentProfiles";

const SimContext = createContext(null);

export function SimulationProvider({ children }) {
  const [activeRole, setActiveRole] = useState("student"); // "student" | "parent"
  const [studentIdx, setStudentIdx] = useState(0);
  const [parentIdx, setParentIdx]   = useState(0);

  const activeStudent = studentProfiles[studentIdx];
  const activeParent  = parentProfiles[parentIdx];

  return (
    <SimContext.Provider value={{
      activeRole, setActiveRole,
      studentIdx, setStudentIdx,
      parentIdx,  setParentIdx,
      activeStudent,
      activeParent,
      studentProfiles,
      parentProfiles,
    }}>
      {children}
    </SimContext.Provider>
  );
}

export const useSim = () => useContext(SimContext);
