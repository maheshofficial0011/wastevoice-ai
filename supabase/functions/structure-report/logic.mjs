export const VALID_CATEGORIES = [
  "plastic",
  "paper",
  "food",
  "mixed",
  "other",
  "unknown",
]

const CONTROL_LANGUAGE = /\b(assign(ed)?|resolve(d)?|approve(d)?|reject(ed)?|mark(?:ed)?\s+(?:this\s+)?(?:report|issue)\s+resolved|cleaning\s+complete|change\s+workflow|workflow\s+status)\b/i

export function validateReportInput(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const raw = body

  if (raw.location !== undefined && typeof raw.location !== "string") {
    return { ok: false, error: "Location must be text." }
  }

  if (typeof raw.description !== "string") {
    return { ok: false, error: "Description must be text." }
  }

  if (raw.additionalInfo !== undefined && typeof raw.additionalInfo !== "string") {
    return { ok: false, error: "Additional information must be text." }
  }

  const location = raw.location?.trim() ?? ""
  const description = raw.description.trim()
  const additionalInfo = raw.additionalInfo?.trim() ?? ""

  if (location.length > 120) {
    return { ok: false, error: "Location is too long." }
  }

  if (description.length < 15) {
    return { ok: false, error: "Please provide at least 15 characters of observed detail." }
  }

  if (description.length > 1000 || additionalInfo.length > 1000) {
    return { ok: false, error: "Report text is too long." }
  }

  return {
    ok: true,
    location,
    description,
    additionalInfo,
  }
}

export function localFallback(location, description) {
  const text = description.toLowerCase()
  let category = "unknown"

  if (/(plastic|bottle|polythene|wrapper|packaging)/i.test(text)) category = "plastic"
  else if (/(paper|cardboard|newspaper|carton)/i.test(text)) category = "paper"
  else if (/(food|meal|leftover|organic|fruit|vegetable)/i.test(text)) category = "food"

  const missingFields = []

  if (!location) missingFields.push("location")
  if (description.length < 25) missingFields.push("more specific observation detail")

  return {
    category,
    location: location || "unknown",
    summary: description.replace(/\s+/g, " ").slice(0, 180) || "unknown",
    missingFields,
    needsConfirmation: true,
  }
}

export function extractOutputText(payload) {
  if (!payload || typeof payload !== "object") return ""

  if (typeof payload.output_text === "string") {
    return payload.output_text
  }

  const output = Array.isArray(payload.output) ? payload.output : []
  const parts = []

  for (const item of output) {
    if (!item || typeof item !== "object") continue

    const content = Array.isArray(item.content) ? item.content : []

    for (const chunk of content) {
      if (!chunk || typeof chunk !== "object") continue
      if (typeof chunk.text === "string") parts.push(chunk.text)
    }
  }

  return parts.join("")
}

export function isSafeResult(value) {
  if (!value || typeof value !== "object") return false

  const item = value

  return (
    typeof item.category === "string" &&
    VALID_CATEGORIES.includes(item.category) &&
    typeof item.location === "string" &&
    item.location.length <= 120 &&
    typeof item.summary === "string" &&
    item.summary.length > 0 &&
    item.summary.length <= 240 &&
    !CONTROL_LANGUAGE.test(item.summary) &&
    Array.isArray(item.missingFields) &&
    item.missingFields.length <= 8 &&
    item.missingFields.every(
      (field) =>
        typeof field === "string" &&
        field.length <= 80 &&
        !CONTROL_LANGUAGE.test(field),
    ) &&
    item.needsConfirmation === true
  )
}

export function parseSafeResult(outputText, suppliedLocation) {
  if (typeof outputText !== "string" || !outputText.trim()) return null

  let parsed

  try {
    parsed = JSON.parse(outputText)
  } catch {
    return null
  }

  if (!isSafeResult(parsed)) return null

  return {
    ...parsed,
    location: suppliedLocation || "unknown",
    needsConfirmation: true,
  }
}

export function buildUserPrompt(location, description, additionalInfo) {
  return [
    `Supplied location: ${location || "unknown"}`,
    `Reporter description: ${description}`,
    `Additional information: ${additionalInfo || "unknown"}`,
  ].join("\n")
}
