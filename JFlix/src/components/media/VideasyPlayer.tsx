'use client';

import React from 'react';

interface VideasyPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
}

/**
 * VideasyPlayer - A responsive player component for Videasy streaming service
 * Based on the format: https://player.videasy.net/{mediaType}/{id}/season/{season}/episode/{episode}
 */
const VideasyPlayer: React.FC<VideasyPlayerProps> = ({ tmdbId, mediaType, season = 1, episode = 1 }) => {
  // Generate the appropriate URL based on media type
  const getVideasyUrl = () => {
    if (mediaType === 'movie') {
      return `https://player.videasy.net/movie/${tmdbId}`;
    } else {
      // Both TV shows and anime use the same format
      return `https://player.videasy.net/tv/${tmdbId}/season/${season}/episode/${episode}`;
    }
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={getVideasyUrl()}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameBorder="0"
        allowFullScreen
        allow="encrypted-media"
        title={`Videasy Player - ${mediaType === 'movie' ? 'Movie' : 'Episode'} ${tmdbId}`}
      />
    </div>
  );
};

export default VideasyPlayer;
