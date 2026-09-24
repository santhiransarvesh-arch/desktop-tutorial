import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, Github, Chrome } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all standard credentials fields.");
      return;
    }

    if (!isLogin && !username) {
      setError("Username is highly recommended as a project handle.");
      return;
    }

    if (isForgot) {
      setVerificationSent(true);
      return;
    }

    if (!isLogin && !verificationSent) {
      // Simulate verification step
      setVerificationSent(true);
      return;
    }

    const finalUsername = username || email.split("@")[0] || "ArchitectUser";
    onSuccess(finalUsername);
  };

  const handleGoogleLogin = () => {
    onSuccess("GoogleUser");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="auth-modal-overlay">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden md:p-8"
        id="auth-modal"
      >
        {/* Subtle glass accent light glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span>{isForgot ? "Reset Credentials" : isLogin ? "Sign in to ArchitectAI" : "Create Account"}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            id="close-auth-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {verificationSent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Verify Your Account</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xs mx-auto">
              We have dispatched a secure JWT-encrypted verification link to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>. Click it to activate instantly.
            </p>
            <button
              onClick={() => {
                setVerificationSent(false);
                onSuccess(username || email.split("@")[0] || "VerifiedUser");
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold hover:opacity-90 active:scale-98 transition text-sm cursor-pointer"
            >
              Simulate Active Callback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-400/10 dark:bg-red-400/5 text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            {!isLogin && !isForgot && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Developer Nickname</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. techlead42"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {!isForgot && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-xs text-indigo-500 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 sm:hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-sm active:scale-98"
            >
              <span>{isForgot ? "Send Reset Instructions" : isLogin ? "Sign In" : "Register and Verify"}</span>
            </button>

            {isForgot ? (
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgot(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="text-center mt-2">
                <span className="text-xs text-slate-500">
                  {isLogin ? "New to ArchitectAI? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-xs font-semibold text-indigo-500 hover:underline"
                >
                  {isLogin ? "Create account" : "Sign In"}
                </button>
              </div>
            )}

            {/* Third Party Authentications */}
            <div className="relative my-4 flex items-center justify-center">
              <span className="absolute h-[1px] w-full bg-slate-200 dark:bg-slate-800" />
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] uppercase text-slate-400 font-bold tracking-wider">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-xs font-semibold cursor-pointer"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-xs font-semibold cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
