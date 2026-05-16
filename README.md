# ETHARA NEXUS
> **AI Operations & Team Collaboration Platform** — *Production-Ready AI Workflow Management*

![Ethara Nexus Banner](https://via.placeholder.com/1200x400/050505/ff4500?text=ETHARA+NEXUS+CYBER+INDUSTRIAL)

---

## 📋 Overview

Ethara Nexus is a **high-performance, production-ready AI Operations platform**. It transitions the prototype into a specialized workspace for AI teams, featuring a unique **Cyber-Industrial design system**, zero-latency data fetching, and deep integration for AI-specific metadata and documentation.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Metadata | Support for `TaskType`, `confidenceScore`, and `reviewerFeedback` on every task |
| 📚 Knowledge Base | Centralized library for SOPs, Client Requirements, and AI Research Papers |
| ⚡ Zero-Latency UX | SWR-style caching in `useData` for instantaneous route transitions |
| 🎯 AI Insights | Automated dashboard analysis of operational status and bottlenecks |
| 🎯 Drag & Drop Kanban | Optimized board with optimistic updates and performance caching |
| 📊 Advanced Analytics | Recharts-powered velocity, distribution, and team throughput charts |
| 🛡️ Production Ready | Supabase PostgreSQL integration with connection pooling |

---

## 🎨 Design System: Cyber-Industrial

The platform uses a custom **Brutalist / Cyber-Industrial** aesthetic:
- **Obsidian Theme**: Pure black (#050505) surfaces with sharp, high-contrast borders.
- **Neon Tokens**: Neon Orange (`#ff4500`) and Cyber Cyan (`#00f0ff`) primary accents.
- **Monospaced UI**: Monospaced typography for all data fields and system headers.
- **Structural Grids**: Structural background grid patterns replacing generic gradients.

---

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v3** — Cyber-Industrial Design System
- **Framer Motion** — High-performance micro-animations
- **Recharts** — Operations analytics
- **Zustand** — State management

### Backend
- **Node.js + Express.js**
- **Prisma ORM**
- **Supabase PostgreSQL** — with Connection Pooling
- **JWT Authentication**

---

## 🚀 Deployment

### Railway (Backend)
1. Set root to `/backend`
2. Add environment variables: `DATABASE_URL` (pooled), `DIRECT_URL` (for migrations), `JWT_SECRET`.
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`

### Railway (Frontend)
1. Set root to `/frontend`
2. Set `VITE_API_URL` to your backend production URL.
3. Build command: `npm run build`

---

*Built with ❤️ for Ethara.ai — Powering AI Teams Beyond Productivity*
