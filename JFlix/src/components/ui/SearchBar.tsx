'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiX, FiFilm, FiTv, FiAlertTriangle } from 'react-icons/fi';
import { getImageUrl } from '@/lib/api/tmdb';
import { isAgeRestricted, processMoviesForAgeRestriction, filterVivamaxContent } from '@/lib/utils/ageRestriction';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
}

const SearchBar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the Vivamax page
  const isVivamaxPage = pathname?.includes('/pinoy-adult') || false;

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Direct to search page without age verification
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  // Fetch search results as user types
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=648c004c97b5a1425c702528ab88ddac&query=${encodeURIComponent(
            searchQuery.trim()
          )}&page=1`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await res.json();
        // Filter out person results and limit to 5 results
        const initialResults = data.results
          .filter((item: SearchResult) => item.media_type !== 'person')
          .slice(0, 5);
        
        // Process results to mark age restricted content
        const processedResults = processMoviesForAgeRestriction(initialResults);
        
        // Filter out Vivamax content unless we're on the Vivamax page
        const finalResults = isVivamaxPage 
          ? processedResults 
          : filterVivamaxContent(processedResults);
        
        setResults(finalResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchResults();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, isVivamaxPage]);

  // Close results dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format release date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="relative" ref={searchRef}>

      
      {/* Search Input */}
      <div className={`search-container ${isMobile ? 'w-full' : 'w-[220px] md:w-[280px]'}`}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder={isMobile ? "Search JFlix..." : "Search for movies, TV shows..."}
            className={`w-full bg-black/30 border border-gray-700 rounded-full py-2 pl-10 pr-4 ${isMobile ? 'text-base py-3' : 'text-sm py-2'} text-white placeholder-gray-400 focus:outline-none focus:border-gray-500`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={isMobile ? 18 : 16} />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-0 top-0 h-full flex items-center justify-center w-10 text-gray-400 hover:text-[var(--primary)]"
              aria-label="Clear search"
            >
              <FiX size={isMobile ? 18 : 16} />
            </button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {showResults && searchQuery.trim().length >= 2 && (
          <div className={`absolute mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50 ${isMobile ? 'max-h-[70vh]' : 'max-h-[80vh]'} overflow-y-auto`}>
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-pulse flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce delay-100"></div>
                  <div className="w-4 h-4 bg-gray-700 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        // Direct navigation to content without age verification
                        router.push(`/${item.media_type === 'movie' ? 'movies' : 'tvshows'}/${item.id}`);
                        setShowResults(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors cursor-pointer active:bg-gray-700"
                    >
                      {/* Poster or Placeholder */}
                      <div className={`${isMobile ? 'w-14 h-20' : 'w-12 h-16'} bg-gray-800 rounded overflow-hidden flex-shrink-0 relative`}>
                        {item.poster_path ? (
                          <Image
                            src={getImageUrl(item.poster_path, 'w92')}
                            alt={item.title || item.name || ''}
                            width={isMobile ? 56 : 48}
                            height={isMobile ? 80 : 64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            {item.media_type === 'movie' ? (
                              <FiFilm className="text-gray-500" size={isMobile ? 24 : 20} />
                            ) : (
                              <FiTv className="text-gray-500" size={isMobile ? 24 : 20} />
                            )}
                          </div>
                        )}
                        {isAgeRestricted(item) && (
                          <div className="absolute top-0 right-0 bg-red-800 text-white text-[8px] px-1 py-0.5 font-bold">
                            R-18
                          </div>
                        )}
                      </div>
                      
                      {/* Title and Info */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${isMobile ? 'text-base' : 'text-sm'} truncate`}>
                            {item.title || item.name}
                          </h4>
                          {isAgeRestricted(item) && (
                            <span className="flex-shrink-0 bg-red-800 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                              <FiAlertTriangle size={10} />
                              R-18
                            </span>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 bg-gray-800 rounded text-gray-300 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                            {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                          </span>
                          {isAgeRestricted(item) && (
                            <span className="flex items-center gap-1 text-xs border border-red-800/50 px-1.5 py-0.5 rounded-sm text-red-400">
                              <FiAlertTriangle size={10} />
                              Adult Content
                            </span>
                          )}
                          {(item.release_date || item.first_air_date) && (
                            <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-400`}>
                              {formatDate(item.release_date || item.first_air_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View All Results Button */}
                <div className="border-t border-gray-800">
                  <button
                    onClick={() => {
                      // Direct to search page without age verification
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowResults(false);
                    }}
                    className="w-full p-3 text-center text-sm text-[var(--primary)] hover:bg-gray-800 transition-colors active:bg-gray-700"
                  >
                    View all results
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-400">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
