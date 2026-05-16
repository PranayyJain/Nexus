// =============================================================
// ETHARA NEXUS - Custom Hooks
// Reusable data-fetching hooks using Axios + local state
// =============================================================
import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import { toast } from "./useToast";

// Global cache for Zero-Latency SWR (Stale-While-Revalidate)
const cache = new Map();

/**
 * Generic fetch hook with loading, error, and SWR caching support
 */
export function useFetch(url, params = {}) {
  const cacheKey = url ? url + JSON.stringify(params) : null;
  const initialData = cacheKey ? cache.get(cacheKey) : null;

  const [data, setData] = useState(initialData || null);
  // Only show loading if we don't have stale cache data
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (isBackground = false) => {
    if (!url) return;
    if (!isBackground && !cache.has(cacheKey)) setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params });
      cache.set(cacheKey, res.data);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  // Initial fetch (always runs in background to revalidate cache)
  useEffect(() => { 
    if (url) fetch(true); 
  }, [fetch, url]);

  return { data, loading, error, refetch: () => fetch(false) };
}

/**
 * Hook for dashboard overview data
 */
export function useDashboard() {
  return useFetch("/dashboard/overview");
}

/**
 * Hook for all projects the user is a member of
 */
export function useProjects() {
  return useFetch("/projects");
}

/**
 * Hook for a single project's full details
 */
export function useProject(projectId) {
  return useFetch(projectId ? `/projects/${projectId}` : null);
}

/**
 * Hook for tasks with optional filter params
 */
export function useTasks(params = {}) {
  return useFetch("/tasks", params);
}

/**
 * Hook for notifications + unread count
 */
export function useNotifications() {
  return useFetch("/notifications");
}

/**
 * Hook for team performance stats
 */
export function useTeamPerformance() {
  return useFetch("/dashboard/team-performance");
}

/**
 * Hook for weekly task stats (chart data)
 */
export function useWeeklyStats() {
  return useFetch("/dashboard/weekly-stats");
}

/**
 * Hook for Library Documents
 */
export function useLibrary() {
  return useFetch("/library");
}
