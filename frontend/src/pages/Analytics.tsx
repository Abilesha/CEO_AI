import { useState } from 'react'
import './Analytics.css'

export function AnalyticsPage() {
  const [range, setRange] = useState('12 Months')
  const [scenario, setScenario] = useState('Hyper-Growth (40%)')
  const [forecastPath, setForecastPath] = useState<any[]>([
    { label: 'Q1', value: 120000 },
    { label: 'Q2', value: 175000 },
    { label: 'Q3', value: 240000 },
    { label: 'Q4', value: 345000 },
  ])
  const [isSimulating, setIsSimulating] = useState(false)

  const handleForecast = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      const multiplier = scenario.includes('Hyper') ? 1.5 : scenario.includes('Aggressive') ? 1.25 : 1.10
      setForecastPath([
        { label: 'Q1', value: Math.round(120000 * multiplier) },
        { label: 'Q2', value: Math.round(175000 * multiplier) },
        { label: 'Q3', value: Math.round(240000 * multiplier) },
        { label: 'Q4', value: Math.round(345000 * multiplier) },
      ])
    }, 1000)
  }

  return (
    <div className="analytics animate-fade-in">
      {/* Header */}
      <div className="analytics-header">
        <h2 className="analytics-title">Analytics Engine 📈</h2>
        <p className="analytics-subtitle">AI-driven dashboards, financial forecasting models, competitive intelligence indexes, and resource tracking.</p>
      </div>

      {/* Overview Cards */}
      <div className="analytics__kpis">
        {[
          { label: 'Data Input rate', value: '45,280/s', trend: '+12.4%', labelIcon: '⚡' },
          { label: 'Model Accuracy', value: '99.4%', trend: '+0.2%', labelIcon: '🎯' },
          { label: 'Token Utilization', value: '78.2%', trend: '-4.1%', labelIcon: '⚙️' },
        ].map((item, i) => (
          <div key={i} className="analytics-kpi glass">
            <div className="analytics-kpi__header">
              <span className="analytics-kpi__label">{item.label}</span>
              <span className="analytics-kpi__icon">{item.labelIcon}</span>
            </div>
            <div className="analytics-kpi__value">{item.value}</div>
            <span className={`analytics-kpi__trend ${item.trend.startsWith('+') ? 'positive' : 'negative'}`}>
              {item.trend} today
            </span>
          </div>
        ))}
      </div>

      {/* SVG Interactive Charts Grid */}
      <div className="analytics__charts-grid">
        {/* Trend Chart */}
        <div className="analytics-chart-card glass">
          <h3 className="chart-title">Revenue & Intelligence Efficiency Trend</h3>
          <div className="chart-wrapper">
            <svg viewBox="0 0 500 200" className="analytics-svg">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" className="svg-grid-line" />
              <line x1="40" y1="70" x2="480" y2="70" className="svg-grid-line" />
              <line x1="40" y1="120" x2="480" y2="120" className="svg-grid-line" />
              <line x1="40" y1="170" x2="480" y2="170" className="svg-grid-line" />

              {/* Area under curve */}
              <path d="M 40 170 Q 120 100, 200 130 T 360 40 T 480 80 L 480 170 Z" fill="url(#chartGlow)" />

              {/* Chart Line */}
              <path
                d="M 40 170 Q 120 100, 200 130 T 360 40 T 480 80"
                fill="none"
                stroke="var(--color-primary-light)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="svg-trend-path"
              />

              {/* Interactive Dots */}
              <circle cx="150" cy="112" r="6" className="chart-dot primary" />
              <circle cx="360" cy="40" r="6" className="chart-dot accent" />
              <circle cx="480" cy="80" r="6" className="chart-dot success" />
            </svg>
          </div>
          <div className="chart-legend">
            <span>● Operational Performance</span>
            <span>● Intelligence Target</span>
          </div>
        </div>

        {/* Breakdown Column Chart */}
        <div className="analytics-chart-card glass">
          <h3 className="chart-title">Token Utilization Breakdown</h3>
          <div className="chart-bar-wrapper">
            {[
              { label: 'GPT-4o', value: '82%', height: '82%' },
              { label: 'Claude 3.5', value: '94%', height: '94%' },
              { label: 'DeepSeek', value: '64%', height: '64%' },
              { label: 'Llama 3', value: '45%', height: '45%' },
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

      {/* AI Growth Forecast Console */}
      <div className="analytics__forecast-panel glass">
        <h3>🔮 AI Forecasting & Competitive Insight Engine</h3>
        <div className="forecast-controls-grid">
          <div className="forecast-form">
            <div className="form-group">
              <label>Forecast Horizon</label>
              <select className="form-input" value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
                <option value="24 Months">24 Months</option>
              </select>
            </div>
            <div className="form-group">
              <label>Growth Target</label>
              <select className="form-input" value={scenario} onChange={(e) => setScenario(e.target.value)}>
                <option value="Conservative (10%)">Conservative (10%)</option>
                <option value="Aggressive (25%)">Aggressive (25%)</option>
                <option value="Hyper-Growth (40%)">Hyper-Growth (40%)</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleForecast} disabled={isSimulating}>
              {isSimulating ? 'Computing Predictive Analysis...' : 'Project Forecast model'}
            </button>
          </div>

          <div className="forecast-chart-panel">
            {isSimulating ? (
              <div className="loading-state">
                <div className="spinner">⬡</div>
                <span>Computing future projections...</span>
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
                          style={{ height: `${(item.value / 600000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="custom-bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="competitive-note">
                  <strong>Competitive Intelligence Insight:</strong>
                  <p>Your team decision speed index is 1.8x higher than average B2B enterprise industry benchmarks for this scenario.</p>
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
