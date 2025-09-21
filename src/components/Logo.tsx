import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 36, textSize: 'text-sm', logoSize: 'w-8 h-8' },
    md: { width: 160, height: 48, textSize: 'text-base', logoSize: 'w-10 h-10' },
    lg: { width: 200, height: 60, textSize: 'text-lg', logoSize: 'w-12 h-12' }
  };

  const currentSize = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image 
        src="/image/logos/logo.png"
        alt="MutluGünüm.com Logo"
        width={120}
        height={36}
        className="object-contain"
        style={{ height: 'auto', maxWidth: '120px', filter: 'brightness(0.9)' }}
        priority
      />
    </Link>
  );
}