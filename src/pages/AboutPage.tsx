import { Globe, BookOpen, Heart, Users } from 'lucide-react';
import OrnamentDivider from '../components/OrnamentDivider';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-16 animate-fade-in">
      {/* Header */}
      <div className="bg-burgundy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">О проекте</h1>
          <OrnamentDivider />
          <p className="text-cream-300 mt-4 max-w-2xl mx-auto text-lg">
            Цифровой архив и культурная платформа для сохранения и популяризации кыргызского декоративного искусства
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-burgundy-900 mb-6">Наша миссия</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              «Кыргыз Узорлору» — это цифровая платформа, созданная для сохранения, изучения и популяризации богатейшего наследия кыргызского декоративного искусства.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Кыргызские орнаменты — это уникальный визуальный язык, в котором закодированы тысячелетняя история народа, его мифология, ценности и отношение к миру. Каждый узор — это не просто красивый рисунок, а носитель глубокого смысла.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Мы стремимся сделать это наследие доступным для всех — исследователей, дизайнеров, художников и всех, кто интересуется культурой Центральной Азии.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg"
              alt="Кыргызские ковры"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <OrnamentDivider text="Наши ценности" />

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12">
          {[
            {
              icon: <BookOpen size={24} className="text-gold-600" />,
              title: 'Просвещение',
              text: 'Делаем знания об орнаментах доступными, понятными и интересными для широкой аудитории',
            },
            {
              icon: <Heart size={24} className="text-gold-600" />,
              title: 'Сохранение',
              text: 'Документируем уникальные узоры, их историю и значение для передачи будущим поколениям',
            },
            {
              icon: <Globe size={24} className="text-gold-600" />,
              title: 'Доступность',
              text: 'Создаём открытый ресурс, которым может воспользоваться любой человек в мире',
            },
            {
              icon: <Users size={24} className="text-gold-600" />,
              title: 'Сообщество',
              text: 'Объединяем мастеров, исследователей и всех любителей кыргызской культуры',
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-burgundy-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About Kyrgyz ornaments */}
        <div className="bg-burgundy-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-pattern" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-gold-400 mb-6">О кыргызских узорах</h2>
            <div className="space-y-4 text-cream-300 text-sm leading-relaxed">
              <p>
                Кыргызские национальные орнаменты — одно из важнейших достижений кочевой цивилизации Центральной Азии. На протяжении тысячелетий они развивались как особый изобразительный язык, отражающий мировоззрение, верования и эстетику кыргызского народа.
              </p>
              <p>
                Традиционно узоры наносились на войлочные изделия (шырдак, ала-кийиз), деревянные конструкции юрты, ювелирные украшения и одежду. Каждый тип изделий имел свой репертуар орнаментов, строго соблюдавшийся мастерами.
              </p>
              <p>
                В 2012 году кыргызское искусство изготовления ала-кийиза и шырдака было включено в Список нематериального культурного наследия ЮНЕСКО — международное признание уникальности этой традиции.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
