import React, { useState } from 'react';
import { Lock, Shield, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { adminLogin } from '../../lib/api';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('raihanhossenpabel678@gmail.com');
  const [password, setPassword] = useState('RajibSecure2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#101019] border border-purple-900/40 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#15111F] border border-purple-800/60 flex items-center justify-center mx-auto text-[#C084FC] shadow-[0_0_25px_rgba(124,58,237,0.35)]">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Administrator Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized access point for MD. Raihan Hossen Rajib CMS
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Security Info Card */}
        <div className="p-3.5 rounded-xl bg-[#15111F] border border-purple-950/60 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-purple-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Secure Management Portal</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Enforces server-side session tokens, rate limiting against brute-force attacks, and complete audit logging.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] disabled:opacity-50 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Verify Credentials & Enter</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
