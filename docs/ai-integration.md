# WasteVoice AI — AI Integration Specification

## Intended AI capability

The primary AI direction selected during ideation is **natural-language report understanding/structuring**.

A reporter may describe an issue in ordinary language. The intended AI layer can suggest structured information such as:

- waste category
- location, only when supported by the input
- concise issue summary

## Intended architecture

```text
User description
      ↓
React application
      ↓
Protected server-side AI endpoint
      ↓
Language model/service
      ↓
Structured response
      ↓
Reporter review and correction
      ↓
Confirmed report
```

Private AI credentials must remain server-side and must never be embedded in frontend source.

## Current Review 1 status

The current public repository has the human reporting/resolution workflow implemented, but the repository does **not** contain evidence of a completed server-side LLM integration. Therefore this document intentionally describes the AI layer as **pending/future implementation** rather than claiming that the product already performs AI inference.

## Safety contract for future implementation

The AI should:

1. Extract only information supported by the user's input.
2. Use `unknown` when a field is not supported.
3. Preserve uncertainty for vague descriptions.
4. Return validated structured output.
5. Keep summaries concise.
6. Never decide report status.
7. Never claim cleaning occurred.
8. Never automatically resolve a report.
9. Allow the reporter to correct the suggestions before submission.

## Reliability test cases

### Complete description

Input: `Plastic waste near the park entrance.`

Expected behavior: category/location may be suggested from the text.

### Missing location

Input: `There is a large amount of plastic waste.`

Expected behavior: location remains unknown unless supplied separately.

### Missing category

Input: `There is a pile of waste near the entrance.`

Expected behavior: category is not confidently invented.

### Vague input

Input: `The place is very dirty.`

Expected behavior: output remains conservative and uncertain.

## Future AI extensions

Possible later work includes image analysis, multilingual/voice reporting, trend analysis, anomaly detection and AI-assisted evidence comparison. None should be presented as implemented until built and tested.
