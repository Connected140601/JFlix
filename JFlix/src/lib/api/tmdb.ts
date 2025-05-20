import axios from 'axios';

// TMDB API configuration
const API_KEY = '648c004c97b5a1425c702528ab88ddac';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Error handling
const handleApiError = (error: any, fallbackMessage: string) => {
  console.error('TMDB API Error:', error);
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(`TMDB API Error: ${error.response.status} - ${error.response.data.status_message || fallbackMessage}`);
  }
  throw new Error(fallbackMessage);
};

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image URL helper functions with better fallbacks
export const getImageUrl = (path: string | null, size: string = 'original'): string => {
  // Check if path is valid
  if (!path || path === 'null' || path === 'undefined' || path === 'false') {
    // Return appropriate placeholder based on size
    if (size.includes('w300') || size.includes('w185')) {
      // Profile placeholder (square)
      return 'https://image.tmdb.org/t/p/w300/wwemzKWzjKYJFfCeiB57q3r4Bcm.png';
    } else if (size.includes('w500')) {
      // Poster placeholder (2:3 aspect ratio)
      return 'https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg';
    } else {
      // Backdrop placeholder (16:9 aspect ratio)
      return 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';
    }
  }
  
  // Use a direct URL format that Next.js Image component can handle better
  try {
    // Make sure the path starts with a slash
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}/${size}${formattedPath}`;
  } catch (error) {
    console.error('Error formatting image URL:', error);
    // Return fallback image from TMDB
    if (size.includes('w500')) {
      return 'https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg';
    } else {
      return 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg';
    }
  }
};

export const getPosterUrl = (path: string | null): string => getImageUrl(path, 'w500');
export const getBackdropUrl = (path: string | null): string => getImageUrl(path, 'original');
export const getProfileUrl = (path: string | null): string => getImageUrl(path, 'w300');

// API endpoints
export const fetchTrending = async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch trending ${mediaType}`);
    return { results: [] }; // Fallback empty results
  }
};

export const fetchMovies = async (category: 'popular' | 'top_rated' | 'upcoming' | 'now_playing' = 'popular', page: number = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${category}`, { params: { page } });
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch ${category} movies`);
    return { results: [] }; // Fallback empty results
  }
};

export const fetchTVShows = async (category: 'popular' | 'top_rated' | 'on_the_air' | 'airing_today' = 'popular', page: number = 1) => {
  try {
    const response = await tmdbApi.get(`/tv/${category}`, { params: { page } });
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch ${category} TV shows`);
    return { results: [] }; // Fallback empty results
  }
};

export const fetchMovieDetails = async (id: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch movie details for ID: ${id}`);
    throw error; // Re-throw to handle in the UI
  }
};

export const fetchTVDetails = async (id: number) => {
  try {
    const response = await tmdbApi.get(`/tv/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations,seasons',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch TV show details for ID: ${id}`);
    throw error; // Re-throw to handle in the UI
  }
};

export const fetchSeasonDetails = async (tvId: number, seasonNumber: number) => {
  const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
};

export const fetchEpisodeDetails = async (tvId: number, seasonNumber: number, episodeNumber: number) => {
  const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
  return response.data;
};

export const searchMulti = async (query: string, page: number = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: true, // Include adult content in search results
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Failed to search for "${query}"`);
    return { results: [] }; // Fallback empty results
  }
};

export const searchMovies = async (query: string, page: number = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export const searchTVShows = async (query: string, page: number = 1) => {
  const response = await tmdbApi.get('/search/tv', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

// Function to get Filipino R-18 movies
export const fetchFilipinoPinoyAdultMovies = async (page: number = 1) => {
  // Search for Filipino movies
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      with_original_language: 'tl', // Tagalog language code
      with_keywords: 'adult|erotic|sex', // Keywords for adult content
      include_adult: true,
      page,
    },
  });
  
  // Filter to only include R-18 rated movies
  const adultMovies = response.data.results.filter((movie: any) => {
    // Check if movie is adult content or has adult certification
    return movie.adult === true || 
           (movie.release_dates?.results?.some((release: any) => 
             release.certification === 'R-18' || 
             release.certification === 'X' || 
             release.certification === 'R')
           );
  });
  
  return {
    ...response.data,
    results: adultMovies,
  };
};

// Function to get Korean TV shows
export const fetchKoreanTVShows = async (page: number = 1) => {
  const response = await tmdbApi.get('/discover/tv', {
    params: {
      with_original_language: 'ko', // Korean language code
      page,
    },
  });
  return response.data;
};

// Function to get Anime TV shows
export const fetchAnime = async (page: number = 1) => {
  const response = await tmdbApi.get('/discover/tv', {
    params: {
      with_genres: '16', // Animation genre
      with_keywords: 'anime|japanese animation',
      with_original_language: 'ja', // Japanese language code
      page,
    },
  });
  return response.data;
};

export default {
  fetchTrending,
  fetchMovies,
  fetchTVShows,
  fetchMovieDetails,
  fetchTVDetails,
  fetchSeasonDetails,
  fetchEpisodeDetails,
  searchMulti,
  searchMovies,
  searchTVShows,
  fetchFilipinoPinoyAdultMovies,
  fetchKoreanTVShows,
  fetchAnime,
  getImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
};
