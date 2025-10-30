import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/database';

interface DashboardStats {
  totalEmployees: number;
  activeAdvances: number;
  totalVolume: number;
  avgAdvance: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeAdvances: 0,
    totalVolume: 0,
    avgAdvance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const refetch = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching dashboard stats:', err);
      setError('Failed to reload dashboard stats');
    }
  };

  return { stats, loading, error, refetch };
}
