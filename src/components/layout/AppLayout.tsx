import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface AppLayoutProps {
    children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="h-screen overflow-hidden bg-slate-950 text-white">
            {/* =========================================================
                GLOBAL APPLICATION SHELL
                ---------------------------------------------------------
                - Full viewport height
                - Prevents the browser itself from scrolling
                - Header remains stationary
                - Only the application content area scrolls
            ========================================================== */}

            <div className="flex h-full min-h-0 flex-col">

                {/* =====================================================
                    FIXED APPLICATION HEADER
                    -----------------------------------------------------
                    Navbar is outside the scrolling content container.
                    It therefore remains stationary while pages scroll.
                ====================================================== */}

                <header className="relative z-50 shrink-0 border-b border-white/[0.08] bg-slate-950/95 backdrop-blur-xl">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                    <Navbar />
                </header>

                {/* =====================================================
                    SCROLLABLE APPLICATION CONTENT
                    -----------------------------------------------------
                    min-h-0 is important for flexbox scrolling.
                    overflow-y-auto makes ONLY this area scroll.
                ====================================================== */}

                <main
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        scroll-smooth
                        bg-slate-950

                        /* Firefox */
                        [scrollbar-width:thin]
                        [scrollbar-color:rgba(100,116,139,0.45)_transparent]
                    "
                >
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    )
}

export default AppLayout