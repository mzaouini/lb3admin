import { useState, useEffect } from 'react';
import { getAllSalaryAdvances, getPendingSalaryAdvances, getAllEmployees } from '../services/database';
import type { SalaryAdvance, Employee } from '../lib/supabase';

interface TransactionWithEmployee extends SalaryAdvance {
  employeeName: string;
  employeeId: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithEmployee[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<TransactionWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const [advances, pending, employees] = await Promise.all([
          getAllSalaryAdvances(),
          getPendingSalaryAdvances(),
          getAllEmployees(),
        ]);

        // Create employee lookup map
        const employeeMap = new Map<number, Employee>();
        employees.forEach(emp => employeeMap.set(emp.id, emp));

        // Enrich transactions with employee data
        const enrichedAdvances = advances.map(adv => ({
          ...adv,
          employeeName: employeeMap.get(adv.user_id)?.name || 'Unknown',
          employeeId: `EMP-${String(adv.user_id).padStart(4, '0')}`,
        }));

        const enrichedPending = pending.map(adv => ({
          ...adv,
          employeeName: employeeMap.get(adv.user_id)?.name || 'Unknown',
          employeeId: `EMP-${String(adv.user_id).padStart(4, '0')}`,
        }));

        setTransactions(enrichedAdvances);
        setPendingTransactions(enrichedPending);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const refetch = async () => {
    try {
      const [advances, pending, employees] = await Promise.all([
        getAllSalaryAdvances(),
        getPendingSalaryAdvances(),
        getAllEmployees(),
      ]);

      const employeeMap = new Map<number, Employee>();
      employees.forEach(emp => employeeMap.set(emp.id, emp));

      const enrichedAdvances = advances.map(adv => ({
        ...adv,
        employeeName: employeeMap.get(adv.user_id)?.name || 'Unknown',
        employeeId: `EMP-${String(adv.user_id).padStart(4, '0')}`,
      }));

      const enrichedPending = pending.map(adv => ({
        ...adv,
        employeeName: employeeMap.get(adv.user_id)?.name || 'Unknown',
        employeeId: `EMP-${String(adv.user_id).padStart(4, '0')}`,
      }));

      setTransactions(enrichedAdvances);
      setPendingTransactions(enrichedPending);
      setError(null);
    } catch (err) {
      console.error('Error refetching transactions:', err);
      setError('Failed to reload transactions');
    }
  };

  return { transactions, pendingTransactions, loading, error, refetch };
}
