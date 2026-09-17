import React, { useState, useEffect } from 'react';
import { ChubbyDipsLogo } from './ChubbyDipsLogo';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenOrder: (initialType?: string) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenOrder,
  onNavigate,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu', action: () => onOpenMenu() },
    { id: 'about', label: 'About' },
    { id: 'catering', label: 'Catering' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header id="site-header" className="sticky top-0 z-40 transition-all duration-300">
      <div id="top-announcement-bar" className="bg-[#9E1236] text-[#FFF4EC] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FDE8DB] animate-pulse shrink-0" />
        <span>Houston Local Custom Desserts &amp; Catering • <strong>3–4 Day Lead Time</strong> for Custom Orders</span>
        <span className="hidden sm:inline opacity-75">| Pick up at 1100 Louisiana St.</span>
      </div>
      <nav id="main-nav" className={`w-full transition-all duration-300 ${isScrolled ? 'bg-[#FAF4EE]/95 backdrop-blur-md shadow-sweet py-3 border-b border-[#FBD6DA]/60' : 'bg-[#FAF4EE] py-4'}`}>
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          <button id="nav-logo-btn" onClick={() => onNavigate('home')} className="text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9E1236]/30 rounded-lg p-1 -m-1" aria-label="Chubby Dips Home">
            <ChubbyDipsLogo variant="light" size="md" />
          </button>
          <div className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => (
              <button key={link.id} id={`nav-link-${link.id}`} onClick={() => { if (link.action) link.action(); else onNavigate(link.id); }} className={`text-[15px] font-semibold tracking-normal transition-all duration-200 cursor-pointer relative py-1 hover:text-[#9E1236] ${activeSection === link.id ? 'text-[#9E1236] font-bold' : 'text-[#4A261F]'}`}>
                {link.label}
                {activeSection === link.id && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9E1236] rounded-full" />}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button id="header-view-menu-btn" onClick={onOpenMenu} className="px-5 py-2 rounded-full border-2 border-[#2B1410] text-[#2B1410] hover:bg-[#2B1410] hover:text-[#FFF8F4] text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer shadow-xs active:scale-95">View Menu</button>
            <button id="header-request-order-btn" onClick={() => onOpenOrder()} className="px-5 py-2 rounded-full bg-[#9E1236] hover:bg-[#830E2B] text-[#FFF8F4] text-sm font-bold tracking-tight transition-all duration-200 shadow-sm hover:shadow-sweet cursor-pointer flex items-center gap-1.5 active:scale-95"><Calendar className="w-4 h-4" />Request an Order</button>
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <button id="mobile-request-btn" onClick={() => onOpenOrder()} className="px-3 py-1.5 rounded-full bg-[#9E1236] text-[#FFF8F4] text-xs font-bold">Order</button>
            <button id="mobile-menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#4A261F] hover:text-[#9E1236] focus:outline-none" aria-label="Toggle Navigation Menu">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="sm:hidden bg-[#FFF8F4] border-t border-[#FBD6DA] px-5 py-4 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button key={link.id} id={`mobile-nav-${link.id}`} onClick={() => { setMobileMenuOpen(false); if (link.action) link.action(); else onNavigate(link.id); }} className={`text-left py-2 text-base font-semibold border-b border-[#FBD6DA]/40 ${activeSection === link.id ? 'text-[#9E1236]' : 'text-[#4A261F]'}`}>{link.label}</button>
              ))}
              <div className="pt-2 flex flex-col gap-2.5">
                <button id="mobile-drawer-view-menu" onClick={() => { setMobileMenuOpen(false); onOpenMenu(); }} className="w-full py-2.5 rounded-full border-2 border-[#2B1410] text-[#2B1410] text-sm font-bold text-center">View Menu</button>
                <button id="mobile-drawer-request-order" onClick={() => { setMobileMenuOpen(false); onOpenOrder(); }} className="w-full py-2.5 rounded-full bg-[#9E1236] text-[#FFF8F4] text-sm font-bold text-center flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />Request an Order</button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
