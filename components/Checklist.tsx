import { useState } from "react";
import { Module } from "../types";
import { loadPlan, savePlan } from "../lib/plan";
import { ModuleCard } from "./ModuleCard";

export function Checklist() {
  const [modules, setModules] = useState<Module[]>(loadPlan());

  const update = (modId: string, itemId: number) => {
    const next = modules.map((m) =>
      m.id === modId
        ? { ...m, items: m.items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it)) }
        : m
    );
    setModules(next);
    savePlan(next);
  };

  const totalDone = modules.reduce((s, m) => s + m.items.filter((i) => i.done).length, 0);
  const totalItems = modules.reduce((s, m) => s + m.items.length, 0);
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Cloud / AI Data Engineering — Course Plan</h2>
          <span>Start to expert. Tick as you complete. Nothing left out.</span>
        </div>
        <span>5 phases · {totalDone}/{totalItems} done</span>
      </div>

      <div className="mastery-hero card" style={{ marginBottom: 12 }}>
        <div>
          <div className="eyebrow">COURSE PROGRESS</div>
          <h1>{overallPct}%</h1>
          <p>Based on checked items across foundations, cloud, pipeline, projects, interview.</p>
        </div>
        <div className="readiness-ring"><span>{totalDone}</span><small>items</small></div>
      </div>

      <div className="mastery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {modules.map((m) => (
          <ModuleCard key={m.id} m={m} completed={m.items.filter((i) => i.done).length} />
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 6 }}>Checklist — tick to save</h3>
        {modules.map((m) => (
          <div key={m.id} className="card card-pad" style={{ marginBottom: 8 }}>
            <div className="panel-head"><b><span style={{ marginRight: 6 }}>{m.icon}</span>{m.title}</b></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {m.items.map((it) => (
                <button
                  key={it.id}
                  className="btn"
                  style={{
                    background: it.done ? "var(--primary)" : "var(--surface)",
                    color: it.done ? "#fff" : "inherit",
                    border: "1px solid var(--border)",
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  onClick={() => update(m.id, it.id)}
                  aria-pressed={it.done}
                >
                  {it.done ? "✓" : "○"} {it.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
