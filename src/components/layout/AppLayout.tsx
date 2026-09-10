import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface AppLayoutProps {
    children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout