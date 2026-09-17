import React from 'react';

interface ChubbyDipsLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChubbyDipsLogo: React.FC<ChubbyDipsLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const sizeClasses = { sm: 'scale-90', md: 'scale-100', lg: 'scale-110 md:scale-125' }[size];
  return (
    <div id="chubby-dips-logo" className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${sizeClasses} ${className}`}>
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1"><span className={`font-serif tracking-tight leading-none font-bold text-2xl sm:text-3xl transition-colors ${isDark ? 'text-[#FFF8F4]' : 'text-[#2B1410]'}`}>Chubby Dips</span></div>
        <span className={`text-[9px] sm:text-[10.5px] font-bold tracking-[0.2em] uppercase mt-0.5 transition-colors ${isDark ? 'text-[#E8B4B8]' : 'text-[#4A261F]'}`}>CUSTOM DESSERTS &amp; CATERING</span>
        <span className={`font-script text-base sm:text-lg leading-none -mt-0.5 transition-colors ${isDark ? 'text-[#FCA5A5]' : 'text-[#9E1236]'}`}>Houston, TX ♡</span>
      </div>
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 transition-transform duration-300 hover:rotate-3 hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill={isDark ? '#422018' : '#FFF0EA'} stroke={isDark ? '#7A0C2E' : '#FBD6DA'} strokeWidth="2" />
          <path d="M26 42C24 30 35 16 52 17C68 18 76 29 74 44C73 42 70 38 66 38C62 38 60 40 56 36C52 32 46 34 42 37C38 40 32 41 26 42Z" fill="#F6B846" stroke="#D69424" strokeWidth="1.5" />
          <path d="M36 22C42 16 56 16 63 20" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="50" cy="50" rx="22" ry="20" fill="#FFDFBA" />
          <path d="M38 31C43 28 50 28 54 31C49 32 44 33 38 31Z" fill="#F6B846" />
          <ellipse cx="36" cy="54" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" /><ellipse cx="64" cy="54" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" />
          <path d="M37 46C38 43 42 43 43 46" stroke="#2B1410" strokeWidth="2.2" strokeLinecap="round" /><path d="M57 46C58 43 62 43 63 46" stroke="#2B1410" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="40" cy="46" r="1.5" fill="#2B1410" /><circle cx="60" cy="46" r="1.5" fill="#2B1410" />
          <path d="M49 50C50 51.5 51 51.5 52 50" stroke="#E08B6B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 56C44 61 56 61 58 56" fill="#B91C1C" stroke="#2B1410" strokeWidth="1.8" strokeLinecap="round" /><path d="M45 56.5C47 58 53 58 55 56.5" fill="#FFFFFF" />
          <path d="M32 68C32 68 36 65 50 65C64 65 68 68 68 68L72 88C72 88 58 92 50 92C42 92 28 88 28 88L32 68Z" fill="#2563EB" />
          <rect x="36" y="66" width="5" height="18" rx="2" fill="#1D4ED8" /><rect x="59" y="66" width="5" height="18" rx="2" fill="#1D4ED8" /><circle cx="38.5" cy="80" r="1.8" fill="#FACC15" /><circle cx="61.5" cy="80" r="1.8" fill="#FACC15" />
          <g transform="translate(56, 56) rotate(10)"><path d="M12 8C14 4 22 4 24 8C26 12 24 20 18 25C12 20 10 12 12 8Z" fill="#E11D48" /><path d="M11 13C13 14 17 12 19 14C21 16 23 15 24 16C23.5 20 18 25 18 25C12 20 11.5 15 11 13Z" fill="#3E1A14" /><path d="M13 17C15 16 19 17 21 18" stroke="#FDE8DB" strokeWidth="1" strokeLinecap="round" /><path d="M14 20C16 19 18 21 20 21" stroke="#F43F5E" strokeWidth="0.8" strokeLinecap="round" /><path d="M18 7C17 4 19 2 20 1M18 7C15 6 13 8 13 8M18 7C19 6 23 7 23 7M18 7C17 9 18 10 18 10" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" /><ellipse cx="10" cy="18" rx="3.5" ry="3" fill="#FFDFBA" /></g>
        </svg>
      </div>
    </div>
  );
};
