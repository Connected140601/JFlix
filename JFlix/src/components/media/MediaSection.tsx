'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MediaCard from './MediaCard';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  is_r18?: boolean; // Flag for R-18 content
  adult?: boolean; // TMDB's adult content flag
}

interface MediaSectionProps {
  title: string;
  items: MediaItem[];
  viewAllLink?: string;
}

const MediaSection = ({ title, items, viewAllLink }: MediaSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.75;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="container-fluid">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="section-title text-lg sm:text-xl md:text-2xl">{title}</h2>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-xs sm:text-sm font-medium text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          )}
        </div>
        
        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2 touch-pan-x overscroll-x-contain"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((item) => {
              const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
              
              return (
                <div 
                  key={`${mediaType}-${item.id}`} 
                  className="flex-shrink-0 w-[120px] xs:w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                >
                  <MediaCard
                    id={item.id}
                    title={item.title || item.name || 'Unknown Title'}
                    posterPath={item.poster_path}
                    mediaType={mediaType as 'movie' | 'tv'}
                    releaseDate={item.release_date || item.first_air_date}
                    voteAverage={item.vote_average}
                    is_r18={item.is_r18 || item.adult || (item.title || '').includes('R-18')}
                  />
                </div>
              );
            })}
          </div>
          
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 p-3 md:p-2 rounded-full text-white opacity-0 md:group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 -ml-2 md:-ml-4 hover:bg-black shadow-lg touch-manipulation"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={28} />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 p-3 md:p-2 rounded-full text-white opacity-0 md:group-hover:opacity-100 active:opacity-100 transition-opacity duration-300 -mr-2 md:-mr-4 hover:bg-black shadow-lg touch-manipulation"
            aria-label="Scroll right"
          >
            <FiChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
