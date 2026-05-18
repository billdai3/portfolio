import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: "Bill's", end: true },
  { to: '/work', label: 'Work' },
  { to: '/lab', label: 'Lab' },
  { to: '/about', label: 'About' },
] as const

function pillNavLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-ash-900 text-white'
      : 'text-text-secondary hover:bg-ash-100 hover:text-text-primary',
  ].join(' ')
}

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="px-4 pt-6 pb-2 sm:px-6">
        <div className="mx-auto flex max-w-6xl justify-center">
          <nav
            className="inline-flex items-center gap-1 rounded-full border border-border-default bg-bg-elevated/90 p-1.5 shadow-sm backdrop-blur-sm"
            aria-label="Primary"
          >
            {navItems.map(({ to, label, ...rest }) => (
              <NavLink
                key={to}
                to={to}
                className={pillNavLinkClass}
                {...rest}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-text-muted">
          © {new Date().getFullYear()} Your Name
        </div>
      </footer>
    </div>
  )
}
