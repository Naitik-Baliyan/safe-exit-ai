# 🏟️ SafeExit AI: Smart Stadium Safety Engine

**SafeExit AI** is a next-generation situational awareness dashboard designed for stadium security and crowd management. It combines real-time situational telemetry with a predictive AI engine to visualize crowd surges and automate evacuation pathfinding.

---

## 🚀 Key Features

- **🌐 Real-Time Telemetry Uplink**: Synchronized data stream between a high-performance FastAPI backend and a Next.js 14 frontend.
- **🧠 AI Decision Engine**: A stateful simulation engine that monitors sector density and predicts potential bottlenecks 30 seconds before they occur.
- **🗺️ Spatial Pathfinding**: Integrated SVG visualization that calculates and draws dynamic evacuation routes (Marching Ants effect) from high-risk zones to the nearest clear exit.
- **🚨 Intelligent Alerting**: A tiered notification system (LOW/MEDIUM/HIGH) with heartbeat animations for critical occupancy warnings.
- **🎨 Tesla-Grade UI**: A premium, "Liquid Glass" cyberpunk interface designed for large-scale (1600px+) command center displays.

---

## 🛠️ Tech Stack

### Frontend (Intelligence Layer)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Glassmorphism
- **Animations**: Framer Motion (State-driven transitions)
- **Icons**: Lucide React
- **Visualization**: Custom SVG Pathfinding Engine

### Backend (Logic Layer)
- **Framework**: Python + FastAPI
- **Schema**: Pydantic for robust data validation
- **Simulation**: Stateful recursive logic for realistic crowd behavior modeling
- **Deployment**: Google Cloud Run (Serverless)

---

## 🏗️ Project Structure

```bash
Safe-exit/
├── frontend/               # Next.js 14 Web Application
│   ├── src/
│   │   ├── components/     # Modular UI Components
│   │   ├── types.ts        # Shared TypeScript Interfaces
│   │   └── app/            # App Router & Styles
│   └── Dockerfile          # Container config for Web
├── main.py                 # FastAPI Entry Point
├── simulation.py           # Core AI Simulation Logic
├── requirements.txt        # Backend Dependencies
├── Dockerfile              # Container config for API
└── README.md               # Master Documentation
```

---

## 🚦 Getting Started

### 1. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the developer dashboard
npm run dev
```

---

## ☁️ Deployment

This project is architected for **Google Cloud Platform (GCP)**. It uses **Cloud Run** for serverless, zero-maintenance hosting.

### Quick Deploy (GCP CLI)
```bash
# Deploy Backend
gcloud run deploy safe-exit-api --source .

# Deploy Frontend
cd frontend
gcloud run deploy safe-exit-web --source .
```

---

## 🛡️ Future Roadmap
- [ ] **Computer Vision Integration**: Feed real-time CCTV analysis into the telemetry engine.
- [ ] **Dynamic Gate Orchestration**: Automatically unlock smart-gates based on AI pathfinding.
- [ ] **Mobile Officer App**: Push real-time localized guidance to security staff on the ground.

---

*Developed with focus on Civic Safety and Spatial Computing.*
