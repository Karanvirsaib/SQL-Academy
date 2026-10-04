import { Module } from "../types";

export function ModuleCard({ m, completed }: { m: Module; completed: number }) {
  const total = m.items.length;
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="card card-pad">
      <div className="panel-head">
        <b>
          <span style={{ marginRight: 6 }}>{m.icon}</span>
          {m.title}
        </b>
        <span>{completed}/{total}</span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "4px 0 8px" }}>{m.desc}</p>
      <div className="mini-progress" style={{ marginBottom: 6 }}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <strong style={{ fontSize: 12 }}>{pct}%</strong>
    </div>
  );
}
