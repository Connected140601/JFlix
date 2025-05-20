'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiAlertTriangle, FiCoffee } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/ui/SearchBar';
import AgeRestrictedLink from '@/components/auth/AgeRestrictedLink';
import SupportModal from '@/components/ui/SupportModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll event to change header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tvshows' },
    { name: 'Korean TV', path: '/korean-tv' },
    { name: 'Anime', path: '/anime' },
    { name: 'Vivamax', path: '/pinoy-adult' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMenuOpen
          ? 'bg-[var(--secondary)] shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <div className="flex items-center">
              <div className="font-bold text-2xl md:text-3xl">
                <span className="text-white">J</span>
                <span className="text-[var(--primary)]">F</span>
                <span className="text-[var(--primary)]">lix</span>
              </div>
            </div>
            <span className="text-xs text-gray-300 italic mt-0.5">"Kiss it Real!"</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              link.path === '/pinoy-adult' ? (
                <AgeRestrictedLink
                  key={link.path}
                  href={link.path}
                  className={cn(
                    'nav-link text-sm font-medium flex items-center',
                    pathname === link.path ? 'text-[var(--primary)]' : 'text-white'
                  )}
                >
                  <FiAlertTriangle className="mr-1" size={12} />
                  {link.name}
                </AgeRestrictedLink>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    'nav-link text-sm font-medium',
                    pathname === link.path ? 'text-[var(--primary)]' : 'text-white'
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Support, Search and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Buy me a Coffee Button - Desktop */}
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hidden md:flex items-center space-x-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              aria-label="Support JFlix"
            >
              <FiCoffee size={14} />
              <span>Buy me a Coffee</span>
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--secondary)] border-t border-gray-800 fixed left-0 right-0 top-16 bottom-0 overflow-y-auto z-50 pb-safe">
          <div className="container-fluid py-4">
            {/* Mobile Search */}
            <div className="mb-6 sticky top-0 z-10 bg-[var(--secondary)] pt-2 pb-4">
              <SearchBar isMobile={true} />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                link.path === '/pinoy-adult' ? (
                  <AgeRestrictedLink
                    key={link.path}
                    href={link.path}
                    className={cn(
                      'nav-link text-base font-medium py-5 flex items-center justify-between border-b border-gray-800',
                      pathname === link.path ? 'text-[var(--primary)]' : 'text-white'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiAlertTriangle className="mr-3" size={18} />
                      <span className="text-lg">{link.name}</span>
                    </div>
                    <span className="text-gray-500">›</span>
                  </AgeRestrictedLink>
                ) : (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      'nav-link text-base font-medium py-5 flex items-center justify-between border-b border-gray-800',
                      pathname === link.path ? 'text-[var(--primary)]' : 'text-white'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">{link.name}</span>
                    <span className="text-gray-500">›</span>
                  </Link>
                )
              ))}
              
              {/* Buy me a Coffee Button - Mobile */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSupportModalOpen(true);
                }}
                className="flex items-center justify-between w-full text-base font-medium py-5 border-b border-gray-800 text-[var(--primary)]"
              >
                <div className="flex items-center">
                  <FiCoffee size={18} className="mr-3" />
                  <span className="text-lg">Buy me a Coffee</span>
                </div>
                <span className="text-[var(--primary)]">›</span>
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Support Modal */}
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
