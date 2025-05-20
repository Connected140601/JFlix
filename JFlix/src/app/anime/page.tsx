import { Suspense } from 'react';
import MediaSection from '@/components/media/MediaSection';

async function getAnime(page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch anime');
  }
  
  const data = await res.json();
  return data.results;
}

// Get new and ongoing anime series for the Popular section
async function getNewAndOngoingAnime() {
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  // Get date from 3 months ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
  
  // Fetch anime that has aired in the last 3 months and is still airing
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja&air_date.gte=${threeMonthsAgoStr}&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch new and ongoing anime');
  }
  
  const data = await res.json();
  
  // Filter to prioritize currently airing shows
  const results = data.results.sort((a: any, b: any) => {
    // Check if the show is currently airing (has a first_air_date but no last_air_date)
    const aIsAiring = a.first_air_date && (!a.last_air_date || new Date(a.last_air_date) > new Date());
    const bIsAiring = b.first_air_date && (!b.last_air_date || new Date(b.last_air_date) > new Date());
    
    if (aIsAiring && !bIsAiring) return -1;
    if (!aIsAiring && bIsAiring) return 1;
    return b.popularity - a.popularity;
  });
  
  return results;
}

async function getTopRatedAnime() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=100`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch top rated anime');
  }
  
  const data = await res.json();
  return data.results;
}

async function getRecentAnime() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja&sort_by=first_air_date.desc`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch recent anime');
  }
  
  const data = await res.json();
  return data.results;
}

// Function to get anime movies
async function getAnimeMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch anime movies');
  }
  
  const data = await res.json();
  return data.results;
}

export default async function AnimePage() {
  // Fetch different anime categories in parallel
  const [all, newAndOngoing, topRated, recent, animeMovies] = await Promise.all([
    getAnime(),
    getNewAndOngoingAnime(),
    getTopRatedAnime(),
    getRecentAnime(),
    getAnimeMovies(),
  ]);

  return (
    <div className="pt-8">
      <div className="container-fluid">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Anime</h1>
        <p className="text-gray-400 mb-8">
          Discover the best anime from Japan. From action to romance, explore the colorful world of Japanese animation.
        </p>
      </div>

      {/* New and Ongoing Anime Section */}
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <div className="mb-8">
          <div className="container-fluid mb-4">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">New & Ongoing Anime Series</h2>
              <p className="text-sm text-gray-200 mt-1">Latest releases and currently airing anime series</p>
            </div>
          </div>
          <MediaSection title="" items={newAndOngoing} />
        </div>
      </Suspense>
      
      {/* Anime Movies Section */}
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <div className="mb-8">
          <div className="container-fluid mb-4">
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Anime Movies</h2>
              <p className="text-sm text-gray-200 mt-1">Feature-length anime films from Japan</p>
            </div>
          </div>
          <MediaSection title="" items={animeMovies} />
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Top Rated Anime" items={topRated} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Recently Released" items={recent} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="All Anime" items={all} />
      </Suspense>
    </div>
  );
}
