# Data Engineering — Guided Learning and Portfolio Practice
Plan doc in D:\sql_academy\sql-analyst-v7. Tick boxes as done.

## Scope
Pivot existing SQL Analyst site into full AI/cloud data engineering career track.
Includes: Databricks, SQL, Python, cloud (AWS/GCP/Azure basics), warehouses, Spark/Delta Lake,
orchestration (Airflow/dbt), monitoring, interviewing, portfolio projects.
End goal: explain core engineering decisions and build reproducible portfolio evidence. Course study is not equivalent to professional years of experience.

All 24 checklist items now open taught topics in Learning Zone. Each topic has three explanations, a worked example, a practical task, review criteria, a knowledge check, and official references. SQL Studio adds 32 runnable commerce examples. Local Python and external cloud/Spark/dbt labs clearly state their execution environment; the browser runs DuckDB SQL only.

Study and task completion are self-reported. Knowledge checks assess individual questions; they do not establish professional mastery. Learning notes, quiz results, and roadmap progress persist in this browser and can be exported/restored. Existing checklist checkmarks merge onto current topic content by stable numeric ID.

## Phase checklist

### Phase 1 — Foundations
- [ ] Linux / CLI / git
- [ ] Networking (TCP/IP, DNS, HTTP, LBs)
- [ ] SQL deep (SELECT, JOIN, GROUP BY, windows, CTEs, optimization) — reuse lib/data.ts
- [ ] Python for data: pandas, numpy, scripts
- [ ] Data modeling: star/snowflake, normalization, indexing

### Phase 2 — Cloud & Warehouse
- [ ] Cloud concepts: regions, IAM, networking, storage (S3 / ADLS / GCS)
- [ ] Warehouse: Snowflake / BigQuery / Databricks SQL
- [ ] Databricks: notebooks, Delta Lake, Spark SQL, MLflow basics
- [ ] ETL/ELT design: batch vs stream, idempotency, schema evolution
- [ ] PySpark: UDFs, partitioning, basic Spark SQL

### Phase 3 — Pipeline Engineering
- [ ] Workflow orchestration: Airflow / Dagster / Prefect (DAG, retries, backfill)
- [ ] dbt: models, sources, tests, docs, incremental builds
- [ ] Data quality: Great Expectations / soda / dbt tests
- [ ] Monitoring / observability: latency, SLA, freshness alerts
- [ ] Security / governance: PII, RBAC, encryption, audit logs

### Phase 4 — Job-Ready Projects
- [ ] Project A: Batch pipeline (cloud storage → warehouse → dashboard)
- [ ] Project B: Near-real-time ingestion (Kafka / Kinesis → Databricks)
- [ ] Project C: Data quality + monitoring + cost optimization (shows senior reasoning)
- [ ] READMEs + architecture diagrams + results pages for each

### Phase 5 — Interview / Landing
- [ ] System design: design pipeline at scale (10min talk + diagram)
- [ ] SQL interview: 5 hard patterns
- [ ] Behavioral: “pipeline I built / bad metric I fixed” stories
- [ ] Resume / LinkedIn with metrics (rows processed, latency reduced, cost saved)
- [ ] Mock interviews (record + redo until smooth)

## Site architecture (reuse this repo)
- `lib/plan.ts` — checklist data + save/load via `utils/security.ts` safeStorage
- `components/Checklist.tsx` — tick UI, progress
- `components/ModuleCard.tsx` — phase cards
- `types/index.ts` — add `Module`, `CheckItem`, `Project`
- `components/SQLAnalyst.tsx` — add `plan` view or integrate checklist nav
- `README.md` — update to describe cloud/AI DE track + checklist

## Verification
- Tick boxes persist after refresh (localStorage via safeStorage)
- No new npm dependencies
- 5 sections, all checkable, printable progress

## Ponytail / skipped
- Skipped custom backend/auth (localStorage enough for solo study)
- Upgrade when multi-user sync needed → add Firebase/simple backend
