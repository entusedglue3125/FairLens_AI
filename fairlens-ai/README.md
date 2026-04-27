# FairLens AI — Professional Bias Detection

FairLens AI is a high-fidelity, professional-grade bias detection system designed to identify and explain discriminatory language in professional communications. Powered by Google Gemini, it provides real-time quantification and reconstruction of biased text.

![FairLens AI Landing Page](fairlens-ai/frontend/public/image.png)

## 🚀 Key Features

- **Multi-Dimensional Detection**: Identifies gender, racial, age, and socioeconomic bias.
- **Bias Score (0-100)**: Real-time quantification of language severity.
- **Fair Rewrites**: AI-driven suggestions for more equitable communication.
- **Interactive Explanations**: Detailed reasoning for every flagged term.
- **Persistent History**: Local storage of previous analyses for comparison.
- **Cross-Platform**: Web-based dashboard and Chrome Extension integration.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI Engine**: Google Gemini Flash (with exponential backoff retries)
- **Schema Validation**: Zod (for AI response consistency)

## ⚙️ Project Structure

```text
fairlens-ai/
├── backend/            # Express API & Gemini Orchestration
│   ├── server.js       # Main API entry point
│   └── .env            # API Keys & Configuration
├── frontend/           # React Dashboard & Landing Page
│   ├── src/            # Source code
│   └── public/         # Static assets (including image.png)
└── ...
```

## 🚥 Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
# Create .env file with your GEMINI_API_KEY
node server.js          # Runs on http://localhost:3002
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev             # Runs on http://localhost:5173
```

## 🧠 How It Works

1. **Input Stage**: Text is tokenized and sanitized on the client.
2. **Analysis Stage**: The backend constructs a multi-shot prompt that enforces a strict JSON schema.
3. **AI Inference**: Google Gemini Flash analyzes the text for subtle exclusionary patterns.
4. **Validation Stage**: The response is validated against a fairness rubric to ensure accuracy.
5. **UI Rendering**: The frontend highlights biased terms and displays the weighted Bias Score.

## 🛡 Ethics & Methodology
FairLens AI follows Google's AI Principles. It is designed for assistive auditing and professional growth, not for automated HR or legal decision-making. Always review suggestions before implementation.

---
© 2026 FairLens AI Team
