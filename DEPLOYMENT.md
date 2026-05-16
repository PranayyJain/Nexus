# 🚀 Ethara Nexus Deployment Guide (Vercel)

This guide provides step-by-step instructions to deploy the **Ethara Nexus** platform (Frontend & Backend) using GitHub and Vercel.

---

## 📦 Step 1: GitHub Repository Setup

1. **Initialize Git** in the project root:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for vercel deployment"
   ```
2. **Create a new repository** on GitHub (e.g., `ethara-nexus`).
3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ethara-nexus.git
   git branch -M main
   git push -u origin main
   ```

---

## 🗄 Step 2: Database Setup (Supabase or Vercel Postgres)

Since we are moving away from Railway, you need a PostgreSQL database.

### Option A: Supabase (Recommended)
1. Create a project at [supabase.com](https://supabase.com/).
2. Go to **Project Settings** > **Database**.
3. Copy the **Connection String** (Transaction mode, port 6543).
4. You will need this for `DATABASE_URL`.

### Option B: Vercel Postgres
1. In your Vercel Dashboard, go to the **Storage** tab.
2. Click **Create** > **Postgres**.
3. Connect it to your backend project later.

---

## 🛠 Step 3: Vercel Backend Deployment

1. Go to [Vercel](https://vercel.com/new).
2. Import your `ethara-nexus` repository.
3. **Project Name**: `ethara-nexus-api`.
4. **Root Directory**: Select `backend`.
5. **Framework Preset**: `Other`.
6. **Build & Development Settings**:
   - **Build Command**: `npx prisma generate` (or leave empty if using `postinstall`).
   - **Install Command**: `npm install`.
7. **Environment Variables**:
   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | (Your Supabase/Postgres URL) |
   | `DIRECT_URL` | (Same as DATABASE_URL for Prisma) |
   | `JWT_SECRET` | (A long random string) |
   | `FRONTEND_URL` | (Your Vercel Frontend URL - set this *after* frontend is deployed) |
   | `NODE_ENV` | `production` |
8. **Deploy**.

---

## 🌐 Step 4: Vercel Frontend Deployment

1. Go to [Vercel](https://vercel.com/new) again.
2. Import the same `ethara-nexus` repository.
3. **Project Name**: `ethara-nexus-web`.
4. **Root Directory**: Select `frontend`.
5. **Framework Preset**: `Vite`.
6. **Environment Variables**:
   | Variable | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://ethara-nexus-api.vercel.app/api` |
7. **Deploy**.

---

## ✅ Step 5: Final Linkage

1. Once the frontend is deployed, copy its URL (e.g., `https://ethara-nexus-web.vercel.app`).
2. Go back to your **Backend Project** in Vercel > **Settings** > **Environment Variables**.
3. Update `FRONTEND_URL` with your actual frontend URL.
4. Redeploy the backend if necessary.

---

## 🔍 Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` in the backend exactly matches the frontend URL (no trailing slash).
- **Prisma Migrations**: Before the first deployment, run `npx prisma db push` from your local `backend` folder while connected to the production database to sync the schema.
- **API Connection**: Check the browser console (F12) to ensure `VITE_API_URL` points to the correct Vercel deployment.

---
*Built by Antigravity for Ethara.ai*
