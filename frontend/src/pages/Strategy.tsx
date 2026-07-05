import { useState } from 'react'
import './engine-forms.css'
import './Strategy.css'

const SECTORS = [
  'B2B SaaS', 'EdTech', 'FinTech / NBFC', 'D2C E-Commerce',
  'Healthcare / MedTech', 'AgriTech', 'Logistics & Supply Chain',
  'Real Estate / PropTech', 'Manufacturing (MSME)', 'Retail & Kiranas',
]

const CITIES = [
  'Pan India', 'Mumbai', 'Bangalore', 'Delhi NCR',
  'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur',
]

export function StrategyPage() {
  const [name,   setName]   = useState('TechBridge India')
  const [sector, setSector] = useState('B2B SaaS')
  const [city,   setCity]   = useState('Bangalore')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    positioning: 'Position "TechBridge India" as the go-to AI decision layer for Indian B2B SaaS founders. Lead with cost savings in ₹ not USD, and highlight Tier-2 city expansion.',
    pricing:     'Recommended Tier: ₹12,000/month for Starter (10 seats), ₹28,000/month for Growth (25 seats). Offer annual plan with 2 months free.',
    tactics:     'Primary GTM: LinkedIn India outreach targeting CXOs in Bangalore & Pune tech corridor. Secondary: Startup India ecosystem events + Product Hunt India launch.',
  })

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setOutput({
        positioning: `"${name}" should target ${sector} decision-makers in ${city} — emphasise ROI in ₹ crores, GST compliance, and vernacular language support for Tier-2 reach.`,
        pricing:     `Recommended: ₹9,999/month (Starter), ₹24,999/month (Growth), ₹59,999/month (Enterprise). Add a freemium tier to capture startup founders at early stage.`,
        tactics:     `Top GTM channels for India: LinkedIn India (40%), WhatsApp Business broadcasts (30%), CII/NASSCOM events (20%), regional YouTube ads in Hindi & Tamil (10%).`,
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
      <div className="engine-page-header">
        <h2 className="engine-page-title">🧭 Strategy Engine</h2>
        <p className="engine-page-subtitle">
          AI-powered GTM strategy builder for Indian businesses — market research, brand positioning,
          ₹-based pricing, and India-specific sales & marketing playbooks.
        </p>
      </div>

      <div className="engine-grid">
        {/* Form */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Strategy Parameters</span>

          <div className="eng-field">
            <label className="eng-label"><span className="eng-label-icon">🏢</span>Business / Product Name</label>
            <input className="eng-input" type="text" placeholder="e.g. TechBridge India" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="eng-field">
            <label className="eng-label"><span className="eng-label-icon">🌐</span>Market Sector</label>
            <div className="eng-select-wrapper">
              <select className="eng-select" value={sector} onChange={e => setSector(e.target.value)}>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="eng-chip-row"><span className="eng-chip">📍 {sector}</span></div>
          </div>

          <div className="eng-field">
            <label className="eng-label"><span className="eng-label-icon">🗺️</span>Primary Target Market</label>
            <div className="eng-select-wrapper">
              <select className="eng-select" value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="eng-chip-row"><span className="eng-chip">🇮🇳 {city}</span></div>
          </div>

          <button className={`eng-cta-btn${isSimulating ? ' loading' : ''}`} onClick={handleSimulate} disabled={isSimulating}>
            <span className="eng-cta-btn-inner">
              {isSimulating ? '⬡ Synthesizing India GTM...' : '🧭 Design India GTM Strategy'}
            </span>
          </button>
        </div>

        {/* Output */}
        <div className="engine-output-panel">
          <div className="engine-output-title">📊 AI Strategy Recommendation — India</div>

          {isSimulating ? (
            <div className="engine-loading">
              <div className="engine-loading-orb">🧭</div>
              <span className="engine-loading-text">Analysing Indian market data…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              <div className="engine-result-card">
                <span className="engine-result-label">🎯 India Brand Positioning</span>
                <p className="engine-result-value">{output.positioning}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">💰 ₹ Pricing Suggestion</span>
                <p className="engine-result-value">{output.pricing}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">📣 India GTM Channels</span>
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
