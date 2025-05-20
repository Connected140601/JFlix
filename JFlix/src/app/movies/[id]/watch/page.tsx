import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiPlay, FiStar, FiCalendar, FiClock, FiInfo } from 'react-icons/fi';
import VideoPlayer from '@/components/media/VideoPlayer';
import AgeRestrictedVideoPlayer from '@/components/media/AgeRestrictedVideoPlayer';
import { use } from 'react';
import { getImageUrl } from '@/lib/api/tmdb';
import { isAgeRestricted, isVivamaxContent } from '@/lib/utils/ageRestriction';
import { usePathname } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Generate static params for all movie watch pages
export async function generateStaticParams() {
  try {
    // Read content.json to get all movie IDs
    const contentPath = path.join(process.cwd(), 'content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Extract movie IDs from various categories
    const movieIds = new Set();
    
    // Process categories that contain movies
    const movieCategories = ['trending', 'nowPlayingMovies', 'upcomingMovies', 'popularMovies'];
    
    movieCategories.forEach(category => {
      const categoryData = contentData.find((c: any) => c.category === category);
      if (categoryData) {
        const items = categoryData.items || [];
        items.forEach((item: any) => {
          if (item.type === 'movie' || !item.type) {
            movieIds.add(item.id.toString());
          }
        });
      }
    });
    
    // Return array of params objects
    return Array.from(movieIds).map((id: any) => ({
      id: id.toString()
    }));
  } catch (error) {
    console.error('Error generating static params for movie watch pages:', error);
    return [];
  }
}

// Fetch movie details
async function getMovieDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=648c004c97b5a1425c702528ab88ddac`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  
  return res.json();
}

export default function MovieWatchPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  // Use the unwrapped id to fetch movie details
  const movie = use(getMovieDetails(id));
  const movieId = parseInt(id, 10);
  
  // Check if this is age-restricted content
  const isR18 = isAgeRestricted(movie);
  
  // Check if this is Vivamax content
  const isVivamax = isVivamaxContent(movie);
  
  // Enhanced age restriction check - ensure we catch all R-18 and 19+ content
  const title = (movie.title || movie.name || '').toLowerCase();
  const specificAdultTitles = ['kiskisan', 'sikil', 'tuhog', 'kaliwaan', 'bomba', 'silip', 'scorpio nights'];
  const isSpecificAdultTitle = specificAdultTitles.some(adultTitle => title.includes(adultTitle));
  
  // Check if this is R-16 content (which should NOT be age restricted)
  const isR16 = title.includes('r-16') || title.includes('r16') || 
                (movie.overview && movie.overview.toLowerCase().includes('r-16')) || 
                (movie.overview && movie.overview.toLowerCase().includes('r16'));
                
  // Determine if we need age verification
  // Exclude R-16 content from age verification
  const needsAgeVerification = !isR16 && (isVivamax || isR18 || isSpecificAdultTitle || 
                              title.includes('19+') || title.includes('r-18'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Banner with Backdrop */}
      <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-gray-900" />
        </div>
        
        {/* Content */}
        <div className="container-fluid relative h-full flex flex-col justify-between py-6 z-10">
          {/* Back Button */}
          <div>
            <Link
              href={`/movies/${id}`}
              className="inline-flex items-center gap-2 bg-black/50 hover:bg-primary px-4 py-2 rounded-full text-sm transition-colors duration-300"
            >
              <FiArrowLeft />
              <span>Back to details</span>
            </Link>
          </div>
          
          {/* Movie Title and Quick Info */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <FiCalendar className="text-primary" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
              
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <FiClock className="text-primary" />
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
              )}
              
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  <span>{Math.round(movie.vote_average * 10) / 10}</span>
                </div>
              )}
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-2">
                  {movie.genres.slice(0, 3).map((genre: any) => (
                    <span key={genre.id} className="bg-gray-800 px-2 py-1 rounded-md text-xs">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-fluid py-8">
        {/* Two-column layout for Video Player and Movie Information */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          {/* Video Player Column - Larger size */}
          <div className="xl:col-span-3">
            {needsAgeVerification ? (
              <AgeRestrictedVideoPlayer 
                tmdbId={movieId} 
                mediaType="movie" 
                isR18={true} 
                strictVerification={isVivamax || isSpecificAdultTitle} 
              />
            ) : (
              <VideoPlayer tmdbId={movieId} mediaType="movie" />
            )}
          </div>
          
          {/* Movie Information Column - Beside the player */}
          <div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiInfo className="text-primary" />
                <span>Movie Information</span>
              </h3>
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: any) => (
                      <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-xs">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Production</h4>
                  <div className="text-sm">
                    {movie.production_companies.slice(0, 3).map((company: any, index: number) => (
                      <span key={company.id}>
                        {company.name}{index < Math.min(movie.production_companies.length, 3) - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.budget > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Budget</h4>
                  <div className="text-sm font-medium">
                    ${(movie.budget / 1000000).toFixed(1)} Million
                  </div>
                </div>
              )}
              
              {movie.revenue > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Box Office</h4>
                  <div className="text-sm font-medium">
                    ${(movie.revenue / 1000000).toFixed(1)} Million
                  </div>
                </div>
              )}
              
              {/* Watch Tips */}
              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FiInfo className="text-primary" />
                  <span>Viewing Tips</span>
                </h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Change servers if video playback is interrupted</li>
                  <li>• Full screen mode provides the best viewing experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* About Movie Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiInfo className="text-primary" />
            <span>About this Movie</span>
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">{movie.overview}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {movie.release_date && (
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Release Date</span>
                <span className="font-medium">{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
            )}
            
            {movie.runtime && (
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Runtime</span>
                <span className="font-medium">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              </div>
            )}
            
            {movie.vote_average > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Rating</span>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  <span className="font-medium">{Math.round(movie.vote_average * 10) / 10}/10</span>
                </div>
              </div>
            )}
            
            {movie.original_language && (
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Language</span>
                <span className="font-medium">{movie.original_language.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
