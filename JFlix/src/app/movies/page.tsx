import { Suspense } from 'react';
import MediaSection from '@/components/media/MediaSection';

async function getMovies(category: string, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${category}?api_key=648c004c97b5a1425c702528ab88ddac&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${category} movies`);
  }
  
  const data = await res.json();
  return data.results;
}

export default async function MoviesPage() {
  // Fetch different movie categories in parallel
  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getMovies('popular'),
    getMovies('top_rated'),
    getMovies('upcoming'),
    getMovies('now_playing'),
  ]);

  return (
    <div className="pt-8">
      <div className="container-fluid">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Movies</h1>
        <p className="text-gray-400 mb-8">
          Explore our vast collection of movies from around the world. From blockbusters to indie gems, we have something for everyone.
        </p>
      </div>

      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Popular Movies" items={popular} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Top Rated Movies" items={topRated} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Upcoming Movies" items={upcoming} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Now Playing" items={nowPlaying} />
      </Suspense>
    </div>
  );
}
