import { useState } from 'react'
import './engine-forms.css'
import './Sales.css'

const OBJECTIONS = [
  'Pricing is too high',
  'Security and Privacy concerns',
  'Integration is too complex',
  'We already have a solution',
  'Need to evaluate ROI first',
]

export function SalesPage() {
  const [dealSize, setDealSize]   = useState('15000')
  const [objection, setObjection] = useState('Pricing is too high')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    stage:       'Negotiation Playbook',
    response:    'Propose a 3-month trial period or quarterly billing milestones instead of a 12-month advance.',
    probability: '82%',
  })

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      const prob = objection.includes('Pricing') ? '91%'
        : objection.includes('Security') ? '87%'
        : objection.includes('ROI') ? '84%'
        : '79%'
      setOutput({
        stage:       'Contract Drafting / Security Signoff',
        response:    `Address objection: "${objection}" — Offer a tailored discovery call + our compliance security package highlighting zero-retention logs and private endpoints.`,
        probability: prob,
      })
    }, 1400)
  }

  const probNum = parseInt(output.probability)
  const probColor = probNum >= 90 ? '#34d399' : probNum >= 80 ? '#fbbf24' : '#f87171'

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #10b981, #34d399)',
        '--eng-glow': 'rgba(16, 185, 129, 0.15)',
        '--eng-focus-color': '#34d399',
        '--eng-focus-ring': 'rgba(16, 185, 129, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #10b981, #059669)',
        '--eng-btn-shadow': 'rgba(16, 185, 129, 0.4)',
        '--eng-chip-bg': 'rgba(16, 185, 129, 0.12)',
        '--eng-chip-color': '#34d399',
        '--eng-chip-border': 'rgba(16, 185, 129, 0.3)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">💹 Sales Engine</h2>
        <p className="engine-page-subtitle">
          Convert leads, build AI-powered sales funnels, and handle objections dynamically
          with real-time closing probability scoring.
        </p>
      </div>

      {/* Grid */}
      <div className="engine-grid">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Sales Funnel Configuration</span>

          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">💰</span>
              Estimated Deal Size
            </label>
            <div className="eng-number-wrapper">
              <span className="eng-number-prefix">$</span>
              <input
                type="number"
                className="eng-input"
                placeholder="15000"
                value={dealSize}
                onChange={e => setDealSize(e.target.value)}
              />
            </div>
            {dealSize && (
              <div className="eng-chip-row">
                <span className="eng-chip">
                  Deal Value: ${parseInt(dealSize || '0').toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">⚠️</span>
              Primary Customer Objection
            </label>
            <div className="eng-select-wrapper">
              <select
                className="eng-select"
                value={objection}
                onChange={e => setObjection(e.target.value)}
              >
                {OBJECTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="eng-chip-row">
              <span className="eng-chip">⚠️ {objection}</span>
            </div>
          </div>

          <button
            className={`eng-cta-btn${isSimulating ? ' loading' : ''}`}
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <span className="eng-cta-btn-inner">
              {isSimulating ? '⬡ Constructing Playbook...' : '💹 Build Sales Funnel'}
            </span>
          </button>
        </div>

        {/* ---- Output Panel ---- */}
        <div className="engine-output-panel">
          <div className="engine-output-title">
            💰 AI Sales Objection Playbook
          </div>

          {isSimulating ? (
            <div className="engine-loading">
              <div className="engine-loading-orb">💹</div>
              <span className="engine-loading-text">Generating rebuttal strategies and pitch layouts…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              <div className="engine-result-card">
                <span className="engine-result-label">🗂️ Recommended Funnel Stage</span>
                <p className="engine-result-value">{output.stage}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">🗣️ Objection Response Strategy</span>
                <p className="engine-result-value">{output.response}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">📊 Closing Probability</span>
                <span
                  className="engine-highlight-pill"
                  style={{
                    background: `${probColor}18`,
                    color: probColor,
                    borderColor: `${probColor}40`,
                    fontSize: '1rem',
                  }}
                >
                  🎯 {output.probability} close likelihood
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SalesPage
