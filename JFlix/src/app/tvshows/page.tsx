import { Suspense } from 'react';
import MediaSection from '@/components/media/MediaSection';

async function getTVShows(category: string, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${category}?api_key=648c004c97b5a1425c702528ab88ddac&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${category} TV shows`);
  }
  
  const data = await res.json();
  return data.results;
}

export default async function TVShowsPage() {
  // Fetch different TV show categories in parallel
  const [popular, topRated, onTheAir, airingToday] = await Promise.all([
    getTVShows('popular'),
    getTVShows('top_rated'),
    getTVShows('on_the_air'),
    getTVShows('airing_today'),
  ]);

  return (
    <div className="pt-8">
      <div className="container-fluid">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">TV Shows</h1>
        <p className="text-gray-400 mb-8">
          Discover the best TV shows from around the world. From drama to comedy, we have all your favorite series.
        </p>
      </div>

      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Popular TV Shows" items={popular} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Top Rated TV Shows" items={topRated} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Currently Airing" items={onTheAir} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Airing Today" items={airingToday} />
      </Suspense>
    </div>
  );
}
