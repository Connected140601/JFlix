'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--secondary)] py-10 mt-16 pb-safe">
      <div className="container-fluid">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 gap-y-10">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <div className="font-bold text-2xl">
                  <span className="text-white">J</span>
                  <span className="text-[var(--primary)]">F</span>
                  <span className="text-[var(--primary)]">lix</span>
                </div>
                <span className="text-xs text-gray-300 italic">"Kiss it Real!"</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Your ultimate streaming platform for Movies, TV Shows, Korean TV, Anime, and Pinoy Adult content.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tvshows" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/korean-tv" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Korean TV
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/pinoy-adult" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Vivamax
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-400 hover:text-[var(--primary)] text-sm transition-colors block py-1">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-5 mb-4">
              <a href="https://www.facebook.com/profile.php?id=61576333379034" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--primary)] transition-colors p-2 -m-2">
                <FiFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--primary)] transition-colors p-2 -m-2">
                <FiTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--primary)] transition-colors p-2 -m-2">
                <FiInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--primary)] transition-colors p-2 -m-2">
                <FiGithub size={24} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Stay updated with our latest releases and features.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <p className="text-gray-400 text-sm md:text-base">
            &copy; {currentYear} <span className="text-white">J</span><span className="text-[var(--primary)]">F</span><span className="text-[var(--primary)]">lix</span>. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-3 px-4 md:px-0">
            This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
