const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Retrieves cached data from localStorage if it's not expired.
 * @param {string} cacheKey - The unique key for the cached item.
 * @returns {object|null} The cached data or null if not found or expired.
 */
function getCachedData(cacheKey) {
    const cachedItem = localStorage.getItem(cacheKey);
    if (!cachedItem) {
        return null;
    }

    try {
        const { data, timestamp } = JSON.parse(cachedItem);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
            // console.log(`[ApiCache] Cache hit for ${cacheKey}`);
            return data;
        }
        // console.log(`[ApiCache] Cache expired for ${cacheKey}`);
        localStorage.removeItem(cacheKey); // Remove expired item
        return null;
    } catch (error) {
        console.error(`[ApiCache] Error parsing cached data for ${cacheKey}:`, error);
        localStorage.removeItem(cacheKey); // Remove corrupted item
        return null;
    }
}

/**
 * Stores data in localStorage with a timestamp.
 * @param {string} cacheKey - The unique key for the cached item.
 * @param {object} data - The data to cache.
 */
function setCachedData(cacheKey, data) {
    if (data === undefined || data === null) {
        console.warn(`[ApiCache] Attempted to cache undefined/null data for ${cacheKey}. Skipping.`);
        return;
    }
    try {
        const itemToCache = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
        // console.log(`[ApiCache] Data cached for ${cacheKey}`);
    } catch (error) {
        console.error(`[ApiCache] Error caching data for ${cacheKey}:`, error);
        // This could be due to localStorage being full or other issues.
    }
}

// Example usage (will be in other files):
// async function fetchTrendingMovies() {
//     const cacheKey = 'tmdb_trending_movies';
//     let movies = getCachedData(cacheKey);
//     if (movies) {
//         return movies;
//     }

//     // const response = await fetch('API_ENDPOINT_HERE');
//     // movies = await response.json();
//     // setCachedData(cacheKey, movies);
//     // return movies;
// }
