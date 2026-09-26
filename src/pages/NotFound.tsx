import { href } from '../lib/router';

export function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow mb-2">404</p>
      <h1 className="h-page">Pagina niet gevonden</h1>
      <p className="mt-2 text-muted">Deze pagina bestaat (nog) niet.</p>
      <a href={href('/')} className="btn btn-primary mt-6">
        Naar home
      </a>
    </div>
  );
}
