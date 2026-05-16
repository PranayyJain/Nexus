// =============================================================
// ETHARA NEXUS - World-Class Landing Page
// Hero, Features, Stats, CTA, Footer
// =============================================================
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Zap, ArrowRight, CheckCircle2, FolderKanban, Users,
  BarChart3, Shield, Kanban, Bell, Terminal,
  Globe, ChevronRight, Star
} from "lucide-react";

// ── Animation helpers ──
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function AnimatedSection({ children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ── Feature data ──
const FEATURES = [
  { icon: Kanban,     color: "#6366f1", title: "Drag & Drop Kanban",      desc: "Visualise sprint progress across To Do, In Progress, Review, and Done columns." },
  { icon: BarChart3,  color: "#10b981", title: "Analytics Dashboard",     desc: "Real-time charts for team velocity, task completion, and overdue tracking." },
  { icon: Users,      color: "#f59e0b", title: "Role-Based Access",       desc: "Admins manage projects while members focus on their assigned tasks." },
  { icon: Bell,       color: "#ec4899", title: "Smart Notifications",     desc: "Get alerted on assignments, deadlines, and completions — instantly." },
  { icon: Terminal,   color: "#8b5cf6", title: "Command Palette",         desc: "Search tasks, projects, and people instantly with ⌘K — no mouse needed." },
  { icon: Shield,     color: "#3b82f6", title: "JWT Auth & Security",     desc: "Secure authentication with hashed passwords and token-based sessions." },
];

const STATS = [
  { value: "10+", label: "Team Roles Supported" },
  { value: "6",   label: "AI Project Templates" },
  { value: "5",   label: "Task Statuses" },
  { value: "∞",   label: "Tasks & Comments" },
];

const INTEGRATIONS = ["Multimango", "Odoo", "Google Sheets", "Slack", "GitHub", "Notion"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-white overflow-x-hidden">

      {/* ━━━━━━━━━━━━━━━━━━━ NAVBAR ━━━━━━━━━━━━━━━━━━━ */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4
                      bg-surface/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow-accent">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white tracking-tight">ETHARA NEXUS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary text-sm px-4 py-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        {/* Background blobs */}
        <div className="blob w-96 h-96 bg-accent top-20 left-1/4" style={{ animationDelay: "0s" }} />
        <div className="blob w-80 h-80 bg-purple-600 bottom-20 right-1/4" style={{ animationDelay: "2s" }} />
        <div className="blob w-72 h-72 bg-pink-600 top-1/2 right-1/3" style={{ animationDelay: "4s" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDB2Nmg2di02aC02em0tNiAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium mb-8"
          >
            <Star className="w-3.5 h-3.5" />
            Internal AI Operations Platform — Ethara.ai
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
          >
            Powering AI Teams{" "}
            <span className="gradient-text">Beyond Productivity</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ethara Nexus streamlines task execution, quality operations, and AI workflows
            for modern enterprise teams — from SDEs to TPMs, QRs to PLs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/signup" className="btn-primary text-base px-6 py-3 shadow-glow-accent">
              Launch Platform <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-6 py-3">
              Sign In
            </Link>
          </motion.div>

          {/* Demo dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="glass rounded-3xl overflow-hidden p-1 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="bg-surface-2 rounded-2xl p-6">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-danger/70" />
                  <div className="w-3 h-3 rounded-full bg-warning/70" />
                  <div className="w-3 h-3 rounded-full bg-success/70" />
                  <div className="flex-1 mx-4 bg-surface-3 rounded-md h-6 flex items-center px-3">
                    <span className="text-slate-500 text-xs">nexus.ethara.ai/dashboard</span>
                  </div>
                </div>

                {/* Mock dashboard grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Projects", val: "6", color: "#6366f1" },
                    { label: "Total Tasks", val: "48", color: "#10b981" },
                    { label: "Overdue", val: "3", color: "#ef4444" },
                    { label: "Done Today", val: "7", color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface-3/80 rounded-xl p-3 border border-white/[0.05]">
                      <p className="text-slate-500 text-[10px] mb-1">{s.label}</p>
                      <p className="text-xl font-bold font-display" style={{ color: s.color }}>{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Mock kanban preview */}
                <div className="grid grid-cols-3 gap-3">
                  {["To Do", "In Progress", "Done"].map((col, i) => (
                    <div key={col} className="bg-surface-3/50 rounded-xl p-3 border border-white/[0.04]">
                      <p className="text-slate-400 text-xs font-medium mb-3">{col}</p>
                      {[...Array(i === 1 ? 2 : 1)].map((_, j) => (
                        <div key={j} className="bg-surface-4/60 rounded-lg p-2.5 mb-2 border border-white/[0.04]">
                          <div className="h-2 bg-slate-600/60 rounded w-3/4 mb-1.5" />
                          <div className="h-1.5 bg-slate-700/60 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow reflection */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20
                            bg-accent/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ STATS ━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 border-y border-white/[0.05] bg-surface-1/30">
        <AnimatedSection className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p className="font-display font-black text-4xl text-white mb-1">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </AnimatedSection>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ FEATURES ━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 px-6">
        <AnimatedSection className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-accent-light text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Everything your AI team needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built for the Ethara.ai workflow — from annotation sprints to model monitoring.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="glass p-6 glass-hover group"
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                     style={{ backgroundColor: f.color + "20", border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ INTEGRATIONS ━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 px-6 border-y border-white/[0.05] bg-surface-1/20">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <Globe className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl text-white mb-2">Integrated with your stack</h2>
            <p className="text-slate-400 mb-10">Nexus works seamlessly with the tools Ethara already uses.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <span key={name}
                    className="px-5 py-2.5 glass-sm text-slate-300 text-sm font-medium glass-hover">
                {name}
              </span>
            ))}
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="blob w-96 h-96 bg-accent opacity-15 top-0 left-1/3" />
        <AnimatedSection className="relative z-10 max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-display font-black text-5xl text-white mb-5">
            Ready to ship faster?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10">
            Join the Ethara team on Nexus — the platform built for how you actually work.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 shadow-glow-accent">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━━━━ */}
      <footer className="border-t border-white/[0.05] py-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-display font-bold text-white text-sm">ETHARA NEXUS</span>
          <span className="text-slate-600 text-xs ml-2">© 2026 Ethara.ai</span>
        </div>
        <p className="text-slate-600 text-xs">Powering AI Teams Beyond Productivity</p>
      </footer>
    </div>
  );
}
