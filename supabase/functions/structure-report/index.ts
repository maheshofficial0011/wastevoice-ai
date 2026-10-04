import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import {
  buildUserPrompt,
  extractOutputText,
  localFallback,
  parseSafeResult,
  validateReportInput,
} from "./logic.mjs"

const PROVIDER = (Deno.env.get("AI_PROVIDER") ?? "openai").toLowerCase()
const MODEL = Deno.env.get("AI_MODEL") ?? (
  PROVIDER === "gemini"
    ? "gemini-3.8-flash"
    : (Deno.env.get("OPENAI_MODEL") ?? "gpt-5-mini")
)
const API_KEY = PROVIDER === "gemini"
  ? Deno.env.get("GEMINI_API_KEY")
  : Deno.env.get("OPENAI_API_KEY")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: {
      type: "string",
      enum: ["plastic", "paper", "food", "mixed", "other", "unknown"],
    },
    location: { type: "string" },
    summary: { type: "string" },
    missingFields: {
      type: "array",
      items: { type: "string" },
    },
    needsConfirmation: { type: "boolean" },
  },
  required: [
    "category",
    "location",
    "summary",
    "missingFields",
    "needsConfirmation",
  ],
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  })
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Only POST requests are supported." }, 405)
  }

  const authorization = request.headers.get("Authorization")
  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Authentication is required." }, 401)
  }

  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400)
  }

  const validated = validateReportInput(body)

  if (!validated.ok) {
    return jsonResponse({ error: validated.error }, 400)
  }

  const { location, description, additionalInfo } = validated

  if (!API_KEY) {
    return jsonResponse({
      source: "fallback",
      providerConfigured: false,
      data: localFallback(location, description),
      notice: "AI provider is not configured. Safe local structuring was returned.",
    })
  }

  const userPrompt = buildUserPrompt(location, description, additionalInfo)

  const systemPrompt = [
    "You are the WasteVoice AI report-structuring assistant.",
    "Use only facts supplied by the reporter.",
    "Never invent locations, quantities, dates, causes, people, urgency, waste types, cleaning results, or outcomes.",
    "Use unknown when a category is not supported.",
    "Copy the supplied location exactly when provided; otherwise use unknown.",
    "Write a neutral one-sentence summary using only supplied facts.",
    "List genuinely missing or vague fields.",
    "needsConfirmation must always be true.",
    "Do not assign staff, change workflow status, approve reports, reject reports, or declare cleaning complete.",
  ].join(" ")

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const isGemini = PROVIDER === "gemini"
    const endpoint = isGemini
      ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      : "https://api.openai.com/v1/responses"

    const requestBody = isGemini
      ? {
          model: MODEL,
          max_tokens: 300,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "waste_report_structure",
              strict: true,
              schema,
            },
          },
        }
      : {
          model: MODEL,
          max_output_tokens: 300,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompt }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: userPrompt }],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "waste_report_structure",
              strict: true,
              schema,
            },
          },
        }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    const payload = await response.json()

    if (!response.ok) {
      console.error("AI provider request failed", response.status)
      return jsonResponse({
        source: "fallback",
        providerConfigured: true,
        data: localFallback(location, description),
        notice: "AI processing failed safely. Conservative local structuring was returned.",
      })
    }

    const safeResult = parseSafeResult(
      extractOutputText(payload),
      location,
    )

    if (!safeResult) {
      return jsonResponse({
        source: "fallback",
        providerConfigured: true,
        data: localFallback(location, description),
        notice: "AI output failed validation. Conservative fallback structuring was returned.",
      })
    }

    return jsonResponse({
      source: PROVIDER,
      providerConfigured: true,
      model: MODEL,
      data: safeResult,
      notice: "AI suggestions are advisory and require reporter confirmation.",
    })
  } catch (error) {
    console.error(
      "Structure report error",
      error instanceof Error ? error.name : "unknown",
    )

    return jsonResponse({
      source: "fallback",
      providerConfigured: true,
      data: localFallback(location, description),
      notice: "The AI service was unreachable. Conservative fallback structuring was returned.",
    })
  } finally {
    clearTimeout(timeout)
  }
})
