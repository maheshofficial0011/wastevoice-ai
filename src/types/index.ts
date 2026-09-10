export type UserRole = 'reporter' | 'authority' | 'staff'

export type ReportStatus =
    | 'submitted'
    | 'ai_structured'
    | 'under_review'
    | 'assigned'
    | 'before_evidence_uploaded'
    | 'cleaning_in_progress'
    | 'after_evidence_uploaded'
    | 'verification_pending'
    | 'resolved'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

export interface WasteLocation {
    area: string
    description?: string
}

export interface WasteReport {
    id: string
    reporterId: string

    description: string
    location: WasteLocation

    beforeEvidenceUrl?: string

    aiStructuredDescription?: string
    aiSuggestedCategory?: string
    aiConfidence?: number

    status: ReportStatus

    assignedStaffId?: string

    afterEvidenceUrl?: string

    authorityNotes?: string

    createdAt: string
    updatedAt: string
}