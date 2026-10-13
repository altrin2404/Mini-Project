# Claude Prompt — Accurate Review 2 PPT

Copy everything inside the block below into Claude.

```
You are an expert academic presentation designer. Create a professional PowerPoint (.pptx) for our engineering mini-project "Review 2". Use ONLY the facts below. Do not invent results, accuracy numbers, datasets, users, or citations. Where a fact is not given, write "[FILL]".

==================== PROJECT FACTS (VERIFIED FROM OUR CODE) ====================

TITLE: Digital Class Twin — An Event-Driven Digital Twin for Early Student Risk Prediction
TEAM: Altrin, Jins, Jerish, Mukhilan, Rethna  (register numbers, guide, college, year: [FILL])

PROBLEM
- Student risk (attendance shortage, failing internals, behavior issues) is noticed too late.
- Data is scattered across attendance, internal tests and behavior records.
- Existing tools are reactive and do not explain why a student is at risk.

OBJECTIVES
- Build a continuously updated virtual profile (Digital Twin) per student.
- Compute an explainable risk score and twin state.
- Raise alerts automatically.
- Provide role-based dashboards for Student, Teacher, Parent, Admin.

TECH STACK
- Backend: Python, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic, Alembic migrations, SQLite (dev database; PostgreSQL driver included for later), CORS enabled for the React app.
- Auth: JWT access tokens, password hashing utilities (passlib/bcrypt), role-based access, session tracking, ownership checks (parent-child, teacher-class).
- Frontend: React + Vite, Axios API layer, React Router, role-based routes.
- ML engine (separate module): Python, NumPy, scikit-learn.
- Tools: Git/GitHub, Swagger UI at /docs.

BACKEND ARCHITECTURE (folders: backend/app/{routers, core, models, schemas, db})
- Routers: auth, profile, events, twins, dashboard, admin, insights, alerts, linked_accounts, sessions, system.
- Core logic: event_normalizer, event_rules, event_processor, feature_engine, twin_aggregation, twin_metrics, twin_trends, twin_engine, risk_engine, alert_engine, session_tracker, security, token, ownership.
- Database models: User, Event, StudentFeatures, RiskScore, DigitalTwin, TwinSnapshot, Alert, InsightReview, ParentChildMap, TeacherClassMap, UserSession.

EVENT PIPELINE (designed flow in event_processor.py)
1. Unprocessed events are read from the Event table in time order.
2. Event is normalized.
3. Student features are updated (feature_engine).
4. Digital Twin is fetched, or created if missing.
5. Twin metrics (academic, attendance, behavior scores, 0-100) are computed.
6. Risk engine computes the risk level and explanation.
7. A TwinSnapshot is saved when the risk level changes.
8. Alert engine is triggered on a state change.
9. Event is marked processed. A failing event is auto-skipped with an error note.

FEATURES COMPUTED (feature_engine.py), per student, using event types attendance / test / behavior
- attendance_rate_30d, attendance_delta (this week vs previous week)
- avg_test_score_30d, test_score_delta
- behavior_count_30d (events with severity > 0), behavior_delta
- volatility_score = |test_score_delta|

TWIN METRICS (twin_metrics.py)
- Attendance score = attendance ratio x 100.
- Academic score = average test score.
- Behavior score = max(0, 100 - 10 x |behavior value|).

RISK MODEL (risk_engine.py) — weighted, explainable, rule-based (NOT trained ML)
- composite = 0.5 x academic + 0.3 x attendance + 0.2 x behavior
- composite >= 75 -> "low" risk
- composite 50-74 -> "moderate"
- composite < 50 -> "high"
- Explanation returned with academic, attendance, behavior and composite values.

TWIN STATE (twin_engine.py): stable (>= 75), warning (50-74), critical (< 50). A snapshot is stored only when state/risk changes, which gives a history timeline.

ALERT ENGINE (alert_engine.py)
- Severity assignment (high / medium / low), category inference (academic / attendance / behavior), duplicate-alert prevention, auto-resolve when risk becomes low, and a context payload stored with each alert.

ML ENGINE (ml-engine/): feature_extractor, risk_engine (threshold rules on attendance and academic average), forecasting_engine (predicted GPA = 0.7 x academic + 0.3 x attendance; failure probability from threshold rules; trend labels Improving / Stable / Declining; a confidence score from data volume and volatility; scikit-learn is imported but no model is trained yet), twin_updater, config.
- STATUS: rule-based; no trained model yet.

FRONTEND (client-app/src/pages)
- Student: Dashboard, Digital Twin, Risk Insights, Alerts, Submit Event, Rewards, Profile.
- Teacher: Dashboard, Class Overview, Risk Hub, Profile.
- Parent: Dashboard, Child Twin, Academic Reports.
- Admin: Dashboard, Audit Log, System Health.
- Demo/simulation mode (client-app/src/simulations): switch between simulated student and parent profiles (Altrin, Jins, Rethna, Mukhilan, Jerish and their parents) showing low, moderate and high risk cases, with engineering semester data (IAT, practicals, improvement exams, 75% attendance cutoff) and a rule-based "LLM-style" insights text generator.

SHARED CONTRACTS: eventSchema.json, evenTypes.json, twinSchema.json, apiEndpoints.md keep frontend and backend consistent.

HONEST STATUS (must be reflected on the Progress slide)
- Done: backend APIs and database models; event processing, feature, risk, twin and alert modules; JWT-based login; four role-based dashboards; demo mode with simulated profiles; shared contracts.
- Demo login currently recognizes sample faculty / parent / admin / student accounts and issues JWTs for demo use (full database-backed login is planned).
- Dashboards currently display simulated demo data; live backend-driven data integration is in progress.
- ML is rule-based; a trained model, what-if simulator, typed events (medical vs unexcused absence), twin Initializing/Stale states and closed-loop calibration are PLANNED.

==================== SLIDES (exactly 9, in this order) ====================
1. Title & Team Members
2. Abstract & Problem Statement (abstract, problem, objectives)
3. Literature Survey & Research Gap
   - Use only these references: Romero & Ventura (2010) Educational Data Mining review, IEEE Trans. SMC-C; Arnold & Pistilli (2012) Course Signals, LAK; Baker & Siemens (2014) Educational Data Mining and Learning Analytics; Lundberg & Lee (2017) SHAP, NeurIPS; Grieves & Vickers (2017) Digital Twin, Springer.
   - Add a "limitation" column and a highlighted research-gap callout: live event-driven Digital Twin + explainable risk + parent/teacher/student dashboards + planned what-if testing.
4. Proposed System Design — architecture flow diagram: Events -> FastAPI -> Normalizer/Rules -> Feature Engine -> Risk Engine -> Twin Engine (+ Snapshots) and Alert Engine -> Database -> REST API (JWT) -> React Dashboards; list the modules.
5. Design Methodology — iterative/incremental development, layered client-server architecture, event-driven design, contract-first schemas, security design (JWT, role-based access, ownership checks), explainability by design.
6. Implementation: Algorithm, Model & Design — numbered flowchart of the event pipeline, the risk formula in a highlighted box, the twin-state thresholds, the feature list, and a simple ER-style list of database tables.
7. Implementation Progress — color-coded table (Done / In Progress / Planned) using the HONEST STATUS above, plus placeholder boxes labelled "Screenshot: Login, Student Dashboard, Digital Twin, Risk Insights, Teacher Risk Hub, Parent View, Swagger /docs".
8. Conclusion & Future Work
9. References (IEEE style: the five above plus FastAPI, React and SQLAlchemy documentation)

==================== STYLE RULES ====================
- Modern dark-navy + teal/indigo theme, Poppins or Inter font, consistent title bar, slide numbers, footer "Digital Class Twin | Review 2".
- Max 5-6 short bullets per slide; put detail in speaker notes.
- Speaker notes for every slide: 40-60 seconds in simple English.
- Highlight every [FILL] so we can edit it.
- Do NOT claim a trained ML model, real student data, or accuracy figures.

OUTPUT: a downloadable .pptx. If you cannot create files, give a complete python-pptx script.
```

## Known code issues (fix before the live demo)

These were found while preparing the prompt, in `backend/app/core/`. The pipeline functions don't agree with each other, so events may be auto-skipped.

1. `event_processor.py` calls `update_student_features(db, child_id, event=...)`, but the function accepts no `event` argument.
2. `event_processor.py` imports `compute_twin_metrics` from `twin_engine`, but it is defined in `twin_metrics.py`.
3. `event_processor.py` calls `trigger_risk_alert(db, twin, previous_state)`, but the function takes only `(db, twin)`.
4. `alert_engine.py` gives severity "high" when the score is 75 or more, which is the healthy range. The comparison is inverted.
5. `/auth/login` accepts any password and returns a mock user (demo mode).
