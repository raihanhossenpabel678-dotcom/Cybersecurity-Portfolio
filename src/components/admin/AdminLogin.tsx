import React, { useState, useEffect } from 'react';
import { Lock, Shield, AlertCircle, ArrowLeft, KeyRound, HelpCircle, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { adminLogin, fetchSecurityQuestions, resetAdminPassword } from '../../lib/api';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('raihanhossenpabel678@gmail.com');
  const [password, setPassword] = useState('RajibSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState<{ id: string; question: string }[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    if (showForgotModal && securityQuestions.length === 0) {
      loadQuestions();
    }
  }, [showForgotModal]);

  const loadQuestions = async () => {
    try {
      setResetLoading(true);
      const data = await fetchSecurityQuestions();
      setSecurityQuestions(data.questions);
      // Initialize answers object
      const initial: Record<string, string> = {};
      data.questions.forEach((q) => {
        initial[q.id] = '';
      });
      setAnswers(initial);
    } catch (err: any) {
      setResetError(err.message || 'Failed to load security questions');
    } finally {
      setResetLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail('raihanhossenpabel678@gmail.com');
    setPassword('RajibSecure2026!');
    setError('');
  };

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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    // Validation
    for (const q of securityQuestions) {
      if (!answers[q.id] || answers[q.id].trim().length === 0) {
        setResetError('Please answer all 3 security questions.');
        return;
      }
    }

    if (!newPassword || newPassword.length < 8) {
      setResetError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('New password and confirmation do not match.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await resetAdminPassword(answers, newPassword);
      setResetSuccess(res.message || 'Password successfully reset! Logging you in...');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setResetError(err.message || 'Security question answers did not match our records.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#101019] border border-purple-900/40 shadow-2xl space-y-6 relative">
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

        {/* Security Info Card & Quick Fill */}
        <div className="p-3.5 rounded-xl bg-[#15111F] border border-purple-950/60 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-purple-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Secure Management Portal</span>
            </div>
            <button
              type="button"
              onClick={handleFillCredentials}
              className="text-[11px] text-[#C084FC] hover:text-white underline cursor-pointer"
            >
              Fill Default Credentials
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Use your master email & password to sign in, or recover access using your 3 verified security questions.
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-[#C084FC] hover:text-[#E9D5FF] transition-colors cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Forgot Password?</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#15111F] border border-purple-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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

        <div className="pt-2 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Password via 3 Security Questions</span>
          </button>

          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal (3 Security Questions) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#101019] border border-purple-800/60 shadow-2xl space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-purple-950/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#15111F] border border-purple-800/60 flex items-center justify-center text-[#C084FC]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Reset Admin Password</h2>
                  <p className="text-xs text-slate-400">Answer your 3 verified security questions to update credentials</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {resetError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              {securityQuestions.length === 0 && resetLoading ? (
                <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C084FC]" />
                  <span>Loading security questions...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-3.5">
                    {securityQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3.5 rounded-xl bg-[#15111F] border border-purple-950/80 space-y-2">
                        <label className="text-xs font-semibold text-purple-300 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-200 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{q.question}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={answers[q.id] || ''}
                          onChange={(e) =>
                            setAnswers({
                              ...answers,
                              [q.id]: e.target.value
                            })
                          }
                          placeholder={
                            q.id === 'q1'
                              ? 'e.g. Arena Web Security'
                              : q.id === 'q2'
                              ? 'e.g. WordPress'
                              : 'e.g. Python or Django'
                          }
                          className="w-full px-3.5 py-2 rounded-lg bg-[#08080D] border border-purple-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-purple-950/80 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        New Master Password (min 8 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter your new password"
                          className="w-full px-3.5 py-2 pr-10 rounded-lg bg-[#15111F] border border-purple-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] disabled:opacity-50 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {resetLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying & Resetting...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" />
                          <span>Reset Password & Log In</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

