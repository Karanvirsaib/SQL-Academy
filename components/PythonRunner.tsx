import { useEffect, useRef, useState } from 'react';
import { assetPath } from '../lib/site-path';

export function PythonRunner({code}:{code:string}) {
  const worker=useRef<Worker|null>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [status,setStatus]=useState('Ready to run');
  const [busy,setBusy]=useState(false);
  const [output,setOutput]=useState('');
  const [error,setError]=useState('');
  const [lastCode,setLastCode]=useState<string|null>(null);
  function dispose(){if(timer.current)clearTimeout(timer.current);timer.current=null;worker.current?.terminate();worker.current=null;}
  useEffect(()=>()=>dispose(),[]);
  function stop(){dispose();setBusy(false);setStatus('Stopped · runtime reset');setError('Execution stopped. Your editor is unchanged.');}
  function run(){
    dispose();setOutput('');setError('');setLastCode(code);setBusy(true);setStatus('Loading Python and imported packages…');
    try {
      const active=new Worker(assetPath('/python-worker.js'));worker.current=active;
      const deadline=(ms:number,message:string)=>{if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{dispose();setBusy(false);setStatus('Timed out');setError(message);},ms);};
      deadline(150000,'Python/package loading timed out. Check your connection and try Run again.');
      active.onmessage=({data})=>{
        if(worker.current!==active)return;
        if(data.type==='status' && data.status==='running'){setStatus('Running…');deadline(30000,'Execution exceeded 30 seconds and was stopped. Check loops or reduce the input size.');}
        if(data.type==='result'){setOutput(data.output||'');setError(data.error||'');setStatus(data.error?'Python error':'Finished');setBusy(false);dispose();}
      };
      active.onerror=()=>{if(worker.current!==active)return;dispose();setBusy(false);setStatus('Runtime unavailable');setError('Could not load the Python worker/runtime. Check your connection or browser settings, then retry.');};
      active.postMessage({code});
    }catch(err){dispose();setBusy(false);setStatus('Runtime unavailable');setError(String(err));}
  }
  return <section className="python-console"><div className="actions"><button className="btn primary" disabled={busy||!code.trim()} onClick={run}>▶ Run Python</button><button className="btn" disabled={!busy} onClick={stop}>Stop</button><span role="status">{status}</span></div><p className="progress-disclosure">Python runs in your browser. First use downloads the runtime and imported packages. Each run starts fresh. Use print() to see results; input(), local files, and a Spark session are unavailable.</p><h3>Actual output</h3>{lastCode!==null&&lastCode!==code&&<p className="tip-box">The editor has changed since this run started. Run the edited script to update the output.</p>}<pre className="studio-output" aria-live="polite">{output|| (busy?'Waiting for output…':'No printed output yet.')}</pre>{error&&<pre className="studio-error" role="alert">{error}</pre>}</section>;
}
