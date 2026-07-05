/**
 * MainLayout.tsx
 * --------------
 * Premium shell layout with animated engine slot sidebar.
 */

import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '@context/AppContext'
import { signOut } from '@services/supabase'
import './MainLayout.css'
import './TopbarExtras.css'

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
  { path: '/schedule', label: 'Schedule', icon: '📅' },
  { path: '/settings', label: 'Settings', icon: '◌' },
]

const MANAGEMENT_ITEMS: EngineItem[] = [
  {
    path: '/decisions',
    label: 'AI Decisions',
    icon: '⚖️',
    badgeClass: 'engine-badge--strategy',
    hint: 'Approve & track AI decisions',
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: '📄',
    badgeClass: 'engine-badge--analytics',
    hint: 'Generate & archive reports',
  },
  {
    path: '/team',
    label: 'Team',
    icon: '👥',
    badgeClass: 'engine-badge--customer',
    hint: 'Manage executive roster',
  },
]

const PILLAR_ITEMS: EngineItem[] = [
  {
    path: '/boardroom',
    label: 'AI Boardroom',
    icon: '🧠',
    badgeClass: 'engine-badge--strategy',
    hint: 'Virtual Exec debates',
  },
  {
    path: '/simulator',
    label: 'Growth Simulator',
    icon: '📈',
    badgeClass: 'engine-badge--sales',
    hint: 'Simulate key operational variables',
  },
  {
    path: '/crisis',
    label: 'AI Crisis Detector',
    icon: '🛡️',
    badgeClass: 'engine-badge--leadgen',
    hint: 'Audit risks & suggest recoveries',
  },
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
  '/boardroom': 'AI Boardroom',
  '/simulator': 'Growth Simulator',
  '/crisis': 'AI Crisis Detector',
  '/strategy': 'Strategy Engine',
  '/marketing': 'Marketing Engine',
  '/leadgen': 'Lead Gen Engine',
  '/sales': 'Sales Engine',
  '/analytics': 'Analytics Engine',
  '/customer-success': 'Customer Success',
  '/decisions': 'AI Decisions',
  '/reports': 'Reports & Documents',
  '/team': 'Team Management',
  '/schedule': 'Schedule & Automations',
  '/settings': 'Settings',
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, sidebarOpen, toggleSidebar, refreshUser } = useAppContext()
  const location = useLocation()
  const [showAILive, setShowAILive]       = useState(false)
  const [showInsight, setShowInsight]     = useState(false)
  const [insightTitle, setInsightTitle]   = useState('')
  const [insightBody, setInsightBody]     = useState('')
  const [insightAdded, setInsightAdded]   = useState(false)

  const currentTitle = PAGE_TITLE_MAP[location.pathname] ?? 'Dashboard'

  const handleSignOut = async () => {
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('demo_user_email')
    try { await signOut() } catch (_e) { /* silent */ }
    await refreshUser()
  }

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault()
    if (!insightTitle.trim()) return
    setInsightAdded(true)
    setTimeout(() => {
      setInsightAdded(false)
      setInsightTitle('')
      setInsightBody('')
      setShowInsight(false)
    }, 1800)
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

          {/* --- Business OS Pillars --- */}
          {sidebarOpen && (
            <div className="sidebar__section-label">Business OS</div>
          )}

          {PILLAR_ITEMS.map((pillar) => (
            <NavLink
              key={pillar.path}
              to={pillar.path}
              className={({ isActive }) =>
                `sidebar__engine-slot ${isActive ? 'active' : ''}`
              }
            >
              <div className={`engine-badge ${pillar.badgeClass}`}>
                {pillar.icon}
              </div>
              {sidebarOpen && (
                <>
                  <div className="engine-slot__info">
                    <span className="engine-slot__name">{pillar.label}</span>
                    <span className="engine-slot__hint">{pillar.hint}</span>
                  </div>
                  <div className="engine-slot__live" title="AI Active" />
                </>
              )}
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

          {/* --- Management Section --- */}
          {sidebarOpen && (
            <div className="sidebar__section-label">Management</div>
          )}

          {MANAGEMENT_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar__engine-slot ${isActive ? 'active' : ''}`
              }
            >
              <div className={`engine-badge ${item.badgeClass}`}>
                {item.icon}
              </div>
              {sidebarOpen && (
                <>
                  <div className="engine-slot__info">
                    <span className="engine-slot__name">{item.label}</span>
                    <span className="engine-slot__hint">{item.hint}</span>
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
            {/* AI Live Status Toggle */}
            <button
              className="ai-live-btn"
              id="topbar-ai-live-btn"
              onClick={() => setShowAILive(v => !v)}
            >
              <span className="live-pulse-dot" />
              AI Live
            </button>

            {/* AI Live Dropdown Panel */}
            {showAILive && (
              <div className="ai-live-panel glass animate-fade-in" id="ai-live-panel">
                <div className="ai-live-panel-header">
                  <span className="ai-live-panel-title">🤖 AI Status Dashboard</span>
                  <button className="ai-live-close" onClick={() => setShowAILive(false)}>×</button>
                </div>
                <div className="ai-live-signals">
                  {[
                    { label: 'Strategy Engine',   status: 'active',  latency: '22ms',  load: 97 },
                    { label: 'Marketing Engine',  status: 'active',  latency: '31ms',  load: 88 },
                    { label: 'Lead Gen Engine',   status: 'active',  latency: '18ms',  load: 92 },
                    { label: 'Sales Engine',      status: 'active',  latency: '27ms',  load: 95 },
                    { label: 'Analytics Engine',  status: 'active',  latency: '14ms',  load: 99 },
                    { label: 'Crisis Detector',   status: 'standby', latency: '--',    load: 0  },
                  ].map(eng => (
                    <div key={eng.label} className="ai-signal-row">
                      <span className={`ai-signal-dot ${eng.status}`} />
                      <span className="ai-signal-name">{eng.label}</span>
                      <span className="ai-signal-latency">{eng.latency}</span>
                      <div className="ai-signal-bar">
                        <div className="ai-signal-bar-fill" style={{ width: `${eng.load}%` }} />
                      </div>
                      <span className="ai-signal-pct">{eng.load > 0 ? `${eng.load}%` : '--'}</span>
                    </div>
                  ))}
                </div>
                <div className="ai-live-footer">
                  <span>Last sync: <strong>2 min ago</strong></span>
                  <span>API uptime: <strong style={{color:'#34d399'}}>99.98%</strong></span>
                </div>
              </div>
            )}

            {/* New Insight Button */}
            <button
              className="btn btn-primary"
              id="topbar-cta-btn"
              onClick={() => setShowInsight(true)}
            >
              + New Insight
            </button>
          </div>
        </header>

        {/* New Insight Modal */}
        {showInsight && (
          <div className="insight-modal-overlay" onClick={() => setShowInsight(false)}>
            <div className="insight-modal glass animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="insight-modal-header">
                <span className="insight-modal-icon">💡</span>
                <h3>Add New Insight</h3>
                <button className="ai-live-close" onClick={() => setShowInsight(false)}>×</button>
              </div>
              {insightAdded ? (
                <div className="insight-success animate-fade-in">
                  <span className="insight-success-icon">✅</span>
                  <p>Insight added to your AI knowledge base!</p>
                </div>
              ) : (
                <form className="insight-form" onSubmit={handleAddInsight}>
                  <div className="form-group">
                    <label>Insight Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Q3 Competitor Pricing Shift"
                      value={insightTitle}
                      onChange={e => setInsightTitle(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Details / Context</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Describe what you observed or want the AI to factor in..."
                      value={insightBody}
                      onChange={e => setInsightBody(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-select">
                      <option>Market Signal</option>
                      <option>Revenue Opportunity</option>
                      <option>Risk Alert</option>
                      <option>Operational Note</option>
                      <option>Competitive Intelligence</option>
                    </select>
                  </div>
                  <div className="insight-form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowInsight(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">✦ Add Insight</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="layout__main animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
