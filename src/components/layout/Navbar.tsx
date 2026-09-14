import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { supabase } from '../../lib/supabase'

type UserRole = 'reporter' | 'authority' | 'staff'

interface UserProfile {
    full_name: string | null
    role: UserRole
}

function Navbar() {
    const navigate = useNavigate()

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProfile() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                setProfile(null)
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', session.user.id)
                .maybeSingle()

            if (error || !data) {
                setProfile(null)
            } else {
                setProfile({
                    full_name: data.full_name,
                    role: data.role as UserRole,
                })
            }

            setLoading(false)
        }

        loadProfile()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            loadProfile()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()

        setProfile(null)

        navigate('/login')
    }

    const navItems =
        profile?.role === 'reporter'
            ? [
                { label: 'Dashboard', to: '/reporter' },
                { label: 'New Report', to: '/reporter/report' },
            ]
            : profile?.role === 'authority'
                ? [
                    { label: 'Dashboard', to: '/authority' },
                ]
                : profile?.role === 'staff'
                    ? [
                        { label: 'Dashboard', to: '/staff' },
                    ]
                    : [
                        { label: 'Home', to: '/' },
                    ]

    return (
        <header className="border-b border-slate-800 bg-slate-950 text-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <NavLink
                    to="/"
                    className="text-xl font-bold tracking-tight text-emerald-400"
                >
                    WasteVoice AI ♻
                </NavLink>

                <div className="flex items-center gap-4 text-sm">
                    {!loading &&
                        navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-emerald-400'
                                        : 'text-slate-300 transition hover:text-white'
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                    {!loading && !profile && (
                        <NavLink
                            to="/login"
                            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
                        >
                            Login
                        </NavLink>
                    )}

                    {!loading && profile && (
                        <>
                            <div className="hidden text-right sm:block">
                                <p className="font-medium text-white">
                                    {profile.full_name || 'User'}
                                </p>

                                <p className="text-xs capitalize text-slate-400">
                                    {profile.role}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 transition hover:border-red-400 hover:text-red-300"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar