import { useState, useEffect } from 'react'
import api from '@services/api'
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
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([])
  const [isAuditing, setIsAuditing] = useState(false)

  const fetchRisks = async () => {
    setIsAuditing(true)
    try {
      const response = await api.get<RiskCategory[]>('/crisis')
      if (response.data && response.data.length > 0) {
        setRiskCategories(response.data)
        // Ensure selected risk exists in returned data, otherwise default to first
        const hasRisk = response.data.some(r => r.id === selectedRisk)
        if (!hasRisk) {
          setSelectedRisk(response.data[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to run risk audit', err)
    } finally {
      setIsAuditing(false)
    }
  }

  useEffect(() => {
    fetchRisks()
  }, [])

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
          Real-time risk audit engines that scan database health, customer support backlogs, and pipeline drops.
        </p>
      </div>

      <div className="crisis-layout">

        {/* ---- Left Sidebar: Categories ---- */}
        <div className="crisis-sidebar glass">
          <div className="crisis-sidebar-header">
            <h4>Risk Categories</h4>
            <button className="btn btn-ghost btn-audit" onClick={fetchRisks} disabled={isAuditing}>
              {isAuditing ? 'Auditing...' : '↺ Audit Risks'}
            </button>
          </div>
          
          <div className="risk-selector-list">
            {riskCategories.map(risk => (
              <button
                key={risk.id}
                onClick={() => setSelectedRisk(risk.id)}
                className={`risk-selector-btn glass ${selectedRisk === risk.id ? 'active' : ''}`}
              >
                <div className="risk-selector-meta">
                  <span className="risk-name">{risk.name}</span>
                  <span className={`badge badge-${risk.badgeClass}`} style={{ fontSize: '9px' }}>
                    {risk.level}
                  </span>
                </div>
                <p className="risk-selector-summary">{risk.briefSummary}</p>
                <div className="selection-indicator" style={{ background: risk.indicatorColor }} />
              </button>
            ))}

            {riskCategories.length === 0 && (
              <div className="crisis-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                ◌ Running safety audit scan...
              </div>
            )}
          </div>
        </div>

        {/* ---- Right Panel: Risk Details ---- */}
        <div className="crisis-content-panel">
          {activeRisk ? (
            <div className="risk-details-card glass animate-fade-in" key={activeRisk.id}>
              {/* Header */}
              <div className="risk-detail-header" style={{ borderLeftColor: activeRisk.indicatorColor }}>
                <div>
                  <h3 className="risk-detail-title">{activeRisk.name}</h3>
                  <span className="risk-detail-subtitle">{activeRisk.briefSummary}</span>
                </div>
                <span className={`badge badge-${activeRisk.badgeClass} risk-level-badge`}>
                  {activeRisk.level} Risk
                </span>
              </div>

              {/* Grid sections */}
              <div className="risk-detail-grid">
                
                {/* Reason & Core Metrics */}
                <div className="risk-detail-left">
                  <div className="detail-section">
                    <h5>⚠️ Core Trigger Metrics</h5>
                    <ul className="metrics-list">
                      {activeRisk.metrics.map((m, idx) => (
                        <li key={idx} className="metric-item">{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h5>🕵️ AI Root Cause Analysis</h5>
                    <p className="reason-text">{activeRisk.reason}</p>
                  </div>
                </div>

                {/* Automated Actions & Recovery */}
                <div className="risk-detail-right">
                  <div className="detail-section">
                    <h5>🛠️ Recommended Playbooks &amp; Actions</h5>
                    <div className="actions-checklist">
                      {activeRisk.actions.map((act, idx) => (
                        <div key={idx} className="action-checkbox-row">
                          <input type="checkbox" defaultChecked className="action-checkbox" id={`act-${idx}`} />
                          <label htmlFor={`act-${idx}`} className="action-checkbox-label">{act}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section recovery-section" style={{ background: `${activeRisk.indicatorColor}0d`, borderColor: `${activeRisk.indicatorColor}22` }}>
                    <h5 style={{ color: activeRisk.indicatorColor }}>🎯 Target Recovery Milestone</h5>
                    <p className="recovery-text">{activeRisk.recovery}</p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="risk-details-placeholder glass">
              <div className="placeholder-icon">🛡️</div>
              <p>Select a risk category from the roster list to audit metrics and activate custom playbooks.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CrisisPage
