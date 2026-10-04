import { useState, useEffect } from "react";
import { conceptDetails } from "../lib/data";

type ConceptKey = keyof typeof conceptDetails;

export function ConceptsHub({
  conceptId,
  setConceptId,
  onPractice
}: {
  conceptId: string;
  setConceptId: (id: string) => void;
  onPractice: () => void;
}) {
  const selected = (conceptDetails[conceptId as ConceptKey] || conceptDetails.execution) as typeof conceptDetails.execution;
  const keys = Object.keys(conceptDetails) as ConceptKey[];
  const [revealed, setRevealed] = useState(false);

  useEffect(() => setRevealed(false), [conceptId]);

  return (
    <>
      <div className="section-head">
        <div>
          <h2>SQL Concepts, Visualized</h2>
          <span>Build the mental model first. Syntax comes second.</span>
        </div>
        <span>{keys.length} deep-dive concepts</span>
      </div>
      <div className="concept-tabs">
        {keys.map((k) => (
          <button key={k} className={k === conceptId ? 'selected' : ''} onClick={() => setConceptId(k)}>
            {conceptDetails[k].icon} {conceptDetails[k].title}
          </button>
        ))}
      </div>
      <div className="concept-detail-grid">
        <article className="card concept-detail">
          <div className="eyebrow">{selected.level}</div>
          <h1>{selected.icon} {selected.title}</h1>
          <p className="concept-lead">{selected.summary}</p>
          <div className="concept-visual">
            <div className="visual-label">MENTAL MODEL</div>
            <div className="visual-flow">
              {selected.steps.map((step, i) => (
                <div className="visual-step" key={step}>
                  <span>{i + 1}</span>
                  <b>{step}</b>
                  {i < selected.steps.length - 1 && <em>↓</em>}
                </div>
              ))}
            </div>
          </div>
          <div className="concept-explain">
            <div>
              <div className="eyebrow">HOW TO THINK ABOUT IT</div>
              <p>{selected.why}</p>
            </div>
            <div>
              <div className="eyebrow">TRY THIS QUERY</div>
              <pre>{selected.example}</pre>
            </div>
          </div>
          <div className="mistake-box">
            <div className="eyebrow">COMMON MISTAKES</div>
            <ul>
              {selected.mistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className="mini-check">
            <div className="eyebrow">CHECK YOUR UNDERSTANDING</div>
            <h3>{selected.check}</h3>
            {!revealed ? (
              <button className="btn secondary" onClick={() => setRevealed(true)}>Show explanation</button>
            ) : (
              <div className="check-answer">✓ {selected.answer}</div>
            )}
          </div>
        </article>
        <aside className="concept-side">
          <div className="card card-pad">
            <div className="eyebrow">LEARN LIKE AN ANALYST</div>
            <h3>Use this loop every time</h3>
            <div className="analyst-loop">
              {['Business question', 'Table grain', 'Columns / keys', 'SQL logic', 'Result validation', 'Business meaning'].map((x, i) => (
                <div key={x}>
                  <span>{i + 1}</span>{x}
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <div className="eyebrow">NEXT STEP</div>
            <h3>Turn the concept into a skill</h3>
            <p className="muted-copy">
              After understanding the model, practice it against a live dataset. Your editor starts blank so you have to construct the query yourself.
            </p>
            <button className="btn primary" onClick={onPractice}>Open Practice Lab →</button>
          </div>
        </aside>
      </div>
      <div className="card card-pad concept-flow">
        <div className="eyebrow">THE SENIOR ANALYST LOOP</div>
        <div className="flow-row">
          <span>Question</span><b>→</b>
          <span>Grain</span><b>→</b>
          <span>Schema</span><b>→</b>
          <span>SQL</span><b>→</b>
          <span>Validate</span><b>→</b>
          <span>Insight</span><b>→</b>
          <span>Action</span>
        </div>
      </div>
    </>
  );
}
