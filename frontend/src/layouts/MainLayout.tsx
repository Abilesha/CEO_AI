/**
 * MainLayout.tsx
 * --------------
 * Premium shell layout with animated engine slot sidebar.
 */

import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '@context/AppContext'
import { signOut } from '@services/supabase'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: string
}

interface EngineItem {
  path: string
  label: string
  icon: string
  badgeClass: string
  hint: string
}

const TOP_NAV: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
]

const BOTTOM_NAV: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: '◌' },
]

const ENGINE_ITEMS: EngineItem[] = [
  {
    path: '/strategy',
    label: 'Strategy Engine',
    icon: '🧭',
    badgeClass: 'engine-badge--strategy',
    hint: 'Market research & positioning',
  },
  {
    path: '/marketing',
    label: 'Marketing Engine',
    icon: '📣',
    badgeClass: 'engine-badge--marketing',
    hint: '360° campaign designer',
  },
  {
    path: '/leadgen',
    label: 'Lead Gen Engine',
    icon: '⚡',
    badgeClass: 'engine-badge--leadgen',
    hint: 'Convert leads with AI',
  },
  {
    path: '/sales',
    label: 'Sales Engine',
    icon: '💹',
    badgeClass: 'engine-badge--sales',
    hint: 'Sales funnels & closing',
  },
  {
    path: '/analytics',
    label: 'Analytics Engine',
    icon: '📊',
    badgeClass: 'engine-badge--analytics',
    hint: 'Forecasting & insights',
  },
  {
    path: '/customer-success',
    label: 'Customer Success',
    icon: '🤝',
    badgeClass: 'engine-badge--customer',
    hint: 'CRM & support chatbot',
  },
]

const PAGE_TITLE_MAP: Record<string, string> = {
  '/': 'Executive Dashboard',
  '/strategy': 'Strategy Engine',
  '/marketing': 'Marketing Engine',
  '/leadgen': 'Lead Gen Engine',
  '/sales': 'Sales Engine',
  '/analytics': 'Analytics Engine',
  '/customer-success': 'Customer Success',
  '/settings': 'Settings',
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, sidebarOpen, toggleSidebar, refreshUser } = useAppContext()
  const location = useLocation()

  const currentTitle = PAGE_TITLE_MAP[location.pathname] ?? 'Dashboard'

  const handleSignOut = async () => {
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('demo_user_email')
    try {
      await signOut()
    } catch (_e) {
      // silent
    }
    await refreshUser()
  }

  return (
    <div className={`layout ${sidebarOpen ? 'layout--sidebar-open' : 'layout--sidebar-closed'}`}>
      {/* =========================================================
          SIDEBAR
          ========================================================= */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo animate-pulse-glow">
            <span>⬡</span>
          </div>
          {sidebarOpen && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">CEO AI</span>
              <span className="sidebar__brand-tagline">Executive Intelligence</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">

          {/* --- Home --- */}
          {TOP_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `sidebar__nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar__nav-label">{item.label}</span>}
            </NavLink>
          ))}

          {/* --- Engines Section --- */}
          {sidebarOpen && (
            <div className="sidebar__section-label">AI Engines</div>
          )}

          {ENGINE_ITEMS.map((engine) => (
            <NavLink
              key={engine.path}
              to={engine.path}
              className={({ isActive }) =>
                `sidebar__engine-slot ${isActive ? 'active' : ''}`
              }
            >
              <div className={`engine-badge ${engine.badgeClass}`}>
                {engine.icon}
              </div>
              {sidebarOpen && (
                <>
                  <div className="engine-slot__info">
                    <span className="engine-slot__name">{engine.label}</span>
                    <span className="engine-slot__hint">{engine.hint}</span>
                  </div>
                  <div className="engine-slot__live" title="AI Active" />
                </>
              )}
            </NavLink>
          ))}

          {/* --- Settings --- */}
          {sidebarOpen && (
            <div className="sidebar__section-label">System</div>
          )}

          {BOTTOM_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar__nav-label">{item.label}</span>}
            </NavLink>
          ))}

        </nav>

        {/* Footer / User */}
        <div className="sidebar__footer">
          {sidebarOpen && user ? (
            <div
              className="sidebar__user"
              onClick={handleSignOut}
              title="Click to Sign Out"
            >
              <div className="sidebar__user-avatar">
                {user.fullName?.[0] ?? user.email?.[0] ?? 'U'}
              </div>
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">
                  {user.fullName ?? 'Executive'}
                </span>
                <span className="sidebar__user-signout">⎋ Sign out</span>
              </div>
            </div>
          ) : !sidebarOpen ? (
            <button
              className="sidebar__toggle"
              onClick={handleSignOut}
              title="Sign Out"
              aria-label="Sign Out"
            >
              ⎋
            </button>
          ) : null}

          <button
            className="sidebar__toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            id="sidebar-toggle-btn"
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div className="layout__content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            <h2 className="topbar__title">{currentTitle}</h2>
          </div>
          <div className="topbar__right">
            <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
              AI Live
            </div>
            <button className="btn btn-primary" id="topbar-cta-btn">
              + New Insight
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="layout__main animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
