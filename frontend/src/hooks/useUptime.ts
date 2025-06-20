// src/hooks/useUptime.ts
import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from './useAuth';
import { UptimeEvent, DomainStats , Domain} from '../types';

export function useUptime(domainId?: number) {
  const [events, setEvents] = useState<UptimeEvent[]>([]);
  const [stats, setStats] = useState<DomainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (domainId == null) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch current status
        const statusRes = await api.get<{ error?: string; response_time_ms?: number; status?: string }>(`/monitor/uptime/${domainId}`, config);
        const statusData = statusRes.data;
        if (statusData?.error) {
          throw new Error(statusData.error);
        }

        // Fetch historical events (implement this endpoint)
        const eventsRes = await api.get(`/monitor/uptime/${domainId}/events`, config);
        
        // Fetch statistics (implement this endpoint)
        const statsRes = await api.get<{ uptime?: number; incidentsToday?: number }>(`/monitor/uptime/${domainId}/stats`, config);

        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data as UptimeEvent[] : []);
        
        setStats({
          domain: '', // Domain name not available in statusData, set as empty or fetch from elsewhere
          uptime: statsRes.data?.uptime ?? 100,
          avgResponseTime: statusRes.data?.response_time_ms ?? 0,
          incidentsToday: statsRes.data?.incidentsToday ?? 0,
          status: statusRes.data?.status === 'UP' ? 'UP' : 'DOWN',
          lastCheck: new Date().toISOString(),
          domain_id: domainId,
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch uptime data');
        console.error('Uptime fetch failed:', err);
        setStats(null);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domainId, getToken]);

  return { events, stats, loading, error };
}

// // src/hooks/useUptime.ts
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import type { UptimeEvent, DomainStats } from '../types'

// export function useUptime(domainId?: number) {
//   const [events, setEvents] = useState<UptimeEvent[]>([])
//   const [stats, setStats] = useState<DomainStats | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (domainId == null) return
//     setLoading(true)
//     setError(null)

//     axios
//       .get(`/monitor/uptime/${domainId}`)
//       .then(res => {
//         const data = res.data as { uptime_events: UptimeEvent[]; domain_stats: DomainStats }
//         setEvents(data.uptime_events)
//         setStats(data.domain_stats)
//         setLoading(false)
//       })
//       .catch(err => {
//         setError(err.response?.data?.error || 'Failed to fetch uptime data')
//         setLoading(false)
//       })
//   }, [domainId])

//   return { events, stats, loading, error }
// }
