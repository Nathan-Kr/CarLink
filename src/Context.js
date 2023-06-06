import React, { createContext, useState } from "react";

export const searchContext = createContext();

export const Context = ({ children }) => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [directions, setDirections] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
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
        setPassengers,
        directions,
        setDirections,
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

