import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    structureWasteReport,
    type ReportAssistantResponse,
} from '../lib/reportAssistant'

function Icon({
    name,
    className = 'h-5 w-5',
}: {
    name: 'spark' | 'back' | 'arrow' | 'check' | 'alert' | 'copy'
    className?: string
}) {
    const common = {
        className,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
    }

    if (name === 'spark') return <svg {...common}><path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z" /><path d="m19 15 .4 2.1L22 18l-2.6.4L19 21l-.4-2.6L16 18l2.6-.9L19 15Z" /></svg>
    if (name === 'back') return <svg {...common}><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></svg>
    if (name === 'arrow') return <svg {...common}><path d="M5 12h13M13 7l5 5-5 5" /></svg>
    if (name === 'check') return <svg {...common}><path d="m5 12.5 4.2 4L19 7" /></svg>
    if (name === 'alert') return <svg {...common}><path d="M12 4 3.8 19h16.4L12 4Z" /><path d="M12 9v4m0 3h.01" /></svg>
    return <svg {...common}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
}

function AIReportPage() {
    const navigate = useNavigate()
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [result, setResult] = useState<ReportAssistantResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    async function analyze() {
        setError(null)
        setResult(null)
        setCopied(false)

        if (location.trim().length < 3) {
            setError('Please enter a specific location.')
            return
        }

        if (description.trim().length < 15) {
            setError('Please describe what you observed in at least 15 characters.')
            return
        }

        setLoading(true)

        try {
            setResult(await structureWasteReport({
                location: location.trim(),
                description: description.trim(),
                additionalInfo: additionalInfo.trim(),
            }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to analyze the report.')
        } finally {
            setLoading(false)
        }
    }

    async function copySummary() {
        if (!result) return

        await navigator.clipboard.writeText([
            `Category: ${result.data.category}`,
            `Location: ${result.data.location}`,
            `Summary: ${result.data.summary}`,
        ].join('\n'))

        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
    }

    const isRealAI = result?.source === 'openai'

    return (
        <main className="min-h-full bg-[#020817] px-4 pb-16 pt-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-7 flex items-center justify-between gap-4">
                    <Link to="/reporter" className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white">
                        <Icon name="back" className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-bold text-emerald-300">
                        <Icon name="spark" className="h-4 w-4" />
                        AI-assisted reporting
                    </span>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Understand language</p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Describe the problem. Let AI structure it.</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            The assistant turns your own description into a few structured suggestions.
                            It does not decide priority, assign staff, or resolve the report.
                        </p>

                        <div className="mt-7 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="ai-location">Observed location</label>
                                <input id="ai-location" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={120} placeholder="Example: Campus Park near the walking path" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-emerald-400/70" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="ai-description">What did you observe?</label>
                                <textarea id="ai-description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={8} placeholder="Example: Plastic bottles and wrappers are collected beside the walking path." className="w-full resize-y rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm leading-6 text-white outline-none focus:border-emerald-400/70" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="ai-additional">Additional information <span className="text-slate-600">(optional)</span></label>
                                <textarea id="ai-additional" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} maxLength={1000} rows={3} placeholder="Only add information that you directly observed." className="w-full resize-y rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm leading-6 text-white outline-none focus:border-emerald-400/70" />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-200">
                                <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="button" onClick={() => void analyze()} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
                            {loading ? 'Structuring report…' : 'Structure my report'}
                            <Icon name="arrow" className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">Human confirmation</p>
                        <h2 className="mt-3 text-2xl font-black tracking-tight">Review every suggestion</h2>

                        {!result ? (
                            <div className="mt-10 rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 p-7 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                                    <Icon name="spark" className="h-6 w-6" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-300">Your structured suggestions will appear here.</p>
                                <p className="mt-2 text-xs leading-5 text-slate-600">Missing information stays unknown instead of being guessed.</p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Category</div>
                                    <div className="mt-2 text-lg font-bold text-white">{result.data.category}</div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Location</div>
                                    <div className="mt-2 text-sm leading-6 text-slate-300">{result.data.location}</div>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Neutral summary</div>
                                    <div className="mt-2 text-sm leading-6 text-slate-300">{result.data.summary}</div>
                                </div>

                                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">Missing or vague</div>
                                    <div className="mt-2 text-sm text-amber-100/80">
                                        {result.data.missingFields.length ? result.data.missingFields.join(', ') : 'No obvious missing field was detected.'}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                    <div className="flex items-start gap-3">
                                        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                                        <div>
                                            <p className="text-sm font-bold text-emerald-100">Confirmation required</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-400">{result.notice}</p>
                                        </div>
                                    </div>
                                </div>

                                {!isRealAI && (
                                    <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs leading-5 text-slate-500">
                                        Demo-safe fallback mode is active. Configure the server-side AI provider before presenting this result as live model inference.
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => void copySummary()} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white">
                                        <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
                                        {copied ? 'Copied' : 'Copy structured summary'}
                                    </button>
                                    <button type="button" onClick={() => navigate('/reporter/report')} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                                        Continue to report
                                        <Icon name="arrow" className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-xs leading-5 text-slate-500">
                    <strong className="text-slate-300">Responsible-AI boundary:</strong> the assistant only structures reporter-supplied language. The reporter confirms the content, staff performs physical work, and authority controls the final resolution.
                </section>
            </div>
        </main>
    )
}

export default AIReportPage
