# WasteVoice AI — Testing Record and Plan

## Current verified result

A local production build has previously been completed successfully with:

```bash
npm run build
```

The recorded result completed TypeScript compilation and the Vite production build, with a large JavaScript chunk warning noted as a performance optimization item. Re-run the command after installing dependencies on the current machine before treating it as a fresh verification result.

## Functional test matrix

| Area | Review 1 status | Evidence to retain |
|---|---|---|
| Application build | Previously passed locally | terminal output/screenshot; re-run for fresh evidence |
| Login and role routing | Implemented; runtime test evidence should be retained | browser screenshot + console if needed |
| Protected routes | Implemented | role-access test |
| Report creation | Implemented | reporter workflow screenshot |
| Input validation | Implemented | invalid-input cases |
| Before evidence upload | Implemented | upload result/screenshot |
| Reporter dashboard | Implemented | dashboard screenshot |
| Authority review | Implemented in application | authority workflow screenshot |
| Staff assignment | Implemented in application | assignment screenshot |
| Staff status updates | Implemented in application | status transition evidence |
| After evidence | Implemented in application | upload evidence |
| Authority verification | Implemented in application | approve/reject evidence |
| AI inference | Pending | do not claim as tested |
| Three-user validation | See `docs/validation.md`; use only with retained tester evidence | tester interaction/evidence |

## Role-based tests to run

### Reporter

- Can log in and reach reporter area.
- Can create a report with valid data.
- Cannot perform authority/staff-only actions.
- Can view own report status.

### Authority

- Can view reports requiring review.
- Can assign a staff member.
- Can review before/after evidence.
- Can approve or reject completion.

### Staff

- Can view assigned work.
- Can update cleaning progress.
- Can upload after-cleaning evidence.
- Cannot make the final resolved decision.

## Input/edge tests

- Empty location
- Too-short description
- Oversized additional information
- Unsupported image type
- Image larger than the application limit
- Missing before evidence on a new report
- Editing a report after it is no longer eligible for reporter edits
- Missing/invalid authenticated session

## AI reliability tests for later implementation

Use at least:

1. Complete description: `Plastic waste near the park entrance.`
2. Missing location: `There is a large amount of plastic waste.`
3. Missing category: `There is a pile of waste near the entrance.`
4. Vague input: `The place is very dirty.`

The expected safety behavior is to preserve uncertainty and avoid inventing missing facts.

## Evidence rule

A test should be marked **Passed** only after the test is actually executed. A planned test is not a test result. Screenshots, terminal output, or other execution evidence should be retained for important Review 1 claims.
