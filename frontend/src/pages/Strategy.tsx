import { useState } from 'react'
import './Strategy.css'

export function StrategyPage() {
  const [strategyInput, setStrategyInput] = useState({ name: 'AlphaCorp', sector: 'B2B SaaS' })
  const [strategyOutput, setStrategyOutput] = useState<any>({
    positioning: 'Executive niche positioning for "AlphaCorp". Focus marketing on ROI metrics rather than technical specs.',
    pricing: 'Recommended Tier: base pricing of $1,450/month with 15 user seats included.',
    tactics: 'Top channel priority: Direct Account-Based Marketing (ABM) via LinkedIn outreach.',
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setStrategyOutput({
        positioning: `Executive niche positioning for "${strategyInput.name}" in the ${strategyInput.sector} sector. Focus marketing on ROI metrics rather C-Suite time-savings.`,
        pricing: `Recommended Tier: base pricing of $2,490/month with 20 user seats included, scaling at $60/user/month.`,
        tactics: `Top channel priority: Direct Account-Based Marketing (ABM) via LinkedIn outreach + executive private events.`,
      })
    }, 1200)
  }

  return (
    <div className="strategy-page animate-fade-in">
      <div className="strategy-header">
        <h2 className="strategy-title">Strategy Engine ⚙️</h2>
        <p className="strategy-subtitle">AI co-pilot for market research, brand positioning, pricing recommendations, and GTM design.</p>
      </div>

      <div className="strategy-grid">
        <div className="strategy-form-panel glass">
          <h3>Configure Strategy Parameters</h3>
          <div className="form-group">
            <label>Product / Business Name</label>
            <input
              type="text"
              className="form-input"
              value={strategyInput.name}
              onChange={(e) => setStrategyInput({ ...strategyInput, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Market Sector</label>
            <select
              className="form-input"
              value={strategyInput.sector}
              onChange={(e) => setStrategyInput({ ...strategyInput, sector: e.target.value })}
            >
              <option value="B2B SaaS">B2B SaaS</option>
              <option value="FinTech">FinTech</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? 'Synthesizing Strategy...' : 'Design GTM Strategy'}
          </button>
        </div>

        <div className="strategy-output-panel glass">
          <h3>📊 AI Strategy Recommendation</h3>
          {isSimulating ? (
            <div className="loading-state">
              <div className="spinner">⬡</div>
              <span>Analyzing market data...</span>
            </div>
          ) : (
            <div className="output-content">
              <div className="output-row">
                <strong>Brand Positioning:</strong>
                <p>{strategyOutput.positioning}</p>
              </div>
              <div className="output-row">
                <strong>Pricing Suggestion:</strong>
                <p>{strategyOutput.pricing}</p>
              </div>
              <div className="output-row">
                <strong>Sales & Marketing Channels:</strong>
                <p>{strategyOutput.tactics}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrategyPage
