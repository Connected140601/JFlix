'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiCalendar, FiStar, FiInfo, FiFilm, FiLayers } from 'react-icons/fi';
import VideoPlayer from '@/components/media/VideoPlayer';
import EpisodeSelector from '@/components/media/EpisodeSelector';
import { getImageUrl } from '@/lib/api/tmdb';

interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  seasons: any[];
  first_air_date: string;
  genres: { id: number; name: string }[];
  backdrop_path: string | null;
  vote_average: number;
  original_language?: string;
  production_companies?: { id: number; name: string }[];
}

interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string;
}

export default function TVShowWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();
  const seasonParam = searchParams.get('season');
  const episodeParam = searchParams.get('episode');
  
  const [tvShow, setTVShow] = useState<TVShowDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(seasonParam ? parseInt(seasonParam, 10) : 1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(episodeParam ? parseInt(episodeParam, 10) : 1);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const tvId = parseInt(id, 10);

  // Fetch TV show details
  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=648c004c97b5a1425c702528ab88ddac&append_to_response=seasons`
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch TV show details');
        }
        
        const data = await res.json();
        setTVShow(data);
        
        // Fetch all seasons with episodes
        if (data.seasons && data.seasons.length > 0) {
          const seasonsWithEpisodes = await Promise.all(
            data.seasons.map(async (season: any) => {
              const seasonRes = await fetch(
                `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=648c004c97b5a1425c702528ab88ddac`
              );
              
              if (!seasonRes.ok) {
                return { ...season, episodes: [] };
              }
              
              const seasonData = await seasonRes.json();
              return seasonData;
            })
          );
          
          setSeasons(seasonsWithEpisodes);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setLoading(false);
      }
    };
    
    fetchTVShowDetails();
  }, [id]);

  // Update selected season and episode from URL params
  useEffect(() => {
    if (seasonParam) {
      setSelectedSeason(parseInt(seasonParam, 10));
    }
    
    if (episodeParam) {
      setSelectedEpisode(parseInt(episodeParam, 10));
    }
  }, [seasonParam, episodeParam]);

  if (loading) {
    return (
      <div className="container-fluid py-8">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="container-fluid py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">TV Show Not Found</h2>
          <p className="text-gray-400 mb-6">The TV show you're looking for could not be found.</p>
          <Link href="/tvshows" className="btn-primary">
            Browse TV Shows
          </Link>
        </div>
      </div>
    );
  }

  // Find current episode details
  const currentEpisode = seasons
    .find(s => s.season_number === selectedSeason)
    ?.episodes?.find(e => e.episode_number === selectedEpisode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Banner with Backdrop */}
      <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'original')}
            alt={tvShow.name}
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
              href={`/tvshows/${id}`}
              className="inline-flex items-center gap-2 bg-black/50 hover:bg-primary px-4 py-2 rounded-full text-sm transition-colors duration-300"
            >
              <FiArrowLeft />
              <span>Back to show details</span>
            </Link>
          </div>
          
          {/* Show Title and Episode Info */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {tvShow.name}
            </h1>
            
            {seasons.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-primary/80 text-white px-3 py-1 rounded-md text-sm font-medium">
                  S{selectedSeason} E{selectedEpisode}
                </div>
                
                {currentEpisode?.name && (
                  <h2 className="text-xl text-gray-100">
                    {currentEpisode.name}
                  </h2>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
              {tvShow.first_air_date && (
                <div className="flex items-center gap-1">
                  <FiCalendar className="text-primary" />
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
              )}
              
              {tvShow.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  <span>{Math.round(tvShow.vote_average * 10) / 10}</span>
                </div>
              )}
              
              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-2">
                  {tvShow.genres.slice(0, 2).map((genre: any) => (
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
        {/* Two-column layout for Video Player and Episodes */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          {/* Video Player Column - Larger size */}
          <div className="xl:col-span-3">
            <VideoPlayer 
              tmdbId={tvId} 
              mediaType="tv" 
              season={selectedSeason} 
              episode={selectedEpisode}
              episodeTitle={currentEpisode?.name}
              episodeImage={currentEpisode?.still_path ? getImageUrl(currentEpisode.still_path, 'w300') : null}
            />
          </div>
          
          {/* Episodes Column - Beside the player */}
          <div>
            {seasons.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-full max-h-[650px] flex flex-col">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FiLayers className="text-primary" />
                    <span>Episodes</span>
                  </h2>
                </div>
                
                <div className="p-4 overflow-auto flex-grow">
                  <EpisodeSelector 
                    tvId={tvId} 
                    seasons={seasons} 
                    initialSeason={selectedSeason}
                    initialEpisode={selectedEpisode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content - Episode Info */}
          <div className="lg:col-span-2">
            {currentEpisode && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiFilm className="text-primary" />
                  <span>Current Episode</span>
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 mb-4">
                  {currentEpisode.still_path && (
                    <div className="w-full md:w-64 flex-shrink-0">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(currentEpisode.still_path, 'w500')}
                          alt={currentEpisode.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">
                      {selectedSeason}x{selectedEpisode.toString().padStart(2, '0')} - {currentEpisode.name}
                    </h3>
                    
                    {currentEpisode.air_date && (
                      <div className="text-sm text-gray-300 mb-3 flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        <span>Aired: {new Date(currentEpisode.air_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-300 leading-relaxed">
                      {currentEpisode.overview || 'No overview available for this episode.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* About Show */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiInfo className="text-primary" />
                <span>About this Show</span>
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{tvShow.overview}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {tvShow.first_air_date && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">First Air Date</span>
                    <span className="font-medium">{new Date(tvShow.first_air_date).toLocaleDateString()}</span>
                  </div>
                )}
                
                {tvShow.seasons && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">Seasons</span>
                    <span className="font-medium">{tvShow.seasons.length}</span>
                  </div>
                )}
                
                {tvShow.vote_average > 0 && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">Rating</span>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500" />
                      <span className="font-medium">{Math.round(tvShow.vote_average * 10) / 10}/10</span>
                    </div>
                  </div>
                )}
                
                {tvShow.genres && tvShow.genres.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 mb-1">Genres</span>
                    <div className="flex flex-wrap gap-2">
                      {tvShow.genres.map((genre) => (
                        <span key={genre.id} className="bg-gray-700 px-2 py-1 rounded-md text-xs">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar - Additional Info */}
          <div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">Show Information</h3>
              
              {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Production</h4>
                  <div className="text-sm">
                    {tvShow.production_companies.slice(0, 3).map((company: any, index: number) => (
                      <span key={company.id}>
                        {company.name}{index < Math.min(tvShow.production_companies?.length || 0, 3) - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {tvShow.original_language && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Language</h4>
                  <div className="text-sm font-medium">
                    {tvShow.original_language.toUpperCase()}
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
                  <li>• Use the episode selector to navigate between episodes</li>
                  <li>• Change servers if video playback is interrupted</li>
                  <li>• Full screen mode provides the best viewing experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
