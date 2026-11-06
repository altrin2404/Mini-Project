# Digital Class Twin

Digital Class Twin is an AI-driven, event-driven platform that builds a living, continuously-updating virtual academic profile (Digital Twin) for students. It predicts dropout risk early, provides explainable insights, and enables counselors to test hypothetical interventions.

## Project Structure

- **`backend/`**: FastAPI server handling event ingestion, APIs, JWT authentication, and database models.
- **`client-app/`**: React + Vite frontend dashboard for teachers, counselors, and students.
- **`ml-engine/`**: (Placeholder) The Machine Learning pipeline and twin updater logic (currently rule-based).
- **`shared-contracts/`**: Shared JSON schemas.

## Prerequisites

- **Node.js** (v16+ recommended)
- **Python** (v3.10+ recommended)
- **Git**

## Setup & Running the Project

### 1. Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies (assuming you have a `requirements.txt`. If missing, install `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic` etc.):
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`. You can view the API documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend (React + Vite)

1. Open a new terminal and navigate to the `client-app` folder:
   ```bash
   cd client-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port specified in your terminal).

### 3. ML Engine (Development Status)

The `ml-engine/` folder contains the pipeline intended for training and prediction (`train_model.py`, `risk_engine.py`, etc.). Currently, the ML models are operating using placeholder rule-based thresholds. 

To test the current twin logic pipeline:
```bash
python verify_digital_twin.py
```

## Future Roadmap (Reconstruction Plan)
- **Typed Events**: Segregating medical vs. unexcused absences and typed behavioral flags.
- **Twin State Machine**: Handling "Initializing" and "Stale" twin states.
- **What-If Simulator**: Shadow twin simulation for testing interventions without modifying actual data.
- **Closed-Loop Calibration**: Validating ML predictions against real outcomes over time.
