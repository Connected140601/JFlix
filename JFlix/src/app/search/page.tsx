'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaCard from '@/components/media/MediaCard';
import AgeRestricted from '@/components/auth/AgeRestricted';
import { processMoviesForAgeRestriction, isAgeRestricted, filterVivamaxContent } from '@/lib/utils/ageRestriction';
import useAgeVerification from '@/lib/hooks/useAgeVerification';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const { isVerified } = useAgeVerification();
  const [hasAgeRestrictedContent, setHasAgeRestrictedContent] = useState<boolean>(false);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = mediaFilter === 'all' 
          ? 'multi' 
          : mediaFilter === 'movie' 
            ? 'movie' 
            : 'tv';
            
        const res = await fetch(
          `https://api.themoviedb.org/3/search/${endpoint}?api_key=648c004c97b5a1425c702528ab88ddac&query=${encodeURIComponent(query)}&page=${page}`
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await res.json();
        
        // Filter out person results if using multi search
        const filteredResults = mediaFilter === 'all'
          ? data.results.filter((item: SearchResult) => item.media_type !== 'person')
          : data.results;
        
        // Process results to mark age restricted content
        const processedResults = processMoviesForAgeRestriction(filteredResults);
        
        // Filter out Vivamax content from search results
        const nonVivamaxResults = filterVivamaxContent(processedResults);
        
        // Check if there's any age restricted content in the results
        const hasRestricted = nonVivamaxResults.some(item => isAgeRestricted(item));
        setHasAgeRestrictedContent(hasRestricted);
        
        setResults(nonVivamaxResults);
        setTotalPages(Math.ceil(nonVivamaxResults.length / 20)); // Adjust total pages based on filtered results
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('An error occurred while searching. Please try again.');
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, page, mediaFilter]);

  // Handle media type filter change
  const handleFilterChange = (filter: 'all' | 'movie' | 'tv') => {
    setMediaFilter(filter);
    setPage(1); // Reset to first page when changing filters
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render content with age verification if there's restricted content
  const renderContent = () => {
    return (
      <div className="container-fluid py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : 'Search'}
      </h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            mediaFilter === 'all'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('movie')}
          className={`px-4 py-2 rounded-full text-sm ${
            mediaFilter === 'movie'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => handleFilterChange('tv')}
          className={`px-4 py-2 rounded-full text-sm ${
            mediaFilter === 'tv'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          TV Shows
        </button>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12">
          {query ? (
            <>
              <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
              <p className="text-gray-400 mb-6">
                We couldn't find any matches for "{query}". Please try a different search term.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Search for Movies and TV Shows</h2>
              <p className="text-gray-400">
                Enter a search term in the search bar above to find your favorite content.
              </p>
            </>
          )}
        </div>
      )}
      
      {/* Results Grid */}
      {!loading && !error && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item) => {
              const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
              
              return (
                <div key={`${mediaType}-${item.id}`}>
                  <MediaCard
                    id={item.id}
                    title={item.title || item.name || 'Unknown Title'}
                    posterPath={item.poster_path}
                    mediaType={mediaType as 'movie' | 'tv'}
                    releaseDate={item.release_date || item.first_air_date}
                    voteAverage={item.vote_average}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    );
  };
  
  // Wrap with age verification if there's restricted content and user isn't verified
  return hasAgeRestrictedContent && !isVerified ? (
    <AgeRestricted redirectPath="/">
      {renderContent()}
    </AgeRestricted>
  ) : (
    renderContent()
  );
}
