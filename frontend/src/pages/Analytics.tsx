import { useState } from 'react'
import './engine-forms.css'
import './Analytics.css'

const BASE = [120000, 175000, 240000, 345000]

export function AnalyticsPage() {
  const [range,    setRange]    = useState('12 Months')
  const [scenario, setScenario] = useState('Hyper-Growth (40%)')
  const [isSimulating, setIsSimulating] = useState(false)
  const [forecastPath, setForecastPath] = useState([
    { label: 'Q1', value: 120000 },
    { label: 'Q2', value: 175000 },
    { label: 'Q3', value: 240000 },
    { label: 'Q4', value: 345000 },
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
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">📊 Analytics Engine</h2>
        <p className="engine-page-subtitle">
          AI-driven dashboards, financial forecasting models, competitive intelligence indexes,
          and real-time resource tracking.
        </p>
      </div>

      {/* KPI row */}
      <div className="analytics__kpis">
        {[
          { label: 'Data Input Rate', value: '45,280/s', trend: '+12.4%', icon: '⚡', pos: true },
          { label: 'Model Accuracy',  value: '99.4%',    trend: '+0.2%',  icon: '🎯', pos: true },
          { label: 'Token Utilization', value: '78.2%', trend: '-4.1%',  icon: '⚙️', pos: false },
        ].map((k, i) => (
          <div key={i} className="analytics-kpi glass">
            <div className="analytics-kpi__header">
              <span className="analytics-kpi__label">{k.label}</span>
              <span className="analytics-kpi__icon">{k.icon}</span>
            </div>
            <div className="analytics-kpi__value">{k.value}</div>
            <span className={`analytics-kpi__trend ${k.pos ? 'positive' : 'negative'}`}>
              {k.trend} today
            </span>
          </div>
        ))}
      </div>

      {/* SVG Charts */}
      <div className="analytics__charts-grid">
        {/* Trend */}
        <div className="analytics-chart-card glass">
          <h3 className="chart-title">Revenue &amp; Intelligence Efficiency Trend</h3>
          <div className="chart-wrapper">
            <svg viewBox="0 0 500 200" className="analytics-svg">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="40" y1="20"  x2="480" y2="20"  className="svg-grid-line" />
              <line x1="40" y1="70"  x2="480" y2="70"  className="svg-grid-line" />
              <line x1="40" y1="120" x2="480" y2="120" className="svg-grid-line" />
              <line x1="40" y1="170" x2="480" y2="170" className="svg-grid-line" />
              <path d="M 40 170 Q 120 100, 200 130 T 360 40 T 480 80 L 480 170 Z" fill="url(#chartGlow)" />
              <path d="M 40 170 Q 120 100, 200 130 T 360 40 T 480 80"
                fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round"
                className="svg-trend-path" />
              <circle cx="150" cy="112" r="6" className="chart-dot primary" />
              <circle cx="360" cy="40"  r="6" className="chart-dot accent" />
              <circle cx="480" cy="80"  r="6" className="chart-dot success" />
            </svg>
          </div>
          <div className="chart-legend">
            <span>● Operational Performance</span>
            <span>● Intelligence Target</span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="analytics-chart-card glass">
          <h3 className="chart-title">Token Utilization Breakdown</h3>
          <div className="chart-bar-wrapper">
            {[
              { label: 'GPT-4o',    value: '82%', height: '82%' },
              { label: 'Claude 3.5',value: '94%', height: '94%' },
              { label: 'DeepSeek',  value: '64%', height: '64%' },
              { label: 'Llama 3',   value: '45%', height: '45%' },
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
          🔮 AI Forecasting &amp; Competitive Insight Engine
        </h3>

        <div className="forecast-controls-grid">
          {/* Form side */}
          <div className="forecast-form-col">
            <div className="eng-field">
              <label className="eng-label">
                <span className="eng-label-icon">📅</span>
                Forecast Horizon
              </label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={range} onChange={e => setRange(e.target.value)}>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                  <option value="24 Months">24 Months</option>
                </select>
              </div>
            </div>

            <div className="eng-field">
              <label className="eng-label">
                <span className="eng-label-icon">📈</span>
                Growth Target
              </label>
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
              </div>
            </div>

            <button
              className={`eng-cta-btn${isSimulating ? ' loading' : ''}`}
              onClick={handleForecast}
              disabled={isSimulating}
            >
              <span className="eng-cta-btn-inner">
                {isSimulating ? '⬡ Computing Analysis...' : '🔮 Project Forecast Model'}
              </span>
            </button>
          </div>

          {/* Chart side */}
          <div className="forecast-chart-panel">
            {isSimulating ? (
              <div className="engine-loading">
                <div className="engine-loading-orb">🔮</div>
                <span className="engine-loading-text">Computing future projections…</span>
              </div>
            ) : (
              <div className="forecast-chart-output">
                <div className="custom-chart-wrapper">
                  {forecastPath.map((item, i) => (
                    <div key={i} className="custom-bar-col">
                      <span className="custom-bar-val">${(item.value / 1000).toFixed(0)}K</span>
                      <div className="custom-bar-fill-container">
                        <div
                          className="custom-bar-fill"
                          style={{ height: `${(item.value / (maxVal * 1.1)) * 100}%` }}
                        />
                      </div>
                      <span className="custom-bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="competitive-note engine-result-card" style={{ marginTop: '0.75rem' }}>
                  <span className="engine-result-label">🏆 Competitive Intelligence Insight</span>
                  <p className="engine-result-value">
                    Your team decision speed index is <strong>1.8×</strong> higher than average B2B
                    enterprise benchmarks for this scenario.
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
