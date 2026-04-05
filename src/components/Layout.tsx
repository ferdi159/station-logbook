import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Zap, Users, Lightbulb, Plus, Search, Settings } from 'lucide-react'

const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/logbook', icon: BookOpen, label: 'Logbuch' },
  { to: '/automation', icon: Zap, label: 'Automation' },
  { to: '/contacts', icon: Users, label: 'Kontakte' },
  { to: '/lessons', icon: Lightbulb, label: 'Lessons' },
]

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isFormPage = location.pathname.includes('/new') || /\/\d+$/.test(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <header className="safe-top sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <NavLink to="/" className="font-bold text-lg tracking-tight">
            Station <span className="text-blue-500">Logbook</span>
          </NavLink>
          <div className="flex items-center gap-1">
            <button onClick={() => navigate('/search')} className="p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
              <Search size={20} />
            </button>
            <button onClick={() => navigate('/settings')} className="p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-24 pt-4">
        <Outlet />
      </main>

      {/* FAB */}
      {!isFormPage && (
        <button
          onClick={() => navigate('/logbook/new')}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center active:scale-90 hover:bg-blue-600 md:bottom-8 md:right-8"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Bottom Tab Bar (mobile) / Sidebar placeholder (desktop) */}
      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/90 backdrop-blur-lg border-t border-[var(--color-border)] md:hidden">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 min-w-[48px] min-h-[48px] justify-center rounded-xl ${
                  isActive ? 'text-blue-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`
              }
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-14 left-0 bottom-0 w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-lg p-3 gap-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive ? 'bg-blue-500/15 text-blue-500' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
