import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import { getImageUrl } from '@/lib/api/tmdb';
import { formatDate } from '@/lib/utils';
import MediaSection from '@/components/media/MediaSection';
import EpisodeSelector from '@/components/media/EpisodeSelector';
import { use } from 'react';
import TVShowShareButton from './TVShowShareButton';
import { Suspense } from 'react';
import TVShowDetailClient from './TVShowDetailClient';
import { isVivamaxContent } from '@/lib/utils/ageRestriction';
import fs from 'fs';
import path from 'path';

// Generate static params for all TV show IDs
export async function generateStaticParams() {
  try {
    // Read content.json to get all TV show IDs
    const contentPath = path.join(process.cwd(), 'content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Extract TV show IDs from various categories
    const tvIds = new Set();
    
    // Process categories that contain TV shows
    const tvCategories = ['trending', 'popularTV', 'topRatedTV', 'koreanTV'];
    
    tvCategories.forEach(category => {
      const categoryData = contentData.find((c: any) => c.category === category);
      if (categoryData) {
        const items = categoryData.items || [];
        items.forEach((item: any) => {
          if (item.type === 'tv' || (!item.type && category.includes('TV'))) {
            tvIds.add(item.id.toString());
          }
        });
      }
    });
    
    // Return array of params objects
    return Array.from(tvIds).map((id: any) => ({
      id: id.toString()
    }));
  } catch (error) {
    console.error('Error generating static params for TV shows:', error);
    return [];
  }
}

// Fetch TV show details
async function getTVShowDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=648c004c97b5a1425c702528ab88ddac&append_to_response=videos,credits,similar,recommendations,seasons`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch TV show details');
  }
  
  return res.json();
}

// Fetch season details with episodes
async function getSeasonDetails(tvId: string, seasonNumber: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=648c004c97b5a1425c702528ab88ddac`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch season ${seasonNumber} details`);
  }
  
  return res.json();
}

export default function TVShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  // Use the unwrapped id to fetch TV show details
  const tvShow = use(getTVShowDetails(id));
  
  // Get trailer if available
  const trailer = tvShow.videos?.results?.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || tvShow.videos?.results[0];
  
  // Get cast (limit to 10)
  const cast = tvShow.credits?.cast?.slice(0, 10) || [];
  
  // Get creator
  const creators = tvShow.created_by || [];
  
  // Get similar and recommended shows
  const similar = tvShow.similar?.results || [];
  const recommendations = tvShow.recommendations?.results || [];
  
  // Get seasons with episodes
  const seasons = tvShow.seasons || [];
  
  // Fetch first season details if seasons exist
  let firstSeasonWithEpisodes = null;
  if (seasons.length > 0) {
    // Find the first real season (sometimes season 0 is specials)
    const firstSeason = seasons.find((s: any) => s.season_number > 0) || seasons[0];
    firstSeasonWithEpisodes = use(getSeasonDetails(id, firstSeason.season_number));
  }

  return (
    <>
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'original')}
            alt={tvShow.name}
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
                  src={getImageUrl(tvShow.poster_path, 'w500')}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Details */}
              <div className="flex-grow">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">{tvShow.name}</h1>
                
                {tvShow.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">{tvShow.tagline}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {tvShow.first_air_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCalendar />
                      <span>{formatDate(tvShow.first_air_date)}</span>
                    </div>
                  )}
                  
                  {tvShow.episode_run_time && tvShow.episode_run_time.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiClock />
                      <span>{tvShow.episode_run_time[0]} min</span>
                    </div>
                  )}
                  
                  {tvShow.vote_average > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiStar className="text-yellow-500" />
                      <span>{Math.round(tvShow.vote_average * 10) / 10}/10</span>
                    </div>
                  )}
                </div>
                
                {tvShow.genres && tvShow.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tvShow.genres.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-gray-200 mb-6 max-w-3xl">{tvShow.overview}</p>
                
                {seasons.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/tvshows/${id}/watch?season=${seasons[0].season_number}&episode=1`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiPlay />
                      <span>Watch Now</span>
                    </Link>
                    <TVShowShareButton 
                      title={tvShow.name} 
                      id={id} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-12">
        {/* Episodes Section */}
        {seasons.length > 0 && firstSeasonWithEpisodes && (
          <div className="mb-12">
            <h2 className="section-title">Episodes</h2>
            <EpisodeSelector 
              tvId={parseInt(id, 10)} 
              seasons={[{...firstSeasonWithEpisodes, episodes: firstSeasonWithEpisodes.episodes || []}]} 
              initialSeason={firstSeasonWithEpisodes.season_number}
              initialEpisode={1}
            />
          </div>
        )}
        
        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <div className="col-span-2">
            {/* Trailer */}
            {trailer && (
              <div className="mb-10">
                <h2 className="section-title">Trailer</h2>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`${tvShow.name} Trailer`}
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
          </div>
          
          {/* Right Column */}
          <div>
            <div className="bg-gray-900/30 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Show Info</h2>
              
              <div className="space-y-4">
                {creators.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Created By</h3>
                    <p>{creators.map((c: any) => c.name).join(', ')}</p>
                  </div>
                )}
                
                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Network</h3>
                    <p>{tvShow.networks.map((n: any) => n.name).join(', ')}</p>
                  </div>
                )}
                
                {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Production</h3>
                    <p>{tvShow.production_companies.map((c: any) => c.name).join(', ')}</p>
                  </div>
                )}
                
                {tvShow.production_countries && tvShow.production_countries.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Country</h3>
                    <p>{tvShow.production_countries.map((c: any) => c.name).join(', ')}</p>
                  </div>
                )}
                
                {tvShow.spoken_languages && tvShow.spoken_languages.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Language</h3>
                    <p>{tvShow.spoken_languages.map((l: any) => l.english_name).join(', ')}</p>
                  </div>
                )}
                
                {tvShow.number_of_seasons > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Seasons</h3>
                    <p>{tvShow.number_of_seasons}</p>
                  </div>
                )}
                
                {tvShow.number_of_episodes > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Episodes</h3>
                    <p>{tvShow.number_of_episodes}</p>
                  </div>
                )}
                
                {tvShow.status && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Status</h3>
                    <p>{tvShow.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Shows */}
        {similar.length > 0 && (
          <div className="mb-12">
            <MediaSection title="Similar Shows" items={similar} />
          </div>
        )}
        
        {/* Recommended Shows */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <MediaSection title="Recommended For You" items={recommendations} />
          </div>
        )}
      </div>
    </>
  );
}
