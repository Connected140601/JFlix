'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay } from 'react-icons/fi';
import { getImageUrl, getPosterUrl } from '@/lib/api/tmdb';
import { formatDate, truncateText } from '@/lib/utils';

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: Episode[];
  air_date?: string;
}

interface EpisodeSelectorProps {
  tvId: number;
  seasons: Season[];
  initialSeason?: number;
  initialEpisode?: number;
}

const EpisodeSelector = ({
  tvId,
  seasons,
  initialSeason = 1,
  initialEpisode = 1,
}: EpisodeSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);

  // Find the current season and episode
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason) || seasons[0];
  
  if (!seasons || seasons.length === 0) {
    return <div className="text-center py-8">No episodes available</div>;
  }

  return (
    <div className="episode-selector">
      {/* Season Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="season-selector" className="text-sm font-medium">
            Select Season
          </label>
          <span className="text-xs text-gray-400">
            {currentSeason?.episodes?.length || 0} Episodes
          </span>
        </div>
        <select
          id="season-selector"
          value={selectedSeason}
          onChange={(e) => {
            setSelectedSeason(Number(e.target.value));
            setSelectedEpisode(1); // Reset to first episode when changing season
          }}
          className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {/* Season Info */}
      {currentSeason && (
        <div className="flex gap-4 mb-6 bg-gray-800/50 p-4 rounded-lg">
          <div className="flex-shrink-0 w-20 md:w-24">
            <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-md">
              <Image
                src={getImageUrl(currentSeason.poster_path, 'w185')}
                alt={currentSeason.name}
                fill
                className="object-cover"
                unoptimized={true}
                loading="eager"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  // Use a real TMDB image as fallback instead of placeholder
                  target.src = 'https://image.tmdb.org/t/p/w185/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg';
                }}
              />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-1">{currentSeason.name}</h3>
            <p className="text-xs text-gray-300 mb-2">
              {currentSeason.air_date ? new Date(currentSeason.air_date).getFullYear() : ''}
            </p>
            <p className="text-xs text-gray-400 line-clamp-3">
              {truncateText(currentSeason.overview || 'No overview available', 150)}
            </p>
          </div>
        </div>
      )}

      {/* Episodes List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Episodes</h3>
          <div className="h-px bg-gray-700 flex-grow ml-3"></div>
        </div>
        
        {currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0 ? (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {currentSeason.episodes.map((episode) => (
              <div
                key={episode.id}
                className={`flex gap-3 p-3 rounded-lg transition-all duration-200 ${
                  episode.episode_number === selectedEpisode
                    ? 'bg-primary/20 border border-primary/30'
                    : 'hover:bg-gray-800/80 border border-transparent'
                }`}
              >
                {/* Episode Thumbnail */}
                <div className="flex-shrink-0 w-24 h-14 relative rounded-md overflow-hidden">
                  <Image
                    src={getImageUrl(episode.still_path, 'w300')}
                    alt={`${episode.name} - Episode ${episode.episode_number}`}
                    fill
                    className="object-cover"
                    unoptimized={true} // Ensure we get the exact image for each episode
                    loading="eager"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      // Use a real TMDB image as fallback instead of placeholder
                      target.src = 'https://image.tmdb.org/t/p/w300/3bOGNsHlrswhyW79uvIHH1V43JI.jpg';
                    }}
                  />
                  {/* Episode number overlay */}
                  <div className="absolute top-0 left-0 bg-black/70 px-1.5 py-0.5 text-xs font-bold">
                    {episode.episode_number}
                  </div>
                  {/* Play button overlay */}
                  <Link
                    href={`/tvshows/${tvId}/watch?season=${selectedSeason}&episode=${episode.episode_number}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    prefetch={false}
                    aria-label={`Play ${episode.name} - Episode ${episode.episode_number}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                      <FiPlay size={16} className="text-white" />
                    </div>
                  </Link>
                </div>
                
                {/* Episode Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {episode.name}
                    </h4>
                    <Link
                      href={`/tvshows/${tvId}/watch?season=${selectedSeason}&episode=${episode.episode_number}`}
                      className={`shrink-0 inline-flex items-center gap-1 text-xs py-1 px-2 rounded-md transition-colors ${episode.episode_number === selectedEpisode 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-800 hover:bg-primary/80 text-gray-200'}`}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                      prefetch={false}
                      aria-label={`Play ${episode.name} - Episode ${episode.episode_number}`}
                    >
                      <FiPlay size={12} />
                      <span>Play</span>
                    </Link>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-1">
                    {episode.air_date ? formatDate(episode.air_date) : 'No air date'}
                  </p>
                  
                  <p className="text-xs text-gray-300 line-clamp-1">
                    {episode.overview || 'No overview available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-800/30 rounded-lg">
            <p className="text-gray-400 text-sm">No episodes available for this season</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeSelector;
