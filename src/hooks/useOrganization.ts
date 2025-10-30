import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Organization {
  id: number;
  code: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('organizations')
          .select('*')
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching organization:', fetchError);
          setError('Failed to load organization');
        } else {
          setOrganization(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching organization:', err);
        setError('Failed to load organization');
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, []);

  return { organization, loading, error };
}
