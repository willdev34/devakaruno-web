"use client"

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define types for the context
interface DonationContextType {
  isDonationOpen: boolean;
  setIsDonationOpen: Dispatch<SetStateAction<boolean>>;
}

// Create context with type or null
export const DonationFormContext = createContext<DonationContextType | null>(null);

// Define the provider props type
interface DonationProviderProps {
  children: ReactNode;
}

// Create a provider component
export const DonationProvider: React.FC<DonationProviderProps> = ({ children }) => {
  const [isDonationOpen , setIsDonationOpen] = useState<boolean>(false);

  return (
    <DonationFormContext.Provider value={{ isDonationOpen , setIsDonationOpen }}>
      {children}
    </DonationFormContext.Provider>
  );
};

export default DonationFormContext;
