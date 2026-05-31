type Page = 'home' | 'catalog' | 'history' | 'gallery' | 'favorites' | 'about' | 'pattern' | 'admin';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-burgundy-950 text-cream-200">
      {/* Ornament border */}
      <div className="h-1 bg-gradient-to-r from-burgundy-900 via-gold-500 to-burgundy-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-7 h-7 fill-burgundy-900">
                  <path d="M20 4 L28 12 L36 12 L36 20 L28 28 L20 36 L12 28 L4 20 L4 12 L12 12 Z" />
                  <circle cx="20" cy="20" r="5" fill="none" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <div className="text-gold-400 font-display font-bold text-lg">Кыргыз Узорлору</div>
                <div className="text-cream-400 text-xs">Национальные узоры</div>
              </div>
            </div>
            <p className="text-cream-400 text-sm leading-relaxed">
              Сохраняем и популяризируем богатое наследие кыргызского декоративного искусства для будущих поколений.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4 uppercase text-xs tracking-widest">Навигация</h3>
            <ul className="space-y-2">
              {[
                { label: 'Главная', page: 'home' as Page },
                { label: 'Каталог узоров', page: 'catalog' as Page },
                { label: 'История узоров', page: 'history' as Page },
                { label: 'Галерея', page: 'gallery' as Page },
                { label: 'Избранное', page: 'favorites' as Page },
                { label: 'О проекте', page: 'about' as Page },
              ].map(item => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-cream-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4 uppercase text-xs tracking-widest">Категории</h3>
            <ul className="space-y-2 text-sm text-cream-400">
              <li>Орнаменты на одежде</li>
              <li>Ковровые узоры</li>
              <li>Национальные украшения</li>
              <li>Юрточные орнаменты</li>
              <li>Декоративные узоры</li>
              <li>Современные интерпретации</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-burgundy-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-500 text-xs">
            © 2024 Кыргыз Узорлору. Все права защищены.
          </p>
          <button
            onClick={() => onNavigate('admin')}
            className="text-cream-600 hover:text-gold-500 text-xs transition-colors"
          >
            Панель управления
          </button>
        </div>
      </div>
    </footer>
  );
}
