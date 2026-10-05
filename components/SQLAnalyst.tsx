"use client";

import { useEffect, useMemo, useState } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

import { View, Row, Exercise } from "../types";
import { lessons, datasets, exercises, projects, interviews, cases, schemas } from "../lib/data";
import { isQuerySafe, safeStorageGet, safeStorageSet } from "../utils/security";
import { CaseCard } from "./CaseCard";
import { Graduation } from "./Graduation";
import { ConceptsHub } from "./ConceptsHub";
import { Checklist } from "./Checklist";
import { LearningBackup } from "./LearningBackup";
import { LearningZone } from "./LearningZone";
import { emptyProgress, normalizeProgress, topics, LearningProgress } from "../lib/curriculum";
import { PLAN_MODULES, loadPlan, savePlan } from "../lib/plan";
import { VideoReferences } from "./VideoReferences";
import { getSqlLessonVideos } from "../lib/learning-videos";
import { sqlActivities, sqlExamples } from "../lib/sql-learning";
import { sqlWalkthroughs } from "../lib/sql-walkthroughs";
import { ExampleBreakdown } from "./ExplainedExample";
import { LanguageStudios } from "./LanguageStudios";

export default function SQLAnalyst(){
  const [view,setView]=useState<View>('home');
  const [topicId,setTopicId]=useState(1);
  const [learning,setLearning]=useState<LearningProgress>(emptyProgress);
  const [plan,setPlan]=useState(PLAN_MODULES);
  function openTopic(id:number){setTopicId(id);setView('learn');}
  function toggleTopic(id:number){setPlan(current=>current.map(m=>({...m,items:m.items.map(i=>i.id===id?{...i,done:!i.done}:i)})));}
  function markLesson(){setLearning(current=>({...current,lessons:current.lessons.includes(lesson.id)?current.lessons.filter(id=>id!==lesson.id):[...current.lessons,lesson.id]}));}

  const [activeProject,setActiveProject]=useState(projects[0]);
  const [projectTask,setProjectTask]=useState(0);
  const [projectDone,setProjectDone]=useState<string[]>([]);
  const [insight,setInsight]=useState('');
  const [datasetId,setDatasetId]=useState('commerce');
  const dataset=useMemo(()=>datasets.find(d=>d.id===datasetId)!,[datasetId]);
  const [selectedTable,setSelectedTable]=useState('customers');
  const [lesson,setLesson]=useState(lessons[0]);
  const [exercise,setExercise]=useState(exercises[0]);
  const [exampleTitle,setExampleTitle]=useState('');
  const [sql,setSql]=useState("");
  const [rows,setRows]=useState<Row[]>([]); const [columns,setColumns]=useState<string[]>([]); const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [execMs,setExecMs]=useState(0); const [hint,setHint]=useState(false); const [hintLevel,setHintLevel]=useState(0);
  const [db,setDb]=useState<duckdb.AsyncDuckDB|null>(null); const [ready,setReady]=useState(false); const [interviewIndex,setInterviewIndex]=useState(0); const [showAnswer,setShowAnswer]=useState(false); const [interviewScore,setInterviewScore]=useState(0); const [interviewCompleted,setInterviewCompleted]=useState<number[]>([]); const [caseId,setCaseId]=useState('pharmacy');
  const [completed,setCompleted]=useState<number[]>([]);
  const [xp,setXp]=useState(120);
  const [queryHistory,setQueryHistory]=useState<{sql:string;dataset:string;rows:number;at:string}[]>([]);
  const [conceptId,setConceptId]=useState('execution');
  const [streak,setStreak]=useState(0);
  const [feedbackMsg,setFeedbackMsg]=useState('');
  const [querySucceeded,setQuerySucceeded]=useState(false);

  const [storageLoaded,setStorageLoaded]=useState(false);
  useEffect(() => {
    setLearning(normalizeProgress(safeStorageGet('sql-academy-learning-v1', {})));
    setPlan(loadPlan());
    setProjectDone(safeStorageGet<string[]>('sql-academy-projects', []).filter(id => projects.some(p => p.id === id)));
    const answered = safeStorageGet<number[]>('sql-academy-interviews', []).filter(id => Number.isInteger(id) && id >= 0 && id < interviews.length);
    setInterviewCompleted(answered);
    setInterviewScore(answered.length);
    setCompleted(safeStorageGet<number[]>('sql-academy-completed', []).filter(id => exercises.some(e => e.id === id)));
    setXp(safeStorageGet('sql-academy-xp', 120));
    setQueryHistory(safeStorageGet<typeof queryHistory>('sql-academy-history', []).filter(h => h && typeof h.sql === 'string' && typeof h.dataset === 'string' && typeof h.rows === 'number' && typeof h.at === 'string'));
    setStreak(safeStorageGet('sql-academy-streak', 0));
    setStorageLoaded(true);
  }, []);
  useEffect(() => {
    if (!storageLoaded) return;
    safeStorageSet('sql-academy-learning-v1',learning);
    savePlan(plan);
    safeStorageSet('sql-academy-projects',projectDone);
    safeStorageSet('sql-academy-interviews',interviewCompleted);
    safeStorageSet('sql-academy-completed',completed);
    safeStorageSet('sql-academy-xp',xp);
    safeStorageSet('sql-academy-history',queryHistory);
    safeStorageSet('sql-academy-streak',streak);
  }, [storageLoaded,projectDone,interviewCompleted,completed,xp,queryHistory,streak,learning,plan]);
  useEffect(() => {
    let alive = true;
    let initialized = false;
    let database: duckdb.AsyncDuckDB | null = null;
    setDb(null);
    setReady(false);
    setError('');
    (async () => {
      let workerUrl: string | undefined;
      let conn: duckdb.AsyncDuckDBConnection | undefined;
      try {
        const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
        if (!alive) return;
        workerUrl = URL.createObjectURL(new Blob([`importScripts(${JSON.stringify(bundle.mainWorker)});`], {type: 'text/javascript'}));
        const worker = new Worker(workerUrl);
        database = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
        await database.instantiate(bundle.mainModule, bundle.pthreadWorker);
        conn = await database.connect();
        await conn.query(dataset.seed);
        if (alive) { setDb(database); setReady(true); }
      } catch (e) {
        if (alive) setError('The browser SQL engine could not start: ' + String(e instanceof Error ? e.message : e));
        alive = false;
      } finally {
        if (conn) await conn.close();
        if (workerUrl) URL.revokeObjectURL(workerUrl);
        initialized = true;
        if (!alive && database) await database.terminate();
      }
    })();
    return () => {
      alive = false;
      if (initialized && database) void database.terminate();
    };
  }, [datasetId]);
  useEffect(()=>{const first=schemas[datasetId]?.[0]?.name||'';setSelectedTable(first)},[datasetId]);

  useEffect(() => {
    if (view === 'projects') chooseDataset(activeProject.dataset);
    if (view === 'interview') chooseDataset(interviews[interviewIndex].dataset);
  }, [view, activeProject.id, interviewIndex]);

  const groups=useMemo(()=>{const g:Record<string,typeof lessons[0][]>={};lessons.forEach(l=>(g[l.level]??=[]).push(l));return g},[]);
  const datasetExercises=exercises.filter(e=>e.dataset===datasetId);
  const progress=Math.round(((learning.quizzes.length+learning.labs.length)/(topics.length*2))*100);
  const activeCase=cases.find(c=>c.id===caseId)!;


  function chooseDataset(id:string){setExampleTitle('');setDatasetId(id);const first=exercises.find(e=>e.dataset===id)||exercises[0];setExercise(first);setSql("");setRows([]);setColumns([]);setQuerySucceeded(false);setError('');setMessage('');setHint(false);setHintLevel(0);setFeedbackMsg('');}
  function chooseExercise(e:Exercise){setExampleTitle('');setExercise(e);if(datasetId!==e.dataset)setDatasetId(e.dataset);setSql("");setRows([]);setColumns([]);setQuerySucceeded(false);setError('');setMessage('');setHint(false);setHintLevel(0)}
  
  async function runQuery() {
    setError('');setMessage('');setRows([]);setColumns([]);setQuerySucceeded(false);
    
    const checkTarget = isQuerySafe(sql);
    if (!checkTarget.safe) {
      setError(checkTarget.reason || 'Query execution blocked for security reasons.');
      return;
    }
    
    if(!db || !ready){setError('SQL engine is still starting.');return}
    let conn: duckdb.AsyncDuckDBConnection | undefined;
    try{
      conn=await db.connect();
      const start=performance.now();
      const result=await conn.query(sql);
      const ms=Math.round(performance.now()-start);
      setExecMs(ms);
      const data=result.toArray().map((r:any)=>Object.fromEntries(Object.keys(r).map(k=>[k,typeof r[k]==='bigint'?Number(r[k]):r[k]])));
      setRows(data);
      setQuerySucceeded(true);
      setColumns(data.length?Object.keys(data[0]):[]);
      setMessage(`Query ran successfully · ${data.length} row${data.length===1?'':'s'} · ${ms}ms`);
      setFeedbackMsg('');
      setQueryHistory(h=>[{sql,dataset:dataset.name,rows:data.length,at:new Date().toLocaleString()},...h].slice(0,30));
      const today=new Date().toDateString();
      const last=safeStorageGet<string|null>('sql-academy-last-day', null);
      if(last!==today){
        const wasYesterday=last===new Date(Date.now()-86400000).toDateString();
        setStreak(n=>wasYesterday?n+1:1);
        safeStorageSet('sql-academy-last-day',today);
      }
    }catch(e:any){
      setError(String(e?.message||e).replace(/^Error:\s*/,''))
    } finally {
      if (conn) await conn.close();
    }
  }
  
  function checkAnswer(){if(exercise.check(rows)){if(!completed.includes(exercise.id)){setCompleted([...completed,exercise.id]);setXp(xp+50)}setMessage('Challenge complete! +50 XP')}else setError('The query ran, but the result does not match the expected shape yet. Check the prompt and try again.')}
  function openCase(c:typeof cases[number]){setCaseId(c.id);chooseDataset(c.dataset);setView('cases')}
  function nextLesson(){const i=lessons.findIndex(l=>l.id===lesson.id);if(i<lessons.length-1)setLesson(lessons[i+1])}
  function previousLesson(){const i=lessons.findIndex(l=>l.id===lesson.id);if(i>0)setLesson(lessons[i-1])}
  function loadHistory(item:{sql:string;dataset:string;rows:number;at:string}){setExampleTitle('Query history');setQuerySucceeded(false);const d=datasets.find(x=>x.name===item.dataset);if(d)setDatasetId(d.id);setSql(item.sql);setView('practice');}

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">&gt;_</div><div><div className="brand-title">Data Academy</div><div className="brand-sub">Learn. Practice. Build.</div></div></div>
      <nav className="nav">{[['home','⌂','Dashboard'],['learn','▣','Learning Zone'],['sql-lessons','⌗','SQL Studio'],['studios','⌨','Code Studios'],['practice','⌘','SQL Practice'],['schema','▤','Data Explorer'],['concepts','◇','SQL Concepts'],['interview','◉','Interview Mode'],['cases','◈','Case Studies'],['projects','🏆','Analyst Projects'],['mastery','📈','Mastery'],['history','↺','Query History'],['graduation','🎓','Graduation'],['plan','📋','Course Plan']].map(([id,icon,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id as View)}>{icon} <span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="streak"><b>🔥 {streak} day SQL streak</b><small>Run a query today to keep it alive.</small></div></div>
    </aside>
    <main className="main"><header className="topbar"><div className="breadcrumb">SQL Analyst <span>/</span> {view==='home'?'Dashboard':view==='learn'?'Learning Zone':view==='sql-lessons'?'SQL Studio':view==='studios'?'Code Studios':view==='practice'?'SQL Practice':view==='schema'?'Data Explorer':view==='interview'?'Interview Mode':view==='concepts'?'SQL Concepts':view==='history'?'Query History':view==='projects'?'Analyst Projects':view==='mastery'?'Mastery':view==='graduation'?'Graduation':view==='plan'?'Career Plan':'Case Studies'}</div><div className="profile"><div className="xp-pill">{xp} XP</div><div className="avatar">KS</div></div></header>
      <div className="content">
        {view==='home'&&<><section className="hero"><div><div className="eyebrow">DATA ENGINEERING ACADEMY</div><h1>From first query<br/>to reliable data pipelines.</h1><p>Study every topic in your roadmap, practice SQL in the browser, build local projects, and prepare for data engineering interviews with evidence you can explain.</p></div><div className="hero-card"><div className="eyebrow">Learning checks + self-reported tasks</div><div className="big">{progress}%</div><div className="progress"><span style={{width:`${progress}%`}}/></div><small style={{color:'var(--muted)',display:'block',marginTop:9}}>{topics.length} roadmap topics · {lessons.length} SQL lessons · {exercises.length} challenges</small></div></section>
          <div className="stats"><button className="stat stat-button" onClick={()=>setView('learn')}><div className="stat-label">Roadmap topics</div><div className="stat-value">{topics.length}</div><div className="stat-note">Open Learning Zone →</div></button><button className="stat stat-button" onClick={()=>{const next=exercises.find(e=>!completed.includes(e.id))||exercises[0];chooseExercise(next);setView('practice')}}><div className="stat-label">Challenges</div><div className="stat-value">{completed.length}/{exercises.length}</div><div className="stat-note">Open SQL practice →</div></button><button className="stat stat-button" onClick={()=>setView('schema')}><div className="stat-label">Datasets</div><div className="stat-value">{datasets.length}</div><div className="stat-note">Explore schemas →</div></button><button className="stat stat-button" onClick={()=>setView('history')}><div className="stat-label">Streak</div><div className="stat-value">{streak}d</div><div className="stat-note">View query history →</div></button><button className="stat stat-button" onClick={()=>setView('concepts')}><div className="stat-label">SQL engine</div><div className="stat-value" style={{fontSize:18,color:ready?'var(--green)':'var(--orange)'}}>{ready?'READY':'STARTING'}</div><div className="stat-note">Learn how SQL works →</div></button></div>
          <div className="card card-pad roadmap-intro"><div className="eyebrow">YOUR COMPLETE ROADMAP</div><h2>24 topics. One connected Learning Zone.</h2><p>Foundations → cloud & warehouse → pipeline engineering → portfolio builds → interviews. {learning.quizzes.length}/24 knowledge checks passed · {learning.labs.length}/24 tasks self-reported.</p><div className="actions"><button className="btn primary" onClick={()=>openTopic(topics.find(t=>!learning.quizzes.includes(t.id)||!learning.labs.includes(t.id))?.id||1)}>Continue your roadmap →</button><button className="btn" onClick={()=>setView('plan')}>View all checklist topics →</button></div></div><div className="section-head"><h2>SQL learning tracks</h2><span>Build skills in sequence</span></div><div className="track-grid">{Object.keys(groups).map(name=>{const items=groups[name]; return<button className="track-card" key={name} onClick={()=>{setLesson(items[0]);setView('sql-lessons')}}><div className="track-top"><span>{name}</span><b>{items.length}</b></div><h3>{items[0].title}</h3><p>{items[0].text}</p><span className="link-btn">Open track →</span></button>})}</div>
          <div className="section-head"><h2>Choose a real dataset</h2><span>Practice with different analyst domains</span></div><div className="dataset-grid">{datasets.map(d=><button className="dataset-card" key={d.id} onClick={()=>{chooseDataset(d.id);setView('practice')}}><span className="dataset-icon">{d.icon}</span><div><b>{d.name}</b><p>{d.description}</p></div><span>→</span></button>)}</div>
          <div className="section-head"><h2>Case studies</h2><span>SQL + business reasoning</span></div><div className="case-grid">{cases.map(c=><CaseCard key={c.id} c={c} onClick={()=>openCase(c)}/>)}</div><div className="section-head"><h2>Your next move</h2><span>Everything on the dashboard is a launch button</span></div><div className="launch-grid"><button className="launch-card" onClick={()=>{openTopic(topics.find(t=>!learning.quizzes.includes(t.id)||!learning.labs.includes(t.id))?.id||1)}}><span className="launch-icon">📚</span><div><b>Continue lessons</b><p>Open the next lesson in your learning path.</p></div><span>→</span></button><button className="launch-card" onClick={()=>{const next=exercises.find(e=>!completed.includes(e.id))||exercises[0];chooseExercise(next);setView('practice')}}><span className="launch-icon">⌘</span><div><b>Next SQL challenge</b><p>Start an unsolved challenge with a blank editor.</p></div><span>→</span></button><button className="launch-card" onClick={()=>{setConceptId('execution');setView('concepts')}}><span className="launch-icon">🧠</span><div><b>Learn a concept</b><p>Visual explanations, examples, mistakes and mini checks.</p></div><span>→</span></button><button className="launch-card" onClick={()=>{setActiveProject(projects[0]);setProjectTask(0);setView('projects')}}><span className="launch-icon">🏆</span><div><b>Work a project</b><p>Practice the full analyst workflow on a business problem.</p></div><span>→</span></button></div>
        </>}

        {(view==='learn'||view==='plan')&&<LearningBackup progress={learning} plan={plan} onRestore={(p,m)=>{setLearning(p);setPlan(m)}}/>}
        {view==='studios'&&<LanguageStudios onTopic={openTopic} onSQL={()=>setView('sql-lessons')}/>}
        {view==='learn'&&<LearningZone topicId={topicId} onSelect={setTopicId} progress={learning} onProgress={setLearning} onSQL={()=>setView('sql-lessons')} onInterview={()=>setView('interview')}/>}
        {view==='sql-lessons'&&<><div className="section-head"><h2>SQL Studio</h2><span>{lessons.length} SQL lessons · study progress is self-reported</span></div><div className="lesson-layout"><div className="card lesson-list">{Object.keys(groups).map(level=>{const items=groups[level]; return<div key={level}><div className="group-label">{level}</div>{items.map(l=><button key={l.id} className={lesson.id===l.id?'selected':''} onClick={()=>setLesson(l)}><span className="lesson-num">{String(l.id).padStart(2,'0')}</span>{l.title}</button>)}</div>})}</div><article className="lesson-body"><div className="eyebrow">{lesson.level} · LESSON {lesson.id}</div><h1>{lesson.title}</h1><p>{lesson.text}</p><VideoReferences videos={getSqlLessonVideos(lesson.key)}/><h2>Example</h2><div className="sql-box"><div className="sql-head"><span>SQL</span><span>{sqlExamples[lesson.key]?'Runnable · commerce dataset':'Illustrative SQL · requires adapted tables'}</span></div><div className="sql-code">{sqlExamples[lesson.key]||lesson.sql}</div></div><ExampleBreakdown {...sqlWalkthroughs[lesson.key]}/><h2>Analyst takeaway</h2><p>{lesson.takeaway}</p><div className="tip-box">💡 {lesson.tip}</div><div className="actions"><button className="btn" aria-pressed={learning.lessons.includes(lesson.id)} onClick={markLesson}>{learning.lessons.includes(lesson.id)?'✓ Studied · self-reported':'Mark lesson studied'}</button>{sqlActivities[lesson.key] ? <button className="btn primary" onClick={()=>{chooseExercise(exercises.find(e=>e.id===sqlActivities[lesson.key])!);setView('practice')}}>Related challenge →</button> : <button className="btn primary" onClick={()=>{chooseDataset('commerce');setSql(sqlExamples[lesson.key]||lesson.sql);setExampleTitle(lesson.title);setView('practice')}}>Try example in SQL Practice →</button>}<button className="btn" onClick={()=>openTopic(3)}>SQL topic guide →</button></div><div className="lesson-nav"><button className="btn" onClick={previousLesson} disabled={lesson.id===lessons[0].id}>← Previous</button><span>Lesson {lesson.id} of {lessons.length}</span><button className="btn" onClick={nextLesson} disabled={lesson.id===lessons[lessons.length-1].id}>Next →</button></div></article></div></>}

        {view==='practice'&&<><div className="section-head"><h2>SQL Practice Lab</h2><span>{ready?'Database connected':'Starting browser database…'}</span></div><div className="dataset-switcher">{datasets.map(d=><button className={datasetId===d.id?'selected':''} key={d.id} onClick={()=>chooseDataset(d.id)}>{d.icon} {d.name}</button>)}</div><div className="practice"><div className="card"><div className="panel-head"><b>Challenges</b><span>{datasetExercises.length} in this dataset</span></div>{datasetExercises.map(e=><button key={e.id} onClick={()=>chooseExercise(e)} className={`module challenge-row ${exercise.id===e.id?'selected':''}`}><div className="module-icon">{completed.includes(e.id)?'✓':String(e.id).padStart(2,'0')}</div><div><h3>{e.title}</h3><p>{e.difficulty} · {e.topic}</p></div><div className={`badge ${completed.includes(e.id)?'done':''}`}>{completed.includes(e.id)?'Solved':'Try'}</div></button>)}</div><div><div className="editor-panel"><div className="panel-head"><b>{exampleTitle?`Example: ${exampleTitle}`:exercise.title}</b><span>{exampleTitle?'Unassessed sandbox':exercise.difficulty} · {dataset.name}</span></div><div className="prompt">{exampleTitle?'Run and modify this lesson example. Predict the result, inspect the output, and explain its grain. Select a challenge on the left to return to assessed practice.':exercise.prompt}</div><textarea className="editor" value={sql} onChange={e=>{setSql(e.target.value);setQuerySucceeded(false)}} spellCheck={false}/>{feedbackMsg&&<div className="hint" style={{marginBottom:8,color:'var(--orange)'}}>{feedbackMsg}</div>}{(hint || hintLevel>0) && <div className="hint"><b>Hint {hintLevel+1}/3</b> 💡 {exercise.hints[hintLevel]}</div>}<div className="actions"><button className="btn primary" disabled={!ready} onClick={runQuery}>▶ Run query</button><button className="btn secondary" disabled={!!exampleTitle} onClick={()=>{setHintLevel(hint ? Math.min(hintLevel + 1, 2) : 0); setHint(true);}}>💡 Hint ({hintLevel+1}/3)</button><button className="btn" disabled={!!exampleTitle||!querySucceeded} onClick={checkAnswer}>✓ Check answer</button></div></div><div className="result-panel" style={{marginTop:15}}><div className="panel-head"><b>Query result</b><span>{ready?'Live':'Offline'}</span></div>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<div className="result">{!rows.length?<div className="empty">Run your query to see results here.<br/>The database runs locally in your browser.</div>:<table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={c}>{String(r[c]??'NULL')}</td>)}</tr>)}</tbody></table>}</div></div></div></div></>}

        {view==='projects'&&<><div className="section-head"><h2>Analyst Projects</h2><span>Multi-step business problems · {projects.length} capstones</span></div><div className="project-grid">{projects.map(p=><button className={'project-card '+(activeProject.id===p.id?'selected':'')} key={p.id} onClick={()=>{setActiveProject(p);setProjectTask(0);setInsight('')}}><div className="project-icon">{p.icon}</div><div><div className="project-meta"><span>{p.difficulty}</span>{projectDone.includes(p.id)&&<b>COMPLETED</b>}</div><h3>{p.title}</h3><p>{p.business}</p></div><span className="project-arrow">→</span></button>)}</div><div className="project-workspace card"><div className="project-header"><div><div className="eyebrow">CAPSTONE · {activeProject.difficulty.toUpperCase()}</div><h1>{activeProject.icon} {activeProject.title}</h1><p>{activeProject.business}</p><div className="stakeholder">Stakeholder: <b>{activeProject.stakeholder}</b> · Outcome: {activeProject.outcome}</div></div><button className="btn" onClick={()=>{chooseDataset(activeProject.dataset);setView('schema')}}>Inspect schema →</button></div><div className="project-progress"><div><b>Task {projectTask+1} of {activeProject.tasks.length}</b><span>{Math.round(((projectTask+(projectDone.includes(activeProject.id)?activeProject.tasks.length:0))/activeProject.tasks.length)*100)}%</span></div><div className="progress"><span style={{width:`${Math.min(100,((projectTask+1)/activeProject.tasks.length)*100)}%`}}/></div></div><div className="project-task"><div className="task-list">{activeProject.tasks.map((t,i)=><button key={t.id} className={i===projectTask?'active':''} onClick={()=>setProjectTask(i)}><span>{i<projectTask?'✓':String(i+1).padStart(2,'0')}</span><div><b>{t.title}</b><small>{t.prompt}</small></div></button>)}</div><div className="task-main"><div className="eyebrow">TASK {projectTask+1}</div><h2>{activeProject.tasks[projectTask].title}</h2><p>{activeProject.tasks[projectTask].prompt}</p><textarea className="editor" value={sql} onChange={e=>{setSql(e.target.value);setQuerySucceeded(false)}} spellCheck={false}/><div className="actions"><button className="btn primary" disabled={!ready} onClick={runQuery}>▶ Run query</button><button className="btn" onClick={()=>setSql(activeProject.tasks[projectTask].starter)}>Load starter</button><button className="btn secondary" onClick={()=>{if(activeProject.tasks[projectTask].check(rows)){if(projectTask<activeProject.tasks.length-1)setProjectTask(projectTask+1);else if(!projectDone.includes(activeProject.id))setProjectDone([...projectDone,activeProject.id]);setMessage('Task validated — nice work.')}}}>✓ Validate task</button></div>{message&&<div className="success">{message}</div>}</div></div><div className="insight-box"><div><div className="eyebrow">FINAL BUSINESS INSIGHT</div><h3>What should the stakeholder do next?</h3><p>Write 2–4 sentences: state the finding, quantify it, name the likely driver, and recommend the next action.</p></div><textarea value={insight} onChange={e=>setInsight(e.target.value)} placeholder="Example: Spend is concentrated in..."/><button className="btn primary" disabled={insight.trim().length<30} onClick={()=>{if(!projectDone.includes(activeProject.id))setProjectDone([...projectDone,activeProject.id]);setXp(xp+150);setMessage('Capstone submitted. +150 XP');}}>Submit capstone · +150 XP</button></div></div></>}

        {view==='mastery'&&<><div className="section-head"><h2>Mastery Dashboard</h2><span>Know what you can do — not just what you have read</span></div><div className="mastery-hero card"><div><div className="eyebrow">SQL ANALYST READINESS</div><h1>{Math.round((completed.length/exercises.length)*70 + (projectDone.length/projects.length)*30)}%</h1><p>Based on SQL challenge checks and submitted analyst projects. This is practice progress, not an external qualification.</p></div><div className="readiness-ring"><span>{completed.length}</span><small>challenges</small></div></div><div className="mastery-grid"><div className="card card-pad"><div className="panel-head"><b>SQL study progress</b><span>Self-reported lessons</span></div>{['FOUNDATIONS','AGGREGATION','JOINS','INTERMEDIATE','WINDOWS','ANALYST SQL'].map((g,i)=>{const group=lessons.filter(l=>l.level===g);const pct=group.length?Math.round(group.filter(l=>learning.lessons.includes(l.id)).length/group.length*100):0;return <div className="skill-row" key={g}><div><b>{g}</b><small>{group.length} lessons</small></div><div className="mini-progress"><span style={{width:`${pct}%`}}/></div><strong>{pct}%</strong></div>})}</div><div className="card card-pad"><div className="panel-head"><b>Project readiness</b><span>{projectDone.length}/{projects.length}</span></div>{projects.map(p=><div className="readiness-row" key={p.id}><span>{p.icon}</span><div><b>{p.title}</b><small>{p.difficulty}</small></div><strong>{projectDone.includes(p.id)?'✓':'○'}</strong></div>)}</div></div><div className="card card-pad mastery-next"><div><div className="eyebrow">RECOMMENDED NEXT</div><h2>{completed.length<3?'Master the foundations':projectDone.length<2?'Start another analyst capstone':interviewCompleted.length<3?'Complete the interview assessment':'Review your graduation profile'}</h2><p>{completed.length<3?'Complete beginner challenges before moving into complex joins and windows.':projectDone.length<2?'Apply your SQL skills to a stakeholder problem with multiple steps.':interviewCompleted.length<3?'Practice explaining your reasoning under pressure and validate your queries.':'Open Graduation to review the remaining SQL-track requirements.'}</p></div><button className="btn primary" onClick={()=>setView(completed.length<3?'practice':projectDone.length<2?'projects':interviewCompleted.length<3?'interview':'graduation')}>Continue →</button></div></>}

        {view==='graduation'&&<Graduation lessons={lessons.length} lessonsDone={learning.lessons.length} completed={completed.length} exercises={exercises.length} projects={projects.length} projectDone={projectDone.length} interviewDone={interviewCompleted.length} xp={xp} streak={streak} onPrint={()=>window.print()} onContinue={()=>setView(completed.length<exercises.length?'practice':projectDone.length<projects.length?'projects':'interview')}/>}

        {view==='concepts'&&<ConceptsHub conceptId={conceptId} setConceptId={setConceptId} onPractice={()=>{const e=exercises.find(x=>x.topic==='JOIN')||exercises[0];chooseExercise(e);setView('practice')}}/>}
        {view==='plan'&&<Checklist modules={plan} progress={learning} onOpen={openTopic} onToggle={toggleTopic}/>}

        {(view==='projects'||view==='interview')&&(<div className="result-panel" style={{marginTop:15}}><div className="panel-head"><b>Query result</b><span>{ready?'Live':'Offline'}</span></div>{error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}<div className="result">{!rows.length?<div className="empty">Run your query to see results here.<br/>The database runs locally in your browser.</div>:<table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={c}>{String(r[c]??'NULL')}</td>)}</tr>)}</tbody></table>}</div></div>)}

        {view==='history'&&<><div className="section-head"><h2>Query History</h2><span>Your last {queryHistory.length} executed queries</span></div><div className="history-card card"><div className="panel-head"><b>Recent queries</b><button className="btn" onClick={()=>setQueryHistory([])}>Clear history</button></div>{queryHistory.length===0?<div className="empty history-empty">No queries yet. Run SQL in the Practice Lab and they will appear here.</div>:<div className="history-list">{queryHistory.map((h,i)=><div className="history-row" key={i}><div><div className="history-meta"><span>{h.dataset}</span><span>{h.rows} rows</span><span>{h.at}</span></div><pre>{h.sql}</pre></div><button className="btn secondary" onClick={()=>loadHistory(h)}>Load</button></div>)}</div>}</div></>}

        {view==='schema'&&<><div className="section-head"><h2>Data Explorer</h2><span>Inspect the schema before you query</span></div><div className="dataset-switcher">{datasets.map(d=><button className={datasetId===d.id?'selected':''} key={d.id} onClick={()=>chooseDataset(d.id)}>{d.icon} {d.name}</button>)}</div><div className="schema-layout"><div className="card schema-tables"><div className="panel-head"><b>Tables</b><span>{schemas[datasetId].length}</span></div>{schemas[datasetId].map(t=><button key={t.name} className={selectedTable===t.name?'selected':''} onClick={()=>setSelectedTable(t.name)}><span>▤</span><b>{t.name}</b><small>{t.description}</small></button>)}</div><div className="card card-pad">{(()=>{const t=schemas[datasetId].find(x=>x.name===selectedTable)!;return <><div className="eyebrow">TABLE</div><h1 style={{fontSize:30,margin:'7px 0'}}>{t.name}</h1><p style={{color:'var(--muted)',fontSize:13}}>{t.description}</p><div className="schema-columns">{t.columns.map((c,i)=>{const [name,type]=c.split(' ');return <div className="schema-column" key={c}><span className="column-icon">{i===0?'🔑':'•'}</span><b>{name}</b><code>{type}</code>{i===0&&<small>Likely key / identifier</small>}</div>})}</div><div className="sql-box"><div className="sql-head"><span>RELATIONSHIPS</span><span>{dataset.name}</span></div><div className="sql-code">{dataset.id==='commerce'?'customers 1 ─── ∞ orders ∞ ─── 1 products':dataset.id==='healthcare'?'members 1 ─── ∞ claims ∞ ─── 1 providers':dataset.id==='contact'?'agents 1 ─── ∞ calls':'subscribers 1 ─── ∞ viewing'}</div></div><button className="btn primary" onClick={()=>{setSql(`SELECT *\nFROM ${selectedTable}\nLIMIT 10;`);setExercise(datasetExercises[0]||exercises[0]);setView('practice')}}>Query this table →</button></>})()}</div></div></>}

        {view==='interview'&&<><div className="section-head"><h2>SQL Interview Mode</h2><span>{interviews[interviewIndex].difficulty} · score {interviewScore}/{interviews.length}</span></div><div className="interview-layout"><div className="card card-pad"><div className="eyebrow">QUESTION {interviewIndex+1} / {interviews.length}</div><h1 style={{fontSize:32,margin:'8px 0 10px'}}>{interviews[interviewIndex].title}</h1><div className="interview-meta"><span>{interviews[interviewIndex].difficulty}</span><span>{interviews[interviewIndex].concept}</span><span>{interviews[interviewIndex].dataset}</span></div><p style={{color:'#b4bfce',lineHeight:1.7,fontSize:14}}>{interviews[interviewIndex].prompt}</p><div className="interview-tip">💡 Identify the grain → tables → join keys → filters → metric → expected output before coding.</div>{!showAnswer?<button className="btn secondary" onClick={()=>setShowAnswer(true)}>Reveal reference approach</button>:<div className="reference-answer"><b>Reference answer</b><pre>{interviews[interviewIndex].answer}</pre><small>Core concept: {interviews[interviewIndex].concept}</small></div>}<div style={{display:'flex',gap:8,marginTop:20}}><button className="btn" disabled={interviewIndex===0} onClick={()=>{setInterviewIndex(Math.max(0,interviewIndex-1));setShowAnswer(false)}}>← Previous</button><button className="btn primary" onClick={()=>{setInterviewIndex((interviewIndex+1)%interviews.length);setShowAnswer(false)}}>Next →</button></div></div><div className="editor-panel"><div className="panel-head"><b>Scratchpad</b><span>Live DuckDB dataset</span></div><textarea className="editor" value={sql} onChange={e=>{setSql(e.target.value);setQuerySucceeded(false)}} spellCheck={false}/><div className="actions"><button className="btn primary" disabled={!ready} onClick={runQuery}>▶ Run query</button><button className="btn secondary" onClick={()=>{if(querySucceeded && !interviewCompleted.includes(interviewIndex)){setInterviewCompleted([...interviewCompleted,interviewIndex]);setInterviewScore(interviewScore+1);setXp(xp+75);setMessage('Interview answer submitted. +75 XP')}}}>✓ Submit answer</button><button className="btn" onClick={()=>{chooseDataset(interviews[interviewIndex].dataset);setSql(interviews[interviewIndex].answer);setShowAnswer(true)}}>Load reference</button></div></div></div></>}

        {view==='cases'&&<><div className="section-head"><h2>Real-World Case Studies</h2><span>Context → SQL → evidence → recommendation</span></div><div className="case-detail"><div className="case-detail-top"><div><div className="eyebrow">CASE STUDY · {activeCase.difficulty.toUpperCase()}</div><h1>{activeCase.icon} {activeCase.title}</h1><p style={{color:'var(--muted)',maxWidth:760,lineHeight:1.7}}>{activeCase.desc}</p></div><button className="btn primary" onClick={()=>{chooseDataset(activeCase.dataset);setView('practice')}}>Open dataset →</button></div><div className="case-kpis">{activeCase.kpis.map(k=><div className="kpi" key={k}><span className="stat-label">Scope</span><strong>{k}</strong></div>)}</div><h2>Stakeholder questions</h2>{activeCase.questions.map((q,i)=><div className="question" key={q}><div className="q-num">{String(i+1).padStart(2,'0')}</div><div><b>{q}</b><p>Write the SQL, inspect the result, then explain what the result means for the stakeholder.</p></div></div>)}<div className="tip-box">Senior analyst habit: never stop at the number. State the metric definition, the population, the time period, the key finding and what you would investigate next.</div></div><div className="section-head"><h2>Case library</h2><span>{cases.length} environments</span></div><div className="case-grid">{cases.map(c=><CaseCard key={c.id} c={c} onClick={()=>openCase(c)}/>)}</div></>}
      </div>
    </main>
  </div>
}
