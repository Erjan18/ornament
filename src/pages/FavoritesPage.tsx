import { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { supabase, type Pattern } from '../lib/supabase';
import { SESSION_ID } from '../lib/session';
import PatternCard from '../components/PatternCard';
import OrnamentDivider from '../components/OrnamentDivider';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface FavoritesPageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function FavoritesPage({ favorites, onToggleFavorite, onNavigate }: FavoritesPageProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setPatterns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('patterns')
      .select('*, category:categories(*)')
      .in('id', favorites)
      .then(res => {
        if (res.data) setPatterns(res.data as Pattern[]);
        setLoading(false);
      });
  }, [favorites]);

  const clearAllFavorites = async () => {
    await supabase
      .from('favorites')
      .delete()
      .eq('session_id', SESSION_ID);
    favorites.forEach(id => onToggleFavorite(id));
  };

  return (
    <div className="min-h-screen bg-cream-100 pt-16 animate-fade-in">
      {/* Header */}
      <div className="bg-burgundy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Избранное</h1>
          <OrnamentDivider />
          <p className="text-cream-300 mt-4">
            {favorites.length > 0 ? `${favorites.length} сохранённых узоров` : 'Сохранённые узоры'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-square" />
            ))}
          </div>
        ) : patterns.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-burgundy-300" />
            </div>
            <h2 className="font-display text-2xl text-gray-600 mb-3">Избранное пусто</h2>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto">
              Добавляйте понравившиеся узоры, нажимая на сердечко в карточках
            </p>
            <button onClick={() => onNavigate('catalog')} className="btn-primary">
              Перейти в каталог
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">{patterns.length} узоров</p>
              <button
                onClick={clearAllFavorites}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={14} />
                Очистить всё
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {patterns.map(pattern => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
