import { Link } from 'react-router-dom'

function Icon({
    name,
    className = 'h-5 w-5',
}: {
    name: 'arrow' | 'spark' | 'shield' | 'leaf' | 'check' | 'activity'
    className?: string
}) {
    const common = {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    }

    const paths = {
        arrow: (
            <>
                <path {...common} d="M5 12h13" />
                <path {...common} d="m13 7 5 5-5 5" />
            </>
        ),
        spark: (
            <>
                <path {...common} d="m12 3 1.1 5.9L19 10l-5.9 1.1L12 17l-1.1-5.9L5 10l5.9-1.1L12 3Z" />
                <path {...common} d="m19 15 .5 2.5L22 18l-2.5.5L19 21l-.5-2.5L16 18l2.5-.5L19 15Z" />
            </>
        ),
        shield: (
            <>
                <path {...common} d="M12 3.5 19 6v5.1c0 4.8-2.9 8.4-7 10.4-4.1-2-7-5.6-7-10.4V6l7-2.5Z" />
                <path {...common} d="m8.8 12 2.1 2.1 4.4-4.4" />
            </>
        ),
        leaf: (
            <>
                <path {...common} d="M20.5 3.5C12 4 6.1 7.2 5.1 13.1c-.8 4.7 3.1 7.6 7.1 6.7 5.3-1.2 7.7-7.1 8.3-16.3Z" />
                <path {...common} d="M4 20c3.1-4.4 6.5-7.4 11.2-9.8" />
            </>
        ),
        check: <path {...common} d="m5 12 4.2 4.2L19 6.5" />,
        activity: (
            <>
                <path {...common} d="M3 12h4l2.2-5 4.1 10 2.4-6H21" />
            </>
        ),
    }

    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            {paths[name]}
        </svg>
    )
}

function HomePage() {
    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-emerald-400/30">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/[0.12] blur-3xl animate-[homeFloat_10s_ease-in-out_infinite]" />
                <div className="absolute right-[-12rem] top-[18%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.08] blur-3xl animate-[homeFloat_12s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[-18rem] left-[30%] h-[34rem] w-[34rem] rounded-full bg-violet-500/[0.07] blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.07) 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                        maskImage: 'radial-gradient(circle at center, black, transparent 78%)',
                    }}
                />
            </div>

            <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                <Link to="/" className="group flex items-center gap-3">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,.12)] transition duration-300 group-hover:scale-105 group-hover:border-emerald-300/40">
                        <span className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-md transition group-hover:bg-emerald-400/20" />
                        <Icon name="leaf" className="relative h-5 w-5" />
                    </span>
                    <span>
                        <span className="block text-sm font-black tracking-tight">WasteVoice AI</span>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Campus intelligence</span>
                    </span>
                </Link>

                <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
                >
                    Sign in
                    <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
            </nav>

            <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-28 lg:pt-20">
                <div className="animate-[heroIn_800ms_cubic-bezier(.2,.8,.2,1)]">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 backdrop-blur">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        AI-assisted campus reporting
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                        Turn campus problems into
                        <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                            visible action.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                        WasteVoice AI helps campuses report waste, route issues to the right people,
                        track resolution, and verify that the problem is actually solved.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/login"
                            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_16px_45px_rgba(16,185,129,.18)] transition duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-[0_22px_55px_rgba(16,185,129,.26)]"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-white/25 transition duration-700 group-hover:translate-x-full" />
                            <span className="relative">Enter workspace</span>
                            <Icon name="arrow" className="relative h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-bold text-slate-300 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                        >
                            See how it works
                        </a>
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
                        {['Report clearly', 'Resolve faster', 'Verify confidently'].map((item) => (
                            <span key={item} className="inline-flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                    <Icon name="check" className="h-3 w-3" />
                                </span>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl animate-[visualIn_900ms_180ms_both_cubic-bezier(.2,.8,.2,1)]">
                    <div className="absolute -inset-8 rounded-[3rem] bg-emerald-400/[0.06] blur-3xl" />
                    <div className="relative rounded-[32px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_35px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl">
                        <div className="overflow-hidden rounded-[25px] border border-white/[0.07] bg-slate-900/90">
                            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400">PROTOTYPE WORKSPACE PREVIEW</p>
                                    <p className="mt-1 text-sm font-bold">WasteVoice command view</p>
                                </div>
                                <span className="flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                    Preview
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 p-4">
                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Report intake</span>
                                        <Icon name="activity" className="h-4 w-4 text-cyan-300" />
                                    </div>
                                    <p className="mt-3 text-lg font-black">Structured</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Location + description + evidence</p>
                                </div>
                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Resolution</span>
                                        <Icon name="check" className="h-4 w-4 text-emerald-300" />
                                    </div>
                                    <p className="mt-3 text-lg font-black">Human verified</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Evidence-backed closure</p>
                                </div>
                            </div>

                            <div className="mx-4 mb-4 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-400/[0.08] to-cyan-400/[0.03] p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-300">CORE WORKFLOW</p>
                                        <p className="mt-1 text-sm font-bold">Report → Resolve → Verify</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                        <Icon name="spark" className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center gap-2">
                                    {[1, 2, 3].map((step, index) => (
                                        <div key={step} className="flex flex-1 items-center gap-2">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
                                                0{step}
                                            </span>
                                            {index < 2 && <span className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-cyan-400/20" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/[0.06] px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                        <Icon name="shield" className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold">Human-in-the-loop workflow</p>
                                        <p className="mt-0.5 text-[11px] text-slate-500">AI assistance does not replace final decisions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:flex animate-[floatBadge_5s_ease-in-out_infinite]">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                            <Icon name="shield" className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-xs font-bold">Evidence-backed workflow</p>
                            <p className="text-[10px] text-slate-500">Prototype status, not live statistics</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
                <div className="mb-8 max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">One simple loop</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">From complaint to closure.</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Designed to make the invisible parts of campus waste management easier to see and act on.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        ['01', 'Report', 'Capture the problem with a clear, structured report.', 'Report issues without friction.'],
                        ['02', 'Resolve', 'Route the issue to staff and keep progress visible.', 'Turn ownership into action.'],
                        ['03', 'Verify', 'Close the loop only after the result is confirmed.', 'Make resolution measurable.'],
                    ].map(([number, title, description, footer]) => (
                        <article
                            key={number}
                            className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-emerald-400/20 hover:bg-white/[0.045]"
                        >
                            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-400/[0.07] blur-2xl transition duration-500 group-hover:scale-150" />
                            <span className="relative text-xs font-black tracking-widest text-emerald-400">{number}</span>
                            <h3 className="relative mt-6 text-xl font-black">{title}</h3>
                            <p className="relative mt-2 text-sm leading-6 text-slate-500">{description}</p>
                            <div className="relative mt-7 border-t border-white/[0.07] pt-4 text-xs font-semibold text-slate-400">{footer}</div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="relative z-10 border-t border-white/[0.06] px-5 py-7 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} WasteVoice AI</span>
                    <span className="inline-flex items-center gap-2">
                        <Icon name="shield" className="h-3.5 w-3.5 text-emerald-400/70" />
                        Built for clearer campus action
                    </span>
                </div>
            </footer>

            <style>{`
                @keyframes homeFloat {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
                    50% { transform: translate3d(24px, 18px, 0) scale(1.06); }
                }
                @keyframes heroIn {
                    from { opacity: 0; transform: translateY(22px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes visualIn {
                    from { opacity: 0; transform: translateY(28px) scale(.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes floatBadge {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>
        </main>
    )
}

export default HomePage
