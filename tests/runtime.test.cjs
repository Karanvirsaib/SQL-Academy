const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relative, globals = {}) {
  const filename = path.join(__dirname, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx:ts.JsxEmit.ReactJSX}
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {exports, console: {error() {}}, ...globals}, {filename});
  return exports;
}

test('saved progress handles invalid values and preserves legacy numeric strings', () => {
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
  const {safeStorageGet, safeStorageSet} = load('utils/security.ts', {window: {}, localStorage: storage});
  const fallback = [];
  for (const value of ['null', 'false', '12', '"invalid"', '{}', '{broken']) {
    values.set('progress', value);
    assert.equal(safeStorageGet('progress', fallback), fallback);
  }
  safeStorageSet('progress', [1, 2]);
  assert.equal(JSON.stringify(safeStorageGet('progress', fallback)), '[1,2]');
  values.set('xp', '"170"');
  assert.equal(safeStorageGet('xp', 120), 170);
  for (const value of ['null', 'false', '-1', '"NaN"', '""', '1e999']) {
    values.set('xp', value);
    assert.equal(safeStorageGet('xp', 120), 120);
  }
  assert.equal(load('utils/security.ts').safeStorageGet('xp', 120), 120);
});

test('every challenge has usable hint SQL matching its reference solution', () => {
  const {exercises} = load('lib/data.ts');
  assert.equal(exercises.length, 10);
  for (const exercise of exercises) {
    assert.equal(exercise.hints.length, 3);
    assert.ok(exercise.hints.every(hint => typeof hint === 'string' && hint.trim()));
    assert.ok(!exercise.hints.some(hint => hint.includes("'''")));
    const normalize = sql => sql.replace(/\s+/g, ' ').trim();
    assert.equal(normalize(exercise.hints[2]), normalize(exercise.starter), exercise.title);
  }
});

test('all 24 checklist topics have substantive teaching, valid checks, and acyclic prerequisites', () => {
  const {topics,normalizeProgress} = load('lib/curriculum.ts');
  assert.deepEqual(Array.from(topics,t=>t.id),Array.from({length:24},(_,i)=>i+1));
  const seen = new Set();
  function visit(id,stack = new Set()) {
    assert.ok(!stack.has(id),'prerequisite cycle at '+id);
    if(seen.has(id)) return;
    const topic=topics.find(t=>t.id===id);
    assert.ok(topic,'missing prerequisite '+id);
    topic.prerequisites.forEach(next=>visit(next,new Set([...stack,id])));
    seen.add(id);
  }
  for(const t of topics) {
    visit(t.id);
    assert.equal(t.sections.length,3);
    assert.ok(t.sections.every(([heading,text])=>heading && text.length>150));
    for(const field of ['objective','environment','example','task','solution','mistake','question','feedback']) assert.ok(t[field].length>15,`${t.id}: ${field}`);
    assert.ok(t.rubric.length>=3);
    assert.ok(t.answer>=0 && t.answer<t.options.length);
    assert.ok(t.sources.every(([label,url])=>label && url.startsWith('https://')));
  }
  const p=normalizeProgress({lessons:[1,1,32,33,'2',null],quizzes:[1,24,25],labs:[2,2,-1],notes:{1:'saved',999:'invalid',2:42}});
  assert.equal(JSON.stringify(p),JSON.stringify({lessons:[1,32],quizzes:[1,24],labs:[2],notes:{1:'saved'}}));
  for(const bad of [null,false,[],{lessons:'bad',quizzes:{},notes:[]}]) assert.equal(JSON.stringify(normalizeProgress(bad)),JSON.stringify({lessons:[],quizzes:[],labs:[],notes:{}}));
});

test('legacy checklist progress merges onto current content and tolerates corrupt records', () => {
  const security=load('utils/security.ts');
  const {mergePlan,PLAN_MODULES}=load('lib/plan.ts',{require:()=>security});
  const saved=[null,{id:'old-title',items:[{id:4,done:true},{id:3,done:'yes'},null]},false,{items:'bad'}];
  const merged=mergePlan(saved);
  assert.equal(merged.flatMap(m=>m.items).length,24);
  assert.ok(merged.flatMap(m=>m.items).find(i=>i.id===4).done);
  assert.ok(!merged.flatMap(m=>m.items).find(i=>i.id===3).done);
  assert.equal(merged[0].title,PLAN_MODULES[0].title);
  assert.equal(PLAN_MODULES.flatMap(m=>m.items).filter(i=>i.done).length,0);
  assert.equal(mergePlan({}).flatMap(m=>m.items).length,24);
});

test('every SQL lesson has a concrete commerce example and explicit challenge links stay valid', () => {
  const {lessons,exercises}=load('lib/data.ts');
  const {sqlExamples,sqlActivities}=load('lib/sql-learning.ts');
  assert.equal(new Set(lessons.map(l=>l.key)).size,32);
  for(const lesson of lessons) {
    assert.ok(sqlExamples[lesson.key],lesson.title);
    assert.ok(!sqlExamples[lesson.key].includes('...'),lesson.title);
  }
  for(const [key,id] of Object.entries(sqlActivities)) {
    assert.ok(lessons.some(l=>l.key===key));
    assert.ok(exercises.some(e=>e.id===id));
  }
});

test('all classrooms and roadmap render with no automatically completed lessons', () => {
  const React=require('react');
  const {renderToStaticMarkup}=require('react-dom/server');
  const curriculum=load('lib/curriculum.ts');
  const plan=load('lib/plan.ts',{require:()=>load('utils/security.ts')});
  const videos=load('lib/learning-videos.ts');
  const videoComponent=load('components/VideoReferences.tsx',{require:name=>name==='react/jsx-runtime'?require(name):videos});
  const examples=load('lib/topic-examples.ts');
  const explained=load('components/ExplainedExample.tsx',{require:name=>require(name)});
  const paths=load('lib/site-path.ts',{process:{env:{}}});
  const resolve=name=>name==='react'?React:name==='react/jsx-runtime'?require(name):name==='../lib/site-path'?paths:name==='../lib/curriculum'?curriculum:name==='../lib/learning-videos'?videos:name==='./VideoReferences'?videoComponent:name==='../lib/topic-examples'?examples:name==='./ExplainedExample'?explained:plan;
  const {LearningZone}=load('components/LearningZone.tsx',{require:resolve});
  for(const topic of curriculum.topics) {
    const html=renderToStaticMarkup(React.createElement(LearningZone,{topicId:topic.id,onSelect(){},progress:curriculum.emptyProgress,onProgress(){},onSQL(){},onInterview(){}}));
    assert.ok(html.includes(topic.title.replaceAll('&','&amp;')),topic.title);
    assert.ok(html.includes('Your practical task'));
    assert.ok(html.includes('Check answer'));
    assert.ok(html.includes('evidence-notes'));
    assert.ok(html.includes('Learn this topic on YouTube'));
    assert.ok(html.includes('Before following along'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.equal((html.match(/What each part does/g)||[]).length,3);
    assert.equal((html.match(/<h4>Expected result<\/h4>/g)||[]).length,3);
  }
  const {Checklist}=load('components/Checklist.tsx',{require:resolve});
  const html=renderToStaticMarkup(React.createElement(Checklist,{modules:plan.PLAN_MODULES,progress:curriculum.emptyProgress,onOpen(){},onToggle(){}}));
  assert.equal((html.match(/Learn this topic/g)||[]).length,24);
  assert.ok(html.includes('0/24 self-reported complete'));
});

test('every explanation and SQL lesson has a complete, specific example breakdown', () => {
  const {topics}=load('lib/curriculum.ts');
  const {lessons}=load('lib/data.ts');
  const {sectionExamples}=load('lib/topic-examples.ts');
  const {sqlWalkthroughs}=load('lib/sql-walkthroughs.ts');
  assert.equal(Object.keys(sectionExamples).length,24);
  for(const topic of topics) {
    assert.equal(sectionExamples[topic.id].length,topic.sections.length,topic.title);
    for(const example of sectionExamples[topic.id]) {
      for(const key of ['scenario','language','code','expected']) assert.ok(example[key].trim().length>10,`${topic.id}: ${key}`);
      assert.equal(example.parts.length,3);
      assert.ok(example.parts.every(([part,effect])=>part.trim() && effect.length>20));
      assert.ok(!example.code.includes('...') && !example.code.includes('…'),'no incomplete sample code');
    }
  }
  assert.equal(Object.keys(sqlWalkthroughs).length,lessons.length);
  for(const lesson of lessons) {
    const walkthrough=sqlWalkthroughs[lesson.key];
    assert.ok(walkthrough,lesson.title);
    assert.equal(walkthrough.parts.length,3);
    assert.ok(walkthrough.expected.length>30);
  }
});

test('every topic and SQL lesson has relevant direct YouTube references', () => {
  const {topics}=load('lib/curriculum.ts');
  const {lessons}=load('lib/data.ts');
  const {videoCatalog,topicVideoPicks,getTopicVideos,getSqlLessonVideos}=load('lib/learning-videos.ts');
  assert.equal(Object.keys(topicVideoPicks).length,24);
  const used=new Set();
  for(const topic of topics) {
    const picks=getTopicVideos(topic.id);
    assert.ok(picks.length>=1 && picks.length<=2,'video coverage for '+topic.title);
    for(const pick of picks) {
      assert.ok(pick.focus.length>30);
      assert.ok(pick.note.length>40);
      assert.ok(pick.title && pick.channel);
      assert.match(pick.url,/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
      assert.equal(pick.url.split('v=')[1],pick.id);
      assert.equal(pick.checkedOn,'2026-10-06');
      used.add(pick.id);
    }
  }
  assert.equal(used.size,Object.keys(videoCatalog).length,'no unused recommendations');
  for(const lesson of lessons) assert.ok(getSqlLessonVideos(lesson.key).length>0,lesson.title);
  assert.equal(getTopicVideos(999).length,0);
  assert.ok(getSqlLessonVideos('RANK').some(v=>v.id==='7NBt0V8ebGk'));
});

test('all five studios and 32 lessons render with honest execution labels', () => {
  const React=require('react');
  const {renderToStaticMarkup}=require('react-dom/server');
  const curriculum=load('lib/curriculum.ts');
  const examples=load('lib/topic-examples.ts');
  const catalog=load('lib/studios.ts',{require:name=>name==='./curriculum'?curriculum:examples});
  const videos=load('lib/learning-videos.ts');
  const explained=load('components/ExplainedExample.tsx',{require});
  const paths=load('lib/site-path.ts',{process:{env:{}}});
  const runner=load('components/PythonRunner.tsx',{require:name=>name==='../lib/site-path'?paths:require(name)});
  const videoComponent=load('components/VideoReferences.tsx',{require:name=>name==='react/jsx-runtime'?require(name):videos});
  const security=load('utils/security.ts');
  const resolve=name=>({'../lib/studios':catalog,'../lib/curriculum':curriculum,'../utils/security':security,'./ExplainedExample':explained,'./PythonRunner':runner,'./VideoReferences':videoComponent,'../lib/learning-videos':videos}[name]||require(name));
  const {LanguageStudios}=load('components/LanguageStudios.tsx',{require:resolve});
  assert.equal(catalog.studios.length,5);
  assert.equal(catalog.studios.flatMap(s=>s.lessons).length,32);
  for(const studio of catalog.studios){
    assert.equal(new Set(studio.lessons.map(l=>l.id)).size,studio.lessons.length);
    for(const lesson of studio.lessons){
      assert.ok(curriculum.topics.some(t=>t.id===lesson.topicId));
      assert.equal(lesson.example.parts.length,3);
      assert.equal(lesson.runnable,studio.id==='python');
      const html=renderToStaticMarkup(React.createElement(LanguageStudios,{onTopic(){},onSQL(){},initialStudioId:studio.id,initialLessonId:lesson.id}));
      assert.ok(html.includes(lesson.title.replaceAll('&','&amp;')));
      for(const label of ['What each part does','Expected result','Practice task','Export this practice','Learn this topic on YouTube'])assert.ok(html.includes(label),`${studio.id}/${lesson.id}: ${label}`);
      assert.equal(html.includes('Run Python'),lesson.runnable);
      if(!lesson.runnable)assert.ok(html.includes('does not execute or validate'));
    }
  }
  for(const value of [null,[],false,{}, {code:1,notes:2,studied:'yes'}]){
    assert.equal(JSON.stringify(catalog.normalizeStudioDraft(value,'seed')),JSON.stringify({code:'seed',notes:'',studied:false}));
  }
  const normalized=catalog.normalizeStudioDraft({code:'x'.repeat(50001),notes:'n'.repeat(13000),studied:true},'seed');
  assert.equal(normalized.code,'seed');assert.equal(normalized.notes.length,12000);assert.equal(normalized.studied,true);
  assert.equal(catalog.lessonExtension(catalog.studios[0].lessons[0]),'py');
  assert.equal(catalog.lessonExtension(catalog.studios.find(s=>s.id==='config').lessons[0]),'json');
  assert.equal(catalog.lessonExtension(catalog.studios.find(s=>s.id==='dbt').lessons[0]),'sql');
});

test('public worker and lab paths support both localhost and project Pages', () => {
  for(const prefix of ['', '/SQL-Academy']){
    const {assetPath}=load('lib/site-path.ts',{process:{env:{NEXT_PUBLIC_BASE_PATH:prefix}}});
    for(const file of ['/python-worker.js','/labs/orders.csv','/labs/batch_pipeline.py','/labs/stream_replay.py'])assert.equal(assetPath(file),prefix+file);
  }
});

test('Python worker handles packages, output, errors, bounds, and cleans its globals', async () => {
  const workerCode=fs.readFileSync(path.join(__dirname,'../public/python-worker.js'),'utf8');
  async function run(code,options={}){
    const messages=[];let callbacks,loadedCode,destroyed=false;
    const context={self:{postMessage:message=>messages.push(message)},importScripts:url=>assert.equal(url,'https://cdn.jsdelivr.net/pyodide/v0.29.2/full/pyodide.js'),loadPyodide:async config=>{
      callbacks=config;return {setStdin(){},loadPackagesFromImports:async source=>{loadedCode=source;},toPy:value=>{assert.equal(value.__name__,'__main__');return {destroy(){destroyed=true;}};},runPythonAsync:async()=>{callbacks.stdout(options.output||'30');if(options.error)throw new Error(options.error);}};
    }};
    vm.runInNewContext(workerCode,context);await context.self.onmessage({data:{code}});
    return {messages,loadedCode,destroyed};
  }
  const passed=await run('print(30)');
  assert.equal(passed.loadedCode,'print(30)');assert.equal(passed.destroyed,true);
  assert.equal(passed.messages.at(-1).output,'30\n');assert.equal(passed.messages.at(-1).error,null);
  assert.deepEqual(passed.messages.slice(0,2).map(m=>m.status),['loading','running']);
  const failed=await run('raise ValueError()', {error:'invalid value'});
  assert.ok(failed.messages.at(-1).error.includes('invalid value'));assert.equal(failed.destroyed,true);
  const capped=await run('print()', {output:'a'.repeat(21000)});
  assert.ok(capped.messages.at(-1).output.includes('Output limited'));assert.ok(capped.messages.at(-1).output.length<20100);
  const long=await run('x'.repeat(50001));assert.ok(long.messages.at(-1).error.includes('50,000'));assert.equal(long.loadedCode,undefined);
});
