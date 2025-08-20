import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<'checking' | 'ok' | 'nope'>('checking');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/session', { credentials: 'include' });
        setStatus(res.ok ? 'ok' : 'nope');
        if (res.status === 401) {
          const nextUrl = `/app${location.pathname}${location.search}`;
          window.location.href = `/login?next=${encodeURIComponent(nextUrl)}`;
        }
      } catch {
        setStatus('nope');
        const nextUrl = `/app${location.pathname}${location.search}`;
        window.location.href = `/login?next=${encodeURIComponent(nextUrl)}`;
      }
    })();
  }, [location.pathname, location.search]);

  if (status === 'checking') return null; // or a spinner
  if (status === 'nope') return null;     // browser is redirecting
  return children;
}
