import type { SectionExample } from '../lib/topic-examples';

export function ExplainedExample({example}:{example:SectionExample}) {
  return <div className="explained-example">
    <h3>A small example</h3><p>{example.scenario}</p>
    <div className="sql-box"><div className="sql-head"><span>{example.language}</span></div><pre className="sql-code">{example.code}</pre></div>
    <ExampleBreakdown parts={example.parts} expected={example.expected}/>
  </div>;
}

export function ExampleBreakdown({parts,expected}:Pick<SectionExample,'parts'|'expected'>) {
  return <><div className="example-table-scroll"><table className="example-parts"><caption>What each part does</caption><thead><tr><th scope="col">Part</th><th scope="col">What it does here</th></tr></thead><tbody>{parts.map(([part,effect])=><tr key={part}><th scope="row">{part}</th><td>{effect}</td></tr>)}</tbody></table></div><div className="example-result"><h4>Expected result</h4><p>{expected}</p></div></>;
}
