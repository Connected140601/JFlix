// Navbar scroll behavior for all pages
document.addEventListener('DOMContentLoaded', () => {
  // Initial check for scroll position
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    // Add scrolled class by default to ensure consistent appearance across all pages
    navbar.classList.add('scrolled');
    
    // Handle scroll events
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        // Only remove the scrolled class on the homepage and other pages with banners
        const isHomePage = window.location.pathname === '/' || 
                          window.location.pathname === '/index.html' ||
                          document.querySelector('.banner') !== null;
        
        if (isHomePage) {
          navbar.classList.remove('scrolled');
        }
      }
    });
    
    // Trigger scroll event to set initial state
    window.dispatchEvent(new Event('scroll'));
  }

  // Check for 'open_search' query parameter on page load
  const urlParams = new URLSearchParams(window.location.search);
  const openSearch = urlParams.get('open_search');

  if (openSearch === 'true') {
    // Ensure openSearchModal function exists and is callable
    if (typeof openSearchModal === 'function') {
        // Attempt to open the modal
        try {
            openSearchModal();
            // Optionally, focus the search input if it's a known ID
            // Use the ID of the search input within the main search modal, not the navbar one.
            const searchInputInModal = document.querySelector('#search-modal #search-input'); 
            if (searchInputInModal) {
                searchInputInModal.focus();
            }
        } catch (e) {
            console.error("Error trying to open search modal or focus input: ", e);
        }
    } else {
        console.warn("openSearchModal function not found, cannot open search modal automatically.");
    }
  }

  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      const icon = hamburger.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        hamburger.setAttribute('aria-expanded', 'true');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  } else {
    if (!hamburger) console.warn("Hamburger menu button not found.");
    if (!navLinks) console.warn("Nav links container not found for hamburger menu.");
  }
});
