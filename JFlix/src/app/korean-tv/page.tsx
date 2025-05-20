import { Suspense } from 'react';
import MediaSection from '@/components/media/MediaSection';

async function getKoreanTVShows(page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=ko&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch Korean TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

async function getPopularKoreanTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=ko&sort_by=popularity.desc`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch popular Korean TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

async function getTopRatedKoreanTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=100`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch top rated Korean TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

async function getRecentKoreanTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=ko&sort_by=first_air_date.desc`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch recent Korean TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

export default async function KoreanTVPage() {
  // Fetch different Korean TV show categories in parallel
  const [all, popular, topRated, recent] = await Promise.all([
    getKoreanTVShows(),
    getPopularKoreanTVShows(),
    getTopRatedKoreanTVShows(),
    getRecentKoreanTVShows(),
  ]);

  return (
    <div className="pt-8">
      <div className="container-fluid">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Korean TV Shows</h1>
        <p className="text-gray-400 mb-8">
          Explore the best Korean dramas and TV shows. From romance to thriller, discover the world of K-dramas.
        </p>
      </div>

      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Top Rated Korean Shows" items={topRated} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Popular Korean Dramas" items={popular} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="Recently Released" items={recent} />
      </Suspense>
      
      <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
        <MediaSection title="All Korean TV Shows" items={all} />
      </Suspense>
    </div>
  );
}
