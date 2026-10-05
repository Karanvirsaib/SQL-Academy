/* Python runs only after Run is pressed. A worker can be terminated by Stop. */
const RUNTIME_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.2/full/';
let busy = false;
self.onmessage = async ({data}) => {
  if (busy || !data || typeof data.code !== 'string') return;
  busy = true;
  let globals;
  let output = '';
  let truncated = false;
  const append = line => {
    const remaining = 20000 - output.length;
    if (remaining > 0) output += (String(line) + '\n').slice(0,remaining);
    if (String(line).length + 1 > remaining) truncated = true;
  };
  try {
    if(data.code.length > 50000) throw new Error('Keep scripts under 50,000 characters.');
    self.postMessage({type:'status',status:'loading'});
    importScripts(RUNTIME_URL + 'pyodide.js');
    const pyodide = await loadPyodide({indexURL:RUNTIME_URL,stdout:append,stderr:append});
    pyodide.setStdin({stdin:()=>{throw new Error('Interactive input() is not supported. Set a value in your script instead.');}});
    await pyodide.loadPackagesFromImports(data.code);
    globals = pyodide.toPy({__name__:'__main__'});
    self.postMessage({type:'status',status:'running'});
    const result = await pyodide.runPythonAsync(data.code,{globals,filename:'studio.py'});
    if(result && typeof result.destroy === 'function') result.destroy();
    self.postMessage({type:'result',output:output + (truncated?'\n[Output limited to 20,000 characters.]':''),error:null});
  } catch(error) {
    self.postMessage({type:'result',output,error:String(error).slice(0,12000)});
  } finally {
    if(globals) globals.destroy();
    busy = false;
  }
};
