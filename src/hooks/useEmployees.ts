import { useState, useEffect } from 'react';
import { getAllEmployees } from '../services/database';
import type { Employee } from '../lib/supabase';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const data = await getAllEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const refetch = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching employees:', err);
      setError('Failed to reload employees');
    }
  };

  return { employees, loading, error, refetch };
}
