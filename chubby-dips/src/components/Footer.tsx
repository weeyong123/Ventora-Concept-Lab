import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { ChubbyDipsLogo } from './ChubbyDipsLogo';

interface FooterProps { onOpenMenu: () => void; onNavigate: (sectionId: string) => void; }

export const Footer: React.FC<FooterProps> = ({ onOpenMenu, onNavigate }) => <footer className="relative bg-gradient-to-br from-[#4A1D16] via-[#5A2119] to-[#30100C] text-[#FFF8F4] px-4 sm:px-6 lg:px-10 py-10 sm:py-12 overflow-hidden">
  <div className="absolute inset-0 bg-sprinkles-white opacity-[.06]"/>
  <div className="max-w-[1380px] mx-auto relative z-10 grid md:grid-cols-12 gap-8 items-center">
    <div className="md:col-span-4"><button onClick={()=>onNavigate('home')} className="text-left"><ChubbyDipsLogo variant="dark" size="md" /></button></div>
    <div className="md:col-span-4 text-center"><p className="font-script text-3xl sm:text-4xl text-[#FBCFE8] font-bold leading-tight">Same Great Desserts.<br/>A Sweeter Tomorrow. ♡</p></div>
    <div className="md:col-span-4 flex flex-col md:items-end gap-4"><nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold justify-center md:justify-end"><button onClick={()=>onNavigate('home')}>Home</button><button onClick={onOpenMenu}>Menu</button><button onClick={()=>onNavigate('about')}>About</button><button onClick={()=>onNavigate('catering')}>Catering</button><button onClick={()=>onNavigate('contact')}>Contact</button></nav><div className="flex items-center gap-3"><a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center"><Instagram className="w-4 h-4"/></a><a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center"><Facebook className="w-4 h-4"/></a></div><p className="text-[11px] text-white/60">© 2026 Chubby Dips. Concept redesign.</p></div>
  </div>
</footer>;
