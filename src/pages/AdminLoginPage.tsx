import { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export default function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError('Неверный email или пароль');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-burgundy-950 flex items-center justify-center px-4 pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5" viewBox="0 0 200 200">
          <polygon points="100,5 190,52 190,148 100,195 10,148 10,52" fill="none" stroke="#D4A017" strokeWidth="1" />
          <polygon points="100,20 175,60 175,140 100,180 25,140 25,60" fill="none" stroke="#D4A017" strokeWidth="0.7" />
          <polygon points="100,40 155,70 155,130 100,160 45,130 45,70" fill="none" stroke="#D4A017" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#D4A017" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={28} className="text-burgundy-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Панель управления</h1>
          <p className="text-cream-400 text-sm">Войдите в аккаунт администратора</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kyrgyz.kz"
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-cream-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-11 text-white placeholder-cream-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-cream-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm animate-fade-in">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold py-3 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>
        </div>

        {/* Credentials hint */}
        
      </div>
    </div>
  );
}
