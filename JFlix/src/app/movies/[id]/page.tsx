import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import MovieDetailClient from './MovieDetailClient';
import { isVivamaxContent } from '@/lib/utils/ageRestriction';
import fs from 'fs';
import path from 'path';

// Generate static params for all movie IDs
export async function generateStaticParams() {
  try {
    // Read content.json to get all movie IDs
    const contentPath = path.join(process.cwd(), 'content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    // Extract movie IDs from various categories
    const movieIds = new Set();
    
    // Process categories that contain movies
    const movieCategories = ['trending', 'nowPlayingMovies', 'upcomingMovies', 'popularMovies'];
    
    movieCategories.forEach(category => {
      if (contentData.find(c => c.category === category)) {
        const items = contentData.find(c => c.category === category).items || [];
        items.forEach(item => {
          if (item.type === 'movie' || !item.type) {
            movieIds.add(item.id.toString());
          }
        });
      }
    });
    
    // Return array of params objects
    return Array.from(movieIds).map(id => ({
      id: id.toString()
    }));
  } catch (error) {
    console.error('Error generating static params for movies:', error);
    return [];
  }
}

// Fetch movie details
async function getMovieDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=648c004c97b5a1425c702528ab88ddac&language=en-US`,
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  
  return res.json();
}

// Fetch videos
async function getVideos(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=648c004c97b5a1425c702528ab88ddac&language=en-US`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

// Fetch cast and crew
async function getCredits(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=648c004c97b5a1425c702528ab88ddac&language=en-US`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

// Fetch similar movies
async function getSimilar(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=648c004c97b5a1425c702528ab88ddac&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

// Fetch recommendations
async function getRecommendations(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=648c004c97b5a1425c702528ab88ddac&language=en-US&page=1`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

// Server component to fetch data
export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  // Fetch movie details first to check if it's Vivamax content
  const movie = await getMovieDetails(params.id);
  
  // Check if this is Vivamax content
  if (isVivamaxContent(movie)) {
    // If it's Vivamax content, redirect to the Vivamax page
    redirect('/pinoy-adult');
  }
  
  // Fetch the rest of the data in parallel
  const [videos, credits, similar, recommendations] = await Promise.all([
    getVideos(params.id),
    getCredits(params.id),
    getSimilar(params.id),
    getRecommendations(params.id),
  ]);
  
  // Extract trailer
  const trailer = videos.results?.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
  
  // Extract cast (limit to 10)
  const cast = credits.cast?.slice(0, 10) || [];
  
  // Extract director
  const director = credits.crew?.find((person: any) => person.job === 'Director');
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieDetailClient
        movie={movie}
        trailer={trailer}
        cast={cast}
        director={director}
        similar={similar.results || []}
        recommendations={recommendations.results || []}
      />
    </Suspense>
  );
}
