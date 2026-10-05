import { interviews } from "../lib/data";

export function Graduation({
  lessons,
  lessonsDone,
  completed,
  exercises,
  projects,
  projectDone,
  interviewDone,
  xp,
  streak,
  onPrint,
  onContinue
}: {
  lessons: number;
  lessonsDone: number;
  completed: number;
  exercises: number;
  projects: number;
  projectDone: number;
  interviewDone: number;
  xp: number;
  streak: number;
  onPrint: () => void;
  onContinue: () => void;
}) {
  const requirements = [
    ['SQL lessons · self-reported', lessonsDone, lessons],
    ['SQL challenges', completed, Math.min(exercises, 8)],
    ['Analyst project submissions', projectDone, Math.min(projects, 2)],
    ['Interview practice submissions', interviewDone, Math.min(5, interviews.length)]
  ];
  const earned = requirements.filter(([, v, t]) => (v as number) >= (t as number)).length;
  const ready = earned === requirements.length;

  return (
    <div className="graduation-page">
      <div className="section-head">
        <h2>Graduation & Analyst Profile</h2>
        <span>{ready ? 'Academy requirements complete' : 'Finish the requirements to unlock your certificate'}</span>
      </div>
      <div className="certificate card">
        <div className="certificate-inner">
          <div className="certificate-mark">&gt;_</div>
          <div className="eyebrow">SQL ANALYST ACADEMY</div>
          <h1>{ready ? 'Certificate of Completion' : 'Analyst Progress Record'}</h1>
          <p className="certificate-lead">
            {ready
              ? 'This local completion record combines self-reported SQL lesson study with the academy SQL challenges, analyst projects, and interview practice submissions. It is not an accredited certification or a data engineering assessment.'
              : 'Complete the SQL track requirements below to unlock a local completion record. The broader data engineering roadmap has separate progress in the Learning Zone.'}
          </p>
          <div className="certificate-stats">
            <div><b>{xp}</b><span>XP earned</span></div>
            <div><b>{streak}</b><span>day streak</span></div>
            <div><b>{completed}</b><span>challenges</span></div>
            <div><b>{projectDone}</b><span>projects</span></div>
          </div>
          {ready && <div className="certificate-name">SQL Analyst · Data Analytics Track</div>}
        </div>
      </div>
      <div className="graduation-grid">
        <div className="card card-pad">
          <div className="panel-head">
            <b>Completion checklist</b>
            <span>{earned}/{requirements.length}</span>
          </div>
          {requirements.map(([label, value, target]) => (
            <div className="requirement" key={label as string}>
              <span>{(value as number) >= (target as number) ? '✓' : '○'}</span>
              <div>
                <b>{label as string}</b>
                <small>{value as number} / {target as number}</small>
              </div>
              <strong>{(value as number) >= (target as number) ? 'Complete' : 'In progress'}</strong>
            </div>
          ))}
        </div>
        <div className="card card-pad">
          <div className="eyebrow">WHAT YOU CAN NOW DO</div>
          <h3>Analyst-ready SQL workflow</h3>
          <ul className="graduate-list">
            <li>Translate stakeholder questions into SQL-ready metrics.</li>
            <li>Control table grain and debug joins.</li>
            <li>Use CTEs, subqueries and window functions.</li>
            <li>Build healthcare, operations, commerce and streaming analyses.</li>
            <li>Explain findings as business recommendations, not just query output.</li>
          </ul>
          <div className="actions">
            <button className="btn primary" onClick={onContinue}>Continue learning →</button>
            {ready && <button className="btn" onClick={onPrint}>Print / Save certificate</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
