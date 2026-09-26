/**
 * Minimale hash-router (#/sprints/1). Werkt op iedere statische host zonder
 * extra serverconfiguratie, en links zijn deelbaar met docenten.
 */
import { useEffect, useState } from 'react';

const read = () => window.location.hash.replace(/^#/, '') || '/';

export function useRoute() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setPath(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const [pathname, query = ''] = path.split('?');
  return { segments: pathname.split('/').filter(Boolean), query: new URLSearchParams(query) };
}

export const href = (path: string) => `#${path}`;
