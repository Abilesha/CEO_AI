import { useState } from 'react'
import './engine-forms.css'
import './Analytics.css'

const BASE = [850000, 1200000, 1750000, 2400000] // ₹ values for Indian scale

export function AnalyticsPage() {
  const [range,    setRange]    = useState('12 Months')
  const [scenario, setScenario] = useState('Hyper-Growth (40%)')
  const [segment,  setSegment]  = useState('B2B SaaS India')
  const [isSimulating, setIsSimulating] = useState(false)
  const [forecastPath, setForecastPath] = useState([
    { label: 'Q1', value: 850000 },
    { label: 'Q2', value: 1200000 },
    { label: 'Q3', value: 1750000 },
    { label: 'Q4', value: 2400000 },
  ])

  const handleForecast = () => {
    setIsSimulating(true)
    setTimeout(() => {
      const m = scenario.includes('Hyper') ? 1.5 : scenario.includes('Aggressive') ? 1.25 : 1.10
      setForecastPath(BASE.map((v, i) => ({ label: `Q${i + 1}`, value: Math.round(v * m) })))
      setIsSimulating(false)
    }, 1200)
  }

  const maxVal = Math.max(...forecastPath.map(f => f.value))
  const totalARR = forecastPath.reduce((s, f) => s + f.value, 0)

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #06b6d4, #22d3ee)',
        '--eng-glow': 'rgba(6, 182, 212, 0.15)',
        '--eng-focus-color': '#22d3ee',
        '--eng-focus-ring': 'rgba(6, 182, 212, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #06b6d4, #0284c7)',
        '--eng-btn-shadow': 'rgba(6, 182, 212, 0.4)',
        '--eng-chip-bg': 'rgba(6, 182, 212, 0.12)',
        '--eng-chip-color': '#22d3ee',
        '--eng-chip-border': 'rgba(6, 182, 212, 0.3)',
      } as React.CSSProperties}
    >
      <div className="engine-page-header">
        <h2 className="engine-page-title">📊 Analytics Engine</h2>
        <p className="engine-page-subtitle">
          India business intelligence — ₹ revenue forecasting, competitive benchmarks against
          Zoho, Freshworks & Indian SaaS leaders, and AI-driven growth projections.
        </p>
      </div>

      {/* KPIs */}
      <div className="analytics__kpis">
        {[
          { label: 'India Data Points',  value: '1.2L/sec',  trend: '+18.4%', icon: '⚡', pos: true },
          { label: 'Model Accuracy',     value: '99.1%',     trend: '+0.3%',  icon: '🎯', pos: true },
          { label: 'GST Compliance API', value: '100%',      trend: '✓ Live', icon: '🏛️', pos: true },
        ].map((k, i) => (
          <div key={i} className="analytics-kpi glass">
            <div className="analytics-kpi__header">
              <span className="analytics-kpi__label">{k.label}</span>
              <span className="analytics-kpi__icon">{k.icon}</span>
            </div>
            <div className="analytics-kpi__value">{k.value}</div>
            <span className={`analytics-kpi__trend ${k.pos ? 'positive' : 'negative'}`}>
              {k.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics__charts-grid">
        <div className="analytics-chart-card glass">
          <h3 className="chart-title">India SaaS Revenue & Growth Trend (₹)</h3>
          <div className="chart-wrapper">
            <svg viewBox="0 0 500 200" className="analytics-svg">
              <defs>
                <linearGradient id="chartGlowIN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="40" y1="20"  x2="480" y2="20"  className="svg-grid-line" />
              <line x1="40" y1="70"  x2="480" y2="70"  className="svg-grid-line" />
              <line x1="40" y1="120" x2="480" y2="120" className="svg-grid-line" />
              <line x1="40" y1="170" x2="480" y2="170" className="svg-grid-line" />
              <path d="M 40 170 Q 120 110, 200 130 T 360 45 T 480 75 L 480 170 Z" fill="url(#chartGlowIN)" />
              <path d="M 40 170 Q 120 110, 200 130 T 360 45 T 480 75"
                fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" className="svg-trend-path" />
              <circle cx="150" cy="118" r="6" className="chart-dot primary" />
              <circle cx="360" cy="45"  r="6" className="chart-dot accent" />
              <circle cx="480" cy="75"  r="6" className="chart-dot success" />
              <text x="155" y="108" fill="#94a3b8" fontSize="10">₹12L</text>
              <text x="365" y="35"  fill="#94a3b8" fontSize="10">₹17.5L</text>
              <text x="445" y="65"  fill="#94a3b8" fontSize="10">₹24L</text>
            </svg>
          </div>
          <div className="chart-legend">
            <span>● ARR Growth Curve</span>
            <span>● Target Trajectory</span>
          </div>
        </div>

        <div className="analytics-chart-card glass">
          <h3 className="chart-title">India Competitor Benchmark</h3>
          <div className="chart-bar-wrapper">
            {[
              { label: 'CEO AI',    value: '94%', height: '94%' },
              { label: 'Zoho',      value: '78%', height: '78%' },
              { label: 'Freshworks',value: '72%', height: '72%' },
              { label: 'LeadSquared',value: '61%', height: '61%' },
            ].map((bar, i) => (
              <div key={i} className="chart-bar-col">
                <div className="chart-bar-container">
                  <div className="chart-bar-fill" style={{ height: bar.height }}>
                    <span className="chart-bar-val">{bar.value}</span>
                  </div>
                </div>
                <span className="chart-bar-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Console */}
      <div className="analytics__forecast-panel glass">
        <h3 className="engine-output-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          🔮 India Revenue Forecast & Market Intelligence
        </h3>

        <div className="forecast-controls-grid">
          <div className="forecast-form-col">
            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">📅</span>Forecast Horizon</label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={range} onChange={e => setRange(e.target.value)}>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                  <option value="24 Months">24 Months</option>
                </select>
              </div>
            </div>

            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">🌐</span>India Segment</label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={segment} onChange={e => setSegment(e.target.value)}>
                  {['B2B SaaS India', 'D2C E-Commerce', 'EdTech', 'FinTech / NBFC', 'Healthcare', 'AgriTech'].map(s =>
                    <option key={s} value={s}>{s}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">📈</span>Growth Target</label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={scenario} onChange={e => setScenario(e.target.value)}>
                  <option value="Conservative (10%)">Conservative (10%)</option>
                  <option value="Aggressive (25%)">Aggressive (25%)</option>
                  <option value="Hyper-Growth (40%)">Hyper-Growth (40%)</option>
                </select>
              </div>
              <div className="eng-chip-row">
                <span className="eng-chip">📅 {range}</span>
                <span className="eng-chip">📈 {scenario}</span>
                <span className="eng-chip">🇮🇳 {segment}</span>
              </div>
            </div>

            <button className={`eng-cta-btn${isSimulating ? ' loading' : ''}`} onClick={handleForecast} disabled={isSimulating}>
              <span className="eng-cta-btn-inner">
                {isSimulating ? '⬡ Computing India Projections...' : '🔮 Project ₹ Forecast Model'}
              </span>
            </button>
          </div>

          <div className="forecast-chart-panel">
            {isSimulating ? (
              <div className="engine-loading">
                <div className="engine-loading-orb">🔮</div>
                <span className="engine-loading-text">Crunching Indian market data…</span>
              </div>
            ) : (
              <div className="forecast-chart-output">
                <div className="custom-chart-wrapper">
                  {forecastPath.map((item, i) => (
                    <div key={i} className="custom-bar-col">
                      <span className="custom-bar-val">₹{(item.value / 100000).toFixed(1)}L</span>
                      <div className="custom-bar-fill-container">
                        <div className="custom-bar-fill" style={{ height: `${(item.value / (maxVal * 1.1)) * 100}%` }} />
                      </div>
                      <span className="custom-bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="engine-result-card" style={{ marginTop: '0.75rem' }}>
                  <span className="engine-result-label">🏆 India Market Intelligence</span>
                  <p className="engine-result-value">
                    Projected Annual ARR: <strong>₹{(totalARR / 100000).toFixed(1)} Lakhs</strong>. 
                    Your decision velocity is <strong>2.1×</strong> faster than Indian SaaS peers in the {segment} segment.
                    India SaaS market is projected to reach <strong>$50B by 2030</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
