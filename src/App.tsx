import { Layout } from './components/Layout';
import { useRoute } from './lib/router';
import { AboutPage } from './pages/AboutPage';
import { EvidencePage } from './pages/EvidencePage';
import { HomePage } from './pages/HomePage';
import { LearningOutcomeDetailPage, LearningOutcomesPage } from './pages/LearningOutcomePages';
import { NotFound } from './pages/NotFound';
import { SprintPage, SprintsPage } from './pages/SprintPage';

export default function App() {
  const { segments, query } = useRoute();
  const [page, param] = segments;

  let content;
  if (!page) content = <HomePage />;
  else if (page === 'sprints' && param) content = <SprintPage key={param} number={Number(param)} openStory={query.get('story')} />;
  else if (page === 'sprints') content = <SprintsPage />;
  else if (page === 'leeruitkomsten' && param) content = <LearningOutcomeDetailPage code={param} />;
  else if (page === 'leeruitkomsten') content = <LearningOutcomesPage />;
  else if (page === 'bewijs') content = <EvidencePage />;
  else if (page === 'over-mij') content = <AboutPage />;
  else content = <NotFound />;

  return <Layout current={segments.join('/')}>{content}</Layout>;
}
