import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, type Pattern } from '../lib/supabase';
import OrnamentDivider from '../components/OrnamentDivider';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface GalleryPageProps {
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ index: number; open: boolean }>({ index: 0, open: false });

  useEffect(() => {
    supabase
      .from('patterns')
      .select('*, category:categories(*)')
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false })
      .then(res => {
        if (res.data) setPatterns(res.data as Pattern[]);
        setLoading(false);
      });
  }, []);

  const openLightbox = (index: number) => setLightbox({ index, open: true });
  const closeLightbox = () => setLightbox({ index: 0, open: false });

  const prev = () => setLightbox(l => ({ ...l, index: (l.index - 1 + patterns.length) % patterns.length }));
  const next = () => setLightbox(l => ({ ...l, index: (l.index + 1) % patterns.length }));

  const currentPattern = patterns[lightbox.index];

  return (
    <div className="min-h-screen bg-gray-900 pt-16 animate-fade-in">
      {/* Header */}
      <div className="bg-burgundy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Галерея</h1>
          <OrnamentDivider />
          <p className="text-cream-300 mt-4 max-w-xl mx-auto">
            Визуальная коллекция кыргызских национальных узоров
          </p>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-700 animate-pulse"
                style={{ height: `${150 + (i % 3) * 80}px` }}
              />
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {patterns.map((pattern, idx) => (
              <div
                key={pattern.id}
                className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={pattern.image_url}
                  alt={pattern.name}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-display font-semibold text-sm">{pattern.name}</h3>
                  {pattern.category && (
                    <span className="text-gold-400 text-xs">{pattern.category.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && currentPattern && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={20} />
          </button>

          <div
            className="max-w-3xl max-h-[90vh] flex flex-col items-center gap-4 px-16"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentPattern.image_url}
              alt={currentPattern.name}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center">
              <h3 className="text-white font-display font-bold text-xl">{currentPattern.name}</h3>
              {currentPattern.category && (
                <span className="text-gold-400 text-sm">{currentPattern.category.name}</span>
              )}
              <button
                onClick={() => { closeLightbox(); onNavigate('pattern', currentPattern.id); }}
                className="mt-3 block text-xs text-cream-400 hover:text-gold-400 transition-colors"
              >
                Открыть страницу узора →
              </button>
            </div>
            <div className="text-cream-500 text-xs">
              {lightbox.index + 1} / {patterns.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
