import { useEffect, useState, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, ChevronDown,
  LayoutDashboard, Layers, Tag, Image, AlertCircle,
  CheckCircle, Loader2, ToggleLeft, ToggleRight, LogOut,
} from 'lucide-react';
import { supabase, type Pattern, type Category } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab = 'dashboard' | 'patterns' | 'categories';

interface PatternForm {
  name: string;
  slug: string;
  description: string;
  history: string;
  symbolism: string;
  application: string;
  category_id: string;
  image_url: string;
  featured: boolean;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

interface Toast {
  type: 'success' | 'error';
  text: string;
}

interface Stats {
  totalPatterns: number;
  totalCategories: number;
  featuredPatterns: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[ёйцукенгшщзхъфывапролджэячсмитьбю]/g, (c) => {
      const map: Record<string, string> = {
        ё: 'yo', й: 'j', ц: 'ts', у: 'u', к: 'k', е: 'e', н: 'n', г: 'g',
        ш: 'sh', щ: 'sch', з: 'z', х: 'kh', ъ: '', ф: 'f', ы: 'y', в: 'v',
        а: 'a', п: 'p', р: 'r', о: 'o', л: 'l', д: 'd', ж: 'zh', э: 'e',
        я: 'ya', ч: 'ch', с: 's', м: 'm', и: 'i', т: 't', ь: '', б: 'b',
        ю: 'yu',
      };
      return map[c] ?? c;
    })
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const emptyPatternForm: PatternForm = {
  name: '', slug: '', description: '', history: '',
  symbolism: '', application: '', category_id: '', image_url: '', featured: false,
};

const emptyCategoryForm: CategoryForm = {
  name: '', slug: '', description: '', image_url: '',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-up max-w-sm ${
      toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.text}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, required, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 transition-all"
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 resize-none transition-all"
      />
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ stats, patterns, categories, onTabChange }: {
  stats: Stats;
  patterns: Pattern[];
  categories: Category[];
  onTabChange: (tab: AdminTab) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Узоров', value: stats.totalPatterns, icon: <Image size={22} className="text-burgundy-600" />, color: 'bg-burgundy-50 border-burgundy-200', tab: 'patterns' as AdminTab },
          { label: 'Категорий', value: stats.totalCategories, icon: <Tag size={22} className="text-gold-600" />, color: 'bg-gold-50 border-gold-200', tab: 'categories' as AdminTab },
          { label: 'На главной', value: stats.featuredPatterns, icon: <Layers size={22} className="text-emerald-600" />, color: 'bg-emerald-50 border-emerald-200', tab: 'patterns' as AdminTab },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => onTabChange(s.tab)}
            className={`${s.color} border rounded-2xl p-5 text-left hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {s.icon}
              </div>
              <span className="font-display font-bold text-3xl text-gray-800">{s.value}</span>
            </div>
            <div className="text-sm font-medium text-gray-600">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Recent patterns */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Последние узоры</h3>
          <button onClick={() => onTabChange('patterns')} className="text-sm text-burgundy-600 hover:text-burgundy-800 font-medium">
            Все →
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {patterns.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <img
                src={p.image_url || 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'}
                alt={p.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{p.name}</div>
                <div className="text-xs text-gray-400">{p.category?.name || 'Без категории'}</div>
              </div>
              {p.featured && (
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                  Главная
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories summary */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Категории</h3>
          <button onClick={() => onTabChange('categories')} className="text-sm text-burgundy-600 hover:text-burgundy-800 font-medium">
            Управлять →
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const count = patterns.filter(p => p.category_id === cat.id).length;
            return (
              <div key={cat.id} className="bg-gray-50 rounded-xl p-3">
                <div className="text-sm font-medium text-gray-700 mb-1">{cat.name}</div>
                <div className="text-xs text-gray-400">{count} узоров</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Pattern Form ─────────────────────────────────────────────────────────────

function PatternFormPanel({ initial, categories, onSave, onCancel, saving }: {
  initial: PatternForm;
  categories: Category[];
  onSave: (form: PatternForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PatternForm>(initial);
  const set = (key: keyof PatternForm) => (value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleNameChange = (v: string) => {
    setForm(f => ({ ...f, name: v, slug: f.slug || slugify(v) }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldInput label="Название" value={form.name} onChange={handleNameChange} placeholder="Кочкор мүйүз" required />
        <FieldInput label="Slug (URL-адрес)" value={form.slug} onChange={set('slug')} placeholder="kochkor-muiuz" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория</label>
        <div className="relative">
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200 appearance-none bg-white transition-all"
          >
            <option value="">— Без категории —</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <FieldInput label="URL изображения" value={form.image_url} onChange={set('image_url')} type="url" placeholder="https://images.pexels.com/..." />
        {form.image_url && (
          <div className="mt-2 w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={form.image_url}
              alt="Превью"
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'; }}
            />
          </div>
        )}
      </div>

      <FieldTextarea label="Краткое описание" value={form.description} onChange={set('description')} rows={2} placeholder="Один из наиболее узнаваемых кыргызских орнаментов..." />
      <FieldTextarea label="История происхождения" value={form.history} onChange={set('history')} rows={4} placeholder="История узора..." />
      <FieldTextarea label="Значение символики" value={form.symbolism} onChange={set('symbolism')} rows={4} placeholder="Символическое значение..." />
      <FieldTextarea label="Область применения" value={form.application} onChange={set('application')} rows={2} placeholder="Ковры, вышивка, ювелирные украшения..." />

      <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
          className={`transition-colors ${form.featured ? 'text-gold-500' : 'text-gray-300'}`}
        >
          {form.featured ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>
        <div>
          <div className="text-sm font-medium text-gray-700">Показывать на главной</div>
          <div className="text-xs text-gray-400">Узор появится в блоке «Избранные узоры»</div>
        </div>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}
          className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button onClick={onCancel} className="btn-secondary px-6">Отмена</button>
      </div>
    </div>
  );
}

// ─── Patterns Tab ─────────────────────────────────────────────────────────────

function PatternsTab({ patterns, categories, onRefresh, showToast }: {
  patterns: Pattern[];
  categories: Category[];
  onRefresh: () => void;
  showToast: (t: Toast) => void;
}) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editTarget, setEditTarget] = useState<Pattern | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = patterns.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (form: PatternForm) => {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      category_id: form.category_id || null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editTarget) {
      ({ error } = await supabase.from('patterns').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('patterns').insert(payload));
    }

    setSaving(false);
    if (error) {
      showToast({ type: 'error', text: `Ошибка: ${error.message}` });
    } else {
      showToast({ type: 'success', text: editTarget ? 'Узор обновлён' : 'Узор добавлен' });
      onRefresh();
      setMode('list');
      setEditTarget(null);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('patterns').delete().eq('id', id);
    if (error) {
      showToast({ type: 'error', text: `Ошибка: ${error.message}` });
    } else {
      showToast({ type: 'success', text: 'Узор удалён' });
      onRefresh();
    }
    setDeleteConfirm(null);
  };

  const toggleFeatured = async (pattern: Pattern) => {
    const { error } = await supabase
      .from('patterns')
      .update({ featured: !pattern.featured })
      .eq('id', pattern.id);
    if (error) {
      showToast({ type: 'error', text: error.message });
    } else {
      showToast({ type: 'success', text: pattern.featured ? 'Убрано с главной' : 'Добавлено на главную' });
      onRefresh();
    }
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => { setMode('list'); setEditTarget(null); }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="font-display font-bold text-xl text-gray-800">
            {mode === 'edit' ? `Редактировать: ${editTarget?.name}` : 'Добавить узор'}
          </h2>
        </div>
        <PatternFormPanel
          initial={editTarget ? {
            name: editTarget.name,
            slug: editTarget.slug,
            description: editTarget.description,
            history: editTarget.history,
            symbolism: editTarget.symbolism,
            application: editTarget.application,
            category_id: editTarget.category_id || '',
            image_url: editTarget.image_url,
            featured: editTarget.featured,
          } : emptyPatternForm}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setMode('list'); setEditTarget(null); }}
          saving={saving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-burgundy-400 focus:ring-1 focus:ring-burgundy-200"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setMode('add')}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          Добавить узор
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Узор</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Категория</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Главная</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(pattern => (
                <tr key={pattern.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={pattern.image_url || 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'}
                          alt={pattern.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 text-sm truncate max-w-[160px]">{pattern.name}</div>
                        <div className="text-gray-400 text-xs font-mono truncate max-w-[160px]">{pattern.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500">{pattern.category?.name || '—'}</span>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-center">
                    <button
                      onClick={() => toggleFeatured(pattern)}
                      title="Переключить отображение на главной"
                      className="transition-colors"
                    >
                      {pattern.featured
                        ? <ToggleRight size={22} className="text-gold-500 hover:text-gold-600" />
                        : <ToggleLeft size={22} className="text-gray-300 hover:text-gray-400" />
                      }
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => { setEditTarget(pattern); setMode('edit'); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                        title="Редактировать"
                      >
                        <Pencil size={15} />
                      </button>
                      {deleteConfirm === pattern.id ? (
                        <div className="flex items-center gap-1 bg-red-50 rounded-lg px-2 py-1">
                          <span className="text-xs text-red-600 mr-1">Удалить?</span>
                          <button
                            onClick={() => handleDelete(pattern.id)}
                            className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-medium hover:bg-red-700"
                          >
                            Да
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium hover:bg-gray-300"
                          >
                            Нет
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(pattern.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-sm mb-4">
                {search ? 'Ничего не найдено по запросу «' + search + '»' : 'Узоры не добавлены'}
              </div>
              {!search && (
                <button onClick={() => setMode('add')} className="btn-primary">
                  Добавить первый узор
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────

function CategoriesTab({ categories, onRefresh, showToast }: {
  categories: Category[];
  onRefresh: () => void;
  showToast: (t: Toast) => void;
}) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyCategoryForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const set = (key: keyof CategoryForm) => (value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const openAdd = () => { setForm(emptyCategoryForm); setEditTarget(null); setMode('add'); };
  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.image_url });
    setEditTarget(cat);
    setMode('edit');
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast({ type: 'error', text: 'Название обязательно' }); return; }
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    let error;
    if (editTarget) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editTarget.id));
    } else {
      ({ error } = await supabase.from('categories').insert(payload));
    }
    setSaving(false);
    if (error) {
      showToast({ type: 'error', text: `Ошибка: ${error.message}` });
    } else {
      showToast({ type: 'success', text: editTarget ? 'Категория обновлена' : 'Категория добавлена' });
      onRefresh();
      setMode('list');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      showToast({ type: 'error', text: `Ошибка: ${error.message}` });
    } else {
      showToast({ type: 'success', text: 'Категория удалена' });
      onRefresh();
    }
    setDeleteConfirm(null);
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setMode('list')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="font-display font-bold text-xl text-gray-800">
            {mode === 'edit' ? `Редактировать: ${editTarget?.name}` : 'Добавить категорию'}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldInput label="Название" value={form.name} onChange={v => setForm(f => ({ ...f, name: v, slug: f.slug || slugify(v) }))} required placeholder="Ковровые узоры" />
            <FieldInput label="Slug" value={form.slug} onChange={set('slug')} placeholder="carpet-patterns" />
          </div>
          <FieldTextarea label="Описание" value={form.description} onChange={set('description')} rows={3} placeholder="Краткое описание категории..." />
          <div>
            <FieldInput label="URL изображения" value={form.image_url} onChange={set('image_url')} type="url" placeholder="https://images.pexels.com/..." />
            {form.image_url && (
              <div className="mt-2 w-32 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={form.image_url}
                  alt="Превью"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'; }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={() => setMode('list')} className="btn-secondary px-6">Отмена</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{categories.length} категорий</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Добавить категорию
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            {cat.image_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6585017/pexels-photo-6585017.jpeg'; }}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-400 font-mono mb-2">{cat.slug}</p>
              {cat.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{cat.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-burgundy-300 hover:text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                >
                  <Pencil size={13} />
                  Изменить
                </button>
                {deleteConfirm === cat.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 rounded-lg text-xs bg-red-600 text-white font-medium hover:bg-red-700">Да</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-200 text-gray-600 font-medium hover:bg-gray-300">Нет</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <p className="mb-4 text-sm">Категории не созданы</p>
            <button onClick={openAdd} className="btn-primary">Создать первую категорию</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

export default function AdminPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const fetchAll = useCallback(async () => {
    setLoadError(null);
    const [pRes, cRes] = await Promise.all([
      supabase.from('patterns').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (pRes.error) {
      setLoadError(`Ошибка загрузки узоров: ${pRes.error.message}`);
      setLoading(false);
      return;
    }
    if (cRes.error) {
      setLoadError(`Ошибка загрузки категорий: ${cRes.error.message}`);
      setLoading(false);
      return;
    }

    setPatterns((pRes.data ?? []) as Pattern[]);
    setCategories(cRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const showToast = (t: Toast) => setToast(t);

  const stats: Stats = {
    totalPatterns: patterns.length,
    totalCategories: categories.length,
    featuredPatterns: patterns.filter(p => p.featured).length,
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Обзор', icon: <LayoutDashboard size={18} /> },
    { id: 'patterns', label: 'Узоры', icon: <Image size={18} /> },
    { id: 'categories', label: 'Категории', icon: <Tag size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}

      {/* Top bar */}
      <div className="bg-burgundy-950 border-b border-burgundy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Панель управления</h1>
            <p className="text-cream-500 text-sm mt-1">Управление контентом сайта «Кыргыз Узорлору»</p>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); onLogout(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-cream-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-burgundy-900 text-burgundy-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="text-burgundy-400 animate-spin" />
            <p className="text-gray-400 text-sm">Загрузка данных...</p>
          </div>
        ) : loadError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <AlertCircle size={36} className="text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700 mb-1">Ошибка подключения к базе данных</h3>
              <p className="text-red-500 text-sm">{loadError}</p>
            </div>
            <button onClick={fetchAll} className="btn-primary">Попробовать снова</button>
          </div>
        ) : (
          <>
            {tab === 'dashboard' && (
              <DashboardTab
                stats={stats}
                patterns={patterns}
                categories={categories}
                onTabChange={setTab}
              />
            )}
            {tab === 'patterns' && (
              <PatternsTab
                patterns={patterns}
                categories={categories}
                onRefresh={fetchAll}
                showToast={showToast}
              />
            )}
            {tab === 'categories' && (
              <CategoriesTab
                categories={categories}
                onRefresh={fetchAll}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
