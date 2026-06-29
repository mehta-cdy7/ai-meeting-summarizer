import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Mail, Lock, AlertCircle, Sparkles, Brain, CheckCircle2 } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check if env variables are placeholders
  const isConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter both email and password." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Note: Supabase sometimes requires email verification depending on settings.
        // We handle both auto-signin or check-email message
        if (data.session) {
          setMessage({
            type: "success",
            text: "Account created successfully! Logging you in...",
          });
        } else {
          setMessage({
            type: "success",
            text: "Sign up successful! Please check your email for a verification link.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setMessage({
        type: "error",
        text: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto animate-fade-in relative z-10">
      
      {/* Configuration Warning */}
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs flex gap-2 items-start leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-1">Configuration Required</span>
            To connect to Supabase, update the <code className="bg-white/10 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-white/10 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">.env</code> file.
          </div>
        </div>
      )}

      {/* Main Glass Card */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        
        {/* Top visual accents */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5 font-light">
            {isSignUp
              ? "Join Recall AI to start summarizing your meetings"
              : "Sign in to access your meeting intelligence"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border flex gap-2.5 items-start text-xs ${
              message.type === "error"
                ? "border-red-500/20 bg-red-500/5 text-red-300"
                : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            )}
            <span className="leading-relaxed">{message.text}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-zinc-400 text-xs font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-light"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 text-xs font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-light"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all shadow-[0_4px_15px_rgba(139,92,246,0.2)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isSignUp ? "Sign Up" : "Sign In"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
