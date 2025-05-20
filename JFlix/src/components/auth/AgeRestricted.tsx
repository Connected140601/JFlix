'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AgeVerification from './AgeVerification';
import useAgeVerification from '@/lib/hooks/useAgeVerification';

type AgeRestrictedProps = {
  children: React.ReactNode;
  redirectPath?: string;
  strictVerification?: boolean; // If true, always show verification even if already verified
};

const AgeRestricted = ({ children, redirectPath = '/', strictVerification = false }: AgeRestrictedProps) => {
  const { isVerified, isLoading, setVerified } = useAgeVerification();
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If strict verification is enabled, always show verification on first visit to this page
    // Otherwise, only show if not verified
    if (!isLoading) {
      if (strictVerification) {
        // For strict pages, we'll use sessionStorage to remember verification just for this session
        const hasVerifiedThisSession = sessionStorage.getItem('strictVerified') === 'true';
        if (!hasVerifiedThisSession) {
          setShowVerification(true);
        }
      } else if (!isVerified) {
        setShowVerification(true);
      }
    }
  }, [isLoading, isVerified, strictVerification]);

  const handleVerified = () => {
    setVerified();
    setShowVerification(false);
    
    // For strict verification pages, remember that we've verified for this session
    if (strictVerification) {
      sessionStorage.setItem('strictVerified', 'true');
    }
  };

  const handleCancel = () => {
    setShowVerification(false);
    router.push(redirectPath);
  };

  if (isLoading) {
    // Show loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showVerification && (
        <AgeVerification onVerified={handleVerified} onCancel={handleCancel} />
      )}
      {(isVerified || !showVerification) && children}
    </>
  );
};

export default AgeRestricted;
