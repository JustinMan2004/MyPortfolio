import { useEffect, useState } from 'react';

/** Eenvoudige hash-router: werkt op elke (statische) host zonder serverconfiguratie. */

export type Route =
  | { page: 'home' }
  | { page: 'sprints' }
  | { page: 'sprint'; number: number }
  | { page: 'stories'; id?: string }
  | { page: 'leeruitkomsten'; code?: string }
  | { page: 'bewijs'; id?: string }
  | { page: 'tools' }
  | { page: 'over-mij' }
  | { page: 'beheer' };

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const [first, second] = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  switch (first) {
    case 'sprints':
      return { page: 'sprints' };
    case 'sprint': {
      const n = Number(second);
      return n >= 1 && n <= 8 ? { page: 'sprint', number: n } : { page: 'sprints' };
    }
    case 'stories':
      return { page: 'stories', id: second ?? params.get('id') ?? undefined };
    case 'leeruitkomsten':
      return { page: 'leeruitkomsten', code: second };
    case 'bewijs':
      return { page: 'bewijs', id: second };
    case 'tools':
      return { page: 'tools' };
    case 'over-mij':
      return { page: 'over-mij' };
    case 'beheer':
      return { page: 'beheer' };
    default:
      return { page: 'home' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const href = {
  home: '#/',
  sprints: '#/sprints',
  sprint: (n: number) => `#/sprint/${n}`,
  stories: (id?: string) => (id ? `#/stories/${id}` : '#/stories'),
  leeruitkomsten: (code?: string) => (code ? `#/leeruitkomsten/${code}` : '#/leeruitkomsten'),
  bewijs: (id?: string) => (id ? `#/bewijs/${id}` : '#/bewijs'),
  tools: '#/tools',
  overMij: '#/over-mij',
  beheer: '#/beheer',
};
