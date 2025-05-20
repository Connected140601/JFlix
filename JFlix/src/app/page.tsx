import { Suspense } from 'react';
import HeroBanner from '@/components/media/HeroBanner';
import MediaSection from '@/components/media/MediaSection';
import { filterVivamaxContent } from '@/lib/utils/ageRestriction';

async function getTrendingMedia() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=648c004c97b5a1425c702528ab88ddac`,
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch trending media');
  }
  
  const data = await res.json();
  return data.results;
}

async function getPopularMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=648c004c97b5a1425c702528ab88ddac`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  
  const data = await res.json();
  return data.results;
}

async function getPopularTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=648c004c97b5a1425c702528ab88ddac`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch popular TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

async function getKoreanTVShows() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=ko`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch Korean TV shows');
  }
  
  const data = await res.json();
  return data.results;
}

async function getAnime() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=648c004c97b5a1425c702528ab88ddac&with_genres=16&with_original_language=ja`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch anime');
  }
  
  const data = await res.json();
  return data.results;
}

async function getPinoyAdultMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=tl&include_adult=true`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch Pinoy adult movies');
  }
  
  const data = await res.json();
  // Filter to only include adult content
  const adultMovies = data.results.filter((movie: any) => movie.adult === true);
  return adultMovies;
}

export default async function Home() {
  // Fetch data in parallel
  const [trending, movies, tvShows, koreanTV, anime] = await Promise.all([
    getTrendingMedia(),
    getPopularMovies(),
    getPopularTVShows(),
    getKoreanTVShows(),
    getAnime(),
  ]);

  // Filter out Vivamax content from all sections
  const filteredTrending = filterVivamaxContent(trending);
  const filteredMovies = filterVivamaxContent(movies);
  const filteredTVShows = filterVivamaxContent(tvShows);
  const filteredKoreanTV = filterVivamaxContent(koreanTV);
  const filteredAnime = filterVivamaxContent(anime);

  // Get top 5 trending items for hero banner
  const heroItems = filteredTrending.slice(0, 5);

  return (
    <>
      <Suspense fallback={<div className="h-[70vh] bg-gray-900 animate-pulse"></div>}>
        <HeroBanner items={heroItems} />
      </Suspense>

      <div className="pb-10">
        <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
          <MediaSection title="Trending Now" items={filteredTrending} />
        </Suspense>
        
        <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
          <MediaSection title="Popular Movies" items={filteredMovies} viewAllLink="/movies" />
        </Suspense>
        
        <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
          <MediaSection title="Popular TV Shows" items={filteredTVShows} viewAllLink="/tvshows" />
        </Suspense>
        
        <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
          <MediaSection title="Korean TV Shows" items={filteredKoreanTV} viewAllLink="/korean-tv" />
        </Suspense>
        
        <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
          <MediaSection title="Anime" items={filteredAnime} viewAllLink="/anime" />
        </Suspense>
      </div>
    </>
  );
}
