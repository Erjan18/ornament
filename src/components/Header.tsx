import { useState } from 'react';
import { Menu, X, Heart, Search } from 'lucide-react';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  favoritesCount: number;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Главная', page: 'home' },
  { label: 'Каталог', page: 'catalog' },
  { label: 'История', page: 'history' },
  { label: 'Галерея', page: 'gallery' },
  { label: 'О проекте', page: 'about' },
];

export default function Header({ currentPage, onNavigate, favoritesCount }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-burgundy-900/95 backdrop-blur-sm border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-6 h-6 fill-burgundy-900">
                <path d="M20 4 L28 12 L36 12 L36 20 L28 28 L20 36 L12 28 L4 20 L4 12 L12 12 Z" />
                <circle cx="20" cy="20" r="5" fill="none" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-gold-400 font-display font-bold text-base leading-tight">Кыргыз Узорлору</div>
              <div className="text-cream-200 text-xs opacity-70">Национальные узоры</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-cream-200 hover:text-gold-400 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('catalog')}
              className="p-2 text-cream-200 hover:text-gold-400 transition-colors"
              aria-label="Поиск"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => onNavigate('favorites')}
              className="relative p-2 text-cream-200 hover:text-gold-400 transition-colors"
              aria-label="Избранное"
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-burgundy-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-cream-200 hover:text-gold-400 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-burgundy-950/98 border-t border-gold-500/20 animate-fade-in">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-cream-200 hover:text-gold-400 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('favorites'); setMobileOpen(false); }}
              className="px-4 py-3 rounded-lg text-left text-sm font-medium text-cream-200 hover:text-gold-400 hover:bg-white/5 flex items-center gap-2"
            >
              <Heart size={16} />
              Избранное
              {favoritesCount > 0 && (
                <span className="ml-auto bg-gold-500 text-burgundy-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
