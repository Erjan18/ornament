import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { SESSION_ID } from './lib/session';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import PatternDetailPage from './pages/PatternDetailPage';
import HistoryPage from './pages/HistoryPage';
import GalleryPage from './pages/GalleryPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

export type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentPatternId, setCurrentPatternId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminSession(session);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAdminSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load favorites on mount
  useEffect(() => {
    supabase
      .from('favorites')
      .select('pattern_id')
      .eq('session_id', SESSION_ID)
      .then(res => {
        if (res.data) {
          setFavorites(res.data.map(f => f.pattern_id));
        }
      });
  }, []);

  const navigate = (page: Page, patternId?: string) => {
    if (patternId) setCurrentPatternId(patternId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = async (patternId: string) => {
    const isFav = favorites.includes(patternId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== patternId));
      await supabase
        .from('favorites')
        .delete()
        .eq('session_id', SESSION_ID)
        .eq('pattern_id', patternId);
    } else {
      setFavorites(prev => [...prev, patternId]);
      await supabase
        .from('favorites')
        .insert({ session_id: SESSION_ID, pattern_id: patternId });
    }
  };

  // Admin section: show login or panel
  if (currentPage === 'admin') {
    if (!authChecked) return null;
    if (!adminSession) {
      return <AdminLoginPage onSuccess={() => {}} />;
    }
    return <AdminPage onLogout={() => navigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={navigate}
        favoritesCount={favorites.length}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'catalog' && (
          <CatalogPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'pattern' && currentPatternId && (
          <PatternDetailPage
            patternId={currentPatternId}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'gallery' && <GalleryPage onNavigate={navigate} />}
        {currentPage === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'about' && <AboutPage />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
