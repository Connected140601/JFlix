'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiStar, FiCalendar, FiClock, FiAlertTriangle } from 'react-icons/fi';
import ShareButton from '@/components/ui/ShareButton';
import { getImageUrl } from '@/lib/api/tmdb';
import { formatDate, formatRuntime, formatCurrency } from '@/lib/utils';
import MediaSection from '@/components/media/MediaSection';
import { isAgeRestricted, isVivamaxContent, filterVivamaxContent, processMoviesForAgeRestriction } from '@/lib/utils/ageRestriction';
import MediaCard from '@/components/media/MediaCard';
import AgeRestricted from '@/components/auth/AgeRestricted';
import { usePathname } from 'next/navigation';

// Client component for age verification
export default function MovieDetailClient({ movie, trailer, cast, director, similar, recommendations }: any) {
  // Get current path to check if we're on the Vivamax page
  const pathname = usePathname();
  const isVivamaxPage = pathname?.includes('/pinoy-adult') || false;
  
  // Enhanced age restriction check - ensure we catch all R-18 and 19+ content
  // Apply additional checks for specific Filipino adult movie titles
  const title = (movie.title || movie.name || '').toLowerCase();
  const specificAdultTitles = ['kiskisan', 'sikil', 'tuhog', 'kaliwaan', 'bomba', 'silip', 'scorpio nights'];
  const isSpecificAdultTitle = specificAdultTitles.some(adultTitle => title.includes(adultTitle));
  
  // Check if this is R-16 content (which should NOT be age restricted)
  const isR16 = title.includes('r-16') || title.includes('r16') || 
                (movie.overview && movie.overview.toLowerCase().includes('r-16')) || 
                (movie.overview && movie.overview.toLowerCase().includes('r16'));
  
  // Check if this is age-restricted content
  let isR18 = isAgeRestricted(movie);
  
  // Force age restriction for specific known adult titles, but not for R-16 content
  if (isSpecificAdultTitle && !isR16) {
    isR18 = true;
    // Add the flag to the movie object
    movie.is_r18 = true;
  }
  
  // If this is R-16 content, explicitly mark it as not R-18
  if (isR16) {
    isR18 = false;
    movie.is_r18 = false;
  }
  
  // Check if this is Vivamax content
  const isVivamax = isVivamaxContent(movie);
  
  // If this is Vivamax content and we're not on the Vivamax page, redirect to Vivamax page
  if (isVivamax && !isVivamaxPage) {
    // This will be handled by the server component's filtering, but just in case
    // we'll add this check here too
  }
  
  // Filter out Vivamax content from similar and recommended movies
  // unless we're on the Vivamax page
  const filteredSimilar = isVivamaxPage ? similar : filterVivamaxContent(similar);
  const filteredRecommendations = isVivamaxPage ? recommendations : filterVivamaxContent(recommendations);
  
  // Process similar and recommended movies to ensure age restriction flags are set
  const processedSimilar = processMoviesForAgeRestriction(filteredSimilar);
  const processedRecommendations = processMoviesForAgeRestriction(filteredRecommendations);
  
  // Determine if we need strict age verification
  // Exclude R-16 content from age verification
  const needsStrictVerification = !isR16 && (isVivamax || isR18 || title.includes('19+') || title.includes('r-18'));
  
  // Render content with age verification if needed
  const content = (
    <>
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container-fluid">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="hidden md:block flex-shrink-0 w-64 h-96 relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
                
                {/* R-18 Badge */}
                {isR18 && (
                  <div className="absolute top-2 left-2 bg-red-800 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <FiAlertTriangle size={12} />
                    R-18
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.title}</h1>
                  {isR18 && (
                    <span className="bg-red-800 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <FiAlertTriangle size={12} />
                      R-18
                    </span>
                  )}
                </div>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {movie.release_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCalendar />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}
                  
                  {movie.runtime > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiClock />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  
                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiStar className="text-yellow-500" />
                      <span>{Math.round(movie.vote_average * 10) / 10}/10</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Overview</h2>
                  <p className="text-gray-300">{movie.overview}</p>
                </div>
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Genres</h2>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre: any) => (
                        <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/movies/${movie.id}/watch`}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <FiPlay />
                    Watch Now
                  </Link>
                  <ShareButton 
                    title={movie.title} 
                    mediaType="movie" 
                    id={movie.id} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-fluid py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="md:col-span-2">
            {/* Trailer */}
            {trailer && (
              <div className="mb-10">
                <h2 className="section-title">Trailer</h2>
                <div className="relative pt-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    className="absolute inset-0"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`${movie.title} Trailer`}
                  />
                </div>
              </div>
            )}
            
            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-10">
                <h2 className="section-title">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((person: any) => (
                    <div key={person.id} className="text-center">
                      <div className="aspect-square relative rounded-full overflow-hidden mb-2 mx-auto w-24">
                        <Image
                          src={getImageUrl(person.profile_path, 'w300')}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{person.name}</h3>
                      <p className="text-gray-400 text-xs">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
              {processedSimilar.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {processedSimilar.slice(0, 10).map((movie: any) => (
                    <MediaCard 
                      key={movie.id}
                      id={movie.id}
                      title={movie.title || movie.name || 'Unknown Title'}
                      posterPath={movie.poster_path}
                      mediaType="movie"
                      releaseDate={movie.release_date}
                      voteAverage={movie.vote_average}
                      is_r18={movie.is_r18}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No similar movies found</p>
              )}
            </div>

          </div>
          
          {/* Right Column */}
          <div>
            <div className="bg-gray-900/30 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Movie Info</h2>
              
              <div className="space-y-4">
                {director && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Director</h3>
                    <p>{director.name}</p>
                  </div>
                )}
                
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Production</h3>
                    <p>{movie.production_companies.map((c: any) => c.name).join(', ')}</p>
                  </div>
                )}
                
                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Country</h3>
                    <p>{movie.production_countries.map((c: any) => c.name).join(', ')}</p>
                  </div>
                )}
                
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Language</h3>
                    <p>{movie.spoken_languages.map((l: any) => l.english_name).join(', ')}</p>
                  </div>
                )}
                
                {movie.budget > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Budget</h3>
                    <p>{formatCurrency(movie.budget)}</p>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Revenue</h3>
                    <p>{formatCurrency(movie.revenue)}</p>
                  </div>
                )}
                
                {movie.status && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Status</h3>
                    <p>{movie.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        {processedSimilar.length > 0 && (
          <div className="mb-12">
            <MediaSection title="Similar Movies" items={processedSimilar} />
          </div>
        )}
        
        {/* Recommended Movies */}
        {processedRecommendations.length > 0 && (
          <div className="mb-12">
            <MediaSection title="Recommended For You" items={processedRecommendations} />
          </div>
        )}
      </div>
    </>
  );
  
  // Wrap with age verification if needed
  // Use strict verification for Vivamax content or any R-18/19+ content
  if (needsStrictVerification) {
    return (
      <AgeRestricted strictVerification={true} redirectPath="/">
        {content}
      </AgeRestricted>
    );
  }
  
  // Regular content doesn't need age verification
  return content;
}
