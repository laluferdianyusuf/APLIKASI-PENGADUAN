// context/ComplaintContext.js
import React, { createContext, useState, useContext } from "react";

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [complaintsProgress, setComplaintsProgress] = useState([]);

  const updateComplaints = (newComplaints) => {
    setComplaints(newComplaints);
  };

  const updateComplaintProgress = (newComplaints) => {
    setComplaintsProgress(newComplaints);
  };
  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        updateComplaints,
        complaintsProgress,
        updateComplaintProgress,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);
