/**
 * Utility functions for age restriction and content rating
 * Includes functions for identifying and filtering Vivamax and Pinoy adult content
 */

/**
 * Determines if content is age restricted (R-18 or 19+)
 */
export const isAgeRestricted = (movie: any): boolean => {
  if (!movie) return false;
  
  // Check for explicit R-18 flag
  if (movie.is_r18 === true) return true;
  
  // Check title and overview for R-18 or 19+ indicators
  const title = (movie.title || movie.name || '').toLowerCase();
  const overview = (movie.overview || '').toLowerCase();
  const genres = movie.genre_ids || movie.genres || [];
  
  // First check if this is R-16 content (which should NOT be age restricted)
  if (title.includes('r-16') || title.includes('r16') || 
      overview.includes('r-16') || overview.includes('r16')) {
    return false;
  }
  
  // Check if movie has adult flag set to true
  if (movie.adult === true) return true;
  
  // Check for R-18 or similar indicators in title or overview
  const restrictedTerms = [
    'r-18', 'r18', 'r-rated', 'rated r',
    'adult only', 'adults only', '18+', '19+',
    'explicit content', 'adult content',
    'vivamax', 'viva adult', 'mature',
    'uncensored', 'uncut', 'erotic', 'erotica',
    'sex', 'sexual', 'nude', 'nudity', 'sensual',
    'bomba', 'bomba film', 'bold star', 'bold movie'
  ];
  
  // Check if movie title or overview contains restricted terms
  for (const term of restrictedTerms) {
    if (title.includes(term) || overview.includes(term)) {
      // Double check it's not an R-16 movie with similar keywords
      if (title.includes('r-16') || title.includes('r16') || 
          overview.includes('r-16') || overview.includes('r16')) {
        return false;
      }
      return true;
    }
  }
  
  // Check for Filipino adult content indicators
  const filipinoAdultTerms = [
    'pinoy adult', 'filipino adult', 'pilipino adult',
    'pinoy bold', 'filipino bold', 'pinay adult',
    'tagalog adult', 'manila adult', 'philippines adult',
    'pinoy r-18', 'filipino r-18', 'pinay bold'
  ];
  
  for (const term of filipinoAdultTerms) {
    if (title.includes(term) || overview.includes(term)) {
      // Double check it's not an R-16 movie with similar keywords
      if (title.includes('r-16') || title.includes('r16') || 
          overview.includes('r-16') || overview.includes('r16')) {
        return false;
      }
      return true;
    }
  }
  
  // Check for adult genre IDs (TMDB genre ID for adult content)
  const adultGenreIds = [genres.some((g: any) => {
    const genreId = typeof g === 'object' ? g.id : g;
    return genreId === 7521; // Adult genre ID in TMDB
  })];
  
  if (adultGenreIds.includes(true)) {
    return true;
  }
  
  // Check for content rating if available
  if (movie.content_rating && typeof movie.content_rating === 'string') {
    const rating = movie.content_rating.toLowerCase();
    
    // Explicitly exclude R-16 content
    if (rating.includes('r-16') || rating.includes('r16')) {
      return false;
    }
    
    // Check for R-18 and adult content ratings
    if (rating.includes('r-18') || rating.includes('r18') || 
        rating.includes('nc-17') || rating.includes('x') || 
        rating.includes('adult') || rating.includes('19+') || 
        rating.includes('18+')) {
      return true;
    }
  }
  
  return false;
};

/**
 * Determines if content is from Vivamax
 */
export const isVivamaxContent = (movie: any): boolean => {
  if (!movie) return false;
  
  // Check if movie has vivamax flag set to true
  if (movie.is_vivamax === true) return true;
  
  // Check title and overview for Vivamax indicators
  const title = (movie.title || movie.name || '').toLowerCase();
  const overview = (movie.overview || '').toLowerCase();
  
  // Check for Vivamax indicators in title or overview
  const vivamaxTerms = [
    'vivamax', 'viva max', 'viva films', 'viva adult',
    'viva international', 'viva artists', 'viva entertainment'
  ];
  
  for (const term of vivamaxTerms) {
    if (title.includes(term) || overview.includes(term)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Add R-18 and Vivamax flags to movie object
 */
export const markAgeRestrictedContent = (movie: any): any => {
  if (!movie) return movie;
  
  const isRestricted = isAgeRestricted(movie);
  const isVivamax = isVivamaxContent(movie);
  
  return {
    ...movie,
    is_r18: isRestricted,
    is_vivamax: isVivamax
  };
};

/**
 * Process an array of movies to mark age restricted content
 */
export const processMoviesForAgeRestriction = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  return movies.map(movie => markAgeRestrictedContent(movie));
};

/**
 * Filter out Vivamax content from movie lists
 * Use this on all pages except the Vivamax page
 */
export const filterVivamaxContent = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  // First mark all movies with proper flags
  const markedMovies = processMoviesForAgeRestriction(movies);
  
  // Then filter out Vivamax content
  return markedMovies.filter(movie => !movie.is_vivamax);
};

/**
 * Determines if content is Pinoy/Filipino adult content (R-18)
 */
export const isPinoyAdultContent = (movie: any): boolean => {
  if (!movie) return false;
  
  // Check if movie has pinoy_adult flag set to true
  if (movie.is_pinoy_adult === true) return true;
  
  // Check if it's age restricted first
  if (!isAgeRestricted(movie)) return false;
  
  // Check title and overview for Filipino indicators
  const title = (movie.title || movie.name || '').toLowerCase();
  const overview = (movie.overview || '').toLowerCase();
  
  // Check for Filipino indicators
  const filipinoTerms = [
    'pinoy', 'filipino', 'pilipino', 'tagalog', 'manila',
    'philippines', 'pinay', 'silip', 'pelikula', 'bomba',
    'bold', 'kiskisan', 'sikil', 'tuhog', 'kaliwaan',
    'scorpio nights', 'viva films', 'vivamax'
  ];
  
  // Check if original language is Tagalog/Filipino
  if (movie.original_language === 'tl' || movie.original_language === 'fil') {
    return true;
  }
  
  // Check if production country is Philippines
  if (movie.production_countries && Array.isArray(movie.production_countries)) {
    for (const country of movie.production_countries) {
      if (country.iso_3166_1 === 'PH' || country.name === 'Philippines') {
        return true;
      }
    }
  }
  
  // Check for Filipino terms in title or overview
  for (const term of filipinoTerms) {
    if (title.includes(term) || overview.includes(term)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Mark movie as Pinoy adult content
 */
export const markPinoyAdultContent = (movie: any): any => {
  if (!movie) return movie;
  
  const isPinoyAdult = isPinoyAdultContent(movie);
  
  return {
    ...movie,
    is_pinoy_adult: isPinoyAdult
  };
};

/**
 * Process movies to mark Pinoy adult content
 */
export const processMoviesForPinoyAdult = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  // First mark age restriction and Vivamax
  const markedMovies = processMoviesForAgeRestriction(movies);
  
  // Then mark Pinoy adult
  return markedMovies.map(movie => markPinoyAdultContent(movie));
};

/**
 * Filter specifically for Vivamax content
 * Use this on the Vivamax page
 */
export const filterForVivamaxContent = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  // First mark all movies with proper flags
  const markedMovies = processMoviesForPinoyAdult(movies);
  
  // Then filter for only Vivamax content
  return markedMovies.filter(movie => movie.is_vivamax);
};

/**
 * Filter specifically for Pinoy adult R-18 content
 * Use this on the Vivamax page
 */
export const filterForPinoyAdultContent = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  // First mark all movies with proper flags
  const markedMovies = processMoviesForPinoyAdult(movies);
  
  // Then filter for only Pinoy adult content
  return markedMovies.filter(movie => movie.is_pinoy_adult && movie.is_r18);
};

/**
 * Filter for Vivamax OR Pinoy adult R-18 content
 * Use this on the Vivamax page to show both types of content
 */
export const filterForVivamaxOrPinoyAdult = (movies: any[]): any[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  // First mark all movies with proper flags
  const markedMovies = processMoviesForPinoyAdult(movies);
  
  // Then filter for Vivamax OR Pinoy adult content
  return markedMovies.filter(movie => movie.is_vivamax || (movie.is_pinoy_adult && movie.is_r18));
};
