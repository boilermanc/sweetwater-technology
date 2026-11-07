import { SweetwaterLogo } from '../components/SweetwaterLogo';
import './client-projects.css';

// Only published client-facing fields belong in this contract.
export interface ClientProject {
  id: string;
  title: string;
  stage: string;
  summary: string;
  next_step: string;
  due_date: string | null;
  updated_at: string;
}

export default function ClientProjectList({ projects, loading, error, onRefresh, onSignOut }: {
  projects: ClientProject[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  return <div className="client-workspace">
    <header className="client-header"><a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a><button onClick={onSignOut}>Sign out</button></header>
    <main className="client-main">
      <div className="client-heading"><div><p className="client-eyebrow">YOUR SWEETWATER PROJECTS</p><h1>Clear progress.<br />Your next step.</h1><p>Updates from your Sweetwater team, all in one place.</p></div><button onClick={onRefresh} disabled={loading}>Refresh updates</button></div>
      {loading && <p role="status">Loading your projects…</p>}
      {error && <p className="client-message" role="alert">{error}</p>}
      {!loading && !error && !projects.length && <section className="client-project"><h2>No projects shared yet.</h2><p>Your Sweetwater team will share your project here when it is ready. If you expected to see one, contact the person managing your project.</p></section>}
      {!loading && !error && projects.map(project => <article className="client-project" key={project.id}>
        <p className="client-stage">{project.stage}</p><h2>{project.title}</h2>
        <p className="client-summary">{project.summary || 'Your team will post an update here soon.'}</p>
        <section className="client-next"><h3>What happens next</h3><p>{project.next_step || 'Your team is confirming the next step.'}</p>{project.due_date && <p>Target date: <time dateTime={project.due_date}>{new Date(`${project.due_date}T12:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>}</section>
        <p className="client-updated">Updated <time dateTime={project.updated_at}>{new Date(project.updated_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>
      </article>)}
    </main><footer className="client-footer">SWEETWATER TECHNOLOGY · Thoughtful systems. Practical progress.</footer>
  </div>;
}
