import { useEffect, useState } from 'react';

export function useAccessToken(): string | null {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccessToken() {
      const response = await fetch('/api/auth/access-token');
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
      }
    }
    fetchAccessToken();
  }, []);

  return accessToken;
}