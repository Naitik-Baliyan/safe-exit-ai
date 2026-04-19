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
├── src/                    # Next.js 14 Web Application
├── api/                    # FastAPI Backend (Vercel Functions)
│   ├── index.py           # API Entry Point
│   ├── simulation.py      # Core AI Simulation Logic
│   └── requirements.txt   # Backend Dependencies
├── vercel.json             # Vercel Configuration
└── README.md               # Master Documentation
```

---

## 🚦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start Development
You need to start both the frontend and the backend for local development (or use `vercel dev`):
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:backend
```

---

## ☁️ Deployment

This project is optimized for **Vercel**.

### Standard Deploy
1. Push your code to a GitHub repository.
2. Import the project into **Vercel**.
3. Vercel will automatically detect Next.js and the `api/` folder.
4. It will "just work."

---

## 🛡️ Future Roadmap
- [ ] **Computer Vision Integration**: Feed real-time CCTV analysis into the telemetry engine.
- [ ] **Dynamic Gate Orchestration**: Automatically unlock smart-gates based on AI pathfinding.
- [ ] **Mobile Officer App**: Push real-time localized guidance to security staff on the ground.

---

*Developed with focus on Civic Safety and Spatial Computing.*
