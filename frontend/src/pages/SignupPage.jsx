// =============================================================
// ETHARA NEXUS - Signup Page (Cyber-Industrial Version)
// =============================================================
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Eye, EyeOff, ArrowRight, User, Mail, Lock, Terminal, ShieldCheck, Database, Cpu } from "lucide-react";
import api from "../lib/api";
import { toast } from "../hooks/useToast";
import useAuthStore from "../store/authStore";
import { Button } from "../components/ui/Button";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "MEMBER"]),
  department: z.string().optional(),
});

const DEPARTMENTS = ["SDE", "QR", "QL", "TASKER", "TPM", "HR", "PL"];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [logs, setLogs] = useState([]);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "MEMBER", department: "SDE" },
  });

  // Technical log simulation
  useEffect(() => {
    const messages = [
      "REQUESTING_NODE_IDENTITY...",
      "SCANNING_CREDENTIAL_PROTOCOLS...",
      "ESTABLISHING_ENCRYPTION_LAYERS...",
      "WAITING_FOR_ADMIN_AUTHORIZATION...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, { id: Date.now(), text: messages[i] }]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/signup", data);
      setAuth(res.data.user, res.data.token);
      toast.success("Account created! Welcome to Ethara Nexus 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row overflow-hidden font-mono selection:bg-accent selection:text-white">
      {/* ── Left Side: Technical Visuals ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col p-12 border-r border-white/[0.08] bg-[#080808]">
        {/* Structural Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
        
        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-accent flex items-center justify-center border border-accent-light shadow-[4px_4px_0px_rgba(255,69,0,0.3)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase leading-none">ETHARA</h1>
            <p className="text-[10px] text-accent font-bold tracking-[0.3em] mt-1 uppercase">Node_Enrollment</p>
          </div>
        </div>

        {/* Node Identity Visual */}
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4 uppercase tracking-tight">
              Initialize your <br/> <span className="text-accent underline decoration-2 underline-offset-8">Operations Hub</span>
            </h2>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              {"//"} ACCESS_PROTOCOL_EN-99: Join the Nexus network to coordinate AI operations, track throughput, and manage project lifecycles.
            </p>
          </div>

          {/* Technical Info Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="border border-white/[0.08] p-4 bg-white/[0.02]">
              <ShieldCheck className="w-5 h-5 text-accent mb-3" />
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Security</p>
              <p className="text-xs text-white uppercase">AES-256 Auth</p>
            </div>
            <div className="border border-white/[0.08] p-4 bg-white/[0.02]">
              <Cpu className="w-5 h-5 text-accent mb-3" />
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Runtime</p>
              <p className="text-xs text-white uppercase">Nexus_v2.0_STABLE</p>
            </div>
          </div>

          {/* Scrolling System Logs */}
          <div className="mt-12 space-y-2 font-mono text-[10px] text-slate-600">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-accent">{">"}</span>
                  <span className="tracking-widest uppercase">{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-auto pt-8 border-t border-white/[0.05] flex justify-between items-center text-[10px] text-slate-700 tracking-[0.2em] uppercase">
          <span>ETHARA_CORP // 2026</span>
          <div className="flex gap-4">
            <Database className="w-3 h-3" />
            <Terminal className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ── Right Side: Signup Form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-accent flex items-center justify-center border border-accent-light">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">New_User_Setup</h2>
            <p className="text-slate-500 text-xs tracking-wider uppercase">Configure node credentials and role.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                01. Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-transparent group-focus-within:bg-accent transition-colors" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent transition-colors" />
                <input
                  {...register("fullName")}
                  placeholder="IDENTIFY_NAME"
                  className="w-full bg-[#111] border border-white/[0.08] px-10 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-white/[0.15] transition-all"
                />
              </div>
              {errors.fullName && <p className="text-accent text-[10px] mt-1 uppercase font-bold tracking-tighter">! ERROR: {errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                02. Communication Port (Email)
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-transparent group-focus-within:bg-accent transition-colors" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="NAME@ETHARA.AI"
                  className="w-full bg-[#111] border border-white/[0.08] px-10 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-white/[0.15] transition-all uppercase"
                />
              </div>
              {errors.email && <p className="text-accent text-[10px] mt-1 uppercase font-bold tracking-tighter">! ERROR: {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                03. Encryption Key (Password)
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-transparent group-focus-within:bg-accent transition-colors" />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent transition-colors" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full bg-[#111] border border-white/[0.08] px-10 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-white/[0.15] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-accent text-[10px] mt-1 uppercase font-bold tracking-tighter">! ERROR: {errors.password.message}</p>}
            </div>

            {/* Role & Dept */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  04. System Role
                </label>
                <select {...register("role")} className="w-full bg-[#111] border border-white/[0.08] px-3 py-3 text-xs text-white focus:outline-none focus:border-white/[0.15] uppercase appearance-none">
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  05. Sector
                </label>
                <select {...register("department")} className="w-full bg-[#111] border border-white/[0.08] px-3 py-3 text-xs text-white focus:outline-none focus:border-white/[0.15] uppercase appearance-none">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold text-xs py-4 flex items-center justify-center gap-3 border-none rounded-none shadow-[6px_6px_0px_rgba(255,69,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-[0.2em]"
            >
              Initialize Node <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-12 text-center text-[10px] text-slate-600 tracking-widest uppercase">
            Existing Node?{" "}
            <Link to="/login" className="text-white hover:text-accent transition-colors underline underline-offset-4">
              Authorize_Access
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 bg-[length:100%_4px,3px_100%] opacity-20" />
    </div>
  );
}
