import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 36, textSize: 'text-sm' },
    md: { width: 160, height: 48, textSize: 'text-base' },
    lg: { width: 200, height: 60, textSize: 'text-lg' }
  };

  const currentSize = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        {/* Logo Circle */}
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          {/* Heart Icon */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            className="text-white"
          >
            <path 
              d="M8 13c-1-1-4-3.5-4-6 0-1.5 1.2-2.8 2.8-2.8 0.8 0 1.5 0.3 1.8 0.8 0.3-0.5 1-0.8 1.8-0.8 1.6 0 2.8 1.3 2.8 2.8 0 2.5-3 5-4 6z" 
              fill="currentColor"
            />
          </svg>
        </div>
        
        {/* Sparkle */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ${currentSize.textSize}`}>
            MutluGünüm
          </span>
          <span className="text-xs text-gray-500 -mt-1">
            Organizasyon
          </span>
        </div>
      )}
    </Link>
  );
}