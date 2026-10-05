import { useEffect, useState } from 'react';
import { studios, Studio, StudioLesson, StudioId, normalizeStudioDraft, lessonExtension } from '../lib/studios';
import { topics } from '../lib/curriculum';
import { safeStorageGet, safeStorageSet } from '../utils/security';
import { ExplainedExample } from './ExplainedExample';
import { PythonRunner } from './PythonRunner';
import { VideoReferences } from './VideoReferences';
import { getTopicVideos } from '../lib/learning-videos';

function download(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function StudioWorkspace({studio,lesson}:{studio:Studio;lesson:StudioLesson}) {
  const [code,setCode]=useState(lesson.example.code);
  const [notes,setNotes]=useState('');
  const [studied,setStudied]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const storageKey=`sql-academy-studio-v1-${studio.id}-${lesson.id}`;
  useEffect(()=>{const saved=normalizeStudioDraft(safeStorageGet<unknown>(storageKey,{}),lesson.example.code);setCode(saved.code);setNotes(saved.notes);setStudied(saved.studied);setLoaded(true);},[storageKey,lesson.example.code]);
  useEffect(()=>{if(loaded)safeStorageSet(storageKey,{code,notes,studied});},[loaded,storageKey,code,notes,studied]);
  return <section className="card card-pad studio-workspace"><div className="eyebrow">YOUR PRACTICE WORKSPACE</div><label htmlFor="studio-code">{lesson.runnable?'Edit and run Python':'Edit your practice example'}</label><textarea id="studio-code" className="studio-editor" spellCheck={false} value={code} maxLength={50000} onChange={e=>setCode(e.target.value)}/><div className="actions"><button className="btn" onClick={()=>download(`${lesson.id}.${lessonExtension(lesson)}`,code)}>Download code</button><button className="btn" onClick={()=>{if(code===lesson.example.code||window.confirm('Replace your edited code with the original example?'))setCode(lesson.example.code);}}>Reset example</button></div>{lesson.runnable?<PythonRunner key={lesson.id} code={code}/>:<p className="tip-box">Run this in the stated external environment. The expected result above is a teaching prediction; this workspace does not execute or validate it.</p>}<h3>Practice task</h3><p>{lesson.task}</p><label htmlFor="studio-notes">Your prediction, result, and reasoning</label><textarea id="studio-notes" value={notes} maxLength={12000} onChange={e=>setNotes(e.target.value)} placeholder="Predict the result, make a change, and explain what happened."/><div className="actions"><button className="btn" aria-pressed={studied} onClick={()=>setStudied(!studied)}>{studied?'✓ Studied · self-reported':'Mark lesson studied'}</button><button className="btn" onClick={()=>download(`${lesson.id}-practice.json`,JSON.stringify({version:1,studio:studio.id,lesson:lesson.id,code,notes,studied},null,2))}>Export this practice</button></div><small className="progress-disclosure">Drafts, notes, and study marks save in this browser. Studio records are separate from roadmap completion; export this practice to keep a portable copy.</small></section>;
}

export function LanguageStudios({onTopic,onSQL,initialStudioId='python',initialLessonId}:{onTopic:(id:number)=>void;onSQL:()=>void;initialStudioId?:StudioId;initialLessonId?:string}) {
  const [studioId,setStudioId]=useState(initialStudioId);
  const [lessonId,setLessonId]=useState(initialLessonId||studios.find(s=>s.id===initialStudioId)!.lessons[0].id);
  const [search,setSearch]=useState('');
  const studio=studios.find(s=>s.id===studioId)!;
  const lesson=studio.lessons.find(l=>l.id===lessonId)||studio.lessons[0];
  const index=studio.lessons.indexOf(lesson);
  const topic=topics.find(t=>t.id===lesson.topicId)!;
  const filtered=studio.lessons.filter(l=>(l.title+' '+l.explanation).toLowerCase().includes(search.toLowerCase()));
  return <><div className="section-head"><div><h2>Code Studios</h2><span>Read → predict → change → explain</span></div><button className="btn" onClick={onSQL}>SQL Studio →</button></div><div className="studio-switcher" aria-label="Choose a studio">{studios.map(s=><button className={s.id===studioId?'btn selected':'btn'} aria-pressed={s.id===studioId} key={s.id} onClick={()=>{setStudioId(s.id);setLessonId(s.lessons[0].id);setSearch('');}}>{s.title}<small>{s.lessons.length} lessons</small></button>)}</div><div className="learning-shell"><aside className="card curriculum-nav"><label htmlFor="studio-search">Find a lesson in {studio.title}</label><input id="studio-search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search lessons…"/>{filtered.map(l=><button key={l.id} className={l.id===lesson.id?'selected':''} aria-current={l.id===lesson.id?'page':undefined} onClick={()=>setLessonId(l.id)}><span>{String(studio.lessons.indexOf(l)+1).padStart(2,'0')}</span>{l.title}</button>)}{!filtered.length&&<p>No lessons match. Try another term.</p>}</aside><article className="classroom"><section className="card card-pad"><div className="eyebrow">{studio.title} · LESSON {index+1} OF {studio.lessons.length}</div><h1>{lesson.title}</h1><p>{studio.description}</p><div className="environment-label">{studio.environment}</div><p>{lesson.explanation}</p><ExplainedExample example={lesson.example}/><button className="btn" onClick={()=>onTopic(lesson.topicId)}>Related roadmap topic →</button></section><StudioWorkspace key={`${studio.id}-${lesson.id}`} studio={studio} lesson={lesson}/><VideoReferences videos={getTopicVideos(lesson.topicId)}/><section className="card card-pad"><h2>Official references</h2><ul>{topic.sources.map(([label,url])=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>)}</ul></section><div className="lesson-nav"><button className="btn" disabled={index===0} onClick={()=>setLessonId(studio.lessons[index-1].id)}>← Previous lesson</button><span>{index+1} / {studio.lessons.length}</span><button className="btn primary" disabled={index===studio.lessons.length-1} onClick={()=>setLessonId(studio.lessons[index+1].id)}>Next lesson →</button></div></article></div></>;
}
