# WasteVoice AI — Final Completion Roadmap

**Goal:** reach a credible final Project Better Tomorrow submission without inflating completion claims.

## Completed

- Core Reporter → Authority → Staff → Verification workflow.
- Supabase Auth and protected routes.
- Reporter form validation and evidence workflow.
- Authority review, assignment and final human verification.
- Staff cleaning-status and after-evidence workflow.
- React Error Boundary.
- AI Assist Reporter interface.
- Deployed structure-report Supabase Edge Function with JWT verification.
- Schema-constrained AI response handling.
- Conservative fallback path.
- Prompt-injection-safe output boundary for workflow authority.
- Input length/type validation and AI request timeout.
- Private waste-evidence bucket.
- Signed evidence URL handling.
- Workflow RPC execution hardening.
- Anonymous execution removed from obsolete workflow helpers/RPCs.
- Automated AI safety test matrix in CI.
- Green GitHub Actions quality gate.
- Review 2 report and architecture diagram.
- Project status, live setup and validation planning documents.

## Near Complete

### 1. Live AI activation
Configure OPENAI_API_KEY and a permitted OPENAI_MODEL in the deployed Edge Function environment.
Then execute the AI test matrix and retain evidence.

### 2. Demo role profiles
Map the three existing Supabase Auth accounts to reporter, authority and staff profiles.

### 3. Security runtime verification
Execute negative tests for unauthorized report access, unauthorized RPC calls and evidence access.

### 4. Final UX evidence
Retain current screenshots plus Review 2 screenshots showing AI Assist, workflow state and failure/edge states.

## Validation Required

1. Run the Review 2 protocol with at least three real testers.
2. Record exact friction and feedback.
3. Implement changes caused by the feedback.
4. Re-test the changed flow.
5. Attach the resulting evidence to docs/review-2-validation.md.

## External Configuration

- Supabase Auth profile setup for the existing demo accounts.
- OPENAI_API_KEY secret.
- OPENAI_MODEL selection.
- Final production deployment target, if one is required by the submission.
- Supabase leaked-password protection setting.

## Final Technical Checks

- Keep GitHub Actions green.
- Run npm test.
- Run npm run lint.
- Run npm run build.
- Verify no provider secrets are committed.
- Verify no public evidence URLs remain in the client.
- Verify signed evidence previews for permitted roles.
- Verify staff cannot resolve reports.
- Verify reporter cannot assign or verify.
- Verify authority can perform final review.

## Final Submission Package

- Review 2 project report.
- Review 2 validation record with genuine tester evidence.
- 6–10 slide source + PDF.
- 8–12 minute 1080p video with required presentation setup.
- Required evidence recordings.
- Final AI-use declaration.
- Repository link.

## Final Stretch Features — Optional

Only consider these after the Review 2 gates are complete:

- Voice/multilingual reporting.
- Image-assisted waste categorization.
- Priority assistance based on validated rules/data.
- Hotspot analytics.

Do not add these if they reduce validation quality or submission readiness.

## Definition of 100% for This Project

Final completion means the project has:

- a working end-to-end prototype;
- a functioning and safely bounded AI capability;
- verified role/security behavior;
- automated quality checks;
- genuine three-person validation;
- documented feedback-driven iteration;
- coherent final documentation;
- required evidence recordings;
- final presentation/video;
- and explicit limitations where production or environmental impact has not been measured.

## Shortest Credible Path

**Configure demo profiles → configure live AI → run AI cases → test three real users → fix the biggest observed friction → re-test → capture evidence → finalize deck/video → submit Review 2.**
