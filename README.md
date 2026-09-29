# FinGuard

FinGuard is a prototype aquaculture companion for monitoring pond conditions and exploring fish-health guidance. The repository contains a React web app and a Python API for water-quality predictions.

## Product Preview

| Dashboard | Fish diagnosis | Treatment guidance |
| --- | --- | --- |
| ![FinGuard dashboard](FinGuard.io/Product%20Preview/User_Dashboard.png) | ![Fish diagnosis](FinGuard.io/Product%20Preview/Fish_ai_diagnostic.png) | ![Treatment guidance](FinGuard.io/Product%20Preview/Treatment_Protocol.png) |

| Language selection | Government schemes | App launch |
| --- | --- | --- |
| ![Language selection](FinGuard.io/Product%20Preview/Language_Selection.png) | ![Government schemes](FinGuard.io/Product%20Preview/Government_Hub.png) | ![FinGuard splash screen](FinGuard.io/Product%20Preview/Splash_Screen.png) |

## Features

- Pond dashboard with water metrics and farm health indicators.
- Water-health prediction API using temperature, dissolved oxygen, pH, and turbidity readings.
- Fish image analysis and pond-health assistance through the Google Gemini API.
- Screens for analytics, disease guidance, marketplace search, cold storage, government schemes, and profile settings.
- Language selection, voice-related utilities, and a responsive mobile-oriented interface.

AI-generated guidance and model predictions are informational only. Confirm diagnoses and treatment decisions with a qualified aquaculture professional.

## Architecture

```text
FinGuard/
|-- FinGuard.io/       React, TypeScript, and Vite frontend
|-- backend/           FastAPI prediction service and trained model
|-- Datasets/          Source dataset archives
```

The frontend development server listens on port `3000`. The water-health prediction service listens on port `8000` and accepts `POST /predict` requests with this JSON shape:

```json
{
  "temperature": 28.5,
  "dissolved_oxygen": 6.2,
  "ph": 7.8,
  "turbidity": 12.0
}
```

The response contains `status`, `health_index`, and `confidence` values.

## Run Locally

### Requirements

- Node.js 18 or newer and npm
- Python 3.10 or newer
- A Google Gemini API key for Gemini-powered features

Clone the repository and enter its directory:

```powershell
git clone https://github.com/vkmeta1092/FinnGuard.git
cd FinnGuard
```

### Frontend

From the repository root, install dependencies and start Vite:

```powershell
cd FinGuard.io
npm install
npm run dev
```

Open <http://localhost:3000>.

To enable Gemini-powered features, create `FinGuard.io/.env.local` with:

```dotenv
VITE_GEMINI_API_KEY=your_api_key
```

Do not commit API keys. The current frontend calls Gemini from the browser, which exposes the configured key in the client application. Use a restricted development key for local testing; before production deployment, route Gemini requests through a server-side service and keep credentials there.

### Prediction API

In a separate terminal, create a virtual environment and install the backend packages:

```powershell
cd backend
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt fastapi "uvicorn[standard]"
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

On macOS or Linux, create and activate the environment with `python3 -m venv .venv` and `source .venv/bin/activate` instead. Keep the working directory at `backend` when starting the API; the predictor loads its model from that directory.

The API health endpoint is <http://127.0.0.1:8000/> and the interactive API docs are at <http://127.0.0.1:8000/docs>.

### Build and Type Check

From `FinGuard.io/`:

```powershell
npm run build
npm run lint
```

`npm run lint` runs the TypeScript compiler in no-emit mode.

## Model Training

The checked-in model is loaded by the API. To retrain it, install the backend requirements, ensure the training CSV is at `backend/data/water_quality.csv`, then run from the `backend/` directory:

```powershell
python train_model.py
```

Training writes updated model artifacts to `backend/model/`.

## Repository Layout

```text
FinGuard.io/
|-- components/         Shared React components
|-- screens/            App screens
|-- services/           AI, prediction, and device integration
|-- Product Preview/    Application screenshots
|-- App.tsx             App state and screen routing
|-- package.json        Frontend scripts and dependencies
backend/
|-- app.py              FastAPI endpoints
|-- predictor.py        Water-quality inference
|-- train_model.py      Model training script
|-- data/               Training data
|-- model/              Serialized model artifacts
```

## Notes

- The API currently allows browser requests from `http://localhost:3000`.
- `FinGuard.io/node_modules`, local environment files, and Python bytecode should remain uncommitted.
- Dataset archives are stored under `Datasets/` at the repository root.