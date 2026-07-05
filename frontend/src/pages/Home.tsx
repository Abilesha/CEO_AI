import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@context/AppContext'
import './Home.css'

/* ---- KPI Data ---- */
const KPI_CARDS = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '₹4.2M',
    change: '+18.4%',
    positive: true,
    icon: '💰',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    glow: 'rgba(139,92,246,0.35)',
    sparkline: [40, 55, 48, 70, 62, 80, 75, 95, 88, 100],
  },
  {
    id: 'decisions',
    label: 'AI Decisions',
    value: '1,284',
    change: '+9.2%',
    positive: true,
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    glow: 'rgba(6,182,212,0.35)',
    sparkline: [30, 45, 40, 55, 50, 65, 60, 78, 72, 88],
  },
  {
    id: 'efficiency',
    label: 'Efficiency Score',
    value: '94.7%',
    change: '+3.1%',
    positive: true,
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glow: 'rgba(16,185,129,0.35)',
    sparkline: [60, 65, 70, 68, 75, 78, 80, 85, 90, 95],
  },
  {
    id: 'risk',
    label: 'Risk Index',
    value: '2.1',
    change: '-0.4',
    positive: false,
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    glow: 'rgba(245,158,11,0.35)',
    sparkline: [80, 70, 75, 65, 60, 55, 50, 45, 40, 35],
  },
]

const INSIGHTS = [
  {
    id: '1',
    title: 'Q3 Revenue Opportunity',
    summary: 'AI has identified a ₹3.4L upsell opportunity in the regional enterprise accounts based on contract renewal models.',
    category: 'Revenue',
    priority: 'high',
    time: '2 hours ago',
    icon: '💎',
  },
  {
    id: '2',
    title: 'Supply Chain Alert',
    summary: 'Projected 12% delay in component delivery. Recommend activating secondary supplier in Chennai hub.',
    category: 'Operations',
    priority: 'critical',
    time: '4 hours ago',
    icon: '⚠️',
  },
  {
    id: '3',
    title: 'Team Productivity Peak',
    summary: 'Engineering velocity increased 23% this sprint. Consider extending current sprint model.',
    category: 'HR',
    priority: 'medium',
    time: '6 hours ago',
    icon: '🚀',
  },
]

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-primary',
  low: 'badge-accent',
}

/* Mini sparkline SVG */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const w = 80
  const h = 32
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        opacity="0.08"
        strokeWidth="0"
      />
    </svg>
  )
}

export function HomePage() {
  const { user } = useAppContext()
  const navigate = useNavigate()
  const [showBrief, setShowBrief] = useState(false)
  
  // Audio playback simulator for brief
  const [isPlayingBrief, setIsPlayingBrief] = useState(false)


  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="home">

      {/* ---- Hero ---- */}
      <section className="home__hero animate-fade-in">
        <div className="home__greeting">
          <span className="badge badge-accent home__greeting-badge">
            <span className="live-dot" /> AI Active
          </span>
          <h1 className="home__title">
            {greeting},{' '}
            <span className="gradient-text">{user?.fullName || 'Subasree'}</span> 👋
          </h1>
          <p className="home__subtitle">
            Your AI has processed <strong>48 signals</strong> overnight.
            Here's what needs your attention today.
          </p>
        </div>
        <div className="home__hero-actions">
          <button 
            className={`btn ${showBrief ? 'btn-primary' : 'btn-primary-outline'}`} 
            id="home-brief-btn"
            onClick={() => setShowBrief(true)}
          >
            ⬡ Daily Brief
          </button>
          <button 
            className="btn btn-ghost" 
            id="home-schedule-btn"
            onClick={() => navigate('/schedule')}
          >
            ◌ Schedule
          </button>
        </div>
      </section>

      {/* ---- Interactive Overlays (Daily Brief & Schedule Drawers) ---- */}
      {showBrief && (
        <div className="home-drawer-overlay animate-fade-in" onClick={() => setShowBrief(false)}>
          <div className="home-drawer glass animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 className="drawer-title">⬡ Executive Daily Brief</h3>
              <button className="drawer-close" onClick={() => setShowBrief(false)}>×</button>
            </div>
            <div className="drawer-content">
              <div className="brief-welcome">
                <span className="brief-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <p>Hello {user?.fullName || 'Subasree'}, here is your synthesized executive briefing compiled from active market intelligence signals.</p>
              </div>

              {/* Audio Voice Simulation */}
              <div className="brief-voice-widget glass">
                <div className="voice-info">
                  <span className="voice-icon">🎙️</span>
                  <div>
                    <span className="voice-label">AI Audio Briefing</span>
                    <span className="voice-status">{isPlayingBrief ? 'Streaming briefing audio...' : 'Audio summary ready (1:45)'}</span>
                  </div>
                </div>
                <button 
                  className={`voice-play-btn ${isPlayingBrief ? 'playing' : ''}`}
                  onClick={() => setIsPlayingBrief(!isPlayingBrief)}
                >
                  {isPlayingBrief ? '⏸ Pause' : '▶ Play Voice Brief'}
                </button>
                {isPlayingBrief && (
                  <div className="audio-visualizer">
                    <span className="bar animate-bar-1"></span>
                    <span className="bar animate-bar-2"></span>
                    <span className="bar animate-bar-3"></span>
                    <span className="bar animate-bar-4"></span>
                    <span className="bar animate-bar-5"></span>
                  </div>
                )}
              </div>

              <div className="brief-section">
                <h4>🚨 Critical Priorities</h4>
                <div className="brief-card alert border-red">
                  <div className="brief-card-header">
                    <strong>Supply Chain Risk</strong>
                    <span className="badge badge-danger">Critical</span>
                  </div>
                  <p>12% delivery delay forecasted for regional shipments. Chennai supplier backup contract drafts synthesized in Strategy tab.</p>
                </div>
              </div>

              <div className="brief-section">
                <h4>💡 Opportunity Signals</h4>
                <div className="brief-card border-purple">
                  <div className="brief-card-header">
                    <strong>Upsell Target Identified</strong>
                    <span className="badge badge-warning">High</span>
                  </div>
                  <p>Analyzed contract metrics point to a ₹3.4L upsell opportunity across 4 local account portfolios. Recommended hooks generated in Lead Gen.</p>
                </div>
              </div>

              <div className="brief-section">
                <h4>🚀 System Summary</h4>
                <div className="brief-stats-grid">
                  <div className="brief-stat-item">
                    <span className="stat-num">48</span>
                    <span className="stat-desc">Parsed Signals</span>
                  </div>
                  <div className="brief-stat-item">
                    <span className="stat-num">99.4%</span>
                    <span className="stat-desc">AI Accuracy</span>
                  </div>
                  <div className="brief-stat-item">
                    <span className="stat-num">3</span>
                    <span className="stat-desc">Actions Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- KPI Cards ---- */}
      <section className="home__kpis">
        {KPI_CARDS.map((card, i) => (
          <div
            key={card.id}
            className="kpi-card glass"
            id={`kpi-card-${card.id}`}
            style={{
              animationDelay: `${i * 80}ms`,
              '--kpi-glow': card.glow,
            } as React.CSSProperties}
          >
            <div className="kpi-card__header">
              <span className="kpi-card__label">{card.label}</span>
              <div className="kpi-card__icon" style={{ background: card.gradient }}>
                {card.icon}
              </div>
            </div>
            <div className="kpi-card__value">{card.value}</div>
            <div className="kpi-card__footer">
              <div className={`kpi-card__change ${card.positive ? 'positive' : 'negative'}`}>
                {card.positive ? '↑' : '↓'} {card.change} vs last month
              </div>
              <Sparkline
                data={card.sparkline}
                color={card.gradient.includes('#8b5cf6') ? '#a78bfa' :
                  card.gradient.includes('#06b6d4') ? '#22d3ee' :
                  card.gradient.includes('#10b981') ? '#34d399' : '#fbbf24'}
              />
            </div>
          </div>
        ))}
      </section>

      {/* ---- Main Grid ---- */}
      <section className="home__grid">

        {/* AI Insights */}
        <div className="home__panel glass" id="insights-panel">
          <div className="home__panel-header">
            <h2 className="home__panel-title">🔍 AI Insights</h2>
            <button className="btn btn-ghost home__panel-action" id="insights-view-all-btn">
              View all →
            </button>
          </div>
          <div className="insights-list">
            {INSIGHTS.map((insight) => (
              <div key={insight.id} className="insight-item" id={`insight-${insight.id}`}>
                <div className="insight-item__meta">
                  <span className="insight-item__emoji">{insight.icon}</span>
                  <span className={`badge ${PRIORITY_BADGE[insight.priority]}`}>
                    {insight.priority}
                  </span>
                  <span className="insight-item__time">{insight.time}</span>
                </div>
                <h3 className="insight-item__title">{insight.title}</h3>
                <p className="insight-item__summary">{insight.summary}</p>
                <div className="insight-item__footer">
                  <span className="badge badge-accent">{insight.category}</span>
                  <button
                    className="btn btn-ghost insight-item__action"
                    id={`insight-act-${insight.id}`}
                  >
                    Take Action →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side column */}
        <div className="home__side">

          {/* Activity Feed */}
          <div className="home__panel glass" id="activity-feed-panel">
            <div className="home__panel-header">
              <h2 className="home__panel-title">⚙️ Quick Actions</h2>
            </div>
            <div className="quick-actions">
              {[
                { label: 'Generate Report', icon: '📄', id: 'qa-report', color: '#8b5cf6' },
                { label: 'Analyse Market',  icon: '🌐', id: 'qa-market', color: '#06b6d4' },
                { label: 'Review Pipeline', icon: '🔗', id: 'qa-pipeline', color: '#10b981' },
                { label: 'Team Digest',     icon: '👥', id: 'qa-team', color: '#f59e0b' },
              ].map((action) => (
                <button key={action.id} id={action.id} className="quick-action-btn glass">
                  <span className="quick-action-btn__icon" style={{ color: action.color }}>{action.icon}</span>
                  <span className="quick-action-btn__label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Engine Health Monitor */}
          <div className="home__panel glass engine-health-panel" id="ai-status-panel">
            <h2 className="home__panel-title">🤖 Engine Health</h2>
            <div className="engine-health-grid">
              {[
                { name: 'Strategy',   color: '#a78bfa', pct: 97 },
                { name: 'Marketing',  color: '#f472b6', pct: 88 },
                { name: 'Lead Gen',   color: '#fbbf24', pct: 92 },
                { name: 'Sales',      color: '#34d399', pct: 95 },
                { name: 'Analytics',  color: '#22d3ee', pct: 99 },
                { name: 'CRM',        color: '#fb923c', pct: 84 },
              ].map((eng) => (
                <div key={eng.name} className="engine-health-row">
                  <div className="engine-health-row__label">
                    <span className="engine-dot" style={{ background: eng.color }} />
                    <span>{eng.name}</span>
                  </div>
                  <div className="engine-health-bar">
                    <div
                      className="engine-health-bar__fill"
                      style={{
                        width: `${eng.pct}%`,
                        background: `linear-gradient(90deg, ${eng.color}aa, ${eng.color})`,
                        boxShadow: `0 0 8px ${eng.color}55`,
                      }}
                    />
                  </div>
                  <span className="engine-health-pct">{eng.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Ticker */}
          <div className="home__panel glass live-ticker-panel" id="live-ticker-panel">
            <h2 className="home__panel-title">📡 Live Data Feed</h2>
            <div className="ticker-list">
              {[
                { label: 'Data Sources',      value: '24 connected', ok: true },
                { label: 'Models Active',     value: '3 / 3',        ok: true },
                { label: 'Last Sync',         value: '2 min ago',    ok: true },
                { label: 'Pending Decisions', value: '7 items',      ok: false },
                { label: 'API Latency',       value: '34 ms',        ok: true },
              ].map((item, i) => (
                <div key={i} className="ticker-row">
                  <span className="ticker-dot" style={{ background: item.ok ? '#10b981' : '#f59e0b' }} />
                  <span className="ticker-label">{item.label}</span>
                  <span className={`ticker-value ${item.ok ? 'ok' : 'warn'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default HomePage
