import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { supabase, type Pattern, type Category } from '../lib/supabase';
import PatternCard from '../components/PatternCard';
import OrnamentDivider from '../components/OrnamentDivider';

type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface CatalogPageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigate: (page: Page, patternId?: string) => void;
}

export default function CatalogPage({ favorites, onToggleFavorite, onNavigate }: CatalogPageProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').then(res => {
      if (res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from('patterns')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }
    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    query.then(res => {
      if (res.data) setPatterns(res.data as Pattern[]);
      setLoading(false);
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-cream-100 pt-16">
      {/* Page Header */}
      <div className="bg-burgundy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Каталог узоров</h1>
          <OrnamentDivider text="✦" />
          <p className="text-cream-300 mt-4 max-w-xl mx-auto">
            Полная коллекция кыргызских национальных орнаментов с историей и значением
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск узоров..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy-400 focus:ring-1 focus:ring-burgundy-400 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                showFilters || selectedCategory !== 'all'
                  ? 'bg-burgundy-900 text-white border-burgundy-900'
                  : 'border-gray-200 text-gray-600 hover:border-burgundy-300'
              }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Фильтры</span>
              {selectedCategory !== 'all' && (
                <span className="bg-gold-400 text-burgundy-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">1</span>
              )}
            </button>
          </div>

          {/* Category filters */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-burgundy-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Все
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-burgundy-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {loading ? 'Загрузка...' : `Найдено узоров: ${patterns.length}`}
          </p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-burgundy-600 text-sm flex items-center gap-1 hover:text-burgundy-800"
            >
              <X size={14} />
              Сбросить фильтр
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-square" />
            ))}
          </div>
        ) : patterns.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl text-gray-600 mb-2">Ничего не найдено</h3>
            <p className="text-gray-400 text-sm">Попробуйте изменить запрос или сбросить фильтры</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              className="mt-6 btn-primary"
            >
              Сбросить всё
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {patterns.map(pattern => (
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
      </div>
    </div>
  );
}
