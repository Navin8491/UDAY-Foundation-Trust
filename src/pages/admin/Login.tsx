import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInAdmin, onAuthStateChanged } from "@/services/auth";
import { SITE } from "@/constants/site";
import { Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(email, password, rememberMe);
      toast.success("Welcome back! Authentication successful.");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">

      {/* Background decorations (Glows matching dashboard) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4040A1]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#7A9D1C]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating grids */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-md p-4 relative z-10">

        {/* Card wrapper */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">

          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 bg-slate-800/80 border border-slate-700/50 rounded-full items-center justify-center shadow-lg">
              <img src={SITE.logo} alt="Uday logo" className="h-12 w-12 rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">Uday Trust Portal</h1>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Super Administrator Login</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter the email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-[#4040A1] text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-[#4040A1] text-sm text-white placeholder-slate-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-[#4040A1] focus:ring-0 cursor-pointer h-4 w-4"
                />
                <span>Remember me</span>
              </label>
              <a href="/" className="text-[#7A9D1C] hover:underline font-semibold">
                Back to Website
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#4040A1] hover:bg-[#4040A1]/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Authenticate Portal</span>
                  <ArrowRight className="h-4.5 w-4.5 ml-0.5" />
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;
