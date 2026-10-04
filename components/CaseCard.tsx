import { CaseStudy } from "../types";

export function CaseCard({ c, onClick }: { c: CaseStudy, onClick: () => void }) {
  return (
    <div className="case">
      <div className="case-icon">{c.icon}</div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
      <div className="case-footer">
        <span className="difficulty">{c.difficulty}</span>
        <button className="link-btn" onClick={onClick}>Explore →</button>
      </div>
    </div>
  );
}
