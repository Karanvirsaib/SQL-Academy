export type View = "home" | "learn" | "practice" | "cases" | "schema" | "interview" | "concepts" | "history" | "projects" | "mastery" | "graduation" | "plan";
export type Row = Record<string, unknown>;
export type Lesson = { id:number; title:string; level:string; text:string; sql:string; takeaway:string; tip:string };
export type LessonSeed = [string,string,string,string,string,string,string];
export type Project = {id:string; title:string; icon:string; dataset:string; difficulty:string; business:string; stakeholder:string; outcome:string; tasks:{id:number;title:string;prompt:string;starter:string;check:(rows:Row[])=>boolean}[]};
export type Exercise = { id:number; dataset:string; title:string; difficulty:string; topic:string; prompt:string; starter:string; hints:[string,string,string]; explanation:string; check:(rows:Row[])=>boolean };
export type CheckItem = { id:number; label:string; done:boolean };
export type Module = { id:string; icon:string; title:string; desc:string; items:CheckItem[] };
export type CaseStudy = {id:string; icon:string; title:string; difficulty:string; desc:string; dataset:string; kpis:string[]; questions:string[]};
