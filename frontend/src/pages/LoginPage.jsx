// =============================================================
// ETHARA NEXUS - Login Page
// Cyber-Industrial Auth Interface
// =============================================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, ArrowRight, Lock, Mail, Terminal, Cpu, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import { toast } from "../hooks/useToast";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      setAuth(res.data.user, res.data.token);
      toast.success(`SYSTEM_ACCESS_GRANTED: ${res.data.user.fullName}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:grid lg:grid-cols-2 relative overflow-hidden font-mono">
      {/* ── LEFT SIDE: Technical Visual ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/[0.1] bg-surface-1 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0tNiAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-accent flex items-center justify-center border border-accent-light shadow-[4px_4px_0px_rgba(255,69,0,0.3)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-xl tracking-widest uppercase">ETHARA</p>
              <p className="text-[10px] text-accent font-bold tracking-widest uppercase leading-none mt-1">// NEXUS_OS</p>
            </div>
          </div>

          <div className="space-y-8 max-w-sm">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-bold text-white tracking-tighter uppercase leading-none">
                Integrated AI <br/> <span className="text-accent">Operations</span>
              </h1>
              <p className="text-slate-500 text-sm mt-4 leading-relaxed uppercase tracking-wider">
                {">"} Initializing secure gateway... <br/>
                {">"} Accessing Ethara Nexus core... <br/>
                {">"} Status: Pending Authentication...
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/[0.1] bg-surface-2 p-4">
                <Cpu className="w-5 h-5 text-accent mb-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Latency</p>
                <p className="text-lg font-bold text-white tracking-widest">0.24MS</p>
              </div>
              <div className="border border-white/[0.1] bg-surface-2 p-4">
                <ShieldCheck className="w-5 h-5 text-info mb-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
                <p className="text-lg font-bold text-white tracking-widest">99.98%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-600 tracking-[0.2em] uppercase">
          © 2026 ETHARA_NEXUS // ALL_RIGHTS_RESERVED
        </div>
      </div>

      {/* ── RIGHT SIDE: Auth Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#050505] relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10 lg:hidden flex items-center justify-center gap-3">
             <div className="w-8 h-8 bg-accent flex items-center justify-center border border-accent-light shadow-[3px_3px_0px_rgba(255,69,0,0.3)]">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="font-display font-bold text-white text-lg tracking-widest uppercase">ETHARA</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">
              // SYSTEM_LOGIN
            </h2>
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Identify yourself to access the operations node.
            </p>
          </div>

          <div className="bg-surface-1 border border-white/[0.1] p-8 shadow-[12px_12px_0px_rgba(255,255,255,0.02)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Identity / Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="OPERATOR@ETHARA.AI"
                    className="w-full bg-surface-2 border border-white/[0.1] p-3 pl-10 text-sm text-white placeholder:text-slate-700 focus:border-accent outline-none transition-colors"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-danger text-[10px] mt-1 uppercase tracking-widest">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Authorization / Code</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-surface-2 border border-white/[0.1] p-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-700 focus:border-accent outline-none transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-danger text-[10px] mt-1 uppercase tracking-widest">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent-light text-white p-3 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSubmitting ? "AUTH_PENDING..." : "INITIATE_SESSION"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-8 pt-6 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-3 h-3 text-accent" />
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Debug / Demo Credentials</p>
              </div>
              <p className="text-[10px] text-slate-400 bg-surface-2 p-2 border border-white/[0.05]">
                <span className="text-accent">UID:</span> pranay.jain@ethara.ai <br/>
                <span className="text-accent">PWD:</span> Ethara@123
              </p>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-8 tracking-widest uppercase">
            New node operator?{" "}
            <Link to="/signup" className="text-accent hover:text-white transition-colors">
              Request Access →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
