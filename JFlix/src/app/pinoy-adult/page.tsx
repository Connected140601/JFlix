import { Suspense } from 'react';
import Link from 'next/link';
import MediaSection from '@/components/media/MediaSection';
import { FiAlertTriangle } from 'react-icons/fi';
import AgeRestricted from '@/components/auth/AgeRestricted';
import { 
  filterForVivamaxContent, 
  filterForPinoyAdultContent, 
  filterForVivamaxOrPinoyAdult,
  markAgeRestrictedContent 
} from '@/lib/utils/ageRestriction';

async function getPinoyAdultMovies(page = 1) {
  // Make multiple API calls to ensure we get all Filipino adult content
  const searchTerms = [
    'pinoy adult',
    'filipino adult',
    'pilipino adult',
    'tagalog adult',
    'vivamax',
    'viva films adult',
    'pinay adult',
    'manila adult',
    'philippines adult',
    'pinoy bold',
    'filipino bold',
    'pinoy r-18',
    'filipino r-18'
  ];
  
  const requests = [
    // Original language Filipino with adult flag
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=648c004c97b5a1425c702528ab88ddac&with_original_language=tl&include_adult=true&page=${page}`,
      { next: { revalidate: 3600 } }
    ),
    // Search for all Filipino adult keywords
    ...searchTerms.map(term => 
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=648c004c97b5a1425c702528ab88ddac&query=${encodeURIComponent(term)}&include_adult=true&page=${page}`,
        { next: { revalidate: 3600 } }
      )
    )
  ];
  
  try {
    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(res => res.ok ? res.json() : { results: [] }));
    
    // Combine all results
    const allResults = data.flatMap(d => d.results || []);
    
    // Remove duplicates by ID
    const uniqueResults = Array.from(new Map(allResults.map(movie => [movie.id, movie])).values());
    
    // Filter to include only R-18 Filipino adult content and exclude R-16 content
    const adultMovies = uniqueResults
      .filter((movie: any) => {
        // Check if the movie is R-16 by looking at the title or overview
        const isR16 = 
          (movie.title && movie.title.toLowerCase().includes('r-16')) ||
          (movie.overview && movie.overview.toLowerCase().includes('r-16')) ||
          (movie.title && movie.title.toLowerCase().includes('r16')) ||
          (movie.overview && movie.overview.toLowerCase().includes('r16'));
          
        // Check specifically for "R-16 Netflix Outside"
        const isR16NetflixOutside = 
          (movie.title && movie.title.toLowerCase().includes('netflix outside')) ||
          (movie.overview && movie.overview.toLowerCase().includes('netflix outside'));
        
        // Skip R-16 movies and "R-16 Netflix Outside"
        if (isR16 || isR16NetflixOutside) return false;
        
        // Check if it's a non-Filipino adult movie (we want to exclude these)
        const nonFilipinoAdultTerms = ['japanese adult', 'korean adult', 'chinese adult', 'thai adult'];
        for (const term of nonFilipinoAdultTerms) {
          if ((movie.title && movie.title.toLowerCase().includes(term)) ||
              (movie.overview && movie.overview.toLowerCase().includes(term))) {
            return false;
          }
        }
        
        // Include if it's marked as adult OR has Filipino keywords OR is from Vivamax
        return movie.adult === true || 
          (movie.original_language === 'tl') ||
          (movie.title && (
            movie.title.toLowerCase().includes('vivamax') ||
            movie.title.toLowerCase().includes('pinoy') ||
            movie.title.toLowerCase().includes('filipino') ||
            movie.title.toLowerCase().includes('pilipino')
          )) ||
          (movie.overview && (
            movie.overview.toLowerCase().includes('filipino') ||
            movie.overview.toLowerCase().includes('pinoy') ||
            movie.overview.toLowerCase().includes('pilipino') ||
            movie.overview.toLowerCase().includes('vivamax')
          ));
      })
      .map((movie: any) => ({
        ...movie,
        title: movie.title.includes('R-18') ? movie.title : `${movie.title} (R-18)`,
        is_r18: true
      }));
    
    return adultMovies;
  } catch (error) {
    console.error('Error fetching Pinoy adult movies:', error);
    return [];
  }
}

async function getPopularPinoyAdultMovies() {
  // Get all Pinoy adult movies first
  const allMovies = await getPinoyAdultMovies(1);
  
  // Sort by popularity
  return allMovies
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 20); // Limit to top 20 most popular
}

async function getRecentPinoyAdultMovies() {
  // Get all Pinoy adult movies first
  const allMovies = await getPinoyAdultMovies(1);
  
  // Sort by release date (newest first)
  return allMovies
    .sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || '2000-01-01');
      const dateB = new Date(b.release_date || '2000-01-01');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 20); // Limit to 20 most recent
}

// Function to get Filipino movies that are specifically labeled as adult content
async function getFilipinoBoldMovies() {
  // Get all Pinoy adult movies first
  const allMovies = await getPinoyAdultMovies(1);
  
  // Filter for movies with specific Filipino adult keywords in the title
  // and ensure they're not R-16 movies
  return allMovies
    .filter((movie: any) => {
      const title = movie.title.toLowerCase();
      const overview = (movie.overview || '').toLowerCase();
      
      // Skip R-16 movies and "R-16 Netflix Outside"
      if (title.includes('r-16') || title.includes('r16') || 
          overview.includes('r-16') || overview.includes('r16') ||
          title.includes('netflix outside') || overview.includes('netflix outside')) {
        return false;
      }
      
      return (
        title.includes('bold') ||
        title.includes('pinay') ||
        title.includes('pinoy adult') ||
        title.includes('filipino adult') ||
        title.includes('pilipino adult') ||
        (movie.adult === true && movie.original_language === 'tl')
      );
    })
    .slice(0, 20); // Limit to 20 movies
}

// Function to search specifically for Vivamax content
async function searchVivamaxMovies() {
  // Search terms specific to Vivamax
  const searchTerms = [
    'vivamax',
    'viva max',
    'viva films',
    'viva adult',
    'viva international',
    'viva artists',
    'viva entertainment'
  ];
  
  const requests = searchTerms.map(term => 
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=648c004c97b5a1425c702528ab88ddac&query=${encodeURIComponent(term)}&include_adult=true&page=1`,
      { next: { revalidate: 3600 } }
    )
  );
  
  try {
    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map(res => res.ok ? res.json() : { results: [] }));
    
    // Combine all results
    const allResults = data.flatMap(d => d.results || []);
    
    // Remove duplicates by ID
    const uniqueResults = Array.from(new Map(allResults.map(movie => [movie.id, movie])).values());
    
    // Use our utility function to mark and filter for Vivamax content
    const markedMovies = uniqueResults.map(movie => markAgeRestrictedContent(movie));
    const vivamaxMovies = markedMovies.filter(movie => movie.is_vivamax);
    
    return vivamaxMovies;
  } catch (error) {
    console.error('Error fetching Vivamax movies:', error);
    return [];
  }
}

// Wrapper component for client-side age verification
const VivamaxContent = ({ all, popular, recent, filipinoBold, vivamax }: any) => {
  return (
    <AgeRestricted redirectPath="/" strictVerification={true}>
      <div className="container-fluid py-8">
        {/* Age warning banner */}
        <div className="bg-red-900/80 rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <FiAlertTriangle size={24} className="text-yellow-300 flex-shrink-0" />
            <div>
              <h2 className="text-white font-bold text-lg">Age-Restricted Content (R-18)</h2>
              <p className="text-gray-200 text-sm">This page contains adult content intended for viewers 18 years and older.</p>
            </div>
          </div>
          <div className="text-sm text-gray-300 pl-9">
            <p className="mb-2">By proceeding, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are at least 18 years of age</li>
              <li>You are legally permitted to access adult content in your jurisdiction</li>
              <li>You understand that JFlix does not host any content and only provides links to third-party servers</li>
            </ul>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Vivamax</h1>
        <p className="text-gray-400 mb-8">
          Explore Filipino adult content from Vivamax. All titles are R-18 rated and intended for mature audiences only.
        </p>

        {all.length === 0 && popular.length === 0 && recent.length === 0 ? (
          <div className="container-fluid py-12 text-center">
            <p className="text-xl text-gray-400">
              No Vivamax content is currently available. Please check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Filipino Bold Movies Section with special styling */}
            {filipinoBold.length > 0 && (
              <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Filipino Bold Movies (R-18)</h2>
                    <p className="text-sm text-gray-200 mt-1">Authentic Filipino adult cinema with local stars</p>
                  </div>
                  <MediaSection title="" items={filipinoBold} />
                </div>
              </Suspense>
            )}
            
            {/* Vivamax Section with special styling */}
            {vivamax.length > 0 && (
              <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-red-900 to-purple-900 rounded-lg p-6 mb-4 shadow-xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">Vivamax Original Movies</h2>
                        <p className="text-gray-200 text-sm md:text-base">
                          Exclusive Filipino adult content from Vivamax. All titles are R-18 rated.
                        </p>
                        <Link href="/vivamax" className="inline-block mt-3 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          View All Vivamax Content
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full">
                        <FiAlertTriangle className="text-red-400" />
                        <span className="text-white text-sm font-medium">Adult Content</span>
                      </div>
                    </div>
                  </div>
                  <MediaSection title="" items={vivamax} />
                </div>
              </Suspense>
            )}
            
            {popular.length > 0 && (
              <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
                <MediaSection title="Popular Vivamax Movies" items={popular} />
              </Suspense>
            )}
            
            {recent.length > 0 && (
              <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
                <MediaSection title="Recently Released" items={recent} />
              </Suspense>
            )}
            
            {all.length > 0 && (
              <Suspense fallback={<div className="h-60 bg-gray-900/50 animate-pulse mt-8"></div>}>
                <MediaSection title="All Vivamax Movies" items={all} />
              </Suspense>
            )}
          </>
        )}
      </div>
    </AgeRestricted>
  );
};

// Server component to fetch data
export default async function VivamaxPage() {
  // Fetch different Pinoy adult movie categories in parallel
  const [allPinoyAdult, popularPinoyAdult, recentPinoyAdult, filipinoBold, directVivamax] = await Promise.all([
    getPinoyAdultMovies(),
    getPopularPinoyAdultMovies(),
    getRecentPinoyAdultMovies(),
    getFilipinoBoldMovies(),
    searchVivamaxMovies(),
  ]);

  // Filter to only include Vivamax OR Pinoy adult R-18 content
  // This ensures we only show Pinoy adult R-18 movies and Vivamax content
  // and remove any non-Pinoy R-18 and non-Vivamax movies
  const all = filterForVivamaxOrPinoyAdult(allPinoyAdult);
  const popular = filterForVivamaxOrPinoyAdult(popularPinoyAdult);
  const recent = filterForVivamaxOrPinoyAdult(recentPinoyAdult);
  
  // Filipino Bold section should only show Filipino adult content
  const filteredFilipinoBold = filterForPinoyAdultContent(filipinoBold);
  
  // Direct Vivamax search results are already filtered for Vivamax content
  const vivamax = directVivamax;

  // Return the client component with the fetched data
  return <VivamaxContent 
    all={all} 
    popular={popular} 
    recent={recent} 
    filipinoBold={filteredFilipinoBold} 
    vivamax={vivamax} 
  />;
}
