import { useState } from 'react'
import './Sales.css'

export function SalesPage() {
  const [salesInput, setSalesInput] = useState({ dealSize: '15000', challenge: 'Pricing is too high' })
  const [salesOutput, setSalesOutput] = useState<any>({
    funnelStage: 'Negotiation Playbook',
    pitchResponse: 'Propose a 3-month trial period or quarterly billing milestones instead of a 12-month advance.',
    closingLikelihood: 'Estimated 82% closing probability.',
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setSalesOutput({
        funnelStage: 'Contract Drafting / Security Signoff',
        pitchResponse: `Address objection: "${salesInput.challenge}" by offering our compliance security package. Highlight zero-retention logs and private endpoints.`,
        closingLikelihood: 'Estimated 91% closing probability after executing this security defense.',
      })
    }, 1200)
  }

  return (
    <div className="sales-page animate-fade-in">
      <div className="sales-header">
        <h2 className="sales-title">Sales Engine 💰</h2>
        <p className="sales-subtitle">Convert leads, build sales funnels, and handle objections dynamically with the AI sales co-pilot.</p>
      </div>

      <div className="sales-grid">
        <div className="sales-form-panel glass">
          <h3>Sales Funnel Configuration</h3>
          <div className="form-group">
            <label>Estimated Deal Size ($)</label>
            <input
              type="number"
              className="form-input"
              value={salesInput.dealSize}
              onChange={(e) => setSalesInput({ ...salesInput, dealSize: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Primary Customer Objection</label>
            <select
              className="form-input"
              value={salesInput.challenge}
              onChange={(e) => setSalesInput({ ...salesInput, challenge: e.target.value })}
            >
              <option value="Pricing is too high">Pricing is too high</option>
              <option value="Security and Privacy concerns">Security and Privacy concerns</option>
              <option value="Integration is too complex">Integration is too complex</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? 'Constructing Objections Playbook...' : 'Build Sales Funnel'}
          </button>
        </div>

        <div className="sales-output-panel glass">
          <h3>💰 AI Sales Objection Playbook</h3>
          {isSimulating ? (
            <div className="loading-state">
              <div className="spinner">⬡</div>
              <span>Generating rebuttal strategies and pitch layouts...</span>
            </div>
          ) : (
            <div className="output-content">
              <div className="output-row">
                <strong>Recommended Funnel Stage:</strong>
                <p>{salesOutput.funnelStage}</p>
              </div>
              <div className="output-row">
                <strong>Objection Response Strategy:</strong>
                <p>{salesOutput.pitchResponse}</p>
              </div>
              <div className="output-row">
                <strong>Closing Probability:</strong>
                <p className="gradient-text font-bold">{salesOutput.closingLikelihood}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesPage
