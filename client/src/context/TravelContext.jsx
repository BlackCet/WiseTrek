import { createContext, useState } from "react";

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [travelData, setTravelData] = useState({ from: "", destination: "" });

  return (
    <TravelContext.Provider value={{ travelData, setTravelData }}>
      {children}
    </TravelContext.Provider>
  );
};
