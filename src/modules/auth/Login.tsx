import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import BrandingImg from '../../assets/Branding.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please check your .env file.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dps-cream flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Branding & Info */}
        <div className="md:w-1/2 bg-dps-teal p-8 md:p-12 flex flex-col justify-between text-white">
          <div>
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              AttendSmart <br />
              <span className="text-dps-gold">Admin Portal</span>
            </h1>
            <p className="text-white/70 text-lg">
              Secure administration dashboard for Delhi Public School (DPS) Greater Noida. 
              Manage students, buses, and attendance with real-time visibility.
            </p>
          </div>
          
          <div className="mt-12 md:mt-0">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              </div>
              <p className="text-sm font-medium">Real-time Data Sync Active</p>
            </div>
            <p className="text-xs text-white/50">
              © 2026 Delhi Public School Greater Noida. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <img src={BrandingImg} alt="DPS Logo" className="h-16 w-auto" />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Please enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 animate-shake">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-[38px] text-gray-400" size={18} />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-[38px] text-gray-400" size={18} />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-dps-teal focus:ring-dps-teal" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-dps-teal font-medium hover:underline">Forgot password?</a>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-dps-teal hover:bg-dps-teal/90 flex items-center justify-center space-x-2 transition-all shadow-lg shadow-dps-teal/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Authorized personnel only. Access is monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
