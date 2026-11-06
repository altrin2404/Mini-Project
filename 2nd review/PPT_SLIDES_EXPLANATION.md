# Digital Class Twin: Comprehensive PPT Slide-by-Slide Presentation & Technical Defense Guide

**Project Title:** AI-Driven Academic Risk & Dropout Early-Warning System (Digital Class Twin)  
**Academic Milestone:** Mini Project — Review 2  
**Department & Institution:** Department of Information Technology, St. Xavier's Catholic College of Engineering (SXCCE)  
**Supervisor / Guide:** Er. Agnes Alex Rathy P, Assistant Professor / IT  
**Team Members:**
- Altrin Benser A (`962223205010`)
- Jins John J (`962223205032`)
- Jerish Rethna J (`962223205029`)
- Mukhilan S (`962223205040`)

---

## Executive Summary & Core Project Thesis

Traditional college management systems and Learning Management Systems (LMS) treat student records as **static, siloed tables** (an attendance register, an internal exam mark sheet, and disciplinary notes). These records are examined only after the semester is half over or after exams are graded, making intervention **reactive and too late**.

The **Digital Class Twin** re-architects academic monitoring as a **living, event-driven cyber-physical replica** of each student's academic journey:
1. Every classroom occurrence (attendance swipe, quiz result, internal test score, lab submission, disciplinary remark) is ingested as a timestamped **Event**.
2. An asynchronous/event pipeline normalizes the event, updates rolling 30-day statistical **Features**, and computes a composite, explainable **Risk Score** (Academic 50%, Attendance 30%, Behavior 20%).
3. The student's virtual counterpart (**Digital Twin**) transitions between finite states (`stable`, `warning`, `critical`).
4. Whenever the twin changes state or worsens, a **TwinSnapshot** is recorded for longitudinal trajectory analysis and an **Alert** is dispatched to teachers, parents, and students with explainable rationale.
5. Role-based interactive dashboards (Student, Teacher, Parent, Admin) empower stakeholders to observe real-time health, receive actionable alerts, and simulate future interventions.

---

## Slide 1: Title & Team Credentials

### 1. Slide Content & Visual Elements
- **Main Heading:** AI-Driven Academic Risk & Dropout Early-Warning System
- **Subtitle / Project Identity:** Digital Class Twin
- **Presented By:**
  - Altrin Benser A — `962223205010`
  - Jins John J — `962223205032`
  - Jerish Rethna J — `962223205029`
  - Mukhilan S — `962223205040`
- **Supervisor:** Er. Agnes Alex Rathy P, Assistant Professor / IT
- **Institutional Context:** Department of Information Technology, St. Xavier's Catholic College of Engineering
- **Occasion:** Mini Project — Review 2

### 2. Technical Mapping to Codebase
- **Project Structure:** Root directory `Mini-Project/` containing full-stack modules:
  - `backend/app/` — FastAPI microservice with domain-driven modular routers and core twin engines.
  - `client-app/` — React 18 + Vite frontend with role-specific views and simulation harness.
  - `ml-engine/` — Analytical pipeline for feature extraction, threshold-based risk inference, and forecasting.
  - `shared-contracts/` — Inter-service JSON schemas (`eventSchema.json`, `twinSchema.json`, `apiEndpoints.md`).
- **Review 2 Scope:** Delivering an architectural prototype demonstrating functional event ingestion, risk calculation, twin state machines, snapshot storage, and role-based frontend interfaces.

### 3. Presentation Script (What to Say)
> "Good morning respected members of the evaluation committee and our guide, Er. Agnes Alex Rathy ma'am. We are presenting our Review 2 progress for our engineering mini-project titled **'AI-Driven Academic Risk & Dropout Early-Warning System'**, codenamed **Digital Class Twin**.
> 
> Our team comprises Altrin Benser, Jins John, Jerish Rethna, and Mukhilan S from the Department of Information Technology.
> 
> In Review 1, we established our conceptual foundation and literature review. Today, in Review 2, we present our end-to-end working prototype: an event-driven backend built with FastAPI, a normalized relational database schema with SQLAlchemy, explainable risk calculations, digital twin state management, automated alerts, and responsive role-based React dashboards."

### 4. Anticipated Viva Questions & Model Answers
- **Q1.1: Why do you call this a 'Digital Twin' instead of a traditional student database or dashboard?**
  - *Answer:* "A traditional database simply holds historical records passively. A Digital Twin is an active, continuously synchronizing virtual software model that mirrors the operational state of a physical entity. In our system, whenever a physical event occurs—such as a student missing a lecture or scoring low in an internal assessment—the event is immediately ingested, recalculating running features, transitioning the twin's internal state (`stable` $\rightarrow$ `warning` $\rightarrow$ `critical`), preserving immutable snapshots for temporal trajectory analysis, and triggering proactive feedback loops before failure occurs."
- **Q1.2: Who are the primary beneficiaries of this system?**
  - *Answer:* "There are four primary stakeholders: **Students** get transparency into their risk factors and gamified streaks; **Teachers** get class-level heatmaps and high-risk alerts without manual data collation; **Parents** get real-time visibility into attendance and academic health rather than end-of-semester shock; and **Administrators** monitor institutional retention metrics and audit trails."

---

## Slide 2: Abstract, Problem Statement & Objectives

### 1. Slide Content & Visual Elements
- **Abstract Summary:**
  - Traditional systems identify failing students only after semester exam results.
  - Digital Class Twin ingests attendance, assessments, quizzes, and behavioral remarks as discrete events.
  - Computes explainable risk scores and visualizes them on role-based dashboards for students, teachers, parents, and admins.
- **Problem Statement:**
  - *Reactive Identification:* Academic struggle is discovered post-facto when remediation is difficult or impossible.
  - *Siloed & Static Data:* Marks, biometric logs, and conduct remarks live in separate systems without correlation.
  - *Threshold Blindness:* Isolated attendance percentage rules miss underlying downward velocity or sudden grade drops.
  - *Lack of Continuous Monitoring & Actionable Alerts:* No proactive early-warning feedback loop connecting parents and teachers.
- **Objectives:**
  1. Build an event-driven continuous data pipeline for academic, attendance, and behavioral data.
  2. Maintain a synchronized Digital Twin per student showing state, sync status, and snapshot history.
  3. Compute early academic risk categorized into Low, Medium, and High with transparent mathematical explainability.
  4. Predict future performance (GPA / failure probability) and analyze trajectory (`Declining`, `Stable`, `Recovering`).
  5. Provide role-based dashboards with automated alerts and prepare a foundation for what-if intervention testing.

### 2. Technical Mapping to Codebase
- **Event Models:** Defined in `backend/app/models/event.py` (`id`, `child_id`, `event_type`, `payload`, `timestamp`, `processed`).
- **Feature Computation:** Handled in `backend/app/core/feature_engine.py` calculating:
  - `attendance_rate_30d`, `attendance_delta` (velocity comparing current week vs. prior week).
  - `avg_test_score_30d`, `test_score_delta`.
  - `behavior_count_30d`, `volatility_score`.
- **Explainability Payload:** Built in `backend/app/core/risk_engine.py` returning components (`academic`, `attendance`, `behavior`, `composite`).

### 3. Presentation Script (What to Say)
> "Moving to Slide 2: In conventional higher education, dropout risk and course failure are diagnosed post-mortem—after semester exam results are published or when a student is barred from examinations due to attendance shortage. At that stage, counseling or remedial coaching is often too late.
> 
> Furthermore, existing college systems are siloed. Biometric attendance sits in one register, continuous internal assessment (CIA) marks in another, and classroom conduct in teacher notes. Static percentage cutoffs are blind to acceleration: a student dropping rapidly from 95% to 76% in three weeks is in acute distress, yet traditional ERPs raise no flag because 76% is technically above the 75% cutoff.
> 
> To solve this, our objectives for Review 2 are threefold: First, continuously ingest all academic interactions as streaming events. Second, maintain a virtual Digital Twin per student that updates its health status and records temporal snapshots. Third, provide transparent, explainable risk classifications across customized dashboards for teachers, parents, students, and administrators."

### 4. Anticipated Viva Questions & Model Answers
- **Q2.1: Why is explainability essential in an academic early-warning system?**
  - *Answer:* "If an algorithm outputs 'Student A has an 82% risk of dropping out' as a black box, a mentor cannot take targeted action. Our system produces an explainable decomposition: it states that the composite score is 48 because attendance dropped by 18% over the last fortnight and CIA 2 marks dropped to 32/100, while behavioral marks remained normal. This allows the mentor to intervene precisely where the deficiency lies."
- **Q2.2: How do you handle false positives where a student misses class due to genuine medical leave?**
  - *Answer:* "In our design schema (`shared-contracts/eventSchema.json`), events are typed with metadata tags such as `medical_leave`, `on_duty`, or `unexcused_absence`. The event normalizer and rules engine account for authorized leaves before feeding the feature engine, preventing unjustified risk spikes."

---

## Slide 3: Literature Survey, Summary and Research Gap

### 1. Slide Content & Visual Elements
- **Review Scope:** 20 peer-reviewed research papers (2021–2025) across IEEE, Elsevier, Springer, and ACM focusing on Educational Data Mining (EDM), Learning Analytics (LA), Explainable AI (XAI), and Digital Twins.
- **Four-Quadrant Matrix:**
  1. *Major Methods Examined:* Random Forest, Decision Trees, SVM, Logistic Regression, XGBoost, SHAP/LIME explainability, and graph/pathway modeling.
  2. *Key Findings:* Multi-source data (grades + biometric logs + LMS clicks) substantially outperforms single-feature models; early warning prior to midterm exams increases retention by over 30%; explainability is mandatory for pedagogical adoption.
  3. *Research Gaps Identified in Existing Work:*
     - Existing literature relies heavily on static, offline batch datasets (e.g., end-of-semester dumps).
     - Focus is restricted to one-time prediction rather than continuous, event-driven state tracking.
     - Neglects multi-stakeholder integration—parents are almost never included in the loop.
     - Absence of what-if intervention simulation tools.
  4. *Relevance to Our Project:* Digital Class Twin bridges these exact gaps by synthesizing event-driven architecture with digital twin concepts, real-time explainability, automated parent/teacher alerting, and trajectory tracking.

### 2. Literature Survey Summary Table

| # | Author & Year | Publication / Focus | Methodology | Inherent Limitation | How Digital Class Twin Solves It |
|---|---|---|---|---|---|
| 1 | Cagliero et al. (2021) | IEEE Trans. Learning Tech. | Associative classification on exam histories | Static offline mining; no real-time telemetry | Continuous event ingestion on every mark or attendance swipe |
| 2 | Karalar et al. (2021) | Distance Education / Pandemic | Ensemble models (RF, AdaBoost) for LMS logs | Only measures distance LMS clicks; ignores behavior | Ingests multi-modal signals: academics, attendance, and conduct |
| 3 | Park & Yoo (2021) | Educational Technology | Early dropout prediction using university datasets | Single end-of-term prediction score | Dynamic state machine (`stable` $\rightarrow$ `warning` $\rightarrow$ `critical`) with snapshots |
| 4 | Dabhade et al. (2021) | Educational Data Mining | Comparative ML (DT, SVM, NB) | Offline benchmark; lacks user interfaces or notifications | Full stack system with role-based dashboards and automated alerts |
| 5 | Tamada et al. (2022) | Technical Course Dropout | Log analysis with Decision Trees | Rule sets become brittle across semesters | Rolling 30-day feature aggregation with trend velocity detection |
| 6 | Yağcı (2022) | Education & Info Technologies | Supervised ML performance prediction | Institution-specific dataset; no explainability | Transparent weighted breakdown and planned SHAP attribution |
| 7 | Oqaidi et al. (2022) | Higher Education Analytics | Logistic Regression & Decision Trees | Evaluates at semester boundaries only | Event processor runs incrementally on every new event |
| 8 | Segura et al. (2022) | University Dropout Analysis | Student preference & demographic ML | Passive demographic profiling without live intervention | Focuses on actionable classroom behaviors and timely intervention |
| 9 | Katsuragi & Tanaka (2022) | Interpretable ML | Feature importance for dropout prevention | Global feature importance; lacks per-student dynamic insights | Per-student local explainability payload attached to each twin state |
| 10 | Su et al. (2022) | Interactive Learning Environments | Feature engineering on student behaviors | Does not connect predictions to parental notifications | Automated parent alert dispatch with secure parent-child mapping |
| 11 | Plak et al. (2022) | Student Counselling Systems | Early warning system for university mentors | Manual advisor reviews; no automated escalation | Multi-tier severity alerting with automatic resolution triggers |
| 12 | Qin et al. (2023) | Educational Evaluation | Blending subjective remarks with objective marks | Complex manual survey ingestion | Standardized JSON event ingestion for subjective & objective events |
| 13 | Cho et al. (2023) | University Student Retention | Random Forest and Neural Networks | Black-box deep models create faculty distrust | Glass-box formula in current phase; interpretable ML in roadmap |
| 14 | Balcıoğlu & Artar (2023) | Academic Performance | Multi-class classification of grade bands | Static snapshot modeling | Twin snapshot history tracking trajectory direction (`Declining`, `Recovering`) |
| 15 | Nagy & Molontay (2023) | IEEE Access / XAI | SHAP-based personalized intervention planning | Theoretical study; no deployment architecture | Production-ready FastAPI + React architecture with contract schemas |
| 16 | Villar & Andrade (2024) | Supervised ML Comparative | Gradient Boosting vs. Random Forest | Benchmark study without API or client integration | Decoupled client-server architecture with OpenAPI/Swagger standards |
| 17 | Vaarma & Li (2024) | Empirical Higher Ed Study | Longitudinal dropout tracking | Retrospective analysis without live feedback | Real-time session and event tracking |
| 18 | Tiukhova et al. (2024) | Explainable Learning Analytics | Model stability and explainability over time | Found ML explanations fluctuate wildly without baseline anchors | Stable anchored feature engineering combining velocity and levels |
| 19 | Miranda et al. (2024) | Model-Agnostic Interpretability | LIME & SHAP for video/online learning | Constrained to virtual video platforms | Built for physical and hybrid engineering classrooms |
| 20 | Alalawi et al. (2025) | Comprehensive LA Framework | Integrating ML with pedagogical frameworks | High-level conceptual framework without implementation | Working prototype with database models, API routes, and UI |

### 3. Presentation Script (What to Say)
> "On Slide 3, we summarize our extensive literature survey of 20 relevant studies published between 2021 and 2025 across Educational Data Mining, Early Warning Systems, and Explainable AI.
> 
> Our critical synthesis identified four major gaps in current research:
> 1. Most published works operate on offline, retrospective datasets, training models on data collected after the semester concluded.
> 2. They produce one-shot static predictions rather than tracking the dynamic trajectory of a student as daily events occur.
> 3. Existing tools focus exclusively on administrators or counselors, failing to provide role-specific visibility to teachers, students, and especially parents.
> 4. Very few works explore the Digital Twin paradigm in higher education, where a continuous digital replica mirrors student progress and enables what-if simulation.
> 
> Our Digital Class Twin directly addresses these gaps by combining an event-driven architecture, continuous twin state tracking, explainable scoring, and multi-role dashboards."

### 4. Anticipated Viva Questions & Model Answers
- **Q3.1: Why did you survey 20 recent papers (2021–2025) instead of older classical papers?**
  - *Answer:* "While foundational papers like Romero & Ventura (2010) or Arnold & Pistilli's Course Signals (2012) established Educational Data Mining, recent research from 2021 to 2025 reflects modern developments in Explainable AI (SHAP), streaming data architectures, and the post-pandemic shift toward continuous, multi-modal student tracking."
- **Q3.2: What is the single biggest research gap that your project addresses?**
  - *Answer:* "The transition from **batch-oriented retrospective prediction** to **event-driven continuous state tracking**. Instead of running an algorithm once a month, our system updates the student's digital twin on every single event, capturing downward momentum before it converts into irreversible academic failure."

---

## Slide 4: Proposed System Architecture

### 1. Slide Content & Visual Elements
- **System Architecture Pipeline:**
  ```
  [Events: Attendance, Marks, Behavior]
                   │
                   ▼
       [FastAPI Event Ingestion API]
                   │
                   ▼
        [Normalizer & Rules Engine]
                   │
                   ▼
         [Feature Engine (30d)]
                   │
                   ▼
      [Risk Engine (Composite Score)]
             │               │
             ▼               ▼
     [Twin Engine]    [Alert Engine]
     (State & Snapshot) (Severity & Targets)
             │               │
             └───────┬───────┘
                     ▼
      [SQLite / SQLAlchemy Database]
                     │
                     ▼
       [REST API Layer + JWT Auth]
                     │
                     ▼
      [React + Vite Role Dashboards]
   (Student / Teacher / Parent / Admin)
  ```
- **Module Partitioning Table:**

| Component | Directory | Core Technologies | Primary Responsibility |
|---|---|---|---|
| **Backend Service** | `backend/app/` | FastAPI, Uvicorn, Pydantic, Python 3.11+ | Ingestion endpoints, JWT auth, business logic, ORM access |
| **Database Layer** | `backend/app/db/` | SQLAlchemy ORM, SQLite / PostgreSQL, Alembic | Relational persistence, constraints, foreign key mappings |
| **ML Engine** | `ml-engine/` | NumPy, Pandas, Scikit-learn (roadmap) | Feature extraction, trajectory analysis, forecasting |
| **Frontend Client** | `client-app/` | React 18, Vite, React Router, Axios, Lucide Icons | Responsive role dashboards, simulation UI, twin visualization |
| **Shared Contracts** | `shared-contracts/` | JSON Schema, Markdown specification | Formal data contracts (`eventSchema`, `twinSchema`, API specs) |

### 2. Technical Mapping to Codebase
- **FastAPI Application Entry:** `backend/app/main.py` binds CORS middleware, registers routers (`auth`, `events`, `twins`, `insights`, `alerts`, `dashboard`, `admin`, `sessions`), and initializes database tables via `Base.metadata.create_all(bind=engine)`.
- **Event Flow:**
  1. POST `/api/v1/events/` receives an event payload.
  2. `backend/app/core/event_normalizer.py` validates payload schema and normalizes types.
  3. `backend/app/core/event_rules.py` applies domain bounds (e.g., marks $0 \le score \le max$).
  4. `backend/app/core/feature_engine.py` re-aggregates student feature metrics over rolling windows.
  5. `backend/app/core/risk_engine.py` evaluates the composite risk score and outputs factor breakdowns.
  6. `backend/app/core/twin_engine.py` inspects current twin vs. previous state; if state changed, instantiates a `TwinSnapshot`.
  7. `backend/app/core/alert_engine.py` generates targeted alerts if risk worsened or breached safety thresholds.
- **Client Consumption:** `client-app/src/api/axios.js` injects Bearer JWT tokens in request headers and interacts with REST endpoints.

### 3. Presentation Script (What to Say)
> "Slide 4 illustrates our Proposed System Architecture.
> 
> The architecture follows a layered, client-server event-driven pattern:
> At the left boundary, raw events—such as attendance punches, assessment scores, or behavioral infractions—enter our FastAPI backend through secure REST endpoints.
> 
> The event is first validated by the Normalizer and Rules engine to ensure schema integrity and sanitize bounds. Next, the Feature Engine recomputes rolling 30-day indicators, such as attendance percentages and grade deltas.
> 
> The Risk Engine then calculates a composite risk score and generates an explainable breakdown. This feeds directly into two parallel engines:
> 1. The **Twin Engine**, which updates the student's live digital state and captures an immutable historical snapshot if the state changes.
> 2. The **Alert Engine**, which evaluates risk escalation and generates notifications targeted to teachers, parents, or students.
> 
> All state is persisted via SQLAlchemy ORM. Finally, our REST API serves this state through role-based endpoints protected by JWT authentication to our React frontend dashboards."

### 4. Anticipated Viva Questions & Model Answers
- **Q4.1: Why did you choose FastAPI over Flask or Django?**
  - *Answer:* "FastAPI offers high performance built on ASGI (`uvicorn`), native asynchronous request handling, automatic request validation via Pydantic models, and auto-generated OpenAPI/Swagger documentation at `/docs`, which accelerated frontend-backend integration using shared contracts."
- **Q4.2: How does the system handle high event ingestion concurrency if an entire class punches biometric attendance simultaneously?**
  - *Answer:* "FastAPI handles asynchronous concurrent I/O natively. Events are written to the database with a `processed = False` flag and picked up in sequence, decoupling ingestion acknowledgment from analytical calculations and preventing request blocking."

---

## Slide 5: Design Methodology (Model, Algorithm, DB Design)

### 1. Slide Content & Visual Elements
- **Six-Step Event Processing Algorithm:**
  ```
  Step 1: Receive typed event (attendance_marked, marks_uploaded, behavior_incident)
  Step 2: Validate against JSON schema, normalize values, and store in Event table
  Step 3: Recompute student statistical features (rolling 30-day rates & deltas)
  Step 4: Compute composite risk score:
          Risk Score = (0.5 × Academic) + (0.3 × Attendance) + (0.2 × Behavior)
  Step 5: Determine Twin State:
          • Score ≥ 75  ➔ Low Risk   (Twin State: stable)
          • 50 ≤ Score < 75 ➔ Moderate (Twin State: warning)
          • Score < 50  ➔ High Risk  (Twin State: critical)
          Persist TwinSnapshot if state or score bracket transitions.
  Step 6: Raise targeted Alert if risk escalated, attaching explainability payload.
  ```
- **Mathematical Risk Model:**
  $$\text{Composite Score} = (0.50 \times \text{Academic Score}) + (0.30 \times \text{Attendance Score}) + (0.20 \times \text{Behavior Score})$$
  - Where:
    - $\text{Academic Score} = \text{Average percentage across CIA tests and lab practicals } [0-100]$.
    - $\text{Attendance Score} = \left(\frac{\text{Classes Attended}}{\text{Classes Conducted}}\right) \times 100$.
    - $\text{Behavior Score} = \max(0, 100 - (10 \times \text{Cumulative Severity Deductions}))$.
- **Database Entity Relationship Design:**
  - *Users & Access:* `User`, `UserSession`, `ParentChildMap`, `TeacherClassMap`
  - *Events & Features:* `Event`, `StudentFeatures`
  - *Risk, Twin & Insights:* `DigitalTwin`, `TwinSnapshot`, `RiskScore`, `Alert`, `InsightReview`

### 2. Technical Mapping to Codebase
- **Algorithm Code:** `backend/app/core/event_processor.py` orchestrates the pipeline:
  ```python
  def process_single_event(db: Session, event: Event):
      # 1. Normalize
      normalized = normalize_event(event)
      # 2. Features
      features = update_student_features(db, event.child_id)
      # 3. Metrics
      metrics = compute_twin_metrics(features)
      # 4. Risk & State
      risk = calculate_risk_score(metrics)
      # 5. Twin Snapshot & Alert
      update_twin_and_snapshot(db, event.child_id, risk, metrics)
  ```
- **Mathematical Weights:** In `backend/app/core/risk_engine.py`:
  - `WEIGHT_ACADEMIC = 0.50`
  - `WEIGHT_ATTENDANCE = 0.30`
  - `WEIGHT_BEHAVIOR = 0.20`
- **Database Schema Models:** Located in `backend/app/models/`:
  - `user.py` — handles credentials, hashed passwords, roles (`student`, `teacher`, `parent`, `admin`).
  - `twin.py` — `DigitalTwin` table storing `child_id`, `state` (`stable`, `warning`, `critical`), `overall_score`, `academic_score`, `attendance_score`, `behavior_score`, `sync_status`.
  - `snapshot.py` — `TwinSnapshot` table with foreign key to twin, preserving historical timestamps for longitudinal charts.
  - `alert.py` — `Alert` table storing `recipient_id`, `severity`, `title`, `message`, `category`, `status` (`unread`, `read`, `resolved`).
  - `mapping.py` — `ParentChildMap` and `TeacherClassMap` enforcing data boundary ownership.

### 3. Presentation Script (What to Say)
> "Slide 5 details our Design Methodology across three pillars: our operational algorithm, our mathematical scoring model, and our database schema.
> 
> Our algorithm executes a deterministic 6-step pipeline for every event received. When an event enters, it is validated and normalized. The feature engine recomputes 30-day statistical aggregates.
> 
> Next, our Risk Engine evaluates the composite score using our weighted formulation:
> Academic performance carries a 50% weighting, attendance accounts for 30%, and behavioral conduct contributes 20%.
> 
> The resulting score classifies the student into one of three distinct twin states:
> A score of 75 or above denotes Low Risk with a **Stable** twin state. Between 50 and 74 indicates Moderate Risk with a **Warning** state. Below 50 represents High Risk with a **Critical** twin state.
> 
> Crucially, our system does not overwrite past history. Whenever a student transitions between risk brackets, the Twin Engine records an immutable **TwinSnapshot**. This enables our frontend to render historical trajectory graphs over weeks and months.
> 
> Our relational database, implemented with SQLAlchemy ORM and Alembic migrations, cleanly partitions entities across Users, Events, Features, Twins, Snapshots, and Access Control mappings."

### 4. Anticipated Viva Questions & Model Answers
- **Q5.1: Why did you assign 50% to academics, 30% to attendance, and 20% to behavior in your formula?**
  - *Answer:* "In university engineering programs, internal continuous assessment marks have the highest statistical correlation with semester exam failure (accounting for 50%). Attendance is assigned 30% because falling below the mandatory 75% university cutoff leads directly to exam debarment. Behavior is assigned 20% to capture disciplinary warnings, unexcused lab absences, and assignment submission lapses. In our next phase (Review 3), these static weights will be refined using feature coefficients learned by logistic regression or random forest models on historical institutional data."
- **Q5.2: Why only take a snapshot when the state or risk changes, rather than on every event?**
  - *Answer:* "Taking a snapshot on every minor attendance punch creates database bloat with redundant data points. By storing a snapshot on state or score bracket transitions, we achieve an optimal balance: a compact, clean timeline of meaningful trajectory changes without unnecessary storage overhead."

---

## Slide 6: Implementation Details (Framework, Design)

### 1. Slide Content & Visual Elements
- **Full-Stack Technology Matrix:**
  - *Frontend:* React 18, Vite, Axios, React Router v6, Lucide React, Custom CSS Design System
  - *Backend:* Python 3.11+, FastAPI, Uvicorn ASGI Server, Pydantic v2 schemas
  - *Database & ORM:* SQLite (for local development/testing), PostgreSQL driver ready, SQLAlchemy ORM, Alembic migrations
  - *Security & Auth:* JWT (JSON Web Tokens), passlib with bcrypt password hashing, role-based route guards
  - *ML Engine (Module):* Python, NumPy, Pandas; rule-based scoring engine with scikit-learn scaffolding for model training
  - *Tooling & Verification:* Git, GitHub, Swagger UI (`/docs`), ReDoc (`/redoc`), Postman, `verify_digital_twin.py`
- **Project Folder Structure:**
  ```
  Mini-Project/
  ├── backend/
  │   ├── app/
  │   │   ├── core/       # Event processor, risk, twin, alert engines
  │   │   ├── models/     # SQLAlchemy DB entities
  │   │   ├── routers/    # auth, events, twins, insights, alerts, dashboard...
  │   │   ├── schemas/    # Pydantic validation schemas
  │   │   └── main.py     # FastAPI application factory
  ├── client-app/
  │   ├── src/
  │   │   ├── api/        # Axios interceptors & endpoint services
  │   │   ├── pages/      # Student, Teacher, Parent, Admin views
  │   │   ├── simulations/# Student/parent demo profiles & semester data
  │   │   └── layouts/    # Role-based navigation headers & sidebars
  ├── ml-engine/          # Feature extractor, risk engine, forecasting
  ├── shared-contracts/   # JSON schemas and API documentation
  └── verify_digital_twin.py # Automated integration test harness
  ```
- **Role-Based Dashboards Implemented:**
  - **Student View:** Dashboard, Digital Twin, Risk Insights, Alerts, Submit Event, Gamified Rewards, Profile.
  - **Teacher View:** Dashboard, Class Overview Heatmap, Student Risk Hub, Profile.
  - **Parent View:** Dashboard, Child Twin State, Academic Reports, Teacher Communication.
  - **Admin View:** System Overview, Audit Logging, System Health Monitor.

### 2. Technical Mapping to Codebase
- **Router Layer:** Implemented in `backend/app/routers/`:
  - `auth.py` — Login endpoint `/api/v1/auth/login` validating credentials and issuing JWT tokens.
  - `events.py` — Ingestion endpoint `/api/v1/events/` supporting event creation.
  - `twins.py` — Digital twin queries `/api/v1/twins/{child_id}` and history `/api/v1/twins/{child_id}/history`.
  - `insights.py` — Factor analysis and review submissions.
  - `alerts.py` — Fetching unread alerts and marking alerts as resolved.
  - `dashboard.py` — Aggregated metrics for teacher and student dashboards.
  - `admin.py` — System statistics, event counts, active user sessions.
- **Frontend Routing & Security:** Defined in `client-app/src/App.jsx` using `react-router-dom` with role validation verifying `user.role` before rendering protected routes.

### 3. Presentation Script (What to Say)
> "Moving to Slide 6: This slide outlines the implementation architecture and technology stack of our codebase.
> 
> Our backend is written in Python using FastAPI, structured cleanly into routers, core analytical engines, database models, and schemas.
> 
> On the frontend, we use React with Vite for rapid development and clean component modularity. We implemented protected routing with role-based access control.
> 
> When a user logs in, our `/auth/login` endpoint validates credentials and returns a signed JWT containing their user ID and role. The frontend Axios client automatically attaches this token to the Authorization header of all subsequent API requests.
> 
> We have built distinct dashboard interfaces tailored to each stakeholder:
> The student views their personal twin, badges, and breakdown;
> The teacher monitors an aggregated class risk hub with red-amber-green distribution;
> The parent tracks their ward's continuous status and receives early alerts;
> And the administrator oversees system health and audit logs.
> 
> All data interfaces between backend and frontend are governed by our formal contracts in `shared-contracts/`."

### 4. Anticipated Viva Questions & Model Answers
- **Q6.1: How do you prevent a parent or student from accessing another student's digital twin?**
  - *Answer:* "We implemented strict ownership verification in `backend/app/core/ownership.py`. When a request arrives at `/twins/{child_id}`, the middleware extracts the requester's ID and role from the decoded JWT. If the role is `student`, they can only access their own record. If the role is `parent`, the query verifies that a valid relationship exists in the `ParentChildMap` table. Teachers can only access students enrolled in their assigned classes via `TeacherClassMap`. Unauthorized requests are rejected with a 403 Forbidden status."
- **Q6.2: What is the purpose of the `shared-contracts/` folder?**
  - *Answer:* "It implements a contract-first development methodology. By defining `eventSchema.json` and `twinSchema.json`, both frontend and backend developers work against a single source of truth for JSON payloads, eliminating serialization mismatches and integration bugs."

---

## Slide 7: Implementation Module (Sample Output)

### 1. Slide Content & Visual Elements
- **Six Prototype Screens Displayed:**
  1. *Student Dashboard:* High-level overview displaying student identity, semester standing, current GPA, biometric attendance percentage, quick risk indicator badge, and recent notifications.
  2. *Digital Twin — Semester Progress:* Interactive visual twin showing three core gauges: Academic Score (94%), Attendance Score (91%), and Behavior Score (98%). Visual progress bar tracking semester timeline with state badge (`STABLE / LOW RISK`).
  3. *Badges & Gamified Progress:* Gamification elements including Level title (e.g., *Level 5: Top 1%*), XP points, Biometric Attendance Streak (e.g., *32 Days*), Lab Execution Streak, and unlocked milestone badges.
  4. *Alerts Center:* Categorized notifications color-coded by severity (Critical / Warning / Info) with direct cause descriptions (e.g., *Attendance fallen below 75% cutoff in Data Structures*).
  5. *Submit Event Interface:* Ingestion form allowing simulated submission of attendance logs, quiz scores, or behavioral remarks to demonstrate live pipeline execution.
  6. *User Profile & Settings:* Personal contact details, parent mapping, academic advisor assignment, and linked account overview.

### 2. Technical Mapping to Codebase
- **Frontend Page Components:** In `client-app/src/pages/`:
  - `student/StudentDashboard.jsx` — orchestrates top cards, quick links, and activity feed.
  - `student/DigitalTwinView.jsx` — renders the live twin gauges and historical snapshot timeline.
  - `student/RewardsView.jsx` — gamified reward badges generated via `client-app/src/simulations/studentProfiles.js`.
  - `student/AlertsView.jsx` — fetches alerts and allows marking them as acknowledged.
  - `student/SubmitEventView.jsx` — dispatches live POST events to `/api/v1/events/`.
- **Simulation Harness:** Located in `client-app/src/simulations/`:
  - `studentProfiles.js` — realistic engineering profiles for team members (Altrin: High Performer / Low Risk; Rethna: Retest / Attendance Warning; Jerish & Jins: On Track).
  - `engineeringSemesters.js` — detailed course subjects, internal assessment test (IAT 1, IAT 2) marks, lab practicals, and 75% attendance cutoff boundaries.
  - `llmInsightsEngine.js` — automated natural language explanation generator simulating pedagogical advice based on factor metrics.

### 3. Presentation Script (What to Say)
> "Slide 7 presents live screenshots captured from our running prototype in demo and simulation mode.
> 
> Screen 1 shows the **Student Dashboard**, giving students an immediate summary of their GPA, attendance, and current risk status.
> 
> Screen 2 shows the core **Digital Twin View**. Here, the twin is rendered through three live dials representing Academic performance, Attendance ratio, and Behavioral standing, alongside the composite state indicator.
> 
> Screen 3 highlights our **Gamification and Rewards Module**. To prevent early warning systems from feeling purely punitive, we incorporate positive reinforcement: students maintain attendance streaks, earn XP for clearing exams, and unlock milestone badges when staying above the 75% threshold.
> 
> Screen 4 displays the **Alerts Center**, where high-priority notifications are delivered with clear cause-and-effect explanations.
> 
> Screen 5 is our **Event Submission Interface**, which allows faculty or simulated systems to inject classroom events into the pipeline.
> 
> Finally, Screen 6 shows the **Profile View** confirming user details and linked parent-teacher associations."

### 4. Anticipated Viva Questions & Model Answers
- **Q7.1: Can you demonstrate what happens on screen when an event is submitted?**
  - *Answer:* "Yes. When a faculty member submits an absence event via Screen 5, the event is posted to the backend. The feature engine decrements the 30-day attendance rate; if the composite score dips below 75, the twin status badge immediately changes from green 'Stable' to amber 'Warning', and a new alert appears in the Alerts Center on Screen 4."
- **Q7.2: Why did you include gamification (XP and Badges) in an academic risk system?**
  - *Answer:* "Behavioral psychology shows that students engage more proactively with software when they receive positive feedback. Badges like '32-Day Attendance Streak' and 'IAT 1 Distinction' incentivize students to maintain healthy academic habits before risk occurs, making the system engaging rather than purely disciplinary."

---

## Slide 8: Conclusion & Future Work

### 1. Slide Content & Visual Elements
- **Review 2 Deliverables Achieved:**
  - Designed and implemented a functional end-to-end prototype: Events $\rightarrow$ Features $\rightarrow$ Risk $\rightarrow$ Digital Twin $\rightarrow$ Alerts $\rightarrow$ Multi-role Dashboards.
  - Successfully demonstrated explainable risk scoring with twin state transitions and snapshot history.
  - Completed secure JWT-based authentication and role-based access for Student, Teacher, Parent, and Admin roles.
  - Validated pipeline execution using automated test scripts (`verify_digital_twin.py`).
- **Honest Engineering Status:**
  - Current risk engine operates on a deterministic, weighted mathematical model (glass-box baseline).
  - Frontend currently demonstrates robust simulated engineering student profiles while live backend endpoints are verified via Swagger and test scripts.
- **Future Roadmap (Review 3 & Final Semester):**
  - *Phase 1 (Machine Learning Model):* Train supervised classification models (Random Forest, XGBoost) and regression models for GPA forecasting on historical institutional data.
  - *Phase 2 (What-If Intervention Simulator):* Build a 'Shadow Twin' sandbox allowing counselors to test scenarios (e.g., *'If the student attends 100% of classes for the next 3 weeks and scores 70 on IAT 2, does their risk drop to Low?'*).
  - *Phase 3 (Closed-Loop Calibration):* Automatically evaluate prediction accuracy against actual semester outcomes to calibrate model weights over time.
  - *Phase 4 (Production Deployment):* Transition from SQLite to PostgreSQL, containerize with Docker, and deploy to cloud hosting.

### 2. Technical Mapping to Codebase
- **Baseline Test Script:** `verify_digital_twin.py` proves end-to-end twin pipeline logic using SQLite:
  - Injects Student 1 (high marks, present) $\rightarrow$ Low Risk, high predicted GPA.
  - Injects Student 2 (low marks, absent) $\rightarrow$ High Risk, low predicted GPA.
- **ML Engine Scaffolding:** `ml-engine/forecasting_engine.py` contains the formula:
  $$\text{Predicted GPA} = (0.7 \times \text{Academic Average}) + (0.3 \times \text{Attendance Ratio})$$
  Ready to be replaced with a scikit-learn regressor once training data is compiled.

### 3. Presentation Script (What to Say)
> "In conclusion, on Slide 8: For Review 2, our team set out to construct a complete, working architectural foundation for the Digital Class Twin.
> 
> We have successfully delivered an end-to-end functional prototype: classroom events are ingested, features are aggregated, risk is computed transparently, the digital twin updates its state, snapshots are stored, and role-based dashboards reflect live academic status.
> 
> We are transparent about our current implementation status: our risk engine is currently driven by our explainable, weighted rule model. This was an intentional engineering decision to establish an interpretable baseline and validate the full software pipeline before introducing complex machine learning algorithms.
> 
> For Review 3 and our final semester phase, our roadmap focuses on four key extensions:
> First, training supervised ML classifiers and regression models using scikit-learn.
> Second, implementing our **What-If Intervention Simulator**, allowing counselors to test the outcome of proposed remedies on a shadow twin before recommending them.
> Third, closed-loop calibration against actual semester results.
> And fourth, deploying our stack on PostgreSQL and containerized cloud infrastructure.
> 
> Thank you, and we are now ready for your questions."

### 4. Anticipated Viva Questions & Model Answers
- **Q8.1: Why did you implement a rule-based risk model first instead of training an ML model right away?**
  - *Answer:* "In standard software and ML engineering, the gold standard methodology is to establish a deterministic baseline and build the full data ingestion, API, and UI pipeline first. Without a robust pipeline, an ML model has no data to ingest and nowhere to deliver predictions. Having validated the complete pipeline in Review 2, we can now plug in trained ML models seamlessly in `ml-engine/` without modifying our backend API or frontend dashboards."
- **Q8.2: How will the What-If Simulator work technically?**
  - *Answer:* "The What-If Simulator will clone the student's current digital twin state into a transient 'Shadow Twin' in memory. A counselor can adjust hypothetical parameters—such as adding 15 attended classes or setting target marks for IAT 2. The feature and risk engines run over this hypothetical state, projecting the resulting risk score and GPA trajectory without altering the student's actual database records."

---

## Slide 9: References

### 1. Slide Content & Visual Elements
- **Comprehensive Academic Citations:** 20 peer-reviewed research papers (2021–2025) categorized into core domains:
  1. *Educational Data Mining & Dropout Prediction:*
     - Cagliero et al. (2021) — *Predicting Student Academic Performance by Means of Associative Classification*
     - Karalar et al. (2021) — *Predicting Students at Risk of Academic Failure Using Ensemble Model*
     - Park & Yoo (2021) — *Early Dropout Prediction in Online Learning of University Using ML*
     - Dabhade et al. (2021) — *Educational Data Mining for Predicting Students’ Academic Performance*
     - Tamada et al. (2022) — *Predicting Students at Risk of Dropout in Technical Course Using LMS Logs*
     - Yağcı (2022) — *Educational Data Mining: Prediction of Students’ Academic Performance*
     - Oqaidi et al. (2022) — *Towards a Students’ Dropout Prediction Model in Higher Education Institutions*
     - Segura et al. (2022) — *Machine Learning Prediction of University Student Dropout*
     - Cho et al. (2023) — *A Study on Dropout Prediction for University Students Using Machine Learning*
     - Balcıoğlu & Artar (2023) — *Predicting Academic Performance of Students with Machine Learning*
     - Villar & Andrade (2024) — *Supervised Machine Learning Algorithms for Predicting Student Dropout*
     - Vaarma & Li (2024) — *Predicting Student Dropouts with Machine Learning: An Empirical Study*
  2. *Explainable AI (XAI) & Interpretability:*
     - Katsuragi & Tanaka (2022) — *Dropout Prediction by Interpretable Machine Learning Model*
     - Nagy & Molontay (2023) — *Interpretable Dropout Prediction: Towards XAI-Based Personalized Intervention*
     - Tiukhova et al. (2024) — *Explainable Learning Analytics: Assessing the Stability of Success Prediction*
     - Miranda et al. (2024) — *Model-Agnostic Interpretability on the Prediction of Academic Performance*
  3. *Early Warning Systems & Pedagogical Frameworks:*
     - Plak et al. (2022) — *Early Warning Systems for More Effective Student Counselling in Higher Education*
     - Su et al. (2022) — *Applying Machine Learning Technologies to Explore Students’ Learning Features*
     - Qin et al. (2023) — *Early Warning of Student Performance With Integration of Elements*
     - Alalawi et al. (2025) — *An Extended Learning Analytics Framework Integrating ML and Pedagogy*

### 2. Presentation Script (What to Say)
> "On Slide 9, we list our primary research references. Our project architecture and analytical models are grounded in 20 peer-reviewed papers published between 2021 and 2025 in leading international journals and IEEE conferences.
> 
> These references span three vital domains:
> First, Educational Data Mining methodologies for early dropout identification;
> Second, Explainable AI frameworks, which guided our transparent scoring and factor attribution design;
> And third, contemporary Learning Analytics frameworks that emphasize multi-stakeholder intervention.
> 
> This literature confirms the validity and necessity of our project direction."

---

## Master Viva Voce Defense Playbook: Top 15 Review Questions

### Q1: Is your machine learning model currently trained on real university data?
**Confident Answer:**  
*"In this Review 2 milestone, our risk engine is powered by our explainable weighted baseline model ($0.5\text{ Academic} + 0.3\text{ Attendance} + 0.2\text{ Behavior}$). We intentionally established this deterministic baseline to validate our full-stack event pipeline, snapshot engine, and role dashboards first. The ML engine folder (`ml-engine/`) is structured with feature extractors and regression scaffolding, and training on historical institutional datasets using Scikit-Learn (Random Forest and Logistic Regression) is our primary milestone for Review 3."*

### Q2: What exact formula determines the risk level?
**Confident Answer:**  
*"$$\text{Score} = (0.50 \times \text{Academic}) + (0.30 \times \text{Attendance}) + (0.20 \times \text{Behavior})$$  
- $\text{Score} \ge 75$: **Low Risk** $\rightarrow$ Twin State: `stable`  
- $50 \le \text{Score} < 75$: **Moderate Risk** $\rightarrow$ Twin State: `warning`  
- $\text{Score} < 50$: **High Risk** $\rightarrow$ Twin State: `critical`"*

### Q3: How do you calculate the 30-day rolling attendance feature?
**Confident Answer:**  
*"In `feature_engine.py`, we query the `Event` table for events matching `event_type == 'attendance_marked'` for that student within a 30-day window (`datetime.utcnow() - timedelta(days=30)`). We calculate the ratio of `present == True` to total attendance events multiplied by 100. We also compute `attendance_delta` by comparing the last 7 days against the preceding 7 days to detect sudden downward velocity."*

### Q4: How is data security and privacy enforced between parents, teachers, and students?
**Confident Answer:**  
*"We implement Role-Based Access Control (RBAC) backed by JWT tokens. When a user authenticates, their role and user ID are encoded into the JWT. On every protected endpoint, our `ownership.py` dependency checks access permissions: a student can only view their own twin; parents can only view children linked in `ParentChildMap`; teachers can only view students in their assigned sections in `TeacherClassMap`. Unauthorized requests return HTTP 403 Forbidden."*

### Q5: How do you prevent alert spamming if a student's risk fluctuates daily?
**Confident Answer:**  
*"In `backend/app/core/alert_engine.py`, we implement duplicate suppression and state-transition triggers. An alert is only generated when the student's risk bracket transitions (e.g., from `stable` to `warning` or `warning` to `critical`). If consecutive events keep the student in the same risk state, duplicate alerts are suppressed. Furthermore, when the student's score recovers back above 75, existing open alerts are automatically resolved."*

### Q6: How does the system handle a newly admitted student with zero initial data (Cold Start problem)?
**Confident Answer:**  
*"When a new student is enrolled, their Digital Twin is initialized with a default `stable` state and baseline scores of 100 until sufficient classroom events accumulate. We have designed an 'Initializing' state in our schema roadmap where confidence metrics reflect data volume: predictions carry a low confidence tag until at least 10 events are recorded."*

### Q7: What database are you using, and is it production-ready?
**Confident Answer:**  
*"For our local development and Review 2 prototype, we use SQLite managed through SQLAlchemy ORM and Alembic migrations. Because SQLAlchemy abstracts database operations, switching to production PostgreSQL requires only changing the `DATABASE_URL` environment variable in `backend/app/core/config.py`. The models and schemas remain completely identical."*

### Q8: What happens if an ingested event has invalid or corrupted data?
**Confident Answer:**  
*"The event passes through `event_normalizer.py` and `event_rules.py`. If required fields are missing or values fall outside logical boundaries (such as a negative score or a mark exceeding maximum marks), the validator rejects the payload with an HTTP 422 Unprocessable Entity error and logs an error reason, preventing database corruption."*

### Q9: Can you explain the role of TwinSnapshots?
**Confident Answer:**  
*"A `TwinSnapshot` is an immutable historical record saved in the database whenever a student's twin changes risk state or score bracket. Instead of storing an unbounded log of every micro-event, snapshots record the timestamped composite score, academic score, attendance score, and state. This enables our frontend to render clean longitudinal trajectory graphs over time."*

### Q10: How does your system differ from standard university ERP software like CAMU or TCS iON?
**Confident Answer:**  
*"Commercial university ERPs act as passive digital ledgers: attendance is stored for billing and hall tickets, and marks are recorded for transcript generation. They do not run real-time event-driven analytics, they lack digital twin continuous synchronization, they do not explain the causal factors behind academic decline, and they offer no what-if simulation for counselor interventions."*

### Q11: What is the What-If Simulator planned for Review 3?
**Confident Answer:**  
*"The What-If Simulator will allow academic mentors to clone a student's current twin into a transient 'Shadow Twin' and simulate potential interventions. For example, a counselor can simulate: 'If this student attends all 20 remaining lectures and scores 75% in IAT 2, will their attendance exceed the 75% university eligibility cutoff?' The simulation computes the projected twin state without altering the live database."*

### Q12: How are parents notified about their child's academic risk?
**Confident Answer:**  
*"When an event causes a student's twin to enter `warning` or `critical` state, the alert engine queries `ParentChildMap` to find the associated parent account and creates a high-priority alert. In our web application, the parent sees this immediately upon logging in, along with an explanation of the root cause (e.g., low attendance in specific subjects). Email and SMS webhook notifications are on our roadmap."*

### Q13: What testing have you performed on the codebase?
**Confident Answer:**  
*"We implemented an automated verification script, `verify_digital_twin.py`, which sets up a test database, injects multi-student event sequences (high-performing student vs. at-risk student), executes the pipeline, and asserts that risk levels, GPA projections, and twin states match expected values. In addition, all REST endpoints have been tested interactively via FastAPI's interactive Swagger UI at `/docs`."*

### Q14: How does the system handle subject-wise attendance versus aggregate attendance?
**Confident Answer:**  
*"In our event schema (`eventSchema.json`), attendance events include a `subject_code` attribute in the payload. While our composite score currently aggregates overall institutional attendance to match university board requirements, the feature engine maintains subject-level aggregates to pinpoint specific course shortages."*

### Q15: What are the specific contributions of each team member?
**Confident Answer:**  
- **Altrin Benser A:** System Architecture, FastAPI Backend Pipeline, Twin Engine & Snapshot state machine.  
- **Jins John J:** REST API Router implementation, Authentication & JWT security, Role-Based Access Controls.  
- **Jerish Rethna J:** Database Schema Design, SQLAlchemy ORM modeling, Event Normalizer & Rules Engine.  
- **Mukhilan S:** React Frontend Dashboards, UI/UX Design System, Simulation profiles & integration verification.

---

## Live Demo Execution Cheat-Sheet

Follow these exact steps if the review examiners request a live demonstration:

### Step 1: Start the Backend Service
Open a terminal in `Mini-Project/backend`:
```powershell
# Navigate to backend directory
cd "c:\c\sxcce\Mini Project\2nd review\Mini-Project\backend"

# Start FastAPI server with live reload
uvicorn app.main:app --reload --port 8000
```
- Open browser to **`http://127.0.0.1:8000/docs`** to demonstrate Swagger UI and active endpoints.

### Step 2: Start the Frontend Client
Open a second terminal in `Mini-Project/client-app`:
```powershell
# Navigate to client directory
cd "c:\c\sxcce\Mini Project\2nd review\Mini-Project\client-app"

# Launch Vite development server
npm run dev
```
- Open browser to **`http://localhost:5173`** to demonstrate role-based dashboards and simulation profiles.

### Step 3: Run the Pipeline Test Verification Script
Open a third terminal in `Mini-Project`:
```powershell
# Navigate to Mini-Project directory
cd "c:\c\sxcce\Mini Project\2nd review\Mini-Project"

# Run automated twin verification
python verify_digital_twin.py
```
- Highlights the automated verification of student event injection, twin state calculation, risk evaluation, and predicted GPA.
