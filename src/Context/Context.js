import { createContext, useState } from "react";

export const EmailContext = createContext();

const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [contractorName, setContractorName] = useState("");


  return (
    <EmailContext.Provider value={{ email, setEmail, contractorName, setContractorName }}>
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;
