// Optional Claude-powered tutor layer. The deterministic rule-based hint is
// always computed first and is what the app falls back to — this module only
// asks Claude to rephrase/warm it up in a more conversational, Socratic voice.
// The AI is never asked to compute or validate the answer; it only elaborates
// on hint text that the math engine already produced. If the API key is
// missing or the call fails for any reason, callers get `null` and use the
// rule-based hint untouched — the student is never blocked on AI availability.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";

export interface AiHintRequest {
  studentName: string;
  questionText: string;
  ruleBasedHint: string;
  level: number;
  studentResponse?: unknown;
  recentMisconception?: string;
}

export async function getAiEnhancedHint(req: AiHintRequest): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.ANTHROPIC_TUTOR_MODEL ?? DEFAULT_MODEL;
  const system = [
    "You are a warm, patient elementary math tutor working with an 8-year-old following Singapore Math (Dimensions Math 2A).",
    "You are given a question, the hint level (1-4), and a deterministic, mathematically-verified hint written by the app's math engine.",
    "Rephrase that hint in an encouraging, age-appropriate, conversational voice — one or two short sentences.",
    "Never state the final numeric answer unless the hint level is 4 (the worked example level).",
    "Never introduce any number, fact, or claim that isn't already present in the provided hint — you may only rephrase, not recompute.",
    "Ask a guiding question when the level is 1 or 2, rather than just restating a fact.",
  ].join(" ");

  const userContent = [
    `Student name: ${req.studentName}`,
    `Question: ${req.questionText}`,
    `Hint level: ${req.level} of 4`,
    `Math engine's hint (ground truth, do not contradict): ${req.ruleBasedHint}`,
    req.studentResponse !== undefined ? `Student's last answer: ${JSON.stringify(req.studentResponse)}` : "",
    req.recentMisconception ? `Known pattern to gently address: ${req.recentMisconception}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 200,
        system,
        messages: [{ role: "user", content: userContent }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null; // network error, timeout, or malformed response — fall back silently
  }
}
