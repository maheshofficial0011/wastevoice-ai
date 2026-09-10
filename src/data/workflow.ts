import type { ReportStatus } from '../types'

export const workflowTransitions: Record<ReportStatus, ReportStatus[]> = {
    submitted: ['ai_structured'],

    ai_structured: ['under_review'],

    under_review: ['assigned'],

    assigned: ['before_evidence_uploaded'],

    before_evidence_uploaded: ['cleaning_in_progress'],

    cleaning_in_progress: ['after_evidence_uploaded'],

    after_evidence_uploaded: ['verification_pending'],

    verification_pending: ['resolved'],

    resolved: [],
}

export function canTransition(
    currentStatus: ReportStatus,
    nextStatus: ReportStatus,
): boolean {
    return workflowTransitions[currentStatus].includes(nextStatus)
}