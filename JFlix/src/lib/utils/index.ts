import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format runtime to hours and minutes
export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}m`;
}

// Format number to display with commas
export function formatNumber(num: number): string {
  if (!num && num !== 0) return "N/A";
  return num.toLocaleString();
}

// Format currency to USD
export function formatCurrency(amount: number): string {
  if (!amount && amount !== 0) return "N/A";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + "...";
}

// Get all available video sources for a media item
export function getAllVideoSources(type: "movie" | "tv" | "anime", tmdbId: number, season?: number, episode?: number) {
  // Ensure tmdbId is a valid number and convert to string
  const tmdbIdStr = String(tmdbId).trim();
  
  if (!tmdbIdStr || isNaN(Number(tmdbIdStr))) {
    console.error('Invalid TMDB ID:', tmdbId);
    return { primary: "", alternatives: [] };
  }
  
  // For TV shows, validate season and episode
  let seasonNum = 0, episodeNum = 0;
  if (type === "tv" && season !== undefined && episode !== undefined) {
    seasonNum = Number(season);
    episodeNum = Number(episode);
    
    if (isNaN(seasonNum) || isNaN(episodeNum) || seasonNum < 1 || episodeNum < 1) {
      console.error('Invalid season or episode:', season, episode);
      return { primary: "", alternatives: [] };
    }
  }
  
  // Create sources object
  const sources: { primary: string; alternatives: string[] } = {
    primary: "",
    alternatives: []
  };
  
  // Generate URLs for movies
  if (type === "movie") {
    // Primary source
    sources.primary = `https://vidsrc.me/embed/movie?tmdb=${tmdbIdStr}`;
    
    // Alternative sources
    sources.alternatives = [
      `https://player.videasy.net/movie/${tmdbIdStr}`,
      `https://www.2embed.cc/embed/${tmdbIdStr}`,
      `https://vidsrc.to/embed/movie/${tmdbIdStr}`,
      `https://2embed.org/embed/movie/${tmdbIdStr}`
    ];
  }
  // Generate URLs for TV shows
  else if (type === "tv" && seasonNum > 0 && episodeNum > 0) {
    // Primary source
    sources.primary = `https://vidsrc.me/embed/tv?tmdb=${tmdbIdStr}&season=${seasonNum}&episode=${episodeNum}`;
    
    // Alternative sources
    sources.alternatives = [
      `https://player.videasy.net/tv/${tmdbIdStr}/season/${seasonNum}/episode/${episodeNum}`,
      `https://www.2embed.cc/embedtv/${tmdbIdStr}&s=${seasonNum}&e=${episodeNum}`,
      `https://vidsrc.to/embed/tv/${tmdbIdStr}/${seasonNum}/${episodeNum}`,
      `https://2embed.org/embed/tv/${tmdbIdStr}/${seasonNum}/${episodeNum}`
    ];
  }
  
  return sources;
}

// Generate video embed URL for different servers (legacy function for backward compatibility)
export function generateVidsrcEmbed(type: "movie" | "tv" | "anime", tmdbId: number, season?: number, episode?: number, server: number = 1): string {
  const sources = getAllVideoSources(type, tmdbId, season, episode);
  
  if (!sources.primary && sources.alternatives.length === 0) {
    return "";
  }
  
  // Server selection (1-based index)
  if (server === 1) {
    return sources.primary; // Now vidsrc.me
  } else if (server === 2) {
    // Videasy player format based on media type
    if (type === "movie") {
      return `https://player.videasy.net/movie/${tmdbId}`;
    } else if (type === "tv" && season !== undefined && episode !== undefined) {
      return `https://player.videasy.net/tv/${tmdbId}/season/${season}/episode/${episode}`;
    } else if (type === "anime" && season !== undefined && episode !== undefined) {
      return `https://player.videasy.net/tv/${tmdbId}/season/${season}/episode/${episode}`;
    }
    return ""; // Return empty if parameters are missing
  } else if (server === 3 && sources.alternatives.length >= 2) {
    return sources.alternatives[1]; // 2embed.cc
  } else if (server === 4 && sources.alternatives.length >= 1) {
    return sources.alternatives[0]; // Now vidsrc.to
  }
  
  // Fallback to primary if server selection is invalid
  return sources.primary;
}

// Get anime embed URL for 2EMBEDD server
export function getAnimeEmbedUrl(animeTitle: string, episodeNumber: number): string {
  if (!animeTitle || isNaN(episodeNumber) || episodeNumber < 1) {
    console.error('Invalid anime title or episode number:', animeTitle, episodeNumber);
    return "";
  }
  
  // Format anime title for URL (lowercase, replace spaces with hyphens)
  const formattedTitle = animeTitle.toLowerCase().replace(/\s+/g, '-');
  
  return `https://www.2embed.cc/embedanime/${formattedTitle}-episode-${episodeNumber}`;
}

// Check if media is Filipino R-18
export function isFilipinoPinoyAdult(media: any): boolean {
  // Check if the media is from the Philippines
  const isFilipino = media.origin_country?.includes('PH') || 
                     media.production_countries?.some((country: any) => country.iso_3166_1 === 'PH');
  
  // Check if the media is adult content
  const isAdult = media.adult === true || 
                 (media.release_dates?.results?.some((release: any) => 
                   release.certification === 'R-18' || 
                   release.certification === 'X' || 
                   release.certification === 'R')
                 );
  
  return isFilipino && isAdult;
}

// Check if media is Korean TV
export function isKoreanTV(media: any): boolean {
  return media.original_language === 'ko' && media.media_type === 'tv';
}

// Check if media is Anime
export function isAnime(media: any): boolean {
  return media.original_language === 'ja' && 
         (media.genres?.some((genre: any) => genre.id === 16) || 
          media.genre_ids?.includes(16));
}
