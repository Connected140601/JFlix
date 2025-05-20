'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAgeVerification from '@/lib/hooks/useAgeVerification';
import AgeVerification from './AgeVerification';

type AgeRestrictedLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const AgeRestrictedLink = ({ href, children, className, onClick }: AgeRestrictedLinkProps) => {
  const [showVerification, setShowVerification] = useState(false);
  const { isVerified, setVerified } = useAgeVerification();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // If already verified, proceed normally
    if (isVerified) {
      if (onClick) onClick();
      return;
    }

    // Otherwise prevent default and show verification
    e.preventDefault();
    setShowVerification(true);
  };

  const handleVerified = () => {
    setVerified();
    setShowVerification(false);
    
    // Navigate to the target page
    router.push(href);
    
    // Call the onClick handler if provided
    if (onClick) onClick();
  };

  const handleCancel = () => {
    setShowVerification(false);
  };

  return (
    <>
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
      
      {showVerification && (
        <AgeVerification onVerified={handleVerified} onCancel={handleCancel} />
      )}
    </>
  );
};

export default AgeRestrictedLink;
