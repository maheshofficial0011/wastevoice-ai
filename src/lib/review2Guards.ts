export type Review2Role = 'reporter' | 'authority' | 'staff'

export type Review2Action =
    | 'reporter_workspace'
    | 'authority_workspace'
    | 'staff_workspace'
    | 'assign_staff'
    | 'verify_report'
    | 'update_cleaning_status'

const ACTION_ROLES: Record<Review2Action, Review2Role> = {
    reporter_workspace: 'reporter',
    authority_workspace: 'authority',
    staff_workspace: 'staff',
    assign_staff: 'authority',
    verify_report: 'authority',
    update_cleaning_status: 'staff',
}

export function canRolePerformAction(
    role: Review2Role,
    action: Review2Action,
): boolean {
    return ACTION_ROLES[action] === role
}

export function canEditReportStatus(status: string | null | undefined): boolean {
    return (status ?? '').trim().toLowerCase() === 'submitted'
}

export function requiresBeforeEvidence(
    isEditMode: boolean,
    hasFile: boolean,
): boolean {
    return isEditMode || hasFile
}

export function shouldBlockDuplicateSubmission(submitting: boolean): boolean {
    return submitting
}
