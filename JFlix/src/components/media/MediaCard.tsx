'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiInfo, FiImage, FiAlertTriangle } from 'react-icons/fi';
import CompactShareButton from '@/components/ui/CompactShareButton';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/api/tmdb';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  releaseDate?: string;
  voteAverage?: number;
  is_r18?: boolean; // Flag for R-18 content
}

const MediaCard = ({
  id,
  title,
  posterPath,
  mediaType,
  releaseDate,
  voteAverage,
  is_r18,
}: MediaCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const detailsPath = `/${mediaType === 'movie' ? 'movies' : mediaType === 'tv' ? 'tvshows' : mediaType}/${id}`;
  
  // Reset loading state if poster path changes and handle client-side only rendering
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
  }, [posterPath]);
  
  // Use client-side only rendering for images to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="card group touch-manipulation">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-md">
        {/* Only render the actual image component after client-side mount to prevent hydration mismatch */}
        {isMounted ? (
          !imageError ? (
            <Image
              src={getImageUrl(posterPath, 'w500')}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                'object-cover transition-opacity duration-500',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
              priority={false}
              unoptimized={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400">
              <FiImage size={32} />
              <span className="mt-2 text-xs text-center px-2">{title}</span>
            </div>
          )
        ) : (
          /* Static placeholder during SSR to prevent hydration mismatch */
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        
        {/* Only show loading spinner after client-side mount */}
        {isMounted && isLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
          </div>
        )}
        
        <div className="card-overlay">
          <div className="flex flex-col items-center space-y-4 px-2 py-3">
            <Link 
              href={`${detailsPath}/watch`} 
              className="btn-primary flex items-center space-x-2 text-sm sm:text-sm px-4 py-2.5 sm:px-4 sm:py-2 w-full justify-center rounded-lg shadow-lg"
              aria-label={`Watch ${title}`}
            >
              <FiPlay className="text-sm sm:text-sm" />
              <span>Watch</span>
            </Link>
            
            <Link 
              href={detailsPath} 
              className="btn-secondary flex items-center space-x-2 text-sm sm:text-sm px-4 py-2.5 sm:px-4 sm:py-2 w-full justify-center rounded-lg shadow-lg"
              aria-label={`View details for ${title}`}
            >
              <FiInfo className="text-sm sm:text-sm" />
              <span>Details</span>
            </Link>
          </div>
        </div>
        
        {/* Rating badge */}
        {voteAverage && voteAverage > 0 && (
          <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-xs font-bold shadow-md">
            {Math.round(voteAverage * 10) / 10}
          </div>
        )}
        
        {/* Share button */}
        <div className="absolute bottom-2 right-2 z-30">
          <CompactShareButton 
            title={title}
            mediaType={mediaType}
            id={id}
            className="bg-[var(--primary)]/90 hover:bg-[var(--primary)] shadow-lg w-9 h-9 flex items-center justify-center"
          />
        </div>
        
        {/* R-18 badge */}
        {is_r18 && (
          <div className="absolute top-2 left-2 flex items-center justify-center rounded-md bg-red-800 px-2 py-1 text-xs font-bold text-white shadow-md">
            <FiAlertTriangle className="mr-1" size={12} />
            R-18
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="text-sm md:text-base font-medium line-clamp-1 text-white/90">{title}</h3>
        {releaseDate && (
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">
            {new Date(releaseDate).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
