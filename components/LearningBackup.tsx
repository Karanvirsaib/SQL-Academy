import { useRef, useState } from 'react';
import { LearningProgress, normalizeProgress } from '../lib/curriculum';
import { mergePlan } from '../lib/plan';
import { Module } from '../types';

export function LearningBackup({progress,plan,onRestore}:{progress:LearningProgress;plan:Module[];onRestore:(p:LearningProgress,m:Module[])=>void}) {
  const file=useRef<HTMLInputElement>(null);
  const [message,setMessage]=useState('');
  function download(){
    const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,learning:progress,plan},null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='academy-learning-backup.json';link.click();URL.revokeObjectURL(url);
    setMessage('Learning notes and roadmap backup downloaded. SQL challenge history is stored separately.');
  }
  async function restore(input:File){
    try {
      if(input.size>2000000)throw new Error('Backup is too large.');
      const value=JSON.parse(await input.text());
      if(!value||value.version!==1||!value.learning||typeof value.learning!=='object'||!Array.isArray(value.plan))throw new Error('Choose an academy learning backup (version 1).');
      if(!window.confirm('Replace your Learning Zone notes, study progress, and checklist with this backup?'))return;
      onRestore(normalizeProgress(value.learning),mergePlan(value.plan));setMessage('Learning backup restored.');
    }catch(error){setMessage(error instanceof Error?error.message:'Unable to read backup.');}
    finally {if(file.current)file.current.value='';}
  }
  return <div className="learning-backup"><span>Saved in this browser · back up your notes before clearing browser data.</span><div className="actions"><button className="btn" onClick={download}>Export learning backup</button><button className="btn" onClick={()=>file.current?.click()}>Restore backup</button><button className="btn" onClick={()=>{if(window.confirm('Reset Learning Zone notes, knowledge checks, tasks, SQL study records, and checklist? SQL challenge history will stay.')){onRestore(normalizeProgress({}),mergePlan([]));setMessage('Learning and roadmap progress reset.');}}}>Reset learning progress</button><input ref={file} type="file" accept="application/json,.json" hidden onChange={e=>{const selected=e.target.files?.[0];if(selected)void restore(selected);}}/></div>{message&&<p role="status">{message}</p>}</div>;
}
