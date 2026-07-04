/**
 * MainLayout.tsx
 * --------------
 * The primary shell layout: sidebar + topbar + content area.
 * Wraps all authenticated pages.
 */

import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '@context/AppContext'
import './MainLayout.css'

interface MainLayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard',    icon: '⬡' },
  { path: '/analytics',   label: 'Analytics',    icon: '◎' },
  { path: '/decisions',   label: 'Decisions',    icon: '◈' },
  { path: '/reports',     label: 'Reports',      icon: '▦' },
  { path: '/team',        label: 'Team',         icon: '◑' },
  { path: '/settings',    label: 'Settings',     icon: '◌' },
]

export function MainLayout({ children }: MainLayoutProps) {
  const { user, sidebarOpen, toggleSidebar } = useAppContext()
  const location = useLocation()

  // Dynamically map current route path to header title
  const currentTitle = NAV_ITEMS.find((item) => item.path === location.pathname)?.label ?? 'Dashboard'

  return (
    <div className={`layout ${sidebarOpen ? 'layout--sidebar-open' : 'layout--sidebar-closed'}`}>
      {/* ---- Sidebar ---- */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo animate-pulse-glow">
            <span>⬡</span>
          </div>
          {sidebarOpen && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name gradient-text">CEO AI</span>
              <span className="sidebar__brand-tagline">Executive Intelligence</span>
            </div>
          )}
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
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

        <div className="sidebar__footer">
          {sidebarOpen && user && (
            <div className="sidebar__user">
              <div className="sidebar__user-avatar">
                {user.fullName?.[0] ?? user.email?.[0] ?? 'U'}
              </div>
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">{user.fullName ?? 'Executive'}</span>
                <span className="sidebar__user-role badge badge-primary">{user.role}</span>
              </div>
            </div>
          )}
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

      {/* ---- Main Content ---- */}
      <div className="layout__content">
        {/* Topbar */}
        <header className="topbar glass">
          <div className="topbar__left">
            <h2 className="topbar__title">{currentTitle}</h2>
          </div>
          <div className="topbar__right">
            <div className="badge badge-success">● Live</div>
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
