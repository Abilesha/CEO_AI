/**
 * pages/Home.tsx
 * --------------
 * CEO AI — Dashboard homepage.
 * Displays KPI cards, quick actions, and activity feed.
 */

import './Home.css'

const KPI_CARDS = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$4.2M',
    change: '+18.4%',
    positive: true,
    icon: '◈',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
  {
    id: 'decisions',
    label: 'AI Decisions',
    value: '1,284',
    change: '+9.2%',
    positive: true,
    icon: '⬡',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
  },
  {
    id: 'efficiency',
    label: 'Efficiency Score',
    value: '94.7%',
    change: '+3.1%',
    positive: true,
    icon: '◎',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    id: 'risk',
    label: 'Risk Index',
    value: '2.1',
    change: '-0.4',
    positive: false,
    icon: '◑',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
]

const INSIGHTS = [
  {
    id: '1',
    title: 'Q3 Revenue Opportunity',
    summary: 'AI has identified a $340K upsell opportunity in the APAC region based on engagement patterns.',
    category: 'Revenue',
    priority: 'high',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Supply Chain Alert',
    summary: 'Projected 12% delay in component delivery. Recommend activating secondary supplier protocol.',
    category: 'Operations',
    priority: 'critical',
    time: '4 hours ago',
  },
  {
    id: '3',
    title: 'Team Productivity Peak',
    summary: 'Engineering velocity increased 23% this sprint. Consider extending current sprint model.',
    category: 'HR',
    priority: 'medium',
    time: '6 hours ago',
  },
]

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-primary',
  low: 'badge-accent',
}

export function HomePage() {
  return (
    <div className="home">
      {/* ---- Hero Section ---- */}
      <section className="home__hero animate-fade-in">
        <div className="home__greeting">
          <span className="badge badge-accent home__greeting-badge">
            ● AI Active
          </span>
          <h1 className="home__title">
            Good morning, <span className="gradient-text">Executive</span> 👋
          </h1>
          <p className="home__subtitle">
            Your AI has processed <strong>48 signals</strong> overnight.
            Here's what needs your attention today.
          </p>
        </div>
        <div className="home__hero-actions">
          <button className="btn btn-primary" id="home-brief-btn">
            ⬡ Daily Brief
          </button>
          <button className="btn btn-ghost" id="home-schedule-btn">
            ◌ Schedule
          </button>
        </div>
      </section>

      {/* ---- KPI Cards ---- */}
      <section className="home__kpis">
        {KPI_CARDS.map((card, i) => (
          <div
            key={card.id}
            className="kpi-card glass"
            id={`kpi-card-${card.id}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="kpi-card__header">
              <span className="kpi-card__label">{card.label}</span>
              <div
                className="kpi-card__icon"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
            </div>
            <div className="kpi-card__value">{card.value}</div>
            <div className={`kpi-card__change ${card.positive ? 'positive' : 'negative'}`}>
              {card.positive ? '↑' : '↓'} {card.change} vs last month
            </div>
          </div>
        ))}
      </section>

      {/* ---- Main Grid ---- */}
      <section className="home__grid">
        {/* AI Insights */}
        <div className="home__panel glass" id="insights-panel">
          <div className="home__panel-header">
            <h2 className="home__panel-title">AI Insights</h2>
            <button className="btn btn-ghost home__panel-action" id="insights-view-all-btn">
              View all →
            </button>
          </div>
          <div className="insights-list">
            {INSIGHTS.map((insight) => (
              <div key={insight.id} className="insight-item" id={`insight-${insight.id}`}>
                <div className="insight-item__meta">
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

        {/* Quick Actions */}
        <div className="home__side">
          <div className="home__panel glass" id="quick-actions-panel">
            <div className="home__panel-header">
              <h2 className="home__panel-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              {[
                { label: 'Generate Report', icon: '▦', id: 'qa-report' },
                { label: 'Analyse Market',  icon: '◎', id: 'qa-market' },
                { label: 'Review Pipeline', icon: '◈', id: 'qa-pipeline' },
                { label: 'Team Digest',     icon: '◑', id: 'qa-team' },
              ].map((action) => (
                <button key={action.id} id={action.id} className="quick-action-btn glass">
                  <span className="quick-action-btn__icon">{action.icon}</span>
                  <span className="quick-action-btn__label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Status */}
          <div className="home__panel glass ai-status-panel" id="ai-status-panel">
            <h2 className="home__panel-title">AI Status</h2>
            <div className="ai-status">
              {[
                { label: 'Data Sources',      value: '24 connected', ok: true },
                { label: 'Models Active',     value: '3 / 3',        ok: true },
                { label: 'Last Sync',         value: '2 min ago',    ok: true },
                { label: 'Pending Decisions', value: '7 items',      ok: false },
              ].map((item, i) => (
                <div key={i} className="ai-status__row">
                  <span className="ai-status__label">{item.label}</span>
                  <span className={`ai-status__value ${item.ok ? 'ok' : 'warn'}`}>
                    {item.value}
                  </span>
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
