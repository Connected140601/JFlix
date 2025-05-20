'use client';

import { useState, useEffect, useRef } from 'react';
import { FiShare2, FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa';

interface CompactShareButtonProps {
  title: string;
  mediaType: 'movie' | 'tv' | 'anime';
  id: string | number;
  className?: string;
}

export default function CompactShareButton({ title, mediaType, id, className = '' }: CompactShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Get the current URL or construct it based on the media type and ID
  const getShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jflix.streaming';
    
    // Map anime to tvshows for URL construction
    const urlMediaType = mediaType === 'anime' ? 'tvshows' : `${mediaType}s`;
    return `${baseUrl}/${urlMediaType}/${id}`;
  };
  
  const shareUrl = getShareUrl();
  const shareText = `Check out ${title} on JFlix!`;
  
  // Social media share URLs with metadata
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  
  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          dialogRef.current && 
          buttonRef.current &&
          !dialogRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    // Add event listener when dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Copy to clipboard function
  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Open share dialog
  const toggleShareDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  // Open share link in a new window
  const shareToSocial = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="relative inline-block" style={{ zIndex: 999 }}>
      <button
        ref={buttonRef}
        onClick={toggleShareDialog}
        className={`text-white p-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition-colors shadow-lg ${className}`}
        aria-label="Share"
      >
        <FiShare2 size={16} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/70 z-[9998]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
            aria-hidden="true"
          />
          
          {/* Share dialog */}
          <div 
            ref={dialogRef}
            className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
          >
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">{title}</h3>
              <button 
                onClick={(e) => toggleShareDialog(e)}
                className="text-gray-400 hover:text-white"
                aria-label="Close share dialog"
              >
                <FiX size={16} />
              </button>
            </div>
            
            {/* Content Link with Copy Feature */}
            <div className="mb-3 bg-gray-900/50 p-2 rounded-lg">
              <div className="text-xs text-gray-300 mb-1">Share this {mediaType}:</div>
              <div className="relative">
                <div className="flex items-center bg-gray-700 rounded-md overflow-hidden border border-[var(--primary)]">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-grow bg-transparent text-xs p-2 outline-none text-white font-medium"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                {/* Large prominent copy button */}
                <button
                  onClick={(e) => copyToClipboard(e)}
                  className="w-full mt-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <>
                      <FiCheck size={16} className="text-white" /> 
                      <span className="font-medium text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={16} /> 
                      <span className="font-medium text-sm">Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-300 mb-1">Share on social media:</div>
            <div className="flex justify-center space-x-3 mb-1">
              <button
                onClick={(e) => shareToSocial(facebookShareUrl, e)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <FaFacebook size={16} />
              </button>
              <button
                onClick={(e) => shareToSocial(twitterShareUrl, e)}
                className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter size={16} />
              </button>
              <button
                onClick={(e) => shareToSocial(whatsappShareUrl, e)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp size={16} />
              </button>
              <button
                onClick={(e) => shareToSocial(telegramShareUrl, e)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                aria-label="Share on Telegram"
              >
                <FaTelegram size={16} />
              </button>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
