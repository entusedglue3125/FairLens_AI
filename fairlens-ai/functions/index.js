const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// We can read GEMINI_API_KEY from environment variables.
// In Firebase functions, you typically set config via firebase CLI,
// but for simplicity we will fall back to process.env.GEMINI_API_KEY
// or let the user set it in the Firebase dashboard.
require("dotenv").config();

const app = express();
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

let stats = {
  totalAnalyses: 0,
  biasDetected: 0,
  startTime: new Date().toISOString()
};

const log = {
  info: (msg, data = {}) => functions.logger.info(msg, data),
  error: (msg, data = {}) => functions.logger.error(msg, data),
  warn: (msg, data = {}) => functions.logger.warn(msg, data)
};

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

function buildPrompt(text, mode = "simple") {
  const modeNote = mode === "technical"
    ? "Use technical, academic language in the explanation."
    : "Use clear, plain language that anyone can understand in the explanation.";

  return `You are a professional bias detection AI. Analyze the following text for bias including gender bias, racial bias, age bias, socioeconomic bias, and any other forms of discrimination or unfair language.

${modeNote}

Return ONLY valid JSON with no markdown, no code fences, no extra text — ONLY the raw JSON object:
{
  "bias_detected": true or false,
  "biased_terms": ["list", "of", "biased", "words", "or", "phrases"],
  "explanation": "A clear explanation of why this text is biased or not",
  "fair_alternative": "A rewritten version of the original text that is fair and unbiased",
  "bias_score": a number from 0 to 100 where 0 is completely unbiased and 100 is extremely biased
}

Text to analyze:
"${text}"`;
}

function extractJSON(rawText) {
  try { return JSON.parse(rawText.trim()); } catch (_) {}
  const fenced = rawText.replace(/```json|```/g, "").trim();
  try { return JSON.parse(fenced); } catch (_) {}
  const match = rawText.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (_) {}
    const fixed = match[0].replace(/,\s*([}\]])/g, "$1");
    try { return JSON.parse(fixed); } catch (_) {}
  }
  return null;
}

function sanitizeResult(parsed, originalText, sensitivity) {
  const result = {
    bias_detected: typeof parsed.bias_detected === "boolean" ? parsed.bias_detected : false,
    biased_terms: Array.isArray(parsed.biased_terms) ? parsed.biased_terms.filter((t) => typeof t === "string") : [],
    explanation: typeof parsed.explanation === "string" ? parsed.explanation : "No explanation provided.",
    fair_alternative: typeof parsed.fair_alternative === "string" ? parsed.fair_alternative : originalText,
    bias_score: typeof parsed.bias_score === "number" ? Math.min(100, Math.max(0, Math.round(parsed.bias_score))) : 0,
  };

  if (result.bias_score === 0 && result.bias_detected) {
    result.bias_score = Math.min(100, Math.round(result.biased_terms.length * 15 + 20));
  }

  const multiplier = sensitivity / 50;
  result.bias_score = Math.min(100, Math.round(result.bias_score * multiplier));

  if (result.bias_score > 10 && !result.bias_detected) result.bias_detected = true;
  if (result.bias_score <= 5) {
    result.bias_detected = false;
    result.biased_terms = [];
  }
  return result;
}

app.post("/analyze", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.key;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    log.error("GEMINI_API_KEY is not set.");
    return res.status(500).json({ error: "Server configuration error: Gemini API key missing." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { text, mode = "simple", sensitivity = 50 } = req.body;
  const reqId = Math.random().toString(36).substring(7);

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Text is required." });
  }
  if (text.trim().length > 5000) {
    return res.status(400).json({ error: "Text must be 5000 characters or fewer." });
  }

  log.info("Analysis request received", { reqId, mode, sensitivity, textLength: text.length });
  const prompt = buildPrompt(text.trim(), mode);

  const callGemini = async (retries = 3, delayMs = 5000) => {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { temperature: 0.1, topP: 0.9, maxOutputTokens: 1024 },
    });
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const geminiResult = await model.generateContent(prompt);
        return geminiResult.response.text();
      } catch (err) {
        const isQuota = err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("503");
        if (isQuota && attempt < retries) {
          log.warn("Quota hit, retrying", { reqId, attempt, delayMs });
          await new Promise(r => setTimeout(r, delayMs));
          delayMs *= 2;
        } else {
          throw err;
        }
      }
    }
  };

  try {
    const rawText = await callGemini();
    const parsed = extractJSON(rawText);
    
    if (!parsed) {
      log.error("JSON parse failed", { reqId, rawText: rawText.substring(0, 200) });
      return res.status(422).json({
        error: "The AI returned an unexpected format. Please try again.",
        raw: rawText.substring(0, 500),
      });
    }

    const result = sanitizeResult(parsed, text.trim(), sensitivity);
    stats.totalAnalyses++;
    if (result.bias_detected) stats.biasDetected++;
    
    log.info("Analysis complete", { reqId, bias_detected: result.bias_detected, score: result.bias_score });

    setTimeout(() => res.json(result), 150);

  } catch (err) {
    log.error("API error", { reqId, error: err.message });
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key")) {
      return res.status(401).json({ error: "Invalid Gemini API key." });
    }
    if (err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("503")) {
      return res.status(429).json({ error: "Gemini API quota exceeded or service unavailable. Please try again later." });
    }
    if (err.message?.includes("SAFETY")) {
      return res.status(422).json({ error: "Content was blocked by Gemini safety filters." });
    }
    return res.status(500).json({ error: "Internal server error.", message: err.message });
  }
});

app.get("/stats", (_req, res) => {
  res.json({
    ...stats,
    uptimeSeconds: process.uptime()
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: GEMINI_MODEL, timestamp: new Date().toISOString() });
});

// Export the Express app as a Firebase Cloud Function named 'api'
exports.api = functions.https.onRequest(app);
