import React, { createContext, useState } from "react";

export const searchContext = createContext();

export const Context = ({ children }) => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [passengers, setPassengers] = useState(1);
  return (
    <searchContext.Provider
      value={{
        departure,
        setDeparture,
        arrival,
        setArrival,
        departureDate,
        setDepartureDate,
        passengers,
        setPassengers
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

