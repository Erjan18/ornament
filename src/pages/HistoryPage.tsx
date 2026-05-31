import OrnamentDivider from '../components/OrnamentDivider';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-16 animate-fade-in">
      {/* Header */}
      <div className="bg-burgundy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">История узоров</h1>
          <OrnamentDivider />
          <p className="text-cream-300 mt-4 max-w-2xl mx-auto">
            Путешествие через тысячелетия кыргызского декоративного искусства
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Timeline */}
        <div className="space-y-12">

          {/* Bronze Age */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-burgundy-900 flex items-center justify-center text-gold-400 font-display font-bold text-sm shrink-0 shadow-md">
                I
              </div>
              <div className="flex-1 w-px bg-gold-500/20 mt-2" />
            </div>
            <div className="pb-12">
              <div className="text-gold-600 text-sm font-medium mb-1">Эпоха бронзы — VIII в. до н.э.</div>
              <h2 className="font-display text-2xl font-bold text-burgundy-900 mb-4">Истоки орнаментики</h2>
              <div className="prose prose-sm text-gray-600 space-y-3">
                <p>Древнейшие следы кыргызской орнаментики восходят к эпохе бронзы. Наскальные рисунки Саймалуу-Таш (Ферганский хребет) содержат тысячи петроглифов, среди которых встречаются солярные знаки и геометрические узоры — прямые предшественники позднейших орнаментов.</p>
                <p>Скотоводческий уклад жизни определил главные символы: рога животных, небесные светила, силуэты гор. Эти мотивы впоследствии трансформировались в канонические орнаменты «кочкор мүйүз», «туунун көзү» и «тарак».</p>
              </div>
            </div>
          </div>

          {/* Scythian period */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-burgundy-900 font-display font-bold text-sm shrink-0 shadow-md">
                II
              </div>
              <div className="flex-1 w-px bg-gold-500/20 mt-2" />
            </div>
            <div className="pb-12">
              <div className="text-gold-600 text-sm font-medium mb-1">VIII в. до н.э. — III в. н.э.</div>
              <h2 className="font-display text-2xl font-bold text-burgundy-900 mb-4">Скифо-сакский период</h2>
              <div className="text-gray-600 space-y-3 text-sm leading-relaxed">
                <p>В скифо-сакский период кыргызские орнаменты обогатились «звериным стилем» — изображениями хищников, грифонов, оленей в динамических позах. Этот период ознаменовался появлением спиральных узоров, ставших основой орнамента «итмурун».</p>
                <p>Одновременно усилилось влияние иранских и китайских декоративных традиций через торговые контакты. Появились более сложные геометрические паттерны, позже вошедшие в систему ковровых орнаментов.</p>
              </div>
            </div>
          </div>

          {/* Medieval period */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-burgundy-700 flex items-center justify-center text-gold-400 font-display font-bold text-sm shrink-0 shadow-md">
                III
              </div>
              <div className="flex-1 w-px bg-gold-500/20 mt-2" />
            </div>
            <div className="pb-12">
              <div className="text-gold-600 text-sm font-medium mb-1">IX — XV века</div>
              <h2 className="font-display text-2xl font-bold text-burgundy-900 mb-4">Средневековье: расцвет войлочного искусства</h2>
              <div className="text-gray-600 space-y-3 text-sm leading-relaxed">
                <p>В период формирования кыргызского этноса на Тянь-Шане войлочное искусство достигло высочайшего уровня. Ала-кийиз (мозаичный войлок) и шырдак (аппликационный ковёр) стали главными носителями орнаментальных традиций.</p>
                <p>В этот период сформировался классический репертуар кыргызских орнаментов — «кочкор мүйүз», «айкол», «чыңырык», «тарак». Каждый узор получил строгое символическое значение и правила применения в различных сферах жизни.</p>
              </div>
            </div>
          </div>

          {/* Islamic influence */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gold-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0 shadow-md">
                IV
              </div>
              <div className="flex-1 w-px bg-gold-500/20 mt-2" />
            </div>
            <div className="pb-12">
              <div className="text-gold-600 text-sm font-medium mb-1">XVI — XIX века</div>
              <h2 className="font-display text-2xl font-bold text-burgundy-900 mb-4">Влияние ислама и Великого шёлкового пути</h2>
              <div className="text-gray-600 space-y-3 text-sm leading-relaxed">
                <p>Принятие ислама и активные контакты по Шёлковому пути обогатили кыргызскую орнаментику растительными мотивами и сложными геометрическими арабесками. Появились узоры «бута» (пейсли), «гүлдөстө» (букет) и более изощрённые ювелирные орнаменты.</p>
                <p>В период Кокандского ханства развилось искусство шёлковой вышивки. Кыргызские мастерицы создавали уникальные изделия, сочетающие местные традиции с персидско-тюркскими влияниями.</p>
              </div>
            </div>
          </div>

          {/* Modern era */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-burgundy-900 flex items-center justify-center text-gold-400 font-display font-bold text-sm shrink-0 shadow-md">
                V
              </div>
            </div>
            <div>
              <div className="text-gold-600 text-sm font-medium mb-1">XX — XXI века</div>
              <h2 className="font-display text-2xl font-bold text-burgundy-900 mb-4">Современность: новая жизнь традиций</h2>
              <div className="text-gray-600 space-y-3 text-sm leading-relaxed">
                <p>В советский период кыргызские орнаменты вошли в официальный символический арсенал республики — появились на гербе, деньгах и архитектурных объектах. Это парадоксальным образом способствовало их сохранению и изучению.</p>
                <p>После обретения независимости в 1991 году начался настоящий ренессанс традиционного искусства. Кыргызские узоры получили широкое применение в моде, графическом дизайне, брендинге и современной архитектуре. Международный интерес к ала-кийизу и шырдаку привёл к признанию их элементами нематериального наследия ЮНЕСКО.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Quote */}
        <div className="mt-16 bg-burgundy-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-pattern" />
          <div className="relative">
            <div className="text-gold-400 text-5xl font-display mb-4">"</div>
            <blockquote className="font-display text-xl text-white italic leading-relaxed mb-6">
              Узор — это язык народа. В нём закодированы его история, верования и мечты.
            </blockquote>
            <cite className="text-cream-400 text-sm not-italic">— Из народной мудрости кыргызов</cite>
          </div>
        </div>

      </div>
    </div>
  );
}
