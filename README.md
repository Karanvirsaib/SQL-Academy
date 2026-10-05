# SQL Analyst Academy — Cloud / AI Data Engineering Career Track

Live website: **https://karanvirsaib.github.io/SQL-Academy/**

GitHub Actions tests and exports the site, then deploys it to GitHub Pages after each push to `main`. The Pages build uses `/SQL-Academy` as its base path, including worker and lab URLs. Local development keeps the root path. Progress is stored in each browser/origin; use the learning backup and studio exports to transfer local records to the hosted site.

A browser-based data engineering learning roadmap with 24 taught checklist topics and 32 SQL lessons. Every explanation section includes a small example, a breakdown of what each part does, and an expected result (72 examples across the roadmap). All 32 SQL lessons also explain their runnable query and expected result shape. Each roadmap topic includes a worked example, a practical task, review criteria, a knowledge check, and official references. Browser SQL runs in DuckDB; Python/Spark/cloud labs require the stated local or external environment. This is study and project practice, not a guarantee of employment, expertise, or years of experience.

## What's inside (24-topic curriculum)

**Phase 1 — Foundations**
- Linux / CLI / git basics
- Networking (TCP/IP, DNS, HTTP, load balancers)
- SQL deep: SELECT, JOIN, GROUP BY, window functions, CTEs, optimization (live DuckDB)
- Python for data: pandas, numpy, scripting
- Data modeling: star/snowflake schema, normalization, indexing

**Phase 2 — Cloud & Warehouse**
- Cloud concepts: regions, IAM, networking, storage (S3 / ADLS / GCS)
- Warehouses: Snowflake / BigQuery / Databricks SQL
- Databricks: notebooks, Delta Lake, Spark SQL, MLflow basics
- ETL/ELT design: batch vs streaming, idempotency, schema evolution
- PySpark: UDFs, partitioning, basic Spark SQL

**Phase 3 — Pipeline Engineering**
- Orchestration: Airflow / Dagster / Prefect (DAGs, retries, backfill)
- dbt: models, sources, tests, docs, incremental builds
- Data quality: Great Expectations / soda / dbt tests
- Monitoring / observability: latency, SLA, data freshness alerts
- Security / governance: PII, RBAC, encryption at rest/in transit, audit logs

**Phase 4 — Job-Ready Projects (3 guided portfolio briefs)**
- Project A: Batch pipeline — cloud storage → warehouse → dashboard
- Project B: Near-real-time ingestion — Kafka / Kinesis → Databricks
- Project C: Data quality + monitoring + cost optimization (practice in measured engineering reasoning)
- READMEs, architecture diagrams, and results pages for each

**Phase 5 — Interview & Landing**
- System design: design a pipeline at scale (10-minute talk + diagram)
- SQL interview: 5 hard patterns (joins, windows, aggregates, optimization)
- Behavioral stories: pipeline built / bad metric fixed
- Resume / LinkedIn with metrics (rows processed, latency reduced, cost saved)
- Mock interviews (record, redo until smooth)

## How to use

Open **Code Studios** for Python, Terminal & Git, PySpark, dbt & Jinja, and Configuration. The 32 studio lessons include editable drafts, example breakdowns, expected results, practice notes, downloads, and relevant videos. Study marks are self-reported and stored separately from roadmap progress; each workspace can export its own code and notes.

Python executes on demand through Pyodide 0.29.2 in a browser worker. First use downloads its runtime/packages from jsDelivr; NumPy and pandas imports are supported. Each run creates a fresh interpreter, output is capped at 20,000 characters, and execution is stopped after 30 seconds (loading has a separate 150-second deadline). Stop or leaving the lesson terminates its worker. Interactive input, local computer files, and Spark are not provided. Other studios teach external execution; their expected outputs are predictions, not fabricated runtime results.

1. `npm install`
2. `npm run dev`
3. Open the local URL — `plan` view (📋 Course Plan nav button) opens the checklist.
4. Tick boxes; progress saves to `localStorage` via `safeStorage` (defensive, no backend needed).
5. Follow prerequisite links. Use SQL Studio for 32 runnable commerce examples, SQL Practice for related challenges, and the project topic rubrics for engineering builds. The local SQL completion record is separate from engineering roadmap progress.

## Site architecture (lazy / reuse)

- `COURSE_PLAN.md` — master checklist document (tickable)
- `lib/plan.ts` — checklist data + persistence (reuses `utils/security.ts`)
- `types/index.ts` — `Module` / `CheckItem` / `View` extensions
- `components/Checklist.tsx` — connected roadmap with topic entry points
- `lib/curriculum.ts` + `components/LearningZone.tsx` — 24 taught topics, knowledge checks, and task evidence
- `components/SQLAnalyst.tsx` — roadmap, SQL Studio, and practice navigation
- `README.md` — this page

## What's new / changed

- Added `plan` view and `Course Plan` nav button
- Added checklist components and data layer
- Expanded README to full course description
- Existing SQL curriculum preserved (32 lessons, 4 datasets, challenges, interview mode, mastery dashboard, graduation)

## Build / verify

```bash
npm install
npm run dev
```

Run `npm run typecheck`, `npm test`, and `npm run build` to verify the app. SQL hint syntax, hint progression, saved-progress hydration, and browser database cleanup have been repaired. The SQL engine downloads DuckDB WebAssembly assets from jsDelivr, so its first startup requires internet access.

## Notes

- Progress saved locally — no account required for solo study.
- Upgrade path: multi-user progress sync → add Firebase / simple backend when needed (not required now per ponytail / YAGNI).
- All code uses existing React patterns; no new npm dependencies.

## Current learning features

- 24 taught roadmap topics, each with objectives, prerequisites, three explanations, example, practical task, rubric, review approach, mistake, knowledge check, and references.
- 32 SQL lesson examples execute against the commerce dataset. Explicit challenge links replace the old title-based fallback; unmatched examples open an unassessed sandbox.
- Learning notes, quiz passes, task records, and SQL study records persist locally. Export/restore/reset controls apply to learning and checklist data; SQL query history remains separate.
- `public/labs/batch_pipeline.py` and `stream_replay.py` are runnable standard-library starter labs, with synthetic fixture and checks. They do not deploy cloud infrastructure.
- Existing saved checklist checkmarks are merged into current topic definitions instead of restoring outdated labels/content.
- Build and automated checks validate source, content contracts, migration, classroom rendering, and starter labs. Visual browser verification requires browser permission.

## Optional YouTube references

All 24 Learning Zone topics and the SQL Studio lessons now include optional video recommendations. The catalog contains 33 distinct videos, selected for topic fit from publisher descriptions and course materials; video titles and channels were verified with YouTube’s oEmbed metadata on 2026-10-06. Each recommendation explains what to study and any relevant differences in SQL dialect, runtime, cloud environment, or older setup instructions. These are recommendations rather than an objective ranking or a claim of watching every course end to end. Videos open through direct YouTube links; the site does not embed players, fetch thumbnails, or mark lessons complete when a link is opened.
