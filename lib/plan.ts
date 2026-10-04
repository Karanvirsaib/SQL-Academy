import { Module, CheckItem } from "../types";
import { safeStorageGet, safeStorageSet } from "../utils/security";

export const PLAN_MODULES: Module[] = [
  {
    id: "foundations", icon: "▣", title: "Foundations", desc: "Linux, CLI, networking, SQL deep, Python, data modeling.",
    items: [
      { id: 1, label: "Linux / CLI / git basics", done: false },
      { id: 2, label: "Networking (TCP/IP, DNS, HTTP, LBs)", done: false },
      { id: 3, label: "SQL deep (SELECT, JOIN, GROUP BY, windows, CTEs, optimization)", done: false },
      { id: 4, label: "Python for data: pandas, numpy, scripts", done: false },
      { id: 5, label: "Data modeling: star/snowflake, normalization, indexing", done: false },
    ]
  },
  {
    id: "cloud", icon: "☁", title: "Cloud & Warehouse", desc: "Cloud concepts, warehouses, Databricks, Spark SQL, ETL/ELT.",
    items: [
      { id: 6, label: "Cloud: IAM, storage S3/ADLS/GCS, regions, networking", done: false },
      { id: 7, label: "Warehouse: Snowflake / BigQuery / Databricks SQL", done: false },
      { id: 8, label: "Databricks: notebooks, Delta Lake, Spark SQL, MLflow", done: false },
      { id: 9, label: "ETL/ELT design: batch vs stream, idempotency, schema evolution", done: false },
      { id: 10, label: "PySpark: UDFs, partitioning, basic Spark SQL", done: false },
    ]
  },
  {
    id: "pipeline", icon: "⚙", title: "Pipeline Engineering", desc: "Orchestration, dbt, quality, monitoring, security.",
    items: [
      { id: 11, label: "Workflow orchestration: Airflow / Dagster / Prefect", done: false },
      { id: 12, label: "dbt: models, sources, tests, docs, incremental builds", done: false },
      { id: 13, label: "Data quality: Great Expectations / soda / dbt tests", done: false },
      { id: 14, label: "Monitoring / observability: latency, SLA, freshness alerts", done: false },
      { id: 15, label: "Security / governance: PII, RBAC, encryption, audit logs", done: false },
    ]
  },
  {
    id: "projects", icon: "🏆", title: "Job-Ready Projects", desc: "Three portfolio projects with docs and results.",
    items: [
      { id: 16, label: "Project A: Batch pipeline (storage → warehouse → dashboard)", done: false },
      { id: 17, label: "Project B: Near-real-time ingestion (Kafka / Kinesis → Databricks)", done: false },
      { id: 18, label: "Project C: Data quality + monitoring + cost optimization", done: false },
      { id: 19, label: "READMEs + architecture diagrams + results pages", done: false },
    ]
  },
  {
    id: "interview", icon: "◉", title: "Interview & Landing", desc: "System design, SQL, behavioral, resume, mock interviews.",
    items: [
      { id: 20, label: "System design: pipeline at scale (10min talk + diagram)", done: false },
      { id: 21, label: "SQL interview: 5 hard patterns", done: false },
      { id: 22, label: "Behavioral: pipeline built / bad metric fixed stories", done: false },
      { id: 23, label: "Resume / LinkedIn with metrics (rows, latency, cost)", done: false },
      { id: 24, label: "Mock interviews (record + redo until smooth)", done: false },
    ]
  },
];

export function loadPlan(): Module[] {
  return safeStorageGet<Module[]>("plan", PLAN_MODULES);
}

export function savePlan(modules: Module[]): void {
  safeStorageSet("plan", modules);
}
