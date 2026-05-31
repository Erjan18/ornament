import { Heart } from 'lucide-react';
import type { Pattern } from '../lib/supabase';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface PatternCardProps {
  pattern: Pattern;
  isFavorite: boolean;
  onToggleFavorite: (patternId: string) => void;
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function PatternCard({ pattern, isFavorite, onToggleFavorite, onNavigate }: PatternCardProps) {
  return (
    <div className="card group cursor-pointer animate-fade-in">
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-square"
        onClick={() => onNavigate('pattern', pattern.id)}
      >
        <img
          src={pattern.image_url || 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'}
          alt={pattern.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        {pattern.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-burgundy-900/90 text-gold-400 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {pattern.category.name}
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(pattern.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 active:scale-90 ${
            isFavorite
              ? 'bg-burgundy-900 text-gold-400'
              : 'bg-white/80 text-gray-400 hover:bg-burgundy-900 hover:text-gold-400'
          }`}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => onNavigate('pattern', pattern.id)}
      >
        <h3 className="font-display font-semibold text-burgundy-900 text-lg leading-tight mb-1 group-hover:text-gold-600 transition-colors">
          {pattern.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {pattern.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gold-600 font-medium hover:text-gold-700 transition-colors">
            Подробнее →
          </span>
        </div>
      </div>
    </div>
  );
}
