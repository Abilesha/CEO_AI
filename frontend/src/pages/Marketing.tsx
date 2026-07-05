import { useState } from 'react'
import './Marketing.css'

export function MarketingPage() {
  const [marketingInput, setMarketingInput] = useState({ target: 'Mid-market Enterprises', budget: '50000' })
  const [marketingOutput, setMarketingOutput] = useState<any>({
    campaignTheme: 'Unlocking Operations with Decisions',
    channels: 'LinkedIn sponsored posts (60%), Industry Podcasts (20%), Personalised Email newsletters (20%).',
    expectedROI: 'Estimated 3.4x ROI based on historical database benchmarks.',
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setMarketingOutput({
        campaignTheme: 'Next-Gen Operations: Decided by AI',
        channels: 'LinkedIn Account-Based Ads (50%), Specialized Exec Webinars (30%), Direct Executive Gifting (20%).',
        expectedROI: 'Estimated 4.1x ROI targeted at C-Suite stakeholders.',
      })
    }, 1200)
  }

  return (
    <div className="marketing-page animate-fade-in">
      <div className="marketing-header">
        <h2 className="marketing-title">Marketing Engine 📢</h2>
        <p className="marketing-subtitle">Suggest and design 360° omnichannel marketing strategies to promote the product and drive growth.</p>
      </div>

      <div className="marketing-grid">
        <div className="marketing-form-panel glass">
          <h3>Campaign Configuration</h3>
          <div className="form-group">
            <label>Target Audience</label>
            <input
              type="text"
              className="form-input"
              value={marketingInput.target}
              onChange={(e) => setMarketingInput({ ...marketingInput, target: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Campaign Budget ($)</label>
            <input
              type="number"
              className="form-input"
              value={marketingInput.budget}
              onChange={(e) => setMarketingInput({ ...marketingInput, budget: e.target.value })}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? 'Modeling Omnichannel Campaign...' : 'Generate 360° Strategy'}
          </button>
        </div>

        <div className="marketing-output-panel glass">
          <h3>📢 360° Marketing Recommendations</h3>
          {isSimulating ? (
            <div className="loading-state">
              <div className="spinner">⬡</div>
              <span>Analyzing audience profiles and channel metrics...</span>
            </div>
          ) : (
            <div className="output-content">
              <div className="output-row">
                <strong>Campaign Theme:</strong>
                <p>{marketingOutput.campaignTheme}</p>
              </div>
              <div className="output-row">
                <strong>Suggested Channel Mix:</strong>
                <p>{marketingOutput.channels}</p>
              </div>
              <div className="output-row">
                <strong>Projected ROI Focus:</strong>
                <p>{marketingOutput.expectedROI}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketingPage
