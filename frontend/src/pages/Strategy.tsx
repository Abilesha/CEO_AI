import { useState } from 'react'
import './engine-forms.css'
import './Strategy.css'

const SECTORS = [
  'B2B SaaS', 'FinTech', 'E-Commerce', 'Healthcare',
  'EdTech', 'D2C Retail', 'PropTech', 'AgriTech',
]

export function StrategyPage() {
  const [name, setName]     = useState('AlphaCorp')
  const [sector, setSector] = useState('B2B SaaS')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    positioning: 'Executive niche positioning for "AlphaCorp". Focus marketing on ROI metrics rather than technical specs.',
    pricing:     'Recommended Tier: base pricing of $1,450/month with 15 user seats included.',
    tactics:     'Top channel priority: Direct Account-Based Marketing (ABM) via LinkedIn outreach.',
  })

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setOutput({
        positioning: `Executive niche positioning for "${name}" in the ${sector} sector. Focus on C-Suite time-savings, not feature lists.`,
        pricing:     `Recommended Tier: base pricing of $2,490/month with 20 seats. Scale at $60/user/month beyond that.`,
        tactics:     `Top channel: Direct ABM via LinkedIn + exclusive executive private events for the ${sector} vertical.`,
      })
    }, 1400)
  }

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
        '--eng-glow': 'rgba(139, 92, 246, 0.15)',
        '--eng-focus-color': '#a78bfa',
        '--eng-focus-ring': 'rgba(139, 92, 246, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        '--eng-btn-shadow': 'rgba(139, 92, 246, 0.45)',
        '--eng-chip-bg': 'rgba(139, 92, 246, 0.12)',
        '--eng-chip-color': '#a78bfa',
        '--eng-chip-border': 'rgba(139, 92, 246, 0.3)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">🧭 Strategy Engine</h2>
        <p className="engine-page-subtitle">
          AI co-pilot for market research, brand positioning, competitive pricing recommendations,
          and GTM playbook design.
        </p>
      </div>

      {/* Grid */}
      <div className="engine-grid">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Strategy Parameters</span>

          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">🏢</span>
              Product / Business Name
            </label>
            <input
              type="text"
              className="eng-input"
              placeholder="e.g. AlphaCorp"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">🌐</span>
              Market Sector
            </label>
            <div className="eng-select-wrapper">
              <select
                className="eng-select"
                value={sector}
                onChange={e => setSector(e.target.value)}
              >
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="eng-chip-row">
              <span className="eng-chip">📍 {sector}</span>
            </div>
          </div>

          <button
            className={`eng-cta-btn${isSimulating ? ' loading' : ''}`}
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <span className="eng-cta-btn-inner">
              {isSimulating ? '⬡ Synthesizing Strategy...' : '🧭 Design GTM Strategy'}
            </span>
          </button>
        </div>

        {/* ---- Output Panel ---- */}
        <div className="engine-output-panel">
          <div className="engine-output-title">
            📊 AI Strategy Recommendation
          </div>

          {isSimulating ? (
            <div className="engine-loading">
              <div className="engine-loading-orb">🧭</div>
              <span className="engine-loading-text">Analysing market data and positioning vectors…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              <div className="engine-result-card">
                <span className="engine-result-label">🎯 Brand Positioning</span>
                <p className="engine-result-value">{output.positioning}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">💲 Pricing Suggestion</span>
                <p className="engine-result-value">{output.pricing}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">📣 Sales &amp; Marketing Channels</span>
                <p className="engine-result-value">{output.tactics}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default StrategyPage
