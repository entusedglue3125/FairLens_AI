# FairLens AI

Professional-grade AI bias detection system powered by Google Gemini.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm start          # runs on http://localhost:3001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

## API Key
The Gemini API key is set in `backend/.env`.  
Get a new key anytime at: https://aistudio.google.com/app/apikey

## API
- `POST /analyze` — `{ text, mode, sensitivity }` → bias result
- `GET /health` — server + model status
