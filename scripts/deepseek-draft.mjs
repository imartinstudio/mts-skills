#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";
const MAX_TEXT_CHARS = 1600;
const MAX_SOURCE_CHARS = 1800;
const BLOCKED_OUTPUT_PATTERNS = [
  /点击\s*(回复|发布|发送)/i,
  /\b(click|tap|press)\s+(reply|post|send)\b/i,
  /(api[_-]?key|password|token|cookie|authorization)/i,
  /(转发抽奖|互关|私信我|加微信|加我微信)/i
];

function usage() {
  return `Usage:
  node scripts/deepseek-draft.mjs < input.json
  node scripts/deepseek-draft.mjs --dry-run < input.json
  node scripts/deepseek-draft.mjs --example

Environment:
  DEEPSEEK_API_KEY       Required unless --dry-run is used.
  DEEPSEEK_BASE_URL      Optional. Default: ${DEFAULT_BASE_URL}
  DEEPSEEK_MODEL         Optional. Default: ${DEFAULT_MODEL}
`;
}

function example() {
  return {
    mode: "x-reply",
    targetPost: {
      author: "example",
      text: "Codex 的核心不是聊天，而是把工作流跑起来。",
      url: "https://x.com/example/status/123"
    },
    style: {
      tone: "natural, specific, human-like",
      length: "1-2 short sentences",
      language: "same-as-target",
      emoji: "sparingly"
    },
    constraints: [
      "Do not submit or publish.",
      "Avoid generic praise.",
      "Do not invent personal experience."
    ],
    count: 1
  };
}

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data.trim();
}

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function chatCompletionsUrl(baseUrl) {
  if (baseUrl.endsWith("/v1")) return `${baseUrl}/chat/completions`;
  return `${baseUrl}/chat/completions`;
}

function parseInput(raw) {
  if (!raw) throw new Error("Missing JSON input on stdin.");
  const input = JSON.parse(raw);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Input must be a JSON object.");
  }
  if (!input.mode) throw new Error("Input must include mode.");
  if (input.mode === "x-comment" && !input.targetPost && !input.targetContext && !Array.isArray(input.posts)) {
    throw new Error("x-comment input must include posts, targetPost, or targetContext.");
  }
  if (input.mode !== "x-comment" && !input.targetPost && !input.targetContext) {
    throw new Error("Input must include targetPost or targetContext.");
  }
  return input;
}

function compact(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  return JSON.stringify(value, null, 2);
}

function truncateText(value, limit) {
  const text = compact(value).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
}

function sanitizeUrl(value) {
  if (!value) return undefined;
  try {
    const url = new URL(String(value));
    if (!["x.com", "twitter.com"].includes(url.hostname.replace(/^www\./, ""))) {
      return undefined;
    }
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

function sanitizePost(value, limit = MAX_TEXT_CHARS) {
  if (!value) return undefined;
  if (typeof value === "string") return { text: truncateText(value, limit) };
  return {
    author: value.author ? truncateText(value.author, 80) : undefined,
    text: value.text ? truncateText(value.text, limit) : undefined,
    url: sanitizeUrl(value.url),
    metrics: value.metrics ? truncateText(value.metrics, 160) : undefined
  };
}

function sanitizeInput(input) {
  const posts = Array.isArray(input.posts)
    ? input.posts.map((post) => sanitizePost(post, MAX_TEXT_CHARS)).filter(Boolean).slice(0, 10)
    : undefined;
  return {
    mode: String(input.mode || "").trim(),
    count: Math.max(1, Math.min(Number(input.count || 1), 5)),
    posts,
    targetPost: sanitizePost(input.targetPost || input.targetContext, MAX_TEXT_CHARS),
    sourcePost: sanitizePost(input.sourcePost || input.sourceContext, MAX_SOURCE_CHARS),
    sourceLink: sanitizeUrl(input.sourceLink),
    style: input.style || {
      tone: "natural, specific, human-like",
      length: "1-2 short sentences",
      language: "same as target"
    },
    constraints: Array.isArray(input.constraints)
      ? input.constraints.map((item) => truncateText(item, 180)).slice(0, 12)
      : []
  };
}

function buildSystemPrompt() {
  return [
    "You draft X/Twitter replies for a human user.",
    "Write concise, natural, specific replies that sound human.",
    "Never claim the user has personal experience unless the input explicitly says so.",
    "Avoid generic praise, sales language, hashtags, engagement bait, and repetitive templates.",
    "Do not include instructions to publish or submit.",
    "If a source link is provided, use it only when the requested mode and link policy allow it.",
    "Return strict JSON only, with this shape: {\"drafts\":[{\"text\":\"...\",\"reason\":\"...\"}]}."
  ].join("\n");
}

function buildUserPrompt(input) {
  const modeGuidance = {
    "x-comment": [
      "Task: draft engagement comments for selected X posts.",
      "Goal: build authentic interaction, not traffic spam.",
      "Default: no source link unless explicitly provided and requested."
    ],
    "x-traffic": [
      "Task: draft a reply to a related high-traffic X post that can naturally point to the source post.",
      "Goal: respond to the target first, identify a useful gap, then use the source link as a complement.",
      "Avoid first-person promotional phrasing such as 我也写了一篇, 我刚写过, I wrote, or I also covered this."
    ],
    "x-reply": [
      "Task: draft one best reply to a single X post or comment.",
      "Goal: add useful context, warmth, agreement, disagreement, or one good question.",
      "Default: do not include links unless explicitly requested."
    ]
  };

  const lines = [
    ...(modeGuidance[input.mode] || [`Task mode: ${input.mode}`]),
    "",
    `Draft count: ${Number(input.count || 1)}`,
    "",
    input.mode === "x-comment" ? "Selected target posts:" : "Target post or comment:",
    compact(input.mode === "x-comment" ? (input.posts || input.targetPost) : input.targetPost),
    "",
    "Source post, link, or user content:",
    compact(input.sourcePost || input.sourceLink || ""),
    "",
    "Style:",
    compact(input.style || {
      tone: "natural, specific, human-like",
      length: "1-2 short sentences",
      language: "same as target"
    }),
    "",
    "Constraints:",
    compact(input.constraints || []),
    "",
    "Return strict JSON. Each draft text should be ready to paste into an X reply box."
  ];

  return lines.join("\n");
}

function extractJsonObject(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Model returned empty content.");
  try {
    return JSON.parse(trimmed);
  } catch {}

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }
  throw new Error("Model response was not valid JSON.");
}

function validateOutput(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.drafts)) {
    throw new Error("Model JSON must include drafts array.");
  }
  value.drafts = value.drafts
    .map((item) => ({
      text: String(item?.text || "").trim(),
      reason: item?.reason ? String(item.reason).trim() : undefined
    }))
    .filter((item) => item.text)
    .map((item) => {
      if (item.text.length > 500) {
        throw new Error("Draft is too long.");
      }
      for (const pattern of BLOCKED_OUTPUT_PATTERNS) {
        if (pattern.test(item.text)) {
          throw new Error(`Draft failed safety check: ${pattern}`);
        }
      }
      return item;
    });
  if (value.drafts.length === 0) throw new Error("No non-empty drafts returned.");
  return value;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--help") || args.has("-h")) {
    console.log(usage());
    return;
  }
  if (args.has("--example")) {
    console.log(JSON.stringify(example(), null, 2));
    return;
  }

  const input = sanitizeInput(parseInput(await readStdin()));
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildUserPrompt(input) }
  ];

  if (args.has("--dry-run")) {
    console.log(JSON.stringify({
      dryRun: true,
      model: process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
      messages
    }, null, 2));
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is required.");

  const baseUrl = normalizeBaseUrl(process.env.DEEPSEEK_BASE_URL);
  const model = process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
  const response = await fetch(chatCompletionsUrl(baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.maxTokens ?? 800
    })
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`DeepSeek request failed (${response.status}): ${bodyText}`);
  }

  const payload = JSON.parse(bodyText);
  const content = payload?.choices?.[0]?.message?.content;
  const parsed = validateOutput(extractJsonObject(content));

  console.log(JSON.stringify({
    model,
    drafts: parsed.drafts,
    usage: payload.usage
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({
    error: String(error?.message || error)
  }, null, 2));
  process.exit(1);
});
