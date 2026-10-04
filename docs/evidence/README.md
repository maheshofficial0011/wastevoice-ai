# Review 2 Evidence Index

All entries below are expected to point to genuine artifacts. Empty/pending entries are intentionally not represented as completed evidence.

## A. Product Workflow

- Reporter workflow — `docs/evidence/08_reporter_dashboard.png`
- Authority review — `docs/evidence/03_authority_dashboard.png`
- Assignment — `docs/evidence/04_authority_report_assignment.png`
- Staff workflow — `docs/evidence/07_staff_dashboard.png`
- Verification workspace — `docs/evidence/05_authority_verification_workspace.png`
- Before/after comparison — `docs/evidence/06_evidence_comparison.png`

## B. AI

- AI live output — **EXTERNAL ACTION REQUIRED**
- Automated AI safety tests — GitHub Actions run #69
- Fallback behavior — automated tests in `tests/report-assistant.test.mjs`
- Human confirmation — **EXTERNAL ACTION REQUIRED** for live screenshot

Suggested future files:

- `docs/evidence/ai/AI-01-complete.png`
- `docs/evidence/ai/AI-02-missing-location.png`
- `docs/evidence/ai/AI-03-missing-category.png`
- `docs/evidence/ai/AI-04-vague.png`
- `docs/evidence/ai/AI-05-contradictory.png`
- `docs/evidence/ai/AI-06-prompt-injection.png`
- `docs/evidence/ai/AI-07-oversized.png`
- `docs/evidence/ai/AI-08-provider-failure.png`
- `docs/evidence/ai/AI-09-malformed-output.png`
- `docs/evidence/ai/AI-10-unsafe-output.png`
- `docs/evidence/ai/AI-11-human-confirmation.png`

## C. Security

- Runtime RPC/RLS tests — `runtime-security-tests.md`
- Storage policy audit — `storage-security-tests.md`
- Browser wrong-role denial — **EXTERNAL ACTION REQUIRED**
- Signed URL capture — **EXTERNAL ACTION REQUIRED**
- Expired signed URL capture — **EXTERNAL ACTION REQUIRED**

## D. Reliability

- Input validation — automated tests + application implementation
- Provider timeout/fallback — automated safety logic
- Error Boundary — **EXTERNAL ACTION REQUIRED** for retained runtime screenshot

## E. User Validation

- Tester 1 — **EXTERNAL ACTION REQUIRED**
- Tester 2 — **EXTERNAL ACTION REQUIRED**
- Tester 3 — **EXTERNAL ACTION REQUIRED**
- Feedback — **EXTERNAL ACTION REQUIRED**
- Prototype changes — **EXTERNAL ACTION REQUIRED**
- Retest — **EXTERNAL ACTION REQUIRED**

## F. CI

- Lint — GitHub Actions
- Automated tests — 11 AI safety tests
- Production build — GitHub Actions
- Current latest known green gate — run #69

## Evidence integrity

Never place a placeholder screenshot, invented tester result, or fabricated AI output into this directory.
