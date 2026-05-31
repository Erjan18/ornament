import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Tag, BookOpen, Sparkles, Wrench } from 'lucide-react';
import { supabase, type Pattern, type PatternImage } from '../lib/supabase';
import OrnamentDivider from '../components/OrnamentDivider';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface PatternDetailPageProps {
  patternId: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function PatternDetailPage({ patternId, favorites, onToggleFavorite, onNavigate }: PatternDetailPageProps) {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [images, setImages] = useState<PatternImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase
        .from('patterns')
        .select('*, category:categories(*)')
        .eq('id', patternId)
        .maybeSingle(),
      supabase
        .from('pattern_images')
        .select('*')
        .eq('pattern_id', patternId)
        .order('sort_order'),
    ]).then(([patternRes, imagesRes]) => {
      if (patternRes.data) {
        setPattern(patternRes.data as Pattern);
        setActiveImage(patternRes.data.image_url);
      }
      if (imagesRes.data) setImages(imagesRes.data);
      setLoading(false);
    });
  }, [patternId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-burgundy-200 border-t-burgundy-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="min-h-screen bg-cream-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-gray-600 mb-4">Узор не найден</h2>
          <button onClick={() => onNavigate('catalog')} className="btn-primary">
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(pattern.id);
  const allImages = [
    { image_url: pattern.image_url, caption: pattern.name },
    ...images,
  ].filter(img => img.image_url);

  return (
    <div className="min-h-screen bg-cream-100 pt-16 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-burgundy-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Назад в каталог
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              <img
                src={activeImage || pattern.image_url}
                alt={pattern.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img.image_url ? 'border-burgundy-900' : 'border-transparent hover:border-gold-400'
                    }`}
                  >
                    <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Category */}
            {pattern.category && (
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-gold-600" />
                <span className="text-gold-600 text-sm font-medium">{pattern.category.name}</span>
              </div>
            )}

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-burgundy-900 mb-4">{pattern.name}</h1>

            <OrnamentDivider className="my-4" />

            <p className="text-gray-700 leading-relaxed text-base mb-6">{pattern.description}</p>

            {/* Action button */}
            <button
              onClick={() => onToggleFavorite(pattern.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 ${
                isFavorite
                  ? 'bg-burgundy-900 text-gold-400'
                  : 'border-2 border-burgundy-900 text-burgundy-900 hover:bg-burgundy-900 hover:text-white'
              }`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'В избранном' : 'Добавить в избранное'}
            </button>

            {/* Details */}
            <div className="mt-8 space-y-6">
              {pattern.history && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={18} className="text-gold-600" />
                    <h3 className="font-display font-semibold text-burgundy-900 text-lg">История происхождения</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{pattern.history}</p>
                </div>
              )}

              {pattern.symbolism && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-gold-600" />
                    <h3 className="font-display font-semibold text-burgundy-900 text-lg">Значение символики</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{pattern.symbolism}</p>
                </div>
              )}

              {pattern.application && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench size={18} className="text-gold-600" />
                    <h3 className="font-display font-semibold text-burgundy-900 text-lg">Область применения</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{pattern.application}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
