import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '../lib/supabase'

type Role = 'reporter' | 'authority' | 'staff'

function Icon({
    name,
    className = 'h-5 w-5',
}: {
    name: 'shield' | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'arrow' | 'spark' | 'alert' | 'check'
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
        shield: (
            <>
                <path {...common} d="M12 3.5 19 6v5.1c0 4.8-2.9 8.4-7 10.4-4.1-2-7-5.6-7-10.4V6l7-2.5Z" />
                <path {...common} d="m8.8 12 2.1 2.1 4.4-4.4" />
            </>
        ),
        mail: (
            <>
                <rect {...common} x="3.5" y="5" width="17" height="14" rx="2" />
                <path {...common} d="m4.5 7 7.5 5.4L19.5 7" />
            </>
        ),
        lock: (
            <>
                <rect {...common} x="4.5" y="10" width="15" height="10" rx="2" />
                <path {...common} d="M8 10V7.8a4 4 0 0 1 8 0V10" />
            </>
        ),
        eye: (
            <>
                <path {...common} d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z" />
                <circle {...common} cx="12" cy="12" r="2.2" />
            </>
        ),
        eyeOff: (
            <>
                <path {...common} d="m3.5 4.5 17 15" />
                <path {...common} d="M9.9 7.3A10 10 0 0 1 12 7c6 0 9.2 5 9.2 5a16 16 0 0 1-3.2 3.5M6.1 8.5A16 16 0 0 0 2.8 12s3.2 5 9.2 5a9.8 9.8 0 0 0 2.3-.3" />
                <path {...common} d="M10.2 10.2a2.5 2.5 0 0 0 3.5 3.5" />
            </>
        ),
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
        alert: (
            <>
                <circle {...common} cx="12" cy="12" r="9" />
                <path {...common} d="M12 8v4" />
                <path {...common} d="M12 16h.01" />
            </>
        ),
        check: <path {...common} d="m5 12 4.2 4.2L19 6.5" />,
    }

    return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{paths[name]}</svg>
}

function LoginPage() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)

    useEffect(() => {
        document.title = 'Sign in · WasteVoice AI'
        return () => {
            document.title = 'WasteVoice AI'
        }
    }, [])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (loading) return

        setLoading(true)
        setError('')

        try {
            const normalizedEmail = email.trim()

            if (!normalizedEmail || !password) {
                throw new Error('Please enter your email and password.')
            }

            const { data, error: signInError } =
                await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password,
                })

            if (signInError) throw signInError
            if (!data.user) throw new Error('Unable to authenticate user.')

            const { data: profile, error: profileError } =
                await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single()

            if (profileError) throw profileError
            if (!profile) throw new Error('User profile not found.')

            const role = profile.role as Role

            if (role === 'reporter') {
                navigate('/reporter', { replace: true })
                return
            }

            if (role === 'authority') {
                navigate('/authority', { replace: true })
                return
            }

            if (role === 'staff') {
                navigate('/staff', { replace: true })
                return
            }

            throw new Error('Invalid user role.')
        } catch (err) {
            console.error('Login error:', err)

            const message =
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.'

            setError(
                message.toLowerCase().includes('invalid login credentials')
                    ? 'Email or password is incorrect. Please check your credentials and try again.'
                    : message || 'Unable to sign in. Please try again.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-[loginFloat_8s_ease-in-out_infinite]" />
                <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-[loginFloat_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/[0.045] blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px)',
                        backgroundSize: '42px 42px',
                        maskImage: 'radial-gradient(circle at center, black, transparent 75%)',
                    }}
                />
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
                <section className="hidden lg:block animate-[loginContentIn_700ms_ease-out]">
                    <div className="max-w-xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" />
                            </span>
                            Secure campus reporting
                        </div>

                        <h1 className="text-5xl font-black leading-[1.02] tracking-tight xl:text-6xl">
                            One login.
                            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                                One clear workflow.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 xl:text-lg">
                            WasteVoice AI connects reporters, cleaning staff and authorities
                            through one protected workflow — from evidence to verification.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {[
                                ['01', 'Report', 'Submit the issue with evidence.'],
                                ['02', 'Resolve', 'Staff complete assigned work.'],
                                ['03', 'Verify', 'Authority confirms the result.'],
                            ].map(([number, title, description]) => (
                                <div
                                    key={number}
                                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-white/[0.045]"
                                >
                                    <span className="text-xs font-bold text-emerald-400">{number}</span>
                                    <p className="mt-2 font-semibold text-white">{title}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
                                <Icon name="shield" className="h-4 w-4" />
                            </span>
                            <span>
                                <strong className="font-semibold text-slate-300">Role-aware access</strong>
                                <br />
                                Each user is sent to the right workspace.
                            </span>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-md animate-[loginCardIn_650ms_cubic-bezier(.2,.8,.2,1)]">
                    <div className="mb-5 text-center lg:hidden">
                        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,.12)]">
                            <Icon name="shield" className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">WasteVoice AI</h1>
                        <p className="mt-1 text-sm text-slate-500">Secure campus waste workflow</p>
                    </div>

                    <div className="relative overflow-hidden rounded-[30px] border border-white/[0.1] bg-slate-900/80 shadow-[0_30px_100px_rgba(0,0,0,.5)] backdrop-blur-2xl">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />
                        <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

                        <div className="p-6 sm:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="hidden items-center gap-2 text-sm font-bold text-emerald-300 lg:flex">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10">
                                            <Icon name="spark" className="h-4 w-4" />
                                        </span>
                                        WasteVoice AI
                                    </div>
                                    <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Sign in to continue to your workspace.
                                    </p>
                                </div>

                                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-emerald-300 sm:flex">
                                    <Icon name="shield" className="h-5 w-5" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
                                        Email address
                                    </label>
                                    <div
                                        className={`group flex items-center gap-3 rounded-2xl border bg-slate-950/70 px-4 transition duration-300 ${focusedField === 'email'
                                                ? 'border-emerald-400/60 shadow-[0_0_0_4px_rgba(16,185,129,.08)]'
                                                : 'border-slate-700/80 hover:border-slate-600'
                                            }`}
                                    >
                                        <Icon
                                            name="mail"
                                            className={`h-5 w-5 shrink-0 transition ${focusedField === 'email' ? 'text-emerald-300' : 'text-slate-500'
                                                }`}
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="you@example.com"
                                            required
                                            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                                        />
                                        {email.trim() && (
                                            <span className="text-emerald-300 animate-[fieldPop_180ms_ease-out]">
                                                <Icon name="check" className="h-4 w-4" />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
                                            Password
                                        </label>
                                    </div>

                                    <div
                                        className={`group flex items-center gap-3 rounded-2xl border bg-slate-950/70 px-4 transition duration-300 ${focusedField === 'password'
                                                ? 'border-emerald-400/60 shadow-[0_0_0_4px_rgba(16,185,129,.08)]'
                                                : 'border-slate-700/80 hover:border-slate-600'
                                            }`}
                                    >
                                        <Icon
                                            name="lock"
                                            className={`h-5 w-5 shrink-0 transition ${focusedField === 'password' ? 'text-emerald-300' : 'text-slate-500'
                                                }`}
                                        />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your password"
                                            required
                                            className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                                        >
                                            <Icon name={showPassword ? 'eyeOff' : 'eye'} className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="flex gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-3.5 text-sm text-red-300 animate-[errorIn_220ms_ease-out]"
                                    >
                                        <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
                                        <span className="leading-5">{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-emerald-400 px-4 py-3.5 font-bold text-slate-950 shadow-[0_12px_30px_rgba(16,185,129,.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_18px_38px_rgba(16,185,129,.22)] focus:outline-none focus:ring-2 focus:ring-emerald-300/50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                                >
                                    <span className="absolute inset-0 -translate-x-full bg-white/20 transition duration-700 group-hover:translate-x-full" />
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                            Signing in…
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <Icon name="arrow" className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                        <Icon name="shield" className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-300">Protected workspace</p>
                                        <p className="mt-0.5 text-[11px] text-slate-600">Access is based on your assigned role.</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/"
                                className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-300"
                            >
                                <Icon name="arrow" className="h-4 w-4 -rotate-180 transition group-hover:-translate-x-0.5" />
                                <span>Back to WasteVoice AI</span>
                            </Link>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[11px] leading-5 text-slate-600">
                        Your workspace and available actions depend on the role linked to your WasteVoice AI profile.
                    </p>
                </section>
            </div>

            <style>{`
                @keyframes loginFloat {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
                    50% { transform: translate3d(18px, 12px, 0) scale(1.06); }
                }
                @keyframes loginContentIn {
                    from { opacity: 0; transform: translateX(-18px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes loginCardIn {
                    from { opacity: 0; transform: translateY(18px) scale(.985); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes errorIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fieldPop {
                    from { opacity: 0; transform: scale(.7); }
                    to { opacity: 1; transform: scale(1); }
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

export default LoginPage
