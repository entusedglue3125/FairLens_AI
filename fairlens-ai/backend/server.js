/**
 * FairLens AI — Backend Server
 * Express API that uses Google Gemini API for bias analysis
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

// ─── Validate API Key ─────────────────────────────────────────────────────────
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
  console.error("ERROR: GEMINI_API_KEY is not set in .env file.");
  console.error("Get your key at: https://aistudio.google.com/app/apikey");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ─── Helper: Build Prompt ─────────────────────────────────────────────────────
function buildPrompt(text, mode = "simple") {
  const modeNote =
    mode === "technical"
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

// ─── Helper: Extract JSON from response ──────────────────────────────────────
function extractJSON(rawText) {
  // Direct parse
  try { return JSON.parse(rawText.trim()); } catch (_) {}

  // Strip markdown fences if present
  const fenced = rawText.replace(/```json|```/g, "").trim();
  try { return JSON.parse(fenced); } catch (_) {}

  // Extract first JSON object
  const match = rawText.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (_) {}
    // Fix trailing commas
    const fixed = match[0].replace(/,\s*([}\]])/g, "$1");
    try { return JSON.parse(fixed); } catch (_) {}
  }

  return null;
}

// ─── Helper: Sanitize Result ──────────────────────────────────────────────────
function sanitizeResult(parsed, originalText, sensitivity) {
  const result = {
    bias_detected: typeof parsed.bias_detected === "boolean" ? parsed.bias_detected : false,
    biased_terms: Array.isArray(parsed.biased_terms)
      ? parsed.biased_terms.filter((t) => typeof t === "string")
      : [],
    explanation: typeof parsed.explanation === "string" ? parsed.explanation : "No explanation provided.",
    fair_alternative: typeof parsed.fair_alternative === "string" ? parsed.fair_alternative : originalText,
    bias_score: typeof parsed.bias_score === "number"
      ? Math.min(100, Math.max(0, Math.round(parsed.bias_score)))
      : 0,
  };

  // Auto-compute bias_score if missing but bias_detected is true
  if (result.bias_score === 0 && result.bias_detected) {
    result.bias_score = Math.min(100, Math.round(result.biased_terms.length * 15 + 20));
  }

  // Apply sensitivity multiplier (slider 0–100, default 50 = 1x)
  const multiplier = sensitivity / 50;
  result.bias_score = Math.min(100, Math.round(result.bias_score * multiplier));

  // Sync flags with final score
  if (result.bias_score > 10 && !result.bias_detected) result.bias_detected = true;
  if (result.bias_score <= 5) {
    result.bias_detected = false;
    result.biased_terms = [];
  }

  return result;
}

// ─── POST /analyze ────────────────────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  const { text, mode = "simple", sensitivity = 50 } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Text is required." });
  }
  if (text.trim().length > 5000) {
    return res.status(400).json({ error: "Text must be 5000 characters or fewer." });
  }

  const prompt = buildPrompt(text.trim(), mode);

  // Retry helper — backs off on quota errors (up to 3 attempts)
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
        const isQuota = err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("503 Service Unavailable");
        if (isQuota && attempt < retries) {
          console.warn(`Quota/503 hit, retrying in ${delayMs}ms (attempt ${attempt}/${retries})`);
          await new Promise(r => setTimeout(r, delayMs));
          delayMs *= 2; // exponential backoff
        } else {
          throw err;
        }
      }
    }
  };

  try {
    const rawText = await callGemini();
    console.log("Gemini raw response:", rawText.substring(0, 300));

    const parsed = extractJSON(rawText);
    if (!parsed) {
      console.error("Failed to parse JSON from Gemini output:", rawText);
      return res.status(422).json({
        error: "The AI returned an unexpected format. Please try again.",
        raw: rawText.substring(0, 500),
      });
    }

    const result = sanitizeResult(parsed, text.trim(), sensitivity);
    return res.json(result);

  } catch (err) {
    console.error("Gemini API error:", err.message);

    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key")) {
      return res.status(401).json({ error: "Invalid Gemini API key. Check your .env file." });
    }
    if (err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("503 Service Unavailable")) {
      return res.status(429).json({ error: "Gemini API quota exceeded or service unavailable. Please try again later." });
    }
    if (err.message?.includes("SAFETY")) {
      return res.status(422).json({ error: "Content was blocked by Gemini safety filters." });
    }

    return res.status(500).json({ error: "Internal server error.", message: err.message });
  }
});

// ─── GET /health ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: GEMINI_MODEL, timestamp: new Date().toISOString() });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`FairLens AI backend running on http://localhost:${PORT}`);
  console.log(`Using Gemini model: ${GEMINI_MODEL}`);
});
