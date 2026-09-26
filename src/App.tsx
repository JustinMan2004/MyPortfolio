import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useRoute } from './lib/router';
import { StoreProvider } from './lib/store';
import { AboutPage } from './pages/AboutPage';
import { EvidencePage } from './pages/EvidencePage';
import { HomePage } from './pages/HomePage';
import { ManagePage } from './pages/ManagePage';
import { OutcomesPage } from './pages/OutcomesPage';
import { SprintPage } from './pages/SprintPage';
import { SprintsPage } from './pages/SprintsPage';
import { StoriesPage } from './pages/StoriesPage';
import { ToolsPage } from './pages/ToolsPage';

function Pages() {
  const route = useRoute();

  useEffect(() => {
    if (route.page !== 'stories' || !route.id) window.scrollTo({ top: 0 });
  }, [route]);

  let page;
  switch (route.page) {
    case 'sprints':
      page = <SprintsPage />;
      break;
    case 'sprint':
      page = <SprintPage key={route.number} number={route.number} />;
      break;
    case 'stories':
      page = <StoriesPage focusId={route.id} />;
      break;
    case 'leeruitkomsten':
      page = <OutcomesPage code={route.code} />;
      break;
    case 'bewijs':
      page = <EvidencePage focusId={route.id} />;
      break;
    case 'tools':
      page = <ToolsPage />;
      break;
    case 'over-mij':
      page = <AboutPage />;
      break;
    case 'beheer':
      page = <ManagePage />;
      break;
    default:
      page = <HomePage />;
  }

  return <Layout route={route}>{page}</Layout>;
}

export default function App() {
  return (
    <StoreProvider>
      <Pages />
    </StoreProvider>
  );
}
