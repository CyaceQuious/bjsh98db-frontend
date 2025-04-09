import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useRouteHistory() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(prev => [...prev, router.asPath]);
  }, [router.asPath]);

  const canGoBack = history.length > 1;

  return { canGoBack };
}