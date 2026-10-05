// Publisher descriptions were researched; titles/channels were checked with YouTube oEmbed.
// Selection is a learning recommendation, not a claim of exhaustive viewing or universal ranking.
export type LearningVideo = {id:string; title:string; channel:string; url:string; format:string; note:string; checkedOn:string};
export type VideoPick = {videoId:string; focus:string};
export const videoCatalog: Record<string,LearningVideo> = {
  "mABpAI-pCw0": {
    "id": "mABpAI-pCw0",
    "title": "Command Line Basics for Beginners - Full Course",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=mABpAI-pCw0",
    "format": "Course",
    "note": "Uses Bash commands. On Windows, follow with WSL/Git Bash or use the PowerShell equivalents in this lesson.",
    "checkedOn": "2026-10-06"
  },
  "vA5TTz6BXhY": {
    "id": "vA5TTz6BXhY",
    "title": "Git & GitHub Crash Course 2025",
    "channel": "Traversy Media",
    "url": "https://www.youtube.com/watch?v=vA5TTz6BXhY",
    "format": "Walkthrough",
    "note": "Focus on status, staging, commits, branches, and collaboration. GitHub screens may change; use the lesson’s safe local practice directory.",
    "checkedOn": "2026-10-06"
  },
  "nyH0nYhMW9M": {
    "id": "nyH0nYhMW9M",
    "title": "What is DNS (Domain Name System)?",
    "channel": "IBM Technology",
    "url": "https://www.youtube.com/watch?v=nyH0nYhMW9M",
    "format": "Explanation",
    "note": "A focused DNS explanation. It covers one part of networking, not the entire API-ingestion lesson.",
    "checkedOn": "2026-10-06"
  },
  "qiQR5rTSshw": {
    "id": "qiQR5rTSshw",
    "title": "Computer Networking Course - Network Engineering [CompTIA Network+ Exam Prep]",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=qiQR5rTSshw",
    "format": "Course",
    "note": "A broad 2020 networking course. Use the TCP/IP and protocol sections for fundamentals; do not use it as a current exam syllabus.",
    "checkedOn": "2026-10-06"
  },
  "UjhFbq4uU2Y": {
    "id": "UjhFbq4uU2Y",
    "title": "SQL for Data Engineering -  Full Course for Beginners",
    "channel": "Luke Barousse",
    "url": "https://www.youtube.com/watch?v=UjhFbq4uU2Y",
    "format": "Course",
    "note": "Uses DuckDB/MotherDuck and the instructor’s own datasets. Our browser commerce dataset is separate; external account/setup steps are optional.",
    "checkedOn": "2026-10-06"
  },
  "OT1RErkfLNQ": {
    "id": "OT1RErkfLNQ",
    "title": "Learn SQL Beginner to Advanced in Under 4 Hours",
    "channel": "Alex The Analyst",
    "url": "https://www.youtube.com/watch?v=OT1RErkfLNQ",
    "format": "Course",
    "note": "Uses MySQL. Core SQL ideas transfer, but date functions, casts, and setup differ from our DuckDB practice.",
    "checkedOn": "2026-10-06"
  },
  "eWRfhZUzrAc": {
    "id": "eWRfhZUzrAc",
    "title": "Python for Beginners – Full Course [Programming Tutorial]",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=eWRfhZUzrAc",
    "format": "Course",
    "note": "Start with variables, functions, loops, and collections before pandas. Run examples in your own Python environment.",
    "checkedOn": "2026-10-06"
  },
  "GPVsHOlRBBI": {
    "id": "GPVsHOlRBBI",
    "title": "Data Analysis with Python Course - Numpy, Pandas, Data Visualization",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=GPVsHOlRBBI",
    "format": "Course",
    "note": "A longer Python/NumPy/pandas course. It predates current library versions; adapt old APIs using the official references in the lesson.",
    "checkedOn": "2026-10-06"
  },
  "IdCmMkQLvGA": {
    "id": "IdCmMkQLvGA",
    "title": "Data Modeling in the Modern Data Stack",
    "channel": "Kahan Data Solutions",
    "url": "https://www.youtube.com/watch?v=IdCmMkQLvGA",
    "format": "Explanation",
    "note": "An overview of modeling approaches and decisions. Use the lesson’s grain and history task to apply the ideas.",
    "checkedOn": "2026-10-06"
  },
  "NcWBt-B_gSI": {
    "id": "NcWBt-B_gSI",
    "title": "How Would You Model This Data? (Example)",
    "channel": "Kahan Data Solutions",
    "url": "https://www.youtube.com/watch?v=NcWBt-B_gSI",
    "format": "Walkthrough",
    "note": "A modeling example to compare against your own design; there may be more than one defensible model.",
    "checkedOn": "2026-10-06"
  },
  "7HKot-brXFE": {
    "id": "7HKot-brXFE",
    "title": "AWS Certified Cloud Practitioner Certification Course 2026 (CLF-C02) - Pass the Exam!",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=7HKot-brXFE",
    "format": "Course",
    "note": "AWS-specific and exam-oriented. Focus on identity, storage, regions, and networking; it does not teach every Azure/GCP equivalent.",
    "checkedOn": "2026-10-06"
  },
  "HIff0No7wrM": {
    "id": "HIff0No7wrM",
    "title": "Get Started with Snowflake: Hands-On Introduction",
    "channel": "Snowflake Developers",
    "url": "https://www.youtube.com/watch?v=HIff0No7wrM",
    "format": "Walkthrough",
    "note": "Official Snowflake introduction. Follow-along needs a Snowflake account; it is not a BigQuery or Databricks comparison course.",
    "checkedOn": "2026-10-06"
  },
  "a18C8kJfNrE": {
    "id": "a18C8kJfNrE",
    "title": "Intro to Delta Lake",
    "channel": "Databricks",
    "url": "https://www.youtube.com/watch?v=a18C8kJfNrE",
    "format": "Explanation",
    "note": "Official introductory Delta Lake video from 2021. Learn the transactional-table idea; check current runtime and retention documentation for setup.",
    "checkedOn": "2026-10-06"
  },
  "fkWxiesfrgk": {
    "id": "fkWxiesfrgk",
    "title": "Delta Lake - EXPLAINED - Full Tutorial",
    "channel": "Databricks For Professionals",
    "url": "https://www.youtube.com/watch?v=fkWxiesfrgk",
    "format": "Course",
    "note": "Independent instructor, not the official Databricks channel. A 2024 Delta deep dive; optimization features depend on your current runtime.",
    "checkedOn": "2026-10-06"
  },
  "KIv2Na2-u24": {
    "id": "KIv2Na2-u24",
    "title": "ETL vs ELT: Powering Data Pipelines for AI & Analytics",
    "channel": "IBM Technology",
    "url": "https://www.youtube.com/watch?v=KIv2Na2-u24",
    "format": "Explanation",
    "note": "Explains ETL versus ELT choices. Pair it with the lesson’s replay and incremental-load task; this overview does not implement idempotency.",
    "checkedOn": "2026-10-06"
  },
  "_C8kWso4ne4": {
    "id": "_C8kWso4ne4",
    "title": "PySpark Tutorial",
    "channel": "freeCodeCamp.org",
    "url": "https://www.youtube.com/watch?v=_C8kWso4ne4",
    "format": "Course",
    "note": "Focus on DataFrames, filtering, schemas, and aggregation. The 2021 course includes optional ML material and older Databricks setup.",
    "checkedOn": "2026-10-06"
  },
  "xUKIL7zsjos": {
    "id": "xUKIL7zsjos",
    "title": "Getting Started with Airflow for Beginners",
    "channel": "Data with Marc",
    "url": "https://www.youtube.com/watch?v=xUKIL7zsjos",
    "format": "Walkthrough",
    "note": "A 2023 introductory Airflow tutorial. Older imports, setup, and UI can differ from Airflow 3; use current docs when running code.",
    "checkedOn": "2026-10-06"
  },
  "Ui1Wt0zRdVU": {
    "id": "Ui1Wt0zRdVU",
    "title": "Introducing Apache Airflow® 3",
    "channel": "Astronomer",
    "url": "https://www.youtube.com/watch?v=Ui1Wt0zRdVU",
    "format": "Explanation",
    "note": "Astronomer’s Airflow 3 feature walkthrough, useful after the introduction. It is not a complete beginner installation course.",
    "checkedOn": "2026-10-06"
  },
  "a3fRALauYWs": {
    "id": "a3fRALauYWs",
    "title": "Zero to dbt",
    "channel": "dbt Labs",
    "url": "https://www.youtube.com/watch?v=a3fRALauYWs",
    "format": "Course",
    "note": "Official, fast-paced dbt foundations. The 2022 interface and setup can differ from current dbt; use the linked official docs for your adapter.",
    "checkedOn": "2026-10-06"
  },
  "fo7lUn6vgtg": {
    "id": "fo7lUn6vgtg",
    "title": "Workshop: Advanced Testing",
    "channel": "dbt Labs",
    "url": "https://www.youtube.com/watch?v=fo7lUn6vgtg",
    "format": "Workshop",
    "note": "Official dbt testing workshop; study the dbt topic first. Older packages and configuration may require updates.",
    "checkedOn": "2026-10-06"
  },
  "AgSEc90KpeI": {
    "id": "AgSEc90KpeI",
    "title": "How to Build a Data Quality Framework in Databricks with Great Expectations",
    "channel": "The Data and AI Guy",
    "url": "https://www.youtube.com/watch?v=AgSEc90KpeI",
    "format": "Walkthrough",
    "note": "Uses Databricks and Great Expectations. Follow-along needs that environment; verify GX/runtime versions rather than copying setup blindly.",
    "checkedOn": "2026-10-06"
  },
  "jfg9wBJBtKk": {
    "id": "jfg9wBJBtKk",
    "title": "What is Data Observability?",
    "channel": "IBM Technology",
    "url": "https://www.youtube.com/watch?v=jfg9wBJBtKk",
    "format": "Explanation",
    "note": "A conceptual overview with vendor context. Apply the ideas to freshness, counts, alerts, and the runbook task; no paid product is required.",
    "checkedOn": "2026-10-06"
  },
  "uPsUjKLHLAg": {
    "id": "uPsUjKLHLAg",
    "title": "Data Governance Explained in 5 Minutes",
    "channel": "IBM Technology",
    "url": "https://www.youtube.com/watch?v=uPsUjKLHLAg",
    "format": "Explanation",
    "note": "A brief governance overview with IBM product context. It supports the lesson but does not establish legal compliance.",
    "checkedOn": "2026-10-06"
  },
  "rvZ35YW4t5k": {
    "id": "rvZ35YW4t5k",
    "title": "Role-based access control (RBAC) vs. Attribute-based access control (ABAC)",
    "channel": "IBM Technology",
    "url": "https://www.youtube.com/watch?v=rvZ35YW4t5k",
    "format": "Explanation",
    "note": "Compares role-based and attribute-based access decisions. Turn the concepts into your lesson’s access matrix.",
    "checkedOn": "2026-10-06"
  },
  "yZKJFKu49Dk": {
    "id": "yZKJFKu49Dk",
    "title": "YouTube Data Analysis | END TO END DATA ENGINEERING PROJECT",
    "channel": "Darshil Parmar",
    "url": "https://www.youtube.com/watch?v=yZKJFKu49Dk",
    "format": "Walkthrough",
    "note": "An AWS-based project using a YouTube trending dataset, not our local orders lab. External services may cost money; use its architecture as a comparison.",
    "checkedOn": "2026-10-06"
  },
  "GqAcTrqKcrY": {
    "id": "GqAcTrqKcrY",
    "title": "Realtime Data Streaming |  End To End Data Engineering Project",
    "channel": "CodeWithYu",
    "url": "https://www.youtube.com/watch?v=GqAcTrqKcrY",
    "format": "Walkthrough",
    "note": "Kafka/Spark streaming project with Cassandra/PostgreSQL and Docker, not Kafka → Databricks. Older ZooKeeper-era setup differs from current Kafka deployments.",
    "checkedOn": "2026-10-06"
  },
  "WSplTjBKijU": {
    "id": "WSplTjBKijU",
    "title": "Fine Tuning and Enhancing Performance of Apache Spark Jobs",
    "channel": "Databricks",
    "url": "https://www.youtube.com/watch?v=WSplTjBKijU",
    "format": "Talk",
    "note": "An older technical Spark tuning talk. Use it for diagnostic reasoning, not universal tuning values; measure against your current workload/runtime.",
    "checkedOn": "2026-10-06"
  },
  "HUBNt18RFbo": {
    "id": "HUBNt18RFbo",
    "title": "Markdown Crash Course",
    "channel": "Traversy Media",
    "url": "https://www.youtube.com/watch?v=HUBNt18RFbo",
    "format": "Walkthrough",
    "note": "Teaches Markdown syntax for READMEs. Pair it with this lesson’s reproducibility rubric; attractive formatting alone is not sufficient documentation.",
    "checkedOn": "2026-10-06"
  },
  "SQ50_kEQElk": {
    "id": "SQ50_kEQElk",
    "title": "Data Engineering Interview | System Design",
    "channel": "The Big Data Show",
    "url": "https://www.youtube.com/watch?v=SQ50_kEQElk",
    "format": "Interview",
    "note": "An example interview, not a universal hiring rubric. Pause to answer yourself and compare requirements, tradeoffs, and the review discussion.",
    "checkedOn": "2026-10-06"
  },
  "7NBt0V8ebGk": {
    "id": "7NBt0V8ebGk",
    "title": "Window Functions in MySQL | Intermediate MySQL",
    "channel": "Alex The Analyst",
    "url": "https://www.youtube.com/watch?v=7NBt0V8ebGk",
    "format": "Walkthrough",
    "note": "Uses MySQL window functions. Focus on partitioning, ranking, and LAG; this video is not coverage of all five interview patterns.",
    "checkedOn": "2026-10-06"
  },
  "gZ2354BH0a0": {
    "id": "gZ2354BH0a0",
    "title": "Don't Use STAR in Your Next Interview (Do This Instead)!",
    "channel": "Jeff Su",
    "url": "https://www.youtube.com/watch?v=gZ2354BH0a0",
    "format": "Explanation",
    "note": "Compares STAR with CARL and adds reflection. Treat it as an alternative structure, not a rule to abandon STAR; keep project claims truthful.",
    "checkedOn": "2026-10-06"
  },
  "Tt08KmFfIYQ": {
    "id": "Tt08KmFfIYQ",
    "title": "Write an Incredible Resume: 5 Golden Rules!",
    "channel": "Jeff Su",
    "url": "https://www.youtube.com/watch?v=Tt08KmFfIYQ",
    "format": "Explanation",
    "note": "General resume advice, not a data engineering hiring guarantee. Use only metrics and experience you can substantiate.",
    "checkedOn": "2026-10-06"
  },
  "OKF7ZeWNrfg": {
    "id": "OKF7ZeWNrfg",
    "title": "5 LinkedIn Profile Tips that Get You Hired (backed by data)",
    "channel": "Jeff Su",
    "url": "https://www.youtube.com/watch?v=OKF7ZeWNrfg",
    "format": "Explanation",
    "note": "General LinkedIn guidance. Apply the useful writing ideas; outcomes are not guaranteed and product screens can change.",
    "checkedOn": "2026-10-06"
  }
};
export const topicVideoPicks: Record<number,VideoPick[]> = {
  "1": [
    {
      "videoId": "mABpAI-pCw0",
      "focus": "Get comfortable navigating directories and reading files."
    },
    {
      "videoId": "vA5TTz6BXhY",
      "focus": "Then practice saving and explaining a change with Git."
    }
  ],
  "2": [
    {
      "videoId": "nyH0nYhMW9M",
      "focus": "Visualize the DNS step in an HTTPS request."
    },
    {
      "videoId": "qiQR5rTSshw",
      "focus": "Go deeper into network layers and TCP/IP when those terms are unclear."
    }
  ],
  "3": [
    {
      "videoId": "UjhFbq4uU2Y",
      "focus": "Study SQL foundations and production querying in a DuckDB-based course."
    },
    {
      "videoId": "OT1RErkfLNQ",
      "focus": "Use a second instructor’s examples for joins, aggregation, CTEs, and windows."
    }
  ],
  "4": [
    {
      "videoId": "eWRfhZUzrAc",
      "focus": "Build plain Python foundations before tabular libraries."
    },
    {
      "videoId": "GPVsHOlRBBI",
      "focus": "Then learn NumPy arrays and pandas transformations with examples."
    }
  ],
  "5": [
    {
      "videoId": "IdCmMkQLvGA",
      "focus": "Understand why modeling choices matter and how approaches differ."
    },
    {
      "videoId": "NcWBt-B_gSI",
      "focus": "Compare a worked model with your own declared grain and keys."
    }
  ],
  "6": [
    {
      "videoId": "7HKot-brXFE",
      "focus": "Use the relevant AWS chapters to understand IAM, object storage, regions, and cloud boundaries."
    }
  ],
  "7": [
    {
      "videoId": "HIff0No7wrM",
      "focus": "See one warehouse’s basic concepts in an official hands-on introduction."
    }
  ],
  "8": [
    {
      "videoId": "a18C8kJfNrE",
      "focus": "Start with the idea behind reliable Delta tables."
    },
    {
      "videoId": "fkWxiesfrgk",
      "focus": "Then explore Delta logs, operations, and optimization concepts."
    }
  ],
  "9": [
    {
      "videoId": "KIv2Na2-u24",
      "focus": "Clarify where transformations happen and why ETL/ELT choices differ."
    }
  ],
  "10": [
    {
      "videoId": "_C8kWso4ne4",
      "focus": "Practice PySpark DataFrame operations before taking on distributed tuning."
    }
  ],
  "11": [
    {
      "videoId": "xUKIL7zsjos",
      "focus": "See an introductory Airflow workflow and its core concepts."
    },
    {
      "videoId": "Ui1Wt0zRdVU",
      "focus": "Then understand the major Airflow 3 changes before using current setup instructions."
    }
  ],
  "12": [
    {
      "videoId": "a3fRALauYWs",
      "focus": "Learn dbt concepts directly from dbt Labs."
    }
  ],
  "13": [
    {
      "videoId": "fo7lUn6vgtg",
      "focus": "Go deeper into testing after studying models and data contracts."
    },
    {
      "videoId": "AgSEc90KpeI",
      "focus": "See an alternative quality framework integrated with Databricks."
    }
  ],
  "14": [
    {
      "videoId": "jfg9wBJBtKk",
      "focus": "Understand why healthy jobs do not always imply healthy data."
    }
  ],
  "15": [
    {
      "videoId": "uPsUjKLHLAg",
      "focus": "Build a quick mental model of data governance."
    },
    {
      "videoId": "rvZ35YW4t5k",
      "focus": "Then reason about roles, attributes, and authorization boundaries."
    }
  ],
  "16": [
    {
      "videoId": "UjhFbq4uU2Y",
      "focus": "Use the warehouse/ETL project as a local SQL-oriented project reference."
    },
    {
      "videoId": "yZKJFKu49Dk",
      "focus": "Compare a cloud project’s ingestion, storage, and analysis flow with your batch design."
    }
  ],
  "17": [
    {
      "videoId": "GqAcTrqKcrY",
      "focus": "Follow a broker-to-processing streaming project and compare its components with your design."
    }
  ],
  "18": [
    {
      "videoId": "jfg9wBJBtKk",
      "focus": "Design signals for your reliability experiment."
    },
    {
      "videoId": "WSplTjBKijU",
      "focus": "Practice performance diagnosis before changing resource settings."
    }
  ],
  "19": [
    {
      "videoId": "HUBNt18RFbo",
      "focus": "Learn the Markdown needed to communicate your project clearly."
    },
    {
      "videoId": "UjhFbq4uU2Y",
      "focus": "Use the instructor’s accompanying project repository as a documentation example."
    }
  ],
  "20": [
    {
      "videoId": "SQ50_kEQElk",
      "focus": "Observe a data engineering system-design discussion and assess it with the lesson rubric."
    }
  ],
  "21": [
    {
      "videoId": "7NBt0V8ebGk",
      "focus": "Reinforce the window-function reasoning behind ranking and previous-row comparisons."
    },
    {
      "videoId": "OT1RErkfLNQ",
      "focus": "Revisit the broader SQL foundations if joins or CTEs are slowing you down."
    }
  ],
  "22": [
    {
      "videoId": "gZ2354BH0a0",
      "focus": "Improve the structure of your project stories and include what you learned."
    }
  ],
  "23": [
    {
      "videoId": "Tt08KmFfIYQ",
      "focus": "Make resume bullets specific and evidence-based."
    },
    {
      "videoId": "OKF7ZeWNrfg",
      "focus": "Keep your LinkedIn presentation clear and consistent with your real work."
    }
  ],
  "24": [
    {
      "videoId": "SQ50_kEQElk",
      "focus": "Use the example as a mock: pause before responses, answer aloud, and score your own reasoning."
    },
    {
      "videoId": "gZ2354BH0a0",
      "focus": "Review your behavioral-answer structure before a second practice attempt."
    }
  ]
};
export function getTopicVideos(topicId:number){
  return (topicVideoPicks[topicId]||[]).map(pick=>({...videoCatalog[pick.videoId],focus:pick.focus}));
}
export function getSqlLessonVideos(key:string){
  const windowKeys=['ROW','RANK','LAG','RUNNING','MOVING'];
  const topicId=windowKeys.includes(key)?21:key==='QUALITY'?13:key==='PROJECT'?16:3;
  return getTopicVideos(topicId);
}
