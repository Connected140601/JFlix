'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiCalendar, FiCheck, FiX } from 'react-icons/fi';

type AgeVerificationProps = {
  onVerified: () => void;
  onCancel: () => void;
};

const AgeVerification = ({ onVerified, onCancel }: AgeVerificationProps) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  // Generate options for days
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Months
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  // Generate options for years (from current year - 100 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 100 },
    (_, i) => currentYear - i
  );

  const verifyAge = () => {
    // Reset error
    setError('');
    
    // Validate inputs
    if (!day || !month || !year) {
      setError('Please complete your date of birth');
      return;
    }
    
    // Convert inputs to numbers
    const birthDay = parseInt(day, 10);
    const birthMonth = parseInt(month, 10);
    const birthYear = parseInt(year, 10);
    
    // Validate date
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const isValidDate = birthDate.getDate() === birthDay && 
                       birthDate.getMonth() === birthMonth - 1 && 
                       birthDate.getFullYear() === birthYear;
    
    if (!isValidDate) {
      setError('Please enter a valid date');
      return;
    }
    
    setIsVerifying(true);
    
    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const monthDiff = today.getMonth() - (birthMonth - 1);
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
      age--;
    }
    
    // Store verification in localStorage with expiration
    if (age >= 18) {
      // Set age verification in localStorage (expires in 30 days)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerifiedExpires', expirationDate.toISOString());
      
      // Call the onVerified callback
      setTimeout(() => {
        setIsVerifying(false);
        onVerified();
      }, 1000);
    } else {
      setIsVerifying(false);
      setError('You must be at least 18 years old to access this content');
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            Age Verification Required
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-5">
          <p className="text-sm text-gray-300">
            This content is restricted to adults 18 years or older. Please verify your age by entering your date of birth.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Day"
                >
                  <option value="">Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Month"
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Year"
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-md p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={verifyAge}
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiCheck className="mr-2" />
                  Verify My Age
                </span>
              )}
            </button>
            
            <button
              onClick={onCancel}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            By proceeding, you confirm that you are at least 18 years old and agree to view adult content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
