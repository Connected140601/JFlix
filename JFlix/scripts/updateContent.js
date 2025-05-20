const axios = require("axios");
const fs = require("fs");

const TMDB_API_KEY = "648c004c97b5a1425c702528ab88ddac";
const OUTPUT_FILE = "content.json"; // change this to your DB or page file
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Add a console message to indicate which version is running
console.log("Running enhanced content update script with multiple video sources");

const endpoints = {
  trending: `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`,
  nowPlayingMovies: `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}`,
  upcomingMovies: `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}`,
  popularMovies: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`,
  popularTV: `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}`,
  topRatedTV: `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}`,
  koreanTV: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ko&sort_by=popularity.desc`,
  anime: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_keywords=210024|287501&sort_by=popularity.desc`, // anime keywords
  newAnime: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_keywords=210024|287501&sort_by=first_air_date.desc`, // newest anime
};

// Image URL helper function similar to the one used in the website
const getImageUrl = (path, size = 'original') => {
  if (!path || path === 'null' || path === 'undefined' || path === 'false') {
    // Return appropriate placeholder based on size
    if (size.includes('w300') || size.includes('w185')) {
      // Profile placeholder (square)
      return 'https://via.placeholder.com/300x300/222222/cccccc?text=No+Profile';
    } else if (size.includes('w500')) {
      // Poster placeholder (2:3 aspect ratio)
      return 'https://via.placeholder.com/500x750/222222/cccccc?text=No+Poster';
    } else {
      // Backdrop placeholder (16:9 aspect ratio)
      return 'https://via.placeholder.com/1920x1080/222222/cccccc?text=No+Backdrop';
    }
  }
  // Use a direct URL format that Next.js Image component can handle better
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Function to generate embed URLs from multiple sources for better reliability
const getVideoEmbeds = (media) => {
  const { media_type, id } = media;
  const isMovie = media_type === "movie" || media.title;
  const mediaType = isMovie ? "movie" : "tv";
  
  // Primary and backup video sources
  return {
    // Primary source
    primary: `https://vidsrc.to/embed/${mediaType}/${id}`,
    
    // Alternative sources
    alternatives: [
      `https://vidsrc.me/embed/${mediaType}/${id}`,
      `https://videasy.co/embed/${mediaType}/${id}`,
      `https://2embed.org/embed/${mediaType}/${id}`,
      `https://player.videasy.net/${mediaType}/${id}${!isMovie ? '/season/1/episode/1' : ''}`,
    ]
  };
};

async function fetchAndSaveContent() {
  try {
    let allContent = [];
    let successCount = 0;
    let errorCount = 0;
    const startTime = new Date();
    
    console.log(`🔄 Starting content update at ${startTime.toLocaleString()}`);
    console.log(`📊 Fetching data from ${Object.keys(endpoints).length} categories...`);

    for (const [label, url] of Object.entries(endpoints)) {
      try {
        console.log(`⏳ Fetching ${label}...`);
        const res = await axios.get(url);
        
        if (!res.data || !res.data.results || !Array.isArray(res.data.results)) {
          throw new Error(`Invalid response format for ${label}`);
        }
        
        const items = res.data.results.slice(0, 20).map((item) => {
          const mediaType = item.media_type || (item.title ? "movie" : "tv");
          const videoSources = getVideoEmbeds({
            media_type: mediaType,
            id: item.id,
          });
          
          // Enhanced metadata
          return {
            id: item.id,
            title: item.title || item.name,
            original_title: item.original_title || item.original_name || item.title || item.name,
            overview: item.overview,
            poster: getImageUrl(item.poster_path, 'w500'),
            backdrop: getImageUrl(item.backdrop_path, 'w1280'),
            type: mediaType,
            release_date: item.release_date || item.first_air_date,
            vote_average: item.vote_average,
            popularity: item.popularity,
            adult: item.adult || false,
            genre_ids: item.genre_ids || [],
            origin_country: item.origin_country || [],
            original_language: item.original_language,
            embedUrl: videoSources.primary, // For backward compatibility
            videoSources: videoSources, // New field with all sources
            last_updated: new Date().toISOString()
          };
        });

        allContent.push({ 
          category: label, 
          items,
          total_results: res.data.total_results || items.length,
          total_pages: res.data.total_pages || 1,
          fetch_time: new Date().toISOString()
        });
        
        successCount++;
        console.log(`✅ Successfully fetched ${items.length} items for ${label}`);
      } catch (categoryError) {
        errorCount++;
        console.error(`❌ Error fetching ${label}: ${categoryError.message}`);
        // Still add the category with empty items to maintain structure
        allContent.push({ 
          category: label, 
          items: [],
          error: categoryError.message,
          fetch_time: new Date().toISOString()
        });
      }
    }

    // Add metadata about the update
    const metadata = {
      last_updated: new Date().toISOString(),
      categories_count: Object.keys(endpoints).length,
      success_count: successCount,
      error_count: errorCount,
      duration_ms: new Date() - startTime
    };
    
    // Save the existing content as backup
    try {
      if (fs.existsSync(OUTPUT_FILE)) {
        const backupFile = `${OUTPUT_FILE}.backup.${new Date().toISOString().replace(/:/g, '-')}`;
        fs.copyFileSync(OUTPUT_FILE, backupFile);
        console.log(`📦 Created backup of existing content at ${backupFile}`);
      }
    } catch (backupError) {
      console.error(`⚠️ Warning: Could not create backup: ${backupError.message}`);
    }

    // Write the new content with metadata
    fs.writeFileSync(
      OUTPUT_FILE, 
      JSON.stringify([...allContent, { category: 'metadata', metadata }], null, 2)
    );
    
    const endTime = new Date();
    console.log(`✅ Content update completed at ${endTime.toLocaleString()}`);
    console.log(`📊 Summary: ${successCount} categories successful, ${errorCount} categories failed`);
    console.log(`⏱️ Total duration: ${metadata.duration_ms}ms`);
    console.log(`💾 Content saved to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`❌ Critical error during content update: ${err.message}`);
    console.error(err.stack);
  }
}

fetchAndSaveContent();
