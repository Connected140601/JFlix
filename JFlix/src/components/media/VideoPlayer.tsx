'use client';

import { useState, useEffect } from 'react';
import { FiMonitor, FiSettings, FiInfo, FiAlertTriangle, FiPlay, FiRefreshCw, FiShare2 } from 'react-icons/fi';
import ShareButton from '@/components/ui/ShareButton';
import { generateVidsrcEmbed, getAnimeEmbedUrl, getAllVideoSources } from '@/lib/utils';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  episodeTitle?: string;
  episodeImage?: string | null;
  animeTitle?: string;
  showShareButton?: boolean;
}

const VideoPlayer = ({ tmdbId, mediaType, season, episode, episodeTitle, episodeImage, animeTitle, showShareButton = true }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentServer, setCurrentServer] = useState<number>(1); // Default to server 1 (Vidsrc)
  const [videoSources, setVideoSources] = useState<{primary: string, alternatives: string[]}>({primary: "", alternatives: []});
  const [currentSourceIndex, setCurrentSourceIndex] = useState<number>(-1); // -1 means using primary source
  
  // Validate TMDB ID or Anime Title
  useEffect(() => {
    if (mediaType === 'anime') {
      if (!animeTitle) {
        setError('Invalid Anime Title');
      } else {
        setError(null);
      }
    } else {
      if (!tmdbId || isNaN(Number(tmdbId))) {
        setError('Invalid TMDB ID');
      } else {
        setError(null);
      }
    }
  }, [tmdbId, animeTitle, mediaType]);
  
  // Load video sources on component mount
  useEffect(() => {
    if (mediaType === 'anime' && animeTitle && episode) {
      // For anime, we only have one source
      setVideoSources({
        primary: getAnimeEmbedUrl(animeTitle, episode),
        alternatives: []
      });
    } else if (!error && tmdbId) {
      // For movies and TV shows, get all available sources
      const sources = getAllVideoSources(mediaType, tmdbId, season, episode);
      setVideoSources(sources);
    }
  }, [tmdbId, mediaType, season, episode, animeTitle, error]);

  // Generate embed URL based on selected server
  const getEmbedUrl = () => {
    if (error) return '';
    
    // For anime content, use the anime-specific embed URL
    if (mediaType === 'anime' && animeTitle && episode) {
      return videoSources.primary;
    }
    
    // For movies and TV shows, use the selected source
    if (currentSourceIndex === -1) {
      return videoSources.primary; // Use primary source
    } else if (currentSourceIndex >= 0 && currentSourceIndex < videoSources.alternatives.length) {
      return videoSources.alternatives[currentSourceIndex]; // Use alternative source
    }
    
    // Fallback to traditional method if sources aren't loaded yet
    return generateVidsrcEmbed(mediaType, tmdbId, season, episode, currentServer);
  };
  
  // Change server
  const changeServer = () => {
    setIsLoading(true);
    
    // If we have video sources loaded, cycle through them
    if (videoSources.primary || videoSources.alternatives.length > 0) {
      // Calculate next source index
      const totalSources = 1 + videoSources.alternatives.length; // Primary + alternatives
      let nextIndex = currentSourceIndex + 1;
      
      // If we've gone through all alternatives, go back to primary
      if (nextIndex >= videoSources.alternatives.length) {
        nextIndex = -1; // Back to primary source
      }
      
      setCurrentSourceIndex(nextIndex);
      
      // Update server number for display purposes
      setCurrentServer((nextIndex === -1) ? 1 : nextIndex + 2);
    } else {
      // Fallback to traditional method
      setCurrentServer((prev) => (prev % 4) + 1); // Cycle through 4 servers including Videasy
    }
  };

  return (
    <div className="video-player-wrapper">
      {/* Player Header */}
      <div className="player-header bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-t-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <FiMonitor className="text-primary text-xl" />
          <h2 className="text-lg font-bold">
            {mediaType === 'movie' ? 'Movie Player' : mediaType === 'anime' ? 'Anime Player' : 'TV Show Player'}
          </h2>
          {mediaType === 'tv' && season && episode && (
            <span className="bg-gray-700 text-xs px-2 py-1 rounded-md ml-2">
              S{season} E{episode}
            </span>
          )}
          {mediaType === 'anime' && episode && (
            <span className="bg-gray-700 text-xs px-2 py-1 rounded-md ml-2">
              EP{episode}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Server Selector */}
          <div className="flex items-center">
            <button
              onClick={changeServer}
              className="bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors"
              title="Change server"
            >
              <FiRefreshCw className="text-xs" />
              Server {currentServer}
            </button>
          </div>
          
          <button 
            onClick={() => setShowControls(!showControls)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md transition-colors"
            title="Show player information"
          >
            <FiInfo />
          </button>
        </div>
      </div>
      
      {/* Episode Info (for TV shows) */}
      {mediaType === 'tv' && season && episode && episodeTitle && (
        <div className="episode-info bg-gray-800/80 p-4 mb-1 rounded-lg flex items-center gap-4">
          {/* Episode Thumbnail */}
          {episodeImage && (
            <div className="relative w-24 h-14 rounded overflow-hidden flex-shrink-0 border border-gray-700">
              <img 
                src={episodeImage} 
                alt={`S${season} E${episode}`} 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                  <FiPlay className="text-white" />
                </div>
              </div>
            </div>
          )}
          
          {/* Episode Title and Number */}
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/80 text-white text-xs px-2 py-0.5 rounded">
                S{season} E{episode}
              </span>
              <h3 className="font-medium text-sm md:text-base">{episodeTitle}</h3>
            </div>
            <p className="text-xs text-gray-300">Now Playing</p>
          </div>
        </div>
      )}
      
      {/* Video Player - Larger size */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl">
        {/* Notices section */}
        <div className="flex flex-col">
          {/* Notice to change servers if current one isn't working */}
          <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-white text-sm py-2 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">💡</span>
              <span>If the current server isn't working, try changing to a different server using the server button.</span>
            </div>
            <button 
              onClick={changeServer}
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs px-3 py-1 rounded-full transition-colors"
              aria-label="Change server"
            >
              Change Server
            </button>
          </div>
          
          {/* Notice to change subtitles in video player settings */}
          <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 text-white text-sm py-2 px-4 flex items-center justify-between border-t border-gray-700/30">
            <div className="flex items-center">
              <span className="mr-2">🔤</span>
              <span>Need subtitles? You can enable and change subtitle settings in the video player controls.</span>
            </div>
            <div className="text-xs px-3 py-1 text-gray-300">
              Video Player Settings
            </div>
          </div>
        </div>
        
        <div className="aspect-[16/9] bg-black rounded-b-lg overflow-hidden shadow-2xl">
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6" style={{ minHeight: '480px' }}>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-center">Player Error</h3>
              <p className="text-gray-300 text-center mb-4">{error}</p>
              <p className="text-gray-400 text-sm text-center max-w-md">
                There was a problem loading the video player. Please try refreshing the page or check that the content ID is valid.
              </p>
            </div>
          ) : (
            <>
              {/* Only render iframe if we have a valid URL */}
              {getEmbedUrl() ? (
                <iframe
                  src={getEmbedUrl()}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="encrypted-media; picture-in-picture; web-share"
                  title={`${mediaType === 'movie' ? 'Movie' : 'TV Show'} Player`}
                  onLoad={() => setIsLoading(false)}
                  className="w-full h-full"
                  style={{ minHeight: '480px' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-6" style={{ minHeight: '480px' }}>
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold mb-2 text-center">Video Source Unavailable</h3>
                  <p className="text-gray-300 text-center mb-4">Unable to load video from current server</p>
                  <button
                    onClick={changeServer}
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                  >
                    <FiRefreshCw /> Try Another Server
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Loading Overlay */}
        {!error && isLoading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white">Loading player...</p>
          </div>
        )}
      </div>
      
      {/* Share Button Below Player */}
      {showShareButton && (
        <div className="mt-4 flex justify-center">
          <ShareButton 
            title={animeTitle || episodeTitle || `${mediaType === 'movie' ? 'Movie' : 'Episode'}`} 
            mediaType={mediaType} 
            id={tmdbId} 
            className="w-full sm:w-auto justify-center bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
          />
        </div>
      )}
      
      {/* Player Controls & Info */}
      {showControls && (
        <div className="player-info bg-gray-800 p-4 rounded-b-lg mt-4 border-t-2 border-primary animate-fadeIn">
          <div className="flex items-start gap-2 mb-3">
            <FiAlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Playback Issues?</h3>
              <p className="text-sm text-gray-300 mt-1">
                If the video doesn't play, try refreshing the page or checking your internet connection.
                Some content may not be available in certain regions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <FiSettings className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Player Controls</h3>
              <p className="text-sm text-gray-300 mt-1">
                Use the embedded player controls for playback. For fullscreen, click the fullscreen button in the player.
                <span className="font-bold">J<span className="text-white">F</span><span className="text-[var(--primary)]">lix</span></span> <span className="text-xs italic">"Kiss it Real!"</span> does not host any content; all videos are from third-party sources.
              </p>
              <div className="mt-2 p-2 bg-gray-700/50 rounded-md">
                <h4 className="text-sm font-medium mb-1">Available Servers:</h4>
                <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
                  <li>Server 1: Vidsrc.me (Default)</li>
                  <li>Server 2: Videasy</li>
                  <li>Server 3: 2EMBEDD</li>
                  <li>Server 4: Vidsrc.to</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">• Change servers if video playback is interrupted</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
