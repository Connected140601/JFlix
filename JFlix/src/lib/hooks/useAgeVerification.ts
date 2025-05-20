'use client';

import { useState, useEffect } from 'react';

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already verified their age
    const ageVerified = localStorage.getItem('ageVerified');
    const ageVerifiedExpires = localStorage.getItem('ageVerifiedExpires');
    
    if (ageVerified === 'true' && ageVerifiedExpires) {
      // Check if the verification has expired
      const expirationDate = new Date(ageVerifiedExpires);
      const now = new Date();
      
      if (now < expirationDate) {
        setIsVerified(true);
      } else {
        // Clear expired verification
        localStorage.removeItem('ageVerified');
        localStorage.removeItem('ageVerifiedExpires');
        setIsVerified(false);
      }
    } else {
      setIsVerified(false);
    }
    
    setIsLoading(false);
  }, []);

  const setVerified = () => {
    setIsVerified(true);
  };

  const resetVerification = () => {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('ageVerifiedExpires');
    setIsVerified(false);
  };

  return {
    isVerified,
    isLoading,
    setVerified,
    resetVerification
  };
};

export default useAgeVerification;
