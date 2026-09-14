import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { supabase } from '../../lib/supabase'

type UserRole = 'reporter' | 'authority' | 'staff'

interface ProtectedRouteProps {
    children: ReactNode
    allowedRoles: UserRole[]
}

function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const [userRole, setUserRole] = useState<UserRole | null>(null)

    useEffect(() => {
        async function checkAccess() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                setLoading(false)
                return
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle()

            if (error || !profile) {
                setLoading(false)
                return
            }

            const role = profile.role as UserRole

            setUserRole(role)
            setAuthorized(allowedRoles.includes(role))
            setLoading(false)
        }

        checkAccess()
    }, [allowedRoles])

    if (loading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center text-slate-400">
                Checking access...
            </div>
        )
    }

    if (!userRole) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        )
    }

    if (!authorized) {
        const redirectPath =
            userRole === 'reporter'
                ? '/reporter'
                : userRole === 'authority'
                    ? '/authority'
                    : '/staff'

        return <Navigate to={redirectPath} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute