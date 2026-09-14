import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EVIDENCE_BUCKET = 'waste-evidence'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type Step = 1 | 2 | 3

function Icon({
    name,
    className = 'h-5 w-5',
}: {
    name: 'back' | 'location' | 'file' | 'upload' | 'check' | 'arrow' | 'shield' | 'x' | 'camera'
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

    if (name === 'back') return <svg {...common}><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></svg>
    if (name === 'location') return <svg {...common}><path d="M20 10.2c0 5.1-8 10.3-8 10.3S4 15.3 4 10.2a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
    if (name === 'file') return <svg {...common}><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h4" /></svg>
    if (name === 'upload') return <svg {...common}><path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v5h14v-5" /></svg>
    if (name === 'check') return <svg {...common}><path d="m5 12.5 4.2 4L19 7" /></svg>
    if (name === 'arrow') return <svg {...common}><path d="M5 12h13M13 7l5 5-5 5" /></svg>
    if (name === 'shield') return <svg {...common}><path d="M12 3 19 6v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6z" /><path d="m9 12 2 2 4-4" /></svg>
    if (name === 'x') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
    return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 4.5-4 3 2.5 2-2 4.5 3.5" /></svg>
}

function validateFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'Please upload a JPG, PNG or WebP image.'
    }

    if (file.size > MAX_FILE_SIZE) {
        return 'Image must be smaller than 10 MB.'
    }

    return null
}

function CreateReportPage() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [step, setStep] = useState<Step>(1)
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [loadingExistingReport, setLoadingExistingReport] = useState(false)
    const [searchParams] = useSearchParams()
    const editReportId = searchParams.get('edit')
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const isEditMode = Boolean(editReportId)
    const canContinueDetails = location.trim().length >= 3 && description.trim().length >= 15
    const canSubmit = isEditMode ? canContinueDetails : canContinueDetails && !!file

    const fileMeta = useMemo(() => {
        if (!file) return null
        return `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }, [file])

    useEffect(() => {
        if (!editReportId) return

        let cancelled = false

        async function loadReportForEdit() {
            setLoadingExistingReport(true)
            setError(null)

            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError) throw userError
                if (!user) throw new Error('Your session has expired. Please sign in again.')

                const { data, error: reportError } = await supabase
                    .from('reports')
                    .select('id, location, description, additional_info, status, reporter_id, evidence_url')
                    .eq('id', editReportId)
                    .eq('reporter_id', user.id)
                    .maybeSingle()

                if (reportError) throw reportError
                if (!data) throw new Error('Report not found or you do not have permission to edit it.')

                if (data.status !== 'submitted') {
                    throw new Error('This report can no longer be edited. Reporter edits are allowed only while the status is Submitted.')
                }

                if (cancelled) return
                setLocation(data.location ?? '')
                setDescription(data.description ?? '')
                setAdditionalInfo(data.additional_info ?? '')
                setStep(1)
            } catch (err) {
                if (!cancelled) {
                    console.error(err)
                    setError(err instanceof Error ? err.message : 'Unable to load the report for editing.')
                }
            } finally {
                if (!cancelled) setLoadingExistingReport(false)
            }
        }

        void loadReportForEdit()

        return () => {
            cancelled = true
        }
    }, [editReportId])

    function selectFile(nextFile: File | null) {
        setError(null)

        if (!nextFile) return

        const validationError = validateFile(nextFile)
        if (validationError) {
            setError(validationError)
            return
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl)

        setFile(nextFile)
        setPreviewUrl(URL.createObjectURL(nextFile))
    }

    function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
        selectFile(event.target.files?.[0] ?? null)
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setDragActive(false)
        selectFile(event.dataTransfer.files?.[0] ?? null)
    }

    function removeFile() {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setFile(null)
        setPreviewUrl(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    function goToEvidence() {
        setError(null)

        if (!location.trim()) {
            setError('Please enter the waste location.')
            return
        }

        if (location.trim().length < 3) {
            setError('Please provide a more specific location.')
            return
        }

        if (!description.trim()) {
            setError('Please describe what you observed.')
            return
        }

        if (description.trim().length < 15) {
            setError('Please provide a little more detail about the observed problem.')
            return
        }

        if (additionalInfo.trim().length > 1000) {
            setError('Additional information must be 1000 characters or fewer.')
            return
        }

        setStep(2)
    }

    function goToReview() {
        setError(null)

        if (!isEditMode && !file) {
            setError('Before-cleaning evidence is required before submission.')
            return
        }

        setStep(3)
    }

    async function submitReport(event?: FormEvent) {
        event?.preventDefault()
        setError(null)

        if (!canSubmit) {
            setError(isEditMode ? 'Please complete the location and description before saving.' : 'Please complete the location, description and evidence before submitting.')
            return
        }

        if (additionalInfo.trim().length > 1000) {
            setError('Additional information must be 1000 characters or fewer.')
            return
        }

        setSubmitting(true)

        try {
            if (isEditMode && editReportId) {
                const { error: updateError } = await supabase.rpc('reporter_update_report', {
                    p_report_id: editReportId,
                    p_location: location.trim(),
                    p_description: description.trim(),
                    p_additional_info: additionalInfo.trim() || null,
                })

                if (updateError) throw updateError

                setSuccess(true)
                window.setTimeout(() => {
                    navigate('/reporter')
                }, 1200)
                return
            }

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError) throw userError
            if (!user) throw new Error('Your session has expired. Please sign in again.')

            const reportId = crypto.randomUUID()
            const extension = file!.name.split('.').pop()?.toLowerCase() || 'jpg'
            const safeName = file!.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9_-]/g, '_')
                .slice(0, 50)

            const storagePath = `reports/${user.id}/${reportId}/before_${safeName || 'evidence'}.${extension}`

            const { error: uploadError } = await supabase.storage
                .from(EVIDENCE_BUCKET)
                .upload(storagePath, file!, {
                    cacheControl: '3600',
                    contentType: file!.type,
                    upsert: false,
                })

            if (uploadError) throw uploadError

            const publicUrl = supabase.storage
                .from(EVIDENCE_BUCKET)
                .getPublicUrl(storagePath)
                .data.publicUrl

            const { error: reportError } = await supabase
                .from('reports')
                .insert({
                    id: reportId,
                    reporter_id: user.id,
                    location: location.trim(),
                    description: description.trim(),
                    additional_info: additionalInfo.trim() || null,
                    evidence_url: publicUrl,
                    status: 'submitted',
                })

            if (reportError) {
                await supabase.storage.from(EVIDENCE_BUCKET).remove([storagePath])
                throw reportError
            }

            const { error: evidenceError } = await supabase
                .from('report_evidence')
                .insert({
                    report_id: reportId,
                    evidence_type: 'before_cleaning',
                    file_path: storagePath,
                    uploaded_by: user.id,
                })

            if (evidenceError) {
                console.warn('Before evidence history insert failed:', evidenceError)
                // The report remains usable because reports.evidence_url is the
                // primary before-evidence reference used by the current workflow.
            }

            setSuccess(true)

            window.setTimeout(() => {
                navigate('/reporter')
            }, 1200)
        } catch (err) {
            console.error(err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to submit the report. Please try again.',
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#020817] text-white">
            <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_64%)]" />

            <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                <header className="mb-8 flex items-center justify-between gap-4">
                    <Link
                        to="/reporter"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                    >
                        <Icon name="back" className="h-4 w-4" />
                        Dashboard
                    </Link>

                    <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">
                        <Icon name="shield" className="h-4 w-4 text-emerald-400/70" />
                        Secure report submission
                    </div>
                </header>

                <section className="mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
                                Reporter workflow
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                {isEditMode ? 'Edit waste report' : 'Report unmanaged waste'}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                {isEditMode
                                    ? 'Update the report details while it is still Submitted. Original evidence is preserved.'
                                    : 'Give the responsible team enough context to understand the issue, locate it and verify the cleaning outcome later.'}
                            </p>
                        </div>

                        <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-400">
                            Step {step} of 3
                        </span>
                    </div>
                </section>

                {isEditMode && (
                    <section className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-blue-400/10 px-2.5 py-2 text-xs font-black text-blue-300">EDIT</div>
                            <div>
                                <p className="text-sm font-bold text-blue-100">Reporter edit rule</p>
                                <p className="mt-1 text-xs leading-5 text-slate-400">Editing is allowed only while this report is <span className="font-semibold text-blue-200">Submitted</span>. You can change location, description and additional information. The original before-cleaning evidence is kept unchanged.</p>
                            </div>
                        </div>
                    </section>
                )}

                {loadingExistingReport && (
                    <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">Loading report details…</section>
                )}

                <section className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
                    <div className="grid grid-cols-3 gap-2">
                        <StepIndicator number={1} label="Details" active={step === 1} complete={step > 1} />
                        <StepIndicator number={2} label="Evidence" active={step === 2} complete={step > 2} />
                        <StepIndicator number={3} label="Review & submit" active={step === 3} complete={success} />
                    </div>
                </section>

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-200">
                        <Icon name="x" className="mt-0.5 h-5 w-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <section className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-10 text-center shadow-2xl shadow-black/20 sm:p-16">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                            <Icon name="check" className="h-8 w-8" />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold">{isEditMode ? 'Report updated' : 'Report submitted'}</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                            {isEditMode ? 'Your changes were saved while the report remains in the Submitted stage.' : 'Your report has entered the workflow and is ready for authority review.'}
                            {' '}Taking you back to your dashboard…
                        </p>
                    </section>
                ) : (
                    <>
                        {step === 1 && (
                            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20">
                                <div className="border-b border-slate-800 p-5 sm:p-7">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300">
                                            <Icon name="location" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold sm:text-lg">Where did you observe it?</h2>
                                            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                                Use a location that cleaning staff can identify without guessing.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-7 p-5 sm:p-7">
                                    <div>
                                        <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-200">
                                            Waste location <span className="text-rose-400">*</span>
                                        </label>
                                        <input
                                            id="location"
                                            value={location}
                                            onChange={(event) => setLocation(event.target.value)}
                                            maxLength={120}
                                            autoComplete="off"
                                            placeholder="Example: Campus Park near the walking path"
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                        <div className="mt-2 flex justify-between text-[11px] text-slate-600">
                                            <span>Be specific about the area.</span>
                                            <span>{location.length}/120</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-200">
                                            What did you observe? <span className="text-rose-400">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(event) => setDescription(event.target.value)}
                                            maxLength={1000}
                                            rows={7}
                                            placeholder="Describe the waste condition, where it is accumulating and anything else you directly observed."
                                            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                        <div className="mt-2 flex justify-between text-[11px] text-slate-600">
                                            <span>Describe what you actually observed.</span>
                                            <span>{description.length}/1000</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="additionalInfo" className="mb-2 block text-sm font-semibold text-slate-200">
                                            Additional information <span className="text-slate-600">(optional)</span>
                                        </label>
                                        <textarea
                                            id="additionalInfo"
                                            value={additionalInfo}
                                            onChange={(event) => setAdditionalInfo(event.target.value)}
                                            maxLength={1000}
                                            rows={4}
                                            placeholder="Optional context: nearby landmark, access detail, timing, or other useful information."
                                            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10"
                                        />
                                        <div className="mt-2 flex justify-between text-[11px] text-slate-600">
                                            <span>Only add relevant information.</span>
                                            <span>{additionalInfo.length}/1000</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                        <div className="flex gap-3">
                                            <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400/70" />
                                            <p className="text-xs leading-5 text-slate-500">
                                                Only submit information relevant to the waste issue. Avoid
                                                personal information or identifiable details about other people.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={goToEvidence}
                                            disabled={!canContinueDetails}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Continue to evidence
                                            <Icon name="arrow" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 2 && (
                            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20">
                                <div className="border-b border-slate-800 p-5 sm:p-7">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
                                            <Icon name="camera" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold sm:text-lg">Add before-cleaning evidence</h2>
                                            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                                This image documents the condition you are reporting.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-7">
                                    {isEditMode ? (
                                        <div className="rounded-3xl border border-blue-500/15 bg-blue-500/5 p-6 sm:p-8">
                                            <p className="text-sm font-bold text-blue-100">Original evidence is preserved</p>
                                            <p className="mt-2 text-sm leading-6 text-slate-400">Reporter edits do not replace the original field evidence. This keeps the submitted proof tied to the initial observation.</p>
                                        </div>
                                    ) : !file ? (
                                        <div
                                            onDragOver={(event) => {
                                                event.preventDefault()
                                                setDragActive(true)
                                            }}
                                            onDragLeave={() => setDragActive(false)}
                                            onDrop={handleDrop}
                                            className={`rounded-3xl border-2 border-dashed p-8 text-center transition sm:p-12 ${dragActive
                                                    ? 'border-emerald-400 bg-emerald-400/5'
                                                    : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-400">
                                                <Icon name="upload" className="h-6 w-6" />
                                            </div>

                                            <h3 className="mt-5 text-base font-bold text-slate-200">
                                                Upload your before photo
                                            </h3>
                                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                                Drag and drop an image here, or choose a file from your device.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="mt-6 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-white"
                                            >
                                                Choose image
                                            </button>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleFileInput}
                                                className="hidden"
                                            />

                                            <p className="mt-4 text-[11px] text-slate-600">
                                                JPG, PNG or WebP · Maximum 10 MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                                            <div className="grid lg:grid-cols-[1fr_280px]">
                                                <div className="flex min-h-[320px] items-center justify-center bg-black/20 p-3 sm:p-5">
                                                    {previewUrl && (
                                                        <img
                                                            src={previewUrl}
                                                            alt="Before-cleaning evidence preview"
                                                            className="max-h-[520px] w-full rounded-2xl object-contain"
                                                        />
                                                    )}
                                                </div>

                                                <div className="border-t border-slate-800 p-5 lg:border-l lg:border-t-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
                                                            <Icon name="check" className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-slate-200">Evidence ready</p>
                                                            <p className="mt-0.5 truncate text-xs text-slate-600">{file.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs">
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-slate-600">Type</span>
                                                            <span className="text-slate-300">{file.type.replace('image/', '').toUpperCase()}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-slate-600">Size</span>
                                                            <span className="text-slate-300">{fileMeta}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rose-300"
                                                    >
                                                        <Icon name="x" className="h-4 w-4" />
                                                        Remove and choose another
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                                        <div className="flex gap-3">
                                            <Icon name="camera" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                                            <p className="text-xs leading-5 text-cyan-100/70">
                                                Use a genuine image of the reported condition. For the C29
                                                submission, your field evidence should be your own recorded evidence.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError(null)
                                                setStep(1)
                                            }}
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={goToReview}
                                            disabled={isEditMode ? false : !file}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {isEditMode ? 'Review changes' : 'Review report'}
                                            <Icon name="arrow" className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20">
                                <div className="border-b border-slate-800 p-5 sm:p-7">
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                        Final check
                                    </p>
                                    <h2 className="mt-2 text-xl font-bold sm:text-2xl">Review before submitting</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Confirm that the information accurately represents what you observed.
                                    </p>
                                </div>

                                <form onSubmit={submitReport} className="p-5 sm:p-7">
                                    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                                        <div className="space-y-4">
                                            <ReviewItem icon="location" label="Location" value={location} />
                                            <ReviewItem icon="file" label="Description" value={description} multiline />
                                            {additionalInfo.trim() && (
                                                <ReviewItem icon="file" label="Additional information" value={additionalInfo} multiline />
                                            )}
                                        </div>

                                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                                            <div className="border-b border-slate-800 px-4 py-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Before evidence
                                                </p>
                                            </div>
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Selected before-cleaning evidence"
                                                    className="h-64 w-full object-cover"
                                                />
                                            ) : isEditMode ? (
                                                <div className="flex h-64 items-center justify-center px-6 text-center text-xs leading-5 text-blue-200/70">
                                                    Existing before-cleaning evidence will remain attached to this report.
                                                </div>
                                            ) : (
                                                <div className="flex h-64 items-center justify-center text-xs text-slate-600">
                                                    No image selected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
                                        <p className="text-xs leading-5 text-amber-100/70">
                                            {isEditMode
                                                ? <>You are saving an edit to this report. It remains <strong className="text-amber-100">Submitted</strong> and its original evidence is preserved.</>
                                                : <>By submitting, you are reporting an observed campus waste condition for review. The report will start with <strong className="text-amber-100">Submitted</strong> status and move through the authority/staff workflow.</>}
                                        </p>
                                    </div>

                                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError(null)
                                                setStep(2)
                                            }}
                                            disabled={submitting}
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white disabled:opacity-50"
                                        >
                                            Back to evidence
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={submitting || !canSubmit}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                                    Submitting report…
                                                </>
                                            ) : (
                                                <>
                                                    {isEditMode ? 'Save changes' : 'Submit report'}
                                                    <Icon name="check" className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}
                    </>
                )}

                {!success && (
                    <p className="mt-6 text-center text-[11px] leading-5 text-slate-700">
                        WasteVoice AI · Reporter workspace · Submit only information relevant to the observed issue.
                    </p>
                )}
            </div>
        </main>
    )
}

function StepIndicator({
    number,
    label,
    active,
    complete,
}: {
    number: number
    label: string
    active: boolean
    complete: boolean
}) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete
                        ? 'bg-emerald-400 text-slate-950'
                        : active
                            ? 'border border-emerald-400 bg-emerald-400/10 text-emerald-300'
                            : 'border border-slate-700 bg-slate-950 text-slate-600'
                    }`}
            >
                {complete ? <Icon name="check" className="h-4 w-4" /> : number}
            </div>
            <span className={`hidden text-xs font-semibold sm:block ${active || complete ? 'text-slate-200' : 'text-slate-600'}`}>
                {label}
            </span>
        </div>
    )
}

function ReviewItem({
    icon,
    label,
    value,
    multiline = false,
}: {
    icon: 'location' | 'file'
    label: string
    value: string
    multiline?: boolean
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Icon name={icon} className="h-4 w-4 text-slate-600" />
                {label}
            </div>
            <p className={`mt-3 text-sm leading-6 text-slate-300 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
                {value}
            </p>
        </div>
    )
}

export default CreateReportPage
