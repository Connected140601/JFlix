'use client';

import { useState } from 'react';
import { FiX, FiCoffee, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-[var(--secondary)] rounded-lg shadow-xl w-full max-w-md overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <FiCoffee className="text-[var(--primary)]" size={20} />
                <h2 className="text-xl font-semibold text-white">Support JFlix</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-300 mb-4">
                  Thank you for supporting JFlix! Your donation helps maintain and improve the service.
                </p>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h3 className="text-[var(--primary)] font-medium mb-2">GCash Account Details</h3>
                  <div className="space-y-2 text-white">
                    <p><span className="text-gray-400">Account Number:</span> 09761679955</p>
                    <p><span className="text-gray-400">Account Name:</span> Jxxxel S.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-medium px-6 py-3 rounded-md transition-colors"
                >
                  <FiHeart />
                  <span>Thank You!</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
