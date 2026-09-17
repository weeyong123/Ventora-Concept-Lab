import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CateringSection } from './components/CateringSection';
import { VisitContactSection } from './components/VisitContactSection';
import { Footer } from './components/Footer';
import { MenuModal } from './components/MenuModal';
import { OrderModal } from './components/OrderModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types';
import { Heart, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedInitialTreat, setSelectedInitialTreat] = useState<string | undefined>(undefined);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['choc-strawberries', 'strawberry-delight']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
      showToast('Removed from your favorites');
    } else {
      setFavorites([...favorites, productId]);
      showToast('Saved to your celebration favorites! ♡');
    }
  };

  const handleOpenOrderWithTreat = (treatName?: string) => {
    setSelectedInitialTreat(treatName);
    setIsOrderOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = sectionId === 'about' ? 'catering' : sectionId;
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F4] text-[#2B1410] font-sans selection:bg-[#F87171]/20 selection:text-[#881337]">
      {toastMessage && (
        <div id="toast-notification" className="fixed bottom-6 right-6 z-50 bg-[#2B1410] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-sweet-lg flex items-center gap-2 border border-[#7A2E22] animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="w-4 h-4 text-[#FCA5A5]" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-1 text-neutral-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {favorites.length > 0 && (
        <div id="floating-favorites-indicator" className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#FBD6DA] shadow-sweet text-xs font-bold text-[#9E1236]">
          <Heart className="w-4 h-4 fill-[#E11D48] text-[#E11D48]" />
          <span>{favorites.length} Favorites saved</span>
          <button onClick={() => setIsMenuOpen(true)} className="ml-1 text-[#2B1410] hover:underline">View</button>
        </div>
      )}
      <Header onOpenMenu={() => setIsMenuOpen(true)} onOpenOrder={(treat) => handleOpenOrderWithTreat(treat)} onNavigate={handleNavigate} activeSection={activeSection} />
      <main className="flex-1">
        <Hero onOpenMenu={() => setIsMenuOpen(true)} onOpenOrder={() => handleOpenOrderWithTreat()} />
        <ProductGrid onSelectProduct={(product) => setActiveProductModal(product)} onQuickOrder={(product) => handleOpenOrderWithTreat(product.name)} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
        <CateringSection onOpenCatering={() => handleOpenOrderWithTreat('Custom Celebration Cake')} />
        <VisitContactSection />
      </main>
      <Footer onOpenMenu={() => setIsMenuOpen(true)} onNavigate={handleNavigate} />
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onSelectProduct={(product) => setActiveProductModal(product)} onRequestOrder={(treat) => handleOpenOrderWithTreat(treat)} />
      <OrderModal isOpen={isOrderOpen} onClose={() => { setIsOrderOpen(false); setSelectedInitialTreat(undefined); }} initialTreat={selectedInitialTreat} />
      <ProductDetailModal product={activeProductModal} onClose={() => setActiveProductModal(null)} isFavorited={activeProductModal ? favorites.includes(activeProductModal.id) : false} onToggleFavorite={(id) => handleToggleFavorite(id)} onOrderProduct={(prod) => handleOpenOrderWithTreat(prod.name)} />
    </div>
  );
}
