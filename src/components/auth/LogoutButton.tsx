import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../../lib/supabase'

function LogoutButton() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)

        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                throw error
            }

            navigate('/login', { replace: true })
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? 'Signing out...' : 'Logout'}
        </button>
    )
}

export default LogoutButton