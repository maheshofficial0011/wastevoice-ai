import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface WasteReport {
    id: string
    location: string | null
    description: string | null
    additional_info: string | null
    status: string
    created_at: string
    updated_at?: string | null
    evidence_url: string | null
}

interface ReportEvidence {
    id: string
    report_id: string
    evidence_type: string | null
    file_path: string | null
    created_at: string
}

interface AuthorityReview {
    id: string
    report_id: string
    decision: 'approved' | 'rejected'
    reason: string | null
    notes: string | null
    created_at: string
}

const EVIDENCE_BUCKET = 'waste-evidence'


function normalizeStatus(status: string) {
    if (status === 'in_progress') return 'cleaning_in_progress'
    if (status === 'under_review') return 'pending_verification'
    return status
}

function statusLabel(status: string) {
    switch (normalizeStatus(status)) {
        case 'submitted':
            return 'Submitted'
        case 'assigned':
            return 'Assigned'
        case 'cleaning_in_progress':
            return 'Cleaning in progress'
        case 'pending_verification':
            return 'Pending verification'
        case 'rejected':
            return 'Correction required'
        case 'resolved':
            return 'Resolved'
        default:
            return status.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    }
}

function statusAccentClass(status: string) {
    switch (normalizeStatus(status)) {
        case 'submitted':
            return 'border-l-blue-400/70'
        case 'assigned':
            return 'border-l-violet-400/70'
        case 'cleaning_in_progress':
            return 'border-l-amber-400/70'
        case 'pending_verification':
            return 'border-l-cyan-400/70'
        case 'rejected':
            return 'border-l-rose-400/70'
        case 'resolved':
            return 'border-l-emerald-400/70'
        default:
            return 'border-l-slate-700'
    }
}

function statusClass(status: string) {
    switch (normalizeStatus(status)) {
        case 'submitted':
            return 'border-blue-400/20 bg-blue-400/10 text-blue-200'
        case 'assigned':
            return 'border-violet-400/20 bg-violet-400/10 text-violet-200'
        case 'cleaning_in_progress':
            return 'border-amber-400/20 bg-amber-400/10 text-amber-200'
        case 'pending_verification':
            return 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200'
        case 'rejected':
            return 'border-rose-400/20 bg-rose-400/10 text-rose-200'
        case 'resolved':
            return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
        default:
            return 'border-slate-700 bg-slate-800 text-slate-300'
    }
}

function formatDate(value: string | null | undefined) {
    if (!value) return 'Unknown'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString()
}

function getEvidenceUrl(item: ReportEvidence | null) {
    if (!item?.file_path) return null
    if (item.file_path.startsWith('http://') || item.file_path.startsWith('https://')) {
        return item.file_path
    }
    return supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(item.file_path).data.publicUrl
}

function Icon({
    name,
    className = 'h-5 w-5',
}: {
    name: 'plus' | 'refresh' | 'search' | 'clock' | 'check' | 'alert' | 'file' | 'arrow' | 'user' | 'shield' | 'copy' | 'help'
    className?: string
}) {
    const common = {
        className,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
    }

    if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
    if (name === 'refresh') return <svg {...common}><path d="M20 11a8.1 8.1 0 0 0-14.9-4L3 10m0-5v5h5M4 13a8.1 8.1 0 0 0 14.9 4L21 14m0 5v-5h-5" /></svg>
    if (name === 'search') return <svg {...common}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.2 4.2" /></svg>
    if (name === 'clock') return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /></svg>
    if (name === 'check') return <svg {...common}><path d="m5 12.5 4.2 4L19 7" /></svg>
    if (name === 'alert') return <svg {...common}><path d="M12 4 3.8 19h16.4L12 4Z" /><path d="M12 9v4m0 3h.01" /></svg>
    if (name === 'file') return <svg {...common}><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h6" /></svg>
    if (name === 'user') return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.7-3.3 2.9-5 6.5-5s5.8 1.7 6.5 5" /></svg>
    if (name === 'shield') return <svg {...common}><path d="M12 3 19 6v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6z" /><path d="m9 12 2 2 4-4" /></svg>
    if (name === 'copy') return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0 2 2v8a2 2 0 0 0 2 2h2" /></svg>
    if (name === 'help') return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M9.7 9.2a2.45 2.45 0 0 1 4.6 1.1c0 1.8-2.3 2-2.3 3.4M12 16.9h.01" /></svg>
    return <svg {...common}><path d="M5 12h13M13 7l5 5-5 5" /></svg>
}



type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom'
type SortKey = 'newest' | 'oldest' | 'activity' | 'location_asc' | 'status'
type ActiveStatusFilter = 'all' | 'submitted' | 'assigned' | 'cleaning_in_progress' | 'pending_verification' | 'rejected'
type EvidenceFilter = 'all' | 'available' | 'missing'
type ResolvedOutcomeFilter = 'all' | 'approved' | 'legacy'
function ReporterDashboard() {
    const [reports, setReports] = useState<WasteReport[]>([])
    const [evidence, setEvidence] = useState<ReportEvidence[]>([])
    const [reviews, setReviews] = useState<AuthorityReview[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dataWarning, setDataWarning] = useState<string | null>(null)
    const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewTitle, setPreviewTitle] = useState('Evidence preview')
    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active')
    const [showGuide, setShowGuide] = useState(false)

    const [activeSearch, setActiveSearch] = useState('')
    const [activeStatus, setActiveStatus] = useState<ActiveStatusFilter>('all')
    const [activeDatePreset, setActiveDatePreset] = useState<DatePreset>('all')
    const [activeFrom, setActiveFrom] = useState('')
    const [activeTo, setActiveTo] = useState('')
    const [activeSort, setActiveSort] = useState<SortKey>('newest')
    const [activeEvidence, setActiveEvidence] = useState<EvidenceFilter>('all')

    const [resolvedSearch, setResolvedSearch] = useState('')
    const [resolvedOutcome, setResolvedOutcome] = useState<ResolvedOutcomeFilter>('all')
    const [resolvedDatePreset, setResolvedDatePreset] = useState<DatePreset>('all')
    const [resolvedFrom, setResolvedFrom] = useState('')
    const [resolvedTo, setResolvedTo] = useState('')
    const [resolvedSort, setResolvedSort] = useState<SortKey>('newest')

    useEffect(() => {
        void fetchMyReports()

        // Keep the reporter view reasonably fresh without forcing the user
        // to manually refresh after staff or authority actions.
        const interval = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                void fetchMyReports(true)
            }
        }, 30000)

        return () => window.clearInterval(interval)
    }, [])

    async function fetchMyReports(silent = false) {
        if (!silent) setLoading(true)
        setError(null)
        setDataWarning(null)

        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError) throw userError
            if (!user) throw new Error('You must be logged in.')

            const { data, error: reportError } = await supabase
                .from('reports')
                .select('*')
                .eq('reporter_id', user.id)
                .order('created_at', { ascending: false })

            if (reportError) throw reportError

            const loadedReports = (data ?? []) as WasteReport[]
            setReports(loadedReports)

            const ids = loadedReports.map((report) => report.id).filter(Boolean)

            if (ids.length === 0) {
                setEvidence([])
                setReviews([])
                setDataWarning(null)
                setLastRefreshedAt(new Date().toISOString())
                return
            }

            const [evidenceResponse, reviewResponse] = await Promise.all([
                supabase
                    .from('report_evidence')
                    .select('id, report_id, evidence_type, file_path, created_at')
                    .in('report_id', ids)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('authority_reviews')
                    .select('id, report_id, decision, reason, notes, created_at')
                    .in('report_id', ids)
                    .order('created_at', { ascending: false }),
            ])

            const supportingDataWarnings: string[] = []

            if (evidenceResponse.error) {
                console.warn('Evidence query:', evidenceResponse.error)
                supportingDataWarnings.push('Evidence history could not be loaded.')
            }

            if (reviewResponse.error) {
                console.warn('Review query:', reviewResponse.error)
                supportingDataWarnings.push('Authority feedback could not be loaded.')
            }

            setEvidence((evidenceResponse.data ?? []) as ReportEvidence[])
            setReviews((reviewResponse.data ?? []) as AuthorityReview[])
            setDataWarning(supportingDataWarnings.length ? supportingDataWarnings.join(' ') : null)
            setLastRefreshedAt(new Date().toISOString())
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'Failed to load reports.')
        } finally {
            if (!silent) setLoading(false)
            setRefreshing(false)
        }
    }

    async function handleRefresh() {
        setRefreshing(true)
        await fetchMyReports()
    }

    async function copyReportId(reportId: string) {
        try {
            await navigator.clipboard.writeText(reportId)
        } catch {
            // Clipboard access is optional; the ID remains visible for manual copy.
        }
    }

    function getLatestAfterEvidence(reportId: string) {
        return (
            evidence
                .filter(
                    (item) =>
                        item.report_id === reportId &&
                        item.evidence_type === 'after_cleaning',
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                )[0] ?? null
        )
    }

    function getLatestBeforeEvidence(reportId: string) {
        return (
            evidence
                .filter(
                    (item) =>
                        item.report_id === reportId &&
                        item.evidence_type === 'before_cleaning',
                )
                .sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                )[0] ?? null
        )
    }

    function getLatestReview(reportId: string) {
        return (
            reviews
                .filter((item) => item.report_id === reportId)
                .sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime(),
                )[0] ?? null
        )
    }

    function getLatestActivityTime(report: WasteReport) {
        const reportTime = new Date(report.updated_at ?? report.created_at).getTime()
        const reviewTime = getLatestReview(report.id)
            ? new Date(getLatestReview(report.id)!.created_at).getTime()
            : 0
        const evidenceTime = getLatestAfterEvidence(report.id)
            ? new Date(getLatestAfterEvidence(report.id)!.created_at).getTime()
            : 0

        return Math.max(reportTime, reviewTime, evidenceTime)
    }

    const counts = useMemo(() => {
        const active = reports.filter((report) => !isResolved(report.status))
        const resolved = reports.filter((report) => isResolved(report.status))

        return {
            total: reports.length,
            active: active.length,
            resolved: resolved.length,
            submitted: reports.filter((report) => normalizeStatus(report.status) === 'submitted').length,
            assigned: reports.filter((report) => normalizeStatus(report.status) === 'assigned').length,
            cleaning: reports.filter((report) => normalizeStatus(report.status) === 'cleaning_in_progress').length,
            verification: reports.filter((report) => normalizeStatus(report.status) === 'pending_verification').length,
            evidenceReady: reports.filter(
                (report) =>
                    normalizeStatus(report.status) === 'pending_verification' &&
                    Boolean(getLatestAfterEvidence(report.id)),
            ).length,
        }
    }, [reports, evidence, reviews])

    const activeReports = useMemo(
        () =>
            buildReportView(
                reports.filter((report) => !isResolved(report.status)),
                {
                    search: activeSearch,
                    status: activeStatus,
                    datePreset: activeDatePreset,
                    from: activeFrom,
                    to: activeTo,
                    sort: activeSort,
                },
                getLatestReview,
                getLatestActivityTime,
            ),
        [reports, activeSearch, activeStatus, activeDatePreset, activeFrom, activeTo, activeSort, reviews, evidence],
    )

    const filteredActiveReports = useMemo(() => {
        if (activeEvidence === 'all') return activeReports

        return activeReports.filter((report) => {
            const hasEvidence = Boolean(getLatestAfterEvidence(report.id))
            return activeEvidence === 'available' ? hasEvidence : !hasEvidence
        })
    }, [activeReports, activeEvidence, evidence])

    const resolvedReports = useMemo(() => {
        const filtered = buildReportView(
            reports.filter((report) => isResolved(report.status)),
            {
                search: resolvedSearch,
                status: 'all',
                datePreset: resolvedDatePreset,
                from: resolvedFrom,
                to: resolvedTo,
                sort: resolvedSort,
            },
            getLatestReview,
            getLatestActivityTime,
        )

        if (resolvedOutcome === 'approved') {
            return filtered.filter((report) => getLatestReview(report.id)?.decision === 'approved')
        }

        if (resolvedOutcome === 'legacy') {
            return filtered.filter((report) => getLatestReview(report.id)?.decision !== 'approved')
        }

        return filtered
    }, [reports, resolvedSearch, resolvedDatePreset, resolvedFrom, resolvedTo, resolvedSort, resolvedOutcome, reviews, evidence])

    const activeHasFilters = Boolean(
        activeSearch ||
        activeStatus !== 'all' ||
        activeDatePreset !== 'all' ||
        activeFrom ||
        activeTo ||
        activeSort !== 'newest' ||
        activeEvidence !== 'all',
    )

    const resolvedHasFilters = Boolean(
        resolvedSearch ||
        resolvedDatePreset !== 'all' ||
        resolvedOutcome !== 'all' ||
        resolvedFrom ||
        resolvedTo ||
        resolvedSort !== 'newest',
    )

    function resetActiveFilters() {
        setActiveSearch('')
        setActiveStatus('all')
        setActiveDatePreset('all')
        setActiveFrom('')
        setActiveTo('')
        setActiveSort('newest')
        setActiveEvidence('all')
    }

    function resetResolvedFilters() {
        setResolvedSearch('')
        setResolvedDatePreset('all')
        setResolvedOutcome('all')
        setResolvedFrom('')
        setResolvedTo('')
        setResolvedSort('newest')
    }

    return (
        <main className="min-h-screen bg-[#020817] text-white">
            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-80 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_62%)]" />
            <style>{`
                @keyframes reportTabIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes guideIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="relative mx-auto max-w-[1480px] px-3 pb-16 pt-4 sm:px-5 sm:pt-6 lg:px-8">
                {/* Page header — intentionally separate from the application's global navbar. */}
                <section className="sticky top-[var(--app-header-height,0px)] z-30 -mx-3 mb-5 border-b border-slate-800/90 bg-[#020817]/95 px-3 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                                    Reporter workspace
                                </span>
                                <span className="text-xs text-slate-600">•</span>
                                <span className="text-xs text-slate-500">Live report tracking</span>
                                {lastRefreshedAt && (
                                    <>
                                        <span className="text-xs text-slate-700">•</span>
                                        <span className="text-xs text-slate-600">Updated {formatDate(lastRefreshedAt)}</span>
                                    </>
                                )}
                            </div>
                            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">My reports</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGuide((value) => !value)}
                                aria-expanded={showGuide}
                                aria-controls="reporter-how-to-use"
                                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${showGuide
                                        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-950/20'
                                        : 'border-slate-700 bg-slate-900/90 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon name="help" className="h-4 w-4" />
                                <span>How to use</span>
                                <span className="text-[10px]">{showGuide ? '▲' : '▼'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleRefresh()}
                                disabled={refreshing}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon name="refresh" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                            <Link
                                to="/reporter/report"
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400"
                            >
                                <Icon name="plus" className="h-4 w-4" />
                                <span>New report</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {showGuide && (
                    <section
                        id="reporter-how-to-use"
                        className="mb-6 overflow-hidden rounded-[24px] border border-emerald-500/20 bg-slate-900/90 shadow-xl shadow-black/20 animate-[guideIn_260ms_ease-out]"
                    >
                        <div className="border-b border-slate-800 bg-emerald-500/[0.04] p-5 sm:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
                                            <Icon name="help" className="h-5 w-5" />
                                        </span>
                                        <h2 className="text-lg font-black text-white sm:text-xl">How to use WasteVoice AI</h2>
                                    </div>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                        Follow these steps to report a campus waste issue, track what happens next, and understand when your report can be edited.
                                    </p>
                                </div>
                                <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                                    Reporter guide
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
                            <GuideStep
                                number="01"
                                title="Create a report"
                                icon="plus"
                                text="Select New report. Enter the location, describe the waste issue clearly, and add optional additional information such as a nearby landmark or exact area."
                            />
                            <GuideStep
                                number="02"
                                title="Add before evidence"
                                icon="file"
                                text="Upload a clear photo showing the waste condition before cleaning. Use a relevant image of the reported issue and review it before submitting."
                            />
                            <GuideStep
                                number="03"
                                title="Review and submit"
                                icon="check"
                                text="Check the location, issue description, additional information, and evidence on the review screen. Submit only after the details are accurate."
                            />
                            <GuideStep
                                number="04"
                                title="Track your report"
                                icon="clock"
                                text="Use Active reports to follow Submitted, Assigned, Cleaning, and Pending verification stages. The report moves to Resolved only after authority approval."
                            />
                        </div>

                        <div className="grid gap-4 border-t border-slate-800 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                            <GuideInfo
                                title="When can I edit?"
                                tone="blue"
                                text="You can edit Location, Issue description, and Additional information only while the report is Submitted. Once workflow processing starts, editing is locked. Original evidence is preserved."
                            />
                            <GuideInfo
                                title="What if correction is required?"
                                tone="rose"
                                text="A red Correction required state means authority did not approve the submitted cleaning result. Read the authority reason and note, then follow the correction cycle."
                            />
                            <GuideInfo
                                title="How do I read the tracker?"
                                tone="cyan"
                                text="Each workflow stage has its own colour: blue Submitted, violet Assigned, amber Cleaning, cyan Verification, and green Resolved. Red marks a correction state."
                            />
                            <GuideInfo
                                title="Use the filters"
                                tone="slate"
                                text="Search by location, description, report ID or feedback. Active reports also support status and evidence filters; both sections support date filtering and sorting."
                            />
                            <GuideInfo
                                title="Evidence matters"
                                tone="slate"
                                text="Before-cleaning evidence documents the original report. Cleaning evidence is submitted by staff and is used for authority verification. Keep evidence relevant to the issue."
                            />
                            <GuideInfo
                                title="Need the latest status?"
                                tone="emerald"
                                text="The dashboard refreshes automatically while visible and also has a Refresh button. Use it after staff or authority actions if you want the latest state immediately."
                            />
                        </div>

                        <div className="border-t border-slate-800 bg-slate-950/50 px-4 py-4 sm:px-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-5 text-slate-500">
                                    <span className="font-bold text-slate-300">Best practice:</span> report what you actually observed, give a specific location, describe the issue clearly, and use relevant evidence.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowGuide(false)}
                                    className="w-fit rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] font-bold text-slate-400 transition hover:border-slate-600 hover:text-white"
                                >
                                    Hide guide
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mb-6 overflow-hidden rounded-[28px] border border-emerald-500/15 bg-slate-900/80 shadow-2xl shadow-black/20 transition duration-500 hover:border-emerald-500/25 hover:shadow-emerald-950/10">
                    <div className="grid lg:grid-cols-[1.25fr_.75fr]">
                        <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
                            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
                            <div className="relative max-w-3xl">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">WasteVoice AI</p>
                                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                                    Make campus problems
                                    <span className="block text-emerald-400">visible and trackable.</span>
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                    Submit an observed waste issue, follow its assignment and cleaning progress,
                                    review authority feedback, and see the final verified outcome.
                                </p>
                                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5">{counts.total} total reports</span>
                                    <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5">{counts.active} active</span>
                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">{counts.resolved} resolved</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 divide-y divide-slate-800 border-t border-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:border-l lg:border-t-0">
                            <MiniMetric label="Active" value={counts.active} helper="Needs action" />
                            <MiniMetric label="Resolved" value={counts.resolved} helper="Verified complete" />
                            <MiniMetric label="Awaiting verification" value={counts.verification} helper="Staff evidence ready" />
                        </div>
                    </div>
                </section>

                {error && (
                    <section className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-rose-400/10 p-2 text-rose-300">
                                <Icon name="alert" className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-rose-200">We could not refresh all report data.</p>
                                <p className="mt-1 break-words text-sm leading-5 text-slate-400">{error}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => void handleRefresh()}
                                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                            >
                                Retry
                            </button>
                        </div>
                    </section>
                )}

                {dataWarning && (
                    <section className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <div className="flex items-start gap-3">
                            <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-amber-200">Some supporting data is unavailable</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{dataWarning} The report list itself is still available.</p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/75 shadow-xl shadow-black/10">
                    <div className="border-b border-slate-800 p-3 sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">My reports</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Switch between active issues and your completed report history.
                                </p>
                            </div>

                            <div
                                role="tablist"
                                aria-label="My report sections"
                                className="grid w-full grid-cols-2 gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5 shadow-inner sm:w-auto sm:min-w-[360px]"
                            >
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === 'active'}
                                    onClick={() => setActiveTab('active')}
                                    className={`group min-h-12 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:min-w-[170px] ${activeTab === 'active'
                                            ? 'scale-[1.01] bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <span>Active reports</span>
                                    <span
                                        className={`ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-black ${activeTab === 'active'
                                                ? 'bg-slate-950/15 text-slate-950'
                                                : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                                            }`}
                                    >
                                        {counts.active}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === 'resolved'}
                                    onClick={() => setActiveTab('resolved')}
                                    className={`group min-h-12 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:min-w-[170px] ${activeTab === 'resolved'
                                            ? 'scale-[1.01] bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <span>Resolved reports</span>
                                    <span
                                        className={`ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-black ${activeTab === 'resolved'
                                                ? 'bg-slate-950/15 text-slate-950'
                                                : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                                            }`}
                                    >
                                        {counts.resolved}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 p-2 sm:p-4">
                        <div key={activeTab} className="animate-[reportTabIn_240ms_ease-out]">
                            {activeTab === 'active' ? (
                                <ReportSection
                                    title="Active reports"
                                    description="Everything that is not resolved stays here — including correction requests."
                                    count={filteredActiveReports.length}
                                    total={counts.active}
                                    search={activeSearch}
                                    onSearch={setActiveSearch}
                                    status={activeStatus}
                                    onStatus={setActiveStatus}
                                    datePreset={activeDatePreset}
                                    onDatePreset={setActiveDatePreset}
                                    dateFrom={activeFrom}
                                    dateTo={activeTo}
                                    onDateFrom={setActiveFrom}
                                    onDateTo={setActiveTo}
                                    sort={activeSort}
                                    onSort={setActiveSort}
                                    evidenceFilter={activeEvidence}
                                    onEvidenceFilter={setActiveEvidence}
                                    hasFilters={activeHasFilters}
                                    onReset={resetActiveFilters}
                                    loading={loading}
                                    reports={filteredActiveReports}
                                    getLatestBeforeEvidence={getLatestBeforeEvidence}
                                    getLatestAfterEvidence={getLatestAfterEvidence}
                                    getLatestReview={getLatestReview}
                                    onPreview={(url, title) => {
                                        setPreviewUrl(url)
                                        setPreviewTitle(title)
                                    }}
                                    onCopyReportId={copyReportId}
                                    emptyTitle="No active reports"
                                    emptyDescription="Resolved reports automatically leave this section. Clear the filters or create a new report if needed."
                                    emptySearch={activeSearch}
                                    active
                                />
                            ) : (
                                <ReportSection
                                    title="Resolved reports"
                                    description="Completed reports are kept here for your history and verification record."
                                    count={resolvedReports.length}
                                    total={counts.resolved}
                                    search={resolvedSearch}
                                    onSearch={setResolvedSearch}
                                    status="all"
                                    onStatus={() => undefined}
                                    datePreset={resolvedDatePreset}
                                    onDatePreset={setResolvedDatePreset}
                                    dateFrom={resolvedFrom}
                                    dateTo={resolvedTo}
                                    onDateFrom={setResolvedFrom}
                                    onDateTo={setResolvedTo}
                                    sort={resolvedSort}
                                    onSort={setResolvedSort}
                                    hasFilters={resolvedHasFilters}
                                    onReset={resetResolvedFilters}
                                    loading={loading}
                                    reports={resolvedReports}
                                    getLatestBeforeEvidence={getLatestBeforeEvidence}
                                    getLatestAfterEvidence={getLatestAfterEvidence}
                                    getLatestReview={getLatestReview}
                                    onPreview={(url, title) => {
                                        setPreviewUrl(url)
                                        setPreviewTitle(title)
                                    }}
                                    onCopyReportId={copyReportId}
                                    emptyTitle="No resolved reports"
                                    emptyDescription="Once authority verifies a cleaning submission, the report automatically moves into this section."
                                    emptySearch={resolvedSearch}
                                    resolvedOutcome={resolvedOutcome}
                                    onResolvedOutcome={setResolvedOutcome}
                                />
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {previewUrl && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
                    onClick={() => setPreviewUrl(null)}
                >
                    <div
                        className="flex max-h-[94vh] w-full max-w-6xl flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-white">{previewTitle}</p>
                                <p className="mt-0.5 text-xs text-slate-500">Evidence preview</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewUrl(null)}
                                className="shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 sm:p-4">
                            <img src={previewUrl} alt={previewTitle} className="max-h-[82vh] max-w-full rounded-xl object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

interface SectionFilters {
    search: string
    status: ActiveStatusFilter
    datePreset: DatePreset
    from: string
    to: string
    sort: SortKey
}

function buildReportView(
    source: WasteReport[],
    filters: SectionFilters,
    getLatestReview: (reportId: string) => AuthorityReview | null,
    getLatestActivityTime: (report: WasteReport) => number,
) {
    const query = filters.search.trim().toLowerCase()
    const dateRange = getDateRange(filters.datePreset, filters.from, filters.to)

    const result = source.filter((report) => {
        const normalized = normalizeStatus(report.status)
        const review = getLatestReview(report.id)

        if (filters.status !== 'all' && normalized !== filters.status) return false

        if (query) {
            const searchable = [
                report.location ?? '',
                report.description ?? '',
                report.additional_info ?? '',
                report.id,
                normalized,
                statusLabel(report.status),
                formatDate(report.created_at),
                review?.reason ?? '',
                review?.notes ?? '',
            ]
                .join(' ')
                .toLowerCase()

            if (!searchable.includes(query)) return false
        }

        const created = new Date(report.created_at).getTime()
        if (dateRange.from !== null && created < dateRange.from) return false
        if (dateRange.to !== null && created > dateRange.to) return false

        return true
    })

    return result.sort((a, b) => {
        if (filters.sort === 'oldest') {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }

        if (filters.sort === 'location_asc') {
            return (a.location ?? '').localeCompare(b.location ?? '')
        }

        if (filters.sort === 'status') {
            return statusLabel(a.status).localeCompare(statusLabel(b.status))
        }

        if (filters.sort === 'activity') {
            return getLatestActivityTime(b) - getLatestActivityTime(a)
        }

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
}

function getDateRange(preset: DatePreset, from: string, to: string) {
    const now = new Date()
    let fromTime: number | null = null
    let toTime: number | null = null

    if (preset === 'today') {
        const start = new Date(now)
        start.setHours(0, 0, 0, 0)
        fromTime = start.getTime()
        toTime = now.getTime()
    }

    if (preset === '7d') {
        fromTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime()
        toTime = now.getTime()
    }

    if (preset === '30d') {
        fromTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime()
        toTime = now.getTime()
    }

    if (preset === 'custom') {
        if (from) {
            const start = new Date(`${from}T00:00:00`)
            fromTime = start.getTime()
        }
        if (to) {
            const end = new Date(`${to}T23:59:59.999`)
            toTime = end.getTime()
        }
    }

    return { from: fromTime, to: toTime }
}

function isResolved(status: string) {
    return normalizeStatus(status) === 'resolved'
}

function ReportSection({
    title,
    description,
    count,
    total,
    search,
    onSearch,
    status,
    onStatus,
    datePreset,
    onDatePreset,
    dateFrom,
    dateTo,
    onDateFrom,
    onDateTo,
    sort,
    onSort,
    evidenceFilter = 'all',
    onEvidenceFilter,
    hasFilters,
    onReset,
    loading,
    reports,
    getLatestBeforeEvidence,
    getLatestAfterEvidence,
    getLatestReview,
    onPreview,
    onCopyReportId,
    emptyTitle,
    emptyDescription,
    emptySearch,
    active = false,
    resolvedOutcome = 'all',
    onResolvedOutcome,
}: {
    title: string
    description: string
    count: number
    total: number
    search: string
    onSearch: (value: string) => void
    status: ActiveStatusFilter
    onStatus: (value: ActiveStatusFilter) => void
    datePreset: DatePreset
    onDatePreset: (value: DatePreset) => void
    dateFrom: string
    dateTo: string
    onDateFrom: (value: string) => void
    onDateTo: (value: string) => void
    sort: SortKey
    onSort: (value: SortKey) => void
    evidenceFilter?: EvidenceFilter
    onEvidenceFilter?: (value: EvidenceFilter) => void
    hasFilters: boolean
    onReset: () => void
    loading: boolean
    reports: WasteReport[]
    getLatestBeforeEvidence: (reportId: string) => ReportEvidence | null
    getLatestAfterEvidence: (reportId: string) => ReportEvidence | null
    getLatestReview: (reportId: string) => AuthorityReview | null
    onPreview: (url: string | null, title: string) => void
    onCopyReportId: (reportId: string) => void
    emptyTitle: string
    emptyDescription: string
    emptySearch: string
    active?: boolean
    resolvedOutcome?: ResolvedOutcomeFilter
    onResolvedOutcome?: (value: ResolvedOutcomeFilter) => void
}) {
    return (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/75 shadow-xl shadow-black/10">
            <div className="border-b border-slate-800 bg-slate-900/70 p-5 sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
                            <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300">
                                {count} / {total}
                            </span>
                        </div>
                        <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">{description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-600 hover:text-white"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                <div className={`mt-5 grid gap-2.5 ${active ? 'lg:grid-cols-[minmax(220px,1.6fr)_minmax(170px,1fr)_minmax(170px,1fr)_minmax(170px,1fr)]' : 'lg:grid-cols-[minmax(260px,1.8fr)_minmax(190px,1fr)_minmax(190px,1fr)]'}`}>
                    <label className="relative block">
                        <span className="sr-only">Search {title}</span>
                        <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input
                            value={search}
                            onChange={(event) => onSearch(event.target.value)}
                            placeholder="Search location, description, ID..."
                            className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950/90 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
                        />
                    </label>

                    {active ? (
                        <>
                            <select
                                value={status}
                                onChange={(event) => onStatus(event.target.value as ActiveStatusFilter)}
                                className="min-h-11 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-300 outline-none transition focus:border-emerald-500/60"
                                aria-label="Active report status filter"
                            >
                                <option value="all">All active statuses</option>
                                <option value="submitted">Submitted</option>
                                <option value="assigned">Assigned</option>
                                <option value="cleaning_in_progress">Cleaning in progress</option>
                                <option value="pending_verification">Pending verification</option>
                                <option value="rejected">Correction required</option>
                            </select>

                            <select
                                value={evidenceFilter}
                                onChange={(event) => onEvidenceFilter?.(event.target.value as EvidenceFilter)}
                                className="min-h-11 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-300 outline-none transition focus:border-emerald-500/60"
                                aria-label="Cleaning evidence filter"
                            >
                                <option value="all">All evidence states</option>
                                <option value="available">Cleaning evidence available</option>
                                <option value="missing">Awaiting cleaning evidence</option>
                            </select>
                        </>
                    ) : (
                        <select
                            value={resolvedOutcome}
                            onChange={(event) => onResolvedOutcome?.(event.target.value as ResolvedOutcomeFilter)}
                            className="min-h-11 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-300 outline-none transition focus:border-emerald-500/60"
                            aria-label="Resolved report outcome filter"
                        >
                            <option value="all">All resolved outcomes</option>
                            <option value="approved">Authority approved</option>
                            <option value="legacy">Resolved without approval record</option>
                        </select>
                    )}

                    <select
                        value={sort}
                        onChange={(event) => onSort(event.target.value as SortKey)}
                        className="min-h-11 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-300 outline-none transition focus:border-emerald-500/60"
                        aria-label={`${title} sort order`}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="activity">Latest activity</option>
                        <option value="location_asc">Location A–Z</option>
                        <option value="status">Status A–Z</option>
                    </select>
                </div>

                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[minmax(150px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)]">
                    {datePreset === 'custom' && dateFrom && dateTo && dateFrom > dateTo && (
                        <p className="sm:col-span-3 -mb-1 text-xs font-semibold text-rose-300" role="alert">
                            Start date must be on or before the end date.
                        </p>
                    )}
                    <select
                        value={datePreset}
                        onChange={(event) => onDatePreset(event.target.value as DatePreset)}
                        className="min-h-10 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-xs font-semibold text-slate-400 outline-none focus:border-emerald-500/60"
                        aria-label={`${title} date filter`}
                    >
                        <option value="all">Any submission date</option>
                        <option value="today">Today</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="custom">Custom date range</option>
                    </select>

                    {datePreset === 'custom' ? (
                        <>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(event) => onDateFrom(event.target.value)}
                                className="min-h-10 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-xs text-slate-400 outline-none focus:border-emerald-500/60"
                                aria-label={`${title} start date`}
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(event) => onDateTo(event.target.value)}
                                className="min-h-10 rounded-xl border border-slate-700 bg-slate-950/90 px-3 text-xs text-slate-400 outline-none focus:border-emerald-500/60"
                                aria-label={`${title} end date`}
                            />
                        </>
                    ) : (
                        <div className="hidden min-h-10 items-center rounded-xl border border-dashed border-slate-800 px-3 text-xs text-slate-600 sm:flex">
                            Filter by submission date
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <ReportSkeleton />
            ) : reports.length === 0 ? (
                <SectionEmptyState
                    title={emptySearch ? 'No matching reports' : emptyTitle}
                    description={emptySearch ? 'Try another search term or clear the filters.' : emptyDescription}
                    filtered={Boolean(emptySearch) || hasFilters}
                    onReset={hasFilters ? onReset : undefined}
                />
            ) : (
                <div
                    className="h-[min(72vh,760px)] min-h-[520px] overflow-y-auto overscroll-contain divide-y divide-slate-800 [scrollbar-color:rgba(100,116,139,0.45)_transparent] [scrollbar-width:thin]"
                >
                    {reports.map((report) => {
                        const normalized = normalizeStatus(report.status)
                        const before = getLatestBeforeEvidence(report.id)
                        const beforeUrl = getEvidenceUrl(before) ?? report.evidence_url
                        const after = getLatestAfterEvidence(report.id)
                        const afterUrl = getEvidenceUrl(after)
                        const review = getLatestReview(report.id)
                        const approved = normalized === 'resolved' && review?.decision === 'approved'

                        return (
                            <ReportRow
                                key={report.id}
                                report={report}
                                normalized={normalized}
                                beforeUrl={beforeUrl}
                                afterUrl={afterUrl}
                                review={review}
                                approved={approved}
                                active={active}
                                onPreview={onPreview}
                                onCopyReportId={onCopyReportId}
                            />
                        )
                    })}
                </div>
            )}
        </section>
    )
}

function ReportRow({
    report,
    normalized,
    beforeUrl,
    afterUrl,
    review,
    approved,
    active,
    onPreview,
    onCopyReportId,
}: {
    report: WasteReport
    normalized: string
    beforeUrl: string | null
    afterUrl: string | null
    review: AuthorityReview | null
    approved: boolean
    active: boolean
    onPreview: (url: string | null, title: string) => void
    onCopyReportId: (reportId: string) => void
}) {
    return (
        <article className={`border-l-2 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-950/45 hover:shadow-lg hover:shadow-black/10 sm:p-6 ${statusAccentClass(report.status)}`}>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2.5">
                        <div className="min-w-0">
                            <h3 className="break-words text-base font-bold text-white sm:text-lg">
                                {report.location || 'Unknown location'}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <p className="text-xs text-slate-600">Report ID: {report.id}</p>
                                <button
                                    type="button"
                                    onClick={() => void onCopyReportId(report.id)}
                                    className="inline-flex items-center gap-1 rounded-md border border-slate-800 px-1.5 py-1 text-[10px] font-semibold text-slate-500 transition hover:border-slate-700 hover:text-slate-300"
                                    aria-label={`Copy report ID ${report.id}`}
                                    title="Copy report ID"
                                >
                                    <Icon name="copy" className="h-3 w-3" />
                                    Copy ID
                                </button>
                                {active && normalized === 'submitted' && (
                                    <Link
                                        to={`/reporter/report?edit=${encodeURIComponent(report.id)}`}
                                        className="inline-flex items-center gap-1 rounded-md border border-blue-400/20 bg-blue-400/5 px-1.5 py-1 text-[10px] font-bold text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-200"
                                        title="Edit while the report is still Submitted"
                                    >
                                        Edit report
                                    </Link>
                                )}
                            </div>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClass(report.status)}`}>
                            {statusLabel(report.status)}
                        </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/55 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Issue description</p>
                        <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-slate-300">
                            {report.description || 'No description provided.'}
                        </p>
                    </div>

                    {report.additional_info?.trim() && (
                        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Additional information</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{report.additional_info}</p>
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                        <span>Submitted {formatDate(report.created_at)}</span>
                        <span className="font-semibold text-slate-500">Status: {statusLabel(report.status)}</span>
                        {report.updated_at && report.updated_at !== report.created_at && (
                            <span>Updated {formatDate(report.updated_at)}</span>
                        )}
                    </div>

                    <Progress currentStatus={normalized} />

                    {active && normalized === 'submitted' && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 px-4 py-3">
                            <div>
                                <p className="text-xs font-bold text-blue-200">You can edit this report</p>
                                <p className="mt-1 text-[11px] leading-5 text-slate-500">Only while status is Submitted. Location, description and additional information can be changed; original evidence is preserved.</p>
                            </div>
                            <Link
                                to={`/reporter/report?edit=${encodeURIComponent(report.id)}`}
                                className="rounded-xl border border-blue-400/25 bg-blue-400/10 px-3 py-2 text-xs font-bold text-blue-200 hover:bg-blue-400/15"
                            >
                                Edit
                            </Link>
                        </div>
                    )}

                    {normalized === 'rejected' && review && (
                        <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 rounded-lg bg-rose-400/10 p-1.5 text-rose-300">
                                    <Icon name="alert" className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-rose-200">Correction required</p>
                                    {review.reason && (
                                        <p className="mt-2 text-sm leading-5 text-rose-100/90">
                                            <span className="font-semibold">Reason:</span> {review.reason}
                                        </p>
                                    )}
                                    {review.notes && (
                                        <p className="mt-2 text-sm leading-5 text-slate-400">
                                            <span className="font-semibold text-slate-300">Authority note:</span> {review.notes}
                                        </p>
                                    )}
                                    <p className="mt-2 text-[11px] text-slate-600">Returned {formatDate(review.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {normalized === 'pending_verification' && (
                        <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                                <div>
                                    <p className="text-sm font-bold text-cyan-100">Cleaning evidence submitted</p>
                                    <p className="mt-1 text-sm leading-5 text-slate-400">
                                        The report is waiting for authority verification. It will move to Resolved only after approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {approved && (
                        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                            <div className="flex items-start gap-3">
                                <span className="rounded-lg bg-emerald-400/10 p-1.5 text-emerald-300">
                                    <Icon name="check" className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-emerald-200">Resolution confirmed</p>
                                    <p className="mt-1 text-sm leading-5 text-slate-400">
                                        Authority approved the submitted cleaning work.
                                    </p>
                                    {review?.notes && (
                                        <p className="mt-2 text-sm leading-5 text-slate-500">Authority note: {review.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full shrink-0 xl:w-[440px]">
                    <EvidenceBox
                        title="Before cleaning"
                        subtitle="Reporter evidence"
                        url={beforeUrl}
                        onPreview={() => onPreview(beforeUrl, 'Before-cleaning evidence')}
                    />

                    {active && afterUrl && (
                        <button
                            type="button"
                            onClick={() => onPreview(afterUrl, 'Cleaning staff evidence')}
                            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
                        >
                            <span className="min-w-0">
                                <span className="block text-xs font-bold text-cyan-200">Cleaning evidence available</span>
                                <span className="mt-0.5 block text-[10px] text-slate-500">Submitted by cleaning staff</span>
                            </span>
                            <span className="shrink-0 text-[10px] font-bold text-cyan-300">View →</span>
                        </button>
                    )}

                    {!active && afterUrl && (
                        <button
                            type="button"
                            onClick={() => onPreview(afterUrl, 'Cleaning staff evidence')}
                            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-left transition hover:border-slate-700"
                        >
                            <span className="min-w-0">
                                <span className="block text-xs font-bold text-slate-300">Cleaning evidence archived</span>
                                <span className="mt-0.5 block text-[10px] text-slate-600">Available for verification history</span>
                            </span>
                            <span className="shrink-0 text-[10px] font-bold text-slate-400">View →</span>
                        </button>
                    )}
                </div>
            </div>
        </article>
    )
}

function ReportSkeleton() {
    return (
        <div className="space-y-4 p-5 sm:p-6">
            {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="h-4 w-1/3 rounded bg-slate-800" />
                    <div className="mt-4 h-3 w-4/5 rounded bg-slate-800" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-800" />
                    <div className="mt-6 h-2 rounded bg-slate-800" />
                </div>
            ))}
        </div>
    )
}

function SectionEmptyState({
    title,
    description,
    filtered,
    onReset,
}: {
    title: string
    description: string
    filtered: boolean
    onReset?: () => void
}) {
    return (
        <div className="p-10 text-center sm:p-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-500">
                <Icon name={filtered ? 'search' : 'file'} className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-200">{title}</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-5 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-600 hover:text-white"
                >
                    Clear filters
                </button>
            )}
        </div>
    )
}

function GuideStep({
    number,
    title,
    icon,
    text,
}: {
    number: string
    title: string
    icon: 'plus' | 'file' | 'check' | 'clock'
    text: string
}) {
    return (
        <div className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/25 hover:bg-slate-950/80 hover:shadow-lg hover:shadow-black/10">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <Icon name={icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black tracking-[0.16em] text-emerald-500/70">{number}</span>
                        <h3 className="text-sm font-bold text-white">{title}</h3>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
                </div>
            </div>
        </div>
    )
}

function GuideInfo({
    title,
    tone,
    text,
}: {
    title: string
    tone: 'blue' | 'rose' | 'cyan' | 'emerald' | 'slate'
    text: string
}) {
    const toneClasses = {
        blue: 'border-blue-500/15 bg-blue-500/[0.04] text-blue-200',
        rose: 'border-rose-500/15 bg-rose-500/[0.04] text-rose-200',
        cyan: 'border-cyan-500/15 bg-cyan-500/[0.04] text-cyan-200',
        emerald: 'border-emerald-500/15 bg-emerald-500/[0.04] text-emerald-200',
        slate: 'border-slate-800 bg-slate-950/50 text-slate-200',
    }

    return (
        <div className={`rounded-2xl border p-4 transition-colors duration-300 hover:border-slate-700 ${toneClasses[tone]}`}>
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
        </div>
    )
}

function MiniMetric({
    label,
    value,
    helper,
}: {
    label: string
    value: number
    helper: string
}) {
    return (
        <div className="flex min-h-32 flex-col justify-center border-b border-slate-800 p-5 last:border-b-0 sm:p-6 lg:min-h-40">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-600">{helper}</p>
        </div>
    )
}


function Progress({ currentStatus }: { currentStatus: string }) {
    const steps = [
        { key: 'submitted', label: 'Submitted', fill: 'bg-blue-400', text: 'text-blue-300' },
        { key: 'assigned', label: 'Assigned', fill: 'bg-violet-400', text: 'text-violet-300' },
        { key: 'cleaning_in_progress', label: 'Cleaning', fill: 'bg-amber-400', text: 'text-amber-300' },
        { key: 'pending_verification', label: 'Verification', fill: 'bg-cyan-400', text: 'text-cyan-300' },
        { key: 'resolved', label: 'Resolved', fill: 'bg-emerald-400', text: 'text-emerald-300' },
    ]

    const normalized = normalizeStatus(currentStatus)
    // Rejection happens at the verification stage, so show the verification
    // segment as the current correction stage rather than stopping at Cleaning.
    const currentIndex =
        normalized === 'rejected'
            ? 3
            : Math.max(0, steps.findIndex((step) => step.key === normalized))

    return (
        <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Workflow tracking
                </p>
                <span className="text-[10px] font-semibold text-slate-600">
                    {normalized === 'rejected' ? 'Correction cycle' : statusLabel(normalized)}
                </span>
            </div>

            <div className="flex items-center gap-1.5" aria-label={`Workflow status: ${statusLabel(normalized)}`}>
                {steps.map((step, index) => {
                    const complete = index <= currentIndex
                    const rejectedSegment = normalized === 'rejected' && step.key === 'pending_verification'
                    const fillClass = rejectedSegment ? 'bg-rose-400' : step.fill

                    return (
                        <div key={step.key} className="flex min-w-0 flex-1 items-center gap-1.5">
                            <div
                                className={`h-2 w-full rounded-full transition-all duration-300 ${complete ? fillClass : 'bg-slate-800'
                                    } ${index === currentIndex ? 'shadow-sm' : ''}`}
                                title={`${step.label}: ${complete ? (rejectedSegment ? 'Correction required' : 'Completed') : 'Not reached'}`}
                            />
                            {index < steps.length - 1 && (
                                <span className="hidden text-slate-700 sm:block">•</span>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-2 grid grid-cols-5 gap-1 text-[9px] sm:text-[10px]">
                {steps.map((step, index) => {
                    const reached = index <= currentIndex
                    const rejectedSegment = normalized === 'rejected' && step.key === 'pending_verification'
                    return (
                        <span
                            key={step.key}
                            className={
                                reached
                                    ? rejectedSegment
                                        ? 'font-bold text-rose-300'
                                        : `font-semibold ${step.text}`
                                    : 'text-slate-600'
                            }
                        >
                            {step.label}
                        </span>
                    )
                })}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-slate-600">
                {steps.map((step) => (
                    <span key={step.key} className="inline-flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${step.fill}`} />
                        {step.label}
                    </span>
                ))}
                {normalized === 'rejected' && (
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        Correction required
                    </span>
                )}
            </div>

            {normalized === 'rejected' && (
                <p className="mt-3 rounded-xl border border-rose-500/15 bg-rose-500/5 px-3 py-2 text-[11px] font-semibold text-rose-300">
                    Correction cycle — new cleaning evidence is required.
                </p>
            )}
        </div>
    )
}

function EvidenceBox({
    title,
    subtitle,
    url,
    onPreview,
    accent = 'slate',
}: {
    title: string
    subtitle: string
    url: string | null
    onPreview: () => void
    accent?: 'slate' | 'cyan'
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                    <p className={`truncate text-xs font-bold ${accent === 'cyan' ? 'text-cyan-300' : 'text-slate-200'}`}>{title}</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-600">{subtitle}</p>
                </div>
                {url && <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">Available</span>}
            </div>

            {url ? (
                <button
                    type="button"
                    onClick={onPreview}
                    className="block w-full border-t border-slate-800 text-left"
                >
                    <img src={url} alt={title} className="h-36 w-full bg-slate-900 object-cover transition duration-300 hover:scale-[1.02] sm:h-40" />
                    <div className="border-t border-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-300">
                        View full evidence →
                    </div>
                </button>
            ) : (
                <div className="flex h-40 items-center justify-center border-t border-dashed border-slate-800 bg-slate-950 px-4 text-center text-xs leading-5 text-slate-600">
                    No evidence uploaded yet.
                </div>
            )}
        </div>
    )
}

export default ReporterDashboard
