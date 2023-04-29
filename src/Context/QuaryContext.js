import { createContext, useState } from "react";

export const QuaryContext = createContext();

const QuaryProvider = ({ children }) => {
  const [Pan, setPan] = useState("");

  return (
    <QuaryContext.Provider value={{ Pan, setPan}}>
      {children}
    </QuaryContext.Provider>
  );
};

export default QuaryProvider;
