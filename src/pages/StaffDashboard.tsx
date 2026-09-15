import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react'
import { supabase } from '../lib/supabase'

/* =========================================================
   IMPORTANT

   Change this only if your Supabase Storage bucket has
   a different name.

   ========================================================= */

const EVIDENCE_BUCKET = 'waste-evidence'

type TaskStatus =
    | 'assigned'
    | 'in_progress'
    | 'under_review'
    | 'resolved'
    | 'rejected'
    /* Legacy values kept only so old rows can still render safely. */
    | 'cleaning_in_progress'
    | 'pending_verification'

interface WasteReport {
    id: string
    location: string | null
    description: string | null
    evidence_url: string | null
    status: TaskStatus | string
    created_at: string
}

interface ReportAssignment {
    id: string
    report_id: string
    staff_id: string
    assigned_at: string | null
    completed_at: string | null

    reports: WasteReport | WasteReport[] | null
}

interface ReportEvidence {
    id: string
    report_id: string
    evidence_type: string
    file_path: string
    uploaded_by: string | null
    created_at: string
}

interface AuthorityReview {
    id: string
    report_id: string
    authority_id: string
    decision: 'approved' | 'rejected'
    reason: string | null
    notes: string | null
    created_at: string
}

type StatusFilter =
    | 'all'
    | 'action_required'
    | 'assigned'
    | 'cleaning_in_progress'
    | 'pending_verification'
    | 'rejected'
    | 'resolved'

type EvidenceFilter =
    | 'all'
    | 'missing_after'
    | 'after_uploaded'
    | 'before_missing'

type SortField =
    | 'priority'
    | 'assigned_at'
    | 'created_at'
    | 'location'
    | 'status'
    | 'evidence_at'

type TaskTab = 'active' | 'resolved'

type EvidencePreview = {
    url: string
    title: string
    kind: 'before' | 'after'
}

type EvidenceComparison = {
    beforeUrl: string | null
    afterUrl: string | null
    title: string
}


/* =========================================================
   GET REPORT SAFELY
========================================================= */

function getReport(
    assignment: ReportAssignment
): WasteReport | null {

    if (Array.isArray(assignment.reports)) {
        return assignment.reports[0] ?? null
    }

    return assignment.reports ?? null
}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(status: string) {

    switch (status) {

        case 'assigned':
            return 'Assigned'

        case 'in_progress':
        case 'cleaning_in_progress':
            return 'Cleaning In Progress'

        case 'under_review':
        case 'pending_verification':
            return 'Pending Authority Review'

        case 'resolved':
            return 'Resolved'

        case 'rejected':
            return 'Correction Required'

        default:
            return status
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (character) =>
                    character.toUpperCase()
                )
    }
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
    value: string | null | undefined
) {

    if (!value) {
        return 'Unknown'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return 'Unknown'
    }

    return date.toLocaleString()
}


/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(status: string) {

    switch (status) {

        case 'assigned':
            return `
                border-purple-500/30
                bg-purple-500/20
                text-purple-300
            `

        case 'in_progress':
        case 'cleaning_in_progress':
            return `
                border-orange-500/30
                bg-orange-500/20
                text-orange-300
            `

        case 'under_review':
        case 'pending_verification':
            return `
                border-blue-500/30
                bg-blue-500/20
                text-blue-300
            `

        case 'resolved':
            return `
                border-emerald-500/30
                bg-emerald-500/20
                text-emerald-300
            `

        case 'rejected':
            return `
                border-red-500/30
                bg-red-500/20
                text-red-300
            `

        default:
            return `
                border-slate-500/30
                bg-slate-500/20
                text-slate-300
            `
    }
}


/* =========================================================
   WORKFLOW NORMALIZATION
========================================================= */

function normalizeStatus(status: string): TaskStatus | string {
    if (status === 'in_progress') {
        return 'cleaning_in_progress'
    }

    if (status === 'under_review') {
        return 'pending_verification'
    }

    return status
}


function getPriorityRank(status: string): number {
    switch (normalizeStatus(status)) {
        case 'rejected':
            return 0
        case 'assigned':
            return 1
        case 'cleaning_in_progress':
            return 2
        case 'pending_verification':
            return 3
        case 'resolved':
            return 4
        default:
            return 5
    }
}


function isActionRequired(status: string): boolean {
    const normalized = normalizeStatus(status)

    return (
        normalized === 'assigned' ||
        normalized === 'cleaning_in_progress' ||
        normalized === 'rejected'
    )
}


/* =========================================================
   STAFF DASHBOARD
========================================================= */

function StaffDashboard() {

    const fetchRequestRef = useRef(0)

    const [assignments, setAssignments] =
        useState<ReportAssignment[]>([])

    const [afterEvidence, setAfterEvidence] =
        useState<Record<string, ReportEvidence>>({})

    const [afterEvidenceHistory, setAfterEvidenceHistory] =
        useState<Record<string, ReportEvidence[]>>({})

    const [authorityReviews, setAuthorityReviews] =
        useState<Record<string, AuthorityReview[]>>({})

    const [searchQuery, setSearchQuery] =
        useState('')

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>('all')

    const [evidenceFilter, setEvidenceFilter] =
        useState<EvidenceFilter>('all')

    const [sortField, setSortField] =
        useState<SortField>('priority')

    const [sortAscending, setSortAscending] =
        useState(true)

    const [selectedFiles, setSelectedFiles] =
        useState<Record<string, File | null>>({})

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState<string | null>(null)

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null)

    const [actionLoading, setActionLoading] =
        useState<string | null>(null)

    const [uploadingEvidence, setUploadingEvidence] =
        useState<string | null>(null)

    const [activeTab, setActiveTab] = useState<TaskTab>('active')
    const [showGuide, setShowGuide] = useState(false)
    const [evidencePreview, setEvidencePreview] = useState<EvidencePreview | null>(null)
    const [evidenceComparison, setEvidenceComparison] = useState<EvidenceComparison | null>(null)
    const [previewZoom, setPreviewZoom] = useState(1)
    const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [isTabPending, startTabTransition] = useTransition()


    function handleTabChange(tab: TaskTab) {
        if (tab === activeTab) return

        startTabTransition(() => {
            setActiveTab(tab)
            setSearchQuery('')
            setStatusFilter('all')
            setEvidenceFilter('all')
            setSortField('priority')
            setSortAscending(true)
        })
    }


    /* =========================================================
       LOAD TASKS
    ========================================================= */

    useEffect(() => {

        void fetchAssignedTasks()

    }, [])


    /* =========================================================
       AUTO REFRESH / KEYBOARD SAFETY
    ========================================================= */

    useEffect(() => {
        const refreshTimer = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                void fetchAssignedTasks({ silent: true })
            }
        }, 30000)

        return () => window.clearInterval(refreshTimer)
    }, [])


    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setEvidencePreview(null)
                setEvidenceComparison(null)
                setPreviewZoom(1)
            }
        }

        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])


    useEffect(() => {
        if (evidencePreview || evidenceComparison) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [evidencePreview, evidenceComparison])


    /* =========================================================
       SUCCESS MESSAGE
    ========================================================= */

    function showSuccess(message: string) {

        setSuccessMessage(message)

        window.setTimeout(() => {

            setSuccessMessage(null)

        }, 4000)
    }


    /* =========================================================
       FETCH ASSIGNED TASKS
    ========================================================= */

    async function fetchAssignedTasks(
        options: { silent?: boolean } = {}
    ) {

        const requestId = ++fetchRequestRef.current
        const silent = options.silent === true

        if (silent) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }
        setError(null)

        try {

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError) throw userError
            if (!user) {
                throw new Error(
                    'You must be logged in to view assigned tasks.'
                )
            }

            const {
                data,
                error: assignmentError,
            } = await supabase
                .from('report_assignments')
                .select(`
                    id,
                    report_id,
                    staff_id,
                    assigned_at,
                    completed_at,
                    reports (
                        id,
                        location,
                        description,
                        evidence_url,
                        status,
                        created_at
                    )
                `)
                .eq('staff_id', user.id)
                .order('assigned_at', { ascending: false })

            if (assignmentError) throw assignmentError

            const loadedAssignments =
                (data ?? []) as unknown as ReportAssignment[]

            const reportIds = loadedAssignments
                .map((assignment) => assignment.report_id)
                .filter(Boolean)

            let evidenceMap: Record<string, ReportEvidence> = {}
            let evidenceHistoryMap: Record<string, ReportEvidence[]> = {}
            let reviewHistoryMap: Record<string, AuthorityReview[]> = {}

            if (reportIds.length > 0) {
                const {
                    data: evidenceData,
                    error: evidenceError,
                } = await supabase
                    .from('report_evidence')
                    .select(`
                        id,
                        report_id,
                        evidence_type,
                        file_path,
                        uploaded_by,
                        created_at
                    `)
                    .in('report_id', reportIds)
                    .eq('evidence_type', 'after_cleaning')
                    .order('created_at', { ascending: false })

                if (evidenceError) {
                    console.error(
                        'Unable to load after-cleaning evidence:',
                        evidenceError
                    )
                } else {
                    for (const evidence of
                        (evidenceData ?? []) as ReportEvidence[]) {

                        if (!evidenceHistoryMap[evidence.report_id]) {
                            evidenceHistoryMap[evidence.report_id] = []
                        }

                        evidenceHistoryMap[evidence.report_id].push(evidence)

                        if (!evidenceMap[evidence.report_id]) {
                            evidenceMap[evidence.report_id] = evidence
                        }
                    }
                }

                /*
                 * Authority feedback is persistent in `authority_reviews`.
                 * Staff can read reviews for reports assigned to them.
                 *
                 * If the table is unavailable, keep the task list usable and
                 * log the error instead of hiding all assigned work.
                 */
                const {
                    data: reviewData,
                    error: reviewError,
                } = await supabase
                    .from('authority_reviews')
                    .select(`
                        id,
                        report_id,
                        authority_id,
                        decision,
                        reason,
                        notes,
                        created_at
                    `)
                    .in('report_id', reportIds)
                    .order('created_at', { ascending: false })

                if (reviewError) {
                    console.error(
                        'Unable to load authority review history:',
                        reviewError
                    )
                } else {
                    for (const review of
                        (reviewData ?? []) as AuthorityReview[]) {

                        if (!reviewHistoryMap[review.report_id]) {
                            reviewHistoryMap[review.report_id] = []
                        }

                        reviewHistoryMap[review.report_id].push(review)
                    }
                }
            }

            /*
             * Ignore a stale response. This prevents an older request from
             * overwriting a status that was just changed by the staff member.
             */
            if (requestId !== fetchRequestRef.current) return

            setAssignments(loadedAssignments)
            setAfterEvidence(evidenceMap)
            setAfterEvidenceHistory(evidenceHistoryMap)
            setAuthorityReviews(reviewHistoryMap)
            setLastRefreshedAt(new Date().toLocaleTimeString())

        } catch (err) {

            if (requestId !== fetchRequestRef.current) return

            console.error(
                'Error loading assigned tasks:',
                err
            )

            setAssignments([])
            setAfterEvidence({})
            setAfterEvidenceHistory({})
            setAuthorityReviews({})

            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to load assigned tasks.'
            )

        } finally {

            if (requestId === fetchRequestRef.current) {
                if (!silent) setLoading(false)
                setRefreshing(false)
            }
        }
    }


    /* =========================================================
       UPDATE TASK STATUS

       IMPORTANT:
       assignment.id is sent to RPC.

       Workflow:

       assigned
       -> cleaning_in_progress

       cleaning_in_progress
       -> pending_verification

       authority later:
       pending_verification
       -> resolved

       IMPORTANT:
       These are the canonical workflow values used by the Staff status RPC. The `reports.status` column in this project is stored as text, so the UI and RPC must agree on these exact strings.
       The UI may display friendly labels such as "Cleaning In Progress"
       and "Pending Authority Review", but the RPC must receive the
       exact enum values.
    ========================================================= */

    async function updateTaskStatus(
        assignmentId: string,
        status:
            | 'cleaning_in_progress'
            | 'pending_verification'
    ) {

        setActionLoading(assignmentId)
        setError(null)
        setSuccessMessage(null)

        try {

            /*
             * IMPORTANT
             *
             * The current Staff RPC accepts the canonical workflow values
             * `cleaning_in_progress` and `pending_verification`. It also
             * normalizes the older aliases `in_progress` and `under_review`.
             * The dashboard sends canonical values to keep the workflow clear.
             */
            const {
                error: updateError,
            } = await supabase.rpc(
                'staff_update_task_status',
                {
                    p_assignment_id: assignmentId,
                    p_status: status,
                }
            )

            if (updateError) {
                throw updateError
            }

            /*
             * Update the UI immediately. The following refresh then reads
             * the authoritative value from Supabase.
             */
            setAssignments((currentAssignments) =>
                currentAssignments.map((assignment) => {
                    if (assignment.id !== assignmentId) {
                        return assignment
                    }

                    const report = getReport(assignment)

                    if (!report) {
                        return assignment
                    }

                    const updatedReport: WasteReport = {
                        ...report,
                        status,
                    }

                    return {
                        ...assignment,
                        reports: Array.isArray(assignment.reports)
                            ? [updatedReport]
                            : updatedReport,
                    }
                })
            )

            if (status === 'cleaning_in_progress') {
                showSuccess('Cleaning started successfully.')
            } else {
                showSuccess(
                    'Cleaning completed and submitted for authority review.'
                )
            }

            /*
             * Reload from the database so counters and cards stay in sync.
             */
            await fetchAssignedTasks()

        } catch (err) {

            console.error(
                'Error updating task status:',
                err
            )

            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to update task status.'
            )

        } finally {

            setActionLoading(null)
        }
    }


    /* =========================================================
       SUBMIT FOR AUTHORITY REVIEW

       Evidence is mandatory. We deliberately validate here instead of
       relying only on a disabled button, so the user receives a clear
       message if they try to submit before uploading evidence.
    ========================================================= */

    async function submitForAuthorityReview(
        assignmentId: string,
        reportId: string
    ) {

        if (!afterEvidence[reportId]) {
            setError(
                'After-cleaning evidence is mandatory. Please upload the evidence before submitting for authority review.'
            )
            return
        }

        await updateTaskStatus(
            assignmentId,
            'pending_verification'
        )
    }


    /* =========================================================
       UPLOAD AFTER-CLEANING EVIDENCE
    ========================================================= */

    async function uploadAfterCleaningEvidence(
        reportId: string
    ) {

        const file =
            selectedFiles[reportId]


        if (!file) {

            setError(
                'Please select an after-cleaning image first.'
            )

            return
        }


        setUploadingEvidence(
            reportId
        )

        setError(null)
        setSuccessMessage(null)

        try {

            /* -------------------------------------------------
               GET CURRENT USER
            ------------------------------------------------- */

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()


            if (userError) {
                throw userError
            }


            if (!user) {

                throw new Error(
                    'You must be logged in to upload evidence.'
                )
            }


            /* -------------------------------------------------
               VERIFY REPORT EXISTS

               This catches an invalid report id before uploading a
               file to Storage and before inserting report evidence.
            ------------------------------------------------- */

            const {
                data: reportExists,
                error: reportLookupError,
            } = await supabase
                .from('reports')
                .select('id')
                .eq('id', reportId)
                .maybeSingle()

            if (reportLookupError) {
                throw reportLookupError
            }

            if (!reportExists) {
                throw new Error(
                    'This task report no longer exists in the reports table. Please refresh the tasks and try again.'
                )
            }


            /* -------------------------------------------------
               VALIDATE IMAGE
            ------------------------------------------------- */

            if (
                !file.type.startsWith(
                    'image/'
                )
            ) {

                throw new Error(
                    'Please upload an image file.'
                )
            }


            /* -------------------------------------------------
               CREATE UNIQUE FILE NAME
            ------------------------------------------------- */

            const extension =
                file.name
                    .split('.')
                    .pop() ||
                'jpg'


            const fileName =
                `${reportId}/after-cleaning-${Date.now()}.${extension}`


            /* -------------------------------------------------
               UPLOAD TO SUPABASE STORAGE
            ------------------------------------------------- */

            const {
                error: uploadError,
            } = await supabase
                .storage
                .from(
                    EVIDENCE_BUCKET
                )
                .upload(
                    fileName,
                    file,
                    {
                        upsert: false,
                    }
                )


            if (uploadError) {
                throw uploadError
            }


            /* -------------------------------------------------
               SAVE EVIDENCE RECORD
            ------------------------------------------------- */

            const {
                data: insertedEvidence,
                error: insertError,
            } = await supabase
                .from(
                    'report_evidence'
                )
                .insert({

                    report_id:
                        reportId,

                    evidence_type:
                        'after_cleaning',

                    file_path:
                        fileName,

                    uploaded_by:
                        user.id,

                })
                .select(`
                    id,
                    report_id,
                    evidence_type,
                    file_path,
                    uploaded_by,
                    created_at
                `)
                .single()


            if (insertError) {

                /*
                 * If database insert fails,
                 * remove the uploaded file.
                 */

                await supabase
                    .storage
                    .from(
                        EVIDENCE_BUCKET
                    )
                    .remove([
                        fileName
                    ])

                throw insertError
            }


            /* -------------------------------------------------
               UPDATE LOCAL STATE
            ------------------------------------------------- */

            const newEvidence =
                insertedEvidence as ReportEvidence

            setAfterEvidence(
                (currentEvidence) => ({
                    ...currentEvidence,
                    [reportId]: newEvidence,
                })
            )

            setAfterEvidenceHistory(
                (currentHistory) => ({
                    ...currentHistory,
                    [reportId]: [
                        newEvidence,
                        ...(currentHistory[reportId] ?? []),
                    ],
                })
            )


            setSelectedFiles(
                (currentFiles) => ({
                    ...currentFiles,

                    [reportId]:
                        null,
                })
            )


            showSuccess(
                'After-cleaning evidence uploaded successfully.'
            )

        } catch (err) {

            console.error(
                'Error uploading evidence:',
                err
            )

            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to upload after-cleaning evidence.'
            )

        } finally {

            setUploadingEvidence(null)
        }
    }


    /* =========================================================
       GET PUBLIC EVIDENCE URL
    ========================================================= */

    function getEvidenceUrl(
        filePath: string
    ) {

        /*
         * Supports an existing full URL too.
         */

        if (
            filePath.startsWith(
                'http://'
            ) ||
            filePath.startsWith(
                'https://'
            )
        ) {

            return filePath
        }


        const {
            data,
        } = supabase
            .storage
            .from(
                EVIDENCE_BUCKET
            )
            .getPublicUrl(
                filePath
            )


        return data.publicUrl
    }


    /* =========================================================
       CREATE VALID TASK LIST
    ========================================================= */

    const taskRows =
        useMemo(() => {

            return assignments
                .map(
                    (assignment) => ({
                        assignment,

                        report:
                            getReport(
                                assignment
                            ),
                    })
                )
                .filter(
                    (
                        item
                    ): item is {
                        assignment:
                        ReportAssignment

                        report:
                        WasteReport
                    } =>
                        item.report !== null
                )

        }, [
            assignments
        ])


    /* =========================================================
       EFFECTIVE WORKFLOW STATUS

       Some existing assignment records can remain `assigned` after an
       authority rejection while the persistent authority review correctly
       records `decision = rejected`. For the Staff UI, the latest rejection
       is the stronger workflow signal: it means the task needs correction.
       Once staff starts correction, the report status becomes
       `cleaning_in_progress` again and this derived state disappears.
    ========================================================= */

    function getEffectiveTaskStatus(report: WasteReport): TaskStatus | string {
        const normalized = normalizeStatus(report.status)
        const latestReview = authorityReviews[report.id]?.[0]

        if (
            normalized === 'assigned' &&
            latestReview?.decision === 'rejected'
        ) {
            return 'rejected'
        }

        return normalized
    }


    /* =========================================================
       SEARCH / FILTER / SORT
    ========================================================= */

    const filteredTaskRows =
        useMemo(() => {

            const query =
                searchQuery
                    .trim()
                    .toLowerCase()

            const filtered =
                taskRows.filter(
                    ({ report }) => {

                        const normalizedStatus =
                            getEffectiveTaskStatus(report)

                        const latestReview =
                            authorityReviews[
                            report.id
                            ]?.[0]

                        const searchableText = [
                            report.id,
                            report.location,
                            report.description,
                            report.status,
                            getStatusLabel(report.status),
                            latestReview?.reason,
                            latestReview?.notes,
                        ]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase()

                        const matchesSearch =
                            query.length === 0 ||
                            searchableText.includes(query)

                        const matchesStatus =
                            statusFilter === 'all' ||
                            (
                                statusFilter === 'action_required' &&
                                isActionRequired(normalizedStatus)
                            ) ||
                            normalizedStatus === statusFilter

                        const latestEvidence =
                            afterEvidence[
                            report.id
                            ]

                        const matchesEvidence =
                            evidenceFilter === 'all' ||
                            (
                                evidenceFilter === 'missing_after' &&
                                !latestEvidence
                            ) ||
                            (
                                evidenceFilter === 'after_uploaded' &&
                                Boolean(latestEvidence)
                            ) ||
                            (
                                evidenceFilter === 'before_missing' &&
                                !report.evidence_url
                            )

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesEvidence
                        )
                    }
                )

            return [...filtered].sort(
                (a, b) => {

                    const aReport = a.report
                    const bReport = b.report

                    let comparison = 0

                    if (sortField === 'priority') {
                        comparison =
                            getPriorityRank(
                                getEffectiveTaskStatus(aReport)
                            ) -
                            getPriorityRank(
                                getEffectiveTaskStatus(bReport)
                            )

                    } else if (sortField === 'assigned_at') {
                        comparison =
                            (
                                new Date(
                                    a.assignment.assigned_at ?? 0
                                ).getTime()
                            ) -
                            (
                                new Date(
                                    b.assignment.assigned_at ?? 0
                                ).getTime()
                            )

                    } else if (sortField === 'created_at') {
                        comparison =
                            (
                                new Date(
                                    aReport.created_at
                                ).getTime()
                            ) -
                            (
                                new Date(
                                    bReport.created_at
                                ).getTime()
                            )

                    } else if (sortField === 'location') {
                        comparison =
                            (
                                aReport.location ??
                                ''
                            ).localeCompare(
                                bReport.location ??
                                '',
                                undefined,
                                {
                                    sensitivity: 'base',
                                }
                            )

                    } else if (sortField === 'status') {
                        comparison =
                            getStatusLabel(
                                aReport.status
                            ).localeCompare(
                                getStatusLabel(
                                    bReport.status
                                ),
                                undefined,
                                {
                                    sensitivity: 'base',
                                }
                            )

                    } else if (sortField === 'evidence_at') {
                        comparison =
                            (
                                new Date(
                                    afterEvidence[
                                        aReport.id
                                    ]?.created_at ??
                                    0
                                ).getTime()
                            ) -
                            (
                                new Date(
                                    afterEvidence[
                                        bReport.id
                                    ]?.created_at ??
                                    0
                                ).getTime()
                            )
                    }

                    if (comparison === 0) {
                        comparison =
                            (
                                new Date(
                                    b.assignment.assigned_at ?? 0
                                ).getTime()
                            ) -
                            (
                                new Date(
                                    a.assignment.assigned_at ?? 0
                                ).getTime()
                            )
                    }

                    return sortAscending
                        ? comparison
                        : -comparison
                }
            )

        }, [
            taskRows,
            searchQuery,
            statusFilter,
            evidenceFilter,
            sortField,
            sortAscending,
            afterEvidence,
            authorityReviews,
        ])


    const activeTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) !== 'resolved'
        )


    const assignedTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) === 'assigned'
        )


    const inProgressTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) === 'cleaning_in_progress'
        )


    const pendingVerificationTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) === 'pending_verification'
        )


    const rejectedTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) === 'rejected'
        )


    const completedTasks =
        taskRows.filter(
            ({ report }) =>
                getEffectiveTaskStatus(report) === 'resolved'
        )


    const tabTaskRows =
        useMemo(() => {
            return filteredTaskRows.filter(({ report }) => {
                const normalized = getEffectiveTaskStatus(report)
                return activeTab === 'resolved'
                    ? normalized === 'resolved'
                    : normalized !== 'resolved'
            })
        }, [filteredTaskRows, activeTab])


    const displayedTaskCount =
        tabTaskRows.length


    /* =========================================================
       UI
    ========================================================= */

    return (

        <main className="
            min-h-screen
            overflow-x-hidden
            bg-slate-950
            px-3
            py-6
            text-white
            sm:px-5
            sm:py-8
            lg:px-6
            lg:py-10
        ">

            <div className="
                mx-auto
                max-w-7xl
                animate-[staffPageIn_420ms_ease-out]
            ">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="
                    mb-8
                    flex
                    flex-col
                    justify-between
                    gap-5
                    lg:flex-row
                    lg:items-center
                ">

                    <div>

                        <p className="
                            mb-2
                            text-sm
                            font-semibold
                            uppercase
                            tracking-widest
                            text-emerald-400
                        ">
                            Cleaning Operations
                        </p>


                        <h1 className="
                            text-4xl
                            font-bold
                        ">
                            Cleaning Staff Dashboard
                        </h1>


                        <p className="
                            mt-3
                            max-w-3xl
                            text-slate-400
                        ">
                            Manage assigned waste-cleaning tasks, find urgent
                            work quickly, upload cleaning evidence and submit
                            completed work for authority verification.
                        </p>

                    </div>


                    <div className="flex w-full shrink-0 flex-wrap items-center justify-start gap-2 lg:w-auto lg:justify-end">
                        <button type="button" onClick={() => setShowGuide((value) => !value)} aria-expanded={showGuide} aria-controls="staff-how-to-use" className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 ${showGuide ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-300'}`}>
                            <span aria-hidden="true">ⓘ</span><span>How to use</span><span className="text-[10px] transition-transform duration-200">{showGuide ? '▲' : '▼'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => void fetchAssignedTasks()}
                            disabled={loading || refreshing}
                            className="group rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-300 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="inline-flex items-center gap-2">
                                <span className={loading || refreshing ? 'animate-spin' : 'transition-transform duration-500 group-hover:rotate-180'} aria-hidden="true">↻</span>
                                {loading || refreshing ? 'Refreshing...' : 'Refresh Tasks'}
                            </span>
                        </button>
                    </div>

                </header>

                <div className="-mt-4 mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 lg:justify-end">
                    <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5">
                        {lastRefreshedAt ? `Last updated ${lastRefreshedAt}` : 'Loading latest tasks'}
                    </span>
                    {refreshing && (
                        <span className="inline-flex items-center gap-2 text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Syncing quietly
                        </span>
                    )}
                </div>


                <div className="mb-6">
                    {showGuide && (
                        <section id="staff-how-to-use" className="mt-4 rounded-2xl border border-emerald-500/20 bg-slate-900 p-5 shadow-lg animate-[guideIn_240ms_ease-out]">
                            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Staff guide</p>
                            <h2 className="mt-1 text-2xl font-bold">How to use the Cleaning Staff Dashboard</h2>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Follow the workflow in order. Staff completes cleaning and evidence submission; authority performs final verification.</p>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="font-semibold text-slate-100">01 · Open an assigned task</p><p className="mt-1 text-sm leading-6 text-slate-400">Use Active Tasks to find work assigned to you.</p></div>
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="font-semibold text-slate-100">02 · Start cleaning</p><p className="mt-1 text-sm leading-6 text-slate-400">Select Start Cleaning. The task moves to Cleaning In Progress.</p></div>
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="font-semibold text-slate-100">03 · Upload after evidence</p><p className="mt-1 text-sm leading-6 text-slate-400">Upload a clear photo after the cleaning work is complete.</p></div>
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="font-semibold text-slate-100">04 · Submit for verification</p><p className="mt-1 text-sm leading-6 text-slate-400">Submit only after current-cycle evidence is available.</p></div>
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"><p className="font-semibold text-purple-300">Assigned</p><p className="mt-1 text-xs text-slate-400">Waiting for staff action.</p></div>
                                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"><p className="font-semibold text-blue-300">Pending Verification</p><p className="mt-1 text-xs text-slate-400">Authority must verify the submitted evidence.</p></div>
                                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"><p className="font-semibold text-red-300">Correction Required</p><p className="mt-1 text-xs text-slate-400">Read feedback, correct the issue, and upload new evidence.</p></div>
                            </div>
                        </section>
                    )}
                </div>

                {/* =================================================
                    ROLE-FOCUSED COUNTERS
                ================================================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl border border-purple-500/20 bg-slate-900 p-5"><p className="text-sm text-slate-400">Assigned</p><p className="mt-2 text-3xl font-bold text-purple-400">{assignedTasks.length}</p><p className="mt-1 text-xs text-slate-500">Ready to start</p></div>
                    <div className="rounded-xl border border-orange-500/20 bg-slate-900 p-5"><p className="text-sm text-slate-400">Cleaning</p><p className="mt-2 text-3xl font-bold text-orange-400">{inProgressTasks.length}</p><p className="mt-1 text-xs text-slate-500">Work in progress</p></div>
                    <div className="rounded-xl border border-blue-500/20 bg-slate-900 p-5"><p className="text-sm text-slate-400">Pending Verification</p><p className="mt-2 text-3xl font-bold text-blue-400">{pendingVerificationTasks.length}</p><p className="mt-1 text-xs text-slate-500">Awaiting authority</p></div>
                    <div className="rounded-xl border border-red-500/20 bg-slate-900 p-5"><p className="text-sm text-slate-400">Correction Required</p><p className="mt-2 text-3xl font-bold text-red-400">{rejectedTasks.length}</p><p className="mt-1 text-xs text-slate-500">Review feedback</p></div>
                    <div className="rounded-xl border border-emerald-500/20 bg-slate-900 p-5"><p className="text-sm text-slate-400">Completed</p><p className="mt-2 text-3xl font-bold text-emerald-400">{completedTasks.length}</p><p className="mt-1 text-xs text-slate-500">Resolved tasks</p></div>
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/10
                        p-4
                        text-red-300
                    ">
                        {error}
                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {successMessage && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-emerald-500/30
                        bg-emerald-500/10
                        p-4
                        text-emerald-300
                    ">
                        {successMessage}
                    </div>

                )}


                {/* =================================================
                    TASKS SECTION
                ================================================= */}

                <section className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900
                    p-6
                ">


                    <div className="
                        mb-6
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                        ">
                            My Assigned Tasks
                        </h2>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-400
                        ">
                            Search, filter and sort the reports using the
                            information currently available in your dashboard.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-emerald-300">
                                {activeTab === 'active' ? 'Action workspace' : 'Completed history'}
                            </span>
                            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400">
                                Viewing: <span className="font-semibold text-slate-200">{activeTab === 'active' ? 'Active tasks' : 'Resolved tasks'}</span>
                            </span>
                            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-500">
                                {tabTaskRows.length} visible
                            </span>
                        </div>

                    </div>


                    {/* =================================================
                        ACTIVE / RESOLVED TABS
                    ================================================= */}

                    <div role="tablist" aria-label="Task status sections" className="mb-6 grid gap-3 sm:grid-cols-2">
                        <button type="button" role="tab" aria-selected={activeTab === 'active'} onClick={() => handleTabChange('active')} className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${activeTab === 'active' ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xl shadow-emerald-950/20' : 'border-slate-800 bg-slate-950 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900'}`}>
                            <span className={`absolute inset-y-0 left-0 w-1 rounded-full transition-opacity ${activeTab === 'active' ? 'bg-emerald-400 opacity-100' : 'bg-slate-700 opacity-0 group-hover:opacity-60'}`} />
                            <div className="flex items-center justify-between gap-3"><div><p className={`text-sm font-semibold ${activeTab === 'active' ? 'text-emerald-300' : 'text-slate-300'}`}>Active Tasks</p><p className="mt-1 text-xs text-slate-500">Assigned, cleaning, verification and correction work</p></div><span className={`min-w-10 rounded-full px-3 py-1 text-center text-xs font-bold transition ${activeTab === 'active' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-300'}`}>{activeTasks.length}</span></div>
                        </button>
                        <button type="button" role="tab" aria-selected={activeTab === 'resolved'} onClick={() => handleTabChange('resolved')} className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${activeTab === 'resolved' ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xl shadow-emerald-950/20' : 'border-slate-800 bg-slate-950 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900'}`}>
                            <span className={`absolute inset-y-0 left-0 w-1 rounded-full transition-opacity ${activeTab === 'resolved' ? 'bg-emerald-400 opacity-100' : 'bg-slate-700 opacity-0 group-hover:opacity-60'}`} />
                            <div className="flex items-center justify-between gap-3"><div><p className={`text-sm font-semibold ${activeTab === 'resolved' ? 'text-emerald-300' : 'text-slate-300'}`}>Resolved Tasks</p><p className="mt-1 text-xs text-slate-500">Completed work verified by authority</p></div><span className={`min-w-10 rounded-full px-3 py-1 text-center text-xs font-bold transition ${activeTab === 'resolved' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-300'}`}>{completedTasks.length}</span></div>
                        </button>
                    </div>

                    {/* =================================================
                        SEARCH / FILTER / SORT TOOLBAR
                    ================================================= */}

                    <div className="
                        mb-6
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-950/90
                        p-4
                        shadow-inner
                        shadow-black/20
                    ">

                        <div className="
                            grid
                            gap-3
                            lg:grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_minmax(170px,1fr)_minmax(200px,1.2fr)_auto]
                        ">

                            <div>
                                <label
                                    htmlFor="staff-task-search"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Search Issues
                                </label>

                                <input
                                    id="staff-task-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Location, issue, report ID, status or feedback..."
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-900
                                        px-4
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-600
                                        focus:border-emerald-500
                                    "
                                />
                            </div>


                            <div>
                                <label
                                    htmlFor="staff-status-filter"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Status
                                </label>

                                <select
                                    id="staff-status-filter"
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value as StatusFilter
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="action_required">Action Required</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="cleaning_in_progress">Cleaning In Progress</option>
                                    <option value="pending_verification">Pending Authority Review</option>
                                    <option value="rejected">Correction Required</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>


                            <div>
                                <label
                                    htmlFor="staff-evidence-filter"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Evidence
                                </label>

                                <select
                                    id="staff-evidence-filter"
                                    value={evidenceFilter}
                                    onChange={(event) =>
                                        setEvidenceFilter(
                                            event.target.value as EvidenceFilter
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                >
                                    <option value="all">All Evidence</option>
                                    <option value="missing_after">Missing After Evidence</option>
                                    <option value="after_uploaded">After Evidence Uploaded</option>
                                    <option value="before_missing">Missing Before Evidence</option>
                                </select>
                            </div>


                            <div>
                                <label
                                    htmlFor="staff-sort-field"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Sort By
                                </label>

                                <select
                                    id="staff-sort-field"
                                    value={sortField}
                                    onChange={(event) =>
                                        setSortField(
                                            event.target.value as SortField
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                >
                                    <option value="priority">Workflow Priority</option>
                                    <option value="assigned_at">Assignment Time</option>
                                    <option value="created_at">Report Created Time</option>
                                    <option value="location">Location</option>
                                    <option value="status">Status</option>
                                    <option value="evidence_at">After Evidence Time</option>
                                </select>
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSortAscending(
                                        (current) => !current
                                    )
                                }
                                className="w-full self-end rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-400 sm:w-auto"
                                title="Toggle sort direction"
                            >
                                {sortAscending
                                    ? '↑ Ascending'
                                    : '↓ Descending'}
                            </button>

                        </div>


                        <div className="
                            mt-4
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-800
                            pt-4
                            text-xs
                            text-slate-500
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <p>
                                Showing{' '}
                                <span className="font-semibold text-slate-300">
                                    {displayedTaskCount}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-slate-300">
                                    {activeTab === 'resolved' ? completedTasks.length : activeTasks.length}
                                </span>{' '}
                                {activeTab === 'resolved' ? 'resolved tasks.' : 'active tasks.'}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('')
                                    setStatusFilter('all')
                                    setEvidenceFilter('all')
                                    setSortField('priority')
                                    setSortAscending(true)
                                }}
                                className="rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-white"
                            >
                                Clear Search & Filters
                            </button>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="
                            py-16
                            text-center
                            text-slate-400
                        ">
                            Loading assigned tasks...
                        </div>

                    )}


                    {/* NO TASKS */}

                    {!loading &&
                        taskRows.length === 0 && (

                            <div className="
                                rounded-xl
                                border
                                border-dashed
                                border-slate-700
                                bg-slate-950
                                py-16
                                text-center
                            ">

                                <h3 className="
                                    text-lg
                                    font-semibold
                                ">
                                    No assigned tasks
                                </h3>


                                <p className="
                                    mt-2
                                    text-slate-400
                                ">
                                    You currently have no waste
                                    reports assigned to you.
                                </p>

                            </div>

                        )}



                    {!loading &&
                        taskRows.length > 0 &&
                        tabTaskRows.length === 0 && (

                            <div className="
                                rounded-xl
                                border
                                border-dashed
                                border-slate-700
                                bg-slate-950
                                py-16
                                text-center
                            ">

                                <h3 className="text-lg font-semibold">
                                    No matching tasks
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    No assigned report matches the current
                                    search and filter conditions.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setStatusFilter('all')
                                        setEvidenceFilter('all')
                                    }}
                                    className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
                                >
                                    Reset Search & Filters
                                </button>

                            </div>

                        )}


                    {/* TASK LIST */}

                    {!loading &&
                        tabTaskRows.length > 0 && (

                            <div id="staff-task-list" className="h-[min(68vh,700px)] min-h-[420px] overflow-y-auto overscroll-contain pr-2 [scrollbar-color:rgba(100,116,139,0.45)_transparent] [scrollbar-width:thin]">
                                <div className={`space-y-5 transition-opacity duration-150 ${isTabPending ? 'opacity-60' : 'opacity-100'}`}>

                                    {tabTaskRows.map(
                                        ({
                                            assignment,
                                            report,
                                        }) => {

                                            const uploadedAfterEvidence =
                                                afterEvidence[
                                                report.id
                                                ]


                                            const afterEvidenceUrl =
                                                uploadedAfterEvidence
                                                    ? getEvidenceUrl(
                                                        uploadedAfterEvidence.file_path
                                                    )
                                                    : null

                                            const evidenceHistory =
                                                afterEvidenceHistory[
                                                report.id
                                                ] ?? []

                                            const reviewHistory =
                                                authorityReviews[
                                                report.id
                                                ] ?? []

                                            const latestReview =
                                                reviewHistory[0] ?? null

                                            const normalizedStatus =
                                                getEffectiveTaskStatus(report)

                                            const latestRejectedReview =
                                                reviewHistory.find(
                                                    (review) =>
                                                        review.decision ===
                                                        'rejected'
                                                ) ?? null

                                            const hasCurrentCycleEvidence =
                                                Boolean(
                                                    uploadedAfterEvidence &&
                                                    (
                                                        normalizedStatus !==
                                                        'cleaning_in_progress' ||
                                                        !latestRejectedReview ||
                                                        new Date(
                                                            uploadedAfterEvidence.created_at
                                                        ).getTime() >
                                                        new Date(
                                                            latestRejectedReview.created_at
                                                        ).getTime()
                                                    )
                                                )

                                            const needsCorrection =
                                                normalizedStatus ===
                                                'rejected'

                                            return (

                                                <article

                                                    key={
                                                        assignment.id
                                                    }

                                                    className="
                                                    rounded-xl
                                                    relative
                                                    border
                                                    border-slate-800
                                                    bg-slate-950
                                                    p-5
                                                    shadow-lg
                                                    shadow-black/10
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-slate-700
                                                "
                                                >


                                                    <div className="
                                                    flex
                                                    flex-col
                                                    gap-6
                                                    lg:flex-row
                                                    lg:justify-between
                                                ">

                                                        {/* =====================
                                                        WORKFLOW PROGRESS
                                                    ====================== */}

                                                        <div className="absolute left-0 right-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-slate-800">
                                                            <div className={`h-full transition-all duration-700 ${normalizedStatus === 'assigned' ? 'w-1/4 bg-purple-400' :
                                                                normalizedStatus === 'cleaning_in_progress' ? 'w-2/4 bg-orange-400' :
                                                                    normalizedStatus === 'pending_verification' ? 'w-3/4 bg-blue-400' :
                                                                        normalizedStatus === 'resolved' ? 'w-full bg-emerald-400' :
                                                                            normalizedStatus === 'rejected' ? 'w-2/4 bg-red-400' : 'w-1/4 bg-slate-500'
                                                                }`} />
                                                        </div>

                                                        {/* =====================
                                                        REPORT INFORMATION
                                                    ====================== */}

                                                        <div className="
                                                        min-w-0
                                                        flex-1
                                                    ">


                                                            <div className="
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-3
                                                        ">

                                                                <h3 className="
                                                                text-xl
                                                                font-semibold
                                                            ">

                                                                    {
                                                                        report.location ||
                                                                        'Unknown location'
                                                                    }

                                                                </h3>


                                                                <span
                                                                    className={`
                                                                    rounded-full
                                                                    border
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${getStatusStyle(
                                                                        report.status
                                                                    )}
                                                                `}
                                                                >

                                                                    {
                                                                        getStatusLabel(
                                                                            report.status
                                                                        )
                                                                    }

                                                                </span>

                                                            </div>


                                                            {/* DESCRIPTION */}

                                                            <p className="
                                                            mt-4
                                                            leading-relaxed
                                                            text-slate-300
                                                        ">

                                                                {
                                                                    report.description ||
                                                                    'No description provided.'
                                                                }

                                                            </p>


                                                            {/* DATES */}

                                                            <div className="
                                                            mt-4
                                                            space-y-1
                                                            text-sm
                                                            text-slate-500
                                                        ">

                                                                <p>

                                                                    Assigned:{' '}

                                                                    {
                                                                        formatDate(
                                                                            assignment.assigned_at
                                                                        )
                                                                    }

                                                                </p>


                                                                {
                                                                    assignment.completed_at && (

                                                                        <p>

                                                                            Completed:{' '}

                                                                            {
                                                                                formatDate(
                                                                                    assignment.completed_at
                                                                                )
                                                                            }

                                                                        </p>

                                                                    )
                                                                }

                                                            </div>


                                                            {/* =====================
                                                            AUTHORITY FEEDBACK
                                                        ====================== */}

                                                            {latestReview && (
                                                                <div className={`
                                                                mt-5
                                                                rounded-xl
                                                                border
                                                                p-4
                                                                ${latestReview.decision === 'rejected'
                                                                        ? 'border-red-500/30 bg-red-500/10'
                                                                        : 'border-emerald-500/30 bg-emerald-500/10'
                                                                    }
                                                            `}>
                                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                                        <p className="text-sm font-semibold text-white">
                                                                            Latest Authority Feedback
                                                                        </p>

                                                                        <span className="text-xs text-slate-500">
                                                                            {formatDate(
                                                                                latestReview.created_at
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                    <p className={`
                                                                    mt-2
                                                                    text-sm
                                                                    font-medium
                                                                    ${latestReview.decision === 'rejected'
                                                                            ? 'text-red-300'
                                                                            : 'text-emerald-300'
                                                                        }
                                                                `}>
                                                                        {latestReview.decision === 'rejected'
                                                                            ? 'Correction requested'
                                                                            : 'Cleaning approved'}
                                                                    </p>

                                                                    {latestReview.reason && (
                                                                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                                                            <span className="font-semibold text-slate-200">
                                                                                Reason:
                                                                            </span>{' '}
                                                                            {latestReview.reason}
                                                                        </p>
                                                                    )}

                                                                    {latestReview.notes && (
                                                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                                                            <span className="font-semibold text-slate-300">
                                                                                Notes:
                                                                            </span>{' '}
                                                                            {latestReview.notes}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}


                                                            {/* =====================
                                                            EVIDENCE HISTORY SUMMARY
                                                        ====================== */}

                                                            {evidenceHistory.length > 0 && (
                                                                <p className="mt-3 text-xs text-slate-500">
                                                                    {evidenceHistory.length}{' '}
                                                                    after-cleaning evidence
                                                                    {evidenceHistory.length === 1 ? '' : ' files'} recorded.
                                                                    Latest: {formatDate(
                                                                        evidenceHistory[0].created_at
                                                                    )}
                                                                </p>
                                                            )}


                                                            {/* =====================
                                                            BEFORE EVIDENCE
                                                        ====================== */}

                                                            {
                                                                report.evidence_url && (

                                                                    <div className="
                                                                    mt-5
                                                                ">

                                                                        <p className="
                                                                        mb-2
                                                                        text-sm
                                                                        font-medium
                                                                        text-slate-400
                                                                    ">
                                                                            Before-Cleaning Evidence
                                                                        </p>


                                                                        <button type="button" onClick={() => setEvidencePreview({ url: report.evidence_url!, title: 'Before-Cleaning Evidence', kind: 'before' })} className="group relative block w-full max-w-xl overflow-hidden rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/70" title="Open full preview">
                                                                            <img src={report.evidence_url} alt="Before cleaning evidence" loading="lazy" decoding="async" className="h-64 w-full rounded-xl border border-slate-700 object-cover transition duration-300 group-hover:scale-[1.01] group-hover:opacity-90 sm:h-72" />
                                                                            <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-200 opacity-0 transition group-hover:opacity-100">Click to view full preview</span>
                                                                        </button>

                                                                    </div>

                                                                )
                                                            }


                                                            {/* =====================
                                                            AFTER EVIDENCE
                                                        ====================== */}

                                                            {
                                                                afterEvidenceUrl && (

                                                                    <div className="
                                                                    mt-6
                                                                ">

                                                                        <p className="
                                                                        mb-2
                                                                        text-sm
                                                                        font-medium
                                                                        text-emerald-400
                                                                    ">
                                                                            After-Cleaning Evidence
                                                                        </p>


                                                                        <button type="button" onClick={() => setEvidencePreview({ url: afterEvidenceUrl!, title: 'After-Cleaning Evidence', kind: 'after' })} className="group relative block w-full max-w-xl overflow-hidden rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/70" title="Open full preview">
                                                                            <img src={afterEvidenceUrl} alt="After cleaning evidence" loading="lazy" decoding="async" className="h-64 w-full rounded-xl border border-emerald-500/30 object-cover transition duration-300 group-hover:scale-[1.01] group-hover:opacity-90 sm:h-72" />
                                                                            <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-200 opacity-0 transition group-hover:opacity-100">Click to view full preview</span>
                                                                        </button>

                                                                    </div>

                                                                )
                                                            }

                                                            {report.evidence_url && afterEvidenceUrl && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEvidenceComparison({ beforeUrl: report.evidence_url, afterUrl: afterEvidenceUrl, title: report.location || 'Cleaning evidence comparison' })}
                                                                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                                                                >
                                                                    <span aria-hidden="true">↔</span> Compare Before &amp; After
                                                                </button>
                                                            )}


                                                        </div>


                                                        {/* =====================
                                                        TASK ACTIONS
                                                    ====================== */}

                                                        <div className="
                                                        flex
                                                        w-full
                                                        flex-col
                                                        gap-3
                                                        lg:w-64
                                                    ">


                                                            {/* =====================
                                                            START CLEANING
                                                        ====================== */}

                                                            {
                                                                (
                                                                    normalizedStatus ===
                                                                    'assigned' ||
                                                                    normalizedStatus ===
                                                                    'rejected'
                                                                ) && (

                                                                    <button

                                                                        onClick={() =>
                                                                            void updateTaskStatus(
                                                                                assignment.id,
                                                                                'cleaning_in_progress'
                                                                            )
                                                                        }

                                                                        disabled={
                                                                            actionLoading ===
                                                                            assignment.id
                                                                        }

                                                                        className="
                                                                        rounded-lg
                                                                        border
                                                                        border-orange-500/40
                                                                        bg-orange-500/10
                                                                        px-4
                                                                        py-3
                                                                        font-medium
                                                                        text-orange-300
                                                                        transition
                                                                        hover:bg-orange-500/20
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-60
                                                                    "
                                                                    >

                                                                        {
                                                                            actionLoading ===
                                                                                assignment.id
                                                                                ? 'Starting...'
                                                                                : needsCorrection
                                                                                    ? 'Start Correction'
                                                                                    : 'Start Cleaning'
                                                                        }

                                                                    </button>

                                                                )
                                                            }


                                                            {/* =====================
                                                            CLEANING IN PROGRESS
                                                        ====================== */}

                                                            {
                                                                normalizedStatus ===
                                                                'cleaning_in_progress' && (

                                                                    <>


                                                                        {/* FILE SELECT */}

                                                                        <div className="rounded-xl border border-blue-500/30 bg-slate-900 p-4">
                                                                            <p className="mb-1 text-sm font-semibold text-white">
                                                                                After-Cleaning Evidence
                                                                            </p>

                                                                            <p className="mb-3 text-xs text-slate-400">
                                                                                Upload a photo showing the completed cleaning.
                                                                            </p>

                                                                            {/* Hidden native file input */}
                                                                            <input
                                                                                id={`after-cleaning-${report.id}`}
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                onChange={(event) => {
                                                                                    const file =
                                                                                        event.target.files?.[0] ??
                                                                                        null

                                                                                    setSelectedFiles((currentFiles) => ({
                                                                                        ...currentFiles,
                                                                                        [report.id]: file,
                                                                                    }))
                                                                                }}
                                                                            />

                                                                            {/* Always-clickable file chooser */}
                                                                            <label
                                                                                htmlFor={`after-cleaning-${report.id}`}
                                                                                className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                                                                            >
                                                                                📷 Choose After-Cleaning Photo
                                                                            </label>

                                                                            {/* Selected file preview */}
                                                                            {selectedFiles[report.id] && (
                                                                                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950 p-3">
                                                                                    <p className="text-xs text-slate-400">
                                                                                        Selected file
                                                                                    </p>

                                                                                    <p className="mt-1 truncate text-sm text-white">
                                                                                        {selectedFiles[report.id]?.name}
                                                                                    </p>

                                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                                        {Math.round(
                                                                                            (selectedFiles[report.id]?.size ?? 0) / 1024
                                                                                        )} KB
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>


                                                                        {/* UPLOAD BUTTON */}

                                                                        {
                                                                            <button

                                                                                onClick={() =>
                                                                                    void uploadAfterCleaningEvidence(
                                                                                        report.id
                                                                                    )
                                                                                }

                                                                                disabled={
                                                                                    uploadingEvidence ===
                                                                                    report.id ||
                                                                                    !selectedFiles[
                                                                                    report.id
                                                                                    ]
                                                                                }

                                                                                className="
                                                                                    rounded-lg
                                                                                    border
                                                                                    border-blue-500/40
                                                                                    bg-blue-500/10
                                                                                    px-4
                                                                                    py-3
                                                                                    font-medium
                                                                                    text-blue-300
                                                                                    transition
                                                                                    hover:bg-blue-500/20
                                                                                    disabled:cursor-not-allowed
                                                                                    disabled:opacity-50
                                                                                "
                                                                            >

                                                                                {
                                                                                    uploadingEvidence ===
                                                                                        report.id

                                                                                        ? 'Uploading...'

                                                                                        : uploadedAfterEvidence
                                                                                            ? 'Upload New After Evidence'
                                                                                            : 'Upload After Evidence'
                                                                                }

                                                                            </button>
                                                                        }


                                                                        {/* EVIDENCE UPLOADED */}

                                                                        {
                                                                            uploadedAfterEvidence && (

                                                                                <div className="
                                                                                rounded-lg
                                                                                border
                                                                                border-emerald-500/30
                                                                                bg-emerald-500/10
                                                                                px-4
                                                                                py-3
                                                                                text-center
                                                                                text-sm
                                                                                font-medium
                                                                                text-emerald-300
                                                                            ">

                                                                                    ✓ After-cleaning evidence available

                                                                                </div>

                                                                            )
                                                                        }


                                                                        {/* SUBMIT FOR REVIEW */}

                                                                        <button

                                                                            onClick={() =>
                                                                                void submitForAuthorityReview(
                                                                                    assignment.id,
                                                                                    report.id
                                                                                )
                                                                            }

                                                                            disabled={
                                                                                actionLoading ===
                                                                                assignment.id ||
                                                                                !hasCurrentCycleEvidence
                                                                            }

                                                                            className="
                                                                            rounded-lg
                                                                            bg-emerald-500
                                                                            px-4
                                                                            py-3
                                                                            font-semibold
                                                                            text-slate-950
                                                                            transition
                                                                            hover:bg-emerald-400
                                                                            disabled:cursor-not-allowed
                                                                            disabled:opacity-50
                                                                        "
                                                                        >

                                                                            {
                                                                                actionLoading ===
                                                                                    assignment.id

                                                                                    ? 'Submitting...'

                                                                                    : 'Submit for Authority Review'
                                                                            }

                                                                        </button>


                                                                        {
                                                                            !hasCurrentCycleEvidence && (

                                                                                <p className="
                                                                                text-center
                                                                                text-xs
                                                                                text-slate-500
                                                                            ">

                                                                                    {
                                                                                        needsCorrection
                                                                                            ? 'Upload new after-cleaning evidence for this correction before resubmitting.'
                                                                                            : 'After-cleaning evidence is mandatory before submitting.'
                                                                                    }

                                                                                </p>

                                                                            )
                                                                        }


                                                                    </>

                                                                )
                                                            }


                                                            {/* =====================
                                                            PENDING VERIFICATION
                                                        ====================== */}

                                                            {
                                                                normalizedStatus ===
                                                                'pending_verification' && (

                                                                    <div className="
                                                                    rounded-lg
                                                                    border
                                                                    border-blue-500/30
                                                                    bg-blue-500/10
                                                                    px-4
                                                                    py-4
                                                                    text-center
                                                                ">

                                                                        <p className="
                                                                        font-medium
                                                                        text-blue-300
                                                                    ">

                                                                            Submitted for Review

                                                                        </p>


                                                                        <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-400
                                                                    ">

                                                                            Waiting for authority verification.

                                                                        </p>

                                                                    </div>

                                                                )
                                                            }


                                                            {/* =====================
                                                            RESOLVED
                                                        ====================== */}

                                                            {
                                                                normalizedStatus ===
                                                                'resolved' && (

                                                                    <div className="
                                                                    rounded-lg
                                                                    border
                                                                    border-emerald-500/30
                                                                    bg-emerald-500/10
                                                                    px-4
                                                                    py-4
                                                                    text-center
                                                                ">

                                                                        <p className="
                                                                        font-medium
                                                                        text-emerald-300
                                                                    ">

                                                                            ✓ Task Resolved

                                                                        </p>


                                                                        <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-400
                                                                    ">

                                                                            Authority has verified the cleaning.

                                                                        </p>

                                                                    </div>

                                                                )
                                                            }


                                                            {/* =====================
                                                            REJECTED
                                                        ====================== */}

                                                            {
                                                                normalizedStatus ===
                                                                'rejected' && (

                                                                    <div className="
                                                                    rounded-lg
                                                                    border
                                                                    border-red-500/30
                                                                    bg-red-500/10
                                                                    px-4
                                                                    py-4
                                                                    text-center
                                                                ">

                                                                        <p className="
                                                                        font-medium
                                                                        text-red-300
                                                                    ">

                                                                            Correction Required

                                                                        </p>


                                                                        <p className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-slate-400
                                                                    ">

                                                                            Review the authority feedback above, then start correction and upload new evidence.

                                                                        </p>

                                                                        {latestReview?.reason && (
                                                                            <p className="
                                                                            mt-3
                                                                            text-left
                                                                            text-sm
                                                                            leading-relaxed
                                                                            text-red-200
                                                                        ">
                                                                                <span className="font-semibold">
                                                                                    Required correction:
                                                                                </span>{' '}
                                                                                {latestReview.reason}
                                                                            </p>
                                                                        )}

                                                                    </div>

                                                                )
                                                            }


                                                        </div>


                                                    </div>


                                                </article>

                                            )
                                        }
                                    )}

                                </div>
                            </div>

                        )}


                </section>


            </div>


            {/* =================================================
                FULL EVIDENCE PREVIEW
            ================================================= */}

            {evidencePreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 backdrop-blur-md animate-[modalIn_180ms_ease-out]" role="dialog" aria-modal="true" aria-label={evidencePreview.title} onClick={() => { setEvidencePreview(null); setPreviewZoom(1) }}>
                    <div className="relative flex h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/60" onClick={(event) => event.stopPropagation()}>
                        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div className="min-w-0">
                                <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${evidencePreview.kind === 'after' ? 'text-emerald-400' : 'text-blue-400'}`}>Evidence Preview</p>
                                <h2 className="mt-1 truncate text-base font-semibold text-white sm:text-lg">{evidencePreview.title}</h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => setPreviewZoom((value) => Math.max(0.75, Number((value - 0.25).toFixed(2))))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white" aria-label="Zoom out">−</button>
                                <span className="min-w-14 text-center text-xs font-semibold text-slate-500">{Math.round(previewZoom * 100)}%</span>
                                <button type="button" onClick={() => setPreviewZoom((value) => Math.min(2.5, Number((value + 0.25).toFixed(2))))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white" aria-label="Zoom in">+</button>
                                <button type="button" onClick={() => { setEvidencePreview(null); setPreviewZoom(1) }} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:text-white" aria-label="Close evidence preview">✕ Close</button>
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.55),rgba(2,6,23,0.95))] p-3 sm:p-6 [scrollbar-color:rgba(100,116,139,0.45)_transparent] [scrollbar-width:thin]">
                            <div className="flex min-h-full min-w-full items-center justify-center">
                                <img src={evidencePreview.url} alt={evidencePreview.title} draggable="false" className="max-h-[80vh] max-w-none rounded-xl border border-slate-700/70 object-contain shadow-2xl transition-transform duration-200 select-none" style={{ transform: `scale(${previewZoom})` }} />
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-800 px-4 py-2.5 text-[11px] text-slate-500 sm:px-5">
                            <span>Use + / − to zoom</span>
                            <span>Press Esc or click outside to close</span>
                        </div>
                    </div>
                </div>
            )}


            {/* =================================================
                BEFORE / AFTER COMPARISON
            ================================================= */}

            {evidenceComparison && (
                <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/90 p-2 backdrop-blur-md animate-[modalIn_180ms_ease-out]" role="dialog" aria-modal="true" aria-label="Before and after evidence comparison" onClick={() => setEvidenceComparison(null)}>
                    <div className="flex h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">Evidence comparison</p>
                                <h2 className="mt-1 text-lg font-semibold text-white">Before vs After</h2>
                                <p className="mt-1 max-w-2xl truncate text-xs text-slate-500">{evidenceComparison.title}</p>
                            </div>
                            <button type="button" onClick={() => setEvidenceComparison(null)} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:text-white">✕ Close</button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-5 [scrollbar-color:rgba(100,116,139,0.45)_transparent] [scrollbar-width:thin]">
                            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                                <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900">
                                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="text-sm font-semibold text-blue-300">Before Cleaning</span><span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-300">Original evidence</span></div>
                                    <div className="flex min-h-[260px] items-center justify-center overflow-auto bg-black/30 p-3">
                                        {evidenceComparison.beforeUrl ? <button type="button" onClick={() => { setEvidenceComparison(null); setEvidencePreview({ url: evidenceComparison.beforeUrl!, title: 'Before-Cleaning Evidence', kind: 'before' }); setPreviewZoom(1) }} className="group block w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"><img src={evidenceComparison.beforeUrl} alt="Before cleaning evidence" className="max-h-[60vh] w-full rounded-xl object-contain transition duration-300 group-hover:scale-[1.01]" /></button> : <p className="p-8 text-sm text-slate-500">Before evidence unavailable.</p>}
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900">
                                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="text-sm font-semibold text-emerald-300">After Cleaning</span><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">Latest evidence</span></div>
                                    <div className="flex min-h-[260px] items-center justify-center overflow-auto bg-black/30 p-3">
                                        {evidenceComparison.afterUrl ? <button type="button" onClick={() => { setEvidenceComparison(null); setEvidencePreview({ url: evidenceComparison.afterUrl!, title: 'After-Cleaning Evidence', kind: 'after' }); setPreviewZoom(1) }} className="group block w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50"><img src={evidenceComparison.afterUrl} alt="After cleaning evidence" className="max-h-[60vh] w-full rounded-xl object-contain transition duration-300 group-hover:scale-[1.01]" /></button> : <p className="p-8 text-sm text-slate-500">After evidence unavailable.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 border-t border-slate-800 px-4 py-3 text-center text-xs text-slate-500">Click either image for the full preview. Press Esc to close.</div>
                    </div>
                </div>
            )}


            <style>{`
                @keyframes staffPageIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.985); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

        </main>

    )
}


export default StaffDashboard