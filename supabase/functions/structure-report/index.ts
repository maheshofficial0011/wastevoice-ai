import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import {
  buildUserPrompt,
  extractOutputText,
  localFallback,
  parseSafeResult,
  validateReportInput,
} from "./logic.mjs"

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-mini"
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")

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
    location: {
      type: "string",
    },
    summary: {
      type: "string",
    },
    missingFields: {
      type: "array",
      items: { type: "string" },
    },
    needsConfirmation: {
      type: "boolean",
    },
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

  const {
    location,
    description,
    additionalInfo,
  } = validated

  if (!OPENAI_API_KEY) {
    return jsonResponse({
      source: "fallback",
      providerConfigured: false,
      data: localFallback(location, description),
      notice: "AI provider is not configured. Safe local structuring was returned.",
    })
  }

  const userPrompt = buildUserPrompt(
    location,
    description,
    additionalInfo,
  )

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_output_tokens: 300,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: [
              "You are the WasteVoice AI report-structuring assistant.",
              "Use only facts supplied by the reporter.",
              "Never invent locations, quantities, dates, causes, people, urgency, waste types, cleaning results, or outcomes.",
              "Use unknown when a category is not supported.",
              "Copy the supplied location exactly when provided; otherwise use unknown.",
              "Write a neutral one-sentence summary using only supplied facts.",
              "List genuinely missing or vague fields.",
              "needsConfirmation must always be true.",
              "Do not assign staff, change workflow status, approve reports, reject reports, or declare cleaning complete.",
            ].join(" ") }],
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
      }),
      signal: controller.signal,
    })

    const payload = await response.json()

    if (!response.ok) {
      console.error(
        "AI provider request failed",
        response.status,
      )

      return jsonResponse({
        source: "fallback",
        providerConfigured: true,
        data: localFallback(location, description),
        notice: "AI processing failed safely. Conservative local structuring was returned.",
      })
    }

    const providerOutput = extractOutputText(payload)

    const safeResult = parseSafeResult(
      providerOutput,
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
      source: "openai",
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
