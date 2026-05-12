"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  heroImage: string | null;
  setHeroImage: (image: string | null) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      isComplete, 
      setIsComplete,
      heroImage,
      setHeroImage
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
