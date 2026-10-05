import { LearningProgress, topics } from '../lib/curriculum';
import { Module } from '../types';

export function Checklist({modules,progress,onOpen,onToggle}:{modules:Module[];progress:LearningProgress;onOpen:(id:number)=>void;onToggle:(id:number)=>void}) {
  const complete=modules.flatMap(m=>m.items).filter(i=>i.done).length;
  return <>
    <div className="section-head"><div><h2>Your data engineering roadmap</h2><span>24 topics · learn, check your understanding, then build evidence</span></div><span>{complete}/24 self-reported complete</span></div>
    <div className="card card-pad roadmap-intro"><h3>Every checklist topic has a classroom</h3><p>Open a topic for explanations, a worked example, a practical task, and a knowledge check. Your checkmarks record your own completion; quizzes record understanding checks. Cloud and local labs state their requirements before you begin.</p><button className="btn primary" onClick={()=>onOpen(modules.flatMap(m=>m.items).find(i=>!i.done)?.id||1)}>Continue learning →</button></div>
    {modules.map(m=><section key={m.id} className="roadmap-phase"><div className="section-head"><h2>{m.icon} {m.title}</h2><span>{m.items.filter(i=>i.done).length}/{m.items.length} complete</span></div><p>{m.desc}</p><div className="curriculum-grid">{m.items.map(item=>{const topic=topics.find(t=>t.id===item.id)!;return <div className="card card-pad topic-card" key={item.id}><div className="eyebrow">TOPIC {item.id} · {progress.quizzes.includes(item.id)?'KNOWLEDGE CHECK PASSED':'READY TO LEARN'}</div><h3>{topic.title}</h3><p>{topic.objective}</p><small>{topic.environment}</small><div className="actions"><button className="btn primary" onClick={()=>onOpen(item.id)}>Learn this topic →</button><button className="btn" aria-pressed={item.done} onClick={()=>onToggle(item.id)}>{item.done?'✓ Complete':'Mark complete'}</button></div></div>})}</div></section>)}
  </>;
}
