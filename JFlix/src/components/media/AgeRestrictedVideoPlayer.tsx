'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from './VideoPlayer';
import AgeVerification from '@/components/auth/AgeVerification';
import useAgeVerification from '@/lib/hooks/useAgeVerification';

interface AgeRestrictedVideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  episodeTitle?: string;
  episodeImage?: string | null;
  animeTitle?: string;
  isR18?: boolean;
  strictVerification?: boolean; // For Vivamax and other strictly age-restricted content
}

const AgeRestrictedVideoPlayer = ({
  tmdbId,
  mediaType,
  season,
  episode,
  episodeTitle,
  episodeImage,
  animeTitle,
  isR18 = false,
  strictVerification = false,
}: AgeRestrictedVideoPlayerProps) => {
  const { isVerified, isLoading, setVerified } = useAgeVerification();
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (strictVerification) {
        // For strict verification (Vivamax, etc.), check sessionStorage
        const hasVerifiedThisSession = sessionStorage.getItem('strictVerified') === 'true';
        if (!hasVerifiedThisSession) {
          setShowVerification(true);
        }
      } else if (isR18 && !isVerified) {
        // Regular R-18 content verification
        setShowVerification(true);
      }
    }
  }, [isR18, strictVerification, isLoading, isVerified]);

  const handleVerified = () => {
    setVerified();
    setShowVerification(false);
    
    // For strict verification, remember in session storage
    if (strictVerification) {
      sessionStorage.setItem('strictVerified', 'true');
    }
  };

  const handleCancel = () => {
    setShowVerification(false);
    router.push('/');
  };

  // If content is not R-18, or user is verified, show the video player
  if (!isR18 || (isR18 && isVerified)) {
    return (
      <VideoPlayer
        tmdbId={tmdbId}
        mediaType={mediaType}
        season={season}
        episode={episode}
        episodeTitle={episodeTitle}
        episodeImage={episodeImage}
        animeTitle={animeTitle}
      />
    );
  }

  // If still loading verification status, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[480px] bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Checking age verification...</p>
        </div>
      </div>
    );
  }

  // If showing verification modal
  if (showVerification) {
    return (
      <>
        <div className="min-h-[480px] bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 text-5xl mb-4">🔞</div>
            <h3 className="text-xl font-bold mb-2">Age Restricted Content</h3>
            <p className="text-gray-300 mb-4">
              This content is rated R-18 and requires age verification.
            </p>
          </div>
        </div>
        <AgeVerification onVerified={handleVerified} onCancel={handleCancel} />
      </>
    );
  }

  // Fallback (should not reach here)
  return (
    <div className="min-h-[480px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center p-6">
        <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2">Age Verification Required</h3>
        <p className="text-gray-300 mb-4">
          Please verify your age to access this content.
        </p>
        <button
          onClick={() => setShowVerification(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Verify Age
        </button>
      </div>
    </div>
  );
};

export default AgeRestrictedVideoPlayer;
