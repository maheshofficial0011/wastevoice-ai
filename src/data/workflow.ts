export type RuntimeReportStatus =
    | 'submitted'
    | 'assigned'
    | 'cleaning_in_progress'
    | 'pending_verification'
    | 'resolved'
    | 'rejected'

/**
 * Canonical application workflow.
 *
 * The authoritative guards remain in the Supabase RPCs that mutate live
 * reports. This file mirrors the runtime states for UI/documentation helpers.
 *
 * Correction loop:
 * pending_verification -> rejected -> cleaning_in_progress
 */
export const workflowTransitions: Record<RuntimeReportStatus, RuntimeReportStatus[]> = {
    submitted: ['assigned'],
    assigned: ['cleaning_in_progress'],
    cleaning_in_progress: ['pending_verification'],
    pending_verification: ['resolved', 'rejected'],
    rejected: ['cleaning_in_progress'],
    resolved: [],
}

export function canTransition(
    currentStatus: RuntimeReportStatus,
    nextStatus: RuntimeReportStatus,
): boolean {
    return workflowTransitions[currentStatus].includes(nextStatus)
}
