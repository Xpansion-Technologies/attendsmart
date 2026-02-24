import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export const SupabaseTest = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error' | 'missing'>('testing');
  const [message, setMessage] = useState('Testing connection to Supabase...');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setStatus('missing');
        setMessage('Supabase credentials are not configured in your .env file.');
        return;
      }

      try {
        // Simple query to verify connection (profiles is expected to exist)
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage('Successfully connected to Supabase database!');
        
        // Auto-hide success message after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setMessage(`Connection failed: ${err.message || 'Unknown error'}`);
      }
    };

    checkConnection();
  }, []);

  if (!isVisible) return null;

  const styles = {
    testing: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    missing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  const Icons = {
    testing: AlertCircle,
    success: CheckCircle2,
    error: XCircle,
    missing: AlertCircle,
  };

  const Icon = Icons[status];

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3 shadow-sm transition-all duration-300 relative pr-10 ${styles[status]}`}>
      <div className="mt-0.5">
        <Icon size={18} className={status === 'testing' ? 'animate-spin' : ''} />
      </div>
      <div>
        <p className="text-sm font-bold">Supabase Connection</p>
        <p className="text-xs opacity-90">{message}</p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};
