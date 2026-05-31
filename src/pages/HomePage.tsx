import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, Image } from 'lucide-react';
import { supabase, type Pattern, type Category } from '../lib/supabase';
import PatternCard from '../components/PatternCard';
import OrnamentDivider from '../components/OrnamentDivider';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface HomePageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function HomePage({ favorites, onToggleFavorite, onNavigate }: HomePageProps) {
  const [featuredPatterns, setFeaturedPatterns] = useState<Pattern[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase
        .from('patterns')
        .select('*, category:categories(*)')
        .eq('featured', true)
        .limit(6),
      supabase.from('categories').select('*').limit(6),
    ]).then(([patternsRes, catsRes]) => {
      if (patternsRes.data) setFeaturedPatterns(patternsRes.data as Pattern[]);
      if (catsRes.data) setCategories(catsRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-burgundy-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg"
            alt="Кыргызские ковры"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-burgundy-950/80 via-burgundy-950/60 to-burgundy-950" />
        </div>

        {/* Geometric decorative SVG */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10" viewBox="0 0 200 200">
            <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" fill="none" stroke="#D4A017" strokeWidth="2" />
            <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" fill="none" stroke="#D4A017" strokeWidth="1" />
            <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" fill="none" stroke="#D4A017" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#D4A017" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 px-4 py-2 rounded-full text-sm mb-8 animate-fade-in">
            <Sparkles size={14} />
            <span>Сохраняем наследие</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
            Кыргызские
            <br />
            <span className="text-gold-400">Национальные</span>
            <br />
            Узоры
          </h1>

          <p className="text-cream-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Откройте для себя богатое наследие кыргызского декоративного искусства — тысячелетние традиции, воплощённые в узорах и орнаментах.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-gold flex items-center gap-2 justify-center text-base"
            >
              Смотреть каталог
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="btn-secondary border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-burgundy-900 flex items-center gap-2 justify-center text-base"
            >
              <BookOpen size={18} />
              История узоров
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: '12+', label: 'Узоров' },
              { value: '6', label: 'Категорий' },
              { value: '1000+', label: 'Лет истории' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-gold-400 font-display font-bold text-3xl">{stat.value}</div>
                <div className="text-cream-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gold-500/50" />
          <div className="w-2 h-2 rounded-full bg-gold-500/50" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-cream-100 bg-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Категории узоров</h2>
            <OrnamentDivider />
            <p className="text-gray-600 max-w-xl mx-auto mt-4">
              Каждая категория отражает особый аспект кыргызского декоративного искусства
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('catalog')}
                  className="group relative rounded-2xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-burgundy-900/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-display font-semibold text-sm sm:text-base leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Patterns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Избранные узоры</h2>
            <OrnamentDivider />
            <p className="text-gray-600 max-w-xl mx-auto mt-4">
              Наиболее значимые и узнаваемые орнаменты кыргызского народа
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-square" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPatterns.map(pattern => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  isFavorite={favorites.includes(pattern.id)}
                  onToggleFavorite={onToggleFavorite}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-primary inline-flex items-center gap-2"
            >
              Смотреть все узоры
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-20 bg-burgundy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="ornament-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="none" stroke="#D4A017" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ornament-grid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: <Sparkles size={32} className="text-gold-400" />,
                title: 'Богатое наследие',
                text: 'Кыргызские узоры насчитывают тысячелетнюю историю, отражая мифологию и мировоззрение народа',
              },
              {
                icon: <BookOpen size={32} className="text-gold-400" />,
                title: 'Глубокий смысл',
                text: 'Каждый орнамент несёт символическое значение — охрана, плодородие, связь с предками',
              },
              {
                icon: <Image size={32} className="text-gold-400" />,
                title: 'Живое искусство',
                text: 'Традиционные узоры продолжают жить в современном дизайне, моде и архитектуре',
              },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-gold-400 text-xl">{item.title}</h3>
                <p className="text-cream-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
