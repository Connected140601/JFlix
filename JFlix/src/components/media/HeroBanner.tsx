'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiInfo, FiImage } from 'react-icons/fi';
import { getImageUrl } from '@/lib/api/tmdb';
import { truncateText } from '@/lib/utils';

interface HeroBannerProps {
  items: {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    overview: string;
    media_type?: 'movie' | 'tv';
  }[];
}

const HeroBanner = ({ items }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Auto-rotate featured items
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [items.length]);
  
  // Reset loading state when current item changes
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
  }, [currentIndex]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const mediaType = currentItem.media_type || (currentItem.title ? 'movie' : 'tv');
  const title = currentItem.title || currentItem.name || '';
  const detailsPath = `/${mediaType === 'movie' ? 'movies' : 'tvshows'}/${currentItem.id}`;

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError ? (
          <Image
            src={getImageUrl(currentItem.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            unoptimized={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400">
            <FiImage size={48} />
            <span className="mt-4 text-xl font-bold">{title}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end z-10">
        <div className="container-fluid pb-16 md:pb-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">{title}</h1>
            
            <p className="text-gray-200 mb-6 line-clamp-3 md:line-clamp-4">
              {truncateText(currentItem.overview, 200)}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`${detailsPath}/watch`}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlay />
                <span>Watch Now</span>
              </Link>
              
              <Link 
                href={detailsPath}
                className="btn-secondary flex items-center gap-2"
              >
                <FiInfo />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
