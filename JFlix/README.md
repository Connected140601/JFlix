# JFlix - Modern Streaming Website

JFlix is a feature-rich streaming platform built with Next.js and the TMDB API. It offers a modern, responsive interface for browsing and streaming movies, TV shows, Korean TV, anime, and Pinoy Adult R-18 content.

## Features

- **Modern Design**: Clean, responsive UI with smooth animations and intuitive navigation
- **Multiple Content Categories**:
  - Movies
  - TV Shows
  - Korean TV Shows
  - Anime
  - Pinoy Adult Movies (R-18 Only)
- **Enhanced Search**: Search across all content types with filtering options
- **Detailed Content Pages**: Each title includes synopsis, hero banner, trailer, cast information, and similar content suggestions
- **Multiple Streaming Servers**: Choose between different streaming sources for optimal playback
- **TV Show Episode Management**: Browse seasons and episodes with detailed information
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop devices

## Technology Stack

- **Framework**: Next.js 15.3.2 with Turbopack
- **Styling**: Tailwind CSS
- **UI Libraries**: Headless UI, Heroicons, Framer Motion
- **Data Source**: TMDB API
- **Streaming Sources**: Vidsrc.me and Videasy.net (embedded players)
- **Media Player**: React Player
- **Icons**: React Icons

## GitHub Deployment Guide

This project is configured to be GitHub-friendly by excluding the `node_modules` directory from version control. This approach is the industry standard and ensures your repository stays lightweight while maintaining all functionality.

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### For Developers: Working with this Repository

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/JFlix.git
   cd JFlix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
   This will create the `node_modules` folder locally based on the package.json file.

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **View the website**
   Open [http://localhost:3000](http://localhost:3000) with your browser (or another port if 3000 is in use).

### Making Changes & Pushing to GitHub

1. **Make your changes to the codebase**

2. **Test your changes locally**
   ```bash
   npm run dev
   ```

3. **Commit and push your changes**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
   The `.gitignore` file is already configured to exclude `node_modules`, so only your source code will be pushed.

4. **For deployment**: When you or others clone this repository, they'll need to run `npm install` to recreate the `node_modules` folder locally.

## API Integration

This project uses the TMDB API for fetching movie and TV show data. The API key is already included in the code for demonstration purposes, but in a production environment, you should use environment variables to secure your API keys.

## Streaming Sources

JFlix integrates with two streaming sources:

1. **Vidsrc.me**:
   ```
   https://vidsrc.me/embed/movie?tmdb={TMDB_ID}
   https://vidsrc.me/embed/tv?tmdb={TMDB_ID}&season={SEASON_NUMBER}&episode={EPISODE_NUMBER}
   ```

2. **Videasy.net**:
   ```
   https://player.videasy.net/movie/{TMDB_ID}
   https://player.videasy.net/tv/{TMDB_ID}/season/{SEASON_NUMBER}/episode/{EPISODE_NUMBER}
   ```

## Disclaimer

This project is for educational purposes only. JFlix does not host any content on its servers. All media content is provided by third-party services through embedded players. The developers of JFlix are not responsible for the content displayed.

## License

This project is open source and available under the MIT License.
