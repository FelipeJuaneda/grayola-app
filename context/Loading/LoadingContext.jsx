"use client";
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed top-0 left-0 z-[9999999] flex items-center justify-center w-screen h-screen bg-black/70">
          <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="white" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}
