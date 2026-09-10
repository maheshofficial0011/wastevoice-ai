import { NavLink } from 'react-router-dom'

const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Report', to: '/reporter' },
    { label: 'Authority', to: '/authority' },
    { label: 'Staff', to: '/staff' },
]

function Navbar() {
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
                    {navItems.map((item) => (
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

                    <NavLink
                        to="/login"
                        className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
                    >
                        Login
                    </NavLink>
                </div>
            </nav>
        </header>
    )
}

export default Navbar