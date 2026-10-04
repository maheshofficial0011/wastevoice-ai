import type { ReportStatus } from '../types'

/**
 * Canonical application workflow.
 *
 * This helper is documentation/transition metadata only. The authoritative
 * workflow guards remain in the Supabase RPCs that mutate live reports.
 *
 * Correction loop:
 * pending_verification -> rejected -> cleaning_in_progress
 */
export const workflowTransitions: Partial<Record<ReportStatus | 'rejected', Array<ReportStatus | 'rejected'>>> = {
    submitted: ['assigned'],
    assigned: ['cleaning_in_progress'],
    cleaning_in_progress: ['pending_verification'],
    pending_verification: ['resolved', 'rejected'],
    rejected: ['cleaning_in_progress'],
    resolved: [],
}

export function canTransition(
    currentStatus: ReportStatus | 'rejected',
    nextStatus: ReportStatus | 'rejected',
): boolean {
    return workflowTransitions[currentStatus]?.includes(nextStatus) ?? false
}
