import test from 'node:test'
import assert from 'node:assert/strict'

import {
  canEditReportStatus,
  canRolePerformAction,
  requiresBeforeEvidence,
  shouldBlockDuplicateSubmission,
} from '../src/lib/review2Guards.ts'
import {
  VALID_CATEGORIES,
  localFallback,
  parseSafeResult,
} from '../supabase/functions/structure-report/logic.mjs'
import { canTransition } from '../src/data/workflow.ts'

test('REG-01 role/action guard only allows the responsible role', () => {
  assert.equal(canRolePerformAction('authority', 'assign_staff'), true)
  assert.equal(canRolePerformAction('reporter', 'assign_staff'), false)
  assert.equal(canRolePerformAction('authority', 'verify_report'), true)
  assert.equal(canRolePerformAction('staff', 'verify_report'), false)
  assert.equal(canRolePerformAction('staff', 'update_cleaning_status'), true)
  assert.equal(canRolePerformAction('reporter', 'update_cleaning_status'), false)
})

test('REG-02 valid workflow transitions are allowed', () => {
  assert.equal(canTransition('submitted', 'assigned'), true)
  assert.equal(canTransition('assigned', 'cleaning_in_progress'), true)
  assert.equal(canTransition('cleaning_in_progress', 'pending_verification'), true)
  assert.equal(canTransition('pending_verification', 'resolved'), true)
  assert.equal(canTransition('pending_verification', 'rejected'), true)
  assert.equal(canTransition('rejected', 'cleaning_in_progress'), true)
})

test('REG-03 invalid workflow transitions are denied', () => {
  assert.equal(canTransition('submitted', 'resolved'), false)
  assert.equal(canTransition('assigned', 'resolved'), false)
  assert.equal(canTransition('resolved', 'cleaning_in_progress'), false)
})

test('REG-04 new reports require before evidence; edits preserve existing evidence', () => {
  assert.equal(requiresBeforeEvidence(false, true), true)
  assert.equal(requiresBeforeEvidence(false, false), false)
  assert.equal(requiresBeforeEvidence(true, false), true)
})

test('REG-05 only Submitted reports are editable', () => {
  assert.equal(canEditReportStatus('submitted'), true)
  assert.equal(canEditReportStatus(' Submitted '), true)
  assert.equal(canEditReportStatus('assigned'), false)
  assert.equal(canEditReportStatus('resolved'), false)
  assert.equal(canEditReportStatus(null), false)
})

test('REG-06 duplicate submissions are blocked while submitting', () => {
  assert.equal(shouldBlockDuplicateSubmission(true), true)
  assert.equal(shouldBlockDuplicateSubmission(false), false)
})

test('REG-07 invalid AI categories are rejected', () => {
  assert.equal(VALID_CATEGORIES.includes('garbage'), false)
  assert.equal(parseSafeResult(JSON.stringify({
    category: 'garbage',
    location: 'Main gate',
    summary: 'Waste observed at the main gate.',
    missingFields: [],
    needsConfirmation: true,
  }), 'Main gate'), null)
})

test('REG-08 missing fields stay conservative in fallback', () => {
  const result = localFallback('', 'There is a problem with waste near the entrance.')
  assert.equal(result.location, 'unknown')
  assert.equal(result.category, 'unknown')
  assert.equal(result.needsConfirmation, true)
  assert.ok(result.missingFields.includes('location'))
})

test('REG-09 fallback does not invent an operational outcome', () => {
  const result = localFallback('Campus Park', 'Plastic bottles and paper wrappers are on the path.')
  assert.equal(result.category, 'mixed')
  assert.equal(result.location, 'Campus Park')
  assert.equal(result.needsConfirmation, true)
  assert.ok(!/assign|resolve|approve|reject|cleaning complete/i.test(result.summary))
})

test('REG-10 duplicate/missing evidence boundary remains deterministic', () => {
  assert.equal(requiresBeforeEvidence(false, false), false)
  assert.equal(shouldBlockDuplicateSubmission(false), false)
  assert.equal(shouldBlockDuplicateSubmission(true), true)
})
