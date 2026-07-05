import { useState, useMemo } from 'react'
import './engine-forms.css'
import './Simulator.css'

interface PredictionResult {
  revenueGrowth: number
  leadGrowth: number
  profitability: number
  cacChange: number
  cacValue: number
  riskLevel: 'Low' | 'Medium' | 'High'
  breakeven: number
  monthlyRevenue: number[]
}

const formatRupee = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

const formatK = (val: number) =>
  val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : val >= 1000 ? `₹${(val / 1000).toFixed(0)}K` : `₹${val}`

/* Animated bar chart component */
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="bar-chart">
      {data.map((val, i) => (
        <div key={i} className="bar-col">
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                height: `${Math.max(4, (val / max) * 100)}%`,
                background: val >= 0
                  ? `linear-gradient(180deg, ${color}, ${color}88)`
                  : `linear-gradient(180deg, #f87171, #f8717188)`,
                boxShadow: `0 0 8px ${val >= 0 ? color : '#f87171'}55`,
              }}
            />
          </div>
          <span className="bar-label">{labels[i]}</span>
          <span className="bar-val" style={{ color: val >= 0 ? color : '#f87171' }}>
            {val >= 0 ? '+' : ''}{val}%
          </span>
        </div>
      ))}
    </div>
  )
}

/* Gauge ring component */
function GaugeRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="gauge-ring-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <text x="50" y="55" textAnchor="middle" fill={color} fontSize="14" fontWeight="800" fontFamily="Outfit,sans-serif">
          {Math.round(pct)}%
        </text>
      </svg>
      <span className="gauge-label">{label}</span>
    </div>
  )
}

export function SimulatorPage() {
  const [marketingBudget, setMarketingBudget] = useState(50000)
  const [pricing, setPricing]                 = useState(9999)
  const [salesTeam, setSalesTeam]             = useState(5)
  const [supportAgents, setSupportAgents]     = useState(3)
  const [activeScenario, setActiveScenario]   = useState('C')

  const results = useMemo((): PredictionResult => {
    const budgetFactor  = marketingBudget / 50000
    const pricingFactor = pricing / 9999
    const salesFactor   = salesTeam / 5
    const supportFactor = supportAgents / 3

    const leadGrowth     = Math.round(15 + (budgetFactor - 1) * 8 - (pricingFactor - 1) * 3)
    const conversionRate = Math.round(12 + (salesFactor - 1) * 5 + (supportFactor - 1) * 2 - (pricingFactor - 1) * 4)
    const revenueGrowth  = Math.round((leadGrowth + conversionRate) * 0.7)
    const profitability  = Math.round(10 + (pricingFactor - 1) * 15 - (budgetFactor - 1) * 5 - (salesFactor - 1) * 4)

    const cacValue  = Math.round(4500 * (budgetFactor / (salesFactor || 1)))
    const cacChange = Math.round(((cacValue - 4500) / 4500) * 100)

    const riskSum = budgetFactor * 1.5 + (1 / (pricingFactor || 0.1)) + salesFactor * 1.2
    const riskLevel: 'Low' | 'Medium' | 'High' = riskSum > 7 ? 'High' : riskSum > 3.5 ? 'Medium' : 'Low'

    // Monthly revenue projection (6 months, compound-style)
    const baseRevenue = pricing * salesTeam * 12
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) =>
      Math.round(baseRevenue * (1 + (revenueGrowth / 100) * ((i + 1) / 6)))
    )

    // Breakeven month estimate
    const monthlyBurn = marketingBudget + salesTeam * 80000 + supportAgents * 45000
    const breakeven = monthlyBurn > 0 ? Math.max(1, Math.round(monthlyBurn / (pricing * salesTeam * (conversionRate / 100)))) : 1

    return {
      revenueGrowth: Math.max(-50, Math.min(250, revenueGrowth)),
      leadGrowth: Math.max(-50, Math.min(300, leadGrowth)),
      profitability: Math.max(-30, Math.min(100, profitability)),
      cacChange: Math.min(200, cacChange),
      cacValue: Math.max(800, cacValue),
      riskLevel,
      breakeven: Math.min(36, breakeven),
      monthlyRevenue,
    }
  }, [marketingBudget, pricing, salesTeam, supportAgents])

  const scenariosList = [
    {
      id: 'A', icon: '📣',
      title: 'Scenario A: Increase Ads Focus',
      description: 'Scale ad budgets to ₹1,50,000, double sales team size to 10, keep standard pricing at ₹9,999.',
      impact: 'Expected Revenue: +12%', risk: 'Medium Risk', roi: '1.4x ROI',
    },
    {
      id: 'B', icon: '🏷️',
      title: 'Scenario B: Discounted Volume Strategy',
      description: 'Slash product price to ₹6,999, double support agents to 6 to handle higher ticket volume.',
      impact: 'Expected Revenue: +8%', risk: 'High Risk (Margin compression)', roi: '1.1x ROI',
    },
    {
      id: 'C', icon: '🚀',
      title: 'Scenario C: Launch Referral Program',
      description: 'Introduce customer advocacy incentives (₹1,000 credits), keep ad spend low, hire 2 account managers.',
      impact: 'Expected Revenue: +16%', risk: 'Lowest Risk (Organic conversion)', roi: '3.6x ROI',
    },
  ]

  const handleApplyPreset = (id: string) => {
    setActiveScenario(id)
    if (id === 'A') { setMarketingBudget(150000); setPricing(9999); setSalesTeam(10); setSupportAgents(3) }
    else if (id === 'B') { setMarketingBudget(50000); setPricing(6999); setSalesTeam(5); setSupportAgents(6) }
    else { setMarketingBudget(35000); setPricing(9999); setSalesTeam(7); setSupportAgents(5) }
  }

  const currentScenario = scenariosList.find(s => s.id === activeScenario)!
  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
  const quarterlyPcts = [results.leadGrowth, results.revenueGrowth, results.profitability, -Math.abs(results.cacChange)]
  const quarterlyLabels = ['Lead', 'Revenue', 'Profit', 'CAC Δ']

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #10b981, #06b6d4)',
        '--eng-glow': 'rgba(16, 185, 129, 0.15)',
        '--eng-focus-color': '#34d399',
        '--eng-focus-ring': 'rgba(16, 185, 129, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #10b981, #06b6d4)',
        '--eng-btn-shadow': 'rgba(16, 185, 129, 0.4)',
        '--eng-chip-bg': 'rgba(16, 185, 129, 0.12)',
        '--eng-chip-color': '#34d399',
        '--eng-chip-border': 'rgba(16, 185, 129, 0.3)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">📈 Growth Simulator</h2>
        <p className="engine-page-subtitle">
          "What happens if I change my business?" Adjust operational parameters to simulate marketing, sales, and financial outcomes.
        </p>
      </div>

      <div className="simulator-main-grid">
        {/* ── LEFT: Controls ── */}
        <div className="sim-left">
          <div className="engine-form-panel sliders-panel">
            <span className="engine-form-panel-title">Interactive Business Variables</span>

            {[
              { label: '📢 Marketing Budget', emoji: '💸', value: marketingBudget, min: 10000, max: 500000, step: 5000, fmt: formatRupee, set: setMarketingBudget },
              { label: '🏷️ Product Pricing', emoji: '💰', value: pricing, min: 500, max: 50000, step: 500, fmt: formatRupee, set: setPricing },
            ].map(sl => (
              <div key={sl.label} className="slider-field">
                <div className="slider-label-row">
                  <span className="slider-label">{sl.label}</span>
                  <span className="slider-value">{sl.fmt(sl.value)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                  onChange={e => sl.set(Number(e.target.value))} className="custom-range-slider" />
                <div className="slider-limits"><span>{sl.fmt(sl.min)}</span><span>{sl.fmt(sl.max)}</span></div>
              </div>
            ))}

            {[
              { label: '👥 Sales Team Size', value: salesTeam, min: 1, max: 20, step: 1, unit: 'reps', set: setSalesTeam },
              { label: '🤝 Customer Support', value: supportAgents, min: 1, max: 15, step: 1, unit: 'agents', set: setSupportAgents },
            ].map(sl => (
              <div key={sl.label} className="slider-field">
                <div className="slider-label-row">
                  <span className="slider-label">{sl.label}</span>
                  <span className="slider-value">{sl.value} {sl.unit}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                  onChange={e => sl.set(Number(e.target.value))} className="custom-range-slider" />
                <div className="slider-limits"><span>{sl.min} {sl.unit}</span><span>{sl.max} {sl.unit}</span></div>
              </div>
            ))}
          </div>

          {/* Scenario Selector Cards */}
          <div className="scenario-cards-stack">
            <h5 className="scenarios-heading">⚡ Compare Scenarios</h5>
            {scenariosList.map(sc => (
              <button
                key={sc.id}
                className={`scenario-card-btn ${activeScenario === sc.id ? 'active' : ''}`}
                onClick={() => handleApplyPreset(sc.id)}
              >
                <span className="sc-icon">{sc.icon}</span>
                <div className="sc-body">
                  <span className="sc-title">{sc.title}</span>
                  <span className="sc-pills">
                    <span className="sc-pill">{sc.impact}</span>
                    <span className={`sc-pill ${sc.id === 'C' ? 'highlight' : ''}`}>{sc.roi}</span>
                  </span>
                </div>
                {activeScenario === sc.id && <span className="sc-active-dot" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Outputs ── */}
        <div className="sim-right">

          {/* KPI Row */}
          <div className="sim-kpi-row">
            {[
              { label: 'Revenue Growth', val: `${results.revenueGrowth >= 0 ? '+' : ''}${results.revenueGrowth}%`, pos: results.revenueGrowth >= 0, sub: 'Projected rate' },
              { label: 'Lead Growth',    val: `${results.leadGrowth >= 0 ? '+' : ''}${results.leadGrowth}%`,    pos: results.leadGrowth >= 0,    sub: 'Monthly acquisition' },
              { label: 'Net Profit',     val: `${results.profitability >= 0 ? '+' : ''}${results.profitability}%`, pos: results.profitability >= 0, sub: 'Operating margins' },
              { label: 'CAC',            val: formatK(results.cacValue), pos: results.cacChange <= 0, sub: `${Math.abs(results.cacChange)}% vs base` },
            ].map(k => (
              <div key={k.label} className="sim-kpi-card glass">
                <span className="sim-kpi-lbl">{k.label}</span>
                <span className={`sim-kpi-val ${k.pos ? 'pos' : 'neg'}`}>{k.val}</span>
                <span className="sim-kpi-sub">{k.sub}</span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="sim-charts-row">
            {/* Monthly Revenue Projection */}
            <div className="sim-chart-card glass">
              <div className="sim-chart-head">
                <span className="sim-chart-title">📅 6-Month Revenue Projection</span>
                <span className="sim-chart-badge">{formatK(results.monthlyRevenue[5])} by M6</span>
              </div>
              <div className="monthly-revenue-chart">
                {results.monthlyRevenue.map((v, i) => {
                  const max = Math.max(...results.monthlyRevenue)
                  const pct = (v / max) * 100
                  return (
                    <div key={i} className="rev-bar-col">
                      <span className="rev-bar-val">{formatK(v)}</span>
                      <div className="rev-bar-track">
                        <div
                          className="rev-bar-fill"
                          style={{
                            height: `${pct}%`,
                            background: `linear-gradient(180deg, #06b6d4, #0284c7)`,
                            boxShadow: '0 0 8px rgba(6,182,212,0.4)',
                          }}
                        />
                      </div>
                      <span className="rev-bar-label">{months[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quarterly KPI Bar Chart */}
            <div className="sim-chart-card glass">
              <div className="sim-chart-head">
                <span className="sim-chart-title">📊 Key Metrics Delta</span>
                <span className={`sim-chart-badge ${results.riskLevel.toLowerCase()}-badge`}>
                  ● {results.riskLevel} Risk
                </span>
              </div>
              <BarChart data={quarterlyPcts} labels={quarterlyLabels} color="#34d399" />
            </div>
          </div>

          {/* Gauges + Breakeven Row */}
          <div className="sim-gauges-row glass">
            <div className="sim-gauges-head">
              <span className="sim-chart-title">🎯 Performance Gauges</span>
            </div>
            <div className="sim-gauges">
              <GaugeRing value={results.revenueGrowth} max={100} color="#a78bfa" label="Revenue" />
              <GaugeRing value={results.leadGrowth} max={100} color="#22d3ee" label="Lead Gen" />
              <GaugeRing value={Math.max(0, results.profitability)} max={100} color="#34d399" label="Profitability" />
              <div className="breakeven-box">
                <span className="breakeven-num">{results.breakeven}</span>
                <span className="breakeven-unit">months</span>
                <span className="breakeven-lbl">Breakeven</span>
              </div>
            </div>
          </div>

          {/* Active Scenario Detail */}
          <div className="sim-scenario-detail glass">
            <div className="sim-scenario-header">
              <span className="sim-scenario-icon">{currentScenario.icon}</span>
              <div>
                <h4 className="sim-scenario-title">{currentScenario.title}</h4>
                <p className="sim-scenario-desc">{currentScenario.description}</p>
              </div>
            </div>
            <div className="sim-scenario-pills">
              <span className="sim-pill">{currentScenario.impact}</span>
              <span className="sim-pill">{currentScenario.risk}</span>
              <span className="sim-pill highlight">{currentScenario.roi}</span>
            </div>
            <div className="sim-best-roi">
              <span>🏆</span>
              <p><strong>Best ROI Recommendation:</strong> Scenario C (Referral Program) yields the highest returns (3.6x ROI) with the lowest risk impact.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SimulatorPage
