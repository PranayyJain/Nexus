# 🚀 Ethara Nexus Deployment Guide

This guide provide step-by-step instructions to deploy the **Ethara Nexus** platform (Frontend & Backend) using GitHub and Railway.

---

## 📦 Step 1: GitHub Repository Setup

1. **Initialize Git** in the project root:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for deployment"
   ```
2. **Create a new repository** on GitHub (e.g., `ethara-nexus`).
3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ethara-nexus.git
   git branch -M main
   git push -u origin main
   ```

---

## 🛠 Step 2: Railway Backend Deployment

1. Login to [Railway.app](https://railway.app/).
2. Click **+ New Project** > **Deploy from GitHub repo** > Select `ethara-nexus`.
3. When prompted, select the **Root Directory** as `/backend`.
4. **Provision a Database**:
   - Click **+ Add Service** > **Database** > **Add PostgreSQL**.
   - Railway will automatically provide a `DATABASE_URL`.
5. **Configure Environment Variables**:
   - Go to the **Variables** tab for the backend service.
   - Add the following:
     | Variable | Value |
     | --- | --- |
     | `DATABASE_URL` | (Use the one from Railway PostgreSQL) |
     | `DIRECT_URL` | (Same as DATABASE_URL, or direct connection if using Supabase) |
     | `JWT_SECRET` | (A long random string) |
     | `FRONTEND_URL` | (Your Frontend Railway URL - set this *after* frontend is deployed) |
     | `NODE_ENV` | `production` |
6. **Verify Build**: Railway will use `railway.toml` to run migrations and start the server.

---

## 🌐 Step 3: Railway Frontend Deployment

1. In the same project, click **+ New Service** > **GitHub Repo** > Select `ethara-nexus`.
2. Select the **Root Directory** as `/frontend`.
3. **Configure Environment Variables**:
   - Go to the **Variables** tab for the frontend service.
   - Add the following:
     | Variable | Value |
     | --- | --- |
     | `VITE_API_URL` | `https://your-backend-url.railway.app/api` |
4. **Build & Deploy**: Railway will build the React app and serve it using `serve`.

---

## ✅ Step 4: Final Linkage

1. Once the frontend is deployed, copy its URL (e.g., `https://ethara-nexus-production.up.railway.app`).
2. Go back to the **Backend Service** > **Variables**.
3. Update `FRONTEND_URL` with your actual frontend URL to allow CORS.

---

## 🔍 Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` in the backend exactly matches the frontend URL (no trailing slash).
- **Prisma Migrations**: If migrations fail, ensure `DIRECT_URL` is correctly set.
- **API Connection**: Check the browser console (F12) to ensure `VITE_API_URL` points to the correct backend endpoint.

---
*Built by Antigravity for Ethara.ai*
