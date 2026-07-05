import { useState } from 'react'
import api from '@services/api'
import './engine-forms.css'
import './Sales.css'

const OBJECTIONS = [
  'Pricing is too high',
  'Security and Privacy concerns',
  'Integration is too complex',
  'We already have a solution',
  'Need to evaluate ROI first',
]

/* ---- Dynamic Chart Component ---- */
function FunnelVelocityChart({ chart }: { chart: any }) {
  if (!chart || !chart.datasets?.[0]) return null
  const dataset = chart.datasets[0]
  const maxValue = Math.max(...dataset.data, 30)

  return (
    <div className="custom-chart bar-chart-container glass animate-fade-in" style={{ marginTop: '1.5rem', width: '100%', maxWidth: 'none' }}>
      <h4 className="chart-title" style={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
        {chart.title}
      </h4>
      <div className="bar-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {chart.labels.map((label: string, idx: number) => {
          const val = dataset.data[idx] || 0
          const pct = Math.min((val / maxValue) * 100, 100)
          return (
            <div key={idx} className="bar-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="bar-label" style={{ width: '120px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {label}
              </span>
              <div className="bar-track-wrapper" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden', position: 'relative', height: '20px' }}>
                <div
                  className="bar-fill animate-grow-width"
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: dataset.color || '#34d399',
                    boxShadow: `0 0 10px ${dataset.color}44`,
                  }}
                />
                <span className="bar-value" style={{ fontSize: '10px', color: 'var(--color-text-primary)', position: 'absolute', right: '6px', fontWeight: 500 }}>
                  {val} days
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SalesPage() {
  const [dealSize, setDealSize]   = useState('15000')
  const [objection, setObjection] = useState('Pricing is too high')
  const [isSimulating, setIsSimulating] = useState(false)
  
  const [output, setOutput] = useState<any>({
    stage:       'Negotiation Playbook',
    response:    'Propose a 3-month trial period or quarterly billing milestones instead of a 12-month advance.',
    probability: '82%',
    chart: null,
    path: '',
  })

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const response = await api.post<{
        funnel_stage: string
        rebuttal_strategy: string
        closing_probability: string
        chart_data: any
        langgraph_path: string
      }>('/sales', {
        deal_size: parseFloat(dealSize || '0'),
        objection,
      })

      if (response.data) {
        setOutput({
          stage: response.data.funnel_stage,
          response: response.data.rebuttal_strategy,
          probability: response.data.closing_probability,
          chart: response.data.chart_data,
          path: response.data.langgraph_path,
        })
      }
    } catch (err) {
      console.error('Failed to run sales agent', err)
    } finally {
      setIsSimulating(false)
    }
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
          Helps to convert leads, build sales funnels, and close sales deals with automated agent checklists.
        </p>
      </div>

      {/* Grid */}
      <div className="engine-grid">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Sales Funnel Configuration</span>

          {/* Deal Size */}
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

          {/* Objection */}
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
              <span className="engine-loading-text">Constructing funnel stages and templates…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              {output.path && (
                <div className="engine-result-card" style={{ background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <span className="engine-result-label">🤖 LangGraph Agent Path</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {output.path.split(' ➔ ').map((node: string, nIdx: number, arr: string[]) => (
                      <span key={nIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-accent" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          {node}
                        </span>
                        {nIdx < arr.length - 1 && <span style={{ color: 'var(--color-text-muted)' }}>➔</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="engine-result-card">
                <span className="engine-result-label">🗂️ Recommended Funnel Stage</span>
                <p className="engine-result-value">{output.stage}</p>
              </div>

              <div className="engine-result-card">
                <span className="engine-result-label">🗣️ Objection Response Strategy</span>
                <p className="engine-result-value" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{output.response}</p>
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

              {output.chart && <FunnelVelocityChart chart={output.chart} />}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SalesPage
