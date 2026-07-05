import { useState } from 'react'
import './engine-forms.css'
import './Crisis.css'

interface RiskCategory {
  id: string
  name: string
  level: 'Low' | 'Medium' | 'High'
  indicatorColor: string
  badgeClass: string
  briefSummary: string
  metrics: string[]
  reason: string
  actions: string[]
  recovery: string
}

export function CrisisPage() {
  const [selectedRisk, setSelectedRisk] = useState<string>('lead')

  const riskCategories: RiskCategory[] = [
    {
      id: 'lead',
      name: 'Lead Pipeline Risk',
      level: 'High',
      indicatorColor: '#f87171',
      badgeClass: 'danger',
      briefSummary: 'Lead generation decreased by 18% over the past 14 days.',
      metrics: ['Website Traffic: -8%', 'Ad Click-through Rate: -14%', 'Form Submissions: -18%'],
      reason: 'Ad fatigue detected on Meta and Google display networks. The current creative assets have been running for 90+ days without updates.',
      actions: [
        'Launch WhatsApp Campaign: Re-engage top-of-funnel drops using custom template hooks.',
        'Run Retargeting Ads: Refresh ad copy focusing on compliance features.',
        'Reactivate Cold Leads: Set up an automated email discount sweep targeting leads cold for 30+ days.',
      ],
      recovery: '+11% Lead Growth (Expected recovery period: 10 days)',
    },
    {
      id: 'churn',
      name: 'Customer Churn Risk',
      level: 'Medium',
      indicatorColor: '#fbbf24',
      badgeClass: 'warning',
      briefSummary: 'Projected loss of 37 customers due to support escalations.',
      metrics: ['Support Tickets Volume: +22%', 'Negative Feedback Reviews: +5%', 'Product Usage Velocity: -4%'],
      reason: 'Onboarding bottleneck. New clients are getting stuck in the Supabase/API integration phase, causing ticket volume spikes.',
      actions: [
        'Publish Integration Guide: Email a step-by-step walkthrough detailing webhook configurations.',
        'Trigger CS Callback: Have account managers reach out to clients with tickets open for 48+ hours.',
        'Deploy Chatbot Assist: Pre-populate the Customer Success bot with API credentials guide chips.',
      ],
      recovery: '-28% Churn Reduction (Preventing loss of ~15 accounts)',
    },
    {
      id: 'revenue',
      name: 'Revenue Risk',
      level: 'Low',
      indicatorColor: '#34d399',
      badgeClass: 'success',
      briefSummary: 'Quarterly MRR growth is stable with minor regional variance.',
      metrics: ['Indian Segment ARR: +18%', 'APAC Segment ARR: +4%', 'AOV Expansion: +3%'],
      reason: 'No critical revenue leaks detected. Upsell streams in Bangalore tech corridor are offsetting minor pipeline slippages.',
      actions: [
        'Monitor Regional Volatility: Run weekly audits on APAC contract renewals.',
        'Expand AOV Bundles: Launch B2B value packs for SaaS accounts.',
      ],
      recovery: 'Maintain stable ARR trajectory (+14% QoQ target)',
    },
    {
      id: 'cashflow',
      name: 'Cash Flow Risk',
      level: 'Low',
      indicatorColor: '#34d399',
      badgeClass: 'success',
      briefSummary: 'Receivables collections are healthy; runway is comfortable.',
      metrics: ['Receivables Dues: 94% on time', 'Average Collections Period: 18 days', 'Remaining Runway: 4.2 Months'],
      reason: 'Working capital cycles are optimal. Outflows are balanced against recurring subscription cycles.',
      actions: [
        'Audit Runway Burn: Update forecast modeling values in Analytics Engine.',
        'Setup Early Invoicing: Automate invoice dispatches 5 days before payment cycles.',
      ],
      recovery: 'Extend runway to 5.5 Months',
    },
  ]

  const activeRisk = riskCategories.find(r => r.id === selectedRisk) || riskCategories[0]

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #f59e0b, #ef4444)',
        '--eng-glow': 'rgba(239, 68, 68, 0.15)',
        '--eng-focus-color': '#f87171',
        '--eng-focus-ring': 'rgba(239, 68, 68, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #f59e0b, #ef4444)',
        '--eng-btn-shadow': 'rgba(239, 68, 68, 0.45)',
        '--eng-chip-bg': 'rgba(239, 68, 68, 0.12)',
        '--eng-chip-color': '#f87171',
        '--eng-chip-border': 'rgba(239, 68, 68, 0.3)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">🛡️ AI Crisis Detector</h2>
        <p className="engine-page-subtitle">
          "Predict problems before they happen." Continuous automated auditing across marketing, sales, cash flow, and churn metrics.
        </p>
      </div>

      {/* Health Score Overview Panel */}
      <div className="crisis-hero-score glass">
        <div className="radial-score-container">
          <svg viewBox="0 0 100 100" className="radial-progress-svg">
            <circle cx="50" cy="50" r="42" className="radial-bg" />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="radial-fill animate-draw-circle"
              style={{ strokeDashoffset: `${264 - (264 * 84) / 100}` }}
            />
          </svg>
          <div className="score-inner-text">
            <span className="score-num">84</span>
            <span className="score-max">/100</span>
          </div>
        </div>
        <div className="score-analysis">
          <h3>Overall Business Health Status</h3>
          <p>
            Your organization score stands at <strong>84/100 (Strong)</strong>. The system has flagged
            <strong> 1 High Risk</strong> and <strong>1 Medium Risk</strong> across current workflows. Cash flow metrics and Revenue stability remain healthy.
          </p>
          <div className="critical-notice-badge">
            🚨 Immediate attention recommended for the Lead Generation pipeline.
          </div>
        </div>
      </div>

      <div className="crisis-layout-grid">
        {/* Left Column: Risk Cards */}
        <div className="risks-panel-list">
          {riskCategories.map(r => (
            <div
              key={r.id}
              className={`risk-category-card glass ${selectedRisk === r.id ? 'active' : ''}`}
              onClick={() => setSelectedRisk(r.id)}
            >
              <div className="risk-card-header">
                <span className="risk-card-title">{r.name}</span>
                <span className={`risk-card-badge ${r.badgeClass}`}>
                  ● {r.level} Risk
                </span>
              </div>
              <p className="risk-card-summary">{r.briefSummary}</p>
              <div className="risk-card-indicator" style={{ background: r.indicatorColor }} />
            </div>
          ))}
        </div>

        {/* Right Column: AI Action Plan */}
        <div className="engine-output-panel action-plan-panel">
          <div className="engine-output-title">
            🤖 AI Tactical Recovery Action Plan
          </div>

          <div className="action-plan-content">
            <div className="plan-header-row">
              <span className="plan-risk-name">{activeRisk.name}</span>
              <span className={`risk-badge ${activeRisk.badgeClass}`}>
                ● {activeRisk.level} Priority
              </span>
            </div>

            {/* Risk indicators list */}
            <div className="risk-indicators-box glass">
              <h5>Detected Anomalous Signals:</h5>
              <ul className="anomalous-list">
                {activeRisk.metrics.map((m, idx) => (
                  <li key={idx}>⚠️ {m}</li>
                ))}
              </ul>
            </div>

            {/* Reason */}
            <div className="engine-result-card">
              <span className="engine-result-label">🔍 Root Cause Diagnosis</span>
              <p className="engine-result-value">{activeRisk.reason}</p>
            </div>

            {/* Actions list */}
            <div className="engine-result-card">
              <span className="engine-result-label">📋 Recommended Corrective Actions</span>
              <ol className="resolution-steps" style={{ paddingLeft: '1.25rem' }}>
                {activeRisk.actions.map((act, idx) => (
                  <li key={idx} className="engine-result-value" style={{ marginTop: '4px' }}>
                    {act.includes(':') ? (
                      <>
                        <strong>{act.split(':')[0]}:</strong>
                        {act.split(':')[1]}
                      </>
                    ) : act}
                  </li>
                ))}
              </ol>
            </div>

            {/* Recovery projections */}
            <div className="engine-result-card border-left-green">
              <span className="engine-result-label" style={{ color: '#34d399' }}>🎯 Expected Recovery Plan Impact</span>
              <span className="engine-highlight-pill recovery-pill">
                🚀 {activeRisk.recovery}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrisisPage
