import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * WasteVoice AI — Authority Dashboard
 *
 * IMPORTANT WORKFLOW RULES
 * ------------------------
 * 1. `reports` remains the source of the report's current workflow state.
 * 2. Staff work is represented by:
 *      assigned
 *        -> cleaning_in_progress
 *        -> pending_verification
 *        -> resolved
 *      or:
 *        pending_verification -> rejected -> cleaning_in_progress
 *        -> pending_verification -> resolved
 * 3. `under_review` and `in_progress` are legacy aliases that may still
 *    exist in old/demo rows. The UI understands them but does not create
 *    them for the new workflow.
 * 4. Authority approval/rejection MUST go through the
 *    `authority_review_report` RPC. We intentionally do not directly
 *    update `reports.status` for verification decisions.
 * 5. Staff assignment MUST go through `assign_report_to_staff`.
 * 6. After-cleaning evidence is read from `report_evidence`.
 * 7. The original `reports.evidence_url` is retained as the reporter's
 *    original/before evidence fallback so existing reports keep working.
 *
 * This file intentionally keeps the dashboard self-contained so it can
 * replace the current AuthorityDashboard.tsx without introducing another
 * dependency or changing App.tsx routing.
 */

type ReportStatus =
    | 'submitted'
    | 'ai_review'
    | 'pending_authority'
    | 'under_review'
    | 'assigned'
    | 'cleaning_in_progress'
    | 'in_progress'
    | 'pending_verification'
    | 'resolved'
    | 'rejected'
    | string

type ReviewDecision = 'approved' | 'rejected'

type StatusFilter =
    | 'all'
    | 'submitted'
    | 'assigned'
    | 'cleaning_in_progress'
    | 'pending_verification'
    | 'rejected'
    | 'resolved'
    | 'under_review'
    | 'in_progress'

type SortMode =
    | 'workflow'
    | 'newest'
    | 'oldest'
    | 'location_az'
    | 'location_za'
    | 'status'

interface WasteReport {
    id: string
    reporter_id?: string | null
    location: string | null
    description: string | null
    status: ReportStatus
    created_at: string
    updated_at?: string | null
    evidence_url: string | null
}

interface StaffMember {
    id: string
    full_name: string | null
    role?: string | null
}

interface Assignment {
    id?: string
    report_id: string
    staff_id: string
    authority_id: string | null
    assigned_at: string | null
    completed_at: string | null
}

interface Evidence {
    id: string
    report_id: string
    evidence_type: string | null
    file_path: string | null
    uploaded_by: string | null
    created_at: string
}

interface AuthorityReview {
    id: string
    report_id: string
    authority_id: string
    decision: ReviewDecision
    reason: string | null
    notes: string | null
    created_at: string
}

interface StatCardProps {
    title: string
    value: string | number
    subtitle: string
    valueClass?: string
    cardClass?: string
    onClick?: () => void
    active?: boolean
}

interface EvidencePanelProps {
    title: string
    subtitle: string
    url: string | null
    emptyText: string
    accentClass: string
    onPreview: (url: string, title: string) => void
}

interface WorkflowStepProps {
    number: number
    title: string
    description: string
    active: boolean
    current?: boolean
}

interface ReviewHistoryProps {
    reviews: AuthorityReview[]
    formatDate: (date: string | null | undefined) => string
    getStaffName: (id: string | null | undefined) => string
}

interface ReviewFormProps {
    decision: ReviewDecision | null
    setDecision: (value: ReviewDecision | null) => void
    reason: string
    setReason: (value: string) => void
    customReason: string
    setCustomReason: (value: string) => void
    notes: string
    setNotes: (value: string) => void
    submitting: boolean
    canApprove: boolean
    onSubmit: () => void
}

const EVIDENCE_BUCKET = 'waste-evidence'

const CORRECTION_REASONS = [
    'Cleaning is incomplete',
    'Waste is still visible in the reported area',
    'After-cleaning photo is unclear or insufficient',
    'Reported location was not fully addressed',
    'Evidence does not clearly show the completed work',
    'Other',
]

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'cleaning_in_progress', label: 'Cleaning In Progress' },
    { value: 'pending_verification', label: 'Pending Authority Review' },
    { value: 'rejected', label: 'Correction Required' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'under_review', label: 'Legacy Under Review' },
    { value: 'in_progress', label: 'Legacy In Progress' },
]

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
    { value: 'workflow', label: 'Workflow Priority' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'location_az', label: 'Location A–Z' },
    { value: 'location_za', label: 'Location Z–A' },
    { value: 'status', label: 'Status' },
]

const WORKFLOW_PRIORITY: Record<string, number> = {
    submitted: 10,
    ai_review: 15,
    pending_authority: 20,
    under_review: 20,
    assigned: 30,
    cleaning_in_progress: 40,
    in_progress: 40,
    rejected: 50,
    pending_verification: 60,
    resolved: 90,
}

function AuthorityDashboard() {
    /* ============================================================
       PRIMARY DATA
       ============================================================ */

    const [reports, setReports] = useState<WasteReport[]>([])
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [evidence, setEvidence] = useState<Evidence[]>([])
    const [reviews, setReviews] = useState<AuthorityReview[]>([])
    const [dataWarning, setDataWarning] = useState<string | null>(null)

    /* ============================================================
       REQUEST / MESSAGE STATE
       ============================================================ */

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    /* ============================================================
       MODAL / ACTION STATE
       ============================================================ */

    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active')
    const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null)
    const [selectedStaffId, setSelectedStaffId] = useState('')
    const [assigningStaff, setAssigningStaff] = useState(false)
    const [reviewing, setReviewing] = useState(false)

    const [reviewDecision, setReviewDecision] = useState<ReviewDecision | null>(null)
    const [correctionReason, setCorrectionReason] = useState('')
    const [customReason, setCustomReason] = useState('')
    const [authorityNotes, setAuthorityNotes] = useState('')

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewTitle, setPreviewTitle] = useState('Evidence Preview')
    const [previewZoom, setPreviewZoom] = useState(1)
    const [showGuide, setShowGuide] = useState(false)
    const [showEvidenceCompare, setShowEvidenceCompare] = useState(false)
    const [verificationChecks, setVerificationChecks] = useState({
        sameArea: false,
        issueAddressed: false,
        evidenceClear: false,
    })
    const fetchRequestRef = useRef(0)

    /* ============================================================
       SEARCH / FILTER / SORT
       ============================================================ */

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [sortBy, setSortBy] = useState<SortMode>('workflow')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    /* ============================================================
       INITIAL LOAD
       ============================================================ */

    useEffect(() => {
        void fetchDashboardData()

        /*
         * Keep the Authority queue responsive when Staff uploads evidence or
         * another workflow action changes a report. Realtime is used as a
         * fast-path; the lightweight polling fallback keeps the dashboard
         * correct even when Supabase Realtime is not enabled for a table.
         */
        const channel = supabase
            .channel('authority-dashboard-live')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'reports' },
                () => void fetchDashboardData({ silent: true }),
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'report_evidence' },
                () => void fetchDashboardData({ silent: true }),
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'report_assignments' },
                () => void fetchDashboardData({ silent: true }),
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'authority_reviews' },
                () => void fetchDashboardData({ silent: true }),
            )
            .subscribe()

        const refreshTimer = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                void fetchDashboardData({ silent: true })
            }
        }, 15000)

        return () => {
            window.clearInterval(refreshTimer)
            void supabase.removeChannel(channel)
        }
    }, [])

    useEffect(() => {
        if (!previewUrl) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setPreviewUrl(null)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [previewUrl])

    /* ============================================================
       DATA FETCHING
       ============================================================ */

    async function fetchDashboardData(options: { silent?: boolean } = {}) {
        const requestId = ++fetchRequestRef.current
        const silent = options.silent === true

        if (!silent) setLoading(true)
        if (silent) setRefreshing(true)
        setError(null)

        try {
            const [
                reportsResponse,
                staffResponse,
                assignmentsResponse,
                evidenceResponse,
                reviewsResponse,
            ] = await Promise.all([
                supabase
                    .from('reports')
                    .select('*')
                    .order('created_at', { ascending: false }),

                supabase
                    .from('profiles')
                    .select('id, full_name, role')
                    .eq('role', 'staff')
                    .order('full_name', { ascending: true }),

                supabase
                    .from('report_assignments')
                    .select(
                        'id, report_id, staff_id, authority_id, assigned_at, completed_at',
                    )
                    .order('assigned_at', { ascending: false }),

                supabase
                    .from('report_evidence')
                    .select(
                        'id, report_id, evidence_type, file_path, uploaded_by, created_at',
                    )
                    .order('created_at', { ascending: false }),

                supabase
                    .from('authority_reviews')
                    .select(
                        'id, report_id, authority_id, decision, reason, notes, created_at',
                    )
                    .order('created_at', { ascending: false }),
            ])

            /*
             * Reports are the only fatal dependency. Without reports there is
             * nothing meaningful to render. Supporting tables are treated as
             * non-fatal so an RLS problem on one auxiliary table does not blank
             * the entire Authority dashboard.
             */
            if (reportsResponse.error) {
                throw reportsResponse.error
            }

            if (requestId !== fetchRequestRef.current) return

            setReports((reportsResponse.data ?? []) as WasteReport[])

            if (staffResponse.error) {
                console.warn('Authority dashboard staff query:', staffResponse.error)
                setStaffMembers([])
            } else {
                setStaffMembers((staffResponse.data ?? []) as StaffMember[])
            }

            if (assignmentsResponse.error) {
                console.warn(
                    'Authority dashboard assignment query:',
                    assignmentsResponse.error,
                )
                setAssignments([])
            } else {
                setAssignments((assignmentsResponse.data ?? []) as Assignment[])
            }

            if (evidenceResponse.error) {
                console.warn(
                    'Authority dashboard evidence query:',
                    evidenceResponse.error,
                )
                setEvidence([])
            } else {
                setEvidence((evidenceResponse.data ?? []) as Evidence[])
            }

            if (reviewsResponse.error) {
                console.warn(
                    'Authority dashboard review query:',
                    reviewsResponse.error,
                )
                setReviews([])
            } else {
                setReviews((reviewsResponse.data ?? []) as AuthorityReview[])
            }

            const supportingMessages: string[] = []
            if (staffResponse.error) supportingMessages.push(`Staff list unavailable: ${staffResponse.error.message}`)
            if (assignmentsResponse.error) supportingMessages.push(`Assignments unavailable: ${assignmentsResponse.error.message}`)
            if (evidenceResponse.error) supportingMessages.push(`Evidence unavailable: ${evidenceResponse.error.message}`)
            if (reviewsResponse.error) supportingMessages.push(`Review history unavailable: ${reviewsResponse.error.message}`)

            setDataWarning(supportingMessages.length > 0 ? supportingMessages.join(' ') : null)

        } catch (err) {
            if (requestId !== fetchRequestRef.current) return
            console.error('Authority dashboard load error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load authority dashboard data.',
            )
        } finally {
            if (requestId === fetchRequestRef.current) {
                if (!silent) setLoading(false)
                setRefreshing(false)
            }
        }
    }

    async function refreshDashboard() {
        await fetchDashboardData()
    }

    /* ============================================================
       MESSAGE HELPERS
       ============================================================ */

    function showSuccess(message: string) {
        setSuccessMessage(message)
        window.setTimeout(() => setSuccessMessage(null), 4000)
    }

    function clearError() {
        setError(null)
    }

    function closeModal() {
        setSelectedReport(null)
        setSelectedStaffId('')
        setReviewDecision(null)
        setCorrectionReason('')
        setCustomReason('')
        setAuthorityNotes('')
        setPreviewUrl(null)
        setPreviewTitle('Evidence Preview')
        setPreviewZoom(1)
        setShowEvidenceCompare(false)
    }

    function openReport(report: WasteReport) {
        setSelectedReport(report)
        setSelectedStaffId(getAssignedStaff(report.id)?.id ?? '')
        setReviewDecision(null)
        setCorrectionReason('')
        setCustomReason('')
        setAuthorityNotes('')
        setPreviewUrl(null)
        setPreviewTitle('Evidence Preview')
        setPreviewZoom(1)
        setShowEvidenceCompare(false)
        setError(null)
    }

    /* ============================================================
       STATE UPDATE HELPERS
       ============================================================ */

    function updateReportInState(updatedReport: WasteReport) {
        setReports((currentReports) =>
            currentReports.map((report) =>
                report.id === updatedReport.id ? updatedReport : report,
            ),
        )

        setSelectedReport((currentReport) =>
            currentReport && currentReport.id === updatedReport.id
                ? updatedReport
                : currentReport,
        )
    }

    /* ============================================================
       STATUS NORMALIZATION
       ============================================================ */

    function normalizeStatus(status: string | null | undefined): string {
        const value = (status ?? '').trim().toLowerCase()

        switch (value) {
            case 'in_progress':
                return 'cleaning_in_progress'
            case 'under_review':
                return 'pending_verification'
            default:
                return value
        }
    }

    function isResolved(status: string | null | undefined): boolean {
        return normalizeStatus(status) === 'resolved'
    }

    function isAwaitingAuthorityVerification(
        status: string | null | undefined,
    ): boolean {
        const normalized = normalizeStatus(status)
        return normalized === 'pending_verification'
    }

    function isCorrectionRequired(status: string | null | undefined): boolean {
        return normalizeStatus(status) === 'rejected'
    }

    function isCleaning(status: string | null | undefined): boolean {
        return normalizeStatus(status) === 'cleaning_in_progress'
    }

    function isAssigned(status: string | null | undefined): boolean {
        return normalizeStatus(status) === 'assigned'
    }

    function isNewReport(status: string | null | undefined): boolean {
        const normalized = normalizeStatus(status)
        return (
            normalized === 'submitted' ||
            normalized === 'ai_review' ||
            normalized === 'pending_authority'
        )
    }

    function formatStatus(status: string | null | undefined) {
        const normalized = status ?? ''

        switch (normalized) {
            case 'submitted':
                return 'Submitted'
            case 'ai_review':
                return 'AI Review'
            case 'pending_authority':
                return 'Pending Authority'
            case 'under_review':
                return 'Pending Authority Review'
            case 'assigned':
                return 'Assigned'
            case 'in_progress':
                return 'Cleaning In Progress'
            case 'cleaning_in_progress':
                return 'Cleaning In Progress'
            case 'pending_verification':
                return 'Pending Authority Review'
            case 'rejected':
                return 'Correction Required'
            case 'resolved':
                return 'Resolved'
            default:
                return normalized
                    .replaceAll('_', ' ')
                    .replace(/\b\w/g, (character) => character.toUpperCase())
        }
    }

    function getStatusStyle(status: string | null | undefined) {
        switch (normalizeStatus(status)) {
            case 'submitted':
            case 'ai_review':
            case 'pending_authority':
                return 'border-blue-500/30 bg-blue-500/10 text-blue-300'

            case 'assigned':
                return 'border-purple-500/30 bg-purple-500/10 text-purple-300'

            case 'cleaning_in_progress':
                return 'border-orange-500/30 bg-orange-500/10 text-orange-300'

            case 'pending_verification':
                return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'

            case 'rejected':
                return 'border-red-500/30 bg-red-500/10 text-red-300'

            case 'resolved':
                return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'

            default:
                return 'border-slate-600 bg-slate-800 text-slate-300'
        }
    }

    /* ============================================================
       DATE / DISPLAY HELPERS
       ============================================================ */

    function formatDate(date: string | null | undefined) {
        if (!date) return 'Unknown'

        const parsed = new Date(date)

        if (Number.isNaN(parsed.getTime())) {
            return 'Unknown'
        }

        return parsed.toLocaleString()
    }

    function formatRelativeDate(date: string | null | undefined) {
        if (!date) return 'Unknown'

        const parsed = new Date(date)

        if (Number.isNaN(parsed.getTime())) {
            return 'Unknown'
        }

        const difference = Date.now() - parsed.getTime()
        const minutes = Math.floor(difference / 60000)

        if (minutes < 1) return 'just now'
        if (minutes < 60) return `${minutes}m ago`

        const hours = Math.floor(minutes / 60)

        if (hours < 24) return `${hours}h ago`

        const days = Math.floor(hours / 24)

        if (days < 7) return `${days}d ago`

        return parsed.toLocaleDateString()
    }

    function truncateId(id: string) {
        if (id.length <= 12) return id
        return `${id.slice(0, 8)}…${id.slice(-4)}`
    }

    /* ============================================================
       STAFF / ASSIGNMENT HELPERS
       ============================================================ */

    function getAssignment(reportId: string): Assignment | null {
        return (
            assignments
                .filter((assignment) => assignment.report_id === reportId)
                .sort(
                    (a, b) =>
                        new Date(b.assigned_at ?? 0).getTime() -
                        new Date(a.assigned_at ?? 0).getTime(),
                )[0] ?? null
        )
    }

    function getAssignedStaff(reportId: string): StaffMember | null {
        const assignment = getAssignment(reportId)

        if (!assignment) return null

        return (
            staffMembers.find((staff) => staff.id === assignment.staff_id) ?? null
        )
    }

    function getStaffName(staffId: string | null | undefined) {
        if (!staffId) return 'Unknown staff'

        return (
            staffMembers.find((staff) => staff.id === staffId)?.full_name ??
            'Cleaning staff'
        )
    }

    /* ============================================================
       EVIDENCE HELPERS
       ============================================================ */

    function getEvidenceForReport(reportId: string): Evidence[] {
        return evidence
            .filter((item) => item.report_id === reportId)
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
    }

    function getBeforeEvidence(reportId: string): Evidence | null {
        const matching = getEvidenceForReport(reportId).filter((item) => {
            const type = (item.evidence_type ?? '').toLowerCase()
            return (
                type === 'before_cleaning' ||
                type === 'before' ||
                type.includes('before')
            )
        })

        return matching[0] ?? null
    }

    function getAfterEvidence(reportId: string): Evidence | null {
        const matching = getEvidenceForReport(reportId).filter((item) => {
            const type = (item.evidence_type ?? '').toLowerCase()
            return (
                type === 'after_cleaning' ||
                type === 'after' ||
                type.includes('after')
            )
        })

        return matching[0] ?? null
    }

    function getAfterEvidenceHistory(reportId: string): Evidence[] {
        return getEvidenceForReport(reportId).filter((item) => {
            const type = (item.evidence_type ?? '').toLowerCase()
            return (
                type === 'after_cleaning' ||
                type === 'after' ||
                type.includes('after')
            )
        })
    }

    function getEvidenceUrl(item: Evidence | null) {
        if (!item?.file_path) return null

        if (
            item.file_path.startsWith('http://') ||
            item.file_path.startsWith('https://')
        ) {
            return item.file_path
        }

        return supabase.storage
            .from(EVIDENCE_BUCKET)
            .getPublicUrl(item.file_path).data.publicUrl
    }

    function getBeforeEvidenceUrl(report: WasteReport) {
        const structuredEvidence = getBeforeEvidence(report.id)

        if (structuredEvidence) {
            return getEvidenceUrl(structuredEvidence)
        }

        return report.evidence_url
    }

    function getAfterEvidenceUrl(reportId: string) {
        return getEvidenceUrl(getAfterEvidence(reportId))
    }

    function hasAfterEvidence(reportId: string) {
        return Boolean(getAfterEvidence(reportId))
    }

    /* ============================================================
       AUTHORITY REVIEW HELPERS
       ============================================================ */

    function getReviewsForReport(reportId: string): AuthorityReview[] {
        return reviews
            .filter((review) => review.report_id === reportId)
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
    }

    function getLatestReview(reportId: string): AuthorityReview | null {
        return getReviewsForReport(reportId)[0] ?? null
    }

    function getLatestAuthorityFeedback(reportId: string) {
        const review = getLatestReview(reportId)

        if (!review) return null

        return {
            decision: review.decision,
            reason: review.reason,
            notes: review.notes,
            createdAt: review.created_at,
        }
    }

    function getReviewCount(reportId: string) {
        return getReviewsForReport(reportId).length
    }

    /* ============================================================
       WORKFLOW ACTIONS
       ============================================================ */

    /**
     * Legacy compatibility action.
     *
     * We deliberately do NOT expose "Resolve" or arbitrary status mutation.
     * The new authority workflow must only make a verification decision when
     * the report is awaiting verification.
     *
     * For an old `submitted` row, assignment remains the proper route.
     * For an old `under_review` row, the authority can still open it and use
     * the review RPC because the SQL function accepts the legacy value once.
     */
    async function submitAuthorityDecision() {
        if (!selectedReport || !reviewDecision) {
            setError('Choose Approve or Reject before submitting the review.')
            return
        }

        if (!isAwaitingAuthorityVerification(selectedReport.status)) {
            setError(
                `This report is not currently awaiting authority verification. Current status: ${formatStatus(
                    selectedReport.status,
                )}.`,
            )
            return
        }

        let reason: string | null = null

        if (reviewDecision === 'rejected') {
            reason =
                correctionReason === 'Other'
                    ? customReason.trim()
                    : correctionReason.trim()

            if (!reason) {
                setError(
                    'A correction reason is required before rejecting the completed work.',
                )
                return
            }
        }

        const notes = authorityNotes.trim() || null

        setReviewing(true)
        setError(null)

        try {
            const { data, error: reviewError } = await supabase.rpc(
                'authority_review_report',
                {
                    p_report_id: selectedReport.id,
                    p_decision: reviewDecision,
                    p_reason: reason,
                    p_notes: notes,
                },
            )

            if (reviewError) {
                throw reviewError
            }

            /*
             * The RPC returns JSON containing the authoritative new state.
             * We use it when available instead of guessing that the database
             * accepted the transition.
             */
            const rpcResult =
                data && typeof data === 'object'
                    ? (data as {
                        new_status?: string
                        decision?: string
                    })
                    : null

            const newStatus =
                rpcResult?.new_status ??
                (reviewDecision === 'approved' ? 'resolved' : 'rejected')

            updateReportInState({
                ...selectedReport,
                status: newStatus,
                updated_at: new Date().toISOString(),
            })

            await fetchDashboardData()

            if (reviewDecision === 'approved') {
                showSuccess(
                    'Work approved successfully. The report is now resolved.',
                )
            } else {
                showSuccess(
                    'Correction requested. The report has been returned to cleaning staff.',
                )
            }

            setReviewDecision(null)
            setCorrectionReason('')
            setCustomReason('')
            setAuthorityNotes('')
        } catch (err) {
            console.error('Authority review error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to submit the authority decision.',
            )
        } finally {
            setReviewing(false)
        }
    }

    /**
     * Staff assignment remains atomic through the existing RPC.
     *
     * Do not replace this with a direct insert into report_assignments.
     * The existing database function is responsible for keeping assignment
     * creation and report state synchronized.
     */
    async function assignReportToStaff() {
        if (!selectedReport) {
            setError('No report is selected.')
            return
        }

        if (!selectedStaffId) {
            setError('Please select a cleaning staff member.')
            return
        }

        setAssigningStaff(true)
        setError(null)

        try {
            const { error: assignmentError } = await supabase.rpc(
                'assign_report_to_staff',
                {
                    p_report_id: selectedReport.id,
                    p_staff_id: selectedStaffId,
                },
            )

            if (assignmentError) {
                console.error('Assignment RPC error:', {
                    message: assignmentError.message,
                    details: assignmentError.details,
                    hint: assignmentError.hint,
                    code: assignmentError.code,
                })

                throw assignmentError
            }

            const selectedStaff =
                staffMembers.find((staff) => staff.id === selectedStaffId) ?? null

            await fetchDashboardData()

            showSuccess(
                isCorrectionRequired(selectedReport.status)
                    ? `Correction work assigned to ${selectedStaff?.full_name ?? 'cleaning staff'
                    }.`
                    : `Report assigned to ${selectedStaff?.full_name ?? 'cleaning staff'
                    }.`,
            )

            /*
             * Keep the modal open so the authority can immediately see the
             * assignment reflected in the refreshed data.
             */
            setSelectedStaffId(selectedStaffId)
        } catch (err) {
            console.error('Assignment error:', err)
            setError(
                err instanceof Error ? err.message : 'Failed to assign cleaning staff.',
            )
        } finally {
            setAssigningStaff(false)
        }
    }

    /* ============================================================
       SAFE ACTION GUARDS
       ============================================================ */

    function canAssign(report: WasteReport) {
        const status = normalizeStatus(report.status)

        return (
            status === 'submitted' ||
            status === 'ai_review' ||
            status === 'pending_authority' ||
            status === 'rejected' ||
            status === 'under_review'
        )
    }

    function canVerify(report: WasteReport) {
        return isAwaitingAuthorityVerification(report.status)
    }

    /* ============================================================
       SEARCH / FILTER / SORT
       ============================================================ */

    const activeReports = useMemo(
        () => reports.filter((report) => !isResolved(report.status)),
        [reports],
    )

    const resolvedReports = useMemo(
        () => reports.filter((report) => isResolved(report.status)),
        [reports],
    )

    const pendingVerificationReports = useMemo(
        () =>
            reports.filter((report) =>
                isAwaitingAuthorityVerification(report.status),
            ),
        [reports],
    )

    const rejectedReports = useMemo(
        () => reports.filter((report) => isCorrectionRequired(report.status)),
        [reports],
    )

    const assignedReports = useMemo(
        () => reports.filter((report) => isAssigned(report.status)),
        [reports],
    )

    const cleaningReports = useMemo(
        () => reports.filter((report) => isCleaning(report.status)),
        [reports],
    )

    const submittedReports = useMemo(
        () => reports.filter((report) => isNewReport(report.status)),
        [reports],
    )

    const evidenceReadyCount = useMemo(
        () =>
            pendingVerificationReports.filter((report) =>
                hasAfterEvidence(report.id),
            ).length,
        [pendingVerificationReports, evidence],
    )

    const missingVerificationEvidenceCount = useMemo(
        () =>
            pendingVerificationReports.filter(
                (report) => !hasAfterEvidence(report.id),
            ).length,
        [pendingVerificationReports, evidence],
    )

    const displayedReports = useMemo(() => {
        const base =
            activeTab === 'active'
                ? activeReports
                : resolvedReports

        let result = [...base]

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()

            result = result.filter((report) => {
                const assignedStaff = getAssignedStaff(report.id)
                const latestReview = getLatestReview(report.id)

                const searchable = [
                    report.id,
                    report.location,
                    report.description,
                    report.status,
                    formatStatus(report.status),
                    assignedStaff?.full_name,
                    latestReview?.reason,
                    latestReview?.notes,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()

                return searchable.includes(query)
            })
        }

        if (statusFilter !== 'all') {
            result = result.filter((report) => {
                if (statusFilter === 'cleaning_in_progress') {
                    return isCleaning(report.status)
                }

                if (statusFilter === 'pending_verification') {
                    return isAwaitingAuthorityVerification(report.status)
                }

                if (statusFilter === 'rejected') {
                    return isCorrectionRequired(report.status)
                }

                return report.status === statusFilter
            })
        }

        result.sort((a, b) => {
            let comparison = 0

            if (sortBy === 'workflow') {
                const priorityA = WORKFLOW_PRIORITY[normalizeStatus(a.status)] ?? 999
                const priorityB = WORKFLOW_PRIORITY[normalizeStatus(b.status)] ?? 999
                comparison = priorityA - priorityB

                if (comparison === 0) {
                    comparison =
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                }
            } else if (sortBy === 'oldest') {
                comparison =
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            } else if (sortBy === 'location_az') {
                comparison = (a.location ?? '').localeCompare(b.location ?? '')
            } else if (sortBy === 'location_za') {
                comparison = (b.location ?? '').localeCompare(a.location ?? '')
            } else if (sortBy === 'status') {
                comparison = formatStatus(a.status).localeCompare(formatStatus(b.status))
            } else {
                comparison =
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            }

            return sortDirection === 'asc' ? comparison : -comparison
        })

        return result
    }, [
        activeReports,
        resolvedReports,
        activeTab,
        searchQuery,
        statusFilter,
        sortBy,
        sortDirection,
        assignments,
        staffMembers,
        reviews,
    ])

    function clearFilters() {
        setSearchQuery('')
        setStatusFilter('all')
        setSortBy('workflow')
        setSortDirection('desc')
    }

    /* ============================================================
       SUMMARY COUNTS
       ============================================================ */

    const totalCount = reports.length
    const activeCount = activeReports.length
    const submittedCount = submittedReports.length
    const assignedCount = assignedReports.length
    const cleaningCount = cleaningReports.length
    const pendingCount = pendingVerificationReports.length
    const rejectedCount = rejectedReports.length
    const resolvedCount = resolvedReports.length

    /* ============================================================
       MODAL DERIVED DATA
       ============================================================ */

    const selectedBeforeUrl = selectedReport
        ? getBeforeEvidenceUrl(selectedReport)
        : null

    const selectedAfterUrl = selectedReport
        ? getAfterEvidenceUrl(selectedReport.id)
        : null

    const selectedAssignment = selectedReport
        ? getAssignment(selectedReport.id)
        : null

    const selectedAssignedStaff = selectedReport
        ? getAssignedStaff(selectedReport.id)
        : null

    const selectedReviews = selectedReport
        ? getReviewsForReport(selectedReport.id)
        : []

    const selectedAfterHistory = selectedReport
        ? getAfterEvidenceHistory(selectedReport.id)
        : []

    const latestFeedback = selectedReport
        ? getLatestAuthorityFeedback(selectedReport.id)
        : null

    const selectedHasAfterEvidence = Boolean(selectedAfterUrl)

    const selectedCanVerify =
        selectedReport !== null && canVerify(selectedReport)

    const verificationReady =
        verificationChecks.sameArea &&
        verificationChecks.issueAddressed &&
        verificationChecks.evidenceClear

    useEffect(() => {
        setShowEvidenceCompare(Boolean(selectedBeforeUrl && selectedAfterUrl))
        setVerificationChecks({
            sameArea: false,
            issueAddressed: false,
            evidenceClear: false,
        })
    }, [selectedReport?.id, selectedBeforeUrl, selectedAfterUrl])

    /* ============================================================
       RENDER
       ============================================================ */

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
            <style>{`
                @keyframes guideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes compareIn { from { opacity: 0; transform: scale(.985) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
            `}</style>
            <div className="mx-auto max-w-7xl">
                {/* ======================================================
            HEADER
            ====================================================== */}

                <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                            Waste Management Control
                        </p>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Authority Dashboard
                        </h1>

                        <p className="mt-3 max-w-3xl text-slate-400">
                            Review reported waste, assign cleaning staff, inspect
                            before-and-after evidence, request corrections when necessary,
                            and approve completed work before resolution.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowGuide((value) => !value)}
                            aria-expanded={showGuide}
                            aria-controls="authority-how-to-use"
                            className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 ${showGuide ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-300'}`}
                        >
                            <span aria-hidden="true">ⓘ</span>
                            <span>How to use</span>
                            <span className="text-[10px]">{showGuide ? '▲' : '▼'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => void refreshDashboard()}
                            disabled={refreshing || loading}
                            className="group rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="inline-flex items-center gap-2">
                                <span className={refreshing || loading ? 'animate-spin' : 'transition-transform duration-500 group-hover:rotate-180'} aria-hidden="true">↻</span>
                                {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
                            </span>
                        </button>
                    </div>
                </section>

                {showGuide && (
                    <section id="authority-how-to-use" className="mb-7 rounded-2xl border border-emerald-500/20 bg-slate-900 p-5 shadow-xl shadow-black/10 animate-[guideIn_240ms_ease-out]">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Authority guide</p>
                                <h2 className="mt-1 text-2xl font-bold">How to use the Authority Dashboard</h2>
                                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">Follow the workflow from report intake to staff assignment, evidence comparison, and final human verification. Do not approve work without clear after-cleaning evidence.</p>
                            </div>
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] font-semibold text-emerald-300">Use the button above to close</span>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-4">
                            {['Open a report', 'Assign cleaning staff', 'Compare before / after', 'Approve or request correction'].map((title, index) => (
                                <div key={title} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                                    <p className="text-xs font-bold text-emerald-400">0{index + 1}</p>
                                    <p className="mt-2 font-semibold text-slate-100">{title}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">{index === 0 ? 'Review the issue, location, status, and original evidence.' : index === 1 ? 'Select the cleaning staff member and use the atomic assignment action.' : index === 2 ? 'Inspect the original reported condition beside the latest staff evidence.' : 'Approve only when the result is satisfactory; otherwise give a specific correction reason.'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ======================================================
            MESSAGES
            ====================================================== */}

                {successMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
                        <span className="mt-0.5">✓</span>
                        <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">!</span>
                            <p className="max-w-4xl text-sm leading-relaxed">{error}</p>
                        </div>

                        <button
                            onClick={clearError}
                            className="shrink-0 text-sm font-semibold hover:text-white"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {dataWarning && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-5 py-4 text-amber-300">
                        <span className="mt-0.5">⚠</span>
                        <div>
                            <p className="text-sm font-semibold">Some supporting data needs attention</p>
                            <p className="mt-1 text-xs leading-5 text-amber-200/70">{dataWarning}</p>
                        </div>
                    </div>
                )}

                {/* ======================================================
            WORKFLOW HEALTH STRIP
            ====================================================== */}

                <section className="sticky top-0 z-40 mb-6 rounded-2xl border border-slate-700/80 bg-slate-900/98 p-4 shadow-xl shadow-black/25 backdrop-blur-xl md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span><h2 className="text-lg font-semibold">Workflow Health</h2></div>
                            <p className="mt-1 text-xs leading-5 text-slate-500 md:text-sm">
                                Live queue overview — verification is available only after staff submits after-cleaning evidence.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <HealthPill
                                label="New"
                                value={submittedCount}
                                className="border-blue-500/20 bg-blue-500/5 text-blue-300"
                            />

                            <HealthPill
                                label="Cleaning"
                                value={cleaningCount}
                                className="border-orange-500/20 bg-orange-500/5 text-orange-300"
                            />

                            <HealthPill
                                label="Verification"
                                value={pendingCount}
                                className="border-cyan-500/20 bg-cyan-500/5 text-cyan-300"
                            />

                            <HealthPill
                                label="Evidence Gap"
                                value={missingVerificationEvidenceCount}
                                className="border-yellow-500/20 bg-yellow-500/5 text-yellow-300"
                            />
                        </div>
                    </div>
                </section>


                {/* ======================================================
            STATISTICS
            ====================================================== */}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatCard
                        title="Total Reports"
                        value={totalCount}
                        subtitle="All submitted reports"
                    />

                    <StatCard
                        title="Needs Review"
                        value={pendingCount}
                        subtitle={
                            evidenceReadyCount > 0
                                ? `${evidenceReadyCount} evidence-ready`
                                : 'Awaiting completed work'
                        }
                        valueClass="text-cyan-400"
                        cardClass="border-cyan-500/20 bg-cyan-500/5"
                        onClick={() => {
                            setActiveTab('active')
                            setStatusFilter('pending_verification')
                        }}
                        active={statusFilter === 'pending_verification'}
                    />

                    <StatCard
                        title="Assigned"
                        value={assignedCount}
                        subtitle="Staff responsibility assigned"
                        valueClass="text-purple-400"
                        cardClass="border-purple-500/20 bg-purple-500/5"
                        onClick={() => {
                            setActiveTab('active')
                            setStatusFilter('assigned')
                        }}
                        active={statusFilter === 'assigned'}
                    />

                    <StatCard
                        title="Cleaning"
                        value={cleaningCount}
                        subtitle="Cleaning currently underway"
                        valueClass="text-orange-400"
                        cardClass="border-orange-500/20 bg-orange-500/5"
                        onClick={() => {
                            setActiveTab('active')
                            setStatusFilter('cleaning_in_progress')
                        }}
                        active={statusFilter === 'cleaning_in_progress'}
                    />

                    <StatCard
                        title="Correction"
                        value={rejectedCount}
                        subtitle="Returned to staff"
                        valueClass="text-red-400"
                        cardClass="border-red-500/20 bg-red-500/5"
                        onClick={() => {
                            setActiveTab('active')
                            setStatusFilter('rejected')
                        }}
                        active={statusFilter === 'rejected'}
                    />

                    <StatCard
                        title="Resolved"
                        value={resolvedCount}
                        subtitle="Authority-approved reports"
                        valueClass="text-emerald-400"
                        cardClass="border-emerald-500/20 bg-emerald-500/5"
                        onClick={() => {
                            setActiveTab('resolved')
                            setStatusFilter('resolved')
                        }}
                        active={activeTab === 'resolved'}
                    />
                </section>


                {/* ======================================================
            REPORT SECTION
            ====================================================== */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-7">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold">Waste Reports</h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Search by report, location, description, staff member, status,
                                or authority feedback.
                            </p>
                        </div>

                        <div className="text-sm text-slate-500">
                            Showing{' '}
                            <span className="font-semibold text-white">
                                {displayedReports.length}
                            </span>{' '}
                            of {activeTab === 'active' ? activeCount : resolvedCount}
                        </div>
                    </div>

                    {/* ====================================================
              TABS
              ==================================================== */}

                    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5 shadow-inner">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('active')
                                setStatusFilter('all')
                            }}
                            aria-selected={activeTab === 'active'}
                            className={`group relative overflow-hidden rounded-xl px-4 py-3 text-left transition-all duration-300 ${activeTab === 'active' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-300/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <span className="relative z-10 flex items-center justify-between gap-3">
                                <span><span className="block text-sm font-bold">Active reports</span><span className={`mt-0.5 block text-[11px] ${activeTab === 'active' ? 'text-slate-800/70' : 'text-slate-600'}`}>Needs authority action or staff follow-up</span></span>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeTab === 'active' ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{activeCount}</span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('resolved')
                                setStatusFilter('all')
                            }}
                            aria-selected={activeTab === 'resolved'}
                            className={`group relative overflow-hidden rounded-xl px-4 py-3 text-left transition-all duration-300 ${activeTab === 'resolved' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-300/30' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <span className="relative z-10 flex items-center justify-between gap-3">
                                <span><span className="block text-sm font-bold">Resolved reports</span><span className={`mt-0.5 block text-[11px] ${activeTab === 'resolved' ? 'text-slate-800/70' : 'text-slate-600'}`}>Verified and closed by authority</span></span>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeTab === 'resolved' ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{resolvedCount}</span>
                            </span>
                        </button>
                    </div>

                    {/* ====================================================
              SEARCH / FILTER / SORT
              ==================================================== */}

                    <div className="sticky top-0 z-30 -mx-1 mb-4 grid gap-2 rounded-2xl border border-slate-800/90 bg-slate-900/98 p-2 shadow-lg shadow-black/20 backdrop-blur-xl md:grid-cols-2 lg:grid-cols-6">
                        <div className="relative lg:col-span-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search location, report ID, staff, description..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 lg:col-span-2"
                            />

                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value as StatusFilter)
                            }
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                        >
                            {STATUS_FILTERS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortMode)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => setSortDirection((value) => value === 'asc' ? 'desc' : 'asc')}
                            title={sortDirection === 'asc' ? 'Switch to descending order' : 'Switch to ascending order'}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-300"
                        >
                            {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-300"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* ====================================================
              QUICK FILTERS
              ==================================================== */}

                    <div className="mb-6 flex flex-wrap gap-2">
                        <QuickFilter
                            label="Needs Verification"
                            count={pendingCount}
                            active={statusFilter === 'pending_verification'}
                            onClick={() => {
                                setActiveTab('active')
                                setStatusFilter('pending_verification')
                            }}
                        />

                        <QuickFilter
                            label="Correction Required"
                            count={rejectedCount}
                            active={statusFilter === 'rejected'}
                            onClick={() => {
                                setActiveTab('active')
                                setStatusFilter('rejected')
                            }}
                        />

                        <QuickFilter
                            label="Cleaning"
                            count={cleaningCount}
                            active={statusFilter === 'cleaning_in_progress'}
                            onClick={() => {
                                setActiveTab('active')
                                setStatusFilter('cleaning_in_progress')
                            }}
                        />

                        <QuickFilter
                            label="Assigned"
                            count={assignedCount}
                            active={statusFilter === 'assigned'}
                            onClick={() => {
                                setActiveTab('active')
                                setStatusFilter('assigned')
                            }}
                        />
                    </div>

                    {/* ====================================================
              LOADING
              ==================================================== */}

                    {loading && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 py-20 text-center">
                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
                            <p className="text-sm text-slate-400">
                                Loading authority workspace...
                            </p>
                        </div>
                    )}

                    {/* ====================================================
              EMPTY
              ==================================================== */}

                    {!loading && displayedReports.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 py-20 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl">
                                ✓
                            </div>

                            <p className="text-lg font-semibold text-slate-300">
                                No reports found
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Try another tab, search term, or filter.
                            </p>

                            <button
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* ====================================================
              REPORT LIST
              ==================================================== */}

                    {!loading && displayedReports.length > 0 && (
                        <div className="max-h-[min(66vh,720px)] min-h-[420px] overflow-y-auto overscroll-contain pr-2 [scrollbar-color:rgba(100,116,139,0.45)_transparent] [scrollbar-width:thin]">
                            <div className="space-y-4 pb-2">
                                {displayedReports.map((report) => {
                                    const assignedStaff = getAssignedStaff(report.id)
                                    const assignment = getAssignment(report.id)
                                    const beforeUrl = getBeforeEvidenceUrl(report)
                                    const afterUrl = getAfterEvidenceUrl(report.id)
                                    const latestReview = getLatestReview(report.id)
                                    const awaiting = canVerify(report)
                                    const afterReady = Boolean(afterUrl)

                                    return (
                                        <article
                                            key={report.id}
                                            className={`rounded-2xl border bg-slate-950 p-5 transition duration-300 hover:-translate-y-0.5 ${awaiting
                                                ? 'border-cyan-500/20 hover:border-cyan-500/40'
                                                : isCorrectionRequired(report.status)
                                                    ? 'border-red-500/20 hover:border-red-500/40'
                                                    : 'border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    {/* Report identity */}
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-lg font-semibold">
                                                            {report.location || 'Unknown location'}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                                report.status,
                                                            )}`}
                                                        >
                                                            {formatStatus(report.status)}
                                                        </span>

                                                        {awaiting && (
                                                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                                                                Authority action required
                                                            </span>
                                                        )}

                                                        {afterReady && (
                                                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                                After evidence available
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <p className="mt-4 max-w-4xl leading-relaxed text-slate-400">
                                                        {report.description || 'No description provided.'}
                                                    </p>

                                                    {/* Metadata */}
                                                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                                                        <span>
                                                            Report ID:{' '}
                                                            <span className="font-mono text-slate-400">
                                                                {truncateId(report.id)}
                                                            </span>
                                                        </span>

                                                        <span>
                                                            Submitted: {formatDate(report.created_at)}
                                                        </span>

                                                        <span>
                                                            Updated: {formatRelativeDate(report.updated_at)}
                                                        </span>

                                                        {assignedStaff && (
                                                            <span className="text-purple-300">
                                                                Staff: {assignedStaff.full_name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Evidence summary */}
                                                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                                                        <EvidenceSummary
                                                            label="Before evidence"
                                                            available={Boolean(beforeUrl)}
                                                            value={
                                                                beforeUrl
                                                                    ? 'Available'
                                                                    : 'Not available'
                                                            }
                                                        />

                                                        <EvidenceSummary
                                                            label="After evidence"
                                                            available={afterReady}
                                                            value={
                                                                afterReady
                                                                    ? 'Available'
                                                                    : awaiting
                                                                        ? 'Missing'
                                                                        : 'Not submitted'
                                                            }
                                                        />

                                                        <EvidenceSummary
                                                            label="Authority reviews"
                                                            available={getReviewCount(report.id) > 0}
                                                            value={`${getReviewCount(report.id)} review${getReviewCount(report.id) === 1 ? '' : 's'
                                                                }`}
                                                        />
                                                    </div>

                                                    {/* Rejection feedback */}
                                                    {latestReview?.decision === 'rejected' && (
                                                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <p className="text-sm font-semibold text-red-300">
                                                                    Latest correction feedback
                                                                </p>

                                                                <span className="text-xs text-red-400/70">
                                                                    {formatDate(latestReview.created_at)}
                                                                </span>
                                                            </div>

                                                            {latestReview.reason && (
                                                                <p className="mt-2 text-sm text-slate-300">
                                                                    <span className="font-semibold text-red-300">
                                                                        Reason:
                                                                    </span>{' '}
                                                                    {latestReview.reason}
                                                                </p>
                                                            )}

                                                            {latestReview.notes && (
                                                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                                                    <span className="font-semibold text-red-300">
                                                                        Authority notes:
                                                                    </span>{' '}
                                                                    {latestReview.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Assignment status */}
                                                    {assignment && (
                                                        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                                                            <span className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-purple-300">
                                                                {assignment.completed_at
                                                                    ? 'Assignment completed'
                                                                    : 'Assignment open'}
                                                            </span>

                                                            <span className="text-slate-500">
                                                                Assigned {formatRelativeDate(assignment.assigned_at)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action column */}
                                                <div className="flex shrink-0 flex-col gap-3 xl:w-44">
                                                    <button
                                                        onClick={() => openReport(report)}
                                                        className={`rounded-xl px-5 py-3 text-sm font-bold transition ${awaiting
                                                            ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                                            }`}
                                                    >
                                                        {awaiting ? 'Verify Work' : 'Review Report'}
                                                    </button>

                                                    {isCorrectionRequired(report.status) && (
                                                        <span className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-xs font-semibold text-red-300">
                                                            Waiting for staff correction
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* ========================================================
          REPORT REVIEW MODAL
          ======================================================== */}

            {selectedReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal()
                        }
                    }}
                >
                    <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl md:p-7">
                        {/* Modal header */}
                        <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                                    Authority Verification Workspace
                                </p>

                                <h2 className="mt-2 truncate text-2xl font-bold md:text-3xl">
                                    {selectedReport.location || 'Unknown location'}
                                </h2>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                            selectedReport.status,
                                        )}`}
                                    >
                                        {formatStatus(selectedReport.status)}
                                    </span>

                                    <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 font-mono text-xs text-slate-500">
                                        {truncateId(selectedReport.id)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={closeModal}
                                className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                            >
                                Close
                            </button>
                        </div>

                        {/* Workflow visualization */}
                        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold">Report Workflow</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Authority approval is the final human verification step.
                                    </p>
                                </div>

                                {isCorrectionRequired(selectedReport.status) && (
                                    <span className="rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-xs font-semibold text-red-300">
                                        Correction loop
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-3 md:grid-cols-5">
                                <WorkflowStep
                                    number={1}
                                    title="Reported"
                                    description="Issue submitted"
                                    active={true}
                                    current={isNewReport(selectedReport.status)}
                                />

                                <WorkflowStep
                                    number={2}
                                    title="Assigned"
                                    description="Staff selected"
                                    active={[
                                        'assigned',
                                        'cleaning_in_progress',
                                        'in_progress',
                                        'pending_verification',
                                        'under_review',
                                        'rejected',
                                        'resolved',
                                    ].includes(selectedReport.status)}
                                    current={isAssigned(selectedReport.status)}
                                />

                                <WorkflowStep
                                    number={3}
                                    title="Cleaning"
                                    description="Work underway"
                                    active={[
                                        'cleaning_in_progress',
                                        'in_progress',
                                        'pending_verification',
                                        'under_review',
                                        'rejected',
                                        'resolved',
                                    ].includes(selectedReport.status)}
                                    current={isCleaning(selectedReport.status)}
                                />

                                <WorkflowStep
                                    number={4}
                                    title="Verification"
                                    description="Evidence submitted"
                                    active={[
                                        'pending_verification',
                                        'under_review',
                                        'rejected',
                                        'resolved',
                                    ].includes(selectedReport.status)}
                                    current={selectedCanVerify}
                                />

                                <WorkflowStep
                                    number={5}
                                    title="Resolved"
                                    description="Authority approved"
                                    active={isResolved(selectedReport.status)}
                                    current={isResolved(selectedReport.status)}
                                />
                            </div>
                        </section>

                        {/* Description */}
                        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-semibold">Reported Issue</h3>
                                <span className="text-xs text-slate-500">
                                    Submitted {formatDate(selectedReport.created_at)}
                                </span>
                            </div>

                            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-300">
                                {selectedReport.description || 'No description provided.'}
                            </p>
                        </section>

                        {/* Before / after evidence */}
                        <section className="mt-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">
                                    Evidence Comparison
                                </h3>

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="mt-1 max-w-3xl text-sm text-slate-500">
                                        Compare the original reported condition against the latest staff evidence. The comparison is the visual basis for the human verification decision.
                                    </p>
                                    <button
                                        type="button"
                                        disabled={!selectedBeforeUrl || !selectedAfterUrl}
                                        title={!selectedBeforeUrl || !selectedAfterUrl ? 'Both before and after evidence are required for comparison' : 'Open the side-by-side comparison'}
                                        onClick={() => setShowEvidenceCompare((value) => !value)}
                                        className="shrink-0 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-4 py-2.5 text-xs font-bold text-cyan-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {showEvidenceCompare ? 'Hide Side-by-Side' : 'Compare Before & After'}
                                    </button>
                                    <span className="shrink-0 text-[11px] text-slate-600">{selectedBeforeUrl && selectedAfterUrl ? 'Both evidence files ready' : 'Waiting for both evidence files'}</span>
                                </div>
                            </div>

                            {showEvidenceCompare && selectedBeforeUrl && selectedAfterUrl && (
                                <div className="mb-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 animate-[compareIn_260ms_ease-out]">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-bold text-cyan-200">Before / After Decision View</p>
                                            <p className="mt-1 text-xs text-slate-500">Use the same visual area and framing to judge whether the reported condition was actually addressed.</p>
                                        </div>
                                        <span className="rounded-full border border-cyan-500/20 bg-slate-950 px-3 py-1 text-[11px] font-semibold text-cyan-300">Human verification</span>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="overflow-hidden rounded-xl border border-blue-500/20 bg-slate-950">
                                            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="text-xs font-bold uppercase tracking-wider text-blue-300">Before Cleaning</span><span className="text-[11px] text-slate-500">Original condition</span></div>
                                            <div className="flex min-h-[280px] items-center justify-center p-3"><img src={selectedBeforeUrl} alt="Before cleaning evidence" className="max-h-[420px] w-full object-contain" /></div>
                                        </div>
                                        <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-950">
                                            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="text-xs font-bold uppercase tracking-wider text-emerald-300">After Cleaning</span><span className="text-[11px] text-slate-500">Latest staff evidence</span></div>
                                            <div className="flex min-h-[280px] items-center justify-center p-3"><img src={selectedAfterUrl} alt="After cleaning evidence" className="max-h-[420px] w-full object-contain" /></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedBeforeUrl && selectedAfterUrl && (
                                <section className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 animate-[cardIn_260ms_ease-out]">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">Human verification checklist</p>
                                            <h4 className="mt-1 text-base font-bold text-white">Confirm the original condition was actually addressed</h4>
                                            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">Use the side-by-side evidence as the primary visual reference. These checks are an authority judgment, not an AI-generated approval.</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold ${verificationReady ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                                            {verificationReady ? 'Ready to decide' : '3 checks required'}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                                        {[
                                            { key: 'sameArea' as const, label: 'Same reported area', detail: 'The after photo shows the reported location or same visual area.' },
                                            { key: 'issueAddressed' as const, label: 'Issue addressed', detail: 'The reported waste/problem is visibly addressed in the after photo.' },
                                            { key: 'evidenceClear' as const, label: 'Evidence is clear', detail: 'The image is clear enough to support a responsible decision.' },
                                        ].map((item) => (
                                            <label key={item.key} className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${verificationChecks[item.key] ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                                                <span className="flex items-start gap-3">
                                                    <input type="checkbox" checked={verificationChecks[item.key]} onChange={(event) => setVerificationChecks((current) => ({ ...current, [item.key]: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-emerald-500" />
                                                    <span>
                                                        <span className="block text-sm font-semibold text-slate-200">{item.label}</span>
                                                        <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="grid gap-5 lg:grid-cols-2">
                                <EvidencePanel
                                    title="Before Cleaning"
                                    subtitle="Original reported condition"
                                    url={selectedBeforeUrl}
                                    emptyText="No before-cleaning image is available for this report."
                                    accentClass="border-blue-500/20 bg-blue-500/5"
                                    onPreview={(url, title) => {
                                        setPreviewUrl(url)
                                        setPreviewTitle(title)
                                        setPreviewZoom(1)
                                    }}
                                />

                                <EvidencePanel
                                    title="After Cleaning"
                                    subtitle={
                                        selectedHasAfterEvidence
                                            ? 'Latest staff-submitted evidence'
                                            : 'Required before authority approval'
                                    }
                                    url={selectedAfterUrl}
                                    emptyText="After-cleaning evidence has not been submitted yet."
                                    accentClass={
                                        selectedHasAfterEvidence
                                            ? 'border-emerald-500/20 bg-emerald-500/5'
                                            : 'border-yellow-500/20 bg-yellow-500/5'
                                    }
                                    onPreview={(url, title) => {
                                        setPreviewUrl(url)
                                        setPreviewTitle(title)
                                    }}
                                />
                            </div>

                            {/* Evidence history */}
                            {selectedAfterHistory.length > 0 && (
                                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h4 className="font-semibold">
                                                After-Evidence History
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Older submissions are preserved for auditability.
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-400">
                                            {selectedAfterHistory.length} submission
                                            {selectedAfterHistory.length === 1 ? '' : 's'}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {selectedAfterHistory.map((item, index) => {
                                            const url = getEvidenceUrl(item)

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-300">
                                                            {index === 0
                                                                ? 'Latest submission'
                                                                : `Previous submission ${index}`}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Uploaded {formatDate(item.created_at)}
                                                        </p>
                                                    </div>

                                                    {url && (
                                                        <button
                                                            onClick={() => {
                                                                setPreviewUrl(url)
                                                                setPreviewTitle('After-Cleaning Evidence')
                                                            }}
                                                            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
                                                        >
                                                            View Evidence
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Latest feedback */}
                        {latestFeedback && (
                            <section
                                className={`mt-6 rounded-2xl border p-5 ${latestFeedback.decision === 'rejected'
                                    ? 'border-red-500/20 bg-red-500/5'
                                    : 'border-emerald-500/20 bg-emerald-500/5'
                                    }`}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">
                                            Latest Authority Decision
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {formatDate(latestFeedback.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-bold ${latestFeedback.decision === 'rejected'
                                            ? 'border-red-500/20 bg-red-500/10 text-red-300'
                                            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                            }`}
                                    >
                                        {latestFeedback.decision === 'rejected'
                                            ? 'Correction Requested'
                                            : 'Approved'}
                                    </span>
                                </div>

                                {latestFeedback.reason && (
                                    <p className="mt-4 text-sm text-slate-300">
                                        <span className="font-semibold">Reason:</span>{' '}
                                        {latestFeedback.reason}
                                    </p>
                                )}

                                {latestFeedback.notes && (
                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                                        <span className="font-semibold text-slate-300">
                                            Notes:
                                        </span>{' '}
                                        {latestFeedback.notes}
                                    </p>
                                )}
                            </section>
                        )}

                        {/* Assignment */}
                        <section className="mt-6 rounded-2xl border border-purple-500/20 bg-slate-950 p-5">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Cleaning Staff Assignment
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Use the existing atomic assignment workflow.
                                    </p>
                                </div>

                                {selectedAssignedStaff && (
                                    <span className="rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-semibold text-purple-300">
                                        Current: {selectedAssignedStaff.full_name}
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
                                <select
                                    value={selectedStaffId}
                                    onChange={(event) => setSelectedStaffId(event.target.value)}
                                    disabled={isCleaning(selectedReport.status) || isResolved(selectedReport.status)}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select cleaning staff member</option>

                                    {staffMembers.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.full_name || 'Unnamed staff'}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => void assignReportToStaff()}
                                    disabled={
                                        assigningStaff ||
                                        !selectedStaffId ||
                                        !canAssign(selectedReport)
                                    }
                                    className="rounded-xl bg-purple-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {assigningStaff
                                        ? 'Assigning...'
                                        : isCorrectionRequired(selectedReport.status)
                                            ? 'Assign Correction'
                                            : 'Assign Staff'}
                                </button>
                            </div>

                            {staffMembers.length === 0 && (
                                <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
                                    No staff profiles are currently readable by this authority
                                    account. Check the `profiles` RLS policy if staff exist in
                                    Supabase.
                                </div>
                            )}

                            {selectedAssignment && (
                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    <AssignmentInfo
                                        label="Assigned Staff"
                                        value={selectedAssignedStaff?.full_name ?? 'Unknown'}
                                    />

                                    <AssignmentInfo
                                        label="Assigned At"
                                        value={formatDate(selectedAssignment.assigned_at)}
                                    />

                                    <AssignmentInfo
                                        label="Assignment State"
                                        value={
                                            selectedAssignment.completed_at
                                                ? 'Completed'
                                                : 'Open'
                                        }
                                    />
                                </div>
                            )}
                        </section>

                        {/* Verification gate */}
                        {selectedCanVerify && (
                            <section className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-cyan-200">
                                            Authority Verification Required
                                        </h3>

                                        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-400">
                                            Review the before/after evidence and then either approve
                                            the work or return it to staff with a specific correction
                                            reason.
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${selectedHasAfterEvidence
                                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                                            : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300'
                                            }`}
                                    >
                                        {selectedHasAfterEvidence
                                            ? 'Evidence Ready'
                                            : 'Waiting for Evidence'}
                                    </span>
                                </div>

                                {!selectedHasAfterEvidence && (
                                    <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
                                        The database review RPC requires at least one
                                        after-cleaning evidence row uploaded by staff. Approval
                                        and rejection are disabled here until evidence is present.
                                    </div>
                                )}

                                {selectedHasAfterEvidence && (
                                    <div className="mt-5">
                                        <ReviewForm
                                            decision={reviewDecision}
                                            setDecision={setReviewDecision}
                                            reason={correctionReason}
                                            setReason={setCorrectionReason}
                                            customReason={customReason}
                                            setCustomReason={setCustomReason}
                                            notes={authorityNotes}
                                            setNotes={setAuthorityNotes}
                                            submitting={reviewing}
                                            canApprove={verificationReady}
                                            onSubmit={() => void submitAuthorityDecision()}
                                        />
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Non-verification guidance */}
                        {!selectedCanVerify &&
                            !isResolved(selectedReport.status) &&
                            !isCorrectionRequired(selectedReport.status) && (
                                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                                    <h3 className="font-semibold">Next Authority Action</h3>

                                    {isNewReport(selectedReport.status) && (
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            This report has not reached the staff verification stage
                                            yet. Assign a cleaning staff member to start the operational
                                            workflow.
                                        </p>
                                    )}

                                    {isAssigned(selectedReport.status) && (
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            The report is assigned. Wait for staff to start cleaning
                                            and submit after-cleaning evidence.
                                        </p>
                                    )}

                                    {isCleaning(selectedReport.status) && (
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            Cleaning is in progress. No authority resolution action
                                            is available until staff submits verification evidence.
                                        </p>
                                    )}
                                </section>
                            )}

                        {/* Rejected guidance */}
                        {isCorrectionRequired(selectedReport.status) && (
                            <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="font-semibold text-red-200">
                                            Correction Required
                                        </h3>

                                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                                            The authority has rejected the previous verification.
                                            Staff must correct the issue and submit new
                                            after-cleaning evidence before another authority decision
                                            can be made.
                                        </p>
                                    </div>

                                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                                        Staff action required
                                    </span>
                                </div>

                                {latestFeedback?.reason && (
                                    <div className="mt-4 rounded-xl border border-red-500/10 bg-slate-950 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-red-300">
                                            Required correction
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                            {latestFeedback.reason}
                                        </p>
                                    </div>
                                )}

                                {!selectedAssignedStaff && (
                                    <button
                                        onClick={() => {
                                            setError(
                                                'Select a cleaning staff member above before assigning the correction.',
                                            )
                                        }}
                                        className="mt-4 rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/5"
                                    >
                                        Assign correction staff
                                    </button>
                                )}
                            </section>
                        )}

                        {/* Review history */}
                        <section className="mt-6">
                            <ReviewHistory
                                reviews={selectedReviews}
                                formatDate={formatDate}
                                getStaffName={getStaffName}
                            />
                        </section>

                        {/* Modal footer */}
                        <div className="mt-7 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-slate-500">
                                {isResolved(selectedReport.status)
                                    ? 'This report is resolved and cannot be reopened from this dashboard.'
                                    : `${getReviewCount(selectedReport.id)} authority review${getReviewCount(selectedReport.id) === 1 ? '' : 's'
                                    } recorded.`}
                            </div>

                            <button
                                onClick={closeModal}
                                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                            >
                                Close Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
          FULLSCREEN EVIDENCE PREVIEW
          ======================================================== */}

            {previewUrl && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setPreviewUrl(null)
                        }
                    }}
                >
                    <div className="relative flex max-h-[94vh] max-w-6xl flex-col">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">{previewTitle}</p>
                                <p className="mt-1 text-[11px] text-slate-500">Use the controls to inspect evidence detail.</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setPreviewZoom((value) => Math.max(0.6, value - 0.2))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300">−</button>
                                <span className="min-w-14 text-center text-xs font-semibold text-slate-400">{Math.round(previewZoom * 100)}%</span>
                                <button type="button" onClick={() => setPreviewZoom((value) => Math.min(2.4, value + 0.2))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-300">+</button>
                                <button type="button" onClick={() => setPreviewUrl(null)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-red-400 hover:text-white">Close</button>
                            </div>
                        </div>

                        <div className="max-h-[82vh] overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-2">
                            <div className="flex min-h-[60vh] min-w-full items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt={previewTitle}
                                    style={{ transform: `scale(${previewZoom})` }}
                                    className="max-h-[78vh] max-w-full object-contain transition-transform duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

/* ========================================================================
   PRESENTATIONAL COMPONENTS
   ======================================================================== */

function StatCard({
    title,
    value,
    subtitle,
    valueClass = '',
    cardClass = '',
    onClick,
    active = false,
}: StatCardProps) {
    const interactive = Boolean(onClick)

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!interactive}
            className={`w-full rounded-2xl border bg-slate-900 p-5 text-left transition ${active
                ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                : 'border-slate-800'
                } ${cardClass} ${interactive
                    ? 'cursor-pointer hover:-translate-y-0.5 hover:border-slate-600'
                    : 'cursor-default'
                }`}
        >
            <p className="text-sm text-slate-400">{title}</p>

            <p className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {subtitle}
            </p>
        </button>
    )
}

function HealthPill({
    label,
    value,
    className,
}: {
    label: string
    value: number
    className: string
}) {
    return (
        <div className={`min-w-[108px] rounded-xl border px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${className}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                {label}
            </p>
            <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
    )
}

function QuickFilter({
    label,
    count,
    active,
    onClick,
}: {
    label: string
    count: number
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${active
                ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
        >
            {label}
            <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5">
                {count}
            </span>
        </button>
    )
}

function EvidenceSummary({
    label,
    available,
    value,
}: {
    label: string
    available: boolean
    value: string
}) {
    return (
        <div
            className={`rounded-xl border p-3 ${available
                ? 'border-emerald-500/15 bg-emerald-500/5'
                : 'border-slate-800 bg-slate-900'
                }`}
        >
            <p className="text-xs text-slate-500">{label}</p>
            <p
                className={`mt-1 text-sm font-semibold ${available ? 'text-emerald-300' : 'text-slate-400'
                    }`}
            >
                {value}
            </p>
        </div>
    )
}

function AssignmentInfo({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-300">{value}</p>
        </div>
    )
}

function WorkflowStep({
    number,
    title,
    description,
    active,
    current = false,
}: WorkflowStepProps) {
    return (
        <div
            className={`rounded-xl border p-4 ${current
                ? 'border-emerald-400/40 bg-emerald-500/10'
                : active
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-800 bg-slate-950 opacity-50'
                }`}
        >
            <div className="flex items-center gap-3">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${current
                        ? 'bg-emerald-400 text-slate-950'
                        : active
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-900 text-slate-600'
                        }`}
                >
                    {number}
                </span>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200">
                        {title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
            </div>
        </div>
    )
}

function EvidencePanel({
    title,
    subtitle,
    url,
    emptyText,
    accentClass,
    onPreview,
}: EvidencePanelProps) {
    return (
        <div className={`rounded-2xl border p-4 ${accentClass}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                </div>

                <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${url
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                        : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300'
                        }`}
                >
                    {url ? 'Available' : 'Missing'}
                </span>
            </div>

            {url ? (
                <>
                    <button
                        type="button"
                        onClick={() => onPreview(url, title)}
                        className="group relative block min-h-[260px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-left"
                    >
                        <img
                            src={url}
                            alt={title}
                            className="h-[260px] w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => onPreview(url, title)}
                        className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
                    >
                        Open Full Preview · Click image to enlarge
                    </button>
                </>
            ) : (
                <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950 p-6 text-center">
                    <div>
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-600">
                            —
                        </div>

                        <p className="text-sm text-slate-500">{emptyText}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function ReviewForm({
    decision,
    setDecision,
    reason,
    setReason,
    customReason,
    setCustomReason,
    notes,
    setNotes,
    submitting,
    canApprove,
    onSubmit,
}: ReviewFormProps) {
    const rejectionSelected = decision === 'rejected'

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div>
                <h4 className="font-semibold">Verification Decision</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Approval resolves the report. Rejection sends it into the staff
                    correction loop.
                </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => {
                        setDecision('approved')
                        setReason('')
                        setCustomReason('')
                    }}
                    disabled={submitting}
                    className={`rounded-xl border p-4 text-left transition ${decision === 'approved'
                        ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500/30'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                    <p className="font-bold">✓ Approve & Resolve</p>
                    <p className="mt-1 text-xs text-slate-500">
                        The completed work is accepted.
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => setDecision('rejected')}
                    disabled={submitting}
                    className={`rounded-xl border p-4 text-left transition ${decision === 'rejected'
                        ? 'border-red-400/50 bg-red-500/10 text-red-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-red-500/30'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                    <p className="font-bold">↻ Request Correction</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Return the report to cleaning staff.
                    </p>
                </button>
            </div>

            {rejectionSelected && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <label className="block text-sm font-semibold text-red-200">
                        Correction Reason <span className="text-red-400">*</span>
                    </label>

                    <select
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        disabled={submitting}
                        className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-red-400 disabled:opacity-50"
                    >
                        <option value="">Select a reason</option>

                        {CORRECTION_REASONS.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {reason === 'Other' && (
                        <textarea
                            value={customReason}
                            onChange={(event) => setCustomReason(event.target.value)}
                            disabled={submitting}
                            rows={3}
                            placeholder="Describe the correction required..."
                            className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-red-400 disabled:opacity-50"
                        />
                    )}
                </div>
            )}

            {decision && (
                <div className="mt-5">
                    <label className="block text-sm font-semibold text-slate-300">
                        Authority Notes <span className="font-normal text-slate-600">(optional)</span>
                    </label>

                    <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        disabled={submitting}
                        rows={4}
                        placeholder={
                            rejectionSelected
                                ? 'Add practical instructions that will help staff correct the issue...'
                                : 'Add any verification notes for the audit trail...'
                        }
                        className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500 disabled:opacity-50"
                    />
                </div>
            )}

            {decision && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-xl">
                        <p className="text-xs leading-relaxed text-slate-500">
                            This decision will be stored in the authority review history.
                        </p>
                        {decision === 'approved' && !canApprove && (
                            <p className="mt-2 text-xs font-semibold text-amber-300">
                                Complete all three human verification checks before approving.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={
                            submitting ||
                            (decision === 'approved' && !canApprove) ||
                            (rejectionSelected &&
                                (reason === '' ||
                                    (reason === 'Other' && customReason.trim() === '')))
                        }
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${rejectionSelected
                            ? 'bg-red-500 text-white hover:bg-red-400'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            }`}
                    >
                        {submitting
                            ? 'Submitting Decision...'
                            : rejectionSelected
                                ? 'Confirm Correction Request'
                                : 'Confirm Approval & Resolve'}
                    </button>
                </div>
            )}
        </div>
    )
}

function ReviewHistory({
    reviews,
    formatDate,
    getStaffName,
}: ReviewHistoryProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Authority Review History</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Every approval or correction request is preserved.
                    </p>
                </div>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-500">
                    {reviews.length} record{reviews.length === 1 ? '' : 's'}
                </span>
            </div>

            {reviews.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-8 text-center">
                    <p className="text-sm text-slate-500">
                        No authority decisions have been recorded for this report yet.
                    </p>
                </div>
            ) : (
                <div className="relative mt-6 space-y-4">
                    {reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="relative rounded-xl border border-slate-800 bg-slate-900 p-4"
                        >
                            {index < reviews.length - 1 && (
                                <span className="absolute -bottom-5 left-6 hidden h-5 w-px bg-slate-800 sm:block" />
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-bold ${review.decision === 'approved'
                                                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                                                : 'border-red-500/20 bg-red-500/5 text-red-300'
                                                }`}
                                        >
                                            {review.decision === 'approved'
                                                ? 'Approved'
                                                : 'Correction Requested'}
                                        </span>

                                        <span className="text-xs text-slate-500">
                                            by {getStaffName(review.authority_id)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-600">
                                        {formatDate(review.created_at)}
                                    </p>
                                </div>
                            </div>

                            {review.reason && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Reason
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                                        {review.reason}
                                    </p>
                                </div>
                            )}

                            {review.notes && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Notes
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
                                        {review.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


export default AuthorityDashboard
